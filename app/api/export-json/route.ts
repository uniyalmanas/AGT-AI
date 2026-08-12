import { NextRequest, NextResponse } from "next/server";

/**
 * Generates an official portal-ready GSTR-3B JSON payload compatible with gst.gov.in upload.
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const gstin = (data.gstin || "27AABCU9603R1ZM").trim();
    const period = (data.period || "032026").replace(/[^0-9]/g, "").slice(0, 6) || "032026";

    // Official GSTN GSTR-3B JSON Schema structure
    const gstnPayload = {
      gstin: gstin,
      ret_period: period,
      sup_details: {
        osup_det: {
          txval: data.b2bTaxable || 0,
          iamt: data.igstPayable || 0,
          camt: Math.round((data.b2bTaxable || 0) * 0.09),
          samt: Math.round((data.b2bTaxable || 0) * 0.09),
          csamt: 0,
        },
        osup_zero: {
          txval: data.exportSupplies || 0,
          iamt: 0,
          csamt: 0,
        },
        osup_nil_exmp: {
          txval: data.nilExempt || 0,
        },
        isup_rev: {
          txval: data.reverseCharge || 0,
          iamt: 0,
          camt: 0,
          samt: 0,
          csamt: 0,
        },
      },
      itc_elg: {
        itc_avl: [
          {
            ty: "OTH",
            iamt: data.itcIGST || 0,
            camt: data.itcCGST || 0,
            samt: data.itcSGST || 0,
            csamt: 0,
          },
        ],
        itc_rev: [],
        itc_inelg: [],
      },
      inr_details: {
        iamt: data.interest || 0,
        camt: 0,
        samt: 0,
        csamt: 0,
      },
    };

    return new NextResponse(JSON.stringify(gstnPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename=GSTR3B_${gstin}_${period}.json`,
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to generate GSTN JSON";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
