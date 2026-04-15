import type { Task } from "@/hooks/useTasks";
import { TaskItem } from "@/components/TaskItem";

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  emptyMessage: string;
};

export function TaskList({
  tasks,
  onToggle,
  onTextChange,
  onDelete,
  emptyMessage,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-[var(--border)] py-10 text-center text-sm text-[var(--muted)]">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onTextChange={onTextChange}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
