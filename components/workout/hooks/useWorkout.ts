"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PaginationMeta, Workout, WorkoutInput } from "@/types/workout";
import { logout } from "@/components/login/api/auth";
import {
  createWorkout,
  deleteWorkout,
  getWorkout,
  listWorkouts,
  updateWorkout,
} from "../api/workouts";
import type { DateFilterValue } from "../types/workoutTypes";
import { errorMessage, isNotFound, isUnauthorized } from "../utils/apiErrors";
import { defaultDateFilter, toWorkoutQuery } from "../utils/dateFilters";

const GONE_MESSAGE = "That workout no longer exists.";
const PAGE_SIZE = 10;

interface ListState {
  key: string | null;
  workouts: Workout[];
  meta: PaginationMeta | null;
}

export function useWorkouts() {
  const router = useRouter();
  const [filter, setFilterState] = useState<DateFilterValue>(defaultDateFilter);
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [list, setList] = useState<ListState>({ key: null, workouts: [], meta: null });
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Workout | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const query = useMemo(() => toWorkoutQuery(filter), [filter]);
  // Identifies the request the current filter, page and reload count call for.
  const requestKey = query ? JSON.stringify({ ...query, page, version }) : null;
  const loading = requestKey !== null && list.key !== requestKey;

  const endSession = useCallback(() => {
    void logout();
    router.replace("/login");
  }, [router]);

  const handleError = useCallback(
    (err: unknown, fallback: string) => {
      if (isUnauthorized(err)) endSession();
      else setError(errorMessage(err, fallback));
    },
    [endSession]
  );

  const reload = () => setVersion((v) => v + 1);

  const removeLocal = (id: string) =>
    setList((prev) => ({ ...prev, workouts: prev.workouts.filter((w) => w.id !== id) }));

  useEffect(() => {
    if (!query || !requestKey) return;
    let cancelled = false;
    listWorkouts({ ...query, page, limit: PAGE_SIZE })
      .then(({ data, meta }) => {
        if (!cancelled) setList({ key: requestKey, workouts: data, meta });
      })
      .catch((err) => {
        if (cancelled) return;
        setList((prev) => ({ ...prev, key: requestKey }));
        handleError(err, "Could not load workouts.");
      });
    return () => {
      cancelled = true;
    };
  }, [query, page, requestKey, handleError]);

  function setFilter(next: DateFilterValue) {
    setFilterState(next);
    setPage(1);
    setError(null);
  }

  function goToPage(next: number) {
    setError(null);
    setPage(next);
  }

  function rethrowUnlessUnauthorized(err: unknown): never {
    if (isUnauthorized(err)) endSession();
    throw err;
  }

  async function create(input: WorkoutInput) {
    try {
      await createWorkout(input);
      // The new workout is the newest, so it lands on page 1 when it matches the filter.
      setPage(1);
      reload();
    } catch (err) {
      rethrowUnlessUnauthorized(err);
    }
  }

  async function update(input: WorkoutInput) {
    if (!editing) return;
    try {
      const updated = await updateWorkout(editing.id, input);
      setList((prev) => ({
        ...prev,
        workouts: prev.workouts.map((w) => (w.id === updated.id ? updated : w)),
      }));
      setEditing(null);
    } catch (err) {
      if (!isNotFound(err)) rethrowUnlessUnauthorized(err);
      removeLocal(editing.id);
      setEditing(null);
      setError(GONE_MESSAGE);
    }
  }

  async function startEdit(id: string) {
    setError(null);
    setBusyId(id);
    try {
      setEditing(await getWorkout(id));
    } catch (err) {
      if (isNotFound(err)) {
        removeLocal(id);
        setError(GONE_MESSAGE);
      } else {
        handleError(err, "Could not open workout.");
      }
    } finally {
      setBusyId(null);
    }
  }

  function cancelEdit() {
    setEditing(null);
  }

  async function remove(id: string) {
    setError(null);
    setBusyId(id);
    try {
      await deleteWorkout(id);
      if (editing?.id === id) setEditing(null);
      // Refetch so the page refills and totals stay right; step back if the page is now empty.
      if (list.workouts.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (err) {
      if (isNotFound(err)) removeLocal(id);
      else handleError(err, "Could not delete workout.");
    } finally {
      setBusyId(null);
    }
  }

  return {
    workouts: list.workouts,
    meta: list.meta,
    filter,
    awaitingDates: query === null,
    hasLoaded: list.key !== null,
    loading,
    error,
    editing,
    busyId,
    setFilter,
    goToPage,
    create,
    update,
    startEdit,
    cancelEdit,
    remove,
  };
}
