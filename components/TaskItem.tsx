"use client";

import { useEffect, useRef, useState } from "react";
import type { Task } from "@/hooks/useTasks";
import { PriorityBadge } from "@/components/PriorityBadge";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
};

export function TaskItem({
  task,
  onToggle,
  onTextChange,
  onDelete,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(task.text);
  }, [task.text, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    onTextChange(task.id, draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(task.text);
    setEditing(false);
  };

  return (
    <li className="group flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 transition hover:border-zinc-600">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--border)] bg-[var(--background)] text-[var(--accent)] focus:ring-[var(--accent)]"
        aria-label={task.done ? "Mark not done" : "Mark done"}
      />
      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => {
              if (draft.trim()) commit();
              else cancel();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (draft.trim()) commit();
              }
              if (e.key === "Escape") cancel();
            }}
            className="w-full rounded border border-[var(--accent)] bg-[var(--background)] px-2 py-0.5 text-sm text-[var(--foreground)] focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onDoubleClick={() => setEditing(true)}
            className={`w-full text-left text-sm ${
              task.done
                ? "text-[var(--muted)] line-through"
                : "text-[var(--foreground)]"
            }`}
          >
            {task.text}
          </button>
        )}
      </div>
      <PriorityBadge priority={task.priority} />
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className="shrink-0 rounded p-1 text-[var(--muted)] opacity-60 transition hover:bg-white/10 hover:text-rose-300 group-hover:opacity-100"
        aria-label="Delete task"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </li>
  );
}
