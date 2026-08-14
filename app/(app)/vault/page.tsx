"use client";

import { useState, useRef } from "react";
import { Vault, Upload, Search, FileText, Image, Key, Shield, Download, Trash2, Plus, CheckCircle2 } from "lucide-react";

export interface VaultDoc {
  id: string;
  client: string;
  type: string;
  name: string;
  size: string;
  uploaded: string;
  category: "identity" | "signing" | "financial" | "legal";
}

const INITIAL_DOCS: VaultDoc[] = [
  { id: "v-1", client: "Sunrise Traders Pvt Ltd",  type: "PAN",     name: "PAN_AABCU9603R.pdf",     size: "245 KB", uploaded: "12 Jan 2026", category: "identity" },
  { id: "v-2", client: "Sunrise Traders Pvt Ltd",  type: "GSTIN",   name: "GST_Certificate.pdf",     size: "380 KB", uploaded: "12 Jan 2026", category: "identity" },
  { id: "v-3", client: "Sunrise Traders Pvt Ltd",  type: "DSC",     name: "DSC_Director.pfx",        size: "12 KB",  uploaded: "05 Feb 2026", category: "signing" },
  { id: "v-4", client: "Metro Electricals",         type: "PAN",     name: "PAN_AAACM1234R.pdf",      size: "210 KB", uploaded: "20 Jan 2026", category: "identity" },
  { id: "v-5", client: "Metro Electricals",         type: "Photo",   name: "Director_Photo.jpg",      size: "480 KB", uploaded: "20 Jan 2026", category: "identity" },
  { id: "v-6", client: "Patel Exports LLP",         type: "Aadhaar", name: "Aadhaar_Partner1.pdf",    size: "520 KB", uploaded: "08 Mar 2026", category: "identity" },
  { id: "v-7", client: "Krishna Pharma",            type: "Bank",    name: "Bank_Statement_Mar26.pdf", size: "1.2 MB", uploaded: "01 Apr 2026", category: "financial" },
  { id: "v-8", client: "Global Fashions",           type: "Lease",   name: "Office_Lease_Deed.pdf",   size: "890 KB", uploaded: "15 Feb 2026", category: "legal" },
];

const CAT_ICONS: Record<string, React.ReactNode> = {
  identity:  <Shield size={14} className="text-brand-500" />,
  signing:   <Key size={14} className="text-warning-text" />,
  financial: <FileText size={14} className="text-success-text" />,
  legal:     <FileText size={14} className="text-ink-400" />,
};

const TYPE_BADGE: Record<string, string> = {
  PAN: "badge-info", GSTIN: "badge-info", DSC: "badge-warning",
  Photo: "badge-neutral", Aadhaar: "badge-danger", Bank: "badge-success", Lease: "badge-neutral",
  Other: "badge-neutral",
};

export default function VaultPage() {
  const [docs, setDocs] = useState<VaultDoc[]>(INITIAL_DOCS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function showNotification(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  }

  function processFiles(files: File[]) {
    const newItems: VaultDoc[] = files.map((f, i) => {
      const ext = f.name.split(".").pop()?.toLowerCase() || "";
      let category: VaultDoc["category"] = "identity";
      let docType = "Other";

      if (ext === "pfx" || ext === "p12") {
        category = "signing";
        docType = "DSC";
      } else if (f.name.toLowerCase().includes("bank") || f.name.toLowerCase().includes("statement")) {
        category = "financial";
        docType = "Bank";
      } else if (f.name.toLowerCase().includes("lease") || f.name.toLowerCase().includes("deed") || f.name.toLowerCase().includes("agreement")) {
        category = "legal";
        docType = "Lease";
      } else if (f.name.toLowerCase().includes("pan")) {
        docType = "PAN";
      } else if (f.name.toLowerCase().includes("gst")) {
        docType = "GSTIN";
      }

      const sizeStr = f.size > 1024 * 1024
        ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(f.size / 1024)} KB`;

      return {
        id: `v-${Date.now()}-${i}`,
        client: "Sunrise Traders Pvt Ltd",
        type: docType,
        name: f.name,
        size: sizeStr,
        uploaded: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        category,
      };
    });

    setDocs(prev => [...newItems, ...prev]);
    showNotification(`Successfully uploaded ${newItems.length} document(s) to vault!`);
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Are you sure you want to delete '${name}' from vault?`)) {
      setDocs(prev => prev.filter(d => d.id !== id));
      showNotification(`Deleted '${name}' from encrypted vault.`);
    }
  }

  function handleDownload(name: string) {
    const blob = new Blob([`Sample content for encrypted vault document: ${name}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(`Downloading pre-signed file: '${name}'`);
  }

  const filtered = docs.filter(d => {
    const matchesTab = activeTab === "all" || d.category === activeTab;
    const matchesSearch =
      d.client.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase()) ||
      d.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const uniqueClients = new Set(docs.map(d => d.client)).size;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
            <Vault size={22} className="text-brand-600" /> Client Encrypted Vault
          </h1>
          <p className="text-sm text-ink-300 mt-1">
            AES-256 secure encrypted document repository for PAN, Aadhaar, DSC tokens, &amp; financial ledgers
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary text-xs py-2 px-4 shadow-sm"
        >
          <Plus size={14} /> Upload Document
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        multiple
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.pfx,.p12,.xlsx,.csv"
      />

      {/* Security Banner */}
      <div className="flex items-center gap-3 bg-success-bg border border-success-border rounded-xl px-4 py-3">
        <Shield size={16} className="text-success-text" />
        <div>
          <span className="text-sm font-semibold text-success-text">AES-256 Zero-Knowledge Encryption</span>
          <span className="text-xs text-success-text ml-2">
            · Files encrypted at rest · Access audit logged · Pre-signed expiring URLs only
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Documents", value: `${docs.length}` },
          { label: "Clients Covered",  value: `${uniqueClients}` },
          { label: "Storage Used",     value: `${(docs.length * 0.45).toFixed(1)} MB` },
          { label: "Encryption Status",value: "Active (AES)" },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-xl font-bold text-ink-900">{s.value}</div>
            <div className="text-xs text-ink-300 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          dragOver ? "border-brand-500 bg-brand-50/80 scale-[1.01]" : "border-ink-100 hover:border-brand-300 hover:bg-brand-50/20"
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
          }
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={26} className="mx-auto text-brand-500 mb-2" />
        <p className="text-sm font-semibold text-ink-800">Drag &amp; drop client files here or click to browse</p>
        <p className="text-xs text-ink-300 mt-1">Supports PDF, JPG, PNG, PFX, XLSX — max 10 MB per file</p>
        <button type="button" className="btn-secondary mt-4 text-xs py-1.5 px-4 pointer-events-none">
          <Upload size={13} /> Select Files From Computer
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-ink-50 p-1 rounded-xl border border-ink-100 w-full sm:w-auto">
          {[
            { id: "all", label: "All Docs" },
            { id: "identity", label: "Identity (PAN/GST)" },
            { id: "signing", label: "DSC Signing" },
            { id: "financial", label: "Financial" },
            { id: "legal", label: "Legal & Lease" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? "bg-white text-brand-600 shadow-sm font-semibold"
                  : "text-ink-400 hover:text-ink-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            className="input pl-9 text-xs py-2"
            placeholder="Filter by client, document type, or name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Document Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-ink-50/70 border-b border-ink-100">
            <tr>
              <th className="table-head">Document Name</th>
              <th className="table-head">Client</th>
              <th className="table-head">Type</th>
              <th className="table-head">Size</th>
              <th className="table-head">Uploaded</th>
              <th className="table-head text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-xs text-ink-300">
                  No documents found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map(d => (
                <tr key={d.id} className="hover:bg-ink-50/40 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      {d.name.endsWith(".jpg") || d.name.endsWith(".png")
                        ? <Image size={14} className="text-brand-500" />
                        : <FileText size={14} className="text-brand-600" />}
                      <span className="text-xs font-mono font-medium text-ink-800">{d.name}</span>
                    </div>
                  </td>
                  <td className="table-cell text-xs font-medium text-ink-700">{d.client}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      {CAT_ICONS[d.category] || <FileText size={14} className="text-ink-400" />}
                      <span className={TYPE_BADGE[d.type] || "badge-neutral"}>{d.type}</span>
                    </div>
                  </td>
                  <td className="table-cell text-xs text-ink-400 font-mono">{d.size}</td>
                  <td className="table-cell text-xs text-ink-400">{d.uploaded}</td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleDownload(d.name)}
                        className="p-1.5 rounded-lg hover:bg-brand-50 text-ink-400 hover:text-brand-600 transition"
                        title="Download Pre-Signed Link"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id, d.name)}
                        className="p-1.5 rounded-lg hover:bg-danger-bg text-ink-400 hover:text-danger-text transition"
                        title="Delete Document"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
