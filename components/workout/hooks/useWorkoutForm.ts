import { Workout, WorkoutInput } from "@/types/workout";
import { errorMessage } from "../utils/apiErrors";
import { emptyExercise, toDraft, validateWorkout } from "../utils/workoutForm";
import { useState } from "react";
import { ExerciseDraft, ExerciseDraftField } from "../types/workoutTypes";

export function useWorkoutForm(
  initial: Workout | undefined,
  onSubmit: (input: WorkoutInput) => Promise<void>
) {
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [drafts, setDrafts] = useState<ExerciseDraft[]>(() =>
    initial ? initial.exercises.map(toDraft) : [emptyExercise()]
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateExercise(key: string, field: ExerciseDraftField, value: string) {
    setDrafts((prev) => prev.map((d) => (d.key === key ? { ...d, [field]: value } : d)));
  }

  function addExercise() {
    setDrafts((prev) => [...prev, emptyExercise()]);
  }

  function removeExercise(key: string) {
    setDrafts((prev) => prev.filter((d) => d.key !== key));
  }

  function reset() {
    setName("");
    setDrafts([emptyExercise()]);
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = validateWorkout(name, drafts);
    if (typeof result === "string") {
      setError(result);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await onSubmit(result);
      if (!isEdit) reset();
    } catch (err) {
      setError(errorMessage(err, "Could not save workout. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return {
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
  };
}