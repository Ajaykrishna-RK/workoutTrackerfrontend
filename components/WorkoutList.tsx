import type { Workout } from "@/types/workout";
import WorkoutCard from "./WorkoutCard";

interface Props {
  workouts: Workout[];
  onDelete: (id: string) => void;
}

export default function WorkoutList({ workouts, onDelete }: Props) {
  if (workouts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
        No workouts yet. Add your first one above.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} onDelete={onDelete} />
      ))}
    </ul>
  );
}
