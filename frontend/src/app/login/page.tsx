
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, saveAccessToken } from "@/lib/api";

type LoginResponse = {
  data: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    accessToken: string;
    expiresIn: string;
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setError("");
    setLoading(true);

    try {
      const response = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      saveAccessToken(response.data.accessToken);

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5 py-4 sm:px-6 sm:py-6 [@media(max-height:650px)]:py-2">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link
          href="/"
          className="mb-5 flex items-center justify-center gap-2 [@media(max-height:650px)]:mb-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-dark text-lg text-white">
            🧾
          </div>
          <span className="text-xl font-bold tracking-tight">
            BagiBareng<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Login Card */}
        <div className="rounded-3xl border border-border bg-white p-6 shadow-lg sm:p-8 [@media(max-height:650px)]:p-5">
          <div className="mb-6 text-center [@media(max-height:650px)]:mb-4">
            <h1 className="text-2xl font-extrabold">
              Welcome back!
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Login untuk melanjutkan dan mengatur pengeluaran bersama.
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 [@media(max-height:650px)]:space-y-3"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                autoComplete="email"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Masukkan password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm font-semibold text-primary transition hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary-dark py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3 [@media(max-height:650px)]:my-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-primary hover:underline"
            >
              Sign up
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
