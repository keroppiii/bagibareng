
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getInitials } from "@/utils/initials";
import MemberBalances from "@/components/groups/MemberBalances";
import Settlements from "@/components/groups/Settlements";

type ExpenseShare = {
  member: string;
  amount: number;
};

type Expense = {
  id: number;
  title: string;
  category: string;
  paidBy: string;
  amount: number;
  date: string;
  splitMethod?: "equal" | "custom";
  shares?: ExpenseShare[];
};

const groupData: Record<
  string,
  {
    name: string;
    description: string;
    emoji: string;
    inviteCode: string;
  }
> = {
  "1": {
    name: "Weekend Trip",
    description: "Our little getaway together",
    emoji: "🏖️",
    inviteCode: "BB-WK26X9",
  },
  "2": {
    name: "Dinner Squad",
    description: "Food adventures with friends",
    emoji: "🍜",
    inviteCode: "BB-DS82KQ",
  },
  "3": {
    name: "Kost Bersama",
    description: "Shared monthly household expenses",
    emoji: "🏠",
    inviteCode: "BB-KB73PL",
  },
  "4": {
    name: "Birthday Party",
    description: "Celebrating a special day",
    emoji: "🎂",
    inviteCode: "BB-BP45MN",
  },
};

const members = [
  {
    name: "Fatimah",
    initials: "FN",
    role: "Admin",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Raia",
    initials: "RA",
    role: "Member",
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Zuzuy",
    initials: "ZU",
    role: "Member",
    color: "bg-orange-100 text-orange-700",
  },
  {
    name: "Syifa",
    initials: "SY",
    role: "Member",
    color: "bg-pink-100 text-pink-700",
  },
];

const initialExpenses: Expense[] = [
  {
    id: 1,
    title: "Hotel Reservation",
    category: "Accommodation",
    paidBy: "Fatimah",
    amount: 650000,
    date: "Nov 16, 2026",
  },
  {
    id: 2,
    title: "Dinner at Restaurant",
    category: "Food & Drinks",
    paidBy: "Raia",
    amount: 350000,
    date: "Nov 15, 2026",
  },
  {
    id: 3,
    title: "Transportation",
    category: "Transport",
    paidBy: "Zuzuy",
    amount: 150000,
    date: "Nov 14, 2026",
  },
  {
    id: 4,
    title: "Snacks and Drinks",
    category: "Food & Drinks",
    paidBy: "Syifa",
    amount: 100000,
    date: "Nov 14, 2026",
  },
];

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function GroupDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const group = groupData[id] || groupData["1"];

  // EXPENSE STATES
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showForm, setShowForm] = useState(false);

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [paidBy, setPaidBy] = useState("Fatimah");

  const [splitMethod, setSplitMethod] = useState<"equal" | "custom">(
    "equal"
  );

  const [splitWith, setSplitWith] = useState<string[]>(
    members.map((member) => member.name)
  );

  const [customShares, setCustomShares] = useState<
    Record<string, string>
  >({});

  // CALCULATE EQUAL SPLIT
  const calculateEqualSplit = (
    amount: number,
    selectedMembers: string[]
  ) => {
    if (selectedMembers.length === 0) return [];

    const baseAmount = Math.floor(
      amount / selectedMembers.length
    );

    const remainder = amount % selectedMembers.length;

    return selectedMembers.map((member, index) => ({
      member,
      amount:
        baseAmount + (index < remainder ? 1 : 0),
    }));
  };

  // CALCULATE CUSTOM SPLIT
  const calculateCustomSplit = (
    selectedMembers: string[]
  ) => {
    return selectedMembers.map((member) => ({
      member,
      amount: Number(customShares[member] || 0),
    }));
  };

  // SPLIT VALIDATION
  const expenseTotal = Number(expenseAmount) || 0;

  const currentShares =
    splitMethod === "equal"
      ? calculateEqualSplit(expenseTotal, splitWith)
      : calculateCustomSplit(splitWith);

  const splitTotal = currentShares.reduce(
    (total, share) => total + share.amount,
    0
  );

  const isSplitValid =
    expenseTotal > 0 &&
    splitWith.length > 0 &&
    currentShares.every(
      (share) =>
        Number.isFinite(share.amount) &&
        share.amount > 0
    ) &&
    splitTotal === expenseTotal;

  // TOTAL EXPENSES
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // RESET FORM
  const resetExpenseForm = () => {
    setExpenseTitle("");
    setExpenseAmount("");
    setPaidBy("Fatimah");
    setSplitWith(members.map((member) => member.name));
    setCustomShares({});
    setSplitMethod("equal");
  };

  // ADD EXPENSE
  const handleAddExpense = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !expenseTitle.trim() ||
      !Number.isFinite(expenseTotal) ||
      expenseTotal <= 0 ||
      !isSplitValid
    ) {
      return;
    }

    const newExpense: Expense = {
      id: expenses.length + 1,
      title: expenseTitle.trim(),
      category: "Other",
      paidBy,
      amount: expenseTotal,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      splitMethod,
      shares: currentShares,
    };

    setExpenses((prev) => [newExpense, ...prev]);

    resetExpenseForm();
    setShowForm(false);
  };

  // TOGGLE SELECT ALL MEMBERS
  const handleSelectAll = () => {
    if (splitWith.length === members.length) {
      setSplitWith([]);
      setCustomShares({});
    } else {
      setSplitWith(members.map((member) => member.name));
    }
  };

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
                      {group.description}
                    </p>

                    <p className="mt-3 text-xs text-muted">
                      Created by Fatimah · 4 members
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForm(!showForm)}
                  className="rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary"
                >
                  + Add Expense
                </button>
              </div>

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

            {/* ADD EXPENSE FORM */}
            {showForm && (
              <section className="mb-7 rounded-3xl border border-border bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-base font-bold">
                    Add New Expense
                  </h2>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-xl text-muted hover:text-foreground"
                  >
                    ×
                  </button>
                </div>

                <form
                  onSubmit={handleAddExpense}
                  className="grid gap-5 sm:grid-cols-2"
                >

                  {/* EXPENSE NAME */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-muted">
                      Expense Name
                    </label>

                    <input
                      type="text"
                      value={expenseTitle}
                      onChange={(e) =>
                        setExpenseTitle(e.target.value)
                      }
                      placeholder="e.g. Lunch together"
                      required
                      className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none transition focus:border-primary"
                    />
                  </div>

                  {/* AMOUNT */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-muted">
                      Amount (Rp)
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={expenseAmount}
                      onChange={(e) =>
                        setExpenseAmount(e.target.value)
                      }
                      placeholder="e.g. 50000"
                      required
                      className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none transition focus:border-primary"
                    />
                  </div>

                  {/* PAID BY */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-semibold text-muted">
                      Paid By
                    </label>

                    <select
                      value={paidBy}
                      onChange={(e) => setPaidBy(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                    >
                      {members.map((member) => (
                        <option
                          key={member.initials}
                          value={member.name}
                        >
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SPLIT WITH */}
                  <div className="sm:col-span-2">
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-xs font-semibold text-muted">
                        Split With
                      </label>

                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-xs font-semibold text-primary-dark hover:underline"
                      >
                        {splitWith.length === members.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {members.map((member) => (
                        <label
                          key={member.name}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                            splitWith.includes(member.name)
                              ? "border-[#3159d9] bg-blue-50"
                              : "border-border bg-white"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={splitWith.includes(member.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSplitWith((prev) => [
                                  ...prev,
                                  member.name,
                                ]);
                              } else {
                                setSplitWith((prev) =>
                                  prev.filter(
                                    (name) => name !== member.name
                                  )
                                );

                                setCustomShares((prev) => {
                                  const updated = { ...prev };
                                  delete updated[member.name];
                                  return updated;
                                });
                              }
                            }}
                            className="h-4 w-4 accent-[#3159d9]"
                          />

                          <span className="text-sm font-medium text-foreground">
                            {member.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* SPLIT METHOD */}
                  <div className="sm:col-span-2">
                    <label className="mb-3 block text-xs font-semibold text-muted">
                      Split Method
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSplitMethod("equal")}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                          splitMethod === "equal"
                            ? "border-[#3159d9] bg-blue-50 text-primary-dark"
                            : "border-border bg-white text-muted hover:bg-gray-50"
                        }`}
                      >
                        Equal Split
                      </button>

                      <button
                        type="button"
                        onClick={() => setSplitMethod("custom")}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                          splitMethod === "custom"
                            ? "border-[#3159d9] bg-blue-50 text-primary-dark"
                            : "border-border bg-white text-muted hover:bg-gray-50"
                        }`}
                      >
                        Custom Split
                      </button>
                    </div>
                  </div>

                  {/* EQUAL SPLIT DETAILS */}
                  {splitMethod === "equal" ? (
                    <div className="sm:col-span-2 rounded-2xl bg-blue-50 p-5">
                      <p className="mb-3 text-sm font-bold text-primary-dark">
                        Equal Split Details
                      </p>

                      {currentShares.length > 0 ? (
                        <div className="space-y-3">
                          {currentShares.map((share) => (
                            <div
                              key={share.member}
                              className="flex justify-between text-sm text-foreground"
                            >
                              <span>{share.member}</span>

                              <span className="font-semibold">
                                {formatRupiah(share.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted">
                          Select at least one member to split this expense.
                        </p>
                      )}
                    </div>
                  ) : (
                    /* CUSTOM SPLIT DETAILS */
                    <div className="sm:col-span-2 rounded-2xl border border-border p-5">
                      <p className="mb-4 text-sm font-bold text-foreground">
                        Custom Split Details
                      </p>

                      {splitWith.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {splitWith.map((member) => (
                            <div key={member}>
                              <label className="mb-2 block text-xs font-semibold text-muted">
                                {member}
                              </label>

                              <input
                                type="number"
                                min="1"
                                value={customShares[member] ?? ""}
                                onChange={(e) =>
                                  setCustomShares((prev) => ({
                                    ...prev,
                                    [member]: e.target.value,
                                  }))
                                }
                                placeholder="Enter amount"
                                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none transition focus:border-primary"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted">
                          Select at least one member first.
                        </p>
                      )}
                    </div>
                  )}

                  {/* SPLIT SUMMARY */}
                  <div className="sm:col-span-2 rounded-2xl bg-background p-5">
                    <p className="mb-4 text-sm font-bold text-foreground">
                      Split Summary
                    </p>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted">
                        Expense Amount
                      </span>

                      <span className="font-semibold text-foreground">
                        {formatRupiah(expenseTotal)}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-muted">
                        Total Split
                      </span>

                      <span className="font-semibold text-foreground">
                        {formatRupiah(splitTotal)}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-border pt-3">
                      <p
                        className={`text-xs font-semibold ${
                          isSplitValid
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {isSplitValid
                          ? "✓ Split amount is valid"
                          : splitWith.length === 0
                            ? "Select at least one member"
                            : expenseTotal <= 0
                              ? "Enter a valid expense amount"
                              : splitTotal < expenseTotal
                                ? `Remaining: ${formatRupiah(
                                    expenseTotal - splitTotal
                                  )}`
                                : splitTotal > expenseTotal
                                  ? `Excess: ${formatRupiah(
                                      splitTotal - expenseTotal
                                    )}`
                                  : "Enter a valid amount for each member"}
                      </p>
                    </div>
                  </div>

                  {/* SAVE EXPENSE */}
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={
                        !isSplitValid ||
                        !expenseTitle.trim()
                      }
                      className="w-full rounded-xl bg-primary-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Save Expense
                    </button>
                  </div>
                </form>
              </section>
            )}

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
                  {formatRupiah(totalExpenses)}
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
                  {members.length} Members
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
                  {expenses.length} Transactions
                </h2>
              </div>
            </section>

            {/* MEMBERS AND EXPENSES */}
            <div className="grid items-start gap-6 lg:grid-cols-3">

              {/* MEMBERS */}
              <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-base font-bold text-foreground">
                    Members
                  </h2>

                  <span className="text-xs text-muted">
                    {members.length} people
                  </span>
                </div>

                <div className="flex flex-col gap-5">
                  {members.map((member) => (
                    <div
                      key={member.initials}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${member.color}`}
                      >
                        {getInitials(member.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {member.name}
                        </p>

                        <p className="text-[11px] text-muted">
                          {member.role}
                        </p>
                      </div>

                      {member.role === "Admin" && (
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-primary-dark">
                          Admin
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* EXPENSE HISTORY */}
              <section className="rounded-3xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Expense History
                    </h2>

                    <p className="mt-1 text-xs text-muted">
                      All transactions in this group
                    </p>
                  </div>

                  <span className="rounded-full bg-background px-3 py-1.5 text-[10px] font-semibold text-muted">
                    {expenses.length} expenses
                  </span>
                </div>

                <div className="flex flex-col">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center gap-3 border-b border-border py-4 last:border-0"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background text-lg">
                        {expense.category === "Accommodation"
                          ? "🏨"
                          : expense.category === "Food & Drinks"
                            ? "🍽️"
                            : expense.category === "Transport"
                              ? "🚕"
                              : "🧾"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {expense.title}
                        </p>

                        <p className="mt-1 text-[11px] text-muted">
                          Paid by {expense.paidBy} · {expense.date}
                        </p>

                        {expense.shares && (
                          <p className="mt-1 text-[11px] text-primary-dark">
                            {expense.splitMethod === "custom"
                              ? "Custom Split"
                              : "Equal Split"}{" "}
                            · Split among {expense.shares.length} members
                          </p>
                        )}
                      </div>

                      <p className="shrink-0 text-sm font-bold text-foreground">
                        {formatRupiah(expense.amount)}
                      </p>
                    </div>
                  ))}

                  {expenses.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted">
                      No expenses yet. Add your first expense!
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* MEMBER BALANCES */}
            <section className="mt-6">
            <MemberBalances
                members={members}
                expenses={expenses}
            />
            </section>

            {/* SETTLEMENTS */}
            <section className="mt-6">
            <Settlements
                members={members}
                expenses={expenses}
            />
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