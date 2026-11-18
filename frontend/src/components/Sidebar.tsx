
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getInitials } from "@/utils/initials";

const menuItems = [
  { icon: "⌂", label: "Dashboard", href: "/dashboard" },
  { icon: "▤", label: "My Groups", href: "/groups" },
  { icon: "↔", label: "Activity", href: "/activity" },
  { icon: "⚙", label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
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
          {menuItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition ${
                  isActive
                    ? "bg-primary-dark text-white shadow-sm"
                    : "text-muted hover:bg-background hover:text-foreground"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
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
