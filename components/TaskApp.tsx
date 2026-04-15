"use client";

import { AddTaskForm } from "@/components/AddTaskForm";
import { FilterBar } from "@/components/FilterBar";
import { StatusBar } from "@/components/StatusBar";
import { TaskList } from "@/components/TaskList";
import { useTasks } from "@/hooks/useTasks";

export function TaskApp() {
  const {
    hydrated,
    tasks,
    filter,
    setFilter,
    activeCount,
    doneCount,
    totalCount,
    deleteUndoTask,
    addTask,
    toggleDone,
    setTaskText,
    deleteTask,
    undoDelete,
    clearCompleted,
  } = useTasks();

  const emptyByFilter =
    filter === "all"
      ? "No tasks yet. Add one above."
      : filter === "active"
        ? "No active tasks."
        : "No completed tasks.";

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Tasks
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Stored on this device only.
        </p>
      </header>

      <AddTaskForm disabled={!hydrated} onAdd={addTask} />

      <div className="flex flex-col gap-4">
        <FilterBar filter={filter} onFilterChange={setFilter} />
        <StatusBar
          activeCount={activeCount}
          doneCount={doneCount}
          totalCount={totalCount}
          onClearCompleted={clearCompleted}
        />
      </div>

      <TaskList
        tasks={tasks}
        onToggle={toggleDone}
        onTextChange={setTaskText}
        onDelete={deleteTask}
        emptyMessage={emptyByFilter}
      />

      {deleteUndoTask ? (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm shadow-xl">
          <span className="max-w-[200px] truncate text-[var(--muted)]">
            Deleted “{deleteUndoTask.text}”
          </span>
          <button
            type="button"
            onClick={undoDelete}
            className="font-semibold text-[var(--accent)] hover:underline"
          >
            Undo
          </button>
        </div>
      ) : null}
    </div>
  );
}
