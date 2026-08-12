# 🏛️ GSTGenius — AI-Powered CA Firm Operating System (CA-OS)

> **GSTGenius (AGT-AI)** is a comprehensive, production-grade Chartered Accountant (CA) Practice Operating System built with Next.js 14, Tailwind CSS, Google Gemini 2.5 Flash, Anthropic Claude, and Supabase. 
> It transforms Indian CA practices by automating GST compliance, tax litigation defenses, multi-tax task workflows, client data collection over WhatsApp, professional billing, and annual audit reconciliations.

---

## 🚀 What's New in Version 2.0 (4-Phase Product Evolution)

We have evolved **GSTGenius** from a point-solution GST calculator into a full-scale **CA Practice Management Operating System**:

### 🟢 Phase 1: GST Core & Multimodal AI Core
- **🤖 GSTR-3B AI Auto-Filler** ([`/gstr3b`](http://localhost:3000/gstr3b)) — Upload Tally Excel sheets (`.xlsx`/`.csv`), PDFs, or paste raw text. AI Vision extracts figures, computes CGST/SGST/IGST liabilities, and nets off ITC automatically.
- **📄 Multimodal OCR File Engine** ([`components/FileUploadZone.tsx`](file:///D:/gst-ai/components/FileUploadZone.tsx)) — Drag & drop invoice PDFs, Tally dumps, or scanned notice photos directly into the app using Gemini 2.5 Flash Vision.
- **📥 Official GSTN Portal JSON Exporter** ([`app/api/export-json/route.ts`](file:///D:/gst-ai/app/api/export-json/route.ts)) — 1-click export of government-schema-compliant GSTR-3B JSON ready for direct upload on [`gst.gov.in`](https://www.gst.gov.in).
- **⚖️ 3-Way Reconciliation Checker** ([`/reconcile`](http://localhost:3000/reconcile)) — Cross-examines GSTR-1 vs 3B vs 2B with a **0–100 Compliance Score** and Rule 36(4) flags.
- **📄 GST Notice Reader & Reply Drafter** ([`/notices`](http://localhost:3000/notices)) — Parses DRC-01 / ASMT-10 notices, produces 3-sentence plain-English client summaries, and drafts formal legal reply letters under Section 16(2) and 73 of the CGST Act.
- **⚖️ GST Law Copilot ("GST Law GPT")** ([`/copilot`](http://localhost:3000/copilot)) — AI Legal Counsel trained on CGST/IGST Acts, Circulars, Section 17(5) blocked credit rules, and penalty risks.

---

### 🟡 Phase 2: Practice Management Layer (CA Firm OS)
- **📊 Multi-Tax Kanban Compliance Board** ([`/tasks`](http://localhost:3000/tasks)) — Unified task board for **GSTR-1, GSTR-3B, GSTR-9, TDS 24Q/26Q, ITR Form 3, and ROC AOC-4** across 4 stages (`Data Pending` → `In Progress` → `Under Review` → `Filed`) with **Maker-Checker role tags** (Article Clerk → CA Partner sign-off).
- **🏛️ Litigation & Notice SLA Countdown Board** ([`/litigation`](http://localhost:3000/litigation)) — Centralized notice board tracking active DRC-01, ASMT-10, and Income Tax notices with real-time **7-day & 30-day countdown SLA alerts**.
- **📲 Automated Client WhatsApp Reminders** ([`components/ClientReminderModal.tsx`](file:///D:/gst-ai/components/ClientReminderModal.tsx)) — 1-click WhatsApp data submission request generator with customizable document checklists (Sales, Purchase, Bank PDF, E-Way bills) and direct `wa.me` links.
- **🏢 Unified Client CRM Master** ([`/clients`](http://localhost:3000/clients)) — Master profile per entity linking **GSTIN**, **PAN**, **CIN**, business type (Regular/Composition/SEZ), turnover threshold, and contact details with Modulo-36 GSTIN validation.
- **🛡️ Multi-Tenant Vault & Document Portal** ([`/vault`](http://localhost:3000/vault)) — Secure client document storage (PAN, Aadhaar, GST Certificates, DSC) backed by Supabase Row-Level Security (`auth_firm_id()`).

---

### 🟠 Phase 3: Firm Operations, Billing & Profitability
- **🧾 SAC 9982 Professional Fee Invoicing Engine** ([`/billing`](http://localhost:3000/billing)) — Generates GST-compliant CA Tax Invoices under **SAC Code 9982** (Accounting, Auditing & Tax Consultancy) with CGST/SGST/IGST breakdown and printable PDF layout.
- **💳 Razorpay & UPI Instant Payment Collection Links** ([`/billing`](http://localhost:3000/billing)) — Generates instant Razorpay payment links & UPI QR codes with 1-click WhatsApp dispatch.
- **📈 Article Clerk Hours & Profitability Analytics** ([`/billing`](http://localhost:3000/billing)) — Tracks staff hours logged by Article Clerks (at ₹250/hr cost rate) vs monthly retainers to flag **loss-making undercharged clients**.

---

### 🔵 Phase 4: Multi-Tax Moat & Client Self-Service Portal
- **📊 Form 26AS & AIS / TIS TDS Reconciliation Engine** ([`/tds-reconcile`](http://localhost:3000/tds-reconcile)) — Cross-reconciles Books TDS vs Form 26AS & AIS statements before ITR filing to claim full tax refunds.
- **🧮 Full-Year GSTR-9 & 9C Annual Audit Helper** ([`/gstr9-audit`](http://localhost:3000/gstr9-audit)) — Consolidates 12 months of filed returns against Audited P&L Statements to generate GSTR-9C reconciliation tables and DRC-03 recommendations.
- **🌐 Client Self-Service Portal Workspace** ([`/client-portal`](http://localhost:3000/client-portal)) — Magic-link workspace where clients upload monthly purchase invoices, view real-time filing status, and download PDF receipts.

---

### 📱 Full Multi-Device Responsive UI
- **Mobile Top Header & Slide-Out Navigation Drawer** ([`components/Sidebar.tsx`](file:///D:/gst-ai/components/Sidebar.tsx)) — Hamburger menu toggle (`Menu` / `X` icons) for phone and tablet screens (`< 768px`).
- **Fluid Layout Grids** (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) and touch-scrollable tables across all pages.

---

## 🛠️ Tech Stack

- **Frontend / Framework**: Next.js 14 (App Router, TypeScript) + Tailwind CSS + Lucide React
- **AI Engine**: Unified Provider Interface (`lib/ai.ts`) supporting:
  - **Google Gemini** (`gemini-2.5-flash` with Vision & Multimodal base64 support)
  - **Anthropic Claude** (`claude-sonnet-4-6`)
- **Document & Spreadsheet Processors**: `xlsx` (SheetJS) + `pdf-parse`
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
# AI Provider Selection: "gemini" or "claude"
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

## 🧪 Verification & Build

```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## 📁 Project Structure

```
gst-ai/
├── app/
│   ├── (app)/               # Authenticated CA Portal Routes
│   │   ├── dashboard/       # Main overview & metrics
│   │   ├── tasks/           # Multi-tax Kanban & Maker-Checker OS
│   │   ├── litigation/      # Litigation SLA Countdown Board (DRC-01, ASMT-10)
│   │   ├── billing/         # SAC 9982 Invoicing, Razorpay/UPI & Profitability
│   │   ├── tds-reconcile/   # Form 26AS & AIS / TIS TDS Reconciliation Engine
│   │   ├── gstr9-audit/     # Full-Year GSTR-9 & 9C Annual Audit Helper
│   │   ├── client-portal/   # Client Self-Service Portal Workspace
│   │   ├── clients/         # Client Master CRM & WhatsApp Reminders
│   │   ├── gstr3b/          # GSTR-3B AI Auto-Filler & GSTN JSON Exporter
│   │   ├── reconcile/       # GSTR-1 vs 3B vs 2B 3-way mismatch checker
│   │   ├── notices/         # Notice reader & legal reply drafter (PDF/OCR)
│   │   ├── copilot/         # CA Legal Copilot Chatbot ("GST Law GPT")
│   │   ├── vault/           # Multi-tenant document vault
│   │   └── settings/        # Account & firm settings
│   ├── (auth)/              # Authentication (Login/Register)
│   └── api/                 # Next.js API Routes
│       ├── fill-form/       # GSTR-3B AI extraction
│       ├── export-json/     # GSTN Portal JSON payload generator
│       ├── tasks/           # Compliance tasks API
│       ├── litigation/      # Litigation notices API
│       ├── billing/         # SAC 9982 Invoicing & Profitability API
│       ├── tds-reconcile/   # Form 26AS & AIS TDS reconciliation API
│       ├── gstr9-audit/     # GSTR-9/9C annual audit API
│       ├── client-portal/   # Client workspace & document upload API
│       ├── parse-file/      # Multimodal OCR API (Excel, PDF, Scans)
│       ├── copilot/         # AI Legal Copilot API (CGST/IGST Law)
│       └── clients/         # Client management API
├── components/
│   ├── Sidebar.tsx          # Navigation sidebar & mobile hamburger drawer
│   ├── FileUploadZone.tsx   # Interactive drag & drop OCR file uploader
│   └── ClientReminderModal.tsx # WhatsApp data request generator
├── lib/
│   ├── ai.ts                # Unified AI provider interface (Claude & Gemini)
│   ├── parse-file.ts        # Spreadsheet & PDF OCR document parser
│   ├── gstin.ts             # Modulo-36 GSTIN validation algorithm
│   └── supabase/            # Supabase auth, clients, middleware & RLS schema
└── app/globals.css          # Design system & CSS utilities
```

---

## 🗄️ Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** -> **New query**.
3. Copy and execute the complete schema from [`lib/supabase/schema.sql`](lib/supabase/schema.sql).
4. Create a private storage bucket named `vault` under **Storage**.

---

Built with ❤️ using Next.js, Gemini AI 2.5 Flash & Claude AI.
