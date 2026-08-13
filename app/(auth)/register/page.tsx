"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firmName: "",
    icaiNumber: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Provision firm + auth user server-side
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // 2. Attempt client-side sign in
      try {
        const supabase = createClient();
        await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
      } catch (e) {
        console.warn("Client Supabase auth fallback:", e);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      // Direct redirect to workspace on demo preview
      router.push("/dashboard");
    }
  }

  return (
    <div className="card w-full max-w-md p-7">
      <h1 className="text-lg font-bold text-ink-900">Create your firm account</h1>
      <p className="text-sm text-ink-300 mt-1 mb-6">Start automating GST filings in minutes</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Firm name *</label>
          <input className="input" placeholder="Sharma & Associates" value={form.firmName} onChange={update("firmName")} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">ICAI membership no.</label>
            <input className="input" placeholder="123456" value={form.icaiNumber} onChange={update("icaiNumber")} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" placeholder="98xxxxxxxx" value={form.phone} onChange={update("phone")} />
          </div>
        </div>

        <div>
          <label className="label">Email *</label>
          <input type="email" className="input" placeholder="you@cafirm.in" value={form.email} onChange={update("email")} required />
        </div>

        <div>
          <label className="label">Password *</label>
          <input type="password" className="input" placeholder="At least 8 characters" value={form.password} onChange={update("password")} required minLength={8} />
        </div>

        {error && (
          <div className="text-xs text-danger-text bg-danger-bg border border-danger-border rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
          {loading ? <span className="spinner" /> : "Create account"}
        </button>
      </form>

      <p className="text-xs text-ink-300 text-center mt-5">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
