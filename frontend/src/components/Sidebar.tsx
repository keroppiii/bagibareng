
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getInitials } from "@/utils/initials";

const menuItems = [
  { icon: "⌂", label: "Dashboard", href: "/dashboard" },
  { icon: "▤", label: "My Groups", href: "/groups" },
  { icon: "⚙", label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Mobile Header */}
      <header className="relative z-50 border-b border-border bg-white lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-dark text-lg text-white">
              🧾
            </div>
            <span className="text-lg font-bold">
              BagiBareng<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground transition hover:bg-background"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-border bg-white px-5 py-4 shadow-lg">
            <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-muted">
              Menu
            </p>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                    isActive(item.href)
                      ? "bg-primary-dark text-white shadow-sm"
                      : "text-muted hover:bg-background hover:text-foreground"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 border-t border-border pt-4">
              <div className="mb-3 flex items-center gap-3 px-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-primary-dark">
                  {getInitials("Fatimah Nurmawati")}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">Fatimah</p>
                  <p className="text-xs text-muted">Personal Account</p>
                </div>
              </div>

              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted transition hover:bg-red-50 hover:text-red-500"
              >
                <span className="text-lg">↪</span>
                Log out
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-56 flex-col border-r border-border bg-white px-4 py-6 lg:flex">
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
                isActive(item.href)
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
          <div className="mb-2 flex items-center gap-2.5 rounded-xl p-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-primary-dark">
              {getInitials("Fatimah Nurmawati")}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold">Fatimah</p>
              <p className="text-[10px] text-muted">Personal Account</p>
            </div>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-muted transition hover:bg-red-50 hover:text-red-500"
          >
            <span className="text-base">↪</span>
            Log out
          </Link>
        </div>
      </aside>
    </>
  );
}
