import type { WorkoutListQuery } from "@/types/workout";
import type { DateFilterValue, DateRangePreset } from "../types/workoutTypes";

export const DATE_RANGE_OPTIONS: { value: DateRangePreset; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "15d", label: "Last 15 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "3m", label: "Last 3 months" },
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last year" },
  { value: "all", label: "All time" },
  { value: "custom", label: "Custom" },
];

export const defaultDateFilter = (): DateFilterValue => ({
  preset: "30d",
  from: "",
  to: "",
});

// Returns null while a custom range has no dates yet; the API rejects range=custom without from/to.
export function toWorkoutQuery(filter: DateFilterValue): WorkoutListQuery | null {
  if (filter.preset === "all") return {};
  if (filter.preset !== "custom") return { range: filter.preset };
  if (!filter.from && !filter.to) return null;
  return {
    range: "custom",
    from: filter.from || undefined,
    to: filter.to || undefined,
  };
}
