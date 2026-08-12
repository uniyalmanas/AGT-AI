import { NextRequest, NextResponse } from "next/server";

export interface InvoiceItem {
  description: string;
  sacCode: string; // SAC 9982 (Accounting / Auditing / Tax Consultancy)
  amount: number;
}

export interface CAInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientGstin: string;
  clientPhone: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  paymentLink: string;
  upiQrUrl: string;
}

export interface ClientProfitability {
  clientId: string;
  clientName: string;
  monthlyRetainer: number;
  staffHoursSpent: number;
  hourlyCostRate: number; // e.g. ₹250/hr for Article Clerk / Staff
  totalStaffCost: number;
  netProfit: number;
  profitMargin: number;
  status: "profitable" | "low_margin" | "loss_making";
}

let INITIAL_INVOICES: CAInvoice[] = [
  {
    id: "inv-101",
    invoiceNumber: "SA/2026/041",
    clientName: "Sunrise Traders Pvt Ltd",
    clientGstin: "27AABCU9603R1ZM",
    clientPhone: "9820198201",
    date: "2026-08-01",
    dueDate: "2026-08-15",
    items: [
      { description: "Monthly GST Filing Retainer (GSTR-1 & 3B) - July 2026", sacCode: "998222", amount: 3500 },
      { description: "DRC-01 Show Cause Notice AI Legal Reply Drafting", sacCode: "998231", amount: 4500 },
    ],
    subtotal: 8000,
    cgst: 720,
    sgst: 720,
    igst: 0,
    totalAmount: 9440,
    status: "sent",
    paymentLink: "https://pay.razorpay.com/pl_P1a2b3c4d5e6f7",
    upiQrUrl: "upi://pay?pa=sharma.ca@okaxis&pn=SharmaAndAssociates&am=9440&cu=INR",
  },
  {
    id: "inv-102",
    invoiceNumber: "SA/2026/042",
    clientName: "Metro Electricals",
    clientGstin: "27AAACM1234R1ZX",
    clientPhone: "9833098330",
    date: "2026-08-01",
    dueDate: "2026-08-10",
    items: [
      { description: "Monthly GST Compliance Retainer - July 2026", sacCode: "998222", amount: 2500 },
    ],
    subtotal: 2500,
    cgst: 225,
    sgst: 225,
    igst: 0,
    totalAmount: 2950,
    status: "paid",
    paymentLink: "https://pay.razorpay.com/pl_Q9x8y7z6w5v4u3",
    upiQrUrl: "upi://pay?pa=sharma.ca@okaxis&pn=SharmaAndAssociates&am=2950&cu=INR",
  },
  {
    id: "inv-103",
    invoiceNumber: "SA/2026/043",
    clientName: "Patel Exports LLP",
    clientGstin: "24AABCP5678R1ZK",
    clientPhone: "9879098790",
    date: "2026-07-15",
    dueDate: "2026-07-30",
    items: [
      { description: "Quarterly TDS Return Filing (Form 27EQ / 26Q)", sacCode: "998231", amount: 6000 },
    ],
    subtotal: 6000,
    cgst: 0,
    sgst: 0,
    igst: 1080,
    totalAmount: 7080,
    status: "overdue",
    paymentLink: "https://pay.razorpay.com/pl_R1m2n3b4v5c6x7",
    upiQrUrl: "upi://pay?pa=sharma.ca@okaxis&pn=SharmaAndAssociates&am=7080&cu=INR",
  },
];

let INITIAL_PROFITABILITY: ClientProfitability[] = [
  {
    clientId: "c-1",
    clientName: "Sunrise Traders Pvt Ltd",
    monthlyRetainer: 3500,
    staffHoursSpent: 4.5,
    hourlyCostRate: 250,
    totalStaffCost: 1125,
    netProfit: 2375,
    profitMargin: 67.8,
    status: "profitable",
  },
  {
    clientId: "c-2",
    clientName: "Metro Electricals",
    monthlyRetainer: 2500,
    staffHoursSpent: 3.0,
    hourlyCostRate: 250,
    totalStaffCost: 750,
    netProfit: 1750,
    profitMargin: 70.0,
    status: "profitable",
  },
  {
    clientId: "c-3",
    clientName: "Patel Exports LLP",
    monthlyRetainer: 6000,
    staffHoursSpent: 18.0,
    hourlyCostRate: 300,
    totalStaffCost: 5400,
    netProfit: 600,
    profitMargin: 10.0,
    status: "low_margin",
  },
  {
    clientId: "c-4",
    clientName: "Krishna Pharma",
    monthlyRetainer: 2000,
    staffHoursSpent: 12.0,
    hourlyCostRate: 250,
    totalStaffCost: 3000,
    netProfit: -1000,
    profitMargin: -50.0,
    status: "loss_making",
  },
];

export async function GET() {
  return NextResponse.json({
    invoices: INITIAL_INVOICES,
    profitability: INITIAL_PROFITABILITY,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === "updateStatus") {
      const { invoiceId, newStatus } = body;
      INITIAL_INVOICES = INITIAL_INVOICES.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: newStatus } : inv
      );
      return NextResponse.json({ ok: true, invoices: INITIAL_INVOICES });
    }

    if (body.action === "createInvoice") {
      const subtotal = Number(body.amount || 3000);
      const isInterstate = (body.clientGstin || "").substring(0, 2) !== "27";
      const cgst = isInterstate ? 0 : Math.round(subtotal * 0.09);
      const sgst = isInterstate ? 0 : Math.round(subtotal * 0.09);
      const igst = isInterstate ? Math.round(subtotal * 0.18) : 0;
      const totalAmount = subtotal + cgst + sgst + igst;

      const newInv: CAInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `SA/2026/${Math.floor(100 + Math.random() * 900)}`,
        clientName: body.clientName || "Client",
        clientGstin: body.clientGstin || "27AABCU9603R1ZM",
        clientPhone: body.clientPhone || "9820198201",
        date: new Date().toISOString().split("T")[0],
        dueDate: body.dueDate || "2026-08-30",
        items: [
          {
            description: body.description || "Professional Fees - SAC 9982",
            sacCode: body.sacCode || "998222",
            amount: subtotal,
          },
        ],
        subtotal,
        cgst,
        sgst,
        igst,
        totalAmount,
        status: "sent",
        paymentLink: `https://pay.razorpay.com/pl_${Math.random().toString(36).substring(2, 10)}`,
        upiQrUrl: `upi://pay?pa=sharma.ca@okaxis&pn=SharmaAndAssociates&am=${totalAmount}&cu=INR`,
      };

      INITIAL_INVOICES.unshift(newInv);
      return NextResponse.json({ ok: true, invoices: INITIAL_INVOICES });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
