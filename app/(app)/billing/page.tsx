"use client";

import { useState, useEffect } from "react";
import { CreditCard, DollarSign, TrendingUp, AlertTriangle, Plus, Send, Copy, Check, FileText, ExternalLink, QrCode, UserCheck, ShieldAlert, ArrowUpRight } from "lucide-react";
import { CAInvoice, ClientProfitability } from "@/app/api/billing/route";

export default function BillingPage() {
  const [invoices, setInvoices] = useState<CAInvoice[]>([]);
  const [profitability, setProfitability] = useState<ClientProfitability[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"invoices" | "profitability">("invoices");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<CAInvoice | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    clientName: "",
    clientGstin: "",
    clientPhone: "",
    description: "Monthly GST Filing Retainer (GSTR-1 & 3B) - SAC 9982",
    amount: "3500",
    sacCode: "998222",
    dueDate: "2026-08-30",
  });

  useEffect(() => {
    fetchBillingData();
  }, []);

  async function fetchBillingData() {
    try {
      const res = await fetch("/api/billing");
      const json = await res.json();
      setInvoices(json.invoices || []);
      setProfitability(json.profitability || []);
    } catch (e) {
      console.error("Failed to load billing data", e);
    } finally {
      setLoading(false);
    }
  }

  async function updateInvoiceStatus(invoiceId: string, newStatus: CAInvoice["status"]) {
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateStatus", invoiceId, newStatus }),
      });
      const json = await res.json();
      if (json.invoices) setInvoices(json.invoices);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createInvoice", ...form }),
      });
      const json = await res.json();
      if (json.invoices) setInvoices(json.invoices);
      setShowAddModal(false);
      setForm({
        clientName: "",
        clientGstin: "",
        clientPhone: "",
        description: "Monthly GST Filing Retainer (GSTR-1 & 3B) - SAC 9982",
        amount: "3500",
        sacCode: "998222",
        dueDate: "2026-08-30",
      });
    } catch (e) {
      console.error(e);
    }
  }

  function sendWhatsAppPaymentLink(inv: CAInvoice) {
    const message = `Dear *${inv.clientName}*,

Tax Invoice *${inv.invoiceNumber}* for professional services (SAC 9982) has been generated.

• *Total Payable*: ₹${inv.totalAmount.toLocaleString("en-IN")}
• *Due Date*: ${inv.dueDate}

Pay instantly via Razorpay / UPI link below:
${inv.paymentLink}

Thank you,
*Sharma & Associates (CA Firm)*`;

    const encoded = encodeURIComponent(message);
    const waUrl = inv.clientPhone
      ? `https://wa.me/${inv.clientPhone}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, "_blank");
  }

  function copyPaymentLink(inv: CAInvoice) {
    navigator.clipboard.writeText(inv.paymentLink);
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((acc, i) => acc + i.totalAmount, 0);
  const totalOverdue = invoices.filter((i) => i.status === "overdue" || i.status === "sent").reduce((acc, i) => acc + i.totalAmount, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
            <CreditCard size={24} className="text-brand-600" />
            SAC 9982 Professional Fee Invoicing & Profitability OS
          </h1>
          <p className="text-sm text-ink-300 mt-0.5">
            GST-compliant CA billing, Razorpay/UPI payment collection links, and Article Clerk profitability tracking
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus size={15} /> Create Tax Invoice (SAC 9982)
        </button>
      </div>

      {/* Metrics Banners */}
      <div className="grid grid-cols-4 gap-4 mb-6 flex-shrink-0">
        <div className="card p-4 bg-white border border-ink-100">
          <span className="text-xs text-ink-300 font-medium">Total Fees Billed (MTD)</span>
          <div className="text-2xl font-bold text-ink-900 mt-1">₹{totalBilled.toLocaleString("en-IN")}</div>
          <span className="text-[11px] text-brand-600">Across {invoices.length} invoices</span>
        </div>

        <div className="card p-4 bg-emerald-50/50 border border-emerald-200">
          <span className="text-xs font-semibold text-emerald-700">Collected via Razorpay/UPI</span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">₹{totalPaid.toLocaleString("en-IN")}</div>
          <span className="text-[11px] text-emerald-700">Instant bank settlement</span>
        </div>

        <div className="card p-4 bg-amber-50/50 border border-amber-200">
          <span className="text-xs font-semibold text-amber-700">Uncollected / Overdue</span>
          <div className="text-2xl font-bold text-amber-800 mt-1">₹{totalOverdue.toLocaleString("en-IN")}</div>
          <span className="text-[11px] text-amber-700">Awaiting client payment</span>
        </div>

        <div className="card p-4 bg-purple-50/50 border border-purple-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700">Firm Net Margin</span>
            <TrendingUp size={16} className="text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-800 mt-1">54.2%</div>
          <span className="text-[11px] text-purple-700">Average staff cost efficiency</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0 border-b border-ink-100 pb-2">
        <button
          onClick={() => setActiveTab("invoices")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "invoices" ? "bg-brand-600 text-white shadow-sm" : "text-ink-400 hover:bg-ink-50"
          }`}
        >
          <FileText size={14} /> Professional Fee Invoices (SAC 9982)
        </button>
        <button
          onClick={() => setActiveTab("profitability")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "profitability" ? "bg-brand-600 text-white shadow-sm" : "text-ink-400 hover:bg-ink-50"
          }`}
        >
          <TrendingUp size={14} /> Article Clerk Hours & Profitability Analytics
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 card p-6 bg-white overflow-y-auto border border-ink-100">
        {activeTab === "invoices" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-ink-900">CA Professional Fee Tax Invoices</h2>
              <span className="text-xs text-ink-300">GST SAC Code 9982 (Accounting, Auditing & Tax Consultancy)</span>
            </div>

            <table className="w-full text-left">
              <thead className="bg-ink-50/60 text-[11px] font-bold text-ink-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Services (SAC 9982)</th>
                  <th className="p-3">Subtotal</th>
                  <th className="p-3">GST (18%)</th>
                  <th className="p-3">Total Payable</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50 text-xs">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-ink-50/40 transition">
                    <td className="p-3 font-mono font-bold text-brand-700">{inv.invoiceNumber}</td>
                    <td className="p-3">
                      <div className="font-semibold text-ink-900">{inv.clientName}</div>
                      <div className="text-[10px] font-mono text-ink-300">{inv.clientGstin}</div>
                    </td>
                    <td className="p-3 max-w-xs">
                      {inv.items.map((item, idx) => (
                        <div key={idx} className="text-ink-700">
                          {item.description} <span className="font-mono text-[10px] text-ink-300">(SAC {item.sacCode})</span>
                        </div>
                      ))}
                    </td>
                    <td className="p-3 font-mono text-ink-700">₹{inv.subtotal.toLocaleString("en-IN")}</td>
                    <td className="p-3 font-mono text-ink-400">
                      ₹{(inv.cgst + inv.sgst + inv.igst).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 font-mono font-bold text-ink-900">₹{inv.totalAmount.toLocaleString("en-IN")}</td>
                    <td className="p-3">
                      <span className={`badge ${
                        inv.status === "paid" ? "badge-success" : inv.status === "overdue" ? "badge-danger" : "badge-warning"
                      }`}>
                        {inv.status === "paid" ? "✓ Paid" : inv.status === "overdue" ? "⚠ Overdue" : "⌛ Sent"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => sendWhatsAppPaymentLink(inv)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition text-[11px] font-semibold flex items-center gap-1"
                          title="Send WhatsApp Payment Link"
                        >
                          <Send size={12} /> WhatsApp Pay Link
                        </button>

                        <button
                          onClick={() => copyPaymentLink(inv)}
                          className="p-1.5 rounded-lg border border-ink-100 hover:bg-ink-50 text-ink-400 hover:text-ink-700 transition"
                          title="Copy Razorpay Link"
                        >
                          {copiedId === inv.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        </button>

                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-1.5 rounded-lg border border-ink-100 hover:bg-ink-50 text-brand-600 transition"
                          title="View / Print Tax Invoice"
                        >
                          <FileText size={13} />
                        </button>

                        {inv.status !== "paid" && (
                          <button
                            onClick={() => updateInvoiceStatus(inv.id, "paid")}
                            className="px-2 py-1 bg-emerald-600 text-white rounded-md text-[10px] font-bold hover:bg-emerald-700 transition"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-sm font-bold text-ink-900">Article Clerk Hours & Client Profitability Analytics</h2>
                <p className="text-xs text-ink-300">Tracks staff hours logged vs retainer fees to catch undercharged loss-making clients</p>
              </div>
              <div className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-xl border border-brand-100 font-semibold">
                Staff Cost Rate: ₹250 / Hour
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-ink-50/60 text-[11px] font-bold text-ink-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Client</th>
                  <th className="p-3">Monthly Retainer</th>
                  <th className="p-3">Article Clerk Hours Logged</th>
                  <th className="p-3">Total Staff Cost (Hours × ₹250)</th>
                  <th className="p-3">Net CA Margin</th>
                  <th className="p-3">Profit Margin %</th>
                  <th className="p-3">Profitability Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50 text-xs">
                {profitability.map((prof) => (
                  <tr key={prof.clientId} className="hover:bg-ink-50/40 transition">
                    <td className="p-3 font-semibold text-ink-900">{prof.clientName}</td>
                    <td className="p-3 font-mono font-bold text-brand-700">₹{prof.monthlyRetainer.toLocaleString("en-IN")}</td>
                    <td className="p-3 font-mono text-ink-700">{prof.staffHoursSpent} hrs</td>
                    <td className="p-3 font-mono text-ink-500">₹{prof.totalStaffCost.toLocaleString("en-IN")}</td>
                    <td className={`p-3 font-mono font-bold ${prof.netProfit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                      ₹{prof.netProfit.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 font-mono font-bold">{prof.profitMargin.toFixed(1)}%</td>
                    <td className="p-3">
                      {prof.status === "profitable" && (
                        <span className="badge-success">🟢 Highly Profitable</span>
                      )}
                      {prof.status === "low_margin" && (
                        <span className="badge-warning">🟡 Low Margin (Review Fee)</span>
                      )}
                      {prof.status === "loss_making" && (
                        <span className="badge-danger font-bold animate-pulse">🔴 Loss-Making (Undercharged!)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Printable Invoice Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-xl p-8 bg-white shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-ink-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-ink-900">TAX INVOICE</h2>
                <p className="text-xs text-ink-300">GST Registration: 27AAAAA0000A1Z5</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-brand-700">{selectedInvoice.invoiceNumber}</p>
                <p className="text-xs text-ink-300">Date: {selectedInvoice.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-semibold text-ink-400 uppercase tracking-wider">Service Provider (CA Firm):</p>
                <p className="font-bold text-ink-900 mt-1">Sharma & Associates</p>
                <p className="text-ink-400">Chartered Accountants</p>
                <p className="text-ink-400">ICAI Firm Reg No: 123456N</p>
              </div>
              <div>
                <p className="font-semibold text-ink-400 uppercase tracking-wider">Billed To (Client):</p>
                <p className="font-bold text-ink-900 mt-1">{selectedInvoice.clientName}</p>
                <p className="text-ink-400 font-mono">GSTIN: {selectedInvoice.clientGstin}</p>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-xs text-left border border-ink-100">
              <thead className="bg-ink-50 text-ink-400 font-bold">
                <tr>
                  <th className="p-2 border-b">Description</th>
                  <th className="p-2 border-b">SAC Code</th>
                  <th className="p-2 border-b text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2 border-b">{item.description}</td>
                    <td className="p-2 border-b font-mono">{item.sacCode}</td>
                    <td className="p-2 border-b text-right font-mono">₹{item.amount.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between text-xs pt-2">
              <div>
                <p className="font-semibold text-emerald-700 flex items-center gap-1">
                  <QrCode size={14} /> Scan UPI QR to Pay
                </p>
                <p className="text-[10px] text-ink-300 font-mono mt-0.5">{selectedInvoice.upiQrUrl}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-ink-400">Subtotal: <strong className="font-mono text-ink-900">₹{selectedInvoice.subtotal.toLocaleString("en-IN")}</strong></p>
                <p className="text-ink-400">CGST (9%) + SGST (9%): <strong className="font-mono text-ink-900">₹{(selectedInvoice.cgst + selectedInvoice.sgst + selectedInvoice.igst).toLocaleString("en-IN")}</strong></p>
                <p className="text-sm font-bold text-brand-700">Total Payable: ₹{selectedInvoice.totalAmount.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-ink-100">
              <button onClick={() => setSelectedInvoice(null)} className="btn-secondary text-xs">
                Close
              </button>
              <button onClick={() => window.print()} className="btn-primary text-xs">
                Print Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md p-6 bg-white shadow-xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">Create Professional Fee Invoice (SAC 9982)</h2>
            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div>
                <label className="label">Client Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Sunrise Traders Pvt Ltd"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Client GSTIN</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="27AABCU9603R1ZM"
                    value={form.clientGstin}
                    onChange={(e) => setForm({ ...form, clientGstin: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Client Phone (WhatsApp)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="9820198201"
                    value={form.clientPhone}
                    onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Service Description</label>
                <input
                  type="text"
                  className="input"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Fee Amount (₹)</label>
                  <input
                    type="number"
                    className="input"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">GST SAC Code</label>
                  <input
                    type="text"
                    className="input"
                    value={form.sacCode}
                    onChange={(e) => setForm({ ...form, sacCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-5">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Generate Tax Invoice & Pay Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
