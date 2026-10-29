"use client";

import FormMessage from "@/components/common/FormMessage";
import { useWorkoutForm } from "../hooks/useWorkout";
import type { WorkoutFormProps } from "../types/workoutTypes";
import { inputClass } from "../utils/styles";
import ExerciseFields from "./ExerciseFields";

export default function WorkoutForm({ initial, onSubmit, onCancel }: WorkoutFormProps) {
  const {
    isEdit,
    name,
    setName,
    drafts,
    updateExercise,
    addExercise,
    removeExercise,
    error,
    loading,
    handleSubmit,
  } = useWorkoutForm(initial, onSubmit);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-semibold">{isEdit ? "Edit workout" : "Add workout"}</h2>

      <label className="block text-sm">
        Workout name
        <input
          className={inputClass}
          placeholder="e.g. Push day"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <fieldset className="mt-4 space-y-3">
        <legend className="mb-2 text-sm font-medium">Exercises</legend>
        {drafts.map((draft, i) => (
          <ExerciseFields
            key={draft.key}
            draft={draft}
            index={i}
            removable={drafts.length > 1}
            onChange={updateExercise}
            onRemove={removeExercise}
          />
        ))}
      </fieldset>

      <button
        type="button"
        onClick={addExercise}
        className="mt-3 text-sm font-medium text-zinc-700 hover:underline"
      >
        + Add exercise
      </button>

      <FormMessage message={error} />

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
        >
          {loading ? "Saving…" : isEdit ? "Save changes" : "Add workout"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
