"use client";

import { useState } from "react";
import { MessageSquare, Mail, Copy, Check, Send, X, FileCheck, Calendar } from "lucide-react";

interface ClientReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName?: string;
  clientPhone?: string;
  gstin?: string;
}

export function ClientReminderModal({
  isOpen,
  onClose,
  clientName = "Client",
  clientPhone = "",
  gstin = "27AABCU9603R1ZM",
}: ClientReminderModalProps) {
  const [returnType, setReturnType] = useState("GSTR-3B & GSTR-1");
  const [period, setPeriod] = useState("March 2026");
  const [dueDate, setDueDate] = useState("20th July 2026");
  const [includeSales, setIncludeSales] = useState(true);
  const [includePurchase, setIncludePurchase] = useState(true);
  const [includeBank, setIncludeBank] = useState(true);
  const [includeEway, setIncludeEway] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build formatted WhatsApp message
  const whatsappMessage = `Dear *${clientName}*,

Greetings from *Sharma & Associates (CA Firm)*.

This is a gentle reminder regarding your upcoming *${returnType}* return filing for the period *${period}* (Due Date: *${dueDate}*).

To avoid last-minute portal rush and late filing fees, kindly share the following documents with us:
${includeSales ? "• Sales Register / Invoices (B2B & B2C)\n" : ""}${includePurchase ? "• Purchase Register & Vendor Tax Invoices\n" : ""}${includeBank ? "• Bank Statement (PDF)\n" : ""}${includeEway ? "• E-Way Bills Summary\n" : ""}
You can reply directly to this message with the files or email them to *ca@cafirm.in*.

Thank you,
*Sharma & Associates*
GST & Tax Advisory Practice`;

  function handleCopy() {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleOpenWhatsApp() {
    const encoded = encodeURIComponent(whatsappMessage);
    const cleanPhone = clientPhone.replace(/[^0-9]/g, "");
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, "_blank");
  }

  return (
    <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg p-6 bg-white shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-ink-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink-900">Send WhatsApp Data Reminder</h2>
              <p className="text-xs text-ink-300">Automated submission request for {clientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-ink-100 text-ink-300">
            <X size={16} />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Filing Type</label>
              <select className="input" value={returnType} onChange={(e) => setReturnType(e.target.value)}>
                <option value="GSTR-3B & GSTR-1">GSTR-3B & GSTR-1</option>
                <option value="GSTR-1">GSTR-1</option>
                <option value="GSTR-3B">GSTR-3B</option>
                <option value="TDS 24Q/26Q">TDS 24Q/26Q</option>
              </select>
            </div>
            <div>
              <label className="label">Return Period</label>
              <input className="input" value={period} onChange={(e) => setPeriod(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label mb-2">Request Checklist Documents</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 border rounded-xl hover:bg-ink-50 cursor-pointer">
                <input type="checkbox" checked={includeSales} onChange={(e) => setIncludeSales(e.target.checked)} />
                <span>Sales Register (B2B & B2C)</span>
              </label>
              <label className="flex items-center gap-2 p-2 border rounded-xl hover:bg-ink-50 cursor-pointer">
                <input type="checkbox" checked={includePurchase} onChange={(e) => setIncludePurchase(e.target.checked)} />
                <span>Purchase Register & Invoices</span>
              </label>
              <label className="flex items-center gap-2 p-2 border rounded-xl hover:bg-ink-50 cursor-pointer">
                <input type="checkbox" checked={includeBank} onChange={(e) => setIncludeBank(e.target.checked)} />
                <span>Bank Statement (PDF)</span>
              </label>
              <label className="flex items-center gap-2 p-2 border rounded-xl hover:bg-ink-50 cursor-pointer">
                <input type="checkbox" checked={includeEway} onChange={(e) => setIncludeEway(e.target.checked)} />
                <span>E-Way Bills Summary</span>
              </label>
            </div>
          </div>

          {/* Generated Message Preview */}
          <div>
            <label className="label flex items-center justify-between">
              <span>Formatted Message Preview</span>
              <span className="text-[10px] text-emerald-700 font-semibold">WhatsApp Ready</span>
            </label>
            <textarea
              readOnly
              className="input h-36 resize-none font-mono text-[11px] bg-emerald-50/40 border-emerald-200 text-emerald-950 p-3"
              value={whatsappMessage}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-ink-100">
          <button onClick={handleCopy} className="btn-secondary text-xs">
            {copied ? <><Check size={14} className="text-emerald-600" /> Copied</> : <><Copy size={14} /> Copy Message</>}
          </button>
          <button onClick={handleOpenWhatsApp} className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-xs">
            <Send size={14} /> Open in WhatsApp Direct
          </button>
        </div>
      </div>
    </div>
  );
}
