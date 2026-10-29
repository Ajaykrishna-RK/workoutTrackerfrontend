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
