import { readPersistentJSON, writePersistentJSON } from "@/lib/persistence";
import { getAuthContext } from "@/lib/supabase/auth";

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
  assignedMaker: string;
  assignedChecker: string;
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
];

export async function getEngagementsStoreAsync(): Promise<ClientEngagement[]> {
  try {
    const ctx = await getAuthContext();
    if (ctx) {
      const { data } = await ctx.supabase
        .from("client_engagements")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const formatted: ClientEngagement[] = data.map((d: any) => ({
          clientId: d.id,
          clientName: d.client_name,
          gstin: d.gstin,
          pan: "AABCU9603R",
          businessType: "Pvt Ltd",
          gstFrequency: d.gst_frequency,
          tdsOpted: d.tds_opted,
          itrForm: d.itr_form,
          rocOpted: d.roc_opted,
          monthlyRetainer: Number(d.monthly_retainer || 5000),
          assignedMaker: d.assigned_maker,
          assignedChecker: d.assigned_checker,
        }));
        writePersistentJSON(ENGAGEMENTS_FILE, formatted);
        return formatted;
      }
    }
  } catch (e) {
    console.warn("Supabase client_engagements fetch fallback:", e);
  }

  return readPersistentJSON<ClientEngagement[]>(ENGAGEMENTS_FILE, DEFAULT_ENGAGEMENTS);
}

export function getEngagementsStore(): ClientEngagement[] {
  return readPersistentJSON<ClientEngagement[]>(ENGAGEMENTS_FILE, DEFAULT_ENGAGEMENTS);
}

export async function saveEngagement(engagement: ClientEngagement) {
  const store = getEngagementsStore();
  const existingIndex = store.findIndex((e) => e.clientId === engagement.clientId);
  let updated: ClientEngagement[];
  if (existingIndex >= 0) {
    updated = store.map((e, idx) => (idx === existingIndex ? engagement : e));
  } else {
    updated = [engagement, ...store];
  }
  writePersistentJSON(ENGAGEMENTS_FILE, updated);

  try {
    const ctx = await getAuthContext();
    if (ctx) {
      await ctx.supabase.from("client_engagements").insert({
        firm_id: ctx.firmId,
        client_name: engagement.clientName,
        gstin: engagement.gstin,
        gst_frequency: engagement.gstFrequency,
        tds_opted: engagement.tdsOpted,
        itr_form: engagement.itrForm,
        roc_opted: engagement.rocOpted,
        monthly_retainer: engagement.monthlyRetainer,
        assigned_maker: engagement.assignedMaker,
        assigned_checker: engagement.assignedChecker,
      });
    }
  } catch (e) {
    console.warn("Supabase client_engagements insert fallback:", e);
  }

  return updated;
}
