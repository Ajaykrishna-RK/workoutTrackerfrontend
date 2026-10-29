"use client";

import FormMessage from "@/components/common/FormMessage";
import { useWorkouts } from "./hooks/useWorkout";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";

export default function WorkoutTracker() {
  const { workouts, loading, error, editing, busyId, create, update, startEdit, cancelEdit, remove } =
    useWorkouts();

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
        <FormMessage message={error} />
        <div className={error ? "mt-3" : undefined}>
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
