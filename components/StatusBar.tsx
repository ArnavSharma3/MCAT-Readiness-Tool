type StatusBarProps = {
  activeCount: number;
  doneCount: number;
  totalCount: number;
  onClearCompleted: () => void;
};

export function StatusBar({
  activeCount,
  doneCount,
  totalCount,
  onClearCompleted,
}: StatusBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--muted)]">
      <p>
        <span className="tabular-nums text-[var(--foreground)]">{activeCount}</span>{" "}
        active
        <span className="mx-2 text-[var(--border)]">·</span>
        <span className="tabular-nums text-[var(--foreground)]">{doneCount}</span>{" "}
        done
        <span className="mx-2 text-[var(--border)]">·</span>
        <span className="tabular-nums text-[var(--foreground)]">{totalCount}</span>{" "}
        total
      </p>
      <button
        type="button"
        disabled={doneCount === 0}
        onClick={onClearCompleted}
        className="rounded-md px-2 py-1 text-xs font-medium text-rose-300 transition hover:bg-rose-950/50 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Clear completed
      </button>
    </div>
  );
}
