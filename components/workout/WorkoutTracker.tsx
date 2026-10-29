"use client";

import { useState } from "react";
import FormMessage from "@/components/common/FormMessage";
import { useWorkouts } from "./hooks/useWorkout";
import type { DateFilterValue } from "./types/workoutTypes";
import { defaultDateFilter } from "./utils/dateFilters";
import DateFilter from "./components/DateFilter";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";

export default function WorkoutTracker() {
  const { workouts, loading, error, editing, busyId, create, update, startEdit, cancelEdit, remove } =
    useWorkouts();
  const [dateFilter, setDateFilter] = useState<DateFilterValue>(defaultDateFilter);

  function handleDelete(id: string) {
    if (window.confirm("Delete this workout?")) remove(id);
  }

  return (
    <div className="space-y-6">
      {editing ? (
        <WorkoutForm key={editing.id} initial={editing} onSubmit={update} onCancel={cancelEdit} />
      ) : (
        <WorkoutForm onSubmit={create} />
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">History</h2>
        <DateFilter value={dateFilter} onChange={setDateFilter} />
        <FormMessage message={error} />
        <div className="mt-4">
          {loading ? (
            <p role="status" className="text-sm text-zinc-600">
              Loading workouts…
            </p>
          ) : (
            <WorkoutList
              workouts={workouts}
              busyId={busyId}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </section>
    </div>
  );
}
