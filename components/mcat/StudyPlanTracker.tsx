"use client";

import { useEffect, useMemo, useState } from "react";
import { StudyTask } from "@/components/mcat/types";
import {
  createDefaultPlan,
  formatDateLabel,
  getTodayIsoDate,
  redistributeMissedTasksForward,
  STORAGE_KEYS,
} from "@/components/mcat/utils";

export function StudyPlanTracker() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [showFullPlan, setShowFullPlan] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const today = getTodayIsoDate();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.tasks);
    const parsed = raw ? (JSON.parse(raw) as StudyTask[]) : createDefaultPlan();
    setTasks(redistributeMissedTasksForward(parsed, today));
    setLoaded(true);
  }, [today]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
  }, [tasks, loaded]);

  const tasksByDay = useMemo(() => {
    const grouped = new Map<string, StudyTask[]>();
    for (const task of tasks) {
      const list = grouped.get(task.date) ?? [];
      list.push(task);
      grouped.set(task.date, list);
    }
    return grouped;
  }, [tasks]);

  const todaysTasks = tasksByDay.get(today) ?? [];
  const completedThisWeek = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return tasks.filter((task) => task.completed && new Date(`${task.date}T00:00:00`) >= start).length;
  }, [tasks]);

  const allDates = Array.from(tasksByDay.keys()).sort();

  const updateTask = (taskId: string, updater: (task: StudyTask) => StudyTask) => {
    setTasks((current) => current.map((task) => (task.id === taskId ? updater(task) : task)));
  };

  const removeTask = (taskId: string) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  const moveTask = (taskId: string, direction: "up" | "down") => {
    setTasks((current) => {
      const index = current.findIndex((task) => task.id === taskId);
      if (index < 0) return current;
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const snoozeTask = (taskId: string) => {
    const futureDates = allDates.filter((date) => date >= today);
    if (!futureDates.length) return;
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== taskId) return task;
        const idx = futureDates.indexOf(task.date);
        const nextDate = futureDates[Math.min(futureDates.length - 1, Math.max(0, idx + 1))];
        return { ...task, date: nextDate };
      }),
    );
  };

  const DayGroup = ({ date }: { date: string }) => (
    <div className="rounded-2xl border bg-[var(--card-soft)] p-3">
      <p className="text-sm font-medium">{formatDateLabel(date)}</p>
      <div className="mt-2 space-y-2">
        {(tasksByDay.get(date) ?? []).map((task) => (
          <article key={task.id} className="rounded-xl border bg-white p-3 transition hover:shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <input
                value={task.title}
                onChange={(event) => updateTask(task.id, (t) => ({ ...t, title: event.target.value }))}
                className="min-w-[200px] flex-1 rounded-lg border px-2 py-1 text-sm outline-none ring-[var(--focus-ring)] focus:ring"
              />
              <span className="rounded-full bg-[var(--success-soft)] px-2 py-1 text-xs text-[var(--muted)]">{task.category}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => updateTask(task.id, (t) => ({ ...t, completed: !t.completed }))}
                className="rounded-full border px-2 py-1"
              >
                {task.completed ? "Mark active" : "Mark done"}
              </button>
              <button type="button" onClick={() => snoozeTask(task.id)} className="rounded-full border px-2 py-1">
                Skip for now
              </button>
              <button type="button" onClick={() => moveTask(task.id, "up")} className="rounded-full border px-2 py-1">
                Move up
              </button>
              <button
                type="button"
                onClick={() => moveTask(task.id, "down")}
                className="rounded-full border px-2 py-1"
              >
                Move down
              </button>
              <button type="button" onClick={() => removeTask(task.id)} className="rounded-full border px-2 py-1">
                Remove
              </button>
            </div>
          </article>
        ))}
        {!tasksByDay.get(date)?.length ? (
          <p className="rounded-xl border bg-white p-3 text-sm text-[var(--muted)]">No tasks queued here right now. This can be a lighter day.</p>
        ) : null}
      </div>
    </div>
  );

  const addTaskForToday = () => {
    setTasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        date: today,
        category: "Content Review",
        title: "Short focused review block",
        completed: false,
      },
    ]);
  };

  return (
    <section className="rounded-3xl border bg-[var(--card)]/90 p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Daily task tracker</h2>
          <p className="text-sm text-[var(--muted)]">You&apos;ve completed {completedThisWeek} tasks this week.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addTaskForToday} className="rounded-xl border bg-white px-3 py-2 text-sm">
            Add today task
          </button>
          <button type="button" onClick={() => setShowFullPlan((v) => !v)} className="rounded-xl border bg-white px-3 py-2 text-sm">
            {showFullPlan ? "Show today only" : "View full plan"}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {showFullPlan ? allDates.map((date) => <DayGroup key={date} date={date} />) : <DayGroup date={today} />}
      </div>
    </section>
  );
}
