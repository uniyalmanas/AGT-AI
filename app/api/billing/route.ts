import { NextRequest, NextResponse } from "next/server";
import { getInvoicesStore, getProfitabilityStore, addInvoiceToStore, markInvoiceAsPaid } from "@/lib/billing-store";

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

export async function GET() {
  return NextResponse.json({
    invoices: getInvoicesStore(),
    profitability: getProfitabilityStore(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === "updateStatus") {
      const { invoiceId, newStatus } = body;
      if (newStatus === "paid") {
        markInvoiceAsPaid(invoiceId);
      }
      return NextResponse.json({ ok: true, invoices: getInvoicesStore() });
    }

    if (body.action === "createInvoice") {
      const { clientName, clientGstin, clientPhone, items, isInterstate } = body;

      const subtotal = (items || []).reduce((acc: number, curr: InvoiceItem) => acc + (Number(curr.amount) || 0), 0);
      const taxRate = 0.18;
      const totalTax = Math.round(subtotal * taxRate);

      const cgst = isInterstate ? 0 : Math.round(totalTax / 2);
      const sgst = isInterstate ? 0 : Math.round(totalTax / 2);
      const igst = isInterstate ? totalTax : 0;
      const totalAmount = subtotal + totalTax;

      const newInv: CAInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-2026-00${getInvoicesStore().length + 1}`,
        clientName: clientName || "Client Entity",
        clientGstin: clientGstin || "27AABCU9603R1ZM",
        clientPhone: clientPhone || "+919820098200",
        date: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
        items: items?.length ? items : [{ description: "Professional Fee (SAC 9982)", sacCode: "9982", amount: subtotal }],
        subtotal,
        cgst,
        sgst,
        igst,
        totalAmount,
        status: "sent",
        paymentLink: `https://pay.razorpay.com/pl_${Math.random().toString(36).substring(2, 10)}`,
        upiQrUrl: `upi://pay?pa=sharma.ca@okaxis&pn=SharmaAndAssociates&am=${totalAmount}&cu=INR`,
      };

      const updated = addInvoiceToStore(newInv);
      return NextResponse.json({ ok: true, invoices: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
