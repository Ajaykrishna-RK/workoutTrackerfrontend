"use client";

import { useState } from "react";
import type { Workout, WorkoutInput } from "@/types/workout";
import WorkoutForm from "./WorkoutForm";
import WorkoutList from "./WorkoutList";

export default function WorkoutTracker() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  function handleAdd(input: WorkoutInput) {
    const workout: Workout = { ...input, id: crypto.randomUUID() };
    setWorkouts((prev) => [workout, ...prev]);
  }

  function handleDelete(id: string) {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }

  return (
    <div className="space-y-6">
      <WorkoutForm onSubmit={handleAdd} />

      <section>
        <h2 className="mb-3 text-lg font-semibold">History</h2>
        <WorkoutList workouts={workouts} onDelete={handleDelete} />
      </section>
    </div>
  );
}
