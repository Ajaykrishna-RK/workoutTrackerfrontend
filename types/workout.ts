export interface Workout {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
}

export type WorkoutInput = Omit<Workout, "id">;
