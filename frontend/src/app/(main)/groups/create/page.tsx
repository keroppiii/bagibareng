
"use client";

import Link from "next/link";
import { useState } from "react";

const emojis = [
  "👥", "🏖️", "🍜", "🏠", "✈️", "🎉",
  "🎮", "🛍️", "🎂", "☕", "🚗", "💼",
];

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("👥");
  const [created, setCreated] = useState(false);

  // Simulasi kode sementara untuk pengembangan frontend.
  // Nantinya diganti dengan kode dari respons API backend.
  const [inviteCode, setInviteCode] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simulasi pembuatan grup.
    // Belum menyimpan data ke database.
    const temporaryCode = "BB-" + Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    setInviteCode(temporaryCode);
    setCreated(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      alert("Invitation code copied!");
    } catch {
      alert("Unable to copy invitation code.");
    }
  };

  return (
  <main className="min-h-screen bg-background text-foreground">
    <section className="min-w-0 px-5 pt-4 pb-7 sm:px-8 lg:px-10">

      {!created ? (
            <>
              {/* Page Heading */}
              <div className="mb-7">
                <Link
                  href="/groups"
                  className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-primary"
                >
                  ← Back to My Groups
                </Link>

                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Create New Group ✨
                </h1>

                <p className="mt-2 text-sm text-muted">
                  Start sharing expenses with your friends, family, or roommates.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">

                  {/* Form */}
                  <div className="space-y-6 xl:col-span-2">

                    {/* Group Information */}
                    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
                      <div className="mb-6">
                        <h2 className="text-base font-bold">
                          Group Information
                        </h2>
                        <p className="mt-1 text-xs text-muted">
                          Give your group a name and tell us what it&apos;s for.
                        </p>
                      </div>

                      <div className="mb-5">
                        <label className="mb-2 block text-xs font-bold">
                          Group Name <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="text"
                          required
                          maxLength={50}
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          placeholder="e.g. Weekend Trip, Kost Bersama..."
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold">
                          Description
                          <span className="ml-1 font-normal text-muted">
                            (Optional)
                          </span>
                        </label>

                        <textarea
                          rows={3}
                          maxLength={150}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="What is this group about?"
                          className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                        />

                        <p className="mt-1 text-right text-[10px] text-muted">
                          {description.length}/150 characters
                        </p>
                      </div>
                    </div>

                    {/* Group Icon */}
                    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
                      <div className="mb-5">
                        <h2 className="text-base font-bold">
                          Choose Group Icon
                        </h2>
                        <p className="mt-1 text-xs text-muted">
                          Pick an emoji that represents your group.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setSelectedEmoji(emoji)}
                            className={`flex h-12 w-12 items-center justify-center rounded-xl border text-2xl transition ${
                              selectedEmoji === emoji
                                ? "border-primary bg-blue-50 ring-2 ring-primary/20"
                                : "border-border bg-background hover:border-primary/40"
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Invitation Information */}
                    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                          🔑
                        </div>

                        <div>
                          <h2 className="text-base font-bold">
                            Group Invitation Code
                          </h2>

                          <p className="mt-2 text-xs leading-relaxed text-muted">
                            An invitation code will be automatically
                            generated when you create your group. Share
                            this code with your friends so they can join
                            your group.
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-xl bg-blue-50 p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-800">
                          <span>💡</span>
                          How does it work?
                        </div>

                        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-blue-700">
                          <li>1. Create your group.</li>
                          <li>2. Get your unique invitation code.</li>
                          <li>3. Share the code with your friends.</li>
                          <li>4. They can join using the code.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="space-y-5">

                    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
                      <h2 className="text-base font-bold">
                        Group Preview
                      </h2>

                      <p className="mt-1 text-xs text-muted">
                        This is how your group will look.
                      </p>

                      <div className="mt-6 rounded-2xl border border-border p-4">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                          {selectedEmoji}
                        </div>

                        <h3 className="break-words text-base font-bold">
                          {groupName || "Your Group Name"}
                        </h3>

                        <p className="mt-2 break-words text-xs leading-relaxed text-muted">
                          {description || "Your group description will appear here."}
                        </p>

                        <div className="mt-5 border-t border-border pt-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted">Members</span>
                            <span className="font-bold">1 member</span>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span className="text-muted">Group status</span>
                            <span className="rounded-full bg-green-50 px-3 py-1 font-bold text-green-600">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 space-y-3">
                        <button
                          type="submit"
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-dark px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary"
                        >
                          Create Group
                          <span>→</span>
                        </button>

                        <Link
                          href="/groups"
                          className="flex w-full items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-muted transition hover:bg-background"
                        >
                          Cancel
                        </Link>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-blue-50 p-5">
                      <div className="mb-2 text-xl">💙</div>
                      <h3 className="text-sm font-bold text-blue-900">
                        Better together!
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-blue-700">
                        Keep your shared expenses organized and make
                        splitting bills easier with BagiBareng.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </>
          ) : (
            /* Success Screen */
            <div className="mx-auto flex min-h-[75vh] max-w-lg flex-col items-center justify-center text-center">

              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
                🎉
              </div>

              <h1 className="text-2xl font-extrabold sm:text-3xl">
                Group Created!
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                Your group is ready! Share the invitation code with
                your friends so they can join.
              </p>

              <div className="mt-8 w-full rounded-2xl border border-border bg-white p-6 text-left">

                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                    {selectedEmoji}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-base font-bold">
                      {groupName}
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      {description || "No description"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
                    Group Invitation Code
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xl font-extrabold tracking-wider text-blue-900 sm:text-2xl">
                      {inviteCode}
                    </span>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex shrink-0 items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-blue-800 shadow-sm transition hover:bg-blue-100"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-muted">
                  Share this code with your friends. They can enter
                  it on the Join a Group page to become a member.
                </p>
              </div>

              <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
                <Link
                  href="/groups"
                  className="flex flex-1 items-center justify-center rounded-full bg-primary-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary"
                >
                  Go to My Groups
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setGroupName("");
                    setDescription("");
                    setSelectedEmoji("👥");
                    setCreated(false);
                  }}
                  className="flex flex-1 items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-muted transition hover:bg-background"
                >
                  Create Another
                </button>
              </div>

              <p className="mt-5 text-[10px] text-muted">
                Frontend preview only — group data is not saved yet.
              </p>
            </div>
          )}

          <footer className="mt-8 border-t border-border py-5 text-center text-xs text-muted">
            © 2026 BagiBareng. Made for sharing. 💙
          </footer>

    </section>
  </main>
  );
}
