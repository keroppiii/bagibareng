
"use client";

import { useState } from "react";
import { getInitials } from "@/utils/initials";

export default function SettingsPage() {
  const [name, setName] = useState("Fatimah Nurmawati");
  const [email, setEmail] = useState("fatimah@example.com");
  const [currency, setCurrency] = useState("IDR");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            Account
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Settings
          </h1>
          <p className="mt-2 text-sm text-muted">
            Manage your profile and account preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Main Settings */}
          <div className="space-y-6">
            {/* Profile Information */}
            <section className="rounded-2xl border border-border bg-white p-6">
              <div className="mb-6">
                <h2 className="text-base font-bold text-foreground">
                  Profile Information
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Update your personal information.
                </p>
              </div>

              {/* Avatar */}
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-primary-dark">
                  {getInitials(name)}
                </div>

                <div>
                  <p className="text-sm font-bold text-foreground">{name}</p>
                  <p className="mt-1 text-xs text-muted">{email}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-xs font-semibold text-foreground"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold text-foreground"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
                  />
                </div>
              </div>
            </section>

            {/* Account Preferences */}
            <section className="rounded-2xl border border-border bg-white p-6">
              <div className="mb-6">
                <h2 className="text-base font-bold text-foreground">
                  Account Preferences
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Customize how you use BagiBareng.
                </p>
              </div>

              <div>
                <label
                  htmlFor="currency"
                  className="mb-2 block text-xs font-semibold text-foreground"
                >
                  Default Currency
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                >
                  <option value="IDR">IDR - Indonesian Rupiah (Rp)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="SGD">SGD - Singapore Dollar (S$)</option>
                  <option value="MYR">MYR - Malaysian Ringgit (RM)</option>
                </select>
                <p className="mt-2 text-[11px] text-muted">
                  This preference is currently for display purposes only.
                </p>
              </div>
            </section>

            {/* Save Button */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted">
                Changes are not saved to a database yet.
              </p>

              <button
                onClick={handleSave}
                className="rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary"
              >
                {saved ? "Changes Saved ✓" : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Account Sidebar */}
          <aside className="space-y-6">
            {/* Account Summary */}
            <section className="rounded-2xl border border-border bg-white p-5">
              <h2 className="mb-4 text-sm font-bold text-foreground">
                Account Summary
              </h2>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-primary-dark">
                  {getInitials(name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {name}
                  </p>
                  <p className="truncate text-xs text-muted">{email}</p>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Account Type</span>
                  <span className="text-xs font-semibold text-foreground">
                    Personal
                  </span>
                </div>
              </div>
            </section>

            {/* Account Actions */}
            <section className="rounded-2xl border border-red-100 bg-white p-5">
              <h2 className="text-sm font-bold text-foreground">
                Account Actions
              </h2>
              <p className="mt-2 text-xs leading-5 text-muted">
                Sign out of your BagiBareng account on this device.
              </p>

              <button
                onClick={() => (window.location.href = "/login")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
              >
                <span>↪</span>
                Log out
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
