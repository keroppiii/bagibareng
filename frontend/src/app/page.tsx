
import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Create a group",
    description: "Buat grup untuk teman, keluarga, atau teman sekamar.",
    icon: "👥",
  },
  {
    number: "02",
    title: "Track expenses",
    description: "Catat semua pengeluaran bersama dengan mudah.",
    icon: "🧾",
  },
  {
    number: "03",
    title: "Split the bill",
    description: "Bagi tagihan dan ketahui siapa membayar berapa.",
    icon: "🪙",
  },
];

const expenses = [
  { icon: "🍜", name: "Dinner together", amount: "Rp 320.000" },
  { icon: "🚕", name: "Taxi ride", amount: "Rp 80.000" },
  { icon: "🛒", name: "Groceries", amount: "Rp 450.000" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Navbar */}
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-dark text-xl text-white">
            🧾
          </div>
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            BagiBareng<span className="text-primary">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium md:flex">
          <Link href="#features" className="transition hover:text-primary">
            Features
          </Link>
          <Link href="#about" className="transition hover:text-primary">
            About
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary sm:block"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="whitespace-nowrap rounded-full bg-primary-dark px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary sm:px-5"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="about"
        className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 py-8 sm:px-8 md:grid-cols-2 lg:gap-10 lg:px-10 lg:py-10"
      >
        {/* Hero Content */}
        <div className="max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted">
            <span>✨</span>
            Make sharing expenses easier
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            Good times,
            <br />
            <span className="text-primary">fair splits.</span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-muted sm:text-base">
            Makan bareng, liburan bareng, atau tinggal bareng?
            Jangan biarkan urusan tagihan bikin ribet.
            Catat, bagi, dan pantau semuanya di BagiBareng!
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-1 hover:bg-primary"
            >
              Start sharing →
            </Link>
            <Link
              href="#features"
              className="rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold transition hover:bg-secondary"
            >
              Explore features
            </Link>
          </div>

          <p className="mt-5 text-xs text-muted sm:text-sm">
            Simple, transparent, and made for everyone. 💙
          </p>
        </div>

        {/* Expense Preview */}
        <div className="relative mx-auto w-full max-w-85">
          <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-accent/30 blur-2xl" />
          <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-primary/30 blur-2xl" />

          <div className="relative rounded-3xl border border-border bg-white p-4 shadow-lg">
            {/* Group Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Your group</p>
                <h2 className="mt-1 text-lg font-bold">
                  Weekend Trip 🏖️
                </h2>
              </div>

              <div className="rounded-2xl bg-secondary p-3 text-xl">
                ✈️
              </div>
            </div>

            {/* Total Expenses */}
            <div className="mt-4 rounded-2xl bg-background p-4">
              <p className="text-sm text-muted">Total expenses</p>

              <p className="mt-2 text-2xl font-extrabold">
                Rp 1.250.000
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-3/4 rounded-full bg-primary" />
              </div>

              <p className="mt-2 text-xs text-muted">
                Shared between 4 friends
              </p>
            </div>

            {/* Recent Expenses */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold">
                  Recent expenses
                </h3>

                <span className="text-xs font-semibold text-primary">
                  View all
                </span>
              </div>

              {expenses.map((expense) => (
                <div
                  key={expense.name}
                  className="flex items-center justify-between gap-2 border-b border-border py-2 last:border-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-lg">
                      {expense.icon}
                    </div>

                    <span className="truncate text-sm font-semibold">
                      {expense.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-xs font-bold sm:text-sm">
                    {expense.amount}
                  </span>
                </div>
              ))}
            </div>

            {/* Balance */}
            <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-primary-dark p-3 text-white">
              <div>
                <p className="text-xs text-white/70">Your balance</p>
                <p className="mt-1 text-base font-bold">
                  Rp 125.000
                </p>
              </div>

              <span className="whitespace-nowrap rounded-full bg-white/15 px-3 py-2 text-xs">
                You are owed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-white px-5 py-14 sm:px-8 lg:px-10 lg:py-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">
              What you can do
            </p>

            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl lg:text-4xl">
              Less calculating, more enjoying.
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
              Semua kebutuhan patungan dalam satu tempat.
              Biar kamu bisa fokus menikmati waktu bersama.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:gap-5">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="rounded-3xl border border-border bg-background p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{feature.icon}</span>

                  <span className="text-sm font-bold text-primary">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-6 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row sm:text-sm">
          <p>
            © 2026 <strong>BagiBareng</strong>. Made for sharing. 💙
          </p>

          <p>Split expenses, stay connected.</p>
        </div>
      </footer>
    </main>
  );
}
