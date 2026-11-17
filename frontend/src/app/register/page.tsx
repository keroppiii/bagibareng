
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-5">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="mb-4 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-dark text-lg text-white">
            🧾
          </div>
          <span className="text-lg font-bold tracking-tight">
            BagiBareng<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Register Card */}
        <div className="rounded-3xl border border-border bg-white p-6 shadow-lg sm:p-7">
          <div className="mb-5 text-center">
            <h1 className="text-xl font-extrabold">
              Create an account!
            </h1>
            <p className="mt-1.5 text-xs leading-5 text-muted">
              Mulai kelola pengeluaran bersama dengan lebih mudah.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-3">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                autoComplete="name"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="nama@email.com"
                autoComplete="email"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
                minLength={8}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-semibold"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Masukkan ulang password"
                autoComplete="new-password"
                minLength={8}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Terms */}
            <p className="pt-1 text-xs leading-4 text-muted">
              Dengan membuat akun, kamu setuju untuk menggunakan
              BagiBareng secara bertanggung jawab.
            </p>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-full bg-primary-dark py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-muted">
          © 2026 BagiBareng. Made for sharing. 💙
        </p>
      </div>
    </main>
  );
}
