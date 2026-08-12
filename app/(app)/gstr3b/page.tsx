"use client";
import { useState } from "react";
import { Sparkles, FileText, AlertTriangle, CheckCircle2, Info, RotateCcw, ExternalLink, Upload, AlignLeft } from "lucide-react";
import { FileUploadZone } from "@/components/FileUploadZone";

interface FilledData {
  gstin: string; legalName: string; period: string; filingType: string;
  b2bTaxable: number; b2cTaxable: number; exportSupplies: number;
  nilExempt: number; reverseCharge: number;
  itcIGST: number; itcCGST: number; itcSGST: number;
  igstPayable: number; cgstPayable: number; sgstPayable: number;
  interest: number; lateFee: number;
  mismatches: string[]; aiNotes: string;
}

const SAMPLE = `Business name: Sunrise Traders Pvt Ltd
GSTIN: 27AABCU9603R1ZM
Period: March 2026
Filing type: Monthly

Outward supplies:
- B2B taxable sales: ₹8,50,000
- B2C taxable sales: ₹2,20,000
- Export sales (zero-rated): ₹1,10,000
- Nil rated / exempt: ₹45,000
- Inward supplies under reverse charge: ₹30,000

Input Tax Credit (from GSTR-2B):
- IGST credit: ₹38,000
- CGST credit: ₹14,000
- SGST credit: ₹10,000

Interest payable: ₹0
Late fee: ₹0`;

function fmt(n: number) {
  if (n === undefined || n === null) return "—";
  return "₹" + n.toLocaleString("en-IN");
}

export default function GSTR3BPage() {
  const [inputMode, setInputMode] = useState<"file" | "text">("file");
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FilledData | null>(null);
  const [log, setLog] = useState("");
  const [error, setError] = useState("");

  async function runAI() {
    if (!raw.trim()) { setError("Please paste transaction data first."); return; }
    setError(""); setLoading(true); setLog("Processing data with Gemini AI…"); setData(null);
    try {
      const res = await fetch("/api/fill-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawData: raw }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
      setLog("All fields filled. Please review before filing.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError("Could not process: " + msg);
    } finally {
      setLoading(false);
    }
  }

  function handleParsedFromFile(parsedData: FilledData, fileName: string) {
    setData(parsedData);
    setLog(`Data parsed directly from uploaded file "${fileName}".`);
  }

  function reset() { setRaw(""); setData(null); setLog(""); setError(""); }

  const Field = ({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) => (
    <div>
      <label className="label">{label}</label>
      <div className={`input ${data ? "filled-input animate-fill" : ""} ${mono ? "font-mono" : ""}`}>
        {value || <span className="text-ink-200">—</span>}
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
            <FileText size={22} className="text-brand-600" />
            GSTR-3B Auto-Filler
          </h1>
          <p className="text-sm text-ink-300 mt-1">Upload Tally Excel / PDF or paste raw text — AI Vision extracts and computes every field</p>
        </div>
        {data && (
          <button onClick={reset} className="btn-secondary">
            <RotateCcw size={14} /> Start over
          </button>
        )}
      </div>

      {/* Step 1 — Input */}
      {!data && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-ink-100">
            <h2 className="font-semibold text-ink-900 flex items-center gap-2">
              <span className="text-brand-600 font-bold">01</span> Provide Return Data
            </h2>
            <div className="flex items-center gap-1 bg-ink-50 p-1 rounded-xl border border-ink-100">
              <button
                onClick={() => setInputMode("file")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  inputMode === "file" ? "bg-white text-brand-700 shadow-sm" : "text-ink-300 hover:text-ink-700"
                }`}
              >
                <Upload size={13} /> Drop Excel / PDF
              </button>
              <button
                onClick={() => setInputMode("text")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  inputMode === "text" ? "bg-white text-brand-700 shadow-sm" : "text-ink-300 hover:text-ink-700"
                }`}
              >
                <AlignLeft size={13} /> Paste Text
              </button>
            </div>
          </div>

          {inputMode === "file" ? (
            <FileUploadZone
              target="gstr3b"
              label="Drop Tally Excel sheet (.xlsx/.csv) or Invoice/Summary PDF"
              onDataParsed={handleParsedFromFile}
            />
          ) : (
            <div>
              <p className="text-xs text-ink-300 mb-3">Accepts Tally export, Excel summary, or plain text. Any format works.</p>
              <textarea
                className="input h-52 resize-none font-mono text-xs"
                placeholder="Paste transaction summary, Tally XML export, or free-form text…"
                value={raw}
                onChange={e => setRaw(e.target.value)}
              />
              {error && (
                <div className="mt-2 text-xs text-danger-text bg-danger-bg rounded-lg px-3 py-2 flex items-center gap-2">
                  <AlertTriangle size={13} /> {error}
                </div>
              )}
              <div className="flex items-center gap-3 mt-4">
                <button onClick={runAI} disabled={loading} className="btn-primary">
                  {loading ? <><span className="spinner" /> Processing…</> : <><Sparkles size={15} /> Fill GSTR-3B with AI</>}
                </button>
                <button onClick={() => setRaw(SAMPLE)} className="btn-secondary text-xs">
                  Load sample data
                </button>
              </div>
            </div>
          )}

          {log && <p className="text-xs text-ink-300 mt-3 italic">{log}</p>}
        </div>
      )}

      {/* Step 2 — Filled form */}
      {data && (
        <div className="space-y-5">
          {/* AI Notes */}
          {data.aiNotes && (
            <div className="bg-info-bg border border-info-border rounded-xl px-4 py-3 flex gap-3">
              <Info size={15} className="text-info-text mt-0.5 flex-shrink-0" />
              <p className="text-xs text-info-text leading-relaxed">{data.aiNotes}</p>
            </div>
          )}

          {/* Mismatches */}
          {data.mismatches?.length > 0 && (
            <div className="bg-danger-bg border border-danger-border rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-danger-text" />
                <span className="text-xs font-semibold text-danger-text">Potential mismatches detected</span>
              </div>
              <ul className="space-y-1">
                {data.mismatches.map((m, i) => (
                  <li key={i} className="text-xs text-danger-text flex gap-2">
                    <span>•</span><span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Success bar */}
          <div className="bg-success-bg border border-success-border rounded-xl px-4 py-3 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-success-text" />
            <span className="text-xs font-semibold text-success-text">All fields filled by AI — review and proceed to file</span>
          </div>

          {/* Taxpayer Details */}
          <div className="card p-6">
            <p className="section-head">Taxpayer details</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="GSTIN" value={data.gstin} mono />
              <Field label="Legal name" value={data.legalName} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tax period" value={data.period} />
              <Field label="Filing type" value={data.filingType} />
            </div>
          </div>

          {/* Table 3.1 */}
          <div className="card p-6">
            <p className="section-head">3.1 — Outward supplies & tax liability</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Field label="B2B taxable (₹)" value={fmt(data.b2bTaxable)} mono />
              <Field label="B2C taxable (₹)" value={fmt(data.b2cTaxable)} mono />
              <Field label="Export supplies (₹)" value={fmt(data.exportSupplies)} mono />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nil / exempt (₹)" value={fmt(data.nilExempt)} mono />
              <Field label="Reverse charge liability (₹)" value={fmt(data.reverseCharge)} mono />
            </div>
          </div>

          {/* Table 4 — ITC */}
          <div className="card p-6">
            <p className="section-head">Table 4 — Input tax credit (ITC)</p>
            <div className="grid grid-cols-3 gap-4">
              <Field label="ITC available — IGST (₹)" value={fmt(data.itcIGST)} mono />
              <Field label="ITC available — CGST (₹)" value={fmt(data.itcCGST)} mono />
              <Field label="ITC available — SGST (₹)" value={fmt(data.itcSGST)} mono />
            </div>
          </div>

          {/* Table 6 — Payment */}
          <div className="card p-6">
            <p className="section-head">Table 6 — Payment of tax</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Field label="IGST payable (₹)" value={fmt(data.igstPayable)} mono />
              <Field label="CGST payable (₹)" value={fmt(data.cgstPayable)} mono />
              <Field label="SGST payable (₹)" value={fmt(data.sgstPayable)} mono />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Interest (₹)" value={fmt(data.interest)} mono />
              <Field label="Late fee (₹)" value={fmt(data.lateFee)} mono />
            </div>
          </div>

          {/* Total */}
          <div className="card p-6 bg-brand-50 border-brand-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider">Net tax payable</p>
                <p className="text-3xl font-bold text-brand-700 mt-1">
                  {fmt(data.cgstPayable + data.sgstPayable + data.igstPayable + data.interest + data.lateFee)}
                </p>
                <p className="text-xs text-brand-400 mt-1">CGST + SGST + IGST + interest + late fee</p>
              </div>
              <a
                href="https://www.gst.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <ExternalLink size={14} /> File on GST Portal
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
