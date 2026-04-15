import type { TaskFilter } from "@/hooks/useTasks";

type FilterBarProps = {
  filter: TaskFilter;
  onFilterChange: (f: TaskFilter) => void;
};

const options: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "done", label: "Done" },
];

export function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  return (
    <div
      className="flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] p-1"
      role="tablist"
      aria-label="Filter tasks"
    >
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={filter === value}
          onClick={() => onFilterChange(value)}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            filter === value
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
