import { ComplianceTask } from "@/app/api/tasks/route";
import { readPersistentJSON, writePersistentJSON } from "@/lib/persistence";

const TASKS_FILE = "tasks.json";

const DEFAULT_TASKS: ComplianceTask[] = [
  {
    id: "1",
    clientName: "Sunrise Traders Pvt Ltd",
    gstin: "27AABCU9603R1ZM",
    taskType: "GSTR-3B",
    period: "March 2026",
    dueDate: "20 Apr 2026",
    assignedStaff: "Rahul Sharma (Article Clerk)",
    makerChecker: "Rahul (Maker) → CA Sharma (Checker)",
    status: "review",
    urgent: true,
  },
  {
    id: "2",
    clientName: "Metro Electricals",
    gstin: "27AAACM1234R1ZX",
    taskType: "GSTR-1",
    period: "March 2026",
    dueDate: "11 Apr 2026",
    assignedStaff: "Priya Patel (Senior Assistant)",
    makerChecker: "Priya (Maker) → CA Sharma (Checker)",
    status: "in_progress",
    urgent: false,
  },
  {
    id: "3",
    clientName: "Patel Exports LLP",
    gstin: "24AABCP5678R1ZK",
    taskType: "TDS 24Q/26Q",
    period: "Q4 FY 2025-26",
    dueDate: "31 May 2026",
    assignedStaff: "Rahul Sharma (Article Clerk)",
    makerChecker: "Rahul (Maker) → CA Sharma (Checker)",
    status: "pending_data",
    urgent: true,
  },
  {
    id: "4",
    clientName: "Krishna Pharma",
    gstin: "29AABCK9012R1ZD",
    taskType: "ITR Form 3",
    period: "AY 2026-27",
    dueDate: "31 Oct 2026",
    assignedStaff: "Amit Verma (Tax Manager)",
    makerChecker: "Amit (Maker) → CA Sharma (Checker)",
    status: "filed",
    urgent: false,
  },
  {
    id: "5",
    clientName: "Global Fashions",
    gstin: "06AABCG3456R1ZP",
    taskType: "ROC AOC-4",
    period: "FY 2025-26",
    dueDate: "30 Oct 2026",
    assignedStaff: "Priya Patel (Senior Assistant)",
    makerChecker: "Priya (Maker) → CA Sharma (Checker)",
    status: "pending_data",
    urgent: false,
  },
];

export function getTasksStore(): ComplianceTask[] {
  return readPersistentJSON<ComplianceTask[]>(TASKS_FILE, DEFAULT_TASKS);
}

export function updateTaskStatusInStore(taskId: string, newStatus: ComplianceTask["status"]) {
  const tasks = getTasksStore();
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
  writePersistentJSON(TASKS_FILE, updated);
  return updated;
}

export function addTasksToStore(newTasks: ComplianceTask[]) {
  const tasks = getTasksStore();
  const updated = [...newTasks, ...tasks];
  writePersistentJSON(TASKS_FILE, updated);
  return updated;
}
