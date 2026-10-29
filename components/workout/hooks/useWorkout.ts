"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Workout, WorkoutInput } from "@/types/workout";
import { logout } from "@/components/login/api/auth";
import {
  createWorkout,
  deleteWorkout,
  getWorkout,
  listWorkouts,
  updateWorkout,
} from "../api/workouts";
import { errorMessage, isNotFound, isUnauthorized } from "../utils/apiErrors";
import type { ExerciseDraft, ExerciseDraftField } from "../types/workoutTypes";
import { emptyExercise, toDraft, validateWorkout } from "../utils/workoutForm";

const GONE_MESSAGE = "That workout no longer exists.";

export function useWorkouts() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Workout | null>(null);
  // The workout whose edit/delete request is in flight.
  const [busyId, setBusyId] = useState<string | null>(null);

  const endSession = useCallback(() => {
    logout();
    router.replace("/login");
  }, [router]);

  const handleError = useCallback(
    (err: unknown, fallback: string) => {
      if (isUnauthorized(err)) endSession();
      else setError(errorMessage(err, fallback));
    },
    [endSession]
  );

  const removeLocal = (id: string) => setWorkouts((prev) => prev.filter((w) => w.id !== id));

  useEffect(() => {
    let cancelled = false;
    listWorkouts()
      .then((data) => {
        if (!cancelled) setWorkouts(data);
      })
      .catch((err) => {
        if (!cancelled) handleError(err, "Could not load workouts.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [handleError]);

  // Form errors (validation, 400s) are shown inside the form, so only auth failures are handled here.
  function rethrowUnlessUnauthorized(err: unknown): never {
    if (isUnauthorized(err)) endSession();
    throw err;
  }

  async function create(input: WorkoutInput) {
    try {
      const workout = await createWorkout(input);
      setWorkouts((prev) => [workout, ...prev]);
    } catch (err) {
      rethrowUnlessUnauthorized(err);
    }
  }

  async function update(input: WorkoutInput) {
    if (!editing) return;
    try {
      const updated = await updateWorkout(editing.id, input);
      setWorkouts((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
      setEditing(null);
    } catch (err) {
      if (!isNotFound(err)) rethrowUnlessUnauthorized(err);
      removeLocal(editing.id);
      setEditing(null);
      setError(GONE_MESSAGE);
    }
  }

  async function startEdit(id: string) {
    setError(null);
    setBusyId(id);
    try {
      // Fetch the latest copy so edits start from the server's version.
      setEditing(await getWorkout(id));
    } catch (err) {
      if (isNotFound(err)) {
        removeLocal(id);
        setError(GONE_MESSAGE);
      } else {
        handleError(err, "Could not open workout.");
      }
    } finally {
      setBusyId(null);
    }
  }

  function cancelEdit() {
    setEditing(null);
  }

  async function remove(id: string) {
    setError(null);
    setBusyId(id);
    try {
      await deleteWorkout(id);
      removeLocal(id);
      if (editing?.id === id) setEditing(null);
    } catch (err) {
      // Already gone on the server, so the end state is the same.
      if (isNotFound(err)) removeLocal(id);
      else handleError(err, "Could not delete workout.");
    } finally {
      setBusyId(null);
    }
  }

  return {
    workouts,
    loading,
    error,
    editing,
    busyId,
    create,
    update,
    startEdit,
    cancelEdit,
    remove,
  };
}

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
