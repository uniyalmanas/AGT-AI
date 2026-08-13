import { readPersistentJSON, writePersistentJSON } from "@/lib/persistence";

export interface ClientEngagement {
  clientId: string;
  clientName: string;
  gstin: string;
  pan: string;
  businessType: "Regular" | "Composition" | "SEZ" | "LLP" | "Pvt Ltd";
  gstFrequency: "Monthly" | "QRMP" | "Composition";
  tdsOpted: boolean;
  itrForm: "ITR-3" | "ITR-4" | "ITR-5" | "Tax Audit 44AB";
  rocOpted: boolean;
  monthlyRetainer: number;
  assignedMaker: string; // e.g. "Rahul Sharma (Article Clerk)"
  assignedChecker: string; // e.g. "CA Rajesh Sharma (Partner)"
}

const ENGAGEMENTS_FILE = "engagements.json";

const DEFAULT_ENGAGEMENTS: ClientEngagement[] = [
  {
    clientId: "c1",
    clientName: "Sunrise Traders Pvt Ltd",
    gstin: "27AABCU9603R1ZM",
    pan: "AABCU9603R",
    businessType: "Pvt Ltd",
    gstFrequency: "Monthly",
    tdsOpted: true,
    itrForm: "Tax Audit 44AB",
    rocOpted: true,
    monthlyRetainer: 15000,
    assignedMaker: "Rahul Sharma (Article Clerk)",
    assignedChecker: "CA Rajesh Sharma (Partner)",
  },
  {
    clientId: "c2",
    clientName: "Metro Electricals",
    gstin: "27AAACM1234R1ZX",
    pan: "AAACM1234R",
    businessType: "Regular",
    gstFrequency: "Monthly",
    tdsOpted: true,
    itrForm: "ITR-3",
    rocOpted: false,
    monthlyRetainer: 5000,
    assignedMaker: "Priya Patel (Senior Assistant)",
    assignedChecker: "CA Rajesh Sharma (Partner)",
  },
  {
    clientId: "c3",
    clientName: "Patel Exports LLP",
    gstin: "24AABCP5678R1ZK",
    pan: "AABCP5678R",
    businessType: "LLP",
    gstFrequency: "Composition",
    tdsOpted: false,
    itrForm: "ITR-5",
    rocOpted: true,
    monthlyRetainer: 8000,
    assignedMaker: "Rahul Sharma (Article Clerk)",
    assignedChecker: "CA Rajesh Sharma (Partner)",
  },
];

export function getEngagementsStore(): ClientEngagement[] {
  return readPersistentJSON<ClientEngagement[]>(ENGAGEMENTS_FILE, DEFAULT_ENGAGEMENTS);
}

export function saveEngagement(engagement: ClientEngagement) {
  const store = getEngagementsStore();
  const existingIndex = store.findIndex((e) => e.clientId === engagement.clientId);
  let updated: ClientEngagement[];
  if (existingIndex >= 0) {
    updated = store.map((e, idx) => (idx === existingIndex ? engagement : e));
  } else {
    updated = [engagement, ...store];
  }
  writePersistentJSON(ENGAGEMENTS_FILE, updated);
  return updated;
}
