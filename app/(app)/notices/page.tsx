"use client";
import { useState } from "react";
import { AlertCircle, Sparkles, FileText, RotateCcw, Copy, CheckCircle2 } from "lucide-react";

interface NoticeResult {
  noticeType: string;
  referenceNumber: string;
  issueDate: string;
  demandAmount: string;
  plainEnglishSummary: string;
  rootCause: string;
  urgencyLevel: "high" | "medium" | "low";
  dueDate: string;
  draftReply: string;
  documentsNeeded: string[];
  nextSteps: string[];
}

const SAMPLE_NOTICE = `FORM GST DRC-01
Notice Reference: ZD2706260001234

Date: 10-06-2026

To: M/s Sunrise Traders Pvt Ltd
GSTIN: 27AABCU9603R1ZM

Sub: Show cause notice for short payment of tax for the period April 2025 to March 2026

This is to bring to your notice that on examination of returns filed by you, it has been observed that:

1. The details of outward taxable supplies declared in GSTR-1 are ₹15,90,000 whereas the outward supplies declared in GSTR-3B are ₹14,40,000, resulting in a short reporting of ₹1,50,000.

2. ITC claimed in GSTR-3B for the period is ₹66,500 whereas the eligible ITC as per GSTR-2B is ₹59,000 only. Excess ITC of ₹7,500 has been claimed.

Tax short paid:
CGST: ₹6,750
SGST: ₹6,750
Excess ITC reversal required: ₹7,500
Interest @ 18% p.a.: ₹2,430
Penalty: ₹2,100

Total demand: ₹25,530

You are hereby directed to show cause within 30 days why the above amount should not be recovered from you.

Proper Officer
GST Commissionerate, Pune`;

const urgencyStyle: Record<string, string> = {
  high:   "bg-danger-bg border-danger-border text-danger-text",
  medium: "bg-warning-bg border-warning-border text-warning-text",
  low:    "bg-info-bg border-info-border text-info-text",
};

export default function NoticesPage() {
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NoticeResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function analyze() {
    if (!notice.trim()) { setError("Please paste the notice text."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/analyze-notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noticeText: notice }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setResult(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally { setLoading(false); }
  }

  function copyReply() {
    if (result?.draftReply) {
      navigator.clipboard.writeText(result.draftReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
            <AlertCircle size={22} className="text-brand-600" />
            GST Notice Reader
          </h1>
          <p className="text-sm text-ink-300 mt-1">Paste any GST notice — Claude explains it in plain English and drafts your reply</p>
        </div>
        {result && <button onClick={() => { setResult(null); setNotice(""); }} className="btn-secondary"><RotateCcw size={14} /> New notice</button>}
      </div>

      {!result && (
        <div className="card p-6">
          <h2 className="font-semibold text-ink-900 mb-1">Paste the notice</h2>
          <p className="text-xs text-ink-300 mb-4">Works with DRC-01, scrutiny notices, demand orders, ASMT-10, and any GSTN communication</p>
          <textarea
            className="input h-72 resize-none text-xs font-mono"
            placeholder="Paste the full GST notice text here…"
            value={notice}
            onChange={e => setNotice(e.target.value)}
          />
          {error && (
            <div className="mt-2 text-xs text-danger-text bg-danger-bg rounded-lg px-3 py-2 flex gap-2 items-center">
              <AlertCircle size={13} /> {error}
            </div>
          )}
          <div className="flex gap-3 mt-4">
            <button onClick={analyze} disabled={loading} className="btn-primary">
              {loading ? <><span className="spinner" /> Analysing notice…</> : <><Sparkles size={15} /> Analyse & Draft Reply</>}
            </button>
            <button onClick={() => setNotice(SAMPLE_NOTICE)} className="btn-secondary text-xs">Load sample notice</button>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          {/* Header card */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={15} className="text-brand-600" />
                  <span className="font-bold text-ink-900">{result.noticeType}</span>
                </div>
                <div className="text-xs text-ink-300 space-y-0.5">
                  <div>Ref: <span className="font-mono">{result.referenceNumber}</span></div>
                  <div>Issued: {result.issueDate} · Reply by: <strong className="text-danger-text">{result.dueDate}</strong></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-danger-text">{result.demandAmount}</div>
                <div className="text-xs text-ink-300">total demand</div>
              </div>
            </div>
          </div>

          {/* Urgency */}
          <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${urgencyStyle[result.urgencyLevel]}`}>
            {result.urgencyLevel === "high" ? "🚨 High urgency" : result.urgencyLevel === "medium" ? "⚠️ Medium urgency" : "ℹ️ Low urgency"} — {result.urgencyLevel === "high" ? "Act immediately, deadline soon" : result.urgencyLevel === "medium" ? "Respond within the deadline" : "Review and respond formally"}
          </div>

          {/* What it means */}
          <div className="card p-5">
            <h2 className="font-semibold text-ink-900 mb-2">What this notice means</h2>
            <p className="text-sm text-ink-600 leading-relaxed">{result.plainEnglishSummary}</p>
            <div className="mt-3 p-3 bg-ink-50 rounded-xl">
              <div className="text-xs font-semibold text-ink-400 mb-1">Root cause</div>
              <p className="text-sm text-ink-700">{result.rootCause}</p>
            </div>
          </div>

          {/* Documents needed */}
          {result.documentsNeeded?.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-ink-900 mb-3">Documents you'll need</h2>
              <ul className="space-y-2">
                {result.documentsNeeded.map((d, i) => (
                  <li key={i} className="text-sm text-ink-600 flex gap-2">
                    <span className="text-brand-400 font-bold">□</span> {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Draft reply */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-ink-900">Draft reply (ready to use)</h2>
              <button onClick={copyReply} className="btn-secondary text-xs">
                {copied ? <><CheckCircle2 size={13} className="text-success-text" /> Copied!</> : <><Copy size={13} /> Copy reply</>}
              </button>
            </div>
            <pre className="text-xs text-ink-600 bg-ink-50 rounded-xl p-4 whitespace-pre-wrap font-mono leading-relaxed overflow-auto max-h-96">
              {result.draftReply}
            </pre>
          </div>

          {/* Next steps */}
          {result.nextSteps?.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-success-text" /> Action plan
              </h2>
              <ol className="space-y-2">
                {result.nextSteps.map((s, i) => (
                  <li key={i} className="text-sm text-ink-600 flex gap-3">
                    <span className="font-bold text-brand-400 flex-shrink-0">{i + 1}.</span> {s}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
