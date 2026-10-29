import type { WorkoutCardProps } from "../types/workoutTypes";
import { formatDate, formatExerciseDetail } from "../utils/formatters";

export default function WorkoutCard({ workout, busy, onEdit, onDelete }: WorkoutCardProps) {
  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">{workout.name}</p>
          <p className="text-sm text-zinc-500">{formatDate(workout.createdAt)}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(workout.id)}
            disabled={busy}
            className="text-sm text-zinc-700 hover:underline disabled:opacity-60"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(workout.id)}
            disabled={busy}
            className="text-sm text-red-600 hover:underline disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>

      <ul className="mt-3 space-y-1 text-sm text-zinc-700">
        {workout.exercises.map((exercise, i) => (
          <li key={i}>
            {exercise.name}
            <span className="text-zinc-500"> · {formatExerciseDetail(exercise)}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}
