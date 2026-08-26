// Daily backup — exports every operational table to a single JSON file in the
// private "backups" Storage bucket, and records what happened in backup_log so a
// failure is visible instead of silently not happening (which is exactly what
// went unnoticed for the ~8 weeks before this was rewritten).
//
// Runs with the service_role key, so it bypasses RLS entirely by design — a
// backup job's whole point is to see everything, and it is never reachable by
// a normal client (verify_jwt is on; only a scheduled Cron Job or a manager
// through the dashboard can invoke it).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const TABLES = [
  "staff", "employees", "customers", "visits", "bookings", "services",
  "categories", "expenses", "closed_periods", "activity_log",
  "service_time_log", "settings",
];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const triggeredBy = req.headers.get("x-triggered-by") ?? "cron";
  const startedAt = new Date();

  try {
    const dump: Record<string, unknown[]> = {};
    const counts: Record<string, number> = {};

    for (const table of TABLES) {
      const { data, error } = await admin.from(table).select("*");
      if (error) throw new Error(`Reading ${table} failed: ${error.message}`);
      dump[table] = data ?? [];
      counts[table] = data?.length ?? 0;
    }

    const totalRecords = Object.values(counts).reduce((s, n) => s + n, 0);
    const filePath = `${startedAt.toISOString().slice(0, 10)}/backup-${startedAt.getTime()}.json`;

    const { error: uploadErr } = await admin.storage
      .from("backups")
      .upload(filePath, JSON.stringify(dump), {
        contentType: "application/json",
        upsert: false,
      });
    if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);

    const { error: logErr } = await admin.from("backup_log").insert({
      file_path: filePath,
      triggered_by: triggeredBy,
      record_counts: counts,
      total_records: totalRecords,
    });
    if (logErr) throw new Error(`Writing backup_log failed: ${logErr.message}`);

    return json({ ok: true, filePath, totalRecords, counts });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    // Record the failure too — a backup job that fails silently is the exact
    // problem this whole thing exists to fix.
    await admin.from("backup_log").insert({
      file_path: "(failed)",
      triggered_by: triggeredBy,
      record_counts: { error: message },
      total_records: 0,
    }).then(() => {}, () => {});
    return json({ ok: false, error: message }, 500);
  }
});
