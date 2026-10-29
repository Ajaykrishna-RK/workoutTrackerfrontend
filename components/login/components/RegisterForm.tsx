"use client";

import { useState } from "react";
import type { ApiError } from "@/lib/axios";
import type { RegisterInput } from "@/types/auth";
import { register } from "../api/auth";
import type { RegisterFormProps } from "../types/loginTypes";
import FormField from "@/components/common/FormField";
import FormMessage from "@/components/common/FormMessage";
import SubmitButton from "./SubmitButton";

export default function RegisterForm({ initialEmail, notice = null, onSuccess }: RegisterFormProps) {
  const [form, setForm] = useState<RegisterInput>({ name: "", email: initialEmail, password: "" });
  const [error, setError] = useState<string | null>(notice);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof RegisterInput>(key: K, value: RegisterInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const name = form.name?.trim();
      await register({ email: form.email, password: form.password, ...(name ? { name } : {}) });
      onSuccess();
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.status === 409
          ? "An account with this email already exists. Please log in."
          : apiError.message ?? "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <FormField
          label="Name"
          hint="optional"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          value={form.name ?? ""}
          onChange={(v) => update("name", v)}
        />
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
          autoComplete="new-password"
          value={form.password}
          onChange={(v) => update("password", v)}
        
          required
        />
      </div>

      <FormMessage message={error} />
      <SubmitButton loading={loading} label="Register" loadingLabel="Creating account…" />
    </form>
  );
}
