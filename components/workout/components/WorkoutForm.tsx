"use client";

import { useState } from "react";
import type { WorkoutInput } from "@/types/workout";

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (): WorkoutInput => ({
  name: "",
  sets: 3,
  reps: 10,
  weight: 0,
  date: today(),
});

const inputClass =
  "mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none";

interface Props {
  onSubmit: (input: WorkoutInput) => void;
}

export default function WorkoutForm({ onSubmit }: Props) {
  const [form, setForm] = useState<WorkoutInput>(emptyForm);

  function update<K extends keyof WorkoutInput>(key: K, value: WorkoutInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({ ...form, name: form.name.trim() });
    setForm(emptyForm());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-semibold">Add workout</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="col-span-2 text-sm">
          Exercise
          <input
            className={inputClass}
            placeholder="e.g. Bench press"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </label>
        <label className="col-span-2 text-sm">
          Date
          <input
            type="date"
            className={inputClass}
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </label>
        <label className="text-sm">
          Sets
          <input
            type="number"
            min={1}
            className={inputClass}
            value={form.sets}
            onChange={(e) => update("sets", Number(e.target.value))}
          />
        </label>
        <label className="text-sm">
          Reps
          <input
            type="number"
            min={1}
            className={inputClass}
            value={form.reps}
            onChange={(e) => update("reps", Number(e.target.value))}
          />
        </label>
        <label className="col-span-2 text-sm">
          Weight (kg)
          <input
            type="number"
            min={0}
            step="0.5"
            className={inputClass}
            value={form.weight}
            onChange={(e) => update("weight", Number(e.target.value))}
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Add workout
      </button>
    </form>
  );
}
