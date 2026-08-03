# GSTGenius — AI-Powered GST Filing & Compliance Platform

A full-stack Next.js SaaS application designed for Chartered Accountant (CA) firms and tax practitioners in India to automate GST return preparation, reconciliation, notice drafting, and client document management using LLMs (Anthropic Claude & Google Gemini).

---

## 🌟 Key Features

- **🤖 GSTR-3B AI Auto-Filler** — Paste raw Tally/Busy/Excel export data, AI extracts and computes CGST, SGST, IGST liabilities, nets off ITC, and identifies potential mismatches.
- **⚖️ Reconciliation Checker** — Detect GSTR-1 vs GSTR-3B vs GSTR-2B mismatches and ITC risks before tax authorities do.
- **📄 GST Notice Reader & Reply Drafter** — Upload legal notices (DRC-01, ASMT-10, etc.), receive plain-English explanations for clients, and generate formal point-by-point reply letters for Proper Officers.
- **🛡️ Client Vault & Storage** — Secure storage for PAN, Aadhaar, DSC, GST Certificates, and registration records.
- **📊 CA Dashboard & Due Date Tracker** — Multi-client overview with automated statutory due date alerts and filing status tracking.
- **✅ Mod-36 GSTIN Validator** — Built-in official Indian Modulo-36 checksum validation algorithm (`lib/gstin.ts`) and state code checks (01–38).
- **🔒 Multi-Tenant Supabase RLS Schema** — Enterprise SQL schema (`lib/supabase/schema.sql`) with Row-Level Security (`auth_firm_id()`) ensuring strict data isolation per firm.

---

## 🛠️ Tech Stack

- **Frontend / Framework**: Next.js 14 (App Router, TypeScript) + Tailwind CSS + Lucide React + Recharts
- **AI Providers**: Unified Provider Adapter (`lib/ai.ts`) supporting:
  - **Anthropic Claude** (`claude-sonnet-4-6`)
  - **Google Gemini** (`gemini-2.5-flash`)
- **Database & Auth**: Supabase (PostgreSQL, `@supabase/ssr`, Row-Level Security)
- **Deployment**: Vercel ready

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/uniyalmanas/AGT-AI.git
cd AGT-AI
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Configure your AI provider & keys in `.env.local`:

```env
# AI Provider Selection: "claude" or "gemini"
NEXT_PUBLIC_AI_PROVIDER=gemini

# API Keys
GEMINI_API_KEY=your-gemini-api-key-here
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Supabase Credentials (Optional for local UI testing)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Production Build

To verify TypeScript types and build the production bundle:

```bash
npm run build
```

---

## 📁 Project Structure

```
gst-ai/
├── app/
│   ├── (app)/               # Protected CA Portal Routes
│   │   ├── dashboard/       # Main overview & metrics
│   │   ├── clients/         # Client directory
│   │   ├── gstr3b/          # GSTR-3B AI Auto-Filler
│   │   ├── reconcile/       # GSTR-1 vs 3B vs 2B mismatch checker
│   │   ├── notices/         # Notice reader & reply drafter
│   │   ├── vault/           # Multi-tenant document vault
│   │   └── settings/        # Account & firm settings
│   ├── (auth)/              # Authentication (Login/Register)
│   └── api/
│       ├── fill-form/       # AI API route: GSTR-3B extraction
│       ├── reconcile/       # AI API route: Reconciliation analysis
│       ├── analyze-notice/  # AI API route: Notice parsing & drafting
│       └── clients/         # Client management API
├── components/
│   └── Sidebar.tsx          # Navigation sidebar & user session UI
├── lib/
│   ├── ai.ts                # Unified AI provider interface (Claude & Gemini)
│   ├── gstin.ts             # Modulo-36 GSTIN validation algorithm
│   └── supabase/            # Supabase auth, clients, middleware & RLS schema
└── app/globals.css          # Design system & CSS utilities
```

---

## 🗄️ Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** -> **New query**.
3. Copy and execute the complete schema from [`lib/supabase/schema.sql`](lib/supabase/schema.sql).
4. Create a private bucket named `vault` under **Storage**.

---

## 🗺️ Product Roadmap

- [x] Multi-provider AI Engine (Claude & Gemini)
- [x] Modulo-36 GSTIN Checksum Engine
- [x] Supabase RLS Multi-Tenant Schema & Middleware
- [ ] Direct PDF / OCR Scan parser for GST Notices
- [ ] Tally XML & Excel Bulk Data Import
- [ ] GSP API / Playwright Automation for Direct GSTN Filing
- [ ] Razorpay Subscription Billing

---

## 📊 Infrastructure Cost & Economics (50 CA Firms)

| Service | Monthly Cost |
|---|---|
| Vercel | Free |
| Supabase | Free |
| LLM API (~5,000 filings/mo) | ~$30 (~₹2,500) |
| **Total Infra Cost** | **~₹3,000 / mo** |
| **Revenue (50 firms × ₹2,999)** | **₹1,49,950 / mo** |
| **Gross Margin** | **~98%** |

---

Built with ❤️ using Next.js, Claude AI & Gemini AI.
