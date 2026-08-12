"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, FileText, Image as ImageIcon, CheckCircle2, AlertTriangle, X, Sparkles } from "lucide-react";

interface FileUploadZoneProps {
  onDataParsed: (data: any, fileName: string) => void;
  target: "gstr3b" | "notice";
  label?: string;
  acceptTypes?: string;
}

export function FileUploadZone({
  onDataParsed,
  target,
  label = "Upload Tally Excel, Notice PDF, or Document Scan",
  acceptTypes = ".pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp",
}: FileUploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(selectedFile: File | null) {
    if (!selectedFile) return;
    setError("");
    setFile(selectedFile);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  async function handleUploadAndParse() {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target", target);

      const res = await fetch("/api/parse-file", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || `Server returned error ${res.status}`);
      }

      onDataParsed(json.data, file.name);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not process file";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function getFileIcon(fileName: string) {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (["xlsx", "xls", "csv"].includes(ext)) return <FileSpreadsheet className="text-emerald-600" size={24} />;
    if (["png", "jpg", "jpeg", "webp"].includes(ext)) return <ImageIcon className="text-purple-600" size={24} />;
    return <FileText className="text-brand-600" size={24} />;
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
        accept={acceptTypes}
        className="hidden"
      />

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? "border-brand-500 bg-brand-50/70 scale-[1.01]"
              : "border-ink-200 hover:border-brand-400 hover:bg-ink-50/50 bg-white"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-3">
            <Upload size={22} className="text-brand-600" />
          </div>
          <p className="text-sm font-semibold text-ink-900">{label}</p>
          <p className="text-xs text-ink-300 mt-1">
            Drag & drop or <span className="text-brand-600 font-medium hover:underline">browse files</span>
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-ink-300 font-medium">
            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">.XLSX / .CSV</span>
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">.PDF</span>
            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">.PNG / .JPG Scans</span>
          </div>
        </div>
      ) : (
        <div className="card p-4 bg-white border border-brand-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-50 rounded-xl border border-brand-100">
                {getFileIcon(file.name)}
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-900">{file.name}</p>
                <p className="text-[11px] text-ink-300">{formatSize(file.size)} · Ready for AI OCR parsing</p>
              </div>
            </div>
            {!loading && (
              <button
                onClick={() => setFile(null)}
                className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-300 hover:text-ink-700 transition"
                title="Remove file"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {error && (
            <div className="mt-3 text-xs text-danger-text bg-danger-bg border border-danger-border rounded-xl px-3 py-2 flex items-center gap-2">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleUploadAndParse}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <span className="spinner" /> AI Multimodal Vision Reading File…
                </>
              ) : (
                <>
                  <Sparkles size={15} /> Parse File with AI Vision & OCR
                </>
              )}
            </button>

            <button
              onClick={() => setFile(null)}
              disabled={loading}
              className="btn-secondary text-xs"
            >
              Choose another file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
