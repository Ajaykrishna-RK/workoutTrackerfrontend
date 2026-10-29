import type { Exercise } from "@/types/workout";

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

export function formatExerciseDetail(exercise: Exercise): string {
  const weight = exercise.weight > 0 ? ` @ ${exercise.weight} kg` : "";
  return `${exercise.sets} × ${exercise.reps}${weight}`;
}
