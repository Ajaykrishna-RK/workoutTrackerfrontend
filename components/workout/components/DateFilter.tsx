import type { DateFilterProps, DateRangePreset } from "../types/workoutTypes";
import { DATE_RANGE_OPTIONS } from "../utils/dateFilters";
import { inputClass } from "../utils/styles";

const today = () => new Date().toISOString().slice(0, 10);

const chipClass = (active: boolean) =>
  `rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
    active
      ? "border-zinc-900 bg-zinc-900 text-white"
      : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
  }`;

export default function DateFilter({ value, onChange }: DateFilterProps) {
  function selectPreset(preset: DateRangePreset) {
    onChange({ ...value, preset });
  }

  return (
    <div className="space-y-3">
      <div role="group" aria-label="Filter workouts by date" className="flex flex-wrap gap-2">
        {DATE_RANGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value.preset === option.value}
            onClick={() => selectPreset(option.value)}
            className={chipClass(value.preset === option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {value.preset === "custom" && (
        <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
          <label className="text-sm">
            From
            <input
              type="date"
              className={inputClass}
              value={value.from}
              max={value.to || today()}
              onChange={(e) => onChange({ ...value, from: e.target.value })}
            />
          </label>
          <label className="text-sm">
            To
            <input
              type="date"
              className={inputClass}
              value={value.to}
              min={value.from || undefined}
              max={today()}
              onChange={(e) => onChange({ ...value, to: e.target.value })}
            />
          </label>
        </div>
      )}
    </div>
  );
}
