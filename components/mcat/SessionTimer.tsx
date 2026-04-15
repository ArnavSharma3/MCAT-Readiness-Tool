"use client";

import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, TIMER_BLOCKS } from "@/components/mcat/utils";

type TimerState = {
  blockIndex: number;
  secondsLeft: number;
  running: boolean;
  complete: boolean;
};

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

const INITIAL_STATE: TimerState = {
  blockIndex: 0,
  secondsLeft: TIMER_BLOCKS[0].minutes * 60,
  running: false,
  complete: false,
};

export function SessionTimer() {
  const [timer, setTimer] = useState<TimerState>(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);
  const [chimeEnabled, setChimeEnabled] = useState(false);
  const [justTransitioned, setJustTransitioned] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.timer);
    if (raw) {
      setTimer(JSON.parse(raw) as TimerState);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEYS.timer, JSON.stringify(timer));
  }, [timer, loaded]);

  useEffect(() => {
    if (!timer.running || timer.complete) return;
    const interval = window.setInterval(() => {
      setTimer((current) => {
        if (current.secondsLeft > 1) {
          return { ...current, secondsLeft: current.secondsLeft - 1 };
        }
        const nextBlockIndex = current.blockIndex + 1;
        if (nextBlockIndex >= TIMER_BLOCKS.length) {
          return { ...current, secondsLeft: 0, running: false, complete: true };
        }
        return {
          ...current,
          blockIndex: nextBlockIndex,
          secondsLeft: TIMER_BLOCKS[nextBlockIndex].minutes * 60,
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timer.running, timer.complete]);

  useEffect(() => {
    if (!timer.running || timer.blockIndex === 0 || timer.complete) return;
    setJustTransitioned(true);
    const timeout = window.setTimeout(() => setJustTransitioned(false), 900);
    if (chimeEnabled) {
      playSoftChime();
    }
    return () => window.clearTimeout(timeout);
  }, [timer.blockIndex, timer.running, timer.complete, chimeEnabled]);

  const currentBlock = TIMER_BLOCKS[timer.blockIndex];
  const elapsedBlocks = timer.blockIndex + (timer.complete ? 1 : 0);
  const progress = Math.min(100, (elapsedBlocks / TIMER_BLOCKS.length) * 100);

  const timeline = useMemo(
    () =>
      TIMER_BLOCKS.map((block, index) => ({
        ...block,
        state: index < timer.blockIndex ? "done" : index === timer.blockIndex ? "active" : "next",
      })),
    [timer.blockIndex],
  );

  return (
    <section className="rounded-3xl border bg-[var(--card)]/90 p-5 shadow-sm transition hover:shadow-md">
      <h2 className="text-xl font-semibold">Daily session timer</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">Burndown flow: focus blocks with intentional resets.</p>

      <div
        className={`mt-4 rounded-2xl border bg-[var(--card-soft)] p-4 transition ${
          justTransitioned ? "scale-[1.01] shadow-sm" : ""
        }`}
      >
        <p className="text-xs text-[var(--muted)]">
          Block {Math.min(TIMER_BLOCKS.length, timer.blockIndex + 1)} of {TIMER_BLOCKS.length}
        </p>
        <p className="mt-1 text-3xl font-semibold tracking-wide">{formatSeconds(timer.secondsLeft)}</p>
        <p className="mt-1 text-sm">
          {timer.complete ? "Sequence complete. Take a full reset." : `${currentBlock.label} (${currentBlock.minutes} min)`}
        </p>
        <div className="mt-3 h-3 rounded-full bg-white p-[2px]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: currentBlock.type === "study" ? "#bad6ee" : "#d8ecd8",
            }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <button
            type="button"
            onClick={() => setTimer((current) => ({ ...current, running: !current.running }))}
            disabled={timer.complete}
            className="rounded-xl bg-[var(--accent)] px-3 py-2 text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {timer.running ? "Pause" : "Start"}
          </button>
          <button type="button" onClick={() => setTimer(INITIAL_STATE)} className="rounded-xl border bg-white px-3 py-2">
            Reset
          </button>
          <button
            type="button"
            onClick={() => setChimeEnabled((current) => !current)}
            className="rounded-xl border bg-white px-3 py-2"
          >
            {chimeEnabled ? "Chime on" : "Chime off"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {timeline.map((block, index) => (
          <div
            key={`${block.label}-${index}`}
            className={`rounded-xl border p-2 text-sm ${
              block.state === "active"
                ? "bg-[#eff4ff]"
                : block.state === "done"
                  ? "bg-[#f4fbf4] text-[var(--muted)]"
                  : "bg-white"
            }`}
          >
            {block.label} - {block.minutes} min
          </div>
        ))}
      </div>
    </section>
  );
}

function playSoftChime() {
  if (typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = 660;
  gain.gain.value = 0.0001;
  oscillator.connect(gain);
  gain.connect(context.destination);
  const now = context.currentTime;
  gain.gain.exponentialRampToValueAtTime(0.06, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  oscillator.start(now);
  oscillator.stop(now + 0.35);
  window.setTimeout(() => {
    void context.close();
  }, 450);
}
