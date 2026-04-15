import { TaskApp } from "@/components/TaskApp";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-10">
      <TaskApp />
    </main>
  );
}
