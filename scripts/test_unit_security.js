/**
 * GSTGenius Unit Security & Schema Validation Test Suite
 * Tests Razorpay HMAC Constant-Time Signatures (Hex & Base64) & AI Output Schema Validation.
 */
const crypto = require("crypto");
const assert = require("assert");

function verifyRazorpayHMAC(rawBody, headerSignature, secret) {
  if (!headerSignature || !secret) return false;

  const expectedHex = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBase64 = crypto.createHmac("sha256", secret).update(rawBody).digest("base64");

  const sigBuf = Buffer.from(headerSignature, "utf-8");
  const hexBuf = Buffer.from(expectedHex, "utf-8");
  const b64Buf = Buffer.from(expectedBase64, "utf-8");

  const matchesHex = sigBuf.length === hexBuf.length && crypto.timingSafeEqual(sigBuf, hexBuf);
  const matchesBase64 = sigBuf.length === b64Buf.length && crypto.timingSafeEqual(sigBuf, b64Buf);

  return matchesHex || matchesBase64;
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
  const validHexSig = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const validBase64Sig = crypto.createHmac("sha256", secret).update(body).digest("base64");
  const invalidSignature = "invalid_signature_hash_1234567890abcdef1234567890abcdef";

  // Test 1: Valid Hex Razorpay HMAC Signature
  const isValidHex = verifyRazorpayHMAC(body, validHexSig, secret);
  assert.strictEqual(isValidHex, true, "Valid Hex Razorpay HMAC signature must pass verification");
  console.log("✅ PASSED: 1. Razorpay Hex HMAC Constant-Time Signature Verification");

  // Test 2: Valid Base64 Razorpay HMAC Signature
  const isValidBase64 = verifyRazorpayHMAC(body, validBase64Sig, secret);
  assert.strictEqual(isValidBase64, true, "Valid Base64 Razorpay HMAC signature must pass verification");
  console.log("✅ PASSED: 2. Razorpay Base64 HMAC Constant-Time Signature Verification");

  // Test 3: Invalid Razorpay HMAC Signature Attack Prevention
  const isInvalid = verifyRazorpayHMAC(body, invalidSignature, secret);
  assert.strictEqual(isInvalid, false, "Forged signature attack must be rejected (false)");
  console.log("✅ PASSED: 3. Razorpay Forged Signature Attack Prevention");

  // Test 4: Missing Signature Header Rejection
  const isMissing = verifyRazorpayHMAC(body, null, secret);
  assert.strictEqual(isMissing, false, "Missing signature header must be rejected (false)");
  console.log("✅ PASSED: 4. Missing Signature Header Rejection");

  // Test 5: Safe AI JSON Parsing with Fallback Recovery
  const badAIResponse = "```json\n{ invalid_json_without_quotes: true \n```";
  const fallbackObj = { status: "fallback_recovered", tax: 0 };
  const parsedRes = safeParseAIJSON(badAIResponse, fallbackObj);
  assert.deepStrictEqual(parsedRes, fallbackObj, "Malformed AI output must recover via schema fallback");
  console.log("✅ PASSED: 5. AI Output Schema Fallback Recovery");

  // Test 6: Valid AI JSON Schema Extraction
  const validAIResponse = "```json\n{ \"cgst\": 9000, \"sgst\": 9000, \"status\": \"success\" }\n```";
  const validParsed = safeParseAIJSON(validAIResponse, fallbackObj);
  assert.strictEqual(validParsed.cgst, 9000, "Valid AI JSON output must parse correct properties");
  console.log("✅ PASSED: 6. Valid AI Output Property Extraction");

  console.log("\n==================================================");
  console.log("📊 SECURITY UNIT TEST SUMMARY: 6 PASSED, 0 FAILED");
  console.log("==================================================\n");
}

runSecurityUnitTests();
