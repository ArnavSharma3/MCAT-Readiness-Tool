"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
  priority: TaskPriority;
};

export type TaskFilter = "all" | "active" | "done";

const STORAGE_KEY = "task-tracker-tasks-v1";

function sortNewestFirst(list: Task[]): Task[] {
  return [...list].sort((a, b) => b.createdAt - a.createdAt);
}

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Task[];
    if (!Array.isArray(parsed)) return [];
    return sortNewestFirst(
      parsed.filter(
        (t) =>
          t &&
          typeof t.id === "string" &&
          typeof t.text === "string" &&
          typeof t.done === "boolean" &&
          typeof t.createdAt === "number" &&
          ["low", "medium", "high"].includes(t.priority)
      )
    );
  } catch {
    return [];
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [deleteUndo, setDeleteUndo] = useState<{
    task: Task;
    timer: ReturnType<typeof setTimeout>;
  } | null>(null);

  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  useEffect(() => {
    setTasks(loadTasks());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  useEffect(() => {
    return () => {
      if (deleteUndo?.timer) clearTimeout(deleteUndo.timer);
    };
  }, [deleteUndo]);

  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.done);
    if (filter === "done") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  const activeCount = useMemo(
    () => tasks.filter((t) => !t.done).length,
    [tasks]
  );
  const doneCount = useMemo(
    () => tasks.filter((t) => t.done).length,
    [tasks]
  );

  const addTask = useCallback((text: string, priority: TaskPriority) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const task: Task = {
      id: crypto.randomUUID(),
      text: trimmed,
      done: false,
      createdAt: Date.now(),
      priority,
    };
    setTasks((prev) => sortNewestFirst([...prev, task]));
  }, []);

  const toggleDone = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []);

  const setTaskText = useCallback((id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    const task = tasksRef.current.find((t) => t.id === id);
    if (!task) return;
    setDeleteUndo((current) => {
      if (current?.timer) clearTimeout(current.timer);
      const timer = setTimeout(() => setDeleteUndo(null), 3000);
      return { task: { ...task }, timer };
    });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const undoDelete = useCallback(() => {
    setDeleteUndo((current) => {
      if (!current) return null;
      clearTimeout(current.timer);
      const t = current.task;
      setTasks((prev) => sortNewestFirst([...prev, t]));
      return null;
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.done));
  }, []);

  return {
    hydrated,
    tasks: filteredTasks,
    filter,
    setFilter,
    activeCount,
    doneCount,
    totalCount: tasks.length,
    deleteUndoTask: deleteUndo?.task ?? null,
    addTask,
    toggleDone,
    setTaskText,
    deleteTask,
    undoDelete,
    clearCompleted,
  };
}
