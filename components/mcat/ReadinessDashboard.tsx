"use client";

import { useEffect, useMemo, useState } from "react";
import { McatSection, SectionScores } from "@/components/mcat/types";
import { clampSectionScore, DEFAULT_SECTION_SCORES, STORAGE_KEYS } from "@/components/mcat/utils";
import { SoftScoreArc } from "@/components/mcat/SoftScoreArc";

type ReadinessState = {
  sectionScores: SectionScores;
  flScores: number[];
  targetScore: number;
};

const SECTIONS: McatSection[] = ["C/P", "CARS", "B/B", "P/S"];

export function ReadinessDashboard() {
  const [state, setState] = useState<ReadinessState>({
    sectionScores: DEFAULT_SECTION_SCORES,
    flScores: [],
    targetScore: 512,
  });
  const [nextFlScore, setNextFlScore] = useState<string>("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.readiness);
    if (raw) {
      const parsed = JSON.parse(raw) as ReadinessState;
      setState(parsed);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEYS.readiness, JSON.stringify(state));
  }, [state, loaded]);

  const sectionTotal = useMemo(
    () => SECTIONS.reduce((sum, section) => sum + clampSectionScore(state.sectionScores[section]), 0),
    [state.sectionScores],
  );
  const flAverage = useMemo(() => {
    if (!state.flScores.length) return null;
    const avg = state.flScores.reduce((sum, score) => sum + score, 0) / state.flScores.length;
    return Math.round(avg);
  }, [state.flScores]);
  const projectedScore = flAverage === null ? sectionTotal : Math.round(sectionTotal * 0.6 + flAverage * 0.4);
  const progressToTarget = Math.max(0, Math.min(1, (projectedScore - 472) / Math.max(1, state.targetScore - 472)));

  const handleSectionChange = (section: McatSection, value: string) => {
    const parsed = Number.parseInt(value, 10);
    setState((current) => ({
      ...current,
      sectionScores: {
        ...current.sectionScores,
        [section]: Number.isNaN(parsed) ? 118 : clampSectionScore(parsed),
      },
    }));
  };

  const addFlScore = () => {
    const parsed = Number.parseInt(nextFlScore, 10);
    if (Number.isNaN(parsed)) return;
    const normalized = Math.min(528, Math.max(472, parsed));
    setState((current) => ({ ...current, flScores: [...current.flScores, normalized] }));
    setNextFlScore("");
  };

  return (
    <section className="rounded-3xl border bg-[var(--card)]/90 p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Readiness score dashboard</h2>
          <p className="text-sm text-[var(--muted)]">Section confidence + FL trend blended gently into one projection.</p>
        </div>
        <label className="text-sm">
          <span className="mr-2 text-[var(--muted)]">Target score</span>
          <input
            type="number"
            min={472}
            max={528}
            value={state.targetScore}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                targetScore: Math.min(528, Math.max(472, Number.parseInt(event.target.value, 10) || 472)),
              }))
            }
            className="w-24 rounded-xl border bg-[var(--card-soft)] px-3 py-2 text-center outline-none ring-[var(--focus-ring)] focus:ring"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((section) => (
          <label key={section} className="rounded-2xl border bg-[var(--card-soft)] p-3">
            <div className="text-xs text-[var(--muted)]">{section}</div>
            <input
              type="number"
              min={118}
              max={132}
              value={state.sectionScores[section]}
              onChange={(event) => handleSectionChange(section, event.target.value)}
              className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-lg font-medium outline-none ring-[var(--focus-ring)] focus:ring"
            />
          </label>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border bg-[var(--card-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-[var(--muted)]">Readiness arc toward your target</span>
          <span className="rounded-full border bg-white px-3 py-1 font-medium">Target {state.targetScore}</span>
        </div>
        <div className="mt-2 flex justify-center">
          <SoftScoreArc projectedScore={projectedScore} targetScore={state.targetScore} />
        </div>
        <p className="mt-1 text-center text-xs text-[var(--muted)]">
          {flAverage === null
            ? "Using section inputs only (100%)."
            : `Blending 60% section input with 40% FL average (${flAverage}).`}
        </p>
        <p className="mt-1 text-center text-xs text-[var(--muted)]">
          {Math.round(progressToTarget * 100)}% of the way from baseline to your personal target.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border bg-[var(--card-soft)] p-4">
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-sm">
            <span className="text-[var(--muted)]">Add FL score</span>
            <input
              type="number"
              min={472}
              max={528}
              value={nextFlScore}
              onChange={(event) => setNextFlScore(event.target.value)}
              className="mt-1 block w-28 rounded-xl border bg-white px-3 py-2 outline-none ring-[var(--focus-ring)] focus:ring"
            />
          </label>
          <button
            type="button"
            onClick={addFlScore}
            className="rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition hover:bg-[var(--accent-strong)]"
          >
            Save score
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {state.flScores.length ? (
            state.flScores.map((score, index) => (
              <button
                key={`${score}-${index}`}
                type="button"
                onClick={() =>
                  setState((current) => ({
                    ...current,
                    flScores: current.flScores.filter((_, i) => i !== index),
                  }))
                }
                className="rounded-full border bg-white px-3 py-1 text-sm"
              >
                FL {index + 1}: {score} ×
              </button>
            ))
          ) : (
            <p className="text-sm text-[var(--muted)]">No FL entries yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
