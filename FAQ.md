# ❓ Frequently Asked Questions (FAQ) — GSTGenius CA Practice OS

> Comprehensive guide addressing all common technical, legal, operational, and commercial questions regarding **GSTGenius (AGT-AI)** — The AI-Powered Chartered Accountant Practice Operating System.

---

## 📑 Table of Contents
1. [General & Product Vision](#1-general--product-vision)
2. [GST Execution & Filing Core](#2-gst-execution--filing-core)
3. [Tax Litigation & Notice Defense](#3-tax-litigation--notice-defense)
4. [Practice Management & Staff Workflow](#4-practice-management--staff-workflow)
5. [Client Chasing & Client Portal](#5-client-chasing--client-portal)
6. [SAC 9982 Billing & Fee Collections](#6-sac-9982-billing--fee-collections)
7. [Data Privacy, Security & Multi-Tenancy](#7-data-privacy-security--multi-tenancy)
8. [System Capacity & Technical Requirements](#8-system-capacity--technical-requirements)

---

## 1. General & Product Vision

### Q1.1: What is GSTGenius?
**GSTGenius (AGT-AI)** is an AI-native Practice Operating System designed specifically for Indian Chartered Accountant (CA) firms. Unlike traditional tax utilities that only calculate return numbers, GSTGenius connects the entire **Client → Work → Money** operational loop—combining GST return preparation, tax notice defense, staff Maker-Checker task boards, WhatsApp client data chasing, and SAC 9982 fee invoicing into one unified platform.

### Q1.2: How is GSTGenius different from ClearTax, Winman, or Jamku?
* **vs. ClearTax / Winman**: ClearTax is a filing utility. It calculates tax numbers but does NOT track staff Maker-Checker tasks, draft legal notice replies, chase clients on WhatsApp, or issue fee invoices.
* **vs. Jamku / ERPCA**: Jamku is a task board. It tracks tasks but has **zero AI capabilities** (no GSTR-3B auto-filler, no DRC-01 notice reader, no automated JSON generation).
* **GSTGenius Hybrid Advantage**: Combines **AI Execution Speed** (GSTR-3B, DRC-01 replies) with a **Full Practice Control Plane** (Kanban tasks, WhatsApp chase, SAC 9982 billing).

### Q1.3: Is GSTGenius compliant with ICAI guidelines for CA firm software?
Yes. GSTGenius is designed around Indian Chartered Accountant compliance practices. It supports maker-checker audit sign-offs, ICAI Firm Registration Number (FRN) multi-branch structures, SAC Code 9982 professional fee invoicing, and strict client data privacy under Row-Level Security (RLS).

---

## 2. GST Execution & Filing Core

### Q2.1: How does the GSTR-3B AI Auto-Filler work?
You can drag & drop Tally Excel sheets (`.xlsx`/`.csv`), purchase register PDFs, or raw text into `/gstr3b`. Gemini 2.5 Flash Vision AI inspects the file, extracts taxable B2B/B2C sales, CGST/SGST/IGST liabilities, nets off Input Tax Credit (ITC), and displays a pre-filled GSTR-3B table ready for verification.

### Q2.2: Does GSTGenius directly file returns on `gst.gov.in`?
GSTGenius generates official **government-schema-compliant GSTR-3B JSON files** using 1-click export (`/api/export-json`). You can upload this JSON file directly onto the official Government GST Portal ([`gst.gov.in`](https://www.gst.gov.in)) using your client's portal credentials or DSC/OTP.

### Q2.3: How does the 3-Way Reconciliation Checker work?
The 3-Way Reconciler (`/reconcile`) cross-examines 3 datasets:
1. **GSTR-1** (Sales reported by client)
2. **GSTR-3B** (Summary tax paid)
3. **GSTR-2B** (Auto-populated ITC from suppliers)
It computes a **0–100 Compliance Score**, flags ITC mismatches under GST Rule 36(4), and highlights short-payment risks before filing.

---

## 3. Tax Litigation & Notice Defense

### Q3.1: What types of tax notices can the Notice Reader parse?
The Notice Reader (`/notices` and `/litigation`) parses scanned PDF photos or text of:
* **DRC-01 / DRC-01A** (Pre-show cause notices for tax demand)
* **ASMT-10** (Scrutiny notices for GSTR-3B vs 2A/2B ITC mismatches)
* **Section 73 / 74** Show Cause Notices
* **Income Tax Section 148 / 143(1)** Intimations

### Q3.2: How does the AI draft legal reply letters?
When a DRC-01 PDF is uploaded, the AI legal engine:
1. Parses the demanded tax amount, interest, and penalty.
2. Extracts 3 plain-English summary bullet points for the client.
3. Generates a formal legal reply letter citing **Section 16(2)** (Conditions for claiming ITC), **Section 73** (Determination of tax not paid), and relevant High Court / Appellate rulings.

---

## 4. Practice Management & Staff Workflow

### Q4.1: What is the Maker-Checker Workflow?
In a professional CA firm, Article Clerks or Junior Assistants act as **Makers** (preparing returns and gathering data), while Senior Assistants or CA Partners act as **Checkers** (reviewing and approving returns before filing). GSTGenius embeds this workflow into every task card with timestamped Maker-Checker audit log entries.

### Q4.2: How does the Multi-Tax Kanban Compliance Board work?
The Kanban Board (`/tasks`) organizes all firm obligations across 4 operational columns:
* **`Data Pending`**: Waiting for client documents (Tally Excel, bank statement).
* **`In Progress`**: Staff actively working on calculation.
* **`Under Review`**: Submitted to CA Partner for final sign-off.
* **`Filed`**: Return uploaded to portal; triggers automatic SAC 9982 fee invoice.

---

## 5. Client Chasing & Client Portal

### Q5.1: How does 1-Click WhatsApp Checklist Chasing work?
On any task card in the `Data Pending` stage, staff can click **`📱 Chase Client on WhatsApp`**. This opens WhatsApp Web / API with a pre-filled, personalized message:
> *"Hello Sunrise Traders, GST compliance reminder for March 2026 GSTR-3B. Please upload your Tally Sales Excel & Purchase Register here: https://agt-ai-chi.vercel.app/client-portal"*

### Q5.2: What happens when a client uploads documents via the Client Portal?
When a client uploads a file on `/client-portal`:
1. The document is attached to their active task.
2. **The task status automatically advances from `Data Pending` → `In Progress`**.
3. A timestamped audit record is generated in the firm log.

---

## 6. SAC 9982 Billing & Fee Collections

### Q6.1: What is SAC Code 9982?
**SAC 9982** (Services Accounting Code 9982) is the official GST tax classification code for **"Legal and accounting services; auditing services; tax consultancy services"**. GSTGenius automatically formats all fee invoices under SAC 9982 with 18% CGST/SGST breakdown.

### Q6.2: How does Work-to-Billing Auto-Invoicing work?
As soon as a CA Partner marks a task as **`Filed`**:
* The system automatically generates a draft SAC 9982 tax invoice.
* Attaches a Razorpay payment link and UPI QR code.
* Logs the invoice in the firm's uncollected billing dashboard (`/billing`).

---

## 7. Data Privacy, Security & Multi-Tenancy

### Q7.1: Is our client data private and secure?
Yes. GSTGenius uses **Supabase PostgreSQL with Row-Level Security (RLS)**. Every firm is assigned a unique `firm_id` UUID. All database queries execute with `WHERE firm_id = auth_firm_id()`.

### Q7.2: Can Firm A see Firm B's client data?
**NO.** Firm A can never view, search, or access Firm B's clients, tasks, invoices, or uploaded files. Newly registered accounts start with an isolated database workspace.

### Q7.3: How are webhook payment signatures secured?
Razorpay payment webhooks use SHA-256 HMAC signature verification with constant-time comparison (`crypto.timingSafeEqual`) to reject forged signature attacks. Missing signature headers are rejected with HTTP 400 in production.

---

## 8. System Capacity & Technical Requirements

### Q8.1: How much work can GSTGenius handle?
* **Active Clients**: 100 to 500+ GSTINs per firm (10,000+ platform wide).
* **Monthly Tasks**: 1,500+ statutory deadlines per firm per month.
* **Filing Throughput**: 20–30 return JSON exports per hour.
* **Server Infrastructure**: Deployed on Vercel Serverless Edge, automatically scaling micro-servers during heavy 18th–20th filing rushes.

### Q8.2: What are the system requirements to run GSTGenius?
* **Browser**: Any modern web browser (Google Chrome, Microsoft Edge, Safari, Firefox).
* **Device**: Works on Laptops, Desktops, Tablets, and Smartphones (full responsive mobile drawer).

### Q8.3: How do pilot testing and plans work?
During the pilot phase, all CA firms receive a **🎁 Pilot Partner Pass** giving **100% free unlocked access** to all features with zero payment requirements.

---

*For additional support or 1-on-1 demo requests, visit [https://agt-ai-chi.vercel.app/contact](https://agt-ai-chi.vercel.app/contact).*
