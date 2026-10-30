import type { PaginationProps } from "../types/workoutTypes";

const buttonClass =
  "rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50";

export default function Pagination({ meta, disabled, onPageChange }: PaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <nav aria-label="Workout pages" className="mt-4 flex items-center justify-between gap-3">
      <button
        type="button"
        className={buttonClass}
        disabled={disabled || meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        Previous
      </button>
      <p className="text-sm text-zinc-600">
        Page {meta.page} of {meta.totalPages} · {meta.total} workouts
      </p>
      <button
        type="button"
        className={buttonClass}
        disabled={disabled || meta.page >= meta.totalPages}
        onClick={() => onPageChange(meta.page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
