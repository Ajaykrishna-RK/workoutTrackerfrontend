import api from "@/lib/axios";
import type {
  MessageResponse,
  PaginatedWorkouts,
  Workout,
  WorkoutInput,
  WorkoutListQuery,
  WorkoutMutationResponse,
  WorkoutUpdateInput,
} from "@/types/workout";

export async function listWorkouts(query: WorkoutListQuery = {}): Promise<PaginatedWorkouts> {
  const { data } = await api.get<PaginatedWorkouts>("/workouts", { params: query });
  return data;
}

export async function getWorkout(id: string): Promise<Workout> {
  const { data } = await api.get<Workout>(`/workouts/${id}`);
  return data;
}

export async function createWorkout(input: WorkoutInput): Promise<Workout> {
  const { data } = await api.post<WorkoutMutationResponse>("/workouts", input);
  return data.workout;
}

export async function updateWorkout(id: string, input: WorkoutUpdateInput): Promise<Workout> {
  const { data } = await api.patch<WorkoutMutationResponse>(`/workouts/${id}`, input);
  return data.workout;
}

export async function deleteWorkout(id: string): Promise<string> {
  const { data } = await api.delete<MessageResponse>(`/workouts/${id}`);
  return data.message;
}
