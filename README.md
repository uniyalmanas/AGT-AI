# 🏛️ GSTGenius — AI-Powered CA Firm Operating System (CA-OS)

> **GSTGenius (AGT-AI)** is a production-grade Chartered Accountant (CA) Practice Operating System built with Next.js 14, Tailwind CSS, Google Gemini 2.5 Flash, Anthropic Claude, and Supabase PostgreSQL.
> It equips Indian CA practices with a **3-Layer Control Plane** that owns the full **Client → Work → Money** operational loop across GST, Income Tax, TDS, ROC, and Legal Scrutiny Litigation.

---

## 🚀 Architectural Architecture (The 3-Layer CA OS)

We designed GSTGenius around the **3-Layer Operating System Architecture** specifically to address the daily reality of Indian CA practices (staff workload balance, client data chasing, deadline pressure, and firm profitability):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        GSTGENIUS 3-LAYER CA OS ARCHITECTURE                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LAYER 1: FIRM CONTROL PLANE (The Real OS Heart)                                        │
│ • Client Engagement Master Profile (Entities, Services Opted, Retainers, Staff)       │
│ • Multi-Tax Statutory Calendar Engine (GSTR-1 on 11th, GSTR-3B on 20th/18th, TDS 26Q) │
│ • Dual-Layer Storage (Disk-backed JSON Persistence + Supabase PostgreSQL RLS Schema)  │
│ • Maker-Checker Workload Kanban Board & Timestamped Audit Trail Logs                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LAYER 2: CLIENT → WORK → MONEY CLOSED LOOP                                            │
│ • 📱 1-Click WhatsApp Checklist Chase Button                                            │
│ • Closed-Loop Client Portal Upload (File Upload → Task Auto-Moves to In Progress)      │
│ • Work-to-Billing Auto-Invoice Generator (Task Filed → SAC 9982 Invoice Created)       │
│ • Live Razorpay Payment Webhooks (HMAC Verification → Auto-Marks Paid)                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LAYER 3: AI EXECUTION LAYER (Execution Speed)                                          │
│ • GSTR-3B AI Auto-Filler & Official GSTN Portal JSON Exporter                          │
│ • DRC-01 Scrutiny Notice Reader & Legal Reply Drafter (Sec 16(2) & 73)               │
│ • Form 26AS & AIS / TIS TDS Reconciliation Engine                                      │
│ • GSTR-9 & 9C Annual Audit DRC-03 Short-Payment Calculator                             │
│ • GST Law AI Copilot ("GST Law GPT") with CBIC Citations                               │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ The 4 Production Depth Engines

1. **💾 Disk-Backed Permanent Persistence (`lib/persistence.ts`)**:
   - Dual-persistence architecture saving state to disk files (`data/tasks.json`, `data/invoices.json`, `data/audit_logs.json`) AND Supabase PostgreSQL tables. Data permanently survives server restarts and cold deployments.

2. **🗓️ Indian Statutory Filing Calendar Engine (`lib/statutory-calendar.ts`)**:
   - Dynamically calculates exact statutory due dates based on Indian GST & Income Tax laws (GSTR-1 on 11th, GSTR-3B on 20th/18th, TDS 26Q on 31st of month following quarter).

3. **📊 Tally Prime XML Debit/Credit & Ledger Classifier (`app/api/tally/route.ts`)**:
   - XML DOM parser inspecting `<ISDEEMEDPOSITIVE>` (`Yes` = Debit/ITC, `No` = Credit/Sales) to extract CGST, SGST, IGST, and Taxable Ledgers dynamically.

4. **💳 Razorpay Webhook Invoice Matcher (`app/api/webhooks/razorpay/route.ts`)**:
   - HMAC SHA256 signature verification processing `payment.captured` webhooks, mutating invoice status to `paid` in DB & disk store, and logging audit records.

---

## 🌐 Marketing Website & Landing Page Suite

Includes a modern glassmorphism Marketing Website for CA firm acquisition:
- **🏠 Home Page (`/`)**: Hero section, live workspace preview, and **Interactive Practice ROI Calculator** (drag client slider to compute monthly hours saved).
- **📖 About Us (`/about`)**: Vision, mission, statutory integrity, and AI tech stack architecture.
- **💳 Pricing Plans (`/pricing`)**: Transparent flat-rate subscription pricing (**Starter ₹1,199/mo**, **Pro CA Firm OS ₹2,799/mo**, **Enterprise ₹6,399/mo**).
- **📞 Contact Us (`/contact`)**: 1-on-1 Demo Request Form with instant submission feedback.
- **🎁 100% Free Pilot Partner Pass**: All early CA practice pilots run with **100% free unlocked access and zero payment barriers**.

---

## 🔒 Multi-Tenant Firm Data Isolation

- **Row-Level Security (RLS)** in `lib/supabase/schema.sql`:
  ```sql
  create policy tasks_all on tasks for all using (firm_id = auth_firm_id());
  create policy invoices_all on invoices for all using (firm_id = auth_firm_id());
  ```
- **Firm Isolation**: Firm A sees ONLY Firm A's real clients, tasks, and billing. Signed-up accounts start with an isolated, clean workspace (`clients: []`).

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

Set your AI provider & API keys in `.env.local`:

```env
# AI Provider Selection: "gemini" or "claude"
NEXT_PUBLIC_AI_PROVIDER=gemini

# API Keys
GEMINI_API_KEY=your-gemini-api-key-here
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 End-to-End Verification & Build

```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run E2E Test Suite (13/13 APIs Passing)
node scratch/test_e2e_suite.js

# Build production bundle
npm run build
```

---

## 📁 Project Directory Map

```
gst-ai/
├── app/
│   ├── page.tsx             # Marketing Landing Page & Interactive ROI Calculator
│   ├── about/page.tsx       # About Us page
│   ├── pricing/page.tsx     # Pricing Plans page
│   ├── contact/page.tsx     # Contact & Demo Request page
│   ├── (app)/               # Authenticated CA Portal Routes
│   │   ├── dashboard/       # Main overview, metrics & Staff Capacity Control Panel
│   │   ├── tasks/           # Multi-tax Kanban, Maker-Checker OS & WhatsApp Chase
│   │   ├── litigation/      # Litigation SLA Countdown Board (DRC-01, ASMT-10)
│   │   ├── billing/         # SAC 9982 Invoicing, Razorpay/UPI & Profitability
│   │   ├── tds-reconcile/   # Form 26AS & AIS / TIS TDS Reconciliation Engine
│   │   ├── gstr9-audit/     # Full-Year GSTR-9 & 9C Annual Audit Helper
│   │   ├── client-portal/   # Closed-Loop Client Portal Workspace
│   │   ├── clients/         # Client Master CRM & WhatsApp Reminders
│   │   ├── gstr3b/          # GSTR-3B AI Auto-Filler & GSTN JSON Exporter
│   │   ├── reconcile/       # GSTR-1 vs 3B vs 2B 3-way mismatch checker
│   │   ├── notices/         # Notice reader & legal reply drafter
│   │   ├── copilot/         # AI Legal Copilot Chatbot ("GST Law GPT")
│   │   ├── vault/           # Multi-tenant document vault
│   │   └── settings/        # Team Invite OS & Firm Settings
│   ├── (auth)/              # Authentication (Login/Register)
│   └── api/                 # Next.js API Routes
│       ├── fill-form/       # GSTR-3B AI extraction
│       ├── export-json/     # GSTN Portal JSON payload generator
│       ├── tasks/           # Compliance tasks API
│       ├── generate-tasks/  # Intelligent statutory auto-task generator
│       ├── engagements/     # Client Engagement Master API
│       ├── audit-logs/      # Maker-Checker audit log API
│       ├── webhooks/razorpay# Razorpay webhook payment engine
│       ├── tally/           # Tally Prime XML Debit/Credit parser API
│       ├── litigation/      # Litigation notices API
│       ├── billing/         # SAC 9982 Invoicing & Profitability API
│       ├── tds-reconcile/   # Form 26AS & AIS TDS reconciliation API
│       ├── gstr9-audit/     # GSTR-9/9C annual audit API
│       ├── client-portal/   # Closed-loop client workspace API
│       ├── copilot/         # AI Legal Copilot API
│       └── clients/         # Client management API
├── components/
│   ├── Navbar.tsx           # Marketing navigation header
│   ├── Footer.tsx           # Marketing navigation footer
│   ├── Sidebar.tsx          # Portal navigation sidebar & mobile drawer
│   ├── FileUploadZone.tsx   # Multimodal OCR uploader
│   └── ClientReminderModal.tsx # WhatsApp data request generator
├── data/                    # Disk-backed JSON persistence store
│   ├── tasks.json
│   ├── invoices.json
│   └── audit_logs.json
├── lib/
│   ├── persistence.ts       # Disk-backed JSON storage engine
│   ├── statutory-calendar.ts# Statutory filing calendar calculator
│   ├── engagement-store.ts  # Client Engagement Master store
│   ├── tasks-store.ts      # Tasks state store
│   ├── billing-store.ts    # Billing state store
│   ├── audit.ts             # Maker-Checker audit log store
│   ├── ai.ts                # Unified AI provider interface (Claude & Gemini)
│   ├── parse-file.ts        # Spreadsheet & PDF OCR parser
│   ├── gstin.ts             # Modulo-36 GSTIN validation algorithm
│   └── supabase/            # Supabase auth, clients, middleware & RLS schema
└── app/globals.css          # Design system & CSS utilities
```

---

## 🗄️ Database Schema Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** -> **New query**.
3. Execute the full schema from [`lib/supabase/schema.sql`](lib/supabase/schema.sql).
4. Create a private storage bucket named `vault` under **Storage**.

---

Built with ❤️ using Next.js 14, Gemini 2.5 Flash, Claude AI & Supabase PostgreSQL.
