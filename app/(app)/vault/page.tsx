"use client";
import { useState } from "react";
import { Vault, Upload, Search, FileText, Image, Key, Shield, Download, Trash2 } from "lucide-react";

const DOCS = [
  { id: 1, client: "Sunrise Traders Pvt Ltd",  type: "PAN",     name: "PAN_AABCU9603R.pdf",     size: "245 KB", uploaded: "12 Jan 2026", category: "identity" },
  { id: 2, client: "Sunrise Traders Pvt Ltd",  type: "GSTIN",   name: "GST_Certificate.pdf",     size: "380 KB", uploaded: "12 Jan 2026", category: "identity" },
  { id: 3, client: "Sunrise Traders Pvt Ltd",  type: "DSC",     name: "DSC_Director.pfx",        size: "12 KB",  uploaded: "05 Feb 2026", category: "signing" },
  { id: 4, client: "Metro Electricals",         type: "PAN",     name: "PAN_AAACM1234R.pdf",      size: "210 KB", uploaded: "20 Jan 2026", category: "identity" },
  { id: 5, client: "Metro Electricals",         type: "Photo",   name: "Director_Photo.jpg",      size: "480 KB", uploaded: "20 Jan 2026", category: "identity" },
  { id: 6, client: "Patel Exports LLP",         type: "Aadhaar", name: "Aadhaar_Partner1.pdf",    size: "520 KB", uploaded: "08 Mar 2026", category: "identity" },
  { id: 7, client: "Krishna Pharma",            type: "Bank",    name: "Bank_Statement_Mar26.pdf", size: "1.2 MB", uploaded: "01 Apr 2026", category: "financial" },
  { id: 8, client: "Global Fashions",           type: "Lease",   name: "Office_Lease_Deed.pdf",   size: "890 KB", uploaded: "15 Feb 2026", category: "legal" },
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
};

export default function VaultPage() {
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const filtered = DOCS.filter(d =>
    d.client.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase()) ||
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
            <Vault size={22} className="text-brand-600" /> Client Vault
          </h1>
          <p className="text-sm text-ink-300 mt-1">Encrypted secure storage for PAN, Aadhaar, DSC, photos &amp; financial documents</p>
        </div>
      </div>

      {/* Security badge */}
      <div className="mb-5 flex items-center gap-3 bg-success-bg border border-success-border rounded-xl px-4 py-3">
        <Shield size={16} className="text-success-text" />
        <div>
          <span className="text-sm font-semibold text-success-text">AES-256 encrypted</span>
          <span className="text-xs text-success-text ml-2">· All files encrypted at rest · Access logged · Secure pre-signed URLs only</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total documents", value: `${DOCS.length}` },
          { label: "Clients covered",  value: "4" },
          { label: "Storage used",     value: "3.9 MB" },
          { label: "Last upload",      value: "1 Apr" },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-xl font-bold text-ink-900">{s.value}</div>
            <div className="text-xs text-ink-300 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upload zone */}
      <div
        className={`mb-5 border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          dragOver ? "border-brand-400 bg-brand-50" : "border-ink-100 hover:border-brand-200 hover:bg-brand-50/30"
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); }}
      >
        <Upload size={24} className="mx-auto text-ink-200 mb-2" />
        <p className="text-sm font-medium text-ink-500">Drop files here or click to upload</p>
        <p className="text-xs text-ink-300 mt-1">PDF, JPG, PNG, PFX — max 10 MB per file</p>
        <button className="btn-secondary mt-4 text-xs">
          <Upload size={13} /> Choose files
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-200" />
        <input
          className="input pl-9"
          placeholder="Search by client, document type, or filename…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-ink-50/60">
            <tr>
              <th className="table-head">Document</th>
              <th className="table-head">Client</th>
              <th className="table-head">Type</th>
              <th className="table-head">Size</th>
              <th className="table-head">Uploaded</th>
              <th className="table-head">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {filtered.map(d => (
              <tr key={d.id} className="hover:bg-ink-50/40 transition-colors">
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    {d.name.endsWith(".jpg") || d.name.endsWith(".png")
                      ? <Image size={14} className="text-ink-300" />
                      : <FileText size={14} className="text-ink-300" />}
                    <span className="text-xs font-mono text-ink-700">{d.name}</span>
                  </div>
                </td>
                <td className="table-cell text-xs text-ink-500">{d.client}</td>
                <td className="table-cell">
                  <div className="flex items-center gap-1.5">
                    {CAT_ICONS[d.category]}
                    <span className={TYPE_BADGE[d.type]}>{d.type}</span>
                  </div>
                </td>
                <td className="table-cell text-xs text-ink-300">{d.size}</td>
                <td className="table-cell text-xs text-ink-300">{d.uploaded}</td>
                <td className="table-cell">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-ink-50 text-ink-300 hover:text-brand-600 transition-colors" title="Download">
                      <Download size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-ink-50 text-ink-300 hover:text-danger-text transition-colors" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
