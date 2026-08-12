"use client";

import { useState, useEffect } from "react";
import { UserCheck, Users, Mail, Plus, Shield, Check, Copy, Trash2, Key, Sparkles, Building2, ExternalLink, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { StaffMember } from "@/app/api/team/route";

const ROLE_DESCRIPTIONS = {
  partner: { label: "👑 CA Partner (Owner)", badge: "badge-success", desc: "Full admin privileges, billing control, legal notice signatures & fee management." },
  manager: { label: "🔍 Tax Manager (Checker)", badge: "badge-info", desc: "Review returns prepared by clerks, manage DRC-01 notices & approve task submissions." },
  article_clerk: { label: "⚡ Article Clerk (Maker)", badge: "badge-warning", desc: "Extract client Excel/PDF returns, upload documents to Vault, and submit for review." },
};

export default function SettingsPage() {
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "article_clerk" as StaffMember["role"],
  });

  const [firmDetails, setFirmDetails] = useState({
    firmName: "Sharma & Associates",
    icaiFrn: "123456N",
    icaiMembership: "098765",
    email: "sharma@cafirm.in",
    phone: "+91 98201 98201",
    gstinLimit: 100,
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  async function fetchTeamMembers() {
    try {
      const res = await fetch("/api/team");
      const json = await res.json();
      setMembers(json.members || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleInviteStaff(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "inviteStaff", ...inviteForm }),
      });
      const json = await res.json();
      if (json.members) setMembers(json.members);
      setShowInviteModal(false);
      setInviteForm({ name: "", email: "", role: "article_clerk" });
    } catch (e) {
      console.error(e);
    }
  }

  async function handleUpdateRole(staffId: string, newRole: StaffMember["role"]) {
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateRole", staffId, newRole }),
      });
      const json = await res.json();
      if (json.members) setMembers(json.members);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleRemoveStaff(staffId: string) {
    if (!confirm("Are you sure you want to revoke this staff member's access?")) return;
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "removeStaff", staffId }),
      });
      const json = await res.json();
      if (json.members) setMembers(json.members);
    } catch (e) {
      console.error(e);
    }
  }

  function copyInviteLink(m: StaffMember) {
    if (!m.inviteLink) return;
    navigator.clipboard.writeText(m.inviteLink);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink-900 flex items-center gap-2">
          <Building2 size={24} className="text-brand-600" />
          Firm Settings & Team Access OS
        </h1>
        <p className="text-xs sm:text-sm text-ink-300 mt-1">
          Manage ICAI firm profile, invite Article Clerks and Tax Managers, and control role-based permissions
        </p>
      </div>

      {/* Firm Profile Card */}
      <div className="card p-4 sm:p-6 bg-white border border-ink-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-ink-100">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-brand-600" />
            <h2 className="text-sm font-bold text-ink-900">ICAI Firm Profile & Credentials</h2>
          </div>
          <span className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-xl border border-brand-100 font-semibold">
            Pro Firm Plan · 100 Clients Limit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="label">CA Firm Name</label>
            <input className="input" value={firmDetails.firmName} onChange={(e) => setFirmDetails({ ...firmDetails, firmName: e.target.value })} />
          </div>
          <div>
            <label className="label">ICAI Firm Reg No (FRN)</label>
            <input className="input font-mono" value={firmDetails.icaiFrn} onChange={(e) => setFirmDetails({ ...firmDetails, icaiFrn: e.target.value })} />
          </div>
          <div>
            <label className="label">ICAI Membership No</label>
            <input className="input font-mono" value={firmDetails.icaiMembership} onChange={(e) => setFirmDetails({ ...firmDetails, icaiMembership: e.target.value })} />
          </div>
          <div>
            <label className="label">Firm Official Email</label>
            <input className="input" value={firmDetails.email} onChange={(e) => setFirmDetails({ ...firmDetails, email: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Team & Staff Management Section */}
      <div className="card p-4 sm:p-6 bg-white border border-ink-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-ink-100">
          <div>
            <h2 className="text-sm font-bold text-ink-900 flex items-center gap-2">
              <Users size={18} className="text-brand-600" />
              Staff & Article Clerk Team Members
            </h2>
            <p className="text-xs text-ink-300 mt-0.5">Invite staff members to log in, assign client returns, and manage Maker-Checker workflows</p>
          </div>
          <button onClick={() => setShowInviteModal(true)} className="btn-primary text-xs sm:text-sm self-start sm:self-auto">
            <Plus size={15} /> Invite Staff Member
          </button>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-ink-50/60 font-bold text-ink-400 uppercase tracking-wider">
              <tr>
                <th className="p-3">Staff Name & Email</th>
                <th className="p-3">Role & Permissions</th>
                <th className="p-3">Assigned Clients</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-ink-50/40 transition">
                  <td className="p-3">
                    <div className="font-semibold text-ink-900">{m.name}</div>
                    <div className="text-[11px] text-ink-300 font-mono">{m.email}</div>
                  </td>
                  <td className="p-3">
                    <select
                      className="input py-1 px-2 text-xs w-auto font-semibold"
                      value={m.role}
                      onChange={(e) => handleUpdateRole(m.id, e.target.value as any)}
                    >
                      <option value="partner">👑 CA Partner (Owner)</option>
                      <option value="manager">🔍 Tax Manager (Checker)</option>
                      <option value="article_clerk">⚡ Article Clerk (Maker)</option>
                    </select>
                  </td>
                  <td className="p-3 font-mono font-semibold text-ink-700">{m.assignedClientsCount} clients</td>
                  <td className="p-3">
                    {m.status === "active" ? (
                      <span className="badge-success">✓ Active Member</span>
                    ) : (
                      <span className="badge-warning">⏳ Pending Invite</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {m.inviteLink && (
                        <button
                          onClick={() => copyInviteLink(m)}
                          className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1"
                          title="Copy Magic Registration Link"
                        >
                          {copiedId === m.id ? <><Check size={12} className="text-emerald-600" /> Copied Link</> : <><Copy size={12} /> Copy Invite Link</>}
                        </button>
                      )}
                      {m.role !== "partner" && (
                        <button
                          onClick={() => handleRemoveStaff(m.id)}
                          className="p-1.5 rounded-lg border border-ink-100 text-ink-300 hover:text-red-600 hover:bg-red-50 transition"
                          title="Revoke Staff Access"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix Reference */}
      <div className="card p-4 sm:p-6 bg-purple-50/50 border border-purple-200 space-y-3">
        <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
          <Key size={14} className="text-purple-700" /> Staff Role Access & Capability Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-purple-100">
            <p className="font-bold text-ink-900 mb-1">{ROLE_DESCRIPTIONS.partner.label}</p>
            <p className="text-ink-400 text-[11px] leading-relaxed">{ROLE_DESCRIPTIONS.partner.desc}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-purple-100">
            <p className="font-bold text-ink-900 mb-1">{ROLE_DESCRIPTIONS.manager.label}</p>
            <p className="text-ink-400 text-[11px] leading-relaxed">{ROLE_DESCRIPTIONS.manager.desc}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-purple-100">
            <p className="font-bold text-ink-900 mb-1">{ROLE_DESCRIPTIONS.article_clerk.label}</p>
            <p className="text-ink-400 text-[11px] leading-relaxed">{ROLE_DESCRIPTIONS.article_clerk.desc}</p>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md p-6 bg-white shadow-xl space-y-4">
            <h2 className="text-base font-bold text-ink-900">Invite New Staff / Article Clerk</h2>
            <form onSubmit={handleInviteStaff} className="space-y-3">
              <div>
                <label className="label">Staff Full Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Priya Patel"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Staff Email Address *</label>
                <input
                  type="email"
                  className="input"
                  placeholder="priya.article@cafirm.in"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Assigned Firm Role</label>
                <select
                  className="input"
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as any })}
                >
                  <option value="article_clerk">⚡ Article Clerk (Maker)</option>
                  <option value="manager">🔍 Tax Manager (Checker)</option>
                  <option value="partner">👑 CA Partner (Co-Owner)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 mt-5">
                <button type="button" onClick={() => setShowInviteModal(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Generate Magic Invite Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
