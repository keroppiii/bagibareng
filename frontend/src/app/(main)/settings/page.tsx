
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getInitials } from "@/utils/initials";
import {
  apiRequest,
  removeAccessToken,
} from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [currency, setCurrency] = useState("IDR");
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  // Mengambil data profil pengguna
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await apiRequest<{ data: User }>(
          "/auth/me"
        );

        setUser(response.data);
        setFullName(response.data.name);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Update Profile
const handleSaveChanges = async () => {
  const trimmedName = fullName.trim();

  if (!trimmedName) {
    setError("Full Name tidak boleh kosong.");
    return;
  }

  try {
    setIsSaving(true);
    setError("");
    setSuccess("");

    const response = await apiRequest<{ data: User }>(
      "/auth/profile",
      {
        method: "PATCH",
        body: JSON.stringify({ name: trimmedName }),
      }
    );

    console.log("Profile update response:", response);

    setUser(response.data);
setFullName(response.data.name);

window.dispatchEvent(
  new CustomEvent("profile-updated", {
    detail: response.data,
  })
);

setSuccess("Profile berhasil diperbarui!");
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Gagal memperbarui profile."
    );
  } finally {
    setIsSaving(false);
  }
};

  // Logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } catch {
      // Tetap hapus token jika server tidak dapat dihubungi.
    } finally {
      removeAccessToken();
      router.replace("/login");
    }
  };

  const name = user?.name || "User";
  const email = user?.email || "-";

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

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

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
                  Your personal account information.
                </p>
              </div>

              {/* Avatar */}
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-primary-dark">
                  {isLoading ? "..." : getInitials(name)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {isLoading ? "Loading..." : name}
                  </p>

                  <p className="mt-1 truncate text-xs text-muted">
                    {isLoading ? "Loading profile..." : email}
                  </p>
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
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading || isSaving}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary disabled:opacity-60"
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
                    value={isLoading ? "" : email}
                    readOnly
                    placeholder="Loading..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none"
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
                  <option value="IDR">
                    IDR - Indonesian Rupiah (Rp)
                  </option>
                  <option value="USD">
                    USD - US Dollar ($)
                  </option>
                  <option value="SGD">
                    SGD - Singapore Dollar (S$)
                  </option>
                  <option value="MYR">
                    MYR - Malaysian Ringgit (RM)
                  </option>
                </select>

              </div>
            </section>

            {/* Save Button */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
  <p className="text-xs text-muted">
    {success || "Update your profile information."}
  </p>

  <button
    type="button"
    onClick={handleSaveChanges}
    disabled={isLoading || isSaving}
    className="rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {isSaving ? "Saving..." : "Save Changes"}
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
                  {isLoading ? "..." : getInitials(name)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {isLoading ? "Loading..." : name}
                  </p>

                  <p className="truncate text-xs text-muted">
                    {isLoading ? "Loading..." : email}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">
                    Account Type
                  </span>

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
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>↪</span>
                {isLoggingOut ? "Logging out..." : "Log out"}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
