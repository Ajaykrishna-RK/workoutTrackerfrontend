import type { WorkoutListProps } from "../types/workoutTypes";
import WorkoutCard from "./WorkoutCard";

export default function WorkoutList({
  workouts,
  emptyMessage,
  busyId,
  onEdit,
  onDelete,
}: WorkoutListProps) {
  if (workouts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          busy={busyId === workout.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
