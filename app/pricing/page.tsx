"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Check, ArrowRight, Sparkles, Zap, Building2, ShieldCheck } from "lucide-react";

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Starter CA Plan",
      desc: "For solo practitioners handling up to 25 GST clients",
      monthlyPrice: "₹1,499",
      annualPrice: "₹1,199",
      clients: "Up to 25 GSTIN Clients",
      staffSeats: "1 CA Partner Seat",
      features: [
        "GSTR-3B AI Auto-Filler & File OCR",
        "Official GSTN Portal JSON Exporter",
        "3-Way Reconciliation (GSTR-1 vs 3B vs 2B)",
        "Standard Client CRM Master",
        "Email Support",
      ],
      cta: "Start Starter Plan",
      popular: false,
    },
    {
      name: "Pro CA Firm OS",
      desc: "For growing CA firms handling 26–100 GST clients",
      monthlyPrice: "₹3,499",
      annualPrice: "₹2,799",
      clients: "Up to 100 GSTIN Clients",
      staffSeats: "Up to 10 Staff Seats (Maker-Checker)",
      features: [
        "Everything in Starter Plan",
        "DRC-01 & ASMT-10 Notice Reply Drafter",
        "Litigation SLA 7-Day Countdown Tracker",
        "Form 26AS & AIS TDS Reconciliation Engine",
        "Full-Year GSTR-9 & 9C Annual Audit Helper",
        "SAC 9982 Billing, Razorpay & UPI Links",
        "Article Clerk Hours Profitability Analytics",
        "Client Self-Service Magic Link Portal",
      ],
      cta: "Launch Pro Firm OS",
      popular: true,
    },
    {
      name: "Enterprise Practice OS",
      desc: "For mid-to-large multi-branch CA partnerships",
      monthlyPrice: "₹7,999",
      annualPrice: "₹6,399",
      clients: "Unlimited GSTIN Clients",
      staffSeats: "Unlimited Partner & Staff Seats",
      features: [
        "Everything in Pro Plan",
        "Multi-Branch ICAI FRN Management",
        "Custom Supabase Dedicated Database Tenant",
        "Dedicated CA Legal Account Manager",
        "Priority 24/7 Phone & WhatsApp Support",
      ],
      cta: "Contact Enterprise Sales",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-ink-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-brand-950 to-slate-900 text-white py-16 lg:py-24 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-300">Transparent CA Practice Pricing</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Predictable Pricing Built for Every CA Firm
            </h1>
            <p className="text-sm sm:text-base text-ink-300 max-w-2xl mx-auto">
              No hidden per-return fees. Flat monthly or annual billing per firm workspace.
            </p>

            {/* Toggle */}
            <div className="pt-6 flex items-center justify-center gap-3">
              <span className={`text-xs font-semibold ${!annual ? "text-white font-bold" : "text-ink-400"}`}>Monthly Billing</span>
              <button
                onClick={() => setAnnual(!annual)}
                className="w-14 h-8 bg-brand-600 rounded-full p-1 transition-colors relative"
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-transform ${annual ? "translate-x-6" : ""}`} />
              </button>
              <span className={`text-xs font-semibold flex items-center gap-1.5 ${annual ? "text-white font-bold" : "text-ink-400"}`}>
                Annual Billing <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">Save 20%</span>
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p, idx) => (
              <div
                key={idx}
                className={`card p-6 sm:p-8 bg-white border flex flex-col justify-between relative ${
                  p.popular ? "border-brand-500 shadow-xl ring-2 ring-brand-500/20" : "border-ink-100"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    Most Popular CA Firm Choice
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-ink-900">{p.name}</h3>
                    <p className="text-xs text-ink-300 mt-1">{p.desc}</p>
                  </div>

                  <div className="py-2 border-y border-ink-100">
                    <div className="text-3xl font-extrabold text-ink-900 font-mono">
                      {annual ? p.annualPrice : p.monthlyPrice} <span className="text-xs font-sans text-ink-300 font-normal">/ month</span>
                    </div>
                    <p className="text-[11px] text-ink-400 mt-0.5 font-mono">{p.clients} · {p.staffSeats}</p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-ink-700">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-ink-100">
                  <Link
                    href="/dashboard"
                    className={`w-full justify-center text-xs sm:text-sm py-3 ${p.popular ? "btn-primary" : "btn-secondary"}`}
                  >
                    {p.cta} <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
