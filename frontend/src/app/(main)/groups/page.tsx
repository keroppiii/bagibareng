
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type Group = {
  id: string;
  name: string;
  emoji: string;
  description: string | null;
  inviteCode: string;
  myRole: string;
  memberCount: number;
  totalExpense: number;
  createdAt: string;
};

type GroupsResponse = {
  data: Group[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGroups() {
      try {
        setLoading(true);
        setError("");

        const response =
          await apiRequest<GroupsResponse>("/groups");

        setGroups(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data grup."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatRupiah = (amount: number) => {
    return (
      "Rp " +
      amount.toLocaleString("id-ID")
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const totalMembers = groups.reduce(
    (total, group) => total + group.memberCount,
    0
  );

  const totalExpenses = groups.reduce(
    (total, group) => total + group.totalExpense,
    0
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="min-w-0 px-5 py-7 sm:px-8 lg:px-10">

        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm text-muted">
              Manage your shared expenses
            </p>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              My Groups 👥
            </h1>

            <p className="mt-2 text-sm text-muted">
              All your groups, expenses, and shared moments in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/groups/join"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-background"
            >
              <span className="text-lg">+</span>
              Join a Group
            </Link>

            <Link
              href="/groups/create"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary"
            >
              <span className="text-lg">+</span>
              Create New Group
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="text-sm font-medium text-muted">
              Total Groups
            </p>

            <h2 className="mt-3 text-2xl font-extrabold">
              {loading ? "..." : groups.length.toString().padStart(2, "0")}
            </h2>

            <p className="mt-1 text-xs text-muted">
              All your groups
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="text-sm font-medium text-muted">
              Total Members
            </p>

            <h2 className="mt-3 text-2xl font-extrabold text-green-600">
              {loading ? "..." : totalMembers}
            </h2>

            <p className="mt-1 text-xs text-muted">
              Across all groups
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="text-sm font-medium text-muted">
              Total Expenses
            </p>

            <h2 className="mt-3 text-2xl font-extrabold">
              {loading ? "..." : formatRupiah(totalExpenses)}
            </h2>

            <p className="mt-1 text-xs text-muted">
              Across all groups
            </p>
          </div>

        </div>

        {/* Group List Container */}
        <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">

          {/* Search */}
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold">
                  Your Groups
                </h2>

                <p className="mt-1 text-xs text-muted">
                  Find and manage your groups
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  ⌕
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search groups..."
                  className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted">
                Loading your groups...
              </p>
            </div>

          ) : error ? (

            /* Error */
            <div className="py-16 text-center">
              <div className="mb-3 text-4xl">⚠️</div>

              <h3 className="text-base font-bold">
                Failed to load groups
              </h3>

              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>
            </div>

          ) : filteredGroups.length > 0 ? (

            /* Groups Grid */
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-2xl border border-border p-5 transition hover:border-primary/40 hover:shadow-sm"
                >

                  {/* Card Header */}
                  <div className="mb-5 flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                        {group.emoji}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold">
                          {group.name}
                        </h3>

                        <p className="mt-1 truncate text-xs text-muted">
                          {group.description || "No description"}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-primary">
                      {group.myRole}
                    </span>

                  </div>

                  {/* Group Information */}
                  <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl bg-background p-4">

                    <div>
                      <p className="text-[11px] text-muted">
                        Total Expenses
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {formatRupiah(group.totalExpense)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-muted">
                        Members
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {group.memberCount} people
                      </p>
                    </div>

                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between gap-3">

                    <div className="min-w-0">
                      <p className="text-[10px] text-muted">
                        Created {formatDate(group.createdAt)}
                      </p>
                    </div>

                    <Link
                      href={`/groups/${group.id}`}
                      className="shrink-0 text-xs font-bold text-primary transition hover:underline"
                    >
                      View Group →
                    </Link>

                  </div>

                </div>
              ))}

            </div>

          ) : (

            /* Empty State */
            <div className="py-16 text-center">
              <div className="mb-3 text-4xl">
                {groups.length === 0 ? "👥" : "🔎"}
              </div>

              <h3 className="text-base font-bold">
                {groups.length === 0
                  ? "No groups yet"
                  : "No groups found"}
              </h3>

              <p className="mt-2 text-sm text-muted">
                {groups.length === 0
                  ? "Create a new group or join an existing one to get started."
                  : "Try another search keyword."}
              </p>

              {groups.length === 0 && (
                <Link
                  href="/groups/create"
                  className="mt-5 inline-flex rounded-full bg-primary-dark px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary"
                >
                  Create Your First Group
                </Link>
              )}
            </div>

          )}

        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-border py-5 text-center text-xs text-muted">
          © 2026 BagiBareng. Made for sharing. 💙
        </footer>

      </section>
    </main>
  );
}
