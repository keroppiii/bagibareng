
import Link from "next/link";

const features = [
  {
    number: "01",
    icon: "👥",
    title: "Create your group",
    description:
      "Buat grup khusus untuk teman, keluarga, atau teman sekamar.",
    color: "bg-blue-50",
  },
  {
    number: "02",
    icon: "🧾",
    title: "Track every expense",
    description:
      "Catat setiap transaksi dan pantau pengeluaran kelompok.",
    color: "bg-purple-50",
  },
  {
    number: "03",
    icon: "⚖️",
    title: "Split fairly",
    description:
      "Bagi tagihan dengan Equal Split atau Custom Split.",
    color: "bg-orange-50",
  },
];

const expenses = [
  {
    icon: "🏨",
    name: "Hotel reservation",
    category: "Accommodation",
    amount: "Rp 650.000",
    color: "bg-blue-50",
  },
  {
    icon: "🍜",
    name: "Dinner together",
    category: "Food & Drinks",
    amount: "Rp 350.000",
    color: "bg-orange-50",
  },
  {
    icon: "🚕",
    name: "Transportation",
    category: "Transport",
    amount: "Rp 150.000",
    color: "bg-purple-50",
  },
];

const steps = [
  {
    number: "01",
    title: "Create or join a group",
    description:
      "Buat grup baru atau bergabung menggunakan kode undangan.",
  },
  {
    number: "02",
    title: "Add shared expenses",
    description:
      "Catat transaksi dan tentukan siapa saja yang ikut membayar.",
  },
  {
    number: "03",
    title: "See who owes whom",
    description:
      "Pantau saldo setiap anggota dan lihat penyelesaian tagihan.",
  },
];

export default function Home() {
  return (
    <main className="h-screen overflow-y-auto overflow-x-hidden bg-background text-foreground lg:snap-y lg:snap-mandatory">
      {/* PAGE 1: HERO */}
      <section className="relative flex min-h-screen flex-col lg:h-screen lg:min-h-0 lg:snap-start">
        {/* NAVBAR */}
        <nav className="relative z-20 mx-auto flex w-full max-w-7xl shrink-0 items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-dark text-lg text-white">
              🧾
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              BagiBareng<span className="text-primary">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
            <Link href="#features" className="transition hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="transition hover:text-primary">
              How it works
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-secondary sm:block"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-primary-dark px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div className="relative mx-auto grid min-h-0 w-full max-w-7xl flex-1 items-center gap-6 px-5 py-6 sm:px-8 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:py-3">
          <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-purple-100/40 blur-3xl" />

          {/* TEXT */}
          <div className="relative z-10 max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 text-xs font-semibold text-muted">
              ✨ Make sharing expenses easier
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Good times.
              <br />
              <span className="text-primary">Fair splits.</span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-muted sm:text-base">
              Makan bareng, liburan bareng, atau tinggal bareng?
              Jangan biarkan urusan tagihan bikin ribet.
              Catat, bagi, dan pantau semuanya di BagiBareng!
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary"
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

            <p className="mt-6 text-xs text-muted sm:text-sm">
              Simple, transparent, and made for everyone. 💙
            </p>
          </div>

          {/* GROUP PREVIEW */}
          <div className="relative z-10 mx-auto w-full max-w-[370px] lg:ml-auto lg:scale-[0.92] lg:origin-center">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-200/50 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-purple-200/50 blur-3xl" />

            <div className="relative rounded-3xl border border-border bg-white p-4 shadow-xl shadow-blue-900/10 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted">YOUR GROUP</p>
                  <h2 className="mt-1 text-lg font-extrabold">
                    Weekend Trip 🏖️
                  </h2>
                </div>
                <div className="rounded-xl bg-blue-50 p-2.5 text-xl">
                  ✈️
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-primary-dark p-4 text-white">
                <p className="text-xs text-white/70">
                  Total group expenses
                </p>
                <p className="mt-2 text-2xl font-extrabold tracking-tight">
                  Rp 1.250.000
                </p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-3/4 rounded-full bg-white" />
                </div>
                <p className="mt-2 text-[11px] text-white/70">
                  Shared between 4 friends
                </p>
              </div>

              <div className="mt-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold">
                    Recent expenses
                  </h3>
                  <span className="text-xs font-semibold text-primary">
                    View all
                  </span>
                </div>

                <div className="space-y-2.5">
                  {expenses.map((expense) => (
                    <div
                      key={expense.name}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base ${expense.color}`}
                        >
                          {expense.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold sm:text-sm">
                            {expense.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted">
                            {expense.category}
                          </p>
                        </div>
                      </div>
                      <p className="shrink-0 text-xs font-bold">
                        {expense.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 p-3.5">
                <div>
                  <p className="text-[10px] font-semibold text-blue-700">
                    YOUR BALANCE
                  </p>
                  <p className="mt-1 text-base font-extrabold text-blue-900">
                    Rp 125.000
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-blue-700">
                  You are owed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAGE 2: FEATURES */}
      <section
        id="features"
        className="flex min-h-screen scroll-mt-0 items-center border-y border-border bg-white px-5 py-12 sm:px-8 lg:h-screen lg:min-h-0 lg:snap-start lg:px-10"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              What you can do
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Less calculating, more enjoying.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Semua kebutuhan patungan dalam satu tempat.
              Biar kamu bisa fokus menikmati waktu bersama.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="rounded-2xl border border-border bg-background p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg lg:p-7"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-6 text-base font-bold lg:text-lg">
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

      {/* PAGE 3: HOW IT WORKS + CTA + FOOTER */}
      <section
        id="how-it-works"
        className="flex min-h-screen flex-col scroll-mt-0 lg:h-screen lg:min-h-0 lg:snap-start"
      >
        <div className="flex flex-1 items-center px-5 py-10 sm:px-8 lg:px-10 lg:py-6">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Easy as 1, 2, 3
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                From shared plans
                <br />
                to fair payments.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-muted">
                Mulai dari membuat grup hingga mengetahui siapa yang
                perlu membayar. Semuanya bisa dilakukan dengan lebih
                praktis bersama BagiBareng.
              </p>

              <Link
                href="/register"
                className="mt-6 inline-flex rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary"
              >
                Get Started for Free →
              </Link>
            </div>

            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex gap-4 rounded-2xl border border-border bg-white p-4 sm:p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-extrabold text-primary-dark">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-6 text-muted sm:text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="px-5 pb-6 sm:px-8 lg:px-10 lg:pb-5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 rounded-2xl bg-primary-dark px-6 py-5 text-center text-white sm:flex-row sm:text-left">
            <div>
              <h3 className="text-base font-bold">
                Good memories should be shared. 💙
              </h3>
              <p className="mt-1 text-xs text-white/75">
                Make every shared expense easier with BagiBareng.
              </p>
            </div>
            <Link
              href="/register"
              className="shrink-0 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-primary-dark transition hover:bg-blue-50"
            >
              Join BagiBareng →
            </Link>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="shrink-0 border-t border-border bg-white px-5 py-4 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-dark text-sm text-white">
                🧾
              </div>
              <span className="text-sm font-extrabold">
                BagiBareng<span className="text-primary">.</span>
              </span>
            </Link>

            <p className="text-xs text-muted">
              © 2026 BagiBareng. Made for sharing. 💙
            </p>
            
          </div>
        </footer>
      </section>
    </main>
  );
}
