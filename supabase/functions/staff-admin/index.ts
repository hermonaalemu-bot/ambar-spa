// Staff account administration — the one operation that genuinely needs a backend.
// Creating a login or resetting a password requires the service_role key, which must
// never be shipped to the browser. This function holds that key; the browser only ever
// holds a normal user session and asks this function to act on its behalf.
//
// Every request is re-checked here against the caller's own JWT — the manager-only
// button in the UI is a convenience, not the security boundary. This is.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const STAFF_EMAIL_DOMAIN = "staff.ambarspa.internal";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";

    // Client scoped to the caller's own session — used only to verify who they are.
    const callerClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await callerClient.auth.getUser();
    if (userErr || !userData?.user) return json({ error: "Not authenticated" }, 401);

    const { data: roleRow } = await callerClient
      .from("staff")
      .select("role,active")
      .eq("user_id", userData.user.id)
      .single();
    if (!roleRow?.active || roleRow.role !== "manager") {
      return json({ error: "Only an active manager can manage staff accounts" }, 403);
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const body = await req.json();
    const { action, id, name, role, password, active } = body ?? {};

    if (!id || typeof id !== "string") return json({ error: "Missing staff id" }, 400);
    const cleanId = id.trim().toLowerCase();
    const email = `${cleanId}@${STAFF_EMAIL_DOMAIN}`;

    if (action === "create") {
      if (!name || !role || !password) return json({ error: "Missing name, role or password" }, 400);
      const { data: existing } = await admin.from("staff").select("id").eq("id", cleanId).maybeSingle();
      if (existing) return json({ error: "That username is already taken" }, 409);

      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username: cleanId, role, name },
      });
      if (createErr) return json({ error: createErr.message }, 400);

      const { error: insErr } = await admin.from("staff").insert({
        id: cleanId, name, role, active: true, user_id: created.user.id,
      });
      if (insErr) {
        await admin.auth.admin.deleteUser(created.user.id); // roll back the orphaned auth account
        return json({ error: insErr.message }, 400);
      }
      return json({ ok: true });
    }

    if (action === "update") {
      const { data: staffRow } = await admin.from("staff").select("user_id").eq("id", cleanId).single();
      if (!staffRow?.user_id) return json({ error: "Staff account not found" }, 404);

      if (password) {
        const { error: pwErr } = await admin.auth.admin.updateUserById(staffRow.user_id, { password });
        if (pwErr) return json({ error: pwErr.message }, 400);
      }
      const patch: Record<string, unknown> = {};
      if (name) patch.name = name;
      if (role) patch.role = role;
      if (typeof active === "boolean") patch.active = active;
      if (Object.keys(patch).length) {
        const { error: updErr } = await admin.from("staff").update(patch).eq("id", cleanId);
        if (updErr) return json({ error: updErr.message }, 400);
      }
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
