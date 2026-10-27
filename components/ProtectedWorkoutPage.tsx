"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth/token-storage";
import WorkoutTracker from "./workout/components/WorkoutTracker";


function subscribeToSession(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSessionSnapshot() {
  return getAccessToken() !== null;
}

function getServerSessionSnapshot(): boolean | null {
  return null;
}

export default function ProtectedWorkoutPage() {
  const router = useRouter();
  const isAuthenticated = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSessionSnapshot
  );

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated !== true) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <p role="status" className="text-sm text-zinc-600">
          Checking your session…
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Workout Tracker</h1>
      <WorkoutTracker />
    </main>
  );
}
