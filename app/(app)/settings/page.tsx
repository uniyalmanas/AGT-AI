"use client";
import { useState } from "react";
import { Settings, Key, Bell, CreditCard, Shield, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2 mb-6">
        <Settings size={22} className="text-brand-600" /> Settings
      </h1>

      <div className="space-y-5">
        {/* API Keys */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-brand-600" />
            <h2 className="font-semibold text-ink-900">API Configuration</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Anthropic API Key</label>
              <input
                type="password"
                className="input font-mono"
                placeholder="sk-ant-api03-…"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
              <p className="text-xs text-ink-300 mt-1.5">Set in .env.local file for production. Get your key at console.anthropic.com</p>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-brand-600" />
            <h2 className="font-semibold text-ink-900">Firm Details</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Firm name", placeholder: "CA Sharma & Associates" },
              { label: "ICAI membership no.", placeholder: "MRN123456" },
              { label: "Contact email", placeholder: "ca@example.com" },
              { label: "Phone", placeholder: "+91 98765 43210" },
            ].map(f => (
              <div key={f.label}>
                <label className="label">{f.label}</label>
                <input className="input" placeholder={f.placeholder} />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-brand-600" />
            <h2 className="font-semibold text-ink-900">Notifications</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Due date reminders (7 days before)", defaultChecked: true },
              { label: "Mismatch alerts", defaultChecked: true },
              { label: "Filing confirmation emails", defaultChecked: true },
              { label: "New GST circular alerts", defaultChecked: false },
            ].map(n => (
              <label key={n.label} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={n.defaultChecked} className="rounded" />
                <span className="text-sm text-ink-700">{n.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Plan */}
        <div className="card p-6 bg-brand-50 border-brand-100">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-brand-600" />
            <h2 className="font-semibold text-ink-900">Current Plan</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-brand-700">Pro Plan</div>
              <div className="text-sm text-brand-500">₹2,999 / month · 100 GSTINs</div>
              <div className="text-xs text-brand-400 mt-1">Renews 14 July 2026</div>
            </div>
            <button className="btn-secondary text-xs">Upgrade to Enterprise</button>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary w-full justify-center py-3">
          {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save settings</>}
        </button>
      </div>
    </div>
  );
}
