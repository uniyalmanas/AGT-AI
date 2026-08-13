"use client";

import { useState, useEffect } from "react";
import { Vault, CheckCircle2, Clock, Upload, Download, CreditCard, Sparkles, ExternalLink, ShieldCheck, ArrowRight } from "lucide-react";
import { ClientPortalData } from "@/app/api/client-portal/route";

export default function ClientPortalPage() {
  const [data, setData] = useState<ClientPortalData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");

  useEffect(() => {
    fetchPortalData();
  }, []);

  async function fetchPortalData() {
    try {
      const res = await fetch("/api/client-portal");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleFileUpload(file: File) {
    setUploading(true);
    setUploadSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/client-portal", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.message) setUploadSuccess(json.message);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  }

  if (!data) {
    return (
      <div className="p-16 text-center text-ink-300 text-sm">
        <span className="spinner" /> Loading Client Workspace…
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-5">
      {/* Client Header */}
      <div className="card p-4 sm:p-6 bg-gradient-to-r from-brand-700 to-brand-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-brand-200 font-semibold uppercase tracking-wider">Client Self-Service Portal</span>
          <h1 className="text-xl sm:text-2xl font-bold mt-0.5">{data.clientName}</h1>
          <p className="text-xs font-mono text-brand-100 mt-1">GSTIN: {data.gstin} · Managed by {data.firmName}</p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl text-left sm:text-right border border-white/20 self-start sm:self-auto">
          <span className="text-[10px] text-brand-200 uppercase tracking-wider block">Compliance Status</span>
          <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 mt-0.5">
            <CheckCircle2 size={13} /> Current Returns Up to Date
          </span>
        </div>
      </div>

      {/* Real-time Status Tracker */}
      <div className="card p-4 sm:p-6 bg-white border border-ink-100">
        <h2 className="text-sm font-bold text-ink-900 mb-4">Real-Time Filing Status Tracker</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900">GSTR-3B Return</span>
              <span className="badge-success text-[10px]">✓ FILED</span>
            </div>
            <p className="text-xs text-emerald-700 font-mono">March 2026 Return Filed</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900">GSTR-1 Return</span>
              <span className="badge-success text-[10px]">✓ FILED</span>
            </div>
            <p className="text-xs text-emerald-700 font-mono">March 2026 Sales Filed</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900">TDS 26Q Return</span>
              <span className="badge-warning text-[10px]">⏳ IN PROGRESS</span>
            </div>
            <p className="text-xs text-amber-700 font-mono">Q4 TDS Under Review</p>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      <div className="card p-6 bg-white border border-ink-100">
        <h2 className="text-sm font-bold text-ink-900 mb-1">Upload Documents for Your CA</h2>
        <p className="text-xs text-ink-300 mb-4">Upload monthly purchase invoices, sales registers, or bank statements directly to your CA Vault.</p>

        <div className="border-2 border-dashed border-ink-200 hover:border-brand-400 bg-ink-50/50 p-6 rounded-2xl text-center cursor-pointer relative">
          <input
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Upload size={24} className="mx-auto text-brand-600 mb-2" />
          <p className="text-xs font-bold text-ink-900">Click or drag & drop files here to upload to CA Vault</p>
          <p className="text-[11px] text-ink-300 mt-1">Accepts Excel (.xlsx), PDF Bank Statements, or Image Receipts</p>
        </div>

        {uploading && <p className="text-xs text-brand-600 mt-2 font-medium">Uploading file to CA Vault…</p>}
        {uploadSuccess && (
          <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl flex items-center gap-2">
            <CheckCircle2 size={14} /> {uploadSuccess}
          </div>
        )}
      </div>

      {/* Download Filed Return Acknowledgments */}
      <div className="card p-6 bg-white border border-ink-100">
        <h2 className="text-sm font-bold text-ink-900 mb-3">Filed Return Acknowledgments & PDF Receipts</h2>
        <div className="space-y-2">
          {(data.recentDocuments || []).map((doc: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-ink-50/60 border border-ink-100 hover:bg-ink-50 transition">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-50 text-brand-700 rounded-lg">
                  <Download size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-900">{doc.name}</p>
                  <p className="text-[11px] text-ink-300">{doc.docType} · {doc.date} · {doc.size}</p>
                </div>
              </div>
              <a href={doc.downloadUrl} className="btn-secondary text-xs">
                Download PDF
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Pay Outstanding Fees */}
      {(data.outstandingInvoices || []).length > 0 && (
        <div className="card p-4 sm:p-6 bg-white border border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-ink-900">Outstanding Professional Fee Invoices</h2>
            <span className="badge-warning">Action Required</span>
          </div>

          {(data.outstandingInvoices || []).map((inv: any, idx: number) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
              <div>
                <p className="text-xs font-bold text-ink-900">{inv.service}</p>
                <p className="text-[11px] font-mono text-ink-400 mt-0.5">Invoice #{inv.invoiceNumber} · Due: {inv.dueDate}</p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-base font-bold font-mono text-ink-900">₹{inv.amount.toLocaleString("en-IN")}</span>
                <a
                  href={inv.payUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-xs"
                >
                  <CreditCard size={14} /> Pay via Razorpay / UPI
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
