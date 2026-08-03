# GSTGenius — AI-Powered GST Filing Platform

A full-stack Next.js SaaS application for CA firms to automate GST return filing using Claude AI.

## Features

- **GSTR-3B Auto-Filler** — Paste raw Tally/Excel data, Claude fills every field
- **Reconciliation Checker** — Detect GSTR-1 vs 3B vs 2B mismatches before GSTN does
- **GST Notice Reader** — Upload any notice, get plain-English explanation + draft reply
- **Client Vault** — AES-256 encrypted storage for PAN, Aadhaar, DSC, photos
- **Client Dashboard** — Multi-client overview with due date tracking

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **AI**: Anthropic Claude API (claude-sonnet-4-6)
- **Database**: Supabase (PostgreSQL) — add when scaling
- **Payments**: Razorpay — add when billing
- **Automation**: Playwright — add for portal filing

## Setup

### 1. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure environment
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` and add your Anthropic API key:
\`\`\`
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
\`\`\`

Get your key at: https://console.anthropic.com

### 3. Run development server
\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:3000

## Project Structure

\`\`\`
gst-ai/
├── app/
│   ├── dashboard/          # Main dashboard with metrics
│   ├── clients/            # Client management
│   ├── gstr3b/             # GSTR-3B AI form filler
│   ├── reconcile/          # Mismatch checker
│   ├── notices/            # Notice reader & reply drafter
│   ├── vault/              # Document vault
│   ├── settings/           # App settings
│   └── api/
│       ├── fill-form/      # Claude API: GSTR-3B filling
│       ├── reconcile/      # Claude API: reconciliation
│       └── analyze-notice/ # Claude API: notice analysis
├── components/
│   └── Sidebar.tsx         # Navigation sidebar
└── app/globals.css         # Design system
\`\`\`

## Adding Supabase (Database)

1. Create a project at https://supabase.com
2. Add credentials to `.env.local`
3. Run the SQL schema (see `/lib/schema.sql` — create this)

## Adding Razorpay (Payments)

1. Create account at https://razorpay.com
2. Add keys to `.env.local`
3. Implement subscription webhooks in `/app/api/webhooks/razorpay/`

## Deployment

### Vercel (Recommended)
\`\`\`bash
npm i -g vercel
vercel --prod
\`\`\`

Set `ANTHROPIC_API_KEY` in Vercel environment variables.

## Roadmap

- [ ] Supabase auth + multi-tenant data isolation
- [ ] Tally XML direct import
- [ ] Playwright browser automation for GST portal
- [ ] GSTR-1 filler
- [ ] GSTR-9 annual return
- [ ] GSP API integration
- [ ] Razorpay billing
- [ ] Mobile app (React Native)

## Cost Estimate (50 CA firms)

| Service | Monthly cost |
|---------|-------------|
| Vercel | Free |
| Supabase | Free |
| Claude API (~5,000 fills) | ~$30 |
| Railway (Playwright) | $5 |
| **Total infra** | **~₹3,000** |
| **Revenue (₹2,999 × 50)** | **₹1,49,950** |
| **Gross margin** | **~98%** |

---

Built with ❤️ using Next.js + Anthropic Claude
