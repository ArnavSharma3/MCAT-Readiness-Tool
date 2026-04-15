import type { TaskPriority } from "@/hooks/useTasks";

const styles: Record<TaskPriority, string> = {
  low: "bg-zinc-700/80 text-zinc-300 ring-1 ring-zinc-600/80",
  medium: "bg-sky-900/60 text-sky-200 ring-1 ring-sky-700/60",
  high: "bg-rose-900/60 text-rose-200 ring-1 ring-rose-700/60",
};

const labels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Med",
  high: "High",
};

type PriorityBadgeProps = {
  priority: TaskPriority;
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  );
}
