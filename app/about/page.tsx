import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Building2, ShieldCheck, Sparkles, Users, Award, Target, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-ink-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-brand-950 to-slate-900 text-white py-16 lg:py-24 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-300">About GSTGenius</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Empowering Indian CA Practices with AI-Native Automation
            </h1>
            <p className="text-sm sm:text-base text-ink-300 max-w-2xl mx-auto leading-relaxed">
              We built GSTGenius to solve the daily operational pain of Indian Chartered Accountants: client data chasing, last-minute filing rushes, scrutiny notices, and uncollected fees.
            </p>
          </div>
        </section>

        {/* Mission & Vision Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 sm:p-8 bg-white border border-ink-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <Target size={20} />
              </div>
              <h3 className="text-lg font-bold text-ink-900">Our Mission</h3>
              <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
                To reclaim 80%+ of time spent by Article Clerks and CA Partners on repetitive data extraction and manual portal uploads, letting them focus on high-value legal advisory.
              </p>
            </div>

            <div className="card p-6 sm:p-8 bg-white border border-ink-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-ink-900">Statutory Integrity</h3>
              <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
                Every calculation, GSTN JSON export, and notice response is grounded in official CGST/IGST Acts 2017, CBIC Circulars, and Modulo-36 GSTIN validation algorithms.
              </p>
            </div>

            <div className="card p-6 sm:p-8 bg-white border border-ink-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Users size={20} />
              </div>
              <h3 className="text-lg font-bold text-ink-900">Maker-Checker OS</h3>
              <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
                Built explicitly for CA firm team dynamics: Article Clerks prepare data (Makers) while CA Partners sign off and approve filings (Checkers).
              </p>
            </div>
          </div>

          {/* Technology Architecture Section */}
          <div className="card p-8 bg-white border border-ink-100 space-y-6">
            <h2 className="text-xl font-bold text-ink-900 flex items-center gap-2">
              <Sparkles size={20} className="text-brand-600" />
              Engineered with Gemini 2.5 Flash & Claude AI
            </h2>
            <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
              GSTGenius leverages a multi-provider AI architecture (`lib/ai.ts`) combining Google Gemini 2.5 Flash for multimodal PDF/OCR document parsing with Anthropic Claude for legal notice drafting under CGST Act Section 16(2) and Section 73.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-ink-50 text-ink-700">Next.js 14 App Router</div>
              <div className="p-3 rounded-xl bg-ink-50 text-ink-700">Tailwind CSS System</div>
              <div className="p-3 rounded-xl bg-ink-50 text-ink-700">Supabase RLS Security</div>
              <div className="p-3 rounded-xl bg-ink-50 text-ink-700">Official GSTN Portal JSON</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-12 text-center border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <h2 className="text-2xl font-bold">Experience the Future of CA Practice OS</h2>
            <div className="flex justify-center gap-4">
              <Link href="/dashboard" className="btn-primary text-sm py-2.5 px-6">
                Launch CA-OS Workspace <ArrowRight size={15} />
              </Link>
              <Link href="/login" className="btn-secondary text-sm py-2.5 px-6 bg-white/10 text-white border-white/20">
                Sign In to Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
