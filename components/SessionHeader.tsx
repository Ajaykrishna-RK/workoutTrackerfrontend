"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiError } from "@/lib/axios";
import { getStoredUser } from "@/lib/auth/token-storage";
import { getProfile, logout } from "./login/api/auth";

export default function SessionHeader() {
  const router = useRouter();
  const [email, setEmail] = useState(() => getStoredUser()?.email ?? null);

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((profile) => {
        if (!cancelled) setEmail(profile.email);
      })
      .catch((err: ApiError) => {
        if (!cancelled && err.status === 401) {
          logout();
          router.replace("/login");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <h1 className="text-3xl font-bold">Workout Tracker</h1>
      <div className="flex items-center gap-3 text-sm">
        {email && <span className="hidden text-zinc-600 sm:inline">{email}</span>}
        <button
          onClick={handleLogout}
          className="rounded-md border border-zinc-300 px-3 py-1.5 font-medium hover:bg-zinc-100"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
