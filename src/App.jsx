import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

const DEFAULT_PASSWORDS = {
  Reception: "1234", Checkout: "1234", "Service Setup": "9999",
  "Daily Closing": "9999", "Customer Database": "9999",
  "Expense Management": "9999", Payroll: "9999",
  "Manager Dashboard": "9999", "Password Manager": "9999",
};

const DEFAULT_CATEGORIES = ["Barbershop", "Beauty Salon", "Spa"];

const DEFAULT_EMPLOYEES = [
  { id: 1, name: "Andom",           section: "Barbershop",   salary: 0, absentDays: 0, loan: 0, loanNote: "", brokerFee: 0, otherDeduction: 0, otherNote: "", active: true, hireDate: "2024-01-01" },
  { id: 2, name: "Haftom",          section: "Barbershop",   salary: 0, absentDays: 0, loan: 0, loanNote: "", brokerFee: 0, otherDeduction: 0, otherNote: "", active: true, hireDate: "2024-01-01" },
  { id: 3, name: "Beauty Staff 1",  section: "Beauty Salon", salary: 0, absentDays: 0, loan: 0, loanNote: "", brokerFee: 0, otherDeduction: 0, otherNote: "", active: true, hireDate: "2024-01-01" },
  { id: 4, name: "Nail Staff 1",    section: "Beauty Salon", salary: 0, absentDays: 0, loan: 0, loanNote: "", brokerFee: 0, otherDeduction: 0, otherNote: "", active: true, hireDate: "2024-01-01" },
  { id: 5, name: "Spa Therapist 1", section: "Spa",          salary: 0, absentDays: 0, loan: 0, loanNote: "", brokerFee: 0, otherDeduction: 0, otherNote: "", active: true, hireDate: "2024-01-01" },
];

const DEFAULT_SERVICES = [
  { id: 1,  category: "Barbershop",   sub: "Hair",          name: "Adult Haircut",   price: 500,  commission: 35, employeeSection: "Barbershop" },
  { id: 2,  category: "Barbershop",   sub: "Hair",          name: "Child Haircut",   price: 300,  commission: 35, employeeSection: "Barbershop" },
  { id: 3,  category: "Barbershop",   sub: "Beard",         name: "Beard Trim",      price: 200,  commission: 35, employeeSection: "Barbershop" },
  { id: 4,  category: "Beauty Salon", sub: "Nails",         name: "ስፔሻል ፔዲኪዩር",    price: 1500, commission: 0,  employeeSection: "Beauty Salon" },
  { id: 5,  category: "Beauty Salon", sub: "Nails",         name: "ኖርማል ፔዲኪዩር",    price: 1000, commission: 0,  employeeSection: "Beauty Salon" },
  { id: 6,  category: "Beauty Salon", sub: "Nails",         name: "ማኒኪዩር",          price: 800,  commission: 0,  employeeSection: "Beauty Salon" },
  { id: 7,  category: "Beauty Salon", sub: "Nails",         name: "ጄል",              price: 1100, commission: 0,  employeeSection: "Beauty Salon" },
  { id: 8,  category: "Beauty Salon", sub: "Hair",          name: "Hair Wash",       price: 300,  commission: 0,  employeeSection: "Beauty Salon" },
  { id: 9,  category: "Beauty Salon", sub: "Braids",        name: "ስፌት",             price: 800,  commission: 10, employeeSection: "Beauty Salon" },
  { id: 10, category: "Beauty Salon", sub: "Braids",        name: "ቁጥርጥር በ1 ዊግ",   price: 800,  commission: 10, employeeSection: "Beauty Salon" },
  { id: 11, category: "Spa",          sub: "Steam & Sauna", name: "Steam",           price: 500,  commission: 0,  employeeSection: "Spa" },
  { id: 12, category: "Spa",          sub: "Steam & Sauna", name: "Sauna",           price: 500,  commission: 0,  employeeSection: "Spa" },
  { id: 13, category: "Spa",          sub: "Moroccan Bath", name: "Moroccan Bath",   price: 1800, commission: 10, employeeSection: "Spa" },
  { id: 14, category: "Spa",          sub: "Massage",       name: "Massage",         price: 1500, commission: 10, employeeSection: "Spa" },
];

function todayStr() { return new Date().toISOString().slice(0, 10); }
function money(n)   { return `${Number(n || 0).toLocaleString()} Birr`; }
function makeCustomerId(name, phone) {
  const n = (name || "CUS").replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "CUS";
  const p = (phone || "0000").replace(/\D/g, "").slice(-4) || "0000";
  return `${n}-${p}`;
}
function lineGross(line)      { return Number(line.price || 0) * Number(line.qty || 1); }
function lineIncome(line)     { if (line.free) return 0; return Math.max(0, lineGross(line) - Number(line.discount || 0)); }
function lineCommission(line) { return Math.round((lineIncome(line) * Number(line.commission || 0)) / 100); }

function getPayPeriod(dateStr) {
  const d = new Date(dateStr || todayStr());
  const day = d.getDate();
  let sy = d.getFullYear(), sm = d.getMonth();
  if (day < 11) { sm -= 1; if (sm < 0) { sm = 11; sy -= 1; } }
  const start = new Date(sy, sm, 11);
  const end   = new Date(sy, sm + 1, 10);
  const fmt   = (dt) => dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10), label: `${fmt(start)} – ${fmt(end)}` };
}

export default function App() {
  const [loading, setLoading]       = useState(true);
  const [saving,  setSaving]        = useState(false);
  const [tab,     setTab]           = useState("Supervisor");
  const [pwInput, setPwInput]       = useState("");
  const [unlocked, setUnlocked]     = useState({ Supervisor: true });
  const [passwords, setPasswords]   = useState(DEFAULT_PASSWORDS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [services,   setServices]   = useState(DEFAULT_SERVICES);
  const [employees,  setEmployees]  = useState(DEFAULT_EMPLOYEES);
  const [customers,  setCustomers]  = useState([]);
  const [visits,     setVisits]     = useState([]);
  const [expenses,   setExpenses]   = useState([]);
  const [closedPeriods, setClosedPeriods] = useState([]);

  const [rName, setRName]     = useState("");
  const [rPhone, setRPhone]   = useState("");
  const [rPeople, setRPeople] = useState(1);
  const [rNote, setRNote]     = useState("");
  const [recallMsg, setRecallMsg] = useState("");

  const [activeId,    setActiveId]    = useState(null);
  const [svCategory,  setSvCategory]  = useState(DEFAULT_CATEGORIES[0]);
  const [svSub,       setSvSub]       = useState("All");
  const [svServiceId, setSvServiceId] = useState("");

  const [coSearch,    setCoSearch]    = useState("");
  const [payMethod,   setPayMethod]   = useState("Cash");
  const [tipEmployee, setTipEmployee] = useState("");
  const [tipAmount,   setTipAmount]   = useState("");
  const [tipList,     setTipList]     = useState([]);

  const [deItemName, setDeItemName] = useState("");
  const [deQty,      setDeQty]      = useState(1);
  const [deUnit,     setDeUnit]     = useState("");

  const [genDate,   setGenDate]   = useState(todayStr());
  const [genName,   setGenName]   = useState("");
  const [genReason, setGenReason] = useState("");
  const [genAmount, setGenAmount] = useState("");

  const [newCatName, setNewCatName] = useState("");
  const [newSvc, setNewSvc]         = useState({ category: DEFAULT_CATEGORIES[0], sub: "", name: "", price: "", commission: 0, employeeSection: DEFAULT_CATEGORIES[0] });
  const [svcFilter, setSvcFilter]   = useState("All");

  const [newEmp,    setNewEmp]    = useState({ name: "", section: DEFAULT_CATEGORIES[0], salary: "", hireDate: todayStr() });
  const [showFired, setShowFired] = useState(false);
  const [pwEdit,    setPwEdit]    = useState({ ...DEFAULT_PASSWORDS });
  const [custSearch, setCustSearch] = useState("");
  const [closingDate, setClosingDate] = useState(todayStr());

  // ── Load all data from Supabase on startup ─────────────────────────────────
  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [
          { data: cats },
          { data: svcs },
          { data: emps },
          { data: custs },
          { data: vis },
          { data: exps },
          { data: settings },
          { data: periods },
        ] = await Promise.all([
          supabase.from("categories").select("*"),
          supabase.from("services").select("*"),
          supabase.from("employees").select("*"),
          supabase.from("customers").select("*"),
          supabase.from("visits").select("*").order("queue"),
          supabase.from("expenses").select("*"),
          supabase.from("settings").select("*"),
          supabase.from("closed_periods").select("*"),
        ]);

        if (cats?.length)    setCategories(cats.map((c) => c.name));
        if (svcs?.length)    setServices(svcs.map(dbToService));
        if (emps?.length)    setEmployees(emps.map(dbToEmployee));
        if (custs?.length)   setCustomers(custs.map(dbToCustomer));
        if (vis?.length)     setVisits(vis.map(dbToVisit));
        if (exps?.length)    setExpenses(exps.map(dbToExpense));
        if (periods?.length) setClosedPeriods(periods.map((p) => ({ period: p.period, start: p.start_date, end: p.end_date, closedAt: p.closed_at, employees: p.employees })));

        const pwSetting = settings?.find((s) => s.key === "passwords");
        if (pwSetting) { setPasswords(pwSetting.value); setPwEdit(pwSetting.value); }

      } catch (e) {
        console.error("Load error:", e);
      }
      setLoading(false);
    }
    loadAll();
  }, []);

  // ── DB shape converters ────────────────────────────────────────────────────
  function dbToService(r)  { return { id: r.id, category: r.category, sub: r.sub || "", name: r.name, price: Number(r.price), commission: Number(r.commission), employeeSection: r.employee_section }; }
  function dbToEmployee(r) { return { id: r.id, name: r.name, section: r.section, salary: Number(r.salary), absentDays: Number(r.absent_days), loan: Number(r.loan), loanNote: r.loan_note || "", brokerFee: Number(r.broker_fee), otherDeduction: Number(r.other_deduction), otherNote: r.other_note || "", active: r.active, hireDate: r.hire_date }; }
  function dbToCustomer(r) { return { id: r.id, name: r.name, phone: r.phone, totalVisits: Number(r.total_visits) }; }
  function dbToVisit(r)    { return { id: r.id, date: r.date, queue: r.queue, customerId: r.customer_id, name: r.name, payerName: r.payer_name, phone: r.phone, groupId: r.group_id, groupName: r.group_name || "", services: r.services || [], totalService: Number(r.total_service), totalPaid: Number(r.total_paid), paymentMethod: r.payment_method || "", tips: r.tips || [], status: r.status, note: r.note || "" }; }
  function dbToExpense(r)  { return { id: r.id, date: r.date, type: r.type, name: r.name, reason: r.reason || "", qty: Number(r.qty), unit: Number(r.unit), total: Number(r.total) }; }

  // ── Auth ───────────────────────────────────────────────────────────────────
  function tryUnlock(tabName) {
    const required = passwords[tabName];
    if (!required || pwInput === required) { setUnlocked((u) => ({ ...u, [tabName]: true })); setPwInput(""); }
    else alert("Wrong password.");
  }

  function guard(tabName, content) {
    const required = passwords[tabName];
    if (!required || unlocked[tabName]) return content;
    return (
      <section style={S.card}>
        <h2 style={S.cardTitle}>🔒 {tabName}</h2>
        <p style={S.help}>This section is password-protected.</p>
        <input style={S.input} type="password" value={pwInput} onChange={(e) => setPwInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tryUnlock(tabName)} placeholder="Enter password" autoFocus />
        <button style={S.btnPrimary} onClick={() => tryUnlock(tabName)}>Unlock</button>
      </section>
    );
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const active   = visits.find((v) => v.id === activeId) || null;
  const period   = getPayPeriod(todayStr());
  const todayVisits = visits.filter((v) => v.date === todayStr());

  const svSubs     = useMemo(() => ["All", ...new Set(services.filter((s) => s.category === svCategory).map((s) => s.sub))], [svCategory, services]);
  const svAvailSvc = services.filter((s) => s.category === svCategory && (svSub === "All" || s.sub === svSub));

  const closingVisits   = visits.filter((v) => v.date === closingDate);
  const closingExpenses = expenses.filter((e) => e.date === closingDate && e.type === "Daily Operation");
  const clCashIn     = closingVisits.filter((v) => v.status === "Paid & Closed" && v.paymentMethod === "Cash").reduce((s, v) => s + Number(v.totalPaid || 0), 0);
  const clTransferIn = closingVisits.filter((v) => v.status === "Paid & Closed" && v.paymentMethod !== "Cash").reduce((s, v) => s + Number(v.totalPaid || 0), 0);
  const clTips       = closingVisits.reduce((s, v) => s + v.tips.reduce((a, t) => a + Number(t.amount || 0), 0), 0);
  const clRevenue    = closingVisits.filter((v) => v.status === "Paid & Closed").reduce((s, v) => s + Number(v.totalService || 0), 0);
  const clDailyExp   = closingExpenses.reduce((s, e) => s + Number(e.total || 0), 0);
  const clNetCash    = clCashIn - clTips - clDailyExp;
  const clGrandTotal = clNetCash + clTransferIn;
  const clProfit     = clRevenue - clDailyExp;

  const clTipBreakdown = useMemo(() => {
    const map = {};
    closingVisits.forEach((v) => v.tips.forEach((t) => { map[t.employee] = (map[t.employee] || 0) + Number(t.amount || 0); }));
    return Object.entries(map).map(([employee, amount]) => ({ employee, amount }));
  }, [closingVisits]);

  const serviceQueues = useMemo(() => {
    const rows = [];
    visits.forEach((visit) => {
      if (["Paid & Closed", "Cancelled"].includes(visit.status)) return;
      visit.services.forEach((line) => { if (!["Completed", "Cancelled"].includes(line.status)) rows.push({ visit, line }); });
    });
    return rows;
  }, [visits]);

  const empCommissions = useMemo(() => {
    return employees.map((emp) => {
      const periodVisits = visits.filter((v) => v.date >= period.start && v.date <= period.end && v.status === "Paid & Closed");
      const lines = periodVisits.flatMap((v) => v.services).filter((l) => l.employee === emp.name && l.status !== "Cancelled");
      const breakdown = lines.map((l) => ({ name: l.name, income: lineIncome(l), commission: lineCommission(l) }));
      return { ...emp, commissionTotal: lines.reduce((s, l) => s + lineCommission(l), 0), breakdown };
    });
  }, [employees, visits, period]);

  const checkoutList = visits.filter((v) => {
    const q = coSearch.toLowerCase().trim();
    if (!q) return !["Paid & Closed", "Cancelled"].includes(v.status);
    return String(v.queue).includes(q) || v.name.toLowerCase().includes(q) || v.phone.includes(q);
  });

  const filteredCustomers = customers.filter((c) => {
    const q = custSearch.toLowerCase().trim();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.id.toLowerCase().includes(q);
  });

  // ── Reception ──────────────────────────────────────────────────────────────
  function recallByPhone() {
    const found = customers.find((c) => c.phone === rPhone.trim());
    if (found) { setRName(found.name); setRecallMsg(`✅ Found: ${found.name} — ${found.totalVisits || 0} past visits`); }
    else setRecallMsg("⚠️ No customer found with this number.");
  }

  async function register() {
    if (!rName.trim() || !rPhone.trim()) return alert("Enter customer name and phone.");
    setSaving(true);
    const count     = Math.max(1, Number(rPeople || 1));
    const groupId   = Date.now();
    const groupName = count > 1 ? `${rName.trim()} (Group of ${count})` : "";
    const custId    = makeCustomerId(rName.trim(), rPhone.trim());
    const todayCount = visits.filter((v) => v.date === todayStr()).length;

    // Upsert customer
    const found = customers.find((c) => c.phone === rPhone.trim());
    const newTotalVisits = (found?.totalVisits || 0) + 1;
    await supabase.from("customers").upsert({ id: custId, name: rName.trim(), phone: rPhone.trim(), total_visits: newTotalVisits });
    if (!found) setCustomers((p) => [...p, { id: custId, name: rName.trim(), phone: rPhone.trim(), totalVisits: newTotalVisits }]);
    else setCustomers((p) => p.map((c) => c.phone === rPhone.trim() ? { ...c, totalVisits: newTotalVisits } : c));

    // Create visits
    const newVisits = Array.from({ length: count }).map((_, i) => ({
      id: groupId + i, date: todayStr(), queue: todayCount + i + 1,
      customer_id: custId, name: count > 1 ? `${rName.trim()} ${i + 1}` : rName.trim(),
      payer_name: rName.trim(), phone: rPhone.trim(), group_id: groupId, group_name: groupName,
      services: [], total_service: 0, total_paid: 0, payment_method: "", tips: [],
      status: "Waiting for Supervisor", note: rNote,
    }));

    await supabase.from("visits").insert(newVisits);
    setVisits((p) => [...p, ...newVisits.map(dbToVisit)]);
    setRName(""); setRPhone(""); setRPeople(1); setRNote(""); setRecallMsg("");
    setSaving(false);
  }

  async function cancelVisit(id) {
    const v = visits.find((x) => x.id === id);
    if (!v) return;
    if (v.services.length > 0) return alert("Remove all services before cancelling.");
    await supabase.from("visits").delete().eq("id", id);
    setVisits((p) => p.filter((x) => x.id !== id));
    if (activeId === id) setActiveId(null);
  }

  // ── Supervisor ─────────────────────────────────────────────────────────────
  async function addService() {
    if (!active) return alert("Select a customer first.");
    const svc = services.find((s) => s.id === Number(svServiceId));
    if (!svc)  return alert("Select a service.");
    const line = { lineId: Date.now(), serviceId: svc.id, name: svc.name, category: svc.category, sub: svc.sub, price: Number(svc.price), qty: 1, discount: 0, free: false, commission: Number(svc.commission || 0), employeeSection: svc.employeeSection, employee: "", preferredEmployee: "", status: "Waiting" };
    const updated = [...active.services, line];
    const newTotal = updated.reduce((s, l) => s + lineIncome(l), 0);
    await supabase.from("visits").update({ services: updated, total_service: newTotal, status: "In Service" }).eq("id", active.id);
    setVisits((p) => p.map((v) => v.id !== active.id ? v : { ...v, services: updated, totalService: newTotal, status: "In Service" }));
    setSvServiceId("");
  }

  async function updateLine(visitId, lineId, field, value) {
    const visit = visits.find((v) => v.id === visitId);
    if (!visit) return;
    const textFields = ["employee", "preferredEmployee", "status"];
    const newVal  = textFields.includes(field) ? value : field === "free" ? value : Number(value) || 0;
    const updated = visit.services.map((l) => l.lineId !== lineId ? l : { ...l, [field]: newVal });
    const newTotal = updated.reduce((s, l) => s + lineIncome(l), 0);
    await supabase.from("visits").update({ services: updated, total_service: newTotal }).eq("id", visitId);
    setVisits((p) => p.map((v) => v.id !== visitId ? v : { ...v, services: updated, totalService: newTotal }));
  }

  async function removeLine(visitId, lineId) {
    if (!window.confirm("Remove this service?")) return;
    const visit = visits.find((v) => v.id === visitId);
    if (!visit) return;
    const updated  = visit.services.filter((l) => l.lineId !== lineId);
    const newTotal = updated.reduce((s, l) => s + lineIncome(l), 0);
    await supabase.from("visits").update({ services: updated, total_service: newTotal }).eq("id", visitId);
    setVisits((p) => p.map((v) => v.id !== visitId ? v : { ...v, services: updated, totalService: newTotal }));
  }

  async function markReadyForPayment() {
    if (!active) return;
    if (!active.services.length) return alert("No services added.");
    const pending    = active.services.find((l) => !["Completed", "Cancelled"].includes(l.status));
    if (pending)     return alert(`Mark this service Completed or Cancelled first:\n"${pending.name}"`);
    const unassigned = active.services.find((l) => l.status !== "Cancelled" && !l.employee);
    if (unassigned)  return alert(`Assign an employee for:\n"${unassigned.name}"`);
    await supabase.from("visits").update({ status: "Ready for Payment" }).eq("id", active.id);
    setVisits((p) => p.map((v) => v.id === active.id ? { ...v, status: "Ready for Payment" } : v));
  }

  async function reopenService() {
    if (!active) return;
    await supabase.from("visits").update({ status: "In Service" }).eq("id", active.id);
    setVisits((p) => p.map((v) => v.id === active.id ? { ...v, status: "In Service" } : v));
  }

  // ── Checkout ───────────────────────────────────────────────────────────────
  function addTip() {
    if (!tipEmployee || !tipAmount) return alert("Select employee and enter amount.");
    setTipList((p) => [...p, { id: Date.now(), employee: tipEmployee, amount: Number(tipAmount) }]);
    setTipEmployee(""); setTipAmount("");
  }

  async function confirmPayment(forGroup = false) {
    if (!active) return;
    const ids = forGroup && active.groupId
      ? visits.filter((v) => v.groupId === active.groupId && v.status !== "Cancelled").map((v) => v.id)
      : [active.id];
    for (const id of ids) {
      const v         = visits.find((x) => x.id === id);
      const myTips    = id === active.id ? tipList : [];
      const myTipTotal = myTips.reduce((s, t) => s + Number(t.amount || 0), 0);
      await supabase.from("visits").update({ tips: myTips, total_paid: v.totalService + myTipTotal, payment_method: payMethod, status: "Paid & Closed" }).eq("id", id);
    }
    setVisits((p) => p.map((v) => {
      if (!ids.includes(v.id)) return v;
      const myTips    = v.id === active.id ? tipList : [];
      const myTipTotal = myTips.reduce((s, t) => s + Number(t.amount || 0), 0);
      return { ...v, tips: myTips, totalPaid: v.totalService + myTipTotal, paymentMethod: payMethod, status: "Paid & Closed" };
    }));
    setTipList([]); setActiveId(null);
  }

  // ── Daily Expense ──────────────────────────────────────────────────────────
  async function addDailyExpense() {
    if (!deItemName.trim() || !deUnit) return alert("Enter item name and unit price.");
    const qty  = Math.max(1, Number(deQty || 1));
    const unit = Number(deUnit || 0);
    const row  = { id: Date.now(), date: todayStr(), type: "Daily Operation", name: deItemName, reason: "", qty, unit, total: qty * unit };
    await supabase.from("expenses").insert({ ...row });
    setExpenses((p) => [...p, row]);
    setDeItemName(""); setDeQty(1); setDeUnit("");
  }

  // ── General Expense ────────────────────────────────────────────────────────
  async function addGeneralExpense() {
    if (!genName.trim() || !genAmount) return alert("Enter name and amount.");
    const row = { id: Date.now(), date: genDate, type: "General", name: genName, reason: genReason, qty: 1, unit: Number(genAmount), total: Number(genAmount) };
    await supabase.from("expenses").insert({ ...row });
    setExpenses((p) => [...p, row]);
    setGenName(""); setGenReason(""); setGenAmount("");
  }

  async function removeExpense(id) {
    if (!window.confirm("Delete this expense?")) return;
    await supabase.from("expenses").delete().eq("id", id);
    setExpenses((p) => p.filter((e) => e.id !== id));
  }

  // ── Service Setup ──────────────────────────────────────────────────────────
  async function addCategory() {
    if (!newCatName.trim()) return;
    if (categories.includes(newCatName.trim())) return;
    await supabase.from("categories").insert({ name: newCatName.trim() });
    setCategories((p) => [...p, newCatName.trim()]);
    setNewCatName("");
  }

  async function addService2() {
    if (!newSvc.name.trim() || !newSvc.price) return alert("Enter name and price.");
    const row = { id: Date.now(), category: newSvc.category, sub: newSvc.sub, name: newSvc.name, price: Number(newSvc.price), commission: Number(newSvc.commission || 0), employee_section: newSvc.employeeSection };
    await supabase.from("services").insert(row);
    setServices((p) => [...p, { ...newSvc, id: row.id, price: Number(newSvc.price), commission: Number(newSvc.commission || 0) }]);
    setNewSvc({ category: DEFAULT_CATEGORIES[0], sub: "", name: "", price: "", commission: 0, employeeSection: DEFAULT_CATEGORIES[0] });
  }

  async function updateService(id, field, value) {
    const dbField = field === "employeeSection" ? "employee_section" : field;
    const val     = ["price", "commission"].includes(field) ? Number(value) || 0 : value;
    await supabase.from("services").update({ [dbField]: val }).eq("id", id);
    setServices((p) => p.map((s) => s.id === id ? { ...s, [field]: val } : s));
  }

  async function removeService(id) {
    if (!window.confirm("Remove this service?")) return;
    await supabase.from("services").delete().eq("id", id);
    setServices((p) => p.filter((s) => s.id !== id));
  }

  // ── Employees ──────────────────────────────────────────────────────────────
  async function addEmployee() {
    if (!newEmp.name.trim() || !newEmp.salary) return alert("Enter name and salary.");
    const row = { id: Date.now(), name: newEmp.name.trim(), section: newEmp.section, salary: Number(newEmp.salary), absent_days: 0, loan: 0, loan_note: "", broker_fee: 0, other_deduction: 0, other_note: "", active: true, hire_date: newEmp.hireDate };
    await supabase.from("employees").insert(row);
    setEmployees((p) => [...p, dbToEmployee(row)]);
    setNewEmp({ name: "", section: DEFAULT_CATEGORIES[0], salary: "", hireDate: todayStr() });
  }

  async function updateEmployee(id, field, value) {
    const dbMap = { absentDays: "absent_days", loanNote: "loan_note", brokerFee: "broker_fee", otherDeduction: "other_deduction", otherNote: "other_note", hireDate: "hire_date" };
    const dbField = dbMap[field] || field;
    const val     = ["name", "section", "hireDate", "loanNote", "otherNote"].includes(field) ? value : Number(value) || 0;
    await supabase.from("employees").update({ [dbField]: val }).eq("id", id);
    setEmployees((p) => p.map((e) => e.id === id ? { ...e, [field]: val } : e));
  }

  async function setEmployeeActive(id, active) {
    if (!window.confirm(active ? "Reactivate this employee?" : "Mark as inactive?")) return;
    await supabase.from("employees").update({ active }).eq("id", id);
    setEmployees((p) => p.map((e) => e.id === id ? { ...e, active } : e));
  }

  // ── Pay period close ───────────────────────────────────────────────────────
  async function closePayPeriod() {
    if (!window.confirm(`Close pay period "${period.label}" and freeze commissions?`)) return;
    const snapshot = empCommissions.map((e) => ({ id: e.id, name: e.name, section: e.section, salary: e.salary, commissionTotal: e.commissionTotal, absentDays: e.absentDays, loan: e.loan, brokerFee: e.brokerFee, otherDeduction: e.otherDeduction, loanNote: e.loanNote, otherNote: e.otherNote }));
    await supabase.from("closed_periods").insert({ period: period.label, start_date: period.start, end_date: period.end, closed_at: new Date().toISOString(), employees: snapshot });
    setClosedPeriods((p) => [...p, { period: period.label, start: period.start, end: period.end, closedAt: new Date().toISOString(), employees: snapshot }]);
    // Reset deductions
    for (const emp of employees) {
      await supabase.from("employees").update({ absent_days: 0, loan: 0, loan_note: "", broker_fee: 0, other_deduction: 0, other_note: "" }).eq("id", emp.id);
    }
    setEmployees((p) => p.map((e) => ({ ...e, absentDays: 0, loan: 0, loanNote: "", brokerFee: 0, otherDeduction: 0, otherNote: "" })));
    alert("Pay period closed and saved.");
  }

  // ── Passwords ──────────────────────────────────────────────────────────────
  async function savePasswords() {
    await supabase.from("settings").upsert({ key: "passwords", value: pwEdit });
    setPasswords({ ...pwEdit });
    setUnlocked({ Supervisor: true });
    alert("Passwords updated. All tabs locked.");
  }

  // ── Customer delete ────────────────────────────────────────────────────────
  async function removeCustomer(id) {
    if (!window.confirm("Delete this customer?")) return;
    await supabase.from("customers").delete().eq("id", id);
    setCustomers((p) => p.filter((c) => c.id !== id));
  }

  // ── Seed initial data if tables are empty ─────────────────────────────────
  useEffect(() => {
    async function seed() {
      const { count: catCount } = await supabase.from("categories").select("*", { count: "exact", head: true });
      if (catCount === 0) {
        await supabase.from("categories").insert(DEFAULT_CATEGORIES.map((name) => ({ name })));
        await supabase.from("services").insert(DEFAULT_SERVICES.map((s) => ({ id: s.id, category: s.category, sub: s.sub, name: s.name, price: s.price, commission: s.commission, employee_section: s.employeeSection })));
        await supabase.from("employees").insert(DEFAULT_EMPLOYEES.map((e) => ({ id: e.id, name: e.name, section: e.section, salary: e.salary, absent_days: e.absentDays, loan: e.loan, loan_note: e.loanNote, broker_fee: e.brokerFee, other_deduction: e.otherDeduction, other_note: e.otherNote, active: e.active, hire_date: e.hireDate })));
      }
    }
    seed();
  }, []);

  const todayVisitCount = todayVisits.length;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1720", color: "#e0b85a", fontSize: 22, fontFamily: "Segoe UI, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
        <div>Loading Ambar Spa...</div>
      </div>
    </div>
  );

  const dailyTabs   = ["Reception", "Supervisor", "Checkout"];
  const managerTabs = ["Service Setup", "Daily Closing", "Expense Management", "Customer Database", "Payroll", "Manager Dashboard", "Password Manager"];

  return (
    <div style={S.page}>
      {saving && <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: "#e0b85a", color: "#111827", textAlign: "center", padding: 6, fontSize: 13, fontWeight: 700, zIndex: 9999 }}>Saving...</div>}
      <div style={S.container}>
        <header style={S.header}>
          <div>
            <p style={S.kicker}>✦ AMBAR SPA & BEAUTY</p>
            <h1 style={S.title}>Salon Management System</h1>
            <p style={S.subTitle}>Reception · Service · Checkout · Payroll · Reports</p>
          </div>
          <div style={S.queueBox}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>TODAY'S NEXT</p>
            <h2 style={{ margin: "4px 0 0", fontSize: 38, fontWeight: 900 }}>#{todayVisitCount + 1}</h2>
          </div>
        </header>

        <p style={S.navLabel}>DAILY WORKFLOW</p>
        <div style={S.tabRow3}>{dailyTabs.map((x) => <button key={x} style={tab === x ? S.tabActive : S.tab} onClick={() => setTab(x)}>{passwords[x] && !unlocked[x] ? "🔒 " : ""}{x}</button>)}</div>
        <p style={S.navLabel}>MANAGEMENT</p>
        <div style={S.tabRow7}>{managerTabs.map((x) => <button key={x} style={tab === x ? S.tabActive : S.tab} onClick={() => setTab(x)}>{passwords[x] && !unlocked[x] ? "🔒 " : ""}{x}</button>)}</div>

        {tab === "Reception" && guard("Reception", (
          <main style={S.grid2}>
            <section style={S.card}>
              <h2 style={S.cardTitle}>New Customer Registration</h2>
              <p style={S.help}>Type phone number and press Recall to load returning customers.</p>
              <Label>Phone Number *</Label>
              <div style={S.row2}>
                <input style={S.input} value={rPhone} onChange={(e) => setRPhone(e.target.value)} onKeyDown={(e) => e.key === "Enter" && recallByPhone()} placeholder="e.g. 0911234567" />
                <button style={S.btnSecondary} onClick={recallByPhone}>🔍 Recall</button>
              </div>
              {recallMsg && <p style={{ fontWeight: 700, fontSize: 13, color: recallMsg.startsWith("✅") ? "#166534" : "#991b1b", marginBottom: 10 }}>{recallMsg}</p>}
              <Label>Customer Name *</Label>
              <input style={S.input} value={rName} onChange={(e) => setRName(e.target.value)} placeholder="Full name" />
              <Label>Number of People</Label>
              <input style={S.input} type="number" min="1" value={rPeople} onChange={(e) => setRPeople(e.target.value)} />
              <Label>Note (optional)</Label>
              <textarea style={S.textarea} value={rNote} onChange={(e) => setRNote(e.target.value)} />
              <button style={S.btnPrimary} onClick={register}>Register & Assign Queue Number</button>
              <Divider />
              <h3 style={{ margin: "0 0 10px" }}>Quick Daily Expense</h3>
              <input style={S.input} value={deItemName} onChange={(e) => setDeItemName(e.target.value)} placeholder="Item name, e.g. juice" />
              <div style={S.row2}>
                <input style={S.input} type="number" value={deQty} onChange={(e) => setDeQty(e.target.value)} placeholder="Qty" />
                <input style={S.input} type="number" value={deUnit} onChange={(e) => setDeUnit(e.target.value)} placeholder="Unit price" />
              </div>
              <button style={S.btnSecondary} onClick={addDailyExpense}>Save Daily Expense</button>
            </section>
            <section style={S.card}>
              <h2 style={S.cardTitle}>Live Queue — {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</h2>
              {todayVisits.length === 0 && <p style={{ ...S.help, padding: 20, textAlign: "center" }}>No customers yet today.</p>}
              {todayVisits.map((v) => (
                <div key={v.id} style={S.listItem}>
                  <div><b>#{v.queue} — {v.name}</b>{v.groupName && <p style={S.help}>{v.groupName}</p>}{v.note && <p style={S.help}>📝 {v.note}</p>}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={statusBadge(v.status)}>{v.status}</span>
                    {v.status === "Waiting for Supervisor" && v.services.length === 0 && <button style={S.btnDanger} onClick={() => cancelVisit(v.id)}>Cancel</button>}
                  </div>
                </div>
              ))}
            </section>
          </main>
        ))}

        {tab === "Supervisor" && (
          <main style={S.grid2}>
            <section style={S.card}>
              <h2 style={S.cardTitle}>Queue Overview</h2>
              <h3 style={S.subHeading}>⏳ Waiting for Service</h3>
              {visits.filter((v) => v.status === "Waiting for Supervisor" && v.date === todayStr()).length === 0
                ? <p style={S.help}>No customers waiting.</p>
                : visits.filter((v) => v.status === "Waiting for Supervisor" && v.date === todayStr()).map((v) => (
                  <button key={v.id} style={activeId === v.id ? S.listItemActive : S.listItemBtn} onClick={() => setActiveId(v.id)}>
                    <span>#{v.queue} — {v.name}</span><span style={statusBadge("Waiting for Supervisor")}>New</span>
                  </button>
                ))}
              <Divider />
              <h3 style={S.subHeading}>🔧 Active Services</h3>
              {serviceQueues.length === 0 && <p style={S.help}>No active queues.</p>}
              {services.map((svc) => {
                const rows = serviceQueues.filter((r) => r.line.serviceId === svc.id);
                if (!rows.length) return null;
                return (
                  <div key={svc.id} style={S.queueGroup}>
                    <b style={{ fontSize: 14 }}>{svc.name}</b><span style={{ ...S.help, marginLeft: 8 }}>{rows.length} in queue</span>
                    {rows.map(({ visit: vv, line }) => (
                      <button key={line.lineId} style={activeId === vv.id ? S.listItemActive : S.listItemBtn} onClick={() => setActiveId(vv.id)}>
                        <span>#{vv.queue} — {vv.name}</span><span style={statusBadge(line.status)}>{line.status}</span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </section>
            <section style={S.card}>
              {!active ? <Empty>← Select a customer to assign services.</Empty> : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div><h2 style={{ ...S.cardTitle, marginBottom: 2 }}>#{active.queue} — {active.name}</h2><p style={S.help}>{active.groupName || "Single"} · {active.status}</p></div>
                    {active.status === "Ready for Payment" && <span style={{ background: "#dcfce7", color: "#166534", borderRadius: 10, padding: "6px 14px", fontWeight: 800, fontSize: 13 }}>✅ Ready</span>}
                  </div>
                  {active.status === "Ready for Payment" && <div style={S.infoBox}>Ready for payment at Checkout.<button style={{ ...S.btnSecondary, marginTop: 8 }} onClick={reopenService}>↩ Reopen</button></div>}
                  {active.status !== "Paid & Closed" && (<>
                    <div style={S.row2}>
                      <select style={S.input} value={svCategory} onChange={(e) => { setSvCategory(e.target.value); setSvSub("All"); setSvServiceId(""); }}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
                      <select style={S.input} value={svSub} onChange={(e) => { setSvSub(e.target.value); setSvServiceId(""); }}>{svSubs.map((x) => <option key={x}>{x}</option>)}</select>
                    </div>
                    <select style={S.input} value={svServiceId} onChange={(e) => setSvServiceId(e.target.value)}>
                      <option value="">— Select service —</option>{svAvailSvc.map((s) => <option key={s.id} value={s.id}>{s.name} — {money(s.price)}</option>)}
                    </select>
                    <button style={S.btnSecondary} onClick={addService}>+ Add Service</button>
                  </>)}
                  <ServiceLines visit={active} employees={employees} mode="supervisor" onUpdateLine={(lid, f, v) => updateLine(active.id, lid, f, v)} onRemoveLine={(lid) => removeLine(active.id, lid)} />
                  {active.status !== "Paid & Closed" && active.status !== "Ready for Payment" && <button style={S.btnPrimary} onClick={markReadyForPayment}>Mark Ready for Payment →</button>}
                </>
              )}
            </section>
          </main>
        )}

        {tab === "Checkout" && guard("Checkout", (
          <main style={S.grid2}>
            <section style={S.card}>
              <h2 style={S.cardTitle}>Checkout Queue</h2>
              <input style={S.input} placeholder="Search by #, name, or phone..." value={coSearch} onChange={(e) => setCoSearch(e.target.value)} />
              {checkoutList.map((v) => (
                <button key={v.id} style={activeId === v.id ? S.listItemActive : S.listItemBtn} onClick={() => setActiveId(v.id)}>
                  <span>#{v.queue} — {v.name}</span><span style={statusBadge(v.status)}>{v.status === "Ready for Payment" ? `✅ ${money(v.totalService)}` : v.status}</span>
                </button>
              ))}
            </section>
            <section style={S.card}>
              {!active ? <Empty>← Select a customer to process payment.</Empty>
                : active.status === "Paid & Closed" ? <div style={{ ...S.infoBox, background: "#dcfce7", color: "#166534" }}>✅ Paid — {money(active.totalPaid)} via {active.paymentMethod}</div>
                : (<>
                  <h2 style={S.cardTitle}>#{active.queue} — {active.name}</h2>
                  <ServiceLines visit={active} employees={employees} mode="checkout" onUpdateLine={(lid, f, v) => updateLine(active.id, lid, f, v)} onRemoveLine={(lid) => removeLine(active.id, lid)} />
                  <Divider />
                  <h3 style={{ margin: "0 0 6px" }}>Tips</h3>
                  <div style={S.row2}>
                    <select style={S.input} value={tipEmployee} onChange={(e) => setTipEmployee(e.target.value)}>
                      <option value="">Select employee</option>{employees.filter((e) => e.active).map((e) => <option key={e.id}>{e.name}</option>)}
                    </select>
                    <input style={S.input} type="number" value={tipAmount} onChange={(e) => setTipAmount(e.target.value)} placeholder="Tip (Birr)" />
                  </div>
                  <button style={S.btnSecondary} onClick={addTip}>+ Add Tip</button>
                  {tipList.map((t) => <div key={t.id} style={S.listItem}><span>💸 {t.employee}</span><span style={{ display: "flex", alignItems: "center", gap: 8 }}><b>{money(t.amount)}</b><button style={S.btnDanger} onClick={() => setTipList((p) => p.filter((x) => x.id !== t.id))}>✕</button></span></div>)}
                  <Divider />
                  <Label>Payment Method</Label>
                  <select style={S.input} value={payMethod} onChange={(e) => setPayMethod(e.target.value)}><option>Cash</option><option>Transfer</option><option>Telebirr</option><option>Card</option></select>
                  <div style={S.totalBox}><span>Service Total</span><b>{money(active.totalService)}</b></div>
                  {tipList.length > 0 && <div style={{ ...S.totalBox, background: "#2d4a3e", marginTop: 6 }}><span>+ Tips</span><b>{money(tipList.reduce((s, t) => s + t.amount, 0))}</b></div>}
                  <div style={{ ...S.totalBox, marginTop: 6, fontSize: 18 }}><span>Customer Pays</span><b>{money(active.totalService + tipList.reduce((s, t) => s + t.amount, 0))}</b></div>
                  {active.groupName && <button style={{ ...S.btnSecondary, marginTop: 10 }} onClick={() => confirmPayment(true)}>Confirm Paid — Whole Group</button>}
                  <button style={S.btnPrimary} onClick={() => confirmPayment(false)}>✓ Confirm Paid & Close</button>
                </>)}
            </section>
          </main>
        ))}

        {tab === "Service Setup" && guard("Service Setup", (
          <section style={S.card}>
            <h2 style={S.cardTitle}>Service & Price Management</h2>
            <div style={S.grid2equal}>
              <div>
                <h3 style={S.subHeading}>Add Category</h3>
                <div style={S.row2}>
                  <input style={S.input} value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="New category" onKeyDown={(e) => e.key === "Enter" && addCategory()} />
                  <button style={S.btnSecondary} onClick={addCategory}>+ Add</button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{categories.map((c) => <span key={c} style={S.chip}>{c}</span>)}</div>
              </div>
              <div>
                <h3 style={S.subHeading}>Add New Service</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <select style={S.input} value={newSvc.category} onChange={(e) => setNewSvc({ ...newSvc, category: e.target.value, employeeSection: e.target.value })}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
                  <input style={S.input} value={newSvc.sub} onChange={(e) => setNewSvc({ ...newSvc, sub: e.target.value })} placeholder="Subcategory" />
                  <input style={{ ...S.input, gridColumn: "1/-1" }} value={newSvc.name} onChange={(e) => setNewSvc({ ...newSvc, name: e.target.value })} placeholder="Service name" />
                  <input style={S.input} type="number" value={newSvc.price} onChange={(e) => setNewSvc({ ...newSvc, price: e.target.value })} placeholder="Price (Birr)" />
                  <input style={S.input} type="number" value={newSvc.commission} onChange={(e) => setNewSvc({ ...newSvc, commission: e.target.value })} placeholder="Commission %" />
                  <button style={{ ...S.btnPrimary, gridColumn: "1/-1" }} onClick={addService2}>+ Add Service</button>
                </div>
              </div>
            </div>
            <Divider />
            <h3 style={S.subHeading}>Price List</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>{["All", ...categories].map((c) => <button key={c} style={svcFilter === c ? S.tabActive : S.tab} onClick={() => setSvcFilter(c)}>{c}</button>)}</div>
            <div style={{ display: "grid", gridTemplateColumns: "120px 110px 1fr 120px 90px 70px", gap: 6, padding: "6px 10px", background: "#f5e7c0", borderRadius: 10, marginBottom: 8, fontSize: 12, fontWeight: 800, color: "#6b4c11" }}>
              <span>Category</span><span>Sub</span><span>Name</span><span>Price</span><span>Comm%</span><span></span>
            </div>
            {(svcFilter === "All" ? services : services.filter((s) => s.category === svcFilter)).map((s) => (
              <div key={s.id} style={{ display: "grid", gridTemplateColumns: "120px 110px 1fr 120px 90px 70px", gap: 6, padding: "7px 10px", background: "#fffaf2", borderRadius: 10, marginBottom: 5, alignItems: "center", border: "1px solid #ecdba3" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#6b4c11" }}>{s.category}</span>
                <input value={s.sub}  onChange={(e) => updateService(s.id, "sub", e.target.value)}  style={S.inlineInput} />
                <input value={s.name} onChange={(e) => updateService(s.id, "name", e.target.value)} style={S.inlineInput} />
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}><input type="number" value={s.price} onChange={(e) => updateService(s.id, "price", e.target.value)} style={{ ...S.inlineInput, width: 80, textAlign: "right" }} /><span style={{ fontSize: 11, color: "#6b4c11" }}>Birr</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}><input type="number" value={s.commission} onChange={(e) => updateService(s.id, "commission", e.target.value)} style={{ ...S.inlineInput, width: 48, textAlign: "right" }} /><span style={{ fontSize: 11, color: "#6b4c11" }}>%</span></div>
                <button style={S.btnDanger} onClick={() => removeService(s.id)}>Remove</button>
              </div>
            ))}
          </section>
        ))}

        {tab === "Daily Closing" && guard("Daily Closing", (
          <section style={S.card}>
            <h2 style={S.cardTitle}>Daily Closing Report</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <Label>Report Date</Label>
              <input style={{ ...S.input, width: 180, marginBottom: 0 }} type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
              <StatCard label="Revenue"            value={money(clRevenue)} />
              <StatCard label="Cash In"            value={money(clCashIn)} />
              <StatCard label="Transfer In"        value={money(clTransferIn)} />
              <StatCard label="Tips Collected"     value={money(clTips)} />
              <StatCard label="Daily Op. Expenses" value={money(clDailyExp)} accent />
              <StatCard label="Net Cash"           value={money(clNetCash)} />
              <StatCard label="Grand Total"        value={money(clGrandTotal)} highlight />
              <StatCard label="Operating Profit"   value={money(clProfit)} highlight />
            </div>
            <p style={S.help}>Net Cash = Cash In − Tips − Daily Expenses. General/maintenance expenses are tracked separately.</p>
            <Divider />
            <h3 style={S.subHeading}>Tips Breakdown</h3>
            {clTipBreakdown.length === 0 ? <p style={S.help}>No tips recorded.</p> : clTipBreakdown.map((t) => <div key={t.employee} style={S.listItem}><span>{t.employee}</span><b>{money(t.amount)}</b></div>)}
            <Divider />
            <h3 style={S.subHeading}>Daily Operation Expenses</h3>
            {closingExpenses.length === 0 ? <p style={S.help}>None recorded.</p> : closingExpenses.map((e) => <div key={e.id} style={S.listItem}><span>{e.name} × {e.qty}</span><b>{money(e.total)}</b></div>)}
            <Divider />
            <h3 style={S.subHeading}>Paid Visits ({closingVisits.filter((v) => v.status === "Paid & Closed").length})</h3>
            {closingVisits.filter((v) => v.status === "Paid & Closed").map((v) => (
              <div key={v.id} style={S.listItem}><span>#{v.queue} — {v.name}</span><span style={{ display: "flex", gap: 12 }}><span style={S.help}>{v.paymentMethod}</span><b>{money(v.totalService)}</b></span></div>
            ))}
          </section>
        ))}

        {tab === "Expense Management" && guard("Expense Management", (
          <section style={S.card}>
            <h2 style={S.cardTitle}>Expense Management</h2>
            <h3 style={S.subHeading}>Add Expense</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div><Label>Date</Label><input style={S.input} type="date" value={genDate} onChange={(e) => setGenDate(e.target.value)} /></div>
              <div><Label>Expense Name</Label><input style={S.input} value={genName} onChange={(e) => setGenName(e.target.value)} placeholder="e.g. Shampoo restock" /></div>
              <div><Label>Reason / Details</Label><input style={S.input} value={genReason} onChange={(e) => setGenReason(e.target.value)} placeholder="e.g. Monthly restock" /></div>
              <div><Label>Amount (Birr)</Label><input style={S.input} type="number" value={genAmount} onChange={(e) => setGenAmount(e.target.value)} placeholder="0" /></div>
            </div>
            <button style={S.btnPrimary} onClick={addGeneralExpense}>Save Expense</button>
            <Divider />
            {(() => {
              const genExps = expenses.filter((e) => e.type === "General");
              const total   = genExps.reduce((s, e) => s + Number(e.total || 0), 0);
              return <div style={S.totalBox}><span>All-Time Total</span><b>{money(total)}</b></div>;
            })()}
            <Divider />
            <h3 style={S.subHeading}>All Expenses</h3>
            {expenses.filter((e) => e.type === "General").sort((a, b) => b.date.localeCompare(a.date)).map((e) => (
              <div key={e.id} style={S.listItem}>
                <div><b>{e.name}</b>{e.reason && <p style={S.help}>{e.reason}</p>}<p style={{ ...S.help, fontSize: 11 }}>{e.date}</p></div>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}><b>{money(e.total)}</b><button style={S.btnDanger} onClick={() => removeExpense(e.id)}>✕</button></span>
              </div>
            ))}
          </section>
        ))}

        {tab === "Customer Database" && guard("Customer Database", (
          <section style={S.card}>
            <h2 style={S.cardTitle}>Customer Database</h2>
            <p style={S.help}>{customers.length} registered customers</p>
            <input style={S.input} placeholder="Search by name, phone, or ID..." value={custSearch} onChange={(e) => setCustSearch(e.target.value)} />
            {filteredCustomers.map((c) => {
              const cv    = visits.filter((v) => v.customerId === c.id && v.status === "Paid & Closed");
              const all   = cv.flatMap((v) => v.services.map((s) => s.name));
              const fav   = all.length ? all.sort((a, b) => all.filter((x) => x === b).length - all.filter((x) => x === a).length)[0] : "—";
              const spent = cv.reduce((s, v) => s + Number(v.totalService || 0), 0);
              return (
                <div key={c.id} style={S.listItem}>
                  <div><b>{c.name}</b><p style={S.help}>{c.phone} · {c.id}</p><p style={S.help}>Favourite: {fav}</p></div>
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 6 }}><b>{cv.length} visits · {money(spent)}</b><button style={S.btnDanger} onClick={() => removeCustomer(c.id)}>Delete</button></div>
                </div>
              );
            })}
          </section>
        ))}

        {tab === "Payroll" && guard("Payroll", (
          <section style={S.card}>
            <h2 style={S.cardTitle}>Payroll Management</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
              <div><p style={{ ...S.help, margin: 0 }}>Current pay period</p><b style={{ fontSize: 16 }}>{period.label}</b></div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={S.btnSecondary} onClick={() => window.print()}>🖨 Print</button>
                <button style={{ ...S.btnPrimary, width: "auto", padding: "10px 20px" }} onClick={closePayPeriod}>🔒 Close & Pay Period</button>
              </div>
            </div>
            <p style={{ ...S.help, background: "#fef9ec", border: "1px solid #e0b85a", borderRadius: 10, padding: 10, marginBottom: 16 }}>
              Commissions are calculated live. Click <b>"Close & Pay Period"</b> to freeze numbers and reset deductions.
            </p>
            <h3 style={S.subHeading}>Add New Employee</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto", gap: 8, marginBottom: 20 }}>
              <input style={S.input} value={newEmp.name} onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })} placeholder="Full name" />
              <select style={S.input} value={newEmp.section} onChange={(e) => setNewEmp({ ...newEmp, section: e.target.value })}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
              <input style={S.input} type="number" value={newEmp.salary} onChange={(e) => setNewEmp({ ...newEmp, salary: e.target.value })} placeholder="Base salary" />
              <input style={S.input} type="date" value={newEmp.hireDate} onChange={(e) => setNewEmp({ ...newEmp, hireDate: e.target.value })} />
              <button style={{ ...S.btnPrimary, width: "auto", padding: "0 20px" }} onClick={addEmployee}>+ Add</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Employees — {period.label}</h3>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}><input type="checkbox" checked={showFired} onChange={(e) => setShowFired(e.target.checked)} /> Show inactive</label>
            </div>
            {employees.filter((e) => showFired || e.active).map((emp) => {
              const extra     = empCommissions.find((e) => e.id === emp.id);
              const daily     = Number(emp.salary || 0) / 30;
              const absentDed = daily * Number(emp.absentDays || 0);
              const net       = Number(emp.salary || 0) + Number(extra?.commissionTotal || 0) - Number(emp.loan || 0) - Number(emp.brokerFee || 0) - Number(emp.otherDeduction || 0) - absentDed;
              return (
                <div key={emp.id} style={{ ...S.payrollCard, opacity: emp.active ? 1 : 0.5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div><b style={{ fontSize: 16 }}>{emp.name}</b><span style={{ ...S.chip, marginLeft: 10, fontSize: 11 }}>{emp.section}</span>{!emp.active && <span style={{ ...S.chip, marginLeft: 6, background: "#fee2e2", color: "#991b1b", fontSize: 11 }}>INACTIVE</span>}</div>
                    <button style={emp.active ? S.btnDanger : S.btnSecondary} onClick={() => setEmployeeActive(emp.id, !emp.active)}>{emp.active ? "Deactivate" : "Reactivate"}</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, marginBottom: 10 }}>
                    <FieldInput label="Base Salary"     value={emp.salary}         onChange={(v) => updateEmployee(emp.id, "salary", v)}         type="number" />
                    <FieldInput label="Absent Days"     value={emp.absentDays}     onChange={(v) => updateEmployee(emp.id, "absentDays", v)}     type="number" />
                    <FieldInput label="Loan"            value={emp.loan}           onChange={(v) => updateEmployee(emp.id, "loan", v)}           type="number" note={emp.loanNote}  onNoteChange={(v) => updateEmployee(emp.id, "loanNote", v)} />
                    <FieldInput label="Broker Fee"      value={emp.brokerFee}      onChange={(v) => updateEmployee(emp.id, "brokerFee", v)}      type="number" />
                    <FieldInput label="Other Deduction" value={emp.otherDeduction} onChange={(v) => updateEmployee(emp.id, "otherDeduction", v)} type="number" note={emp.otherNote} onNoteChange={(v) => updateEmployee(emp.id, "otherNote", v)} />
                    <div style={{ background: "#fffdf5", borderRadius: 10, padding: 10, border: "1px solid #e0b85a" }}>
                      <p style={{ ...S.help, marginBottom: 4 }}>Commission</p><b style={{ color: "#166534", fontSize: 15 }}>{money(extra?.commissionTotal || 0)}</b>
                    </div>
                  </div>
                  {extra?.breakdown?.length > 0 && (
                    <details style={{ marginBottom: 10 }}>
                      <summary style={{ ...S.help, cursor: "pointer", fontWeight: 700 }}>▸ Breakdown ({extra.breakdown.length} services)</summary>
                      <div style={{ paddingLeft: 12, paddingTop: 6 }}>
                        {extra.breakdown.map((b, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#374151", borderBottom: "1px solid #ecdba3", padding: "3px 0" }}><span>{b.name}</span><span>{money(b.income)} → {money(b.commission)}</span></div>)}
                      </div>
                    </details>
                  )}
                  <div style={{ ...S.totalBox, padding: "12px 18px" }}><span>Net Pay this period</span><b style={{ fontSize: 18 }}>{money(Math.max(0, Math.round(net)))}</b></div>
                </div>
              );
            })}
            {closedPeriods.length > 0 && (<><Divider /><h3 style={S.subHeading}>Closed Period History</h3>
              {closedPeriods.slice().reverse().map((cp, i) => (
                <details key={i} style={{ ...S.listItem, display: "block", marginBottom: 8 }}>
                  <summary style={{ cursor: "pointer", fontWeight: 700 }}>{cp.period}</summary>
                  <div style={{ paddingTop: 10 }}>
                    {cp.employees.map((e) => {
                      const daily = Number(e.salary||0)/30;
                      const absDed = daily * Number(e.absentDays||0);
                      const net = Number(e.salary||0) + Number(e.commissionTotal||0) - Number(e.loan||0) - Number(e.brokerFee||0) - Number(e.otherDeduction||0) - absDed;
                      return <div key={e.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #ecdba3", fontSize: 13 }}><span><b>{e.name}</b> <span style={S.help}>({e.section})</span></span><span><b>{money(Math.max(0, Math.round(net)))}</b></span></div>;
                    })}
                  </div>
                </details>
              ))}
            </>)}
            <div className="print-only" style={{ display: "none" }}><PrintSheet employees={employees} empCommissions={empCommissions} period={period} /></div>
          </section>
        ))}

        {tab === "Manager Dashboard" && guard("Manager Dashboard", (
          <section style={S.card}>
            <h2 style={S.cardTitle}>Manager Dashboard</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
              <StatCard label="Total Visits (all time)"  value={visits.length} />
              <StatCard label="Registered Customers"     value={customers.length} />
              <StatCard label="Active Employees"         value={employees.filter((e) => e.active).length} />
              <StatCard label="Revenue Today"            value={money(todayVisits.filter((v) => v.status === "Paid & Closed").reduce((s, v) => s + Number(v.totalService||0), 0))} highlight />
            </div>
            <Divider />
            <h3 style={S.subHeading}>Commission This Period</h3>
            {empCommissions.filter((e) => e.active).map((emp) => (
              <div key={emp.id} style={S.listItem}><span>{emp.name} <span style={S.help}>({emp.section})</span></span><b style={{ color: "#166534" }}>{money(emp.commissionTotal)}</b></div>
            ))}
          </section>
        ))}

        {tab === "Password Manager" && guard("Password Manager", (
          <section style={S.card}>
            <h2 style={S.cardTitle}>Password Manager</h2>
            <p style={S.help}>Leave blank to remove password protection. All tabs lock after saving.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              {Object.keys(DEFAULT_PASSWORDS).map((tabName) => (
                <div key={tabName}><Label>{tabName}</Label><input style={S.input} type="password" value={pwEdit[tabName] || ""} onChange={(e) => setPwEdit((p) => ({ ...p, [tabName]: e.target.value }))} placeholder="Leave blank = no password" /></div>
              ))}
            </div>
            <button style={S.btnPrimary} onClick={savePasswords}>💾 Save All Passwords</button>
          </section>
        ))}
      </div>
      <style>{`@media print { .no-print{display:none!important} .print-only{display:block!important} body{background:white!important} }`}</style>
    </div>
  );
}

function ServiceLines({ visit, employees, mode, onUpdateLine, onRemoveLine }) {
  const isSupervisor = mode === "supervisor";
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ margin: "16px 0 10px" }}>Services</h3>
      {visit.services.length === 0 && <p style={{ color: "#6b4c11", fontSize: 13 }}>No services added yet.</p>}
      {visit.services.map((line) => {
        const eligible = employees.filter((e) => e.section === line.employeeSection && e.active);
        return (
          <div key={line.lineId} style={{ background: "#fffaf2", border: "1px solid #ecdba3", borderRadius: 14, padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <b>{line.name}</b>
                <p style={{ color: "#6b4c11", fontSize: 12, margin: "2px 0" }}>{line.category} · {line.sub}</p>
                <p style={{ color: "#6b4c11", fontSize: 12, margin: "2px 0" }}>{isSupervisor ? `${money(line.price)} × ${line.qty} = ${money(lineGross(line))}` : `Gross: ${money(lineGross(line))} → Income: ${money(lineIncome(line))}`}</p>
                {line.commission > 0 && <p style={{ color: "#166534", fontSize: 12, margin: "2px 0" }}>Commission: {line.commission}% = {money(lineCommission(line))}</p>}
              </div>
              <button style={{ padding: "5px 10px", borderRadius: 8, border: 0, background: "#ffe3de", color: "#8a1f12", fontWeight: 800, cursor: "pointer", fontSize: 12 }} onClick={() => onRemoveLine(line.lineId)}>Remove</button>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div><p style={{ fontSize: 11, fontWeight: 700, color: "#6b4c11", margin: "0 0 3px" }}>Qty</p><input style={{ width: 70, padding: "7px 9px", borderRadius: 8, border: "1px solid #c7b06a", background: "#fff", fontSize: 13 }} type="number" min="1" value={line.qty} onChange={(e) => onUpdateLine(line.lineId, "qty", e.target.value)} /></div>
              {!isSupervisor && (<>
                <div><p style={{ fontSize: 11, fontWeight: 700, color: "#6b4c11", margin: "0 0 3px" }}>Discount</p><input style={{ width: 90, padding: "7px 9px", borderRadius: 8, border: "1px solid #c7b06a", background: "#fff", fontSize: 13 }} type="number" value={line.discount} onChange={(e) => onUpdateLine(line.lineId, "discount", e.target.value)} /></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}><p style={{ fontSize: 11, fontWeight: 700, color: "#6b4c11", margin: 0 }}>Free</p><input type="checkbox" checked={line.free} onChange={(e) => onUpdateLine(line.lineId, "free", e.target.checked)} style={{ width: 18, height: 18 }} /></div>
              </>)}
              <div><p style={{ fontSize: 11, fontWeight: 700, color: "#6b4c11", margin: "0 0 3px" }}>Preferred</p><select style={{ padding: "7px 9px", borderRadius: 8, border: "1px solid #c7b06a", background: "#fff", fontSize: 13 }} value={line.preferredEmployee} onChange={(e) => onUpdateLine(line.lineId, "preferredEmployee", e.target.value)}><option value="">— none —</option>{eligible.map((e) => <option key={e.id}>{e.name}</option>)}</select></div>
              <div><p style={{ fontSize: 11, fontWeight: 700, color: "#6b4c11", margin: "0 0 3px" }}>Who Did It?</p><select style={{ padding: "7px 9px", borderRadius: 8, border: "1px solid #c7b06a", background: "#fff", fontSize: 13 }} value={line.employee} onChange={(e) => onUpdateLine(line.lineId, "employee", e.target.value)}><option value="">— select —</option>{eligible.map((e) => <option key={e.id}>{e.name}</option>)}</select></div>
              <div><p style={{ fontSize: 11, fontWeight: 700, color: "#6b4c11", margin: "0 0 3px" }}>Status</p><select style={{ padding: "7px 9px", borderRadius: 8, border: "1px solid #c7b06a", background: "#fff", fontSize: 13 }} value={line.status} onChange={(e) => onUpdateLine(line.lineId, "status", e.target.value)}><option>Waiting</option><option>In Progress</option><option>Completed</option><option>Cancelled</option></select></div>
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", background: "#111827", color: "#e0b85a", padding: "13px 18px", borderRadius: 14, marginTop: 8 }}><span>Total Income</span><b>{money(visit.totalService)}</b></div>
    </div>
  );
}

function PrintSheet({ employees, empCommissions, period }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 32 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}><h1 style={{ margin: 0 }}>Ambar Spa & Beauty</h1><h2 style={{ margin: "4px 0 0", fontWeight: 400 }}>Payroll — {period.label}</h2><p style={{ fontSize: 12, color: "#666" }}>Printed: {new Date().toLocaleString()}</p></div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead><tr style={{ background: "#e0b85a" }}>{["Employee","Section","Base Salary","Commission","Absent Ded.","Loan","Broker Fee","Other","NET PAY"].map((h) => <th key={h} style={{ border: "1px solid #999", padding: "8px 10px", textAlign: "left" }}>{h}</th>)}</tr></thead>
        <tbody>{employees.filter((e) => e.active).map((emp, i) => {
          const extra  = empCommissions.find((e) => e.id === emp.id);
          const daily  = Number(emp.salary||0)/30;
          const absDed = daily * Number(emp.absentDays||0);
          const net    = Number(emp.salary||0)+Number(extra?.commissionTotal||0)-Number(emp.loan||0)-Number(emp.brokerFee||0)-Number(emp.otherDeduction||0)-absDed;
          return <tr key={emp.id} style={{ background: i%2===0?"#fff":"#fffaf2" }}><td style={{ border:"1px solid #ddd",padding:"7px 10px" }}>{emp.name}</td><td style={{ border:"1px solid #ddd",padding:"7px 10px" }}>{emp.section}</td><td style={{ border:"1px solid #ddd",padding:"7px 10px" }}>{Number(emp.salary||0).toLocaleString()}</td><td style={{ border:"1px solid #ddd",padding:"7px 10px" }}>{Number(extra?.commissionTotal||0).toLocaleString()}</td><td style={{ border:"1px solid #ddd",padding:"7px 10px" }}>{Math.round(absDed).toLocaleString()}</td><td style={{ border:"1px solid #ddd",padding:"7px 10px" }}>{Number(emp.loan||0).toLocaleString()}</td><td style={{ border:"1px solid #ddd",padding:"7px 10px" }}>{Number(emp.brokerFee||0).toLocaleString()}</td><td style={{ border:"1px solid #ddd",padding:"7px 10px" }}>{Number(emp.otherDeduction||0).toLocaleString()}</td><td style={{ border:"1px solid #ddd",padding:"7px 10px",fontWeight:700,background:"#fff9e6" }}>{Math.max(0,Math.round(net)).toLocaleString()} Birr</td></tr>;
        })}</tbody>
      </table>
      <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }}>{["Prepared by","Reviewed by","Approved by"].map((l) => <div key={l} style={{ borderTop: "1px solid #000", paddingTop: 6, fontSize: 12 }}>{l}</div>)}</div>
    </div>
  );
}

function Label({ children }) { return <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "#6b4c11" }}>{children}</p>; }
function Divider() { return <hr style={{ border: 0, borderTop: "1px solid #ecdba3", margin: "20px 0" }} />; }
function Empty({ children }) { return <div style={{ padding: 48, textAlign: "center", color: "#9ca3af", fontSize: 15 }}>{children}</div>; }
function StatCard({ label, value, highlight, accent }) {
  return <div style={{ background: highlight ? "#111827" : accent ? "#fff5f5" : "#fff", color: highlight ? "#e0b85a" : "#111827", borderRadius: 16, padding: "14px 16px", border: `1px solid ${highlight ? "transparent" : accent ? "#fca5a5" : "#e6c977"}` }}><p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: highlight ? "#e0b85a" : accent ? "#b91c1c" : "#6b4c11" }}>{label}</p><h3 style={{ margin: "4px 0 0", fontSize: 17, fontWeight: 900 }}>{value}</h3></div>;
}
function FieldInput({ label, value, onChange, type = "text", note, onNoteChange }) {
  return <div><p style={{ fontSize: 11, fontWeight: 700, color: "#6b4c11", margin: "0 0 3px" }}>{label}</p><input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", borderRadius: 10, border: "1px solid #c7b06a", background: "#fff", fontSize: 13 }} />{onNoteChange !== undefined && <input type="text" value={note||""} onChange={(e) => onNoteChange(e.target.value)} placeholder="Note/reason" style={{ width: "100%", boxSizing: "border-box", padding: "5px 8px", borderRadius: 8, border: "1px solid #e0d4a0", background: "#fffdf7", fontSize: 11, marginTop: 3 }} />}</div>;
}
function statusBadge(status) {
  const map = { "Waiting for Supervisor":{ background:"#fef3c7",color:"#92400e" }, "In Service":{ background:"#dbeafe",color:"#1e40af" }, "Ready for Payment":{ background:"#dcfce7",color:"#166534" }, "Paid & Closed":{ background:"#f0fdf4",color:"#166534" }, "Waiting":{ background:"#fef9c3",color:"#854d0e" }, "In Progress":{ background:"#dbeafe",color:"#1e3a8a" }, "Completed":{ background:"#dcfce7",color:"#14532d" }, "Cancelled":{ background:"#fee2e2",color:"#991b1b" } };
  return { borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", ...(map[status]||{ background:"#f3f4f6",color:"#374151" }) };
}

const S = {
  page:         { minHeight:"100vh",padding:28,background:"linear-gradient(135deg,#0f1720 0%,#1d2a36 38%,#f6efe3 38%,#fffaf2 100%)",fontFamily:"'Segoe UI',Arial,sans-serif",color:"#111827" },
  container:    { maxWidth:1400,margin:"0 auto" },
  header:       { display:"flex",justifyContent:"space-between",alignItems:"flex-start",color:"white",marginBottom:20 },
  kicker:       { color:"#e0b85a",fontWeight:900,letterSpacing:2,margin:"0 0 4px",fontSize:12 },
  title:        { margin:0,fontSize:34,fontWeight:900 },
  subTitle:     { color:"#f8ead4",fontSize:13,margin:"6px 0 0" },
  queueBox:     { background:"#e0b85a",color:"#111827",borderRadius:20,padding:"14px 22px",textAlign:"center",minWidth:130 },
  navLabel:     { color:"#c9b077",margin:"16px 0 6px",fontSize:11,fontWeight:800,letterSpacing:1.5 },
  tabRow3:      { display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:8 },
  tabRow7:      { display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8,marginBottom:18 },
  tab:          { padding:"10px 4px",borderRadius:12,border:"1px solid #e0b85a",background:"#fff",color:"#111827",fontWeight:700,cursor:"pointer",fontSize:12 },
  tabActive:    { padding:"10px 4px",borderRadius:12,border:"none",background:"#e0b85a",color:"#111827",fontWeight:900,cursor:"pointer",fontSize:12 },
  card:         { background:"#fff",color:"#111827",borderRadius:22,padding:24,border:"1px solid #e6c977",boxShadow:"0 10px 32px rgba(0,0,0,0.09)",marginBottom:18 },
  cardTitle:    { margin:"0 0 16px",fontSize:20,fontWeight:900 },
  subHeading:   { margin:"0 0 10px",fontSize:14,fontWeight:800,color:"#6b4c11" },
  input:        { width:"100%",boxSizing:"border-box",padding:"10px 12px",marginBottom:10,borderRadius:11,border:"1px solid #c7b06a",background:"#fffdf7",color:"#111827",fontSize:14 },
  inlineInput:  { padding:"6px 9px",borderRadius:8,border:"1px solid #c7b06a",background:"#fffdf7",color:"#111827",fontSize:13,width:"100%",boxSizing:"border-box" },
  textarea:     { width:"100%",boxSizing:"border-box",padding:"10px 12px",marginBottom:10,borderRadius:11,border:"1px solid #c7b06a",background:"#fffdf7",color:"#111827",minHeight:70,fontSize:14 },
  row2:         { display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 },
  grid2:        { display:"grid",gridTemplateColumns:"1fr 1.15fr",gap:18 },
  grid2equal:   { display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:16 },
  btnPrimary:   { width:"100%",padding:13,borderRadius:12,border:0,background:"#e0b85a",color:"#111827",fontWeight:900,cursor:"pointer",fontSize:14,marginBottom:8 },
  btnSecondary: { width:"100%",padding:11,borderRadius:12,border:"1px solid #e0b85a",background:"#fff4d8",color:"#111827",fontWeight:700,cursor:"pointer",marginBottom:8,fontSize:13 },
  btnDanger:    { padding:"6px 12px",borderRadius:8,border:0,background:"#ffe3de",color:"#8a1f12",fontWeight:800,cursor:"pointer",fontSize:12 },
  listItem:     { display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",background:"#fffaf2",border:"1px solid #ecdba3",color:"#111827",borderRadius:12,padding:"10px 14px",marginBottom:6 },
  listItemBtn:  { display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",background:"#fffaf2",border:"1px solid #ecdba3",color:"#111827",borderRadius:12,padding:"10px 14px",marginBottom:6,width:"100%",cursor:"pointer",textAlign:"left" },
  listItemActive:{ display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",background:"#111827",border:"none",color:"#e0b85a",borderRadius:12,padding:"10px 14px",marginBottom:6,width:"100%",cursor:"pointer",fontWeight:900,textAlign:"left" },
  queueGroup:   { background:"#fefaf0",border:"1px solid #ecdba3",borderRadius:14,padding:12,marginBottom:10 },
  totalBox:     { display:"flex",justifyContent:"space-between",alignItems:"center",background:"#111827",color:"#e0b85a",padding:"13px 18px",borderRadius:12,marginTop:10 },
  infoBox:      { background:"#fef9ec",border:"1px solid #e0b85a",borderRadius:12,padding:14,marginBottom:12,fontSize:14 },
  chip:         { background:"#f5e7c0",color:"#6b4c11",borderRadius:16,padding:"3px 12px",fontSize:12,fontWeight:700,display:"inline-block" },
  payrollCard:  { background:"#fffaf2",border:"1px solid #ecdba3",borderRadius:16,padding:16,marginBottom:12 },
  help:         { color:"#6b4c11",fontSize:12,margin:"2px 0" },
};