import type { Workout } from "@/types/workout";

interface Props {
  workout: Workout;
  onDelete: (id: string) => void;
}

export default function WorkoutCard({ workout, onDelete }: Props) {
  const weight = workout.weight > 0 ? ` @ ${workout.weight} kg` : "";

  return (
    <li className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div>
        <p className="font-medium">{workout.name}</p>
        <p className="text-sm text-zinc-500">
          {`${workout.sets} × ${workout.reps}${weight} · ${new Date(workout.date).toLocaleDateString()}`}
        </p>
      </div>
      <button
        onClick={() => onDelete(workout.id)}
        className="text-sm text-red-600 hover:underline"
      >
        Delete
      </button>
    </li>
  );
}
