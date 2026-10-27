import type { Metadata } from "next";
import Login from "@/components/login/Login";

export const metadata: Metadata = {
  title: "Log in · Workout Tracker",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <Login />
    </main>
  );
}
