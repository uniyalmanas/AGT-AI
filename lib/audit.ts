export interface AuditLogItem {
  id: string;
  actorName: string;
  actorRole: "partner" | "manager" | "article_clerk" | "client";
  action: string;
  entityType: "task" | "return" | "notice" | "invoice" | "client";
  entityId?: string;
  details: string;
  timestamp: string;
}

let INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "audit-1",
    actorName: "CA Rajesh Sharma",
    actorRole: "partner",
    action: "Filing Approved (Checker)",
    entityType: "task",
    entityId: "task-101",
    details: "Approved GSTR-3B return for Sunrise Traders Pvt Ltd (Mar 2026)",
    timestamp: "2026-08-12 18:45:00",
  },
  {
    id: "audit-2",
    actorName: "Rahul Sharma",
    actorRole: "article_clerk",
    action: "Return Submitted (Maker)",
    entityType: "task",
    entityId: "task-101",
    details: "Extracted Tally Excel dump and submitted GSTR-3B for CA sign-off",
    timestamp: "2026-08-12 16:30:00",
  },
  {
    id: "audit-3",
    actorName: "Razorpay Webhook",
    actorRole: "partner",
    action: "Fee Payment Received",
    entityType: "invoice",
    entityId: "INV-2026-001",
    details: "Payment of ₹15,000 captured via Razorpay UPI for SAC 9982 Tax Consultation",
    timestamp: "2026-08-12 14:15:00",
  },
  {
    id: "audit-4",
    actorName: "Amit Verma",
    actorRole: "manager",
    action: "DRC-01 Reply Drafted",
    entityType: "notice",
    entityId: "not-1",
    details: "Drafted legal reply under Section 16(2) for ASMT-10 scrutiny notice",
    timestamp: "2026-08-12 11:20:00",
  },
];

export function getAuditLogs(): AuditLogItem[] {
  return INITIAL_AUDIT_LOGS;
}

export function logAuditEvent(item: Omit<AuditLogItem, "id" | "timestamp">) {
  const newLog: AuditLogItem = {
    ...item,
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
  };
  INITIAL_AUDIT_LOGS.unshift(newLog);
  return newLog;
}
