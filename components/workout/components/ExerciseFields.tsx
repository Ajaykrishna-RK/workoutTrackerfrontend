import type { ExerciseFieldsProps } from "../types/workoutTypes";
import { inputClass } from "../utils/styles";

export default function ExerciseFields({
  draft,
  index,
  removable,
  onChange,
  onRemove,
}: ExerciseFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-md border border-zinc-200 p-3 sm:grid-cols-6">
      <label className="col-span-2 text-sm sm:col-span-3">
        Exercise {index + 1}
        <input
          className={inputClass}
          placeholder="e.g. Bench press"
          value={draft.name}
          onChange={(e) => onChange(draft.key, "name", e.target.value)}
          required
        />
      </label>
      <label className="text-sm">
        Sets
        <input
          type="number"
          min={1}
          step={1}
          className={inputClass}
          value={draft.sets}
          onChange={(e) => onChange(draft.key, "sets", e.target.value)}
        />
      </label>
      <label className="text-sm">
        Reps
        <input
          type="number"
          min={1}
          step={1}
          className={inputClass}
          value={draft.reps}
          onChange={(e) => onChange(draft.key, "reps", e.target.value)}
        />
      </label>
      <label className="text-sm">
        Weight (kg)
        <input
          type="number"
          min={0}
          step="0.5"
          className={inputClass}
          value={draft.weight}
          onChange={(e) => onChange(draft.key, "weight", e.target.value)}
        />
      </label>
      {removable && (
        <button
          type="button"
          onClick={() => onRemove(draft.key)}
          className="col-span-2 justify-self-start text-sm text-red-600 hover:underline sm:col-span-6"
        >
          Remove exercise
        </button>
      )}
    </div>
  );
}
