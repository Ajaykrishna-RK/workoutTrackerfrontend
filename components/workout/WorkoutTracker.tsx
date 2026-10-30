"use client";

import FormMessage from "@/components/common/FormMessage";
import { useWorkouts } from "./hooks/useWorkout";
import DateFilter from "./components/DateFilter";
import Pagination from "./components/Pagination";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";

export default function WorkoutTracker() {
  const {
    workouts,
    meta,
    filter,
    awaitingDates,
    hasLoaded,
    loading,
    error,
    editing,
    busyId,
    setFilter,
    goToPage,
    create,
    update,
    startEdit,
    cancelEdit,
    remove,
  } = useWorkouts();

  function handleDelete(id: string) {
    if (window.confirm("Delete this workout?")) remove(id);
  }

  function renderHistory() {
    if (awaitingDates) {
      return <p className="text-sm text-zinc-600">Pick a start or end date to see workouts.</p>;
    }
    if (!hasLoaded) {
      return (
        <p role="status" className="text-sm text-zinc-600">
          Loading workouts…
        </p>
      );
    }
    return (
      // Keep the previous results visible while a new filter or page loads.
      <div aria-busy={loading} className={loading ? "opacity-60" : undefined}>
        <WorkoutList
          workouts={workouts}
          emptyMessage={
            meta?.total === 0 && filter.preset === "all"
              ? "No workouts yet. Add your first one above."
              : "No workouts in this period."
          }
          busyId={busyId}
          onEdit={startEdit}
          onDelete={handleDelete}
        />
        {meta && <Pagination meta={meta} disabled={loading} onPageChange={goToPage} />}
      </div>
    );
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
        <DateFilter value={filter} onChange={setFilter} />
        <FormMessage message={error} />
        <div className="mt-4">{renderHistory()}</div>
      </section>
    </div>
  );
}
