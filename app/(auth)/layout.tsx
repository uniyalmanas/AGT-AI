import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

// Layout for auth pages (login / register) — centered card with link back to website.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-8 relative">
      {/* Top back to website header */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-400 hover:text-brand-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-ink-100 shadow-sm"
        >
          <ArrowLeft size={14} /> Back to Website Home
        </Link>
      </div>

      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <Sparkles size={20} />
        </div>
        <div>
          <div className="text-lg font-extrabold text-ink-900 leading-none">GSTGenius</div>
          <div className="text-[11px] font-medium text-ink-400 mt-0.5">AI Operating System for CA Firms</div>
        </div>
      </div>

      {children}
    </div>
  );
}
