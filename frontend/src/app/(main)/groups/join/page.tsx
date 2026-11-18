
"use client";

import Link from "next/link";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

type GroupPreview = {
  name: string;
  emoji: string;
  description: string | null;
  ownerName: string;
  memberCount: number;
  alreadyMember: boolean;
};

type JoinedGroup = {
  id: string;
  name: string;
  emoji: string;
  description: string | null;
  inviteCode: string;
  myRole: string;
  memberCount: number;
};

type GroupPreviewResponse = {
  data: GroupPreview;
};

type JoinGroupResponse = {
  data: JoinedGroup;
};

export default function JoinGroupPage() {
  const [inviteCode, setInviteCode] = useState("");
const [foundGroup, setFoundGroup] = useState<GroupPreview | null>(null);
const [joined, setJoined] = useState(false);
const [joinedGroup, setJoinedGroup] = useState<JoinedGroup | null>(null);
const [error, setError] = useState("");

const [loadingPreview, setLoadingPreview] = useState(false);
const [joining, setJoining] = useState(false);

  const handleFindGroup = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const normalizedCode = inviteCode.trim().toUpperCase();

  setInviteCode(normalizedCode);
  setError("");
  setFoundGroup(null);
  setJoined(false);
  setJoinedGroup(null);

  try {
    setLoadingPreview(true);

    const response = await apiRequest<GroupPreviewResponse>(
      `/groups/invite/${encodeURIComponent(normalizedCode)}`
    );

    setFoundGroup(response.data);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Group not found. Please check your invitation code."
    );
  } finally {
    setLoadingPreview(false);
  }
};

const handleJoinGroup = async () => {
  if (!foundGroup || foundGroup.alreadyMember) return;

  try {
    setJoining(true);
    setError("");

    const response = await apiRequest<JoinGroupResponse>("/groups/join", {
      method: "POST",
      body: JSON.stringify({
        inviteCode: inviteCode.trim().toUpperCase(),
      }),
    });

    setJoinedGroup(response.data);
    setJoined(true);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Failed to join group. Please try again."
    );
  } finally {
    setJoining(false);
  }
};

  return (
  <main className="min-h-screen bg-background text-foreground">
    <section className="flex min-h-screen flex-col px-5 py-7 sm:px-8 lg:px-10">
          <div>
            <Link
              href="/groups"
              className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-primary"
            >
              ← Back to My Groups
            </Link>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Join a Group 👋
            </h1>

            <p className="mt-2 text-sm text-muted">
              Have an invitation code? Enter it below to join your friend&apos;s group.
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-10">

            {!joined ? (
              <>
                {/* Invitation Form */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">

                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                    🔑
                  </div>

                  <h2 className="text-lg font-bold">
                    Enter Invitation Code
                  </h2>

                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    Ask your friend for their group invitation code.
                    Enter the code here to find the group.
                  </p>

                  <form onSubmit={handleFindGroup} className="mt-6">

                    <label className="mb-2 block text-xs font-bold">
                      Invitation Code
                    </label>

                    <input
                      type="text"
                      required
                      maxLength={30}
                      value={inviteCode}
                      onChange={(e) => {
                        setInviteCode(e.target.value.toUpperCase());
                        setError("");
                        setFoundGroup(null);
                      }}
                      placeholder="e.g. BB-WK26X9"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm font-bold uppercase tracking-wider outline-none transition focus:border-primary"
                    />

                    {error && (
                      <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                        ⚠️ {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loadingPreview}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loadingPreview ? "Finding Group..." : "Find Group"}
                      {!loadingPreview && <span>→</span>}
                    </button>
                  </form>

                  <div className="mt-6 border-t border-border pt-5">
                    <p className="text-center text-xs text-muted">
                      Don&apos;t have an invitation code?
                    </p>
                    <p className="mt-2 text-center text-xs font-semibold text-primary">
                      Ask your friend to share their group code with you.
                    </p>
                  </div>
                </div>

                {/* Group Preview */}
                {foundGroup && (
                  <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">

                    <div className="mb-5 flex items-center justify-between">
                      <h2 className="text-sm font-bold">
                        Group Found!
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                          foundGroup.alreadyMember
                            ? "bg-blue-50 text-blue-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {foundGroup.alreadyMember ? "Already Joined" : "Available"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                        {foundGroup.emoji}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base font-bold">
                          {foundGroup.name}
                        </h3>
                        <p className="mt-1 text-xs text-muted">
                          {foundGroup.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 border-t border-border pt-4">

                      <div className="flex justify-between text-xs">
                        <span className="text-muted">Created by</span>
                        <span className="font-semibold">
                          {foundGroup.ownerName}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-muted">Members</span>
                        <span className="font-semibold">
                          {foundGroup.memberCount} members
                        </span>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-muted">Invitation Code</span>
                        <span className="font-semibold">
                          {inviteCode}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleJoinGroup}
                      disabled={joining || foundGroup.alreadyMember}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {joining
                        ? "Joining Group..."
                        : foundGroup.alreadyMember
                          ? "Already a Member"
                          : "Join Group"}
                      {!joining && !foundGroup.alreadyMember && <span>→</span>}
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Success State */
              <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">

                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
                  🎉
                </div>

                <h2 className="text-2xl font-extrabold">
                  You&apos;re In!
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  You have successfully joined the group
                  <span className="font-bold text-foreground">
                    {" "}{joinedGroup?.name}
                  </span>.
                </p>

                <div className="my-6 rounded-xl bg-blue-50 p-4">
                  <div className="text-3xl">
                    {joinedGroup?.emoji}
                  </div>
                  <p className="mt-2 text-sm font-bold text-blue-900">
                    {joinedGroup?.name}
                  </p>
                  <p className="mt-1 text-xs text-blue-700">
                    {joinedGroup?.memberCount} members
                  </p>
                </div>

                <Link
                  href="/groups"
                  className="flex w-full items-center justify-center rounded-full bg-primary-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary"
                >
                  Go to My Groups
                </Link>

              </div>
            )}

            <div className="mt-6 rounded-2xl bg-blue-50 p-5">
              <div className="mb-2 text-xl">💡</div>
              <h3 className="text-sm font-bold text-blue-900">
                A little reminder
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-blue-700">
                Make sure you enter the correct invitation code
                shared by the group creator.
              </p>
            </div>

          </div>

          <footer className="mt-auto border-t border-border py-5 text-center text-xs text-muted">
            © 2026 BagiBareng. Made for sharing. 💙
          </footer>

      </section>
  </main>
  );
}
