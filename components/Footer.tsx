import Link from "next/link";
import { Sparkles, Shield, Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300 border-t border-ink-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-ink-800/60">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
                <Sparkles size={18} />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">GSTGenius</span>
            </div>
            <p className="text-xs text-ink-400 leading-relaxed">
              The AI-Native Operating System for Indian Chartered Accountant practices. Automating GSTR-3B filings, litigation replies, TDS reconciliations, and SAC 9982 fee collections.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-xl w-fit">
              <Shield size={13} /> ICAI Compliance Ready & Supabase RLS Secured
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">CA-OS Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/gstr3b" className="hover:text-white transition">GSTR-3B AI Auto-Filler</Link></li>
              <li><Link href="/litigation" className="hover:text-white transition">Litigation SLA Tracker</Link></li>
              <li><Link href="/tds-reconcile" className="hover:text-white transition">Form 26AS & AIS Reconciler</Link></li>
              <li><Link href="/billing" className="hover:text-white transition">SAC 9982 Invoicing & UPI</Link></li>
              <li><Link href="/gstr9-audit" className="hover:text-white transition">GSTR-9/9C Annual Audit</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing Plans</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact & Demo</Link></li>
              <li><Link href="/settings" className="hover:text-white transition">Team Invite OS</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Sign In to Firm Portal</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Get in Touch</h4>
            <div className="flex items-center gap-2 text-xs">
              <Mail size={14} className="text-brand-400" /> support@gstgenius.in
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Phone size={14} className="text-brand-400" /> +91 (022) 4982-1000
            </div>
            <div className="flex items-start gap-2 text-xs leading-relaxed">
              <MapPin size={14} className="text-brand-400 shrink-0 mt-0.5" /> Nariman Point, Financial Hub, Mumbai - 400021
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-500">
          <p>© {new Date().getFullYear()} GSTGenius Inc. Built for Indian Chartered Accountant Practices.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-ink-300 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ink-300 transition">Terms of Service</Link>
            <Link href="/security" className="hover:text-ink-300 transition">Security & RLS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
