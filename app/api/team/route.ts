import { NextRequest, NextResponse } from "next/server";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "partner" | "manager" | "article_clerk";
  status: "active" | "pending_invite";
  assignedClientsCount: number;
  joinedDate: string;
  inviteLink?: string;
}

let INITIAL_TEAM: StaffMember[] = [
  {
    id: "staff-1",
    name: "CA Rajesh Sharma",
    email: "sharma@cafirm.in",
    role: "partner",
    status: "active",
    assignedClientsCount: 42,
    joinedDate: "2025-01-10",
  },
  {
    id: "staff-2",
    name: "Amit Verma",
    email: "amit.verma@cafirm.in",
    role: "manager",
    status: "active",
    assignedClientsCount: 18,
    joinedDate: "2025-06-15",
  },
  {
    id: "staff-3",
    name: "Rahul Sharma",
    email: "rahul.article@cafirm.in",
    role: "article_clerk",
    status: "active",
    assignedClientsCount: 12,
    joinedDate: "2026-01-05",
  },
  {
    id: "staff-4",
    name: "Priya Patel",
    email: "priya.article@cafirm.in",
    role: "article_clerk",
    status: "pending_invite",
    assignedClientsCount: 8,
    joinedDate: "2026-08-01",
    inviteLink: "https://gstgenius.in/invite?token=inv_99882211a",
  },
];

export async function GET() {
  return NextResponse.json({ members: INITIAL_TEAM });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === "inviteStaff") {
      const email = (body.email || "").trim().toLowerCase();
      const name = (body.name || email.split("@")[0]).trim();
      const role = body.role || "article_clerk";

      if (!email) {
        return NextResponse.json({ error: "Staff email is required" }, { status: 400 });
      }

      const token = `inv_${Math.random().toString(36).substring(2, 12)}`;
      const newMember: StaffMember = {
        id: `staff-${Date.now()}`,
        name,
        email,
        role,
        status: "pending_invite",
        assignedClientsCount: 0,
        joinedDate: new Date().toISOString().split("T")[0],
        inviteLink: `http://localhost:3000/register?inviteToken=${token}&email=${encodeURIComponent(email)}`,
      };

      INITIAL_TEAM.unshift(newMember);
      return NextResponse.json({ ok: true, members: INITIAL_TEAM, invitedMember: newMember });
    }

    if (body.action === "updateRole") {
      const { staffId, newRole } = body;
      INITIAL_TEAM = INITIAL_TEAM.map((s) => (s.id === staffId ? { ...s, role: newRole } : s));
      return NextResponse.json({ ok: true, members: INITIAL_TEAM });
    }

    if (body.action === "removeStaff") {
      const { staffId } = body;
      INITIAL_TEAM = INITIAL_TEAM.filter((s) => s.id !== staffId);
      return NextResponse.json({ ok: true, members: INITIAL_TEAM });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
