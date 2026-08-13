"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, GitMerge,
  AlertCircle, Vault, Settings, Sparkles, ChevronRight, LogOut, Scale, CheckSquare, ShieldAlert, CreditCard, GitCompare, FileCheck, Globe, Menu, X, UserCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks",         icon: CheckSquare,     label: "Compliance Tasks" },
  { href: "/litigation",    icon: ShieldAlert,     label: "Litigation Tracker" },
  { href: "/billing",       icon: CreditCard,      label: "Firm Billing & Profit" },
  { href: "/settings",      icon: UserCheck,       label: "Team & Staff Invites" },
  { href: "/tds-reconcile", icon: GitCompare,      label: "TDS 26AS/AIS Checker" },
  { href: "/gstr9-audit",   icon: FileCheck,       label: "GSTR-9/9C Audit" },
  { href: "/client-portal", icon: Globe,           label: "Client Portal" },
  { href: "/clients",       icon: Users,            label: "Clients" },
  { href: "/gstr3b",        icon: FileText,         label: "GSTR-3B Filler" },
  { href: "/reconcile",     icon: GitMerge,         label: "Reconciliation" },
  { href: "/notices",       icon: AlertCircle,      label: "Notice Reader" },
  { href: "/copilot",       icon: Scale,            label: "GST Law Copilot" },
  { href: "/vault",         icon: Vault,            label: "Client Vault" },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header with Brand & Top Log Out Button */}
      <div className="px-5 py-5 border-b border-ink-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-ink-900 leading-none">GSTGenius</div>
            <div className="text-[10px] text-ink-300 mt-0.5">CA Practice OS</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-ink-400 hover:text-red-600 hover:bg-red-50 transition"
            title="Log out of firm portal"
          >
            <LogOut size={16} />
          </button>
          <button onClick={() => setMobileOpen(false)} className="md:hidden p-1 rounded-lg text-ink-400 hover:bg-ink-50">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="section-head px-3 mb-2">Main menu</p>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`nav-link ${active ? "active" : ""}`}
            >
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="text-brand-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-ink-100 space-y-0.5">
        <Link href="/settings" onClick={() => setMobileOpen(false)} className={`nav-link ${path === "/settings" ? "active" : ""}`}>
          <Settings size={16} />
          <span>Settings</span>
        </Link>
        <button onClick={handleLogout} className="nav-link w-full text-left text-red-600 hover:bg-red-50">
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
        <div className="mt-3 px-3 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="text-xs font-semibold text-emerald-800 mb-0.5">🎁 Pilot Partner Pass</div>
          <div className="text-[11px] font-medium text-emerald-700">Full CA OS Unlocked · 100% Free</div>
          <div className="text-[10px] text-emerald-600 mt-1">Zero payment required for early CA pilots</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-ink-100 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm text-ink-900">GSTGenius</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-semibold transition"
          >
            <LogOut size={13} /> Log Out
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl border border-ink-100 text-ink-700 bg-ink-50 hover:bg-ink-100 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-ink-900/50 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10">
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar (hidden on mobile/tablet) */}
      <aside className="hidden md:flex w-60 flex-shrink-0 border-r border-ink-100 flex-col h-full bg-white">
        <NavContent />
      </aside>
    </>
  );
}
