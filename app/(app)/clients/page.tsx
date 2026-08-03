"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users, Search, Plus, FileText, GitMerge, AlertCircle,
  Pencil, Trash2, X, Loader2,
} from "lucide-react";
import Link from "next/link";
import { validateGstin } from "@/lib/gstin";

interface Client {
  id: string;
  name: string;
  gstin: string;
  pan: string | null;
  business_type: string;
  turnover: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}

const BUSINESS_TYPES = ["Regular", "Composition", "SEZ", "Casual"];

const emptyForm = {
  id: "",
  name: "",
  gstin: "",
  pan: "",
  business_type: "Regular",
  turnover: "",
  email: "",
  phone: "",
};
type Form = typeof emptyForm;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [form, setForm] = useState<Form>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/clients");
    if (res.ok) {
      const data = await res.json();
      setClients(data.clients || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setForm(emptyForm);
    setMode("add");
    setError("");
    setOpen(true);
  }

  function openEdit(c: Client) {
    setForm({
      id: c.id,
      name: c.name,
      gstin: c.gstin,
      pan: c.pan || "",
      business_type: c.business_type,
      turnover: c.turnover || "",
      email: c.email || "",
      phone: c.phone || "",
    });
    setMode("edit");
    setError("");
    setOpen(true);
  }

  function update(key: keyof Form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  // Live GSTIN feedback in the form
  const gstinTouched = form.gstin.trim().length > 0;
  const gstinCheck = gstinTouched ? validateGstin(form.gstin) : { valid: true as boolean, error: undefined };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const check = validateGstin(form.gstin);
    if (!check.valid) {
      setError(check.error || "Invalid GSTIN");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/clients", {
      method: mode === "add" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Could not save client");
      return;
    }
    setOpen(false);
    load();
  }

  async function handleDelete(c: Client) {
    if (!confirm(`Remove "${c.name}"? This hides the client but keeps their records.`)) return;
    const res = await fetch(`/api/clients?id=${c.id}`, { method: "DELETE" });
    if (res.ok) setClients((cs) => cs.filter((x) => x.id !== c.id));
  }

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.gstin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
            <Users size={22} className="text-brand-600" /> Clients
          </h1>
          <p className="text-sm text-ink-300 mt-1">
            {loading ? "Loading…" : `${clients.length} client${clients.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={15} /> Add client
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-200" />
        <input
          className="input pl-9"
          placeholder="Search by name or GSTIN…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table / states */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-ink-300 text-sm gap-2">
            <Loader2 size={16} className="animate-spin" /> Loading clients…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={28} className="mx-auto text-ink-200 mb-3" />
            <p className="text-sm text-ink-400 font-medium">
              {clients.length === 0 ? "No clients yet" : "No matches"}
            </p>
            <p className="text-xs text-ink-300 mt-1">
              {clients.length === 0 ? "Add your first GST client to get started." : "Try a different search."}
            </p>
            {clients.length === 0 && (
              <button className="btn-primary mt-4 mx-auto" onClick={openAdd}>
                <Plus size={15} /> Add client
              </button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-ink-50/60">
              <tr>
                <th className="table-head">Client</th>
                <th className="table-head">GSTIN</th>
                <th className="table-head">Type</th>
                <th className="table-head">Turnover</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-ink-50/40 transition-colors">
                  <td className="table-cell">
                    <div className="font-semibold text-ink-900 text-sm">{c.name}</div>
                    {c.email && <div className="text-[11px] text-ink-300 mt-0.5">{c.email}</div>}
                  </td>
                  <td className="table-cell font-mono text-xs text-ink-500">{c.gstin}</td>
                  <td className="table-cell">
                    <span className={`badge ${c.business_type === "Regular" ? "badge-info" : "badge-neutral"}`}>
                      {c.business_type}
                    </span>
                  </td>
                  <td className="table-cell text-ink-500">{c.turnover || "—"}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <Link href="/gstr3b" className="p-1.5 rounded-lg hover:bg-ink-50 text-ink-300 hover:text-brand-600 transition-colors" title="File GSTR-3B">
                        <FileText size={14} />
                      </Link>
                      <Link href="/reconcile" className="p-1.5 rounded-lg hover:bg-ink-50 text-ink-300 hover:text-brand-600 transition-colors" title="Reconcile">
                        <GitMerge size={14} />
                      </Link>
                      <Link href="/notices" className="p-1.5 rounded-lg hover:bg-ink-50 text-ink-300 hover:text-danger-text transition-colors" title="Notices">
                        <AlertCircle size={14} />
                      </Link>
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-ink-50 text-ink-300 hover:text-brand-600 transition-colors" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(c)} className="p-1.5 rounded-lg hover:bg-ink-50 text-ink-300 hover:text-danger-text transition-colors" title="Remove">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/30 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-ink-900">
                {mode === "add" ? "Add client" : "Edit client"}
              </h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-ink-50 text-ink-300">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Business name *</label>
                <input className="input" placeholder="Sunrise Traders Pvt Ltd" value={form.name} onChange={update("name")} required />
              </div>

              <div>
                <label className="label">GSTIN *</label>
                <input
                  className={`input font-mono uppercase ${gstinTouched && !gstinCheck.valid ? "border-danger-border focus:ring-red-300" : ""}`}
                  placeholder="27AABCU9603R1ZM"
                  value={form.gstin}
                  onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value.toUpperCase() }))}
                  maxLength={15}
                  required
                />
                {gstinTouched && !gstinCheck.valid && (
                  <p className="text-[11px] text-danger-text mt-1">{gstinCheck.error}</p>
                )}
                {gstinTouched && gstinCheck.valid && (
                  <p className="text-[11px] text-success-text mt-1">✓ Valid GSTIN</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">PAN</label>
                  <input className="input font-mono uppercase" placeholder="AABCU9603R" value={form.pan} onChange={(e) => setForm((f) => ({ ...f, pan: e.target.value.toUpperCase() }))} maxLength={10} />
                </div>
                <div>
                  <label className="label">Business type</label>
                  <select className="input" value={form.business_type} onChange={update("business_type")}>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Annual turnover</label>
                  <input className="input" placeholder="₹1.2 Cr" value={form.turnover} onChange={update("turnover")} />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" placeholder="98xxxxxxxx" value={form.phone} onChange={update("phone")} />
                </div>
              </div>

              <div>
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="accounts@client.in" value={form.email} onChange={update("email")} />
              </div>

              {error && (
                <div className="text-xs text-danger-text bg-danger-bg border border-danger-border rounded-xl px-3 py-2">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <Loader2 size={15} className="animate-spin" /> : mode === "add" ? "Add client" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
