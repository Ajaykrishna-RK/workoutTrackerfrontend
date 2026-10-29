"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AuthSwitch from "./components/AuthSwitch";
import type { LoginMode } from "./types/loginTypes";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("login");
  // Carries the typed email across when switching between the two forms.
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const isRegister = mode === "register";

  function goHome() {
    router.replace("/");
  }

  function switchMode(next: LoginMode) {
    setMode(next);
    setNotice(null);
  }

  function handleUserNotFound(typedEmail: string) {
    setEmail(typedEmail);
    setNotice("No account found for this email. Create one below.");
    setMode("register");
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold">{isRegister ? "Create account" : "Log in"}</h1>

      {isRegister ? (
        <RegisterForm initialEmail={email} notice={notice} onSuccess={goHome} />
      ) : (
        <LoginForm initialEmail={email} onSuccess={goHome} onUserNotFound={handleUserNotFound} />
      )}

      <AuthSwitch
        prompt={isRegister ? "Already have an account?" : "Don't have an account?"}
        action={isRegister ? "Log in" : "Register"}
        onClick={() => switchMode(isRegister ? "login" : "register")}
      />
    </div>
  );
}
