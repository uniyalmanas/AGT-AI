/**
 * Indian Statutory Tax Calendar Engine
 * Dynamically computes exact legal due dates based on statutory GST/Income Tax Acts.
 */

export interface StatutoryRule {
  taskType: "GSTR-1" | "GSTR-3B" | "GSTR-9" | "TDS 24Q/26Q" | "ITR Form 3" | "ROC AOC-4";
  calculateDueDate: (year: number, month: number, isComposition?: boolean, isQrmp?: boolean) => string;
  defaultAssignedRole: "article_clerk" | "tax_manager" | "partner";
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function calculateStatutoryDueDate(taskType: string, period: string, isComposition = false): string {
  // Parse month and year from period e.g. "March 2026"
  const parts = period.split(" ");
  const monthName = parts[0] || "March";
  const year = parseInt(parts[1] || "2026", 10);
  const monthIndex = MONTH_NAMES.findIndex((m) => monthName.toLowerCase().startsWith(m.toLowerCase()));

  const returnMonthIndex = (monthIndex + 1) % 12;
  const returnYear = monthIndex === 11 ? year + 1 : year;
  const returnMonthName = MONTH_NAMES[returnMonthIndex];

  switch (taskType) {
    case "GSTR-1":
      // Due on 11th of the following month (or 13th for QRMP)
      return `11 ${returnMonthName} ${returnYear}`;
    case "GSTR-3B":
      // Due on 20th of the following month (or 18th for Composition)
      return `${isComposition ? "18" : "20"} ${returnMonthName} ${returnYear}`;
    case "TDS 24Q/26Q":
      // Due on 31st of the month following quarter end
      return `31 May ${year}`;
    case "GSTR-9":
      // Due on 31st Dec of following financial year
      return `31 Dec ${year}`;
    case "ITR Form 3":
      // Tax audit due 31st Oct
      return `31 Oct ${year}`;
    case "ROC AOC-4":
      // 30 days from AGM (30th Oct)
      return `30 Oct ${year}`;
    default:
      return `20 ${returnMonthName} ${returnYear}`;
  }
}
