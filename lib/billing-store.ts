import { CAInvoice, ClientProfitability } from "@/app/api/billing/route";

let INITIAL_INVOICES: CAInvoice[] = [
  {
    id: "inv-101",
    invoiceNumber: "INV-2026-001",
    clientName: "Sunrise Traders Pvt Ltd",
    clientGstin: "27AABCU9603R1ZM",
    clientPhone: "+919820198201",
    date: "2026-04-01",
    dueDate: "2026-04-15",
    items: [
      { description: "GSTR-1 & GSTR-3B Quarterly Preparation (SAC 9982)", sacCode: "9982", amount: 12500 },
      { description: "TDS 26Q Quarterly Return Filing", sacCode: "9982", amount: 2500 },
    ],
    subtotal: 15000,
    cgst: 1350,
    sgst: 1350,
    igst: 0,
    totalAmount: 17700,
    status: "sent",
    paymentLink: "https://pay.razorpay.com/pl_99821a",
    upiQrUrl: "upi://pay?pa=sharma.ca@okaxis&pn=SharmaAndAssociates&am=17700&cu=INR",
  },
  {
    id: "inv-102",
    invoiceNumber: "INV-2026-002",
    clientName: "Metro Electricals",
    clientGstin: "27AAACM1234R1ZX",
    clientPhone: "+919820298202",
    date: "2026-04-05",
    dueDate: "2026-04-20",
    items: [
      { description: "GSTR-3B Monthly Filing & Reconciliation (SAC 9982)", sacCode: "9982", amount: 5000 },
    ],
    subtotal: 5000,
    cgst: 450,
    sgst: 450,
    igst: 0,
    totalAmount: 5900,
    status: "paid",
    paymentLink: "https://pay.razorpay.com/pl_99821b",
    upiQrUrl: "upi://pay?pa=sharma.ca@okaxis&pn=SharmaAndAssociates&am=5900&cu=INR",
  },
  {
    id: "inv-103",
    invoiceNumber: "INV-2026-003",
    clientName: "Patel Exports LLP",
    clientGstin: "24AABCP5678R1ZK",
    clientPhone: "+919820398203",
    date: "2026-03-10",
    dueDate: "2026-03-25",
    items: [
      { description: "GST Legal Notice DRC-01 Reply Drafting & Representation (SAC 9982)", sacCode: "9982", amount: 25000 },
    ],
    subtotal: 25000,
    cgst: 0,
    sgst: 0,
    igst: 4500,
    totalAmount: 29500,
    status: "overdue",
    paymentLink: "https://pay.razorpay.com/pl_99821c",
    upiQrUrl: "upi://pay?pa=sharma.ca@okaxis&pn=SharmaAndAssociates&am=29500&cu=INR",
  },
];

let CLIENT_PROFITABILITY: ClientProfitability[] = [
  { clientId: "c1", clientName: "Sunrise Traders Pvt Ltd", monthlyRetainer: 15000, staffHoursSpent: 18, hourlyCostRate: 250, totalStaffCost: 4500, netProfit: 10500, profitMargin: 70, status: "profitable" },
  { clientId: "c2", clientName: "Metro Electricals", monthlyRetainer: 5000, staffHoursSpent: 16, hourlyCostRate: 250, totalStaffCost: 4000, netProfit: 1000, profitMargin: 20, status: "low_margin" },
  { clientId: "c3", clientName: "Patel Exports LLP", monthlyRetainer: 8000, staffHoursSpent: 42, hourlyCostRate: 250, totalStaffCost: 10500, netProfit: -2500, profitMargin: -31, status: "loss_making" },
];

export function getInvoicesStore(): CAInvoice[] {
  return INITIAL_INVOICES;
}

export function getProfitabilityStore(): ClientProfitability[] {
  return CLIENT_PROFITABILITY;
}

export function markInvoiceAsPaid(invoiceId?: string) {
  if (!invoiceId) {
    const unpaid = INITIAL_INVOICES.find((i) => i.status !== "paid");
    if (unpaid) unpaid.status = "paid";
    return unpaid || INITIAL_INVOICES[0];
  }
  INITIAL_INVOICES = INITIAL_INVOICES.map((i) =>
    i.id === invoiceId || i.invoiceNumber === invoiceId ? { ...i, status: "paid" } : i
  );
  return INITIAL_INVOICES.find((i) => i.id === invoiceId || i.invoiceNumber === invoiceId);
}

export function addInvoiceToStore(newInv: CAInvoice) {
  INITIAL_INVOICES.unshift(newInv);
  return INITIAL_INVOICES;
}
