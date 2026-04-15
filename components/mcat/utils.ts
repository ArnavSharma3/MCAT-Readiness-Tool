import { SectionScores, StudyTask, StudyTaskCategory } from "@/components/mcat/types";

export const STORAGE_KEYS = {
  readiness: "mcat-readiness-state",
  tasks: "mcat-study-plan-state",
  timer: "mcat-session-timer-state",
  delayTool: "mcat-delay-tool-state",
} as const;

export const DEFAULT_SECTION_SCORES: SectionScores = {
  "C/P": 124,
  CARS: 124,
  "B/B": 124,
  "P/S": 124,
};

export const TIMER_BLOCKS = [
  { label: "Study", minutes: 60, type: "study" as const },
  { label: "Break", minutes: 10, type: "break" as const },
  { label: "Study", minutes: 50, type: "study" as const },
  { label: "Break", minutes: 10, type: "break" as const },
  { label: "Study", minutes: 40, type: "study" as const },
  { label: "Break", minutes: 10, type: "break" as const },
  { label: "Study", minutes: 30, type: "study" as const },
  { label: "Break", minutes: 10, type: "break" as const },
  { label: "Study", minutes: 20, type: "study" as const },
  { label: "Break", minutes: 10, type: "break" as const },
  { label: "Study", minutes: 10, type: "study" as const },
  { label: "Reset Break", minutes: 30, type: "break" as const },
];

const PLAN_CATEGORIES: StudyTaskCategory[] = ["Content Review", "CARS Practice", "FL Review", "Anki Review"];

function toIsoDate(date: Date): string {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString().slice(0, 10);
}

export function getTodayIsoDate() {
  return toIsoDate(new Date());
}

export function getPlanWindow() {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 3, 15);
  const end = new Date(year, 4, 9);
  return { start, end };
}

export function formatDateLabel(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", weekday: "short" });
}

export function createDefaultPlan(): StudyTask[] {
  const { start, end } = getPlanWindow();
  const tasks: StudyTask[] = [];
  const cursor = new Date(start);
  let idx = 0;

  while (cursor <= end) {
    const iso = toIsoDate(cursor);
    const daysFromEnd = Math.ceil((end.getTime() - cursor.getTime()) / 86_400_000);

    if (daysFromEnd <= 2) {
      tasks.push({
        id: crypto.randomUUID(),
        date: iso,
        title: "Recovery-focused rest and confidence reset",
        category: "Rest Day",
        completed: false,
      });
    } else {
      const category = PLAN_CATEGORIES[idx % PLAN_CATEGORIES.length] as Exclude<StudyTaskCategory, "Rest Day">;
      const titleByCategory: Record<Exclude<StudyTaskCategory, "Rest Day">, string> = {
        "Content Review": "Targeted content review by weak topics",
        "CARS Practice": "Timed CARS passage set with reflection",
        "FL Review": "Review full-length questions and missed logic",
        "Anki Review": "Spaced Anki cards and quick recap",
      };
      tasks.push({
        id: crypto.randomUUID(),
        date: iso,
        title: titleByCategory[category],
        category,
        completed: false,
      });
      idx += 1;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return tasks;
}

export function redistributeMissedTasksForward(tasks: StudyTask[], fromDate: string): StudyTask[] {
  const dates = Array.from(new Set(tasks.map((task) => task.date))).sort();
  const eligibleDates = dates.filter((d) => d >= fromDate);
  if (!eligibleDates.length) {
    return tasks;
  }

  const nextTasks = [...tasks];
  let pushIndex = 0;

  for (let i = 0; i < nextTasks.length; i += 1) {
    const task = nextTasks[i];
    if (!task.completed && task.date < fromDate) {
      nextTasks[i] = { ...task, date: eligibleDates[pushIndex % eligibleDates.length] };
      pushIndex += 1;
    }
  }

  return nextTasks;
}

export function clampSectionScore(value: number) {
  return Math.min(132, Math.max(118, value));
}
