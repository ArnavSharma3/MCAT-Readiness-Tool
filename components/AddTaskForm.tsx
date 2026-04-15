"use client";

import { useState } from "react";
import type { TaskPriority } from "@/hooks/useTasks";

type AddTaskFormProps = {
  disabled?: boolean;
  onAdd: (text: string, priority: TaskPriority) => void;
};

export function AddTaskForm({ disabled, onAdd }: AddTaskFormProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const submit = () => {
    if (disabled) return;
    onAdd(text, priority);
    setText("");
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg">
      <label className="sr-only" htmlFor="task-input">
        New task
      </label>
      <input
        id="task-input"
        type="text"
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="What needs doing?"
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50"
      />
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-[var(--muted)]">Priority</span>
        <select
          value={priority}
          disabled={disabled}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="button"
          disabled={disabled || !text.trim()}
          onClick={submit}
          className="ml-auto rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add task
        </button>
      </div>
    </div>
  );
}
