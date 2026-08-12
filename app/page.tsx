"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles, ShieldCheck, ArrowRight, CheckCircle2, FileText, Scale, GitCompare, CreditCard, CheckSquare,
  Building2, Users, AlertTriangle, Play, ChevronRight, Star, Zap, Clock, ShieldAlert, FileCheck
} from "lucide-react";

export default function HomePage() {
  const [clientCount, setClientCount] = useState(50);

  // ROI calculations
  const hoursSavedPerMonth = clientCount * 3.5; // ~3.5 hours saved per client per month
  const moneySavedPerMonth = hoursSavedPerMonth * 750; // ₹750/hr billable CA time

  return (
    <div className="min-h-screen bg-slate-50 text-ink-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-950 via-ink-950 to-slate-900 text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
          {/* Subtle Background Radial Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-inner">
                <Sparkles size={16} className="text-brand-400" />
                <span>Next-Gen CA Practice OS · Powered by Gemini 2.5 & Claude</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none text-white">
                The AI-Native Operating System for <span className="bg-gradient-to-r from-brand-300 via-brand-100 to-emerald-300 bg-clip-text text-transparent">Indian CA Practices</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-xl text-ink-300 leading-relaxed font-normal max-w-2xl mx-auto">
                Automate GSTR-3B return prep, DRC-01 notice reply drafting, Form 26AS/AIS TDS reconciliations, and SAC 9982 fee collections in one unified workspace.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="btn-primary text-base sm:text-lg py-3.5 px-8 w-full sm:w-auto justify-center shadow-lg shadow-brand-500/30 hover:scale-105 transition-all"
                >
                  Launch CA-OS Workspace <ArrowRight size={18} />
                </Link>
                <Link
                  href="/login"
                  className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 text-base sm:text-lg py-3.5 px-8 w-full sm:w-auto justify-center backdrop-blur-sm"
                >
                  Sign In to Account
                </Link>
              </div>

              {/* Trust Callouts */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-ink-400 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-400" /> 100% ICAI Compliance Ready</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-400" /> Official GSTN JSON Exporter</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-400" /> PostgreSQL Supabase RLS Security</span>
              </div>
            </div>

            {/* Interactive Mock Platform Preview Card */}
            <div className="mt-12 sm:mt-16 max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-white/20 to-white/5 border border-white/20 shadow-2xl backdrop-blur-xl">
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-mono text-slate-400 ml-2">gstgenius.in/dashboard</span>
                  </div>
                  <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">✓ LIVE WORKSPACE PREVIEW</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-400">Total Active Clients</span>
                    <div className="text-xl font-bold font-mono text-white mt-1">42 Clients</div>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-400">Returns Filed (MTD)</span>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">138 / 168</div>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-400">Active Notice SLA</span>
                    <div className="text-xl font-bold font-mono text-red-400 mt-1">4 Notices</div>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-400">Uncollected SAC 9982 Fees</span>
                    <div className="text-xl font-bold font-mono text-brand-300 mt-1">₹1,85,000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS & TRUSTED BY CA FIRMS BAR */}
        <section className="bg-white border-y border-ink-100 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl sm:text-4xl font-extrabold text-brand-600 font-mono">90%+</div>
                <div className="text-xs sm:text-sm text-ink-400 font-medium mt-1">Faster Return Preparation</div>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-extrabold text-brand-600 font-mono">₹2.5L+</div>
                <div className="text-xs sm:text-sm text-ink-400 font-medium mt-1">Avg Annual Time Saved per CA</div>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-extrabold text-brand-600 font-mono">100%</div>
                <div className="text-xs sm:text-sm text-ink-400 font-medium mt-1">Official GSTN Portal JSON Schema</div>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-extrabold text-brand-600 font-mono">7-Day</div>
                <div className="text-xs sm:text-sm text-ink-400 font-medium mt-1">Litigation SLA Countdown Alerts</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 PILLARS FEATURE MATRIX */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">Built Specifically For Indian CA Practices</h2>
              <p className="text-2xl sm:text-4xl font-extrabold text-ink-900 tracking-tight">Everything your CA Firm needs in 4 Integrated Pillars</p>
              <p className="text-sm sm:text-base text-ink-300">Replace scattered Excel files and WhatsApp group chats with structured AI workflows.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pillar 1 */}
              <div className="card p-6 sm:p-8 bg-white border border-ink-100 space-y-4 hover:border-brand-300 transition-all hover:shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold text-ink-900">1. GSTR-3B AI Auto-Filler & GSTN JSON Exporter</h3>
                <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
                  Drag & drop Tally Excel sheets, invoice PDFs, or text dumps. AI extracts taxable figures, computes CGST/SGST/IGST liability, nets off ITC, and exports 1-click official government JSON ready for direct upload on <span className="font-semibold text-ink-700">gst.gov.in</span>.
                </p>
                <Link href="/gstr3b" className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1">
                  Try GSTR-3B Filler →
                </Link>
              </div>

              {/* Pillar 2 */}
              <div className="card p-6 sm:p-8 bg-white border border-ink-100 space-y-4 hover:border-brand-300 transition-all hover:shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                  <ShieldAlert size={24} />
                </div>
                <h3 className="text-xl font-bold text-ink-900">2. DRC-01 Notice Reader & SLA Countdown Board</h3>
                <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
                  Upload scary DRC-01 or ASMT-10 scrutiny notices. Receive 3-sentence plain-English explanations for clients, formal legal reply letters under Section 16(2) and 73, and real-time 7-day countdown SLA alerts.
                </p>
                <Link href="/litigation" className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1">
                  Try Litigation SLA Board →
                </Link>
              </div>

              {/* Pillar 3 */}
              <div className="card p-6 sm:p-8 bg-white border border-ink-100 space-y-4 hover:border-brand-300 transition-all hover:shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <GitCompare size={24} />
                </div>
                <h3 className="text-xl font-bold text-ink-900">3. Form 26AS & AIS TDS Reconciliation Engine</h3>
                <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
                  Auto-match Books TDS registers against Form 26AS Part A/A1 and AIS/TIS entries before ITR filing to claim full tax refunds and prevent Section 143(1) mismatch notices.
                </p>
                <Link href="/tds-reconcile" className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1">
                  Try TDS Reconciler →
                </Link>
              </div>

              {/* Pillar 4 */}
              <div className="card p-6 sm:p-8 bg-white border border-ink-100 space-y-4 hover:border-brand-300 transition-all hover:shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-xl font-bold text-ink-900">4. SAC 9982 Invoicing & Staff Profitability</h3>
                <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
                  Generate GST-compliant professional fee invoices under SAC Code 9982 with Razorpay payment URLs & UPI QR codes. Track Article Clerk hours logged vs monthly retainers to catch loss-making clients.
                </p>
                <Link href="/billing" className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1">
                  Try SAC 9982 Billing →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CA PRACTICE ROI CALCULATOR */}
        <section className="py-20 bg-white border-t border-ink-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card p-6 sm:p-10 bg-gradient-to-br from-brand-900 to-ink-950 text-white rounded-3xl space-y-8 shadow-xl">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-300">Practice ROI Calculator</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold">Calculate Time & Cost Saved for Your CA Firm</h2>
                <p className="text-xs sm:text-sm text-ink-300">Drag the slider to see monthly hours saved across your client portfolio</p>
              </div>

              <div className="space-y-4 max-w-xl mx-auto">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Number of GST & Tax Clients:</span>
                  <span className="text-emerald-300 font-mono text-lg">{clientCount} Clients</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={clientCount}
                  onChange={(e) => setClientCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-[11px] text-ink-400">
                  <span>10 Clients</span>
                  <span>100 Clients</span>
                  <span>200+ Clients</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-center">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-ink-300">Monthly Hours Saved</span>
                  <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">{hoursSavedPerMonth} Hours / mo</div>
                  <span className="text-[11px] text-ink-400">Article Clerk & Partner labor reclaimed</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-ink-300">Estimated Value of Time Saved</span>
                  <div className="text-3xl font-extrabold font-mono text-brand-300 mt-1">₹{moneySavedPerMonth.toLocaleString("en-IN")} / mo</div>
                  <span className="text-[11px] text-ink-400">Based on ₹750/hr billable CA time</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <Link href="/dashboard" className="btn-primary text-sm py-3 px-6 inline-flex">
                  Start Reclaiming Practice Time <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="py-20 bg-slate-900 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Upgrade Your CA Practice to AI-Native Speed?
            </h2>
            <p className="text-base sm:text-lg text-ink-300 max-w-2xl mx-auto">
              Join hundreds of Chartered Accountants who manage compliance, litigation, and fee billing in one seamless platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard" className="btn-primary text-base py-3.5 px-8 w-full sm:w-auto justify-center">
                Launch CA-OS Workspace <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 text-base py-3.5 px-8 w-full sm:w-auto justify-center">
                Schedule a Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
