
import Link from "next/link";

const menuItems = [
  { icon: "⌂", label: "Dashboard", href: "/dashboard", active: true },
  { icon: "▤", label: "My Groups", href: "/groups", active: false },
  { icon: "↔", label: "Activity", href: "/activity", active: false },
  { icon: "⚙", label: "Settings", href: "/settings", active: false },
];

const groups = [
  {
    emoji: "🏖️",
    name: "Weekend Trip",
    members: "4 members",
    amount: "Rp 1.250.000",
    color: "bg-blue-50",
  },
  {
    emoji: "🍜",
    name: "Dinner Squad",
    members: "5 members",
    amount: "Rp 450.000",
    color: "bg-orange-50",
  },
  {
    emoji: "🏠",
    name: "Kost Bersama",
    members: "3 members",
    amount: "Rp 800.000",
    color: "bg-purple-50",
  },
];

const activities = [
  {
    emoji: "🍕",
    title: "Dinner at Pizza Place",
    group: "Weekend Trip",
    date: "Today, 18:30",
    amount: "- Rp 120.000",
  },
  {
    emoji: "🚕",
    title: "Taxi to Hotel",
    group: "Weekend Trip",
    date: "Today, 15:20",
    amount: "- Rp 80.000",
  },
  {
    emoji: "🛒",
    title: "Weekly Groceries",
    group: "Kost Bersama",
    date: "Yesterday",
    amount: "- Rp 250.000",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* Mobile Header */}
      <header className="flex items-center justify-between border-b border-border bg-white px-5 py-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-dark text-lg text-white">
            🧾
          </div>
          <span className="text-lg font-bold">
            BagiBareng<span className="text-primary">.</span>
          </span>
        </Link>

        <button className="rounded-xl border border-border px-3 py-2 text-sm">
          ☰
        </button>
      </header>

      <div className="min-h-screen lg:pl-56">

        
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 hidden h-screen w-56 flex-col border-r border-border bg-white px-4 py-6 lg:flex">

        {/* Logo */}
        <Link href="/" className="mb-9 flex items-center gap-2 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-dark text-lg text-white">
            🧾
            </div>
            <span className="text-lg font-bold tracking-tight">
            BagiBareng<span className="text-primary">.</span>
            </span>
        </Link>

        {/* Navigation */}
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-muted">
            Menu
        </p>

        <nav className="space-y-1">
            {menuItems.map((item) => (
            <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition ${
                item.active
                    ? "bg-primary-dark text-white shadow-sm"
                    : "text-muted hover:bg-background hover:text-foreground"
                }`}
            >
                <span className="text-base">{item.icon}</span>
                {item.label}
            </Link>
            ))}
        </nav>

        {/* Bottom Sidebar */}
        <div className="mt-auto border-t border-border pt-4">

            {/* Profile */}
            <div className="mb-2 flex items-center gap-2.5 rounded-xl p-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-primary-dark">
                FN
            </div>

            <div className="min-w-0">
                <p className="truncate text-xs font-bold">Fatimah</p>
                <p className="text-[10px] text-muted">Personal Account</p>
            </div>
            </div>

            {/* Logout */}
            <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-muted transition hover:bg-red-50 hover:text-red-500"
            >
            <span className="text-base">↪</span>
            Log out
            </Link>

        </div>
        </aside>


        {/* Main Content */}
        <section className="min-w-0 px-5 py-7 sm:px-8 lg:px-10">

          {/* Top Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-sm text-muted">
                Tuesday, November 17, 2026
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Good evening, Fatimah! 👋
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

          {/* Summary Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-muted">Total Groups</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  👥
                </span>
              </div>
              <h2 className="text-2xl font-extrabold">04</h2>
              <p className="mt-1 text-xs text-muted">Active groups</p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-muted">Total Expenses</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-xl">
                  💸
                </span>
              </div>
              <h2 className="text-2xl font-extrabold">Rp 2,5 jt</h2>
              <p className="mt-1 text-xs text-muted">Across all groups</p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-muted">You Owe</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-xl">
                  ↗️
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-red-500">
                Rp 150 rb
              </h2>
              <p className="mt-1 text-xs text-muted">Your unpaid share</p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-muted">You&apos;re Owed</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-xl">
                  ↙️
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-green-600">
                Rp 300 rb
              </h2>
              <p className="mt-1 text-xs text-muted">Waiting to be received</p>
            </div>
          </div>

          {/* Groups and Activities */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* My Groups */}
            <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 xl:col-span-2">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">My Groups</h2>
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
                {groups.map((group) => (
                  <div
                    key={group.name}
                    className="flex items-center gap-3 rounded-xl border border-border p-4 transition hover:bg-background"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${group.color} text-2xl`}>
                      {group.emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold">
                        {group.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted">
                        {group.members}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold">
                        {group.amount}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Total expense
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/groups/create"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 py-3 text-sm font-semibold text-primary transition hover:bg-blue-50"
              >
                <span className="text-lg">+</span>
                Create another group
              </Link>
            </div>

            {/* Recent Activities */}
            <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">

              <div className="mb-6">
                <h2 className="text-lg font-bold">Recent Activity</h2>
                <p className="mt-1 text-xs text-muted">
                  Your latest transactions
                </p>
              </div>

              <div className="space-y-5">
                {activities.map((activity) => (
                  <div
                    key={activity.title}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-xl">
                      {activity.emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold">
                        {activity.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted">
                        {activity.group}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {activity.date}
                      </p>
                    </div>

                    <p className="shrink-0 text-xs font-bold">
                      {activity.amount}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/activity"
                className="mt-6 block text-center text-sm font-semibold text-primary hover:underline"
              >
                See all activity
              </Link>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 border-t border-border py-5 text-center text-xs text-muted">
            © 2026 BagiBareng. Made for sharing. 💙
          </footer>

        </section>
      </div>
    </main>
  );
}
