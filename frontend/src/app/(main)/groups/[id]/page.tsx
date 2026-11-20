
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

type Expense = {
  id: string;
  groupId: string;
  paidById: string;
  createdById: string;
  title: string;
  description: string | null;
  category: string;
  amount: number;
  expenseDate: string;
  splitMethod: "EQUAL" | "CUSTOM";
  createdAt: string;
  updatedAt: string;
  paidBy: {
    id: string;
    name: string;
    email: string;
  };
  createdBy: {
    id: string;
    name: string;
  };
  splits: {
    id: string;
    expenseId: string;
    userId: string;
    amountOwed: number;
    isPaid: boolean;
    paidAt: string | null;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
};

type Balance = {
  userId: string;
  name: string;
  email: string;
  totalOwed: number;
  totalOwing: number;
  balance: number;
};

type Settlement = {
  splitId: string;
  expenseId: string;
  expenseTitle: string;
  expenseAmount: number;
  expenseDate: string;
  debtor: {
    id: string;
    name: string;
    email: string;
  };
  creditor: {
    id: string;
    name: string;
    email: string;
  };
  amount: number;
  status: "UNPAID";
};

type User = {
  id: string;
  name: string;
  email: string;
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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [expenseLoading, setExpenseLoading] = useState(true);
  const [expenseError, setExpenseError] = useState("");

  const [balances, setBalances] = useState<Balance[]>([]);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState("");

  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [settlementLoading, setSettlementLoading] = useState(true);
  const [settlementError, setSettlementError] = useState("");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("FOOD");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paidById, setPaidById] = useState("");
  const [splitMethod, setSplitMethod] = useState<"EQUAL" | "CUSTOM">("EQUAL");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [customShares, setCustomShares] = useState<Record<string, string>>({});
  const [expenseSubmitting, setExpenseSubmitting] = useState(false);
  const [expenseFormError, setExpenseFormError] = useState("");

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

  useEffect(() => {
  const fetchExpenses = async () => {
    try {
      setExpenseLoading(true);
      setExpenseError("");

      const response = await apiRequest<{
        data: Expense[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/groups/${id}/expenses?page=1&limit=50`);

      setExpenses(response.data);
      setTotalTransactions(response.meta.total);
    } catch (err) {
      setExpenseError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data pengeluaran."
      );
    } finally {
      setExpenseLoading(false);
    }
  };

  fetchExpenses();
}, [id]);

useEffect(() => {
  const fetchBalances = async () => {
    try {
      setBalanceLoading(true);
      setBalanceError("");

      const response = await apiRequest<{
        data: Balance[];
      }>(`/groups/${id}/expenses/balances`);

      setBalances(response.data);
    } catch (err) {
      setBalanceError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data saldo anggota."
      );
    } finally {
      setBalanceLoading(false);
    }
  };

  fetchBalances();
}, [id]);

useEffect(() => {
  const fetchSettlements = async () => {
    try {
      setSettlementLoading(true);
      setSettlementError("");

      const response = await apiRequest<{
        data: Settlement[];
      }>(`/groups/${id}/expenses/settlements`);

      setSettlements(response.data);
    } catch (err) {
      setSettlementError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data settlements."
      );
    } finally {
      setSettlementLoading(false);
    }
  };

  fetchSettlements();
}, [id]);

useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const response = await apiRequest<{ data: User }>("/auth/me");
      setCurrentUser(response.data);
    } catch (err) {
      console.error("Gagal mengambil data pengguna:", err);
    }
  };

  fetchCurrentUser();
}, []);

const refreshGroupData = async () => {
  const [
    groupResponse,
    expenseResponse,
    balanceResponse,
    settlementResponse,
  ] = await Promise.all([
    apiRequest<{ data: GroupDetail }>(`/groups/${id}`),
    apiRequest<{
      data: Expense[];
      meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/groups/${id}/expenses?page=1&limit=50`),
    apiRequest<{ data: Balance[] }>(
      `/groups/${id}/expenses/balances`
    ),
    apiRequest<{ data: Settlement[] }>(
      `/groups/${id}/expenses/settlements`
    ),
  ]);

  console.log("REFRESH GROUP:", groupResponse.data);
  console.log("REFRESH EXPENSE META:", expenseResponse.meta);

  setGroup(groupResponse.data);
  setExpenses(expenseResponse.data);
  setTotalTransactions(expenseResponse.meta.total);
  setBalances(balanceResponse.data);
  setSettlements(settlementResponse.data);
};

const handleToggleMember = (userId: string) => {
  setSelectedMemberIds((prev) =>
    prev.includes(userId)
      ? prev.filter((id) => id !== userId)
      : [...prev, userId]
  );

  setCustomShares((prev) => {
    const updated = { ...prev };

    if (userId in updated) {
      delete updated[userId];
    } else {
      updated[userId] = "";
    }

    return updated;
  });
};

const handleEditExpense = (expense: Expense) => {
  setEditingExpenseId(expense.id);
  setExpenseTitle(expense.title);
  setExpenseDescription(expense.description ?? "");
  setExpenseCategory(expense.category);
  setExpenseAmount(String(expense.amount));
  setExpenseDate(expense.expenseDate.split("T")[0]);
  setPaidById(expense.paidById);
  setSplitMethod(expense.splitMethod);
  setSelectedMemberIds(expense.splits.map((split) => split.userId));

  const shares: Record<string, string> = {};

  expense.splits.forEach((split) => {
    shares[split.userId] = String(split.amountOwed);
  });

  setCustomShares(shares);
  setExpenseFormError("");
  setShowExpenseModal(true);
};

const handleDeleteExpense = async (expense: Expense) => {
  const confirmed = window.confirm(
    `Apakah kamu yakin ingin menghapus pengeluaran "${expense.title}"?`
  );

  if (!confirmed) return;

  try {
    await apiRequest(
      `/groups/${id}/expenses/${expense.id}`,
      {
        method: "DELETE",
      }
    );

    await refreshGroupData();

    alert("Pengeluaran berhasil dihapus!");
  } catch (err) {
    alert(
      err instanceof Error
        ? err.message
        : "Gagal menghapus pengeluaran."
    );
  }
};

const handleCreateExpense = async () => {
  setExpenseFormError("");

  if (!group) return;

  const amount = Number(expenseAmount);

  if (!expenseTitle.trim()) {
    setExpenseFormError("Nama pengeluaran wajib diisi.");
    return;
  }

  if (!Number.isInteger(amount) || amount < 1) {
    setExpenseFormError("Nominal pengeluaran minimal Rp1.");
    return;
  }

  if (!paidById) {
    setExpenseFormError("Pilih anggota yang membayar.");
    return;
  }

  if (selectedMemberIds.length === 0) {
    setExpenseFormError("Pilih minimal satu anggota yang ikut.");
    return;
  }

  if (splitMethod === "EQUAL" && amount < selectedMemberIds.length) {
    setExpenseFormError(
      "Nominal terlalu kecil untuk jumlah anggota yang dipilih."
    );
    return;
  }

  let splits: { userId: string; amountOwed?: number }[];

  if (splitMethod === "EQUAL") {
    splits = selectedMemberIds.map((userId) => ({ userId }));
  } else {
    splits = selectedMemberIds.map((userId) => ({
      userId,
      amountOwed: Number(customShares[userId]),
    }));

    const invalidShare = splits.some(
      (split) =>
        !Number.isInteger(split.amountOwed) ||
        (split.amountOwed ?? 0) <= 0
    );

    if (invalidShare) {
      setExpenseFormError(
        "Setiap nominal tanggungan harus berupa bilangan bulat lebih dari nol."
      );
      return;
    }

    const totalShares = splits.reduce(
      (sum, split) => sum + (split.amountOwed ?? 0),
      0
    );

    if (totalShares !== amount) {
      setExpenseFormError(
        "Total pembagian harus sama dengan nominal pengeluaran."
      );
      return;
    }
  }

  try {
    setExpenseSubmitting(true);

  await apiRequest(
  editingExpenseId
    ? `/groups/${id}/expenses/${editingExpenseId}`
    : `/groups/${id}/expenses`,
  {
    method: editingExpenseId ? "PATCH" : "POST",
    body: JSON.stringify({
        title: expenseTitle.trim(),
        description: expenseDescription.trim() || undefined,
        category: expenseCategory,
        amount,
        paidById,
        expenseDate: expenseDate || undefined,
        splitMethod,
        splits,
      }),
    });

    await refreshGroupData();

    setShowExpenseModal(false);
    setEditingExpenseId(null);
    setExpenseTitle("");
    setExpenseDescription("");
    setExpenseCategory("FOOD");
    setExpenseAmount("");
    setExpenseDate(new Date().toISOString().split("T")[0]);
    setPaidById(currentUser?.id ?? "");
    setSplitMethod("EQUAL");
    setSelectedMemberIds([]);
    setCustomShares({});
    setExpenseFormError("");

    alert(
  editingExpenseId
    ? "Pengeluaran berhasil diperbarui!"
    : "Pengeluaran berhasil ditambahkan!"
);
  } catch (err) {
    setExpenseFormError(
      err instanceof Error
        ? err.message
        : "Gagal menambahkan pengeluaran."
    );
  } finally {
    setExpenseSubmitting(false);
  }
};

const handleConfirmPayment = async (
  expenseId: string,
  splitId: string
) => {
  const confirmed = window.confirm(
    "Apakah kamu yakin ingin mengonfirmasi pembayaran ini sudah diterima?"
  );

  if (!confirmed) return;

  try {
    await apiRequest(
      `/groups/${id}/expenses/${expenseId}/splits/${splitId}/confirm-payment`,
      {
        method: "PATCH",
      }
    );

    await refreshGroupData();

    alert("Pembayaran berhasil dikonfirmasi!");
  } catch (err) {
    alert(
      err instanceof Error
        ? err.message
        : "Gagal mengonfirmasi pembayaran."
    );
  }
};

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
    {showExpenseModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {editingExpenseId ? "Edit Expense" : "Add Expense"}
              </h2>
              <p className="mt-1 text-xs text-muted">
                {editingExpenseId
                  ? "Update your group expense"
                  : "Record a new group expense"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowExpenseModal(false)}
              className="rounded-full px-3 py-2 text-xl text-muted hover:bg-background"
            >
              ×
            </button>
          </div>

          <div className="mt-6 max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            {/* TITLE */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Expense Name *
              </label>
              <input
                type="text"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                maxLength={100}
                placeholder="e.g. Dinner together"
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Description
              </label>
              <textarea
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                maxLength={255}
                rows={2}
                placeholder="Add a note (optional)"
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Category *
              </label>
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary"
              >
                <option value="FOOD">Food</option>
                <option value="TRANSPORT">Transport</option>
                <option value="GROCERIES">Groceries</option>
                <option value="ACCOMMODATION">Accommodation</option>
                <option value="ENTERTAINMENT">Entertainment</option>
                <option value="BILLS">Bills</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* AMOUNT */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Total Amount (Rp) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* DATE */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Expense Date *
              </label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* PAID BY */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Paid By *
              </label>

              <select
                value={paidById}
                onChange={(e) => setPaidById(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary"
              >
                <option value="">Select who paid</option>

                {group.members.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.name}
                    {member.userId === currentUser?.id ? " (You)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* SPLIT BETWEEN */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Split Between *
              </label>

              <p className="mb-3 text-xs text-muted">
                Select members who should share this expense.
              </p>

              <div className="space-y-2 rounded-xl border border-border p-4">
                {group.members.map((member) => (
                  <label
                    key={member.userId}
                    className="flex cursor-pointer items-center gap-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMemberIds.includes(member.userId)}
                      onChange={() => handleToggleMember(member.userId)}
                      className="h-4 w-4 accent-primary"
                    />

                    <span>
                      {member.name}
                      {member.userId === currentUser?.id ? " (You)" : ""}
                    </span>
                  </label>
                ))}
              </div>

              <p className="mt-2 text-xs text-muted">
                {selectedMemberIds.length} member(s) selected
              </p>
            </div>

            {/* SPLIT METHOD */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Split Method *
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSplitMethod("EQUAL");
                    setCustomShares({});
                  }}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    splitMethod === "EQUAL"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted hover:bg-background"
                  }`}
                >
                  Equal Split
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSplitMethod("CUSTOM");
                    setCustomShares({});
                  }}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    splitMethod === "CUSTOM"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted hover:bg-background"
                  }`}
                >
                  Custom Split
                </button>
              </div>

              <p className="mt-2 text-xs text-muted">
                {splitMethod === "EQUAL"
                  ? "The total expense will be divided equally among selected members."
                  : "Set a different amount for each selected member."}
              </p>
            </div>

            {/* CUSTOM SHARES */}
              {splitMethod === "CUSTOM" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Individual Shares *
                  </label>

                  {selectedMemberIds.length === 0 ? (
                    <p className="rounded-xl bg-background p-3 text-xs text-muted">
                      Select members first to set their individual shares.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {group.members
                        .filter((member) =>
                          selectedMemberIds.includes(member.userId)
                        )
                        .map((member) => (
                          <div
                            key={member.userId}
                            className="flex items-center gap-3"
                          >
                            <label className="flex-1 text-sm font-medium">
                              {member.name}
                            </label>

                            <div className="flex w-44 items-center rounded-xl border border-border px-3">
                              <span className="text-sm text-muted">Rp</span>
                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={customShares[member.userId] ?? ""}
                                onChange={(e) =>
                                  setCustomShares((prev) => ({
                                    ...prev,
                                    [member.userId]: e.target.value,
                                  }))
                                }
                                placeholder="0"
                                className="w-full bg-transparent px-2 py-3 text-right text-sm outline-none"
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  <div className="mt-3 flex justify-between rounded-xl bg-background p-3 text-sm">
                    <span className="text-muted">Total assigned</span>
                    <span className="font-semibold">
                      Rp{" "}
                      {selectedMemberIds
                        .reduce(
                          (sum, userId) =>
                            sum + (Number(customShares[userId]) || 0),
                          0
                        )
                        .toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              )}

              {/* FORM ERROR */}
            {expenseFormError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {expenseFormError}
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowExpenseModal(false);
                  setExpenseFormError("");
                }}
                disabled={expenseSubmitting}
                className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-muted transition hover:bg-background disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreateExpense}
                disabled={expenseSubmitting}
                className="rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {expenseSubmitting ? "Saving..." : "Add Expense"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

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
                onClick={() => setShowExpenseModal(true)}
                className="rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
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
                {totalTransactions} Transactions
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

              {expenseLoading ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-muted">Loading expenses...</p>
                </div>
              ) : expenseError ? (
                <div className="py-10 text-center">
                  <p className="text-sm font-semibold text-red-500">
                    {expenseError}
                  </p>
                </div>
              ) : expenses.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mb-3 text-3xl">🧾</div>

                  <p className="text-sm font-semibold text-foreground">
                    No transactions yet
                  </p>

                  <p className="mt-2 text-xs text-muted">
                    Add your first expense to start splitting bills with your group.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl">
                          🧾
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {expense.title}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            Paid by {expense.paidBy.name}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {new Date(expense.expenseDate).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            · {expense.category} · {expense.splitMethod}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <div className="sm:text-right">
                          <p className="text-sm font-bold text-foreground">
                            {formatRupiah(expense.amount)}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {expense.splits.length} members
                          </p>
                        </div>

                        {(expense.createdById === currentUser?.id ||
                          group?.myRole === "OWNER") && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditExpense(expense)}
                              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-background"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteExpense(expense)}
                              className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* MEMBER BALANCES */}
          <section className="mt-6 rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-foreground">
              Member Balances
            </h2>

            <p className="mt-1 text-xs text-muted">
              See who owes money and who should receive it
            </p>

            {balanceLoading ? (
              <p className="py-8 text-center text-sm text-muted">
                Loading member balances...
              </p>
            ) : balanceError ? (
              <p className="py-8 text-center text-sm text-red-500">
                {balanceError}
              </p>
            ) : balances.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">
                No balance data available.
              </p>
            ) : (
              <div className="mt-5 divide-y divide-border">
                {balances.map((member) => (
                  <div
                    key={member.userId}
                    className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {member.name}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {member.email}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p
                        className={`text-sm font-bold ${
                          member.balance > 0
                            ? "text-green-600"
                            : member.balance < 0
                              ? "text-red-500"
                              : "text-muted"
                        }`}
                      >
                        {member.balance > 0
                          ? `Receives ${formatRupiah(member.balance)}`
                          : member.balance < 0
                            ? `Owes ${formatRupiah(Math.abs(member.balance))}`
                            : "Settled"}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        Net balance
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SETTLEMENTS */}
          <section className="mt-6 rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-foreground">
              Settlements
            </h2>

            <p className="mt-1 text-xs text-muted">
              Outstanding payments between group members
            </p>

            {settlementLoading ? (
              <p className="py-8 text-center text-sm text-muted">
                Loading settlements...
              </p>
            ) : settlementError ? (
              <p className="py-8 text-center text-sm text-red-500">
                {settlementError}
              </p>
            ) : settlements.length === 0 ? (
              <div className="py-8 text-center">
                <div className="mb-3 text-3xl">🎉</div>
                <p className="text-sm font-semibold text-foreground">
                  All payments are settled!
                </p>
                <p className="mt-1 text-xs text-muted">
                  There are no outstanding payments in this group.
                </p>
              </div>
            ) : (
              <div className="mt-5 divide-y divide-border">
                {settlements.map((settlement) => (
                  <div
                    key={settlement.splitId}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {settlement.debtor.name}
                        <span className="mx-2 text-muted">→</span>
                        {settlement.creditor.name}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {settlement.expenseTitle}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {new Date(settlement.expenseDate).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm font-bold text-foreground">
                        {formatRupiah(settlement.amount)}
                      </p>

                      <span className="mt-1 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                        Unpaid
                      </span>

                      {currentUser?.id === settlement.creditor.id && (
                      <button
                        onClick={() =>
                          handleConfirmPayment(
                            settlement.expenseId,
                            settlement.splitId
                          )
                        }
                        className="mt-3 block rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 sm:ml-auto"
                      >
                        Confirm Payment
                      </button>
                    )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
