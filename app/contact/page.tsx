"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle2, Building2, Sparkles } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    firmName: "",
    email: "",
    icaiFrn: "",
    phone: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-ink-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-brand-950 to-slate-900 text-white py-16 lg:py-20 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-300">Contact & Live Demo</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Get in Touch with Our CA Legal & Technical Team
            </h1>
            <p className="text-sm sm:text-base text-ink-300 max-w-xl mx-auto">
              Schedule a 1-on-1 walkthrough for your firm or speak with our GST legal automation specialists.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-ink-900">GSTGenius HQ & Office Locations</h2>
                <p className="text-xs sm:text-sm text-ink-300 mt-1">Our technical engineering & tax legal advisory teams are based across major financial centers.</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="card p-4 bg-white border border-ink-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-900">Mumbai Financial Center (HQ)</h3>
                    <p className="text-ink-400 text-xs mt-0.5">Level 12, Maker Chambers V, Nariman Point, Mumbai - 400021</p>
                  </div>
                </div>

                <div className="card p-4 bg-white border border-ink-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-900">Direct Email Enquiries</h3>
                    <p className="text-ink-400 text-xs mt-0.5 font-mono">support@gstgenius.in · demo@gstgenius.in</p>
                  </div>
                </div>

                <div className="card p-4 bg-white border border-ink-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-900">Phone Support for CA Partners</h3>
                    <p className="text-ink-400 text-xs mt-0.5 font-mono">+91 (022) 4982-1000 · Mon–Sat (9 AM – 7 PM IST)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="card p-6 sm:p-8 bg-white border border-ink-100">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-ink-900">Demo Request Submitted!</h2>
                  <p className="text-xs text-ink-300 max-w-sm mx-auto">
                    Thank you {form.name}. Our CA Partner specialist will reach out to <span className="font-mono text-ink-700">{form.email}</span> within 2 business hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-secondary text-xs">
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-base font-bold text-ink-900">Request 1-on-1 Firm Demo</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Your Name *</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="CA Manas Uniyal"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">CA Firm Name *</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Uniyal & Associates"
                        required
                        value={form.firmName}
                        onChange={(e) => setForm({ ...form, firmName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Official Email *</label>
                      <input
                        type="email"
                        className="input"
                        placeholder="manas@cafirm.in"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">Phone Number *</label>
                      <input
                        type="tel"
                        className="input"
                        placeholder="+91 98200 98200"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">ICAI FRN / Reg No (Optional)</label>
                    <input
                      type="text"
                      className="input font-mono"
                      placeholder="123456N"
                      value={form.icaiFrn}
                      onChange={(e) => setForm({ ...form, icaiFrn: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">How can we help your firm?</label>
                    <textarea
                      className="input h-24 resize-none text-xs"
                      placeholder="Tell us your number of GST clients or specific workflow requirements…"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center py-3 text-xs sm:text-sm">
                    <Send size={15} /> Submit Demo & Consultation Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
