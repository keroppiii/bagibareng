
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type Group = {
  id: string;
  name: string;
  emoji: string;
  description: string | null;
  memberCount: number;
  totalExpense: number;
  myRole: "OWNER" | "MEMBER";
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
};

type Activity = {
  id: string;
  type: "EXPENSE_ADDED" | "PAYMENT_CONFIRMED";
  actorId: string;
  groupId: string;
  expenseId: string | null;
  expenseTitle: string;
  createdAt: string;
  actor: {
    id: string;
    name: string;
  };
  group: {
    id: string;
    name: string;
    emoji: string;
  };
};

type Balance = {
  userId: string;
  name: string;
  email: string;
  totalOwed: number;
  totalOwing: number;
  balance: number;
};

const groupColors = [
  "bg-blue-50",
  "bg-orange-50",
  "bg-purple-50",
  "bg-green-50",
  "bg-pink-50",
];

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

  const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);

  const diffInSeconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function DashboardPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [groupsResponse, userResponse, activitiesResponse] =
          await Promise.all([
            apiRequest<{ data: Group[]; meta: unknown }>("/groups"),
            apiRequest<{ data: User }>("/auth/me"),
            apiRequest<{ data: Activity[] }>("/activity"),
          ]);

        setGroups(groupsResponse.data);
        setUser(userResponse.data);
        setActivities(activitiesResponse.data);

        const balanceResponses = await Promise.all(
          groupsResponse.data.map((group) =>
            apiRequest<{ data: Balance[] }>(
              `/groups/${group.id}/expenses/balances`
            )
          )
        );

        setBalances(
          balanceResponses.flatMap((response) => response.data)
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const totalExpenses = groups.reduce(
    (total, group) => total + group.totalExpense,
    0
  );

  const myBalances = balances.filter(
  (balance) => balance.userId === user?.id
);

const totalOwing = myBalances.reduce(
  (total, balance) => total + balance.totalOwing,
  0
);

const totalOwed = myBalances.reduce(
  (total, balance) => total + balance.totalOwed,
  0
);

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const hour = today.getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="min-w-0 px-5 py-7 sm:px-8 lg:px-10">

        {/* TOP HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm text-muted">
              {formattedDate}
            </p>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {greeting}, {user?.name || "there"}! 👋
            </h1>

            <p className="mt-2 text-sm text-muted">
              Here&apos;s what&apos;s happening with your expenses.
            </p>
          </div>

          <Link
            href="/groups/create"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary"
          >
            <span className="text-lg">+</span>
            Create New Group
          </Link>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL GROUPS */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-muted">
                Total Groups
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                👥
              </span>
            </div>

            <h2 className="text-2xl font-extrabold">
              {isLoading ? "..." : groups.length.toString().padStart(2, "0")}
            </h2>

            <p className="mt-1 text-xs text-muted">
              Active groups
            </p>
          </div>

          {/* TOTAL EXPENSES */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-muted">
                Total Expenses
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-xl">
                💸
              </span>
            </div>

            <h2 className="text-2xl font-extrabold">
              {isLoading ? "..." : formatRupiah(totalExpenses)}
            </h2>

            <p className="mt-1 text-xs text-muted">
              Across all groups
            </p>
          </div>

          {/* YOU OWE */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-muted">
                You Owe
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-xl">
                ↗️
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-red-500">
              {isLoading ? "..." : formatRupiah(totalOwing)}
            </h2>

            <p className="mt-1 text-xs text-muted">
              Across all groups
            </p>
          </div>

          {/* YOU'RE OWED */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-muted">
                You&apos;re Owed
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-xl">
                ↙️
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-green-600">
              {isLoading ? "..." : formatRupiah(totalOwed)}
            </h2>

            <p className="mt-1 text-xs text-muted">
              Across all groups
            </p>
          </div>
        </div>

        {/* GROUPS AND ACTIVITIES */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* MY GROUPS */}
          <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 xl:col-span-2">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  My Groups
                </h2>

                <p className="mt-1 text-xs text-muted">
                  Manage your shared expenses
                </p>
              </div>

              <Link
                href="/groups"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <p className="py-8 text-center text-sm text-muted">
                  Loading groups...
                </p>
              ) : groups.length > 0 ? (
                groups.map((group, index) => (
                  <Link
                    href={`/groups/${group.id}`}
                    key={group.id}
                    className="flex items-center gap-3 rounded-xl border border-border p-4 transition hover:bg-background"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        groupColors[index % groupColors.length]
                      } text-2xl`}
                    >
                      {group.emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold">
                        {group.name}
                      </h3>

                      <p className="mt-1 text-xs text-muted">
                        {group.memberCount} members
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold">
                        {formatRupiah(group.totalExpense)}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        Total expense
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    No groups yet
                  </p>

                  <p className="mt-2 text-xs text-muted">
                    Create or join a group to get started.
                  </p>
                </div>
              )}
            </div>

            <Link
              href="/groups/create"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 py-3 text-sm font-semibold text-primary transition hover:bg-blue-50"
            >
              <span className="text-lg">+</span>
              Create another group
            </Link>
          </div>

          {/* RECENT ACTIVITIES */}
<div className="flex h-[400px] min-h-0 flex-col rounded-2xl border border-border bg-white p-5 sm:p-6">

  {/* HEADER */}
  <div className="mb-5 shrink-0">
    <h2 className="text-lg font-bold">
      Recent Activity
    </h2>

    <p className="mt-1 text-xs text-muted">
      Your latest transactions
    </p>
  </div>

  {/* ACTIVITY LIST */}
  <div className="min-h-0 flex-1 overflow-y-auto pr-2">
    {isLoading ? (
      <p className="py-8 text-center text-sm text-muted">
        Loading activities...
      </p>
    ) : activities.length > 0 ? (
      <div className="space-y-4">
        {activities.map((activity) => {
          const isExpenseAdded =
            activity.type === "EXPENSE_ADDED";

          const isOwnActivity =
            activity.actorId === user?.id;

          return (
            <Link
              href={`/groups/${activity.groupId}`}
              key={activity.id}
              className="flex gap-3 rounded-xl p-2 transition hover:bg-background"
            >
              {/* ICON */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                  isExpenseAdded
                    ? "bg-purple-50"
                    : "bg-green-50"
                }`}
              >
                {isExpenseAdded ? "🧾" : "✅"}
              </div>

              {/* CONTENT */}
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">
                    {isOwnActivity
                      ? "You"
                      : activity.actor.name}
                  </span>{" "}
                  {isExpenseAdded
                    ? "added an expense"
                    : "confirmed a payment"}
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-foreground">
                  {activity.expenseTitle}
                </p>

                <p className="mt-1 truncate text-xs text-muted">
                  {activity.group.emoji} {activity.group.name}
                </p>

                <p className="mt-1 text-[11px] text-muted">
                  {formatTimeAgo(activity.createdAt)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    ) : (
      <div className="flex h-full flex-col items-center justify-center py-8 text-center">
        <div className="mb-3 text-3xl">
          🧾
        </div>

        <p className="text-sm font-semibold text-foreground">
          No recent activity
        </p>

        <p className="mt-2 text-xs text-muted">
          Your latest transactions will appear here.
        </p>
      </div>
    )}
  </div>
</div>
</div>

        {/* FOOTER */}
        <footer className="mt-8 border-t border-border py-5 text-center text-xs text-muted">
          © 2026 BagiBareng. Made for sharing. 💙
        </footer>

      </section>
    </div>
  );
}
