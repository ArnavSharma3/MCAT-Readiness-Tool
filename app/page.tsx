import { DelayDecisionTool } from "@/components/mcat/DelayDecisionTool";
import { ReadinessDashboard } from "@/components/mcat/ReadinessDashboard";
import { SessionTimer } from "@/components/mcat/SessionTimer";
import { StudyPlanTracker } from "@/components/mcat/StudyPlanTracker";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-8 md:py-8">
      <header className="rounded-3xl border bg-[var(--card)]/90 p-6 shadow-sm">
        <p className="text-sm text-[var(--muted)]">MCAT calm prep companion</p>
        <h1 className="mt-2 text-2xl font-semibold md:text-3xl">Readiness, rhythm, and gentle momentum</h1>
      </header>
      <ReadinessDashboard />
      <StudyPlanTracker />
      <SessionTimer />
      <DelayDecisionTool />
    </main>
  );
}
