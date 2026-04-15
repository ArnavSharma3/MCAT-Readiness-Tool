"use client";

import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "@/components/mcat/utils";

type ChecklistState = {
  plateau: boolean;
  gaps: boolean;
  stress: boolean;
  targetGap: boolean;
};

const INITIAL_CHECKLIST: ChecklistState = {
  plateau: false,
  gaps: false,
  stress: false,
  targetGap: false,
};

export function DelayDecisionTool() {
  const [open, setOpen] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistState>(INITIAL_CHECKLIST);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.delayTool);
    if (raw) {
      setChecklist(JSON.parse(raw) as ChecklistState);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEYS.delayTool, JSON.stringify(checklist));
  }, [checklist, loaded]);

  const recommendation = useMemo(() => {
    const score = Object.values(checklist).filter(Boolean).length;
    if (score <= 1) {
      return "You appear close to ready. Staying the course with steady routines may be your best next step.";
    }
    if (score <= 3) {
      return "A short adjustment period could help. Consider a focused 1-2 week reset on your top gaps while protecting recovery time.";
    }
    return "It may be kind to yourself to consider delaying. A little extra runway can support both confidence and performance.";
  }, [checklist]);

  return (
    <footer className="pb-6 pt-2 text-center">
      <button type="button" onClick={() => setOpen((v) => !v)} className="text-sm text-[var(--muted)] underline underline-offset-4">
        Need help deciding?
      </button>
      {open ? (
        <div className="mx-auto mt-4 max-w-2xl rounded-3xl border bg-[var(--card)]/95 p-5 text-left shadow-sm transition">
          <h2 className="text-lg font-semibold">Delay decision check-in</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">A calm reflection for score trends, content coverage, and energy.</p>
          <div className="mt-4 grid gap-2">
            <Toggle
              label="My scores feel plateaued over recent practice"
              checked={checklist.plateau}
              onToggle={() => setChecklist((current) => ({ ...current, plateau: !current.plateau }))}
            />
            <Toggle
              label="I still have important content gaps"
              checked={checklist.gaps}
              onToggle={() => setChecklist((current) => ({ ...current, gaps: !current.gaps }))}
            />
            <Toggle
              label="Stress or logistics are affecting prep quality"
              checked={checklist.stress}
              onToggle={() => setChecklist((current) => ({ ...current, stress: !current.stress }))}
            />
            <Toggle
              label="My projected score is still meaningfully below target"
              checked={checklist.targetGap}
              onToggle={() => setChecklist((current) => ({ ...current, targetGap: !current.targetGap }))}
            />
          </div>
          <p className="mt-4 rounded-2xl border bg-[var(--card-soft)] p-3 text-sm">{recommendation}</p>
        </div>
      ) : null}
    </footer>
  );
}

function Toggle({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="flex items-center gap-3 rounded-xl border bg-[var(--card-soft)] p-3 text-left">
      <span
        className="inline-block h-4 w-4 rounded-full border"
        style={{ backgroundColor: checked ? "var(--accent)" : "white" }}
        aria-hidden
      />
      <span className="text-sm">{label}</span>
    </button>
  );
}
