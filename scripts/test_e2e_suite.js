/**
 * GSTGenius End-to-End (E2E) Test Suite
 * Validates all 13 core compliance, filing, litigation, and billing API routes.
 */
const http = require("http");

const BASE_URL = "http://localhost:3000";

async function postJSON(path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(
      `${BASE_URL}${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function getJSON(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on("error", reject);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runE2ETests() {
  console.log("🚀 Starting End-to-End (E2E) Test Suite for GSTGenius...\n");
  let passed = 0;
  let failed = 0;

  async function assertTest(name, fn) {
    try {
      await fn();
      console.log(`✅ PASSED: ${name}`);
      passed++;
    } catch (e) {
      console.error(`❌ FAILED: ${name} -> ${e.message}`);
      failed++;
    }
  }

  // 1. GSTR-3B AI Auto-Filler API
  await assertTest("1. GSTR-3B AI Filler API (/api/fill-form)", async () => {
    const res = await postJSON("/api/fill-form", {
      rawData: "Taxable B2B Sales: 1000000, CGST: 90000, SGST: 90000, IGST: 0, ITC CGST: 50000, ITC SGST: 50000",
    });
    if (res.status !== 200 || !res.data) throw new Error(`Status ${res.status} Data: ${JSON.stringify(res.data || res.raw)}`);
  });
  await sleep(1000);

  // 2. GSTN Portal JSON Exporter API
  await assertTest("2. GSTN Portal JSON Exporter (/api/export-json)", async () => {
    const res = await postJSON("/api/export-json", {
      gstin: "27AABCU9603R1ZM",
      period: "032026",
      b2bTaxable: 1000000,
      igstPayable: 180000,
    });
    if (res.status !== 200 || !res.data) throw new Error(`Status ${res.status} Data: ${JSON.stringify(res.data || res.raw)}`);
  });

  // 3. 3-Way Reconciliation Checker API
  await assertTest("3. 3-Way Reconciliation Checker (/api/reconcile)", async () => {
    const res = await postJSON("/api/reconcile", {
      gstr1: "Sales: 10,00,000",
      gstr3b: "Sales: 10,00,000",
      gstr2b: "ITC: 1,80,000",
    });
    if (res.status !== 200 || !res.data) throw new Error(`Status ${res.status} Data: ${JSON.stringify(res.data || res.raw)}`);
  });
  await sleep(1000);

  // 4. GST Notice Reader & Reply Drafter API
  await assertTest("4. Notice Reader & Legal Drafter (/api/analyze-notice)", async () => {
    const res = await postJSON("/api/analyze-notice", {
      noticeText: "DRC-01 notice proposing demand of 25530 for short tax payment under Section 73",
    });
    if (res.status !== 200 || !res.data) throw new Error(`Status ${res.status} Data: ${JSON.stringify(res.data || res.raw)}`);
  });
  await sleep(1000);

  // 5. GST Law Copilot API
  await assertTest("5. GST Law Copilot AI Legal Counsel (/api/copilot)", async () => {
    const res = await postJSON("/api/copilot", {
      question: "What are blocked credits under Section 17(5) of CGST Act?",
    });
    if (res.status !== 200 || !res.data) throw new Error(`Status ${res.status} Data: ${JSON.stringify(res.data || res.raw)}`);
  });
  await sleep(1000);

  // 6. Multi-Tax Compliance Tasks API
  await assertTest("6. Compliance Tasks API (/api/tasks)", async () => {
    const res = await getJSON("/api/tasks");
    if (res.status !== 200 || !res.data) throw new Error(`Status ${res.status}`);
  });

  // 7. Litigation SLA Countdown Tracker API
  await assertTest("7. Litigation SLA Tracker API (/api/litigation)", async () => {
    const res = await getJSON("/api/litigation");
    if (res.status !== 200 || !res.data) throw new Error(`Status ${res.status}`);
  });

  // 8. SAC 9982 Billing & Profitability API
  await assertTest("8. SAC 9982 Billing & Profitability API (/api/billing)", async () => {
    const res = await getJSON("/api/billing");
    if (res.status !== 200 || !res.data) throw new Error(`Status ${res.status}`);
  });

  // 9. Form 26AS & AIS TDS Reconciliation API
  await assertTest("9. Form 26AS & AIS TDS Reconciler (/api/tds-reconcile)", async () => {
    const res = await postJSON("/api/tds-reconcile", {
      booksTdsData: "HDFC Bank: TDS 50000",
      form26asData: "HDFC Bank: TDS 50000",
    });
    if (res.status !== 200 || !res.data) throw new Error(`Status ${res.status} Data: ${JSON.stringify(res.data || res.raw)}`);
  });
  await sleep(1000);

  // 10. GSTR-9 & 9C Annual Audit Helper API
  await assertTest("10. Full-Year GSTR-9 & 9C Annual Audit (/api/gstr9-audit)", async () => {
    const res = await postJSON("/api/gstr9-audit", {
      annualDataText: "Turnover: 15000000, GSTR-1: 14850000",
    });
    if (res.status !== 200 || !res.data) throw new Error(`Status ${res.status} Data: ${JSON.stringify(res.data || res.raw)}`);
  });
  await sleep(1000);

  // 11. Client Portal Workspace API
  await assertTest("11. Client Self-Service Portal (/api/client-portal)", async () => {
    const res = await getJSON("/api/client-portal");
    if (res.status !== 200 || !res.data) throw new Error(`Status ${res.status}`);
  });

  // 12. Team & Staff Invites API
  await assertTest("12. Team & Staff Invites API (/api/team)", async () => {
    const res = await getJSON("/api/team");
    if (res.status !== 200 || !res.data) throw new Error(`Status ${res.status}`);
  });

  // 13. Client Master CRM API
  await assertTest("13. Client Master CRM API (/api/clients)", async () => {
    const res = await getJSON("/api/clients");
    if (res.status !== 200 || !res.data) throw new Error(`Status ${res.status}`);
  });

  console.log(`\n==================================================`);
  console.log(`📊 E2E TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runE2ETests();
