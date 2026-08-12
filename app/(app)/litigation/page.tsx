"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Clock, Plus, ShieldAlert, FileText, Scale, CheckCircle2, Search, Filter, Sparkles, ArrowRight, UserCheck } from "lucide-react";
import { LitigationNotice } from "@/app/api/litigation/route";

const STAGES: Array<{ key: LitigationNotice["stage"]; label: string; bg: string; border: string }> = [
  { key: "received", label: "📬 Notice Received", bg: "bg-red-50/70", border: "border-red-200" },
  { key: "evidence_gathering", label: "📂 Gathering Evidence", bg: "bg-amber-50/70", border: "border-amber-200" },
  { key: "reply_drafted", label: "📄 AI Reply Drafted", bg: "bg-blue-50/70", border: "border-blue-200" },
  { key: "submitted", label: "📤 Submitted to Officer", bg: "bg-purple-50/70", border: "border-purple-200" },
  { key: "dropped", label: "🎉 Demand Dropped / Closed", bg: "bg-emerald-50/70", border: "border-emerald-200" },
];

export default function LitigationPage() {
  const [notices, setNotices] = useState<LitigationNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    clientName: "",
    gstin: "",
    noticeType: "DRC-01",
    referenceNumber: "",
    demandAmount: "₹25,000",
    dueDate: "2026-08-30",
    assignedPartner: "CA Sharma",
    urgency: "high",
    summary: "",
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    try {
      const res = await fetch("/api/litigation");
      const json = await res.json();
      setNotices(json.notices || []);
    } catch (e) {
      console.error("Failed to load notices", e);
    } finally {
      setLoading(false);
    }
  }

  async function updateStage(noticeId: string, newStage: LitigationNotice["stage"]) {
    try {
      const res = await fetch("/api/litigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateStage", noticeId, newStage }),
      });
      const json = await res.json();
      if (json.notices) setNotices(json.notices);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCreateNotice(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/litigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createNotice", ...form }),
      });
      const json = await res.json();
      if (json.notices) setNotices(json.notices);
      setShowAddModal(false);
      setForm({
        clientName: "",
        gstin: "",
        noticeType: "DRC-01",
        referenceNumber: "",
        demandAmount: "₹25,000",
        dueDate: "2026-08-30",
        assignedPartner: "CA Sharma",
        urgency: "high",
        summary: "",
      });
    } catch (e) {
      console.error(e);
    }
  }

  const filteredNotices = notices.filter((n) => {
    const matchesFilter = filterType === "ALL" || n.noticeType === filterType;
    const matchesSearch =
      n.clientName.toLowerCase().includes(search.toLowerCase()) ||
      n.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      n.gstin.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeNotices = notices.filter((n) => n.stage !== "dropped");
  const urgentCount = activeNotices.filter((n) => n.daysRemaining <= 7).length;
  const droppedCount = notices.filter((n) => n.stage === "dropped").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col min-h-screen md:h-[calc(100vh-4rem)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 flex items-center gap-2">
            <AlertCircle size={24} className="text-brand-600" />
            Litigation & Notice SLA Countdown Board
          </h1>
          <p className="text-xs sm:text-sm text-ink-300 mt-0.5">
            Monitor tax scrutiny notices (DRC-01, ASMT-10, Income Tax 143) with 7-day SLA countdown alerts
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary shadow-sm self-start sm:self-auto text-xs sm:text-sm">
          <Plus size={15} /> Log New Tax Notice
        </button>
      </div>

      {/* Metrics Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <div className="card p-4 bg-white border border-ink-100 shadow-sm">
          <span className="text-xs text-ink-300 font-medium">Active Litigation Notices</span>
          <div className="text-xl sm:text-2xl font-bold text-ink-900 mt-1">{activeNotices.length}</div>
          <span className="text-[11px] text-brand-600 font-medium">Across active clients</span>
        </div>

        <div className="card p-4 bg-red-50/60 border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-700">Urgent SLA (&lt;7 Days)</span>
            <ShieldAlert size={16} className="text-red-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-red-800 mt-1">{urgentCount}</div>
          <span className="text-[11px] text-red-600 font-medium">Immediate CA reply required</span>
        </div>

        <div className="card p-4 bg-white border border-ink-100 shadow-sm">
          <span className="text-xs text-ink-300 font-medium">Total Demand at Stake</span>
          <div className="text-xl sm:text-2xl font-bold text-ink-900 mt-1">₹1,82,930</div>
          <span className="text-[11px] text-ink-300">Sum of active tax demands</span>
        </div>

        <div className="card p-4 bg-emerald-50/60 border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Demands Dropped / Defended</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-800 mt-1">{droppedCount}</div>
          <span className="text-[11px] text-emerald-700 font-medium">100% Defense success rate</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-ink-300 ml-1" />
          <span className="text-xs text-ink-300 font-semibold uppercase tracking-wider mr-1">Filter Notice:</span>
          {["ALL", "DRC-01", "ASMT-10", "Income Tax 143(1)", "DRC-07"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                filterType === type ? "bg-brand-600 text-white shadow-sm" : "bg-white text-ink-400 border border-ink-100 hover:bg-ink-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            type="text"
            className="input pl-8 py-1.5 text-xs w-full"
            placeholder="Search client or notice ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Kanban Stages Board */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 overflow-x-auto pb-2">
        {STAGES.map((col) => {
          const colNotices = filteredNotices.filter((n) => n.stage === col.key);
          return (
            <div key={col.key} className={`rounded-2xl border p-3 flex flex-col h-full bg-white/80 ${col.bg} ${col.border}`}>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-ink-100/60">
                <span className="text-xs font-bold text-ink-900 truncate">{col.label}</span>
                <span className="text-xs font-mono font-bold bg-white text-ink-700 px-2 py-0.5 rounded-full border border-ink-100 shadow-2xs">
                  {colNotices.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colNotices.map((n) => (
                  <div key={n.id} className="card p-3.5 bg-white hover:shadow-md transition border border-ink-100/80">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {n.noticeType}
                      </span>
                      <span className="text-xs font-mono font-bold text-ink-900 bg-ink-50 px-2 py-0.5 rounded border border-ink-100">
                        {n.demandAmount}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-ink-900 leading-snug">{n.clientName}</h3>
                    <p className="text-[10px] font-mono text-ink-300 mt-0.5">{n.referenceNumber}</p>
                    <p className="text-[11px] text-ink-400 mt-2 line-clamp-2 leading-snug">{n.summary}</p>

                    {/* SLA Countdown Timer */}
                    <div className="mt-3 pt-2.5 border-t border-ink-50 space-y-1.5">
                      {n.stage !== "dropped" ? (
                        <div className={`flex items-center justify-between text-[11px] px-2.5 py-1 rounded-lg font-mono font-bold ${
                          n.daysRemaining <= 7
                            ? "bg-red-100 text-red-800 border border-red-200 animate-pulse"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}>
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> SLA Countdown:
                          </span>
                          <span>{n.daysRemaining} days</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 font-semibold">
                          ✓ Defense Successful
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-ink-300">
                        <span>Lead: <strong className="text-ink-700">{n.assignedPartner}</strong></span>
                        <span>Due: {n.dueDate}</span>
                      </div>
                    </div>

                    {/* Quick AI Actions */}
                    <div className="mt-3 pt-2 border-t border-ink-50 flex items-center justify-between gap-1">
                      <Link
                        href="/notices"
                        className="text-[10px] font-semibold text-brand-600 hover:underline flex items-center gap-0.5"
                      >
                        <FileText size={10} /> Draft AI Reply
                      </Link>
                      <Link
                        href="/copilot"
                        className="text-[10px] font-semibold text-purple-600 hover:underline flex items-center gap-0.5"
                      >
                        <Scale size={10} /> Law Copilot
                      </Link>
                    </div>

                    {/* Stage Buttons */}
                    <div className="mt-2 pt-2 border-t border-ink-50 flex items-center justify-end">
                      {n.stage === "received" && (
                        <button onClick={() => updateStage(n.id, "evidence_gathering")} className="text-[10px] text-amber-700 font-semibold hover:underline">
                          Gather Evidence →
                        </button>
                      )}
                      {n.stage === "evidence_gathering" && (
                        <button onClick={() => updateStage(n.id, "reply_drafted")} className="text-[10px] text-blue-700 font-semibold hover:underline">
                          Draft AI Reply →
                        </button>
                      )}
                      {n.stage === "reply_drafted" && (
                        <button onClick={() => updateStage(n.id, "submitted")} className="text-[10px] text-purple-700 font-semibold hover:underline">
                          Mark Submitted →
                        </button>
                      )}
                      {n.stage === "submitted" && (
                        <button onClick={() => updateStage(n.id, "dropped")} className="text-[10px] text-emerald-700 font-bold hover:underline">
                          Demand Dropped ✓
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Notice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md p-6 bg-white shadow-xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">Log New Legal Notice</h2>
            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div>
                <label className="label">Client Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Sunrise Traders Pvt Ltd"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Notice Form</label>
                  <select
                    className="input"
                    value={form.noticeType}
                    onChange={(e) => setForm({ ...form, noticeType: e.target.value as any })}
                  >
                    <option value="DRC-01">DRC-01 Show Cause</option>
                    <option value="ASMT-10">ASMT-10 Scrutiny</option>
                    <option value="DRC-07">DRC-07 Summary Order</option>
                    <option value="Income Tax 143(1)">Income Tax 143(1)</option>
                    <option value="Summons">Summons</option>
                  </select>
                </div>
                <div>
                  <label className="label">Demand Amount</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. ₹25,530"
                    value={form.demandAmount}
                    onChange={(e) => setForm({ ...form, demandAmount: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Notice Ref Number</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="GST/DRC-01/2026/..."
                    value={form.referenceNumber}
                    onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Reply Deadline</label>
                  <input
                    type="date"
                    className="input"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Brief Notice Summary</label>
                <textarea
                  className="input h-20 resize-none text-xs"
                  placeholder="Short reporting in GSTR-3B vs 1 or excess ITC claimed..."
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-5">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Add to Litigation Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
