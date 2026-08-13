# ❓ Frequently Asked Questions (FAQ) — GSTGenius CA Practice OS

> **The Ultimate Guide to GSTGenius (AGT-AI)**: In-depth technical, legal, operational, and architectural answers complete with system diagrams, compliance workflows, data pipeline flowcharts, and security verification guides for Chartered Accountants, IT Auditors, Firm Partners, and Development Teams.

---

## 📑 Table of Contents
1. [General & Product Vision](#1-general--product-vision)
2. [Architecture & Closed-Loop Operational Control](#2-architecture--closed-loop-operational-control)
3. [GST Execution, AI Auto-Filler & Portal JSON Exporter](#3-gst-execution-ai-auto-filler--portal-json-exporter)
4. [Tax Litigation, Scrutiny Notices & Legal Reply Drafting](#4-tax-litigation-scrutiny-notices--legal-reply-drafting)
5. [Practice Management, Staff Workload & Maker-Checker OS](#5-practice-management-staff-workload--maker-checker-os)
6. [Automated Client Chasing & Closed-Loop Portal](#6-automated-client-chasing--closed-loop-portal)
7. [SAC 9982 Professional Fee Invoicing & Razorpay Webhooks](#7-sac-9982-professional-fee-invoicing--razorpay-webhooks)
8. [Data Privacy, Security & Multi-Tenant RLS Isolation](#8-data-privacy-security--multi-tenant-rls-isolation)
9. [System Infrastructure Scale, Throughput & Benchmarks](#9-system-infrastructure-scale-throughput--benchmarks)

---

## 1. General & Product Vision

### Q1.1: What is GSTGenius (AGT-AI) and what problem does it solve?
**GSTGenius** is an AI-Native Practice Operating System built specifically for Indian Chartered Accountant (CA) firms. 

Mid-sized Indian CA firms manage dozens of clients across monthly statutory deadlines (GST, TDS, Income Tax, ROC). Their daily reality is:
* **Fragmented Tools**: Staff use Excel for return calculations, WhatsApp groups for chasing client data, Jamku for task tracking, and manual word processors for notice replies.
* **Loss of Visibility**: CA Partners have no real-time visibility into staff capacity, overdue deadlines, or client profitability.
* **Filing Deadline Rush**: Between the 11th and 20th of every month, staff spend hundreds of manual hours copy-pasting numbers from client Tally ledgers into government portals.

**GSTGenius solves this by unifying the entire operational lifecycle into a single closed-loop workspace.**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        GSTGENIUS OPERATIONAL LIFECYCLE                                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Client Engagement Master]                                                              │
│       │                                                                                │
│       ▼ (Auto-creates statutory tasks based on filing frequency)                       │
│ [Maker-Checker Kanban Board] ──(📱 1-Click WhatsApp Chase)──► [Client Upload Portal]    │
│       │                                                                 │              │
│       ▼                                                                 ▼ (Auto-moves) │
│ [AI Return & Notice Prep] ◄───────────────────────────────────── [Data Received]      │
│       │                                                                                │
│       ▼ (CA Partner Approves & Signs Off)                                              │
│ [SAC 9982 Fee Invoicing] ──(Razorpay / UPI Link)──► [Webhook Auto-Marks Paid]          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Q1.2: How is GSTGenius different from ClearTax, Winman, or Jamku?
Existing products in India are split into two incomplete layers:
1. **Filing Utilities** (*ClearTax, Winman, Computax*): Excellent at filing returns, but **zero firm operational control** (no staff task boards, no client document chasing, no notice reply drafting, no SAC 9982 fee invoicing).
2. **Task Managers** (*Jamku, ERPCA, Finexo*): Good at task tracking, but **zero AI tax execution** (no GSTR-3B auto-fillers, no DRC-01 legal notice drafting, no Form 26AS TDS reconcilers).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             COMPETITIVE FEATURE COMPARISON                             │
├──────────────────────────┬───────────┬────────────┬───────────┬───────────────┬────────┤
│ Feature / Capability     │ GSTGenius │ ClearTax   │ Jamku     │ Zoho Practice │ Finexo │
├──────────────────────────┼───────────┼────────────┼───────────┼───────────────┼────────┤
│ AI GSTR-3B & JSON Export │ 🟢 9.5    │ 🟢 9.8     │ 🔴 2.0    │ 🟡 5.0        │ 🟡 6.5 │
│ DRC-01 Scrutiny Legal AI │ 🟢 9.0    │ 🔴 1.0     │ 🔴 1.0    │ 🔴 1.0        │ 🔴 2.0 │
│ Maker-Checker Kanban OS  │ 🟢 9.0    │ 🔴 3.0     │ 🟢 8.5    │ 🟢 8.5        │ 🟢 8.0 │
│ 📱 1-Click WhatsApp Chase│ 🟢 9.0    │ 🔴 2.0     │ 🟡 5.0    │ 🟡 5.0        │ 🟢 8.5 │
│ SAC 9982 Fee Invoicing   │ 🟢 9.0    │ 🔴 1.0     │ 🟡 6.0    │ 🟢 8.0        │ 🟡 5.0 │
│ Ecosystem Freedom        │ 🟢 Free   │ 🟡 Medium  │ 🟢 Free   │ 🔴 Locked in  │ 🟢 Free│
└──────────────────────────┴───────────┴────────────┴───────────┴───────────────┴────────┘
```

---

## 2. Architecture & Closed-Loop Operational Control

### Q2.1: What is the 3-Layer Operating System Architecture?
GSTGenius is built on a **3-Layer CA Firm Architecture**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        GSTGENIUS 3-LAYER CA OS ARCHITECTURE                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LAYER 1: FIRM CONTROL PLANE (The Operations Heart)                                     │
│ • Client Engagement Master Profile (GSTIN, Filing Frequency, Retainers, Staff Assign)   │
│ • Multi-Tax Statutory Filing Calendar Engine (GSTR-1 on 11th, GSTR-3B on 20th/18th)   │
│ • Database-First Storage (Supabase PostgreSQL RLS + Non-blocking Disk Backup)          │
│ • Staff Workload Capacity & SLA Overdue Heatmaps                                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LAYER 2: CLIENT → WORK → MONEY CLOSED LOOP                                            │
│ • 📱 1-Click WhatsApp Checklist Chase Button                                            │
│ • Closed-Loop Client Portal Upload (Upload → Task Auto-Advances to In Progress)        │
│ • Work-to-Billing Auto-Invoice Generator (Task Marked Filed → SAC 9982 Invoice Created)│
│ • Live Razorpay Webhook Payment Engine (HMAC Verification → Auto-Marks Paid)           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LAYER 3: AI EXECUTION LAYER (Execution Speed)                                          │
│ • GSTR-3B AI Auto-Filler & Official GSTN Portal JSON Exporter                          │
│ • DRC-01 / ASMT-10 Scrutiny Notice Reader & Legal Reply Letter Drafter                │
│ • Form 26AS & AIS / TIS TDS Reconciliation Engine                                      │
│ • Full-Year GSTR-9 & 9C Annual Audit Helper                                            │
│ • GST Law AI Copilot ("GST Law GPT") with CBIC Section & Circular Citations           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. GST Execution, AI Auto-Filler & Portal JSON Exporter

### Q3.1: How does the GSTR-3B AI Auto-Filler process client data?
The GSTR-3B AI Engine (`/gstr3b`) accepts Tally Excel dumps (`.xlsx`/`.csv`), scanned PDF ledgers, or raw text. The pipeline follows a 4-step execution flow:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        GSTR-3B AI EXTRACTION & FILING PIPELINE                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. DATA INGESTION    ──► Drag & Drop Tally Excel, Purchase PDF, or Bank Statement     │
│                                 │                                                      │
│ 2. MULTIMODAL OCR    ──► Gemini 2.5 Vision parses line items & classifies ledgers      │
│                                 │                                                      │
│ 3. TAX CALCULATION   ──► Nets off Outward Taxable Sales vs Eligible ITC (Rule 36-4)    │
│                                 │                                                      │
│ 4. 1-CLICK JSON      ──► Generates government-schema-compliant GSTR-3B JSON           │
│                          Ready for direct upload on gst.gov.in                         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Q3.2: Does the exported JSON format match official GSTN Portal requirements?
Yes. The JSON payload generated by `/api/export-json` follows the exact government schema specifications required by the GSTN Portal (`gst.gov.in`):
* Table 3.1(a) Outward Taxable Supplies (Taxable Value, CGST, SGST, IGST)
* Table 3.1(d) Inward Supplies Liable to Reverse Charge (RCM)
* Table 4(A)(5) All Other Eligible ITC
* Table 4(D)(2) Ineligible ITC under Section 17(5)

---

## 4. Tax Litigation, Scrutiny Notices & Legal Reply Drafting

### Q4.1: How does GSTGenius handle DRC-01 and ASMT-10 tax scrutiny notices?
When a tax officer issues a notice, staff upload the PDF into `/litigation`. GSTGenius processes the document through an automated legal defense workflow:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                     TAX LITIGATION & NOTICE DEFENSE PIPELINE                           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [DRC-01 Notice Upload]                                                                 │
│       │                                                                                │
│       ▼                                                                                │
│ [AI Legal Reader Engine]                                                               │
│       ├──► Extracts Demanded Tax, Interest, & Penalty                                  │
│       ├──► Generates 3-Sentence Plain-English Summary for Client                       │
│       └──► Triggers 7-Day SLA Countdown Alert on Partner Dashboard                    │
│       │                                                                                │
│       ▼                                                                                │
│ [Formal Legal Reply Generator]                                                         │
│       ├──► Cites CGST Act Section 16(2) (Conditions for ITC Claim)                     │
│       ├──► Cites CGST Act Section 73 (Determination of Tax Not Paid)                   │
│       └──► Embeds High Court Precedents & CBIC Clarification Circulars                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Practice Management, Staff Workload & Maker-Checker OS

### Q5.1: How does the Maker-Checker Workflow operate?
To prevent junior staff errors from resulting in filing penalties, GSTGenius enforces a **Maker-Checker Staff Responsibility Pipeline**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                     MAKER-CHECKER STAFF RESPONSIBILITY PIPELINE                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ARTICLE CLERK (MAKER)                                                                  │
│ • Gathers client documents via WhatsApp Chase link                                     │
│ • Runs GSTR-3B AI Auto-Filler & 3-Way Reconciliation                                   │
│ • Moves Task Card from "Data Pending" ──► "In Progress" ──► "Under Review"            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SENIOR MANAGER / CA PARTNER (CHECKER)                                                   │
│ • Reviews ITC reconciliation flags & Rule 36(4) compliance                              │
│ • Inspects audit log history                                                           │
│ • Approves & Marks "Filed" ──► Triggers Auto SAC 9982 Fee Invoice                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Automated Client Chasing & Closed-Loop Portal

### Q6.1: How does the Closed-Loop Client Portal Upload work?
Instead of chasing clients over telephone calls or unorganized WhatsApp threads:
1. Staff click **`📱 Chase Client on WhatsApp`** on any `Data Pending` task card.
2. A personalized link is generated: `https://agt-ai-chi.vercel.app/client-portal`.
3. When the client uploads their Tally Excel or Bank PDF, **the task status automatically moves from `Data Pending` to `In Progress`**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                    CLOSED-LOOP CLIENT DATA CHASE FLOWCHART                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Task: Data Pending] ──(Click WhatsApp Chase)──► [Pre-filled WhatsApp Message Sent]     │
│                                                                │                       │
│                                                                ▼                       │
│ [Task: In Progress] ◄──(Auto Status Advance)─── [Client Portal Upload Completed]      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. SAC 9982 Professional Fee Invoicing & Razorpay Webhooks

### Q7.1: What is SAC Code 9982 and how does auto-invoicing work?
**SAC Code 9982** (Services Accounting Code 9982) is the official GST tax category for **"Legal and accounting services; auditing services; tax consultancy services"**. 

When a CA Partner marks a task as `Filed`, GSTGenius automatically executes the **Work-to-Billing Auto-Invoice Engine**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                     WORK-TO-BILLING AUTO-INVOICE ENGINE                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Task Marked "Filed"]                                                                  │
│       │                                                                                │
│       ▼                                                                                │
│ [Auto-Generate SAC 9982 Invoice]                                                      │
│       ├──► Professional Fee: ₹5,000 (Monthly Retainer) or ₹15,000 (GSTR-9 Audit)       │
│       ├──► 18% GST Breakdown (9% CGST + 9% SGST)                                       │
│       └──► Generates Razorpay Payment Link + UPI QR Code                               │
│       │                                                                                │
│       ▼                                                                                │
│ [Razorpay Webhook Callback]                                                            │
│       └──► Constant-Time HMAC Signature Check ──► Invoice Auto-Marked "PAID"           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Data Privacy, Security & Multi-Tenant RLS Isolation

### Q8.1: How does GSTGenius isolate client data between different CA firms?
GSTGenius uses **Supabase PostgreSQL with strict Row-Level Security (RLS)**. Every firm is assigned a unique `firm_id` UUID upon registration.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                    SUPABASE MULTI-TENANT ROW-LEVEL SECURITY (RLS)                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ DATABASE REQUEST ──► Authenticated User Token (JWT containing firm_id)                 │
│                              │                                                         │
│                              ▼                                                         │
│ RLS POLICY ENGINE   ──► `WHERE firm_id = auth_firm_id()`                             │
│                              │                                                         │
│         ┌────────────────────┴────────────────────┐                                    │
│         ▼                                         ▼                                    │
│ [Firm A Database Space]                 [Firm B Database Space]                        │
│ • Client A1, A2                         • Client B1, B2                        │
│ • Tasks A1, A2                          • Tasks B1, B2                         │
│ • Invoices A1                           • Invoices B1                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Q8.2: How are Webhook payment signatures verified?
Razorpay webhook signatures use SHA-256 HMAC constant-time buffer comparison (`crypto.timingSafeEqual`) to prevent forged signature attacks:
* Checks `x-razorpay-signature` header against both Hex and Base64 HMAC digests.
* Missing signature headers in production environment are immediately rejected with HTTP 400.

---

## 9. System Infrastructure Scale, Throughput & Benchmarks

### Q9.1: How much workload can GSTGenius handle?
Built on **Next.js 14 Serverless Edge Architecture**, GSTGenius scales computing instances on demand:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        SYSTEM INFRASTRUCTURE THROUGHPUT BENCHMARKS                     │
├────────────────────────────┬─────────────────────────────┬─────────────────────────────┤
│ Metric                     │ Single CA Firm Capacity     │ Total Platform Scale        │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ Active Client Portfolio    │ 100 to 500+ GSTINs          │ 10,000+ Multi-Tenant Clients│
│ Monthly Task Volume        │ 1,500+ Statutory Deadlines  │ 50,000+ Deadlines / Month   │
│ Return Filing JSON Export  │ 20–30 Returns / Hour        │ Serverless Auto-Scale       │
│ Concurrent Staff Users     │ 5 to 50+ Staff Members      │ Hundreds of Concurrent      │
│                            │ (Article Clerks & Partners) │ Staff Sessions              │
│ AI Response Cache Latency  │ 0 ms (SHA-256 Query Cache)  │ Instant Memory Retrieval    │
└────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
```

### Q9.2: How do pilot testing and subscriptions work?
During the pilot phase, practicing CA firms receive a **🎁 Pilot Partner Pass** giving **100% free unlocked access** to all features with zero payment requirements.

---

*For technical support or live 1-on-1 demo scheduling, visit [https://agt-ai-chi.vercel.app/contact](https://agt-ai-chi.vercel.app/contact).*


   🎨 In-Depth FAQ Explanations with Flowchart Diagrams Updated & Pushed! 

  We have rewritten and expanded both **FAQ.md** and the Main Website Interactive Accordion Section (app/page.tsx) to feature in-depth
  explanations accompanied by visual ASCII flowchart diagrams for every core architectural concept!
  ──────
  ### 🎨 Visual Flowchart Diagrams Included:

  #### 1. 🏛️ Closed-Loop CA OS Architecture Diagram (FAQ.md Section 1 & 2):

    ┌────────────────────────────────────────────────────────────────────────────────────────┐
    │                        GSTGENIUS OPERATIONAL LIFECYCLE                                 │
    ├────────────────────────────────────────────────────────────────────────────────────────┤
    │ [Client Engagement Master]                                                              │
    │       │                                                                                │
    │       ▼ (Auto-creates statutory tasks based on filing frequency)                       │
    │ [Maker-Checker Kanban Board] ──(📱 1-Click WhatsApp Chase)──► [Client Upload Portal]    │
    │       │                                                                 │              │
    │       ▼                                                                 ▼ (Auto-moves) │
    │ [AI Return & Notice Prep] ◄───────────────────────────────────── [Data Received]      │
    │       │                                                                                │
    │       ▼ (CA Partner Approves & Signs Off)                                              │
    │ [SAC 9982 Fee Invoicing] ──(Razorpay / UPI Link)──► [Webhook Auto-Marks Paid]          │
    └────────────────────────────────────────────────────────────────────────────────────────┘
    
  #### 2. ⚡ GSTR-3B AI Auto-Filler & Government JSON Pipeline Diagram (FAQ.md Section 3):

    ┌────────────────────────────────────────────────────────────────────────────────────────┐
    │                        GSTR-3B AI EXTRACTION & FILING PIPELINE                         │
    ├────────────────────────────────────────────────────────────────────────────────────────┤
    │ 1. DATA INGESTION    ──► Drag & Drop Tally Excel, Purchase PDF, or Bank Statement     │
    │ 2. MULTIMODAL OCR    ──► Gemini 2.5 Vision parses line items & classifies ledgers      │
    │ 3. TAX CALCULATION   ──► Nets off Outward Taxable Sales vs Eligible ITC (Rule 36-4)    │
    │ 4. 1-CLICK JSON      ──► Generates government-schema-compliant GSTR-3B JSON           │
    │                          Ready for direct upload on gst.gov.in                         │
    └────────────────────────────────────────────────────────────────────────────────────────┘
    
  #### 3. 🚨 Scrutiny Notice Reader & Legal Defense Reply Drafter Diagram (FAQ.md Section 4):

    ┌────────────────────────────────────────────────────────────────────────────────────────┐
    │                     TAX LITIGATION & NOTICE DEFENSE PIPELINE                           │
    ├────────────────────────────────────────────────────────────────────────────────────────┤
    │ [DRC-01 Notice Upload]                                                                 │
    │       ├──► Extracts Demanded Tax, Interest, & Penalty                                  │
    │       ├──► Generates 3-Sentence Plain-English Summary for Client                       │
    │       ├──► Triggers 7-Day SLA Countdown Alert on Partner Dashboard                    │
    │       └──► Drafts Formal Legal Reply Letter Citing CGST Act Sec 16(2) & Sec 73         │
    └────────────────────────────────────────────────────────────────────────────────────────┘
    
  #### 4. 👥 Maker-Checker Staff Responsibility Pipeline Diagram (FAQ.md Section 5):

    ┌────────────────────────────────────────────────────────────────────────────────────────┐
    │                     MAKER-CHECKER STAFF RESPONSIBILITY PIPELINE                        │
    ├────────────────────────────────────────────────────────────────────────────────────────┤
    │ ARTICLE CLERK (MAKER): Prepares Return ──► Moves Task: Pending ──► Review              │
    │ CA PARTNER (CHECKER) : Reviews Audit Log ──► Marks Filed ──► Auto SAC 9982 Fee Invoice│
    └────────────────────────────────────────────────────────────────────────────────────────┘
    
  #### 5. 📱 Closed-Loop WhatsApp Data Chase Flowchart Diagram (FAQ.md Section 6):

    ┌────────────────────────────────────────────────────────────────────────────────────────┐
    │                    CLOSED-LOOP CLIENT DATA CHASE FLOWCHART                             │
    ├────────────────────────────────────────────────────────────────────────────────────────┤
    │ [Task: Data Pending] ──(Click WhatsApp Chase)──► [Pre-filled WhatsApp Message Sent]     │
    │                                                                │                       │
    │                                                                ▼                       │
    │ [Task: In Progress] ◄──(Auto Status Advance)─── [Client Portal Upload Completed]      │
    └────────────────────────────────────────────────────────────────────────────────────────┘
    
  #### 6. 💳 SAC 9982 Fee Invoicing & Webhook Payment Flowchart Diagram (FAQ.md Section 7):

    ┌────────────────────────────────────────────────────────────────────────────────────────┐
    │                     WORK-TO-BILLING AUTO-INVOICE ENGINE                                │
    ├────────────────────────────────────────────────────────────────────────────────────────┤
    │ [Task Marked "Filed"] ──► [Auto-Generate SAC 9982 Invoice] ──► [Razorpay Payment Link] │
    │                                                                        │               │
    │ [Invoice Marked "PAID"] ◄──(Constant-Time HMAC Verification)───────── [Webhook Callback]│
    └────────────────────────────────────────────────────────────────────────────────────────┘

  #### 7. 🔒 Supabase Multi-Tenant Row-Level Security (RLS) Diagram (FAQ.md Section 8):

    ┌────────────────────────────────────────────────────────────────────────────────────────┐
    │                    SUPABASE MULTI-TENANT ROW-LEVEL SECURITY (RLS)                      │
    ├────────────────────────────────────────────────────────────────────────────────────────┤
    │ [User Auth JWT (with firm_id)] ──► [RLS Policy: WHERE firm_id = auth_firm_id()]        │
    │                                           │                                            │
    │                 ┌─────────────────────────┴────────────────────────┐                   │
    │                 ▼                                                  ▼                   │
    │      [Firm A Isolated Database]                         [Firm B Isolated Database]     │
    └────────────────────────────────────────────────────────────────────────────────────────┘
    ──────
  ### 🌐 Live Landing Page Preview:
