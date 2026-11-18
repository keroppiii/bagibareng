
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

type Settlement = {
  from: string;
  to: string;
  amount: number;
};

type SettlementsProps = {
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

export default function Settlements({
  members,
  expenses,
}: SettlementsProps) {
  // CALCULATE MEMBER BALANCES
  const balances = members.map((member) => {
    const totalPaid = expenses
      .filter(
        (expense) =>
          expense.paidBy === member.name && expense.shares
      )
      .reduce((total, expense) => total + expense.amount, 0);

    const totalOwed = expenses.reduce((total, expense) => {
      const share = expense.shares?.find(
        (item) => item.member === member.name
      );

      return total + (share?.amount ?? 0);
    }, 0);

    return {
      name: member.name,
      balance: totalPaid - totalOwed,
    };
  });

  // SEPARATE CREDITORS AND DEBTORS
  const creditors = balances
    .filter((member) => member.balance > 0)
    .map((member) => ({
      name: member.name,
      remaining: member.balance,
    }));

  const debtors = balances
    .filter((member) => member.balance < 0)
    .map((member) => ({
      name: member.name,
      remaining: Math.abs(member.balance),
    }));

  // CALCULATE SETTLEMENTS
  const settlements: Settlement[] = [];

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (
    debtorIndex < debtors.length &&
    creditorIndex < creditors.length
  ) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];

    const amount = Math.min(
      debtor.remaining,
      creditor.remaining
    );

    if (amount > 0) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount,
      });
    }

    debtor.remaining -= amount;
    creditor.remaining -= amount;

    if (debtor.remaining === 0) {
      debtorIndex++;
    }

    if (creditor.remaining === 0) {
      creditorIndex++;
    }
  }

  return (
    <section className="rounded-3xl border border-[#e9edf5] bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#202b3c]">
          Settlements
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Suggested payments to settle all group expenses.
        </p>
      </div>

      {settlements.length > 0 ? (
        <div className="space-y-3">
          {settlements.map((settlement, index) => (
            <div
              key={`${settlement.from}-${settlement.to}-${index}`}
              className="flex flex-col gap-3 rounded-2xl border border-[#e9edf5] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-500">
                  {settlement.from.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {settlement.from}
                  </p>

                  <p className="text-xs text-gray-400">
                    Needs to pay
                  </p>
                </div>

                <span className="text-lg text-gray-300">
                  →
                </span>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-bold text-green-600">
                  {settlement.to.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {settlement.to}
                  </p>

                  <p className="text-xs text-gray-400">
                    Receives payment
                  </p>
                </div>
              </div>

              <p className="text-base font-bold text-[#3159d9] sm:text-right">
                {formatRupiah(settlement.amount)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#f7f9fc] px-5 py-8 text-center">
          <div className="mb-3 text-3xl">🎉</div>

          <p className="text-sm font-semibold text-gray-700">
            All Settled Up!
          </p>

          <p className="mt-1 text-xs text-gray-400">
            There are no outstanding payments in this group.
          </p>
        </div>
      )}

      <div className="mt-5 rounded-xl bg-[#edf2ff] p-4">
        <p className="text-xs leading-relaxed text-[#3159d9]">
          These are suggested payments based on each member&apos;s
          current balance. Once all payments are completed,
          everyone will be settled up.
        </p>
      </div>
    </section>
  );
}
