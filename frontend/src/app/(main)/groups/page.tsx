
"use client";

import Link from "next/link";
import { useState } from "react";
import { getInitials } from "@/utils/initials";

const groups = [
  {
    id: "weekend-trip",
    emoji: "🏖️",
    name: "Weekend Trip",
    description: "Our little getaway together",
    members: 4,
    amount: 1250000,
    status: "Active",
    color: "bg-blue-50",
    date: "Created Nov 10, 2026",
    memberNames: ["Fatimah Nurmawati", "Raia", "Zuzu", "Syifa"],
  },
  {
    id: "dinner-squad",
    emoji: "🍜",
    name: "Dinner Squad",
    description: "Food adventures with friends",
    members: 5,
    amount: 450000,
    status: "Active",
    color: "bg-orange-50",
    date: "Created Nov 08, 2026",
    memberNames: ["Edwi Tsanys", "Dimas", "Moren", "Renggo", "Haniel"],
  },
  {
    id: "kost-bersama",
    emoji: "🏠",
    name: "Kost Bersama",
    description: "Shared monthly household expenses",
    members: 3,
    amount: 800000,
    status: "Active",
    color: "bg-purple-50",
    date: "Created Nov 01, 2026",
    memberNames: ["Opal", "Alya", "Aisyah"],
  },
  {
    id: "birthday-party",
    emoji: "🎂",
    name: "Birthday Party",
    description: "Celebrating a special day",
    members: 6,
    amount: 950000,
    status: "Archived",
    color: "bg-pink-50",
    date: "Created Oct 15, 2026",
    memberNames: ["Digna Amanda", "Hanifah", "Pandora", "Kendika", "Juan", "Dimas"],
  },
];

const filters = ["All Groups", "Active", "Archived"];

export default function GroupsPage() {
  const [activeFilter, setActiveFilter] = useState("All Groups");
  const [search, setSearch] = useState("");

  const filteredGroups = groups.filter((group) => {
    const matchesFilter =
      activeFilter === "All Groups" ||
      group.status === activeFilter;

    const matchesSearch = group.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const formatRupiah = (amount: number) => {
    return "Rp " + amount.toLocaleString("id-ID");
  };

  return (
  <main className="min-h-screen bg-background text-foreground">
    <section className="min-w-0 px-5 py-7 sm:px-8 lg:px-10">

      {/* Page Header */}
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
              <p className="text-sm font-medium text-muted">Total Groups</p>
              <h2 className="mt-3 text-2xl font-extrabold">04</h2>
              <p className="mt-1 text-xs text-muted">All your groups</p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5">
              <p className="text-sm font-medium text-muted">Active Groups</p>
              <h2 className="mt-3 text-2xl font-extrabold text-green-600">
                03
              </h2>
              <p className="mt-1 text-xs text-muted">Currently ongoing</p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5">
              <p className="text-sm font-medium text-muted">Total Expenses</p>
              <h2 className="mt-3 text-2xl font-extrabold">
                Rp 3,45 jt
              </h2>
              <p className="mt-1 text-xs text-muted">Across all groups</p>
            </div>

          </div>

          {/* Group List Container */}
          <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col gap-4">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold">Your Groups</h2>
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

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-border pb-4">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      activeFilter === filter
                        ? "bg-primary-dark text-white"
                        : "bg-background text-muted hover:bg-blue-50 hover:text-primary"
                    }`}
                  >
                    {filter}
                    {filter === "All Groups" && (
                      <span className="ml-2 opacity-70">04</span>
                    )}
                    {filter === "Active" && (
                      <span className="ml-2 opacity-70">03</span>
                    )}
                    {filter === "Archived" && (
                      <span className="ml-2 opacity-70">01</span>
                    )}
                  </button>
                ))}
              </div>

            </div>

            {/* Groups Grid */}
            {filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-2xl border border-border p-5 transition hover:border-primary/40 hover:shadow-sm"
                  >

                    {/* Card Header */}
                    <div className="mb-5 flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${group.color} text-2xl`}>
                          {group.emoji}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold">
                            {group.name}
                          </h3>
                          <p className="mt-1 truncate text-xs text-muted">
                            {group.description}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${
                          group.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {group.status}
                      </span>

                    </div>

                    {/* Group Information */}
                    <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl bg-background p-4">

                      <div>
                        <p className="text-[11px] text-muted">
                          Total Expenses
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {formatRupiah(group.amount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] text-muted">
                          Members
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {group.members} people
                        </p>
                      </div>

                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between gap-3">

                      <div className="flex items-center">
                        {group.memberNames.map((name, index) => (
                            <div
                            key={name + index}
                            className={`-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-primary-dark ${
                                index % 3 === 0
                                ? "bg-blue-100"
                                : index % 3 === 1
                                ? "bg-purple-100"
                                : "bg-orange-100"
                            }`}
                            >
                            {getInitials(name)}
                            </div>
                        ))}
                        <span className="ml-2 text-[10px] text-muted">
                          {group.date}
                        </span>
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
              <div className="py-16 text-center">
                <div className="mb-3 text-4xl">🔎</div>
                <h3 className="text-base font-bold">No groups found</h3>
                <p className="mt-2 text-sm text-muted">
                  Try another search or filter.
                </p>
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