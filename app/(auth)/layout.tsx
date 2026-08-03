import { Sparkles } from "lucide-react";

// Layout for unauthenticated pages (login / register) — centered card, no sidebar.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink-50 px-4">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <div className="text-base font-bold text-ink-900 leading-none">GSTGenius</div>
          <div className="text-[11px] text-ink-300 mt-0.5">AI Filing Platform for CA Firms</div>
        </div>
      </div>
      {children}
    </div>
  );
}
