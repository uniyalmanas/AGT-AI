"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, GitMerge,
  AlertCircle, Vault, Settings, Sparkles, ChevronRight, LogOut, Scale, CheckSquare, ShieldAlert,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks",      icon: CheckSquare,     label: "Compliance Tasks" },
  { href: "/litigation", icon: ShieldAlert,     label: "Litigation Tracker" },
  { href: "/clients",    icon: Users,            label: "Clients" },
  { href: "/gstr3b",     icon: FileText,         label: "GSTR-3B Filler" },
  { href: "/reconcile",  icon: GitMerge,         label: "Reconciliation" },
  { href: "/notices",    icon: AlertCircle,      label: "Notice Reader" },
  { href: "/copilot",    icon: Scale,            label: "GST Law Copilot" },
  { href: "/vault",      icon: Vault,            label: "Client Vault" },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-ink-100 flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-ink-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-ink-900 leading-none">GSTGenius</div>
            <div className="text-[10px] text-ink-300 mt-0.5">AI Filing Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="section-head px-3 mb-2">Main menu</p>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path.startsWith(href);
          return (
            <Link key={href} href={href} className={`nav-link ${active ? "active" : ""}`}>
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="text-brand-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-ink-100 space-y-0.5">
        <Link href="/settings" className={`nav-link ${path === "/settings" ? "active" : ""}`}>
          <Settings size={16} />
          <span>Settings</span>
        </Link>
        <button onClick={handleLogout} className="nav-link w-full text-left">
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
        <div className="mt-3 px-3 py-3 rounded-xl bg-brand-50 border border-brand-100">
          <div className="text-xs font-semibold text-brand-700 mb-0.5">Pro Plan</div>
          <div className="text-[11px] text-brand-500">100 GSTINs · ₹2,999/mo</div>
          <div className="mt-2 w-full bg-brand-100 rounded-full h-1">
            <div className="bg-brand-500 h-1 rounded-full" style={{ width: "42%" }} />
          </div>
          <div className="text-[10px] text-brand-400 mt-1">42 / 100 GSTINs used</div>
        </div>
      </div>
    </aside>
  );
}
