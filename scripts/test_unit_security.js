/**
 * GSTGenius Unit Security & Schema Validation Test Suite
 * Tests Razorpay HMAC Constant-Time Signatures & AI Output Schema Validation.
 */
const crypto = require("crypto");
const assert = require("assert");

function verifyRazorpayHMAC(rawBody, headerSignature, secret) {
  if (!headerSignature || !secret) return false;

  const expectedSignatureHex = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const sigBuffer = Buffer.from(headerSignature, "utf-8");
  const expectedBuffer = Buffer.from(expectedSignatureHex, "utf-8");

  if (sigBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}

function safeParseAIJSON(jsonStr, fallback) {
  try {
    const cleaned = jsonStr.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
}

function runSecurityUnitTests() {
  console.log("🚀 Running Security & Schema Validation Unit Tests...\n");

  const secret = "test_webhook_secret_9982";
  const body = JSON.stringify({ event: "payment.captured", invoiceId: "inv-101" });
  const validSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const invalidSignature = "invalid_signature_hash_1234567890abcdef1234567890abcdef";

  // Test 1: Valid Razorpay HMAC Signature
  const isValid = verifyRazorpayHMAC(body, validSignature, secret);
  assert.strictEqual(isValid, true, "Valid Razorpay HMAC signature must pass verification");
  console.log("✅ PASSED: 1. Razorpay HMAC Constant-Time Signature Verification");

  // Test 2: Invalid Razorpay HMAC Signature Attack Prevention
  const isInvalid = verifyRazorpayHMAC(body, invalidSignature, secret);
  assert.strictEqual(isInvalid, false, "Forged signature attack must be rejected (false)");
  console.log("✅ PASSED: 2. Razorpay Forged Signature Attack Prevention");

  // Test 3: Safe AI JSON Parsing with Fallback Recovery
  const badAIResponse = "```json\n{ invalid_json_without_quotes: true \n```";
  const fallbackObj = { status: "fallback_recovered", tax: 0 };
  const parsedRes = safeParseAIJSON(badAIResponse, fallbackObj);
  assert.deepStrictEqual(parsedRes, fallbackObj, "Malformed AI output must recover via schema fallback");
  console.log("✅ PASSED: 3. AI Output Schema Fallback Recovery");

  // Test 4: Valid AI JSON Schema Extraction
  const validAIResponse = "```json\n{ \"cgst\": 9000, \"sgst\": 9000, \"status\": \"success\" }\n```";
  const validParsed = safeParseAIJSON(validAIResponse, fallbackObj);
  assert.strictEqual(validParsed.cgst, 9000, "Valid AI JSON output must parse correct properties");
  console.log("✅ PASSED: 4. Valid AI Output Property Extraction");

  console.log("\n==================================================");
  console.log("📊 SECURITY UNIT TEST SUMMARY: 4 PASSED, 0 FAILED");
  console.log("==================================================\n");
}

runSecurityUnitTests();
