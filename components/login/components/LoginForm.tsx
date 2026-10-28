"use client";

import { useState } from "react";
import type { ApiError } from "@/lib/axios";
import type { LoginInput } from "@/types/auth";
import { login } from "../api/auth";
import FormField from "./FormField";
import FormMessage from "./FormMessage";
import SubmitButton from "./SubmitButton";

interface Props {
  initialEmail: string;
  onSuccess: () => void;
  // Called when the backend says no account exists for this email.
  onUserNotFound: (email: string) => void;
}

export default function LoginForm({ initialEmail, onSuccess, onUserNotFound }: Props) {
  const [form, setForm] = useState<LoginInput>({ email: initialEmail, password: "" });
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
      onSuccess();
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 404) {
        onUserNotFound(form.email);
        return;
      }
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
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(v) => update("email", v)}
          required
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(v) => update("password", v)}
          required
        />
      </div>

      <FormMessage message={error} />
      <SubmitButton loading={loading} label="Log in" loadingLabel="Logging in…" />
    </form>
  );
}
