/**
 * GSTIN validation for Indian GST numbers.
 *
 * Format (15 chars): SS PPPPPPPPPP E Z C
 *   SS          = state code (01–38)
 *   PPPPPPPPPP  = 10-char PAN of the registered entity
 *   E           = entity/registration number within the PAN (1–9, A–Z)
 *   Z           = fixed letter 'Z' (default for normal registrations)
 *   C           = checksum character (mod-36 algorithm)
 */

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const GSTIN_CODE = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // base-36 alphabet

// Valid Indian state/UT GST codes currently in use.
const MIN_STATE = 1;
const MAX_STATE = 38;

/** Computes the GSTIN checksum character from the first 14 characters. */
export function gstinCheckDigit(first14: string): string {
  let factor = 2;
  let sum = 0;
  const n = GSTIN_CODE.length;

  for (let i = first14.length - 1; i >= 0; i--) {
    const codePoint = GSTIN_CODE.indexOf(first14[i]);
    let digit = factor * codePoint;
    factor = factor === 2 ? 1 : 2;
    digit = Math.floor(digit / n) + (digit % n);
    sum += digit;
  }

  const checkPoint = (n - (sum % n)) % n;
  return GSTIN_CODE[checkPoint];
}

export interface GstinResult {
  valid: boolean;
  error?: string;
}

/** Validates a GSTIN's format, state code, and checksum digit. */
export function validateGstin(raw: string): GstinResult {
  const gstin = (raw || "").trim().toUpperCase();

  if (!gstin) return { valid: false, error: "GSTIN is required" };
  if (gstin.length !== 15) return { valid: false, error: "GSTIN must be exactly 15 characters" };
  if (!GSTIN_REGEX.test(gstin)) return { valid: false, error: "Invalid GSTIN format" };

  const stateCode = parseInt(gstin.slice(0, 2), 10);
  if (stateCode < MIN_STATE || stateCode > MAX_STATE) {
    return { valid: false, error: `Invalid state code "${gstin.slice(0, 2)}"` };
  }

  const expected = gstinCheckDigit(gstin.slice(0, 14));
  if (expected !== gstin[14]) {
    return { valid: false, error: "Invalid GSTIN checksum — please re-check the number" };
  }

  return { valid: true };
}

/** Extracts the embedded PAN (characters 3–12) from a GSTIN. */
export function panFromGstin(gstin: string): string {
  return (gstin || "").trim().toUpperCase().slice(2, 12);
}
