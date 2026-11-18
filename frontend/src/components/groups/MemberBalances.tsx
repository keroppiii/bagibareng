
type Member = {
  name: string;
};

type ExpenseShare = {
  member: string;
  amount: number;
};

type Expense = {
  paidBy: string;
  amount: number;
  shares?: ExpenseShare[];
};

type MemberBalancesProps = {
  members: Member[];
  expenses: Expense[];
};

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function MemberBalances({
  members,
  expenses,
}: MemberBalancesProps) {
  const balances = members.map((member) => {
    const totalPaid = expenses
      .filter(
        (expense) =>
            expense.paidBy === member.name && expense.shares
        )
      .reduce((total, expense) => total + expense.amount, 0);

    const totalOwed = expenses.reduce((total, expense) => {
      const memberShare = expense.shares?.find(
        (share) => share.member === member.name
      );

      return total + (memberShare?.amount ?? 0);
    }, 0);

    return {
      name: member.name,
      totalPaid,
      totalOwed,
      balance: totalPaid - totalOwed,
    };
  });

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          Member Balances
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Summary of payments and expenses for each member.
        </p>
      </div>

      <div className="space-y-4">
        {balances.map((member) => (
          <div
            key={member.name}
            className="rounded-xl border border-gray-100 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-semibold text-gray-800">
                {member.name}
              </p>

              <span
                className={`text-sm font-bold ${
                  member.balance > 0
                    ? "text-green-600"
                    : member.balance < 0
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {member.balance > 0 ? "+" : ""}
                {formatRupiah(member.balance)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Total Paid</p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {formatRupiah(member.totalPaid)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Total Owed</p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {formatRupiah(member.totalOwed)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
