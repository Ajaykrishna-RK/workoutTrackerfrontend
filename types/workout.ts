export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
  userId: string;
}

export interface WorkoutInput {
  name: string;
  exercises: Exercise[];
}

export type WorkoutUpdateInput = Partial<WorkoutInput>;

export interface WorkoutMutationResponse {
  message: string;
  workout: Workout;
}

export interface MessageResponse {
  message: string;
}

export type WorkoutRange = "7d" | "15d" | "30d" | "3m" | "6m" | "1y" | "custom";

// Omit `range` for all workouts. `from`/`to` (YYYY-MM-DD) are only valid with range "custom".
export interface WorkoutListQuery {
  range?: WorkoutRange;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedWorkouts {
  data: Workout[];
  meta: PaginationMeta;
}
