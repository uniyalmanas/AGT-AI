"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Clock, AlertTriangle, CheckCircle2, UserCheck, Plus, Filter, ArrowRight, User, Sparkles } from "lucide-react";
import { ComplianceTask } from "@/app/api/tasks/route";

const COLUMNS: Array<{ key: ComplianceTask["status"]; label: string; bg: string; badge: string }> = [
  { key: "pending_data", label: "⏳ Data Pending (Client Chasing)", bg: "bg-amber-50/60 border-amber-200", badge: "badge-warning" },
  { key: "in_progress", label: "⚡ In Progress (Staff Working)", bg: "bg-blue-50/60 border-blue-200", badge: "badge-info" },
  { key: "review", label: "🔍 Under Review (Maker-Checker)", bg: "bg-purple-50/60 border-purple-200", badge: "badge-warning" },
  { key: "filed", label: "✅ Filed & Completed", bg: "bg-emerald-50/60 border-emerald-200", badge: "badge-success" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<ComplianceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTaskForm, setNewTaskForm] = useState({
    clientName: "",
    gstin: "",
    taskType: "GSTR-3B",
    period: "March 2026",
    dueDate: "20 Jul 2026",
    assignedStaff: "Rahul Sharma (Article Clerk)",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await fetch("/api/tasks");
      const json = await res.json();
      setTasks(json.tasks || []);
    } catch (e) {
      console.error("Failed to load tasks", e);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(taskId: string, newStatus: ComplianceTask["status"]) {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateStatus", taskId, newStatus }),
      });
      const json = await res.json();
      if (json.tasks) setTasks(json.tasks);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createTask", ...newTaskForm }),
      });
      const json = await res.json();
      if (json.tasks) setTasks(json.tasks);
      setShowAddModal(false);
      setNewTaskForm({
        clientName: "",
        gstin: "",
        taskType: "GSTR-3B",
        period: "March 2026",
        dueDate: "20 Jul 2026",
        assignedStaff: "Rahul Sharma (Article Clerk)",
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function handleAutoGenerateTasks() {
    try {
      const res = await fetch("/api/generate-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName: "Sunrise Traders Pvt Ltd", gstin: "27AABCU9603R1ZM", period: "March 2026" }),
      });
      const json = await res.json();
      if (json.generatedTasks) {
        setTasks((prev) => [...json.generatedTasks, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const filteredTasks = filterType === "ALL" ? tasks : tasks.filter((t) => t.taskType === filterType);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col min-h-screen space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 flex items-center gap-2">
            <CheckSquare size={24} className="text-brand-600" />
            Multi-Tax Compliance & Maker-Checker Kanban OS
          </h1>
          <p className="text-xs sm:text-sm text-ink-300 mt-1">
            Track GSTR-1, GSTR-3B, GSTR-9, TDS, ITR & ROC task handoffs with Article Clerk (Maker) → CA Partner (Checker) sign-off
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button onClick={handleAutoGenerateTasks} className="btn-secondary text-xs sm:text-sm">
            <Sparkles size={14} className="text-brand-600" /> Auto-Generate Tasks
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary text-xs sm:text-sm">
            <Plus size={15} /> New Task
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
        <Filter size={14} className="text-ink-300 ml-1" />
        <span className="text-xs text-ink-300 font-semibold uppercase tracking-wider mr-2">Filter Tax Type:</span>
        {["ALL", "GSTR-3B", "GSTR-1", "TDS 24Q/26Q", "ITR Form 3", "ROC AOC-4"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              filterType === type ? "bg-brand-600 text-white shadow-sm" : "bg-white text-ink-400 border border-ink-100 hover:bg-ink-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-2">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className={`rounded-2xl border p-4 flex flex-col h-full bg-white/70 ${col.bg}`}>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-ink-100/60">
                <span className="text-xs font-bold text-ink-900">{col.label}</span>
                <span className="text-xs font-mono font-bold bg-white text-ink-700 px-2 py-0.5 rounded-full border border-ink-100">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colTasks.map((t) => (
                  <div key={t.id} className="card p-4 bg-white hover:shadow-md transition border border-ink-100">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                        {t.taskType}
                      </span>
                      {t.urgent && <span className="badge-danger text-[10px]">Urgent Due</span>}
                    </div>

                    <h3 className="text-xs font-bold text-ink-900 leading-snug">{t.clientName}</h3>
                    <p className="text-[11px] font-mono text-ink-300 mt-0.5">{t.gstin}</p>

                    <div className="mt-3 pt-3 border-t border-ink-50 text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between text-ink-400">
                        <span>Period: <strong className="text-ink-700">{t.period}</strong></span>
                        <span className="flex items-center gap-1 font-mono text-brand-600">
                          <Clock size={11} /> {t.dueDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-ink-400">
                        <User size={11} className="text-brand-500" />
                        <span className="truncate">{t.assignedStaff}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                        <UserCheck size={11} />
                        <span className="truncate">{t.makerChecker}</span>
                      </div>
                    </div>

                    {/* Quick Move Buttons */}
                    <div className="mt-3 pt-2 flex items-center justify-between gap-1 border-t border-ink-50">
                      {t.status !== "pending_data" && (
                        <button
                          onClick={() => updateStatus(t.id, "pending_data")}
                          className="text-[10px] text-amber-700 hover:underline"
                        >
                          ← Data Pending
                        </button>
                      )}
                      {t.status === "pending_data" && (
                        <button
                          onClick={() => updateStatus(t.id, "in_progress")}
                          className="text-[10px] text-blue-700 hover:underline flex items-center gap-0.5 ml-auto"
                        >
                          Start Work →
                        </button>
                      )}
                      {t.status === "in_progress" && (
                        <button
                          onClick={() => updateStatus(t.id, "review")}
                          className="text-[10px] text-purple-700 hover:underline flex items-center gap-0.5 ml-auto"
                        >
                          Submit to Review →
                        </button>
                      )}
                      {t.status === "review" && (
                        <button
                          onClick={() => updateStatus(t.id, "filed")}
                          className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-0.5 ml-auto"
                        >
                          Approve & Mark Filed ✓
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md p-6 bg-white shadow-xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">Create Compliance Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="label">Client Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Sunrise Traders Pvt Ltd"
                  value={newTaskForm.clientName}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, clientName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Tax Return Type</label>
                  <select
                    className="input"
                    value={newTaskForm.taskType}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, taskType: e.target.value as any })}
                  >
                    <option value="GSTR-3B">GSTR-3B</option>
                    <option value="GSTR-1">GSTR-1</option>
                    <option value="TDS 24Q/26Q">TDS 24Q/26Q</option>
                    <option value="ITR Form 3">ITR Form 3</option>
                    <option value="ROC AOC-4">ROC AOC-4</option>
                  </select>
                </div>
                <div>
                  <label className="label">Period</label>
                  <input
                    type="text"
                    className="input"
                    value={newTaskForm.period}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, period: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Assigned Staff (Maker)</label>
                <input
                  type="text"
                  className="input"
                  value={newTaskForm.assignedStaff}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, assignedStaff: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-5">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
