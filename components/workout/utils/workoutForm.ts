import type { Exercise, WorkoutInput } from "@/types/workout";
import type { ExerciseDraft } from "../types/workoutTypes";

export const emptyExercise = (): ExerciseDraft => ({
  key: crypto.randomUUID(),
  name: "",
  sets: "3",
  reps: "10",
  weight: "0",
});

export const toDraft = (exercise: Exercise): ExerciseDraft => ({
  key: crypto.randomUUID(),
  name: exercise.name,
  sets: String(exercise.sets),
  reps: String(exercise.reps),
  weight: String(exercise.weight),
});

const isPositiveInt = (n: number) => Number.isInteger(n) && n > 0;

// Mirrors the backend rules so most mistakes are caught before a round trip.
// Returns the request body on success, or an error message.
export function validateWorkout(name: string, drafts: ExerciseDraft[]): WorkoutInput | string {
  if (!name.trim()) return "Workout name is required.";
  if (drafts.length === 0) return "Add at least one exercise.";

  const exercises: Exercise[] = [];
  for (const [i, d] of drafts.entries()) {
    const label = d.name.trim() || `Exercise ${i + 1}`;
    const exercise = {
      name: d.name.trim(),
      sets: Number(d.sets),
      reps: Number(d.reps),
      weight: Number(d.weight),
    };
    if (!exercise.name) return `Exercise ${i + 1} needs a name.`;
    if (!isPositiveInt(exercise.sets)) return `${label}: sets must be a whole number above 0.`;
    if (!isPositiveInt(exercise.reps)) return `${label}: reps must be a whole number above 0.`;
    if (d.weight === "" || !(exercise.weight >= 0)) return `${label}: weight must be 0 or more.`;
    exercises.push(exercise);
  }
  return { name: name.trim(), exercises };
}
