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

// PATCH accepts either field; a supplied `exercises` replaces the whole array.
export type WorkoutUpdateInput = Partial<WorkoutInput>;

export interface WorkoutMutationResponse {
  message: string;
  workout: Workout;
}

export interface MessageResponse {
  message: string;
}
