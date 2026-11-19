
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { getInitials } from "@/utils/initials";

type GroupMember = {
  userId: string;
  name: string;
  email: string;
  role: "OWNER" | "MEMBER";
  joinedAt: string;
};

type GroupDetail = {
  id: string;
  name: string;
  description: string | null;
  emoji: string;
  inviteCode: string;
  ownerId: string;
  myRole: "OWNER" | "MEMBER";
  memberCount: number;
  totalExpense: number;
  members: GroupMember[];
  createdAt: string;
  updatedAt: string;
};

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const memberColors = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
];

export default function GroupDetailPage() {
  const params = useParams();
  const id = String(params.id);

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await apiRequest<{ data: GroupDetail }>(
          `/groups/${id}`
        );

        setGroup(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil detail grup."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">
          Loading group details...
        </p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-sm text-red-500">
          {error || "Group not found."}
        </p>

        <Link
          href="/groups"
          className="text-sm font-semibold text-primary-dark hover:underline"
        >
          Back to My Groups
        </Link>
      </div>
    );
  }

  const owner = group.members.find(
    (member) => member.userId === group.ownerId
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="min-w-0 px-5 py-7 md:px-9 md:py-8">
        <div className="mx-auto max-w-6xl">

          {/* BREADCRUMB */}
          <div className="mb-6 flex items-center gap-2 text-xs text-muted">
            <Link
              href="/groups"
              className="transition hover:text-primary-dark"
            >
              My Groups
            </Link>

            <span>/</span>

            <span className="font-medium text-foreground">
              {group.name}
            </span>
          </div>

          {/* GROUP HEADER */}
          <section className="mb-7 rounded-3xl border border-border bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  {group.emoji}
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      {group.name}
                    </h1>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-semibold text-green-600">
                      Active
                    </span>
                  </div>

                  <p className="text-sm text-muted">
                    {group.description || "No description"}
                  </p>

                  <p className="mt-3 text-xs text-muted">
                    Created by {owner?.name || "Unknown"} ·{" "}
                    {group.memberCount} members
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled
                title="Available after Expenses API integration"
                className="cursor-not-allowed rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-white opacity-50"
              >
                + Add Expense
              </button>
            </div>

            {/* INVITATION CODE */}
            <div className="mt-7 flex flex-col gap-3 rounded-2xl bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Group Invitation Code
                </p>

                <p className="mt-1 text-xs text-muted">
                  Share this code with your friends to invite them.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-lg border border-dashed border-border bg-white px-4 py-2 text-sm font-bold tracking-wider text-primary-dark">
                  {group.inviteCode}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(group.inviteCode);
                    alert("Invitation code copied!");
                  }}
                  className="text-xs font-semibold text-primary-dark hover:underline"
                >
                  Copy code
                </button>
              </div>
            </div>
          </section>

          {/* SUMMARY CARDS */}
          <section className="mb-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg">
                💰
              </div>

              <p className="text-xs font-medium text-muted">
                Total Expenses
              </p>

              <h2 className="mt-2 text-xl font-bold text-foreground">
                {formatRupiah(group.totalExpense)}
              </h2>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-lg">
                👥
              </div>

              <p className="text-xs font-medium text-muted">
                Group Members
              </p>

              <h2 className="mt-2 text-xl font-bold text-foreground">
                {group.memberCount} Members
              </h2>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-lg">
                🧾
              </div>

              <p className="text-xs font-medium text-muted">
                Total Transactions
              </p>

              <h2 className="mt-2 text-xl font-bold text-foreground">
                Coming soon
              </h2>
            </div>
          </section>

          {/* MEMBERS AND EXPENSE HISTORY */}
          <div className="grid items-start gap-6 lg:grid-cols-3">

            {/* MEMBERS */}
            <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">
                  Members
                </h2>

                <span className="text-xs text-muted">
                  {group.members.length} people
                </span>
              </div>

              <div className="flex flex-col gap-5">
                {group.members.map((member, index) => (
                  <div
                    key={member.userId}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        memberColors[index % memberColors.length]
                      }`}
                    >
                      {getInitials(member.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {member.name}
                      </p>

                      <p className="text-[11px] text-muted">
                        {member.role === "OWNER" ? "Admin" : "Member"}
                      </p>
                    </div>

                    {member.role === "OWNER" && (
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-primary-dark">
                        Admin
                      </span>
                    )}
                  </div>
                ))}

                {group.members.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted">
                    No members found.
                  </p>
                )}
              </div>
            </section>

            {/* EXPENSE HISTORY */}
            <section className="rounded-3xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-5">
                <h2 className="text-base font-bold text-foreground">
                  Expense History
                </h2>

                <p className="mt-1 text-xs text-muted">
                  All transactions in this group
                </p>
              </div>

              <div className="py-10 text-center">
                <div className="mb-3 text-3xl">🧾</div>

                <p className="text-sm font-semibold text-foreground">
                  Transaction integration is coming soon
                </p>

                <p className="mt-2 text-xs text-muted">
                  Your group expenses will appear here once the Expenses API is ready.
                </p>
              </div>
            </section>
          </div>

          {/* MEMBER BALANCES */}
          <section className="mt-6 rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-foreground">
              Member Balances
            </h2>

            <p className="mt-2 text-sm text-muted">
              Member balances will be calculated from actual transactions
              once the Expenses API is integrated.
            </p>
          </section>

          {/* SETTLEMENTS */}
          <section className="mt-6 rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-foreground">
              Settlements
            </h2>

            <p className="mt-2 text-sm text-muted">
              Settlement details will be available after transaction
              integration.
            </p>
          </section>

          {/* FOOTER */}
          <footer className="mt-10 border-t border-border py-6 text-center text-xs text-muted">
            © 2026 BagiBareng. Split expenses, share happiness.
          </footer>

        </div>
      </main>
    </div>
  );
}
