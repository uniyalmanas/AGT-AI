import * as XLSX from "xlsx";
const pdfParse = require("pdf-parse");
import { InlineData } from "./ai";

export interface ParsedFileResult {
  fileName: string;
  fileType: string;
  extractedText: string;
  inlineData?: InlineData;
}

/**
 * Parses uploaded file (Excel, CSV, PDF, or Image) into extracted text or base64 for Gemini Vision/OCR.
 */
export async function parseUploadedFile(file: File): Promise<ParsedFileResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = file.name;
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const mimeType = file.type || getMimeType(ext);

  // 1. Excel / CSV Spreadsheet Parsing
  if (["xlsx", "xls", "csv"].includes(ext)) {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetsText: string[] = [];

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      if (csv.trim()) {
        sheetsText.push(`--- Sheet: ${sheetName} ---\n${csv}`);
      }
    });

    return {
      fileName,
      fileType: "excel",
      extractedText: sheetsText.join("\n\n"),
    };
  }

  // 2. PDF Parsing (Text Extraction + Base64 for Gemini multimodal fallback)
  if (ext === "pdf") {
    let pdfText = "";
    try {
      const parsed = await pdfParse(buffer);
      pdfText = parsed.text || "";
    } catch {
      // If pdf-parse fails on scanned PDFs, Gemini Vision will read the base64 inlineData
    }

    const base64 = buffer.toString("base64");
    return {
      fileName,
      fileType: "pdf",
      extractedText: pdfText.trim(),
      inlineData: {
        mimeType: "application/pdf",
        data: base64,
      },
    };
  }

  // 3. Image Files (PNG, JPG, JPEG, WEBP) for OCR Vision
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) {
    const base64 = buffer.toString("base64");
    return {
      fileName,
      fileType: "image",
      extractedText: `[Image File: ${fileName}]`,
      inlineData: {
        mimeType,
        data: base64,
      },
    };
  }

  // 4. Plain Text / Tally XML
  const textContent = buffer.toString("utf-8");
  return {
    fileName,
    fileType: "text",
    extractedText: textContent,
  };
}

function getMimeType(ext: string): string {
  switch (ext) {
    case "pdf": return "application/pdf";
    case "png": return "image/png";
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "webp": return "image/webp";
    case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "xls": return "application/vnd.ms-excel";
    case "csv": return "text/csv";
    default: return "text/plain";
  }
}
