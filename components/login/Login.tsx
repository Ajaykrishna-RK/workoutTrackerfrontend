"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiError } from "@/lib/axios";
import { login } from "./api/auth";
import type { LoginInput } from "@/types/auth";

const inputClass =
  "mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState<LoginInput>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof LoginInput>(key: K, value: LoginInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form);
      router.replace("/");
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.status === 401
          ? "Invalid email or password."
          : apiError.message ?? "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <h1 className="mb-6 text-2xl font-bold">Log in</h1>

      <div className="space-y-4">
        <label className="block text-sm">
          Email
          <input
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            type="password"
            autoComplete="current-password"
            className={inputClass}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            minLength={8}
            required
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
      >
        {loading ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
