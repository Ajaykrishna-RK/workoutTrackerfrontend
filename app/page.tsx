import WorkoutTracker from "@/components/WorkoutTracker";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Workout Tracker</h1>
      <WorkoutTracker />
    </main>
  );
}
