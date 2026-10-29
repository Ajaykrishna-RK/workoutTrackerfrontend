import type { Workout, WorkoutInput } from "@/types/workout";

export interface ExerciseDraft {
  key: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

export type ExerciseDraftField = keyof Omit<ExerciseDraft, "key">;

export interface WorkoutFormProps {
  initial?: Workout;
  onSubmit: (input: WorkoutInput) => Promise<void>;
  onCancel?: () => void;
}

export interface ExerciseFieldsProps {
  draft: ExerciseDraft;
  index: number;
  removable: boolean;
  onChange: (key: string, field: ExerciseDraftField, value: string) => void;
  onRemove: (key: string) => void;
}

export interface WorkoutListProps {
  workouts: Workout[];
  busyId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface WorkoutCardProps {
  workout: Workout;
  busy: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export type DateRangePreset = "7d" | "15d" | "30d" | "3m" | "6m" | "1y" | "custom";

export interface DateFilterValue {
  preset: DateRangePreset;
  from: string;
  to: string;
}

export interface DateFilterProps {
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
}
