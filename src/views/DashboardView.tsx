import React, { useState } from 'react';
import { StreakDay, TabId, VitalsData, WorkoutBlock } from '../types';

interface DashboardViewProps {
  vitals: VitalsData;
  streakDays: StreakDay[];
  workoutBlocks: WorkoutBlock[];
  isSyncing: boolean;
  onSyncNow: () => void;
  onToggleStreakDay: (dayId: string) => void;
  onAddSteps: (delta: number) => void;
  onOpenWorkoutSession: (focusBlockId?: string) => void;
  onRemoveWorkoutBlock: (blockId: string) => void;
  onNavigateTab: (tab: TabId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  vitals,
  streakDays,
  workoutBlocks,
  isSyncing,
  onSyncNow,
  onToggleStreakDay,
  onAddSteps,
  onOpenWorkoutSession,
  onRemoveWorkoutBlock,
  onNavigateTab,
}) => {
  const [isEditingRoutine, setIsEditingRoutine] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);

  const activeStreakCount = streakDays.filter((d) => d.completed).length;
  const stepsProgressPct = Math.min(100, Math.round((vitals.steps / vitals.stepsGoal) * 100));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* SECTION 1: HERO SMART DAILY TARGET */}
      <section aria-label="Smart Daily Target">
        <div className="bg-surface-container bg-radial-glow rounded-2xl p-6 border border-outline-variant/25 relative overflow-hidden shadow-lg clinical-card">
          {/* Top Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px] icon-filled">
                bolt
              </span>
              <span className="text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">
                Smart Daily Target
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-label-sm text-primary uppercase tracking-wider tabular-nums">
                {vitals.recoveryPct}% High Recovery
              </span>
            </div>
          </div>

          {/* Main Focus Headline & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
            <div>
              <h1 className="font-display text-display-lg-mobile sm:text-display-lg text-on-surface tracking-tight mb-2">
                Back &amp; Biceps Focus
              </h1>
              <p className="text-body-md text-on-surface-variant max-w-md">
                CNS readiness is optimal. Progressive overload recommended on compound rowing movements today.
              </p>
              <p className="text-label-md text-primary mt-2 flex items-center gap-2 tabular-nums">
                <span>Hypertrophy Block</span>
                <span>•</span>
                <span>45 min</span>
                <span>•</span>
                <span>Est. 420 kcal</span>
              </p>
            </div>

            <button
              onClick={() => onOpenWorkoutSession()}
              className="w-full sm:w-auto shrink-0 bg-gradient-to-br from-primary to-primary-container hover:opacity-95 active:scale-[0.98] text-on-primary font-display font-bold text-label-lg px-6 py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-primary/15"
            >
              <span className="material-symbols-outlined text-[20px] icon-filled">play_arrow</span>
              <span>Quick Start Session</span>
            </button>
          </div>

          {/* Weekly Streak Tracker Sub-Bar */}
          <div className="pt-5 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-tertiary/15 border border-tertiary/30 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[18px] icon-filled">
                  local_fire_department
                </span>
              </div>
              <div>
                <div className="text-label-md text-on-surface font-semibold tabular-nums">
                  {activeStreakCount}-Day Active Streak
                </div>
                <div className="text-body-sm text-on-surface-variant">
                  Tap any day to toggle micro-cycle adherence
                </div>
              </div>
            </div>

            {/* 7-Day Interactive Pills */}
            <div className="flex items-center gap-2 justify-between sm:justify-end">
              {streakDays.map((day) => {
                if (day.isToday) {
                  return (
                    <button
                      key={day.id}
                      onClick={() => onToggleStreakDay(day.id)}
                      title={`${day.dateLabel}: ${day.sessionTitle}`}
                      className="flex flex-col items-center gap-1 group focus:outline-none"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center ring-2 ring-primary/40 transition-transform group-active:scale-90 ${
                          day.completed
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container-high text-primary border border-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] font-bold">
                          {day.completed ? 'check' : 'bolt'}
                        </span>
                      </div>
                      <span className="text-label-sm text-primary font-bold">{day.dayShort}</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={day.id}
                    onClick={() => onToggleStreakDay(day.id)}
                    title={`${day.dateLabel}: ${day.sessionTitle}`}
                    className="flex flex-col items-center gap-1 group focus:outline-none"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all group-active:scale-90 ${
                        day.completed
                          ? 'bg-primary/20 border border-primary text-primary'
                          : 'bg-surface-container-high border border-outline-variant/30 text-outline hover:border-outline'
                      }`}
                    >
                      {day.completed ? (
                        <span className="material-symbols-outlined text-[15px] font-bold">
                          check
                        </span>
                      ) : (
                        <span className="text-label-sm">-</span>
                      )}
                    </div>
                    <span
                      className={`text-label-sm ${
                        day.completed ? 'text-on-surface-variant' : 'text-outline'
                      }`}
                    >
                      {day.dayShort}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: VITALS & BIOMETRICS 2X2 GRID */}
      <section aria-label="Vitals and Biometrics">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-headline-sm text-on-surface">
            Vitals &amp; Biometrics
          </h2>
          <button
            onClick={onSyncNow}
            className="text-label-md text-primary hover:underline flex items-center gap-1 focus:outline-none"
          >
            <span>{isSyncing ? 'Syncing Telemetry...' : 'Sync Now'}</span>
            <span
              className={`material-symbols-outlined text-[16px] ${
                isSyncing ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Steps */}
          <div
            onClick={() => onAddSteps(500)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onAddSteps(500)}
            title="Click to log +500 active steps"
            className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20 hover:border-primary/40 transition-colors flex flex-col justify-between clinical-card cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-md uppercase tracking-wider text-on-surface-variant">
                Steps
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">footprint</span>
              </div>
            </div>

            <div className="my-1">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-metric-display text-on-surface tabular-nums">
                  {vitals.steps.toLocaleString()}
                </span>
                <span className="text-body-sm text-outline tabular-nums">
                  / {vitals.stepsGoal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-body-sm mb-1.5">
                <span className="text-on-surface-variant group-hover:text-primary transition-colors">
                  Daily Goal Progress (+500 on tap)
                </span>
                <span className="text-primary font-semibold tabular-nums">
                  {stepsProgressPct}%
                </span>
              </div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-primary-container h-full rounded-full transition-all duration-500"
                  style={{ width: `${stepsProgressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Active Burn */}
          <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20 hover:border-outline-variant/40 transition-colors flex flex-col justify-between clinical-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-md uppercase tracking-wider text-on-surface-variant">
                Active Burn
              </span>
              <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[18px] icon-filled">
                  local_fire_department
                </span>
              </div>
            </div>

            <div className="my-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-metric-display text-on-surface tabular-nums">
                  {vitals.activeBurnKcal}
                </span>
                <span className="text-label-lg text-tertiary font-semibold">kcal</span>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-2">
              <span className="text-body-sm text-on-surface-variant">
                +{vitals.activeBurnDeltaPct}% vs yesterday
              </span>
              {/* Mini 7-Bar Sparkline */}
              <div className="flex items-end gap-1.5 h-7">
                <div className="w-1.5 h-3 bg-surface-container-highest rounded-sm" title="Mon: 410 kcal" />
                <div className="w-1.5 h-4 bg-surface-container-highest rounded-sm" title="Tue: 460 kcal" />
                <div className="w-1.5 h-3.5 bg-surface-container-highest rounded-sm" title="Wed: 430 kcal" />
                <div className="w-1.5 h-5 bg-tertiary/40 rounded-sm" title="Thu: 490 kcal" />
                <div className="w-1.5 h-7 bg-tertiary rounded-sm" title={`Today: ${vitals.activeBurnKcal} kcal`} />
                <div className="w-1.5 h-2 bg-surface-container-highest/50 rounded-sm" title="Sat (Proj)" />
                <div className="w-1.5 h-2 bg-surface-container-highest/50 rounded-sm" title="Sun (Proj)" />
              </div>
            </div>
          </div>

          {/* Card 3: Heart Rate */}
          <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20 hover:border-outline-variant/40 transition-colors flex flex-col justify-between clinical-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-md uppercase tracking-wider text-on-surface-variant">
                Heart Rate
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-label-sm uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {vitals.hrZoneLabel}
              </div>
            </div>

            <div className="my-1 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-metric-display text-on-surface tabular-nums">
                  {vitals.restingHrBpm}
                </span>
                <span className="text-label-lg text-outline font-medium">bpm</span>
              </div>
              <span className="text-body-sm text-outline tabular-nums">
                HRV {vitals.hrvMs} ms
              </span>
            </div>

            {/* Clean SVG Sparkline */}
            <div className="mt-4 pt-1">
              <svg
                className="w-full h-8 overflow-visible"
                viewBox="0 0 200 32"
                fill="none"
              >
                <path
                  d="M0 20 L30 20 L40 12 L48 26 L56 6 L64 24 L72 18 L110 18 L120 10 L128 24 L136 4 L144 26 L152 16 L200 16"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="200" cy="16" r="3.5" className="fill-primary" />
              </svg>
            </div>
          </div>

          {/* Card 4: Sleep Score */}
          <div
            onClick={() => setShowSleepModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setShowSleepModal(true)}
            className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20 hover:border-primary/40 transition-colors flex flex-col justify-between clinical-card cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-md uppercase tracking-wider text-on-surface-variant">
                Sleep Score
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary-container/50 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">bedtime</span>
              </div>
            </div>

            <div className="my-1 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-metric-display text-on-surface tabular-nums">
                  {vitals.sleepScore}
                </span>
                <span className="text-body-sm text-outline tabular-nums">/100</span>
              </div>
              <span className="text-label-md text-secondary tabular-nums">
                {vitals.sleepHours}h {vitals.sleepMinutes}m
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-body-sm text-on-surface-variant mb-1.5">
                <span>Deep 1h 54m</span>
                <span className="text-primary">REM 1h 48m</span>
              </div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden flex gap-0.5">
                <div className="bg-primary h-full w-[30%] rounded-l-full" />
                <div className="bg-secondary h-full w-[45%]" />
                <div className="bg-primary-container/60 h-full w-[25%] rounded-r-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TODAY'S WORKOUT BLOCKS */}
      <section aria-label="Today's Workout Blocks">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-headline-sm text-on-surface">
              Today&apos;s Workout Blocks
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-label-sm tabular-nums">
              {workoutBlocks.length} Movements
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('workouts')}
              className="text-label-md text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Exercise</span>
            </button>
            <button
              onClick={() => setIsEditingRoutine((prev) => !prev)}
              className="text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {isEditingRoutine ? 'Done' : 'Edit Routine'}
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {workoutBlocks.map((block, index) => {
            const completedSetsCount = block.sets.filter((s) => s.completed).length;
            return (
              <div
                key={block.id}
                onClick={() => !isEditingRoutine && onOpenWorkoutSession(block.id)}
                className="group bg-surface-container-low hover:bg-surface-container rounded-xl p-4 border border-outline-variant/20 hover:border-primary/30 transition-all flex items-center justify-between gap-4 cursor-pointer clinical-card"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center font-display font-bold text-sm text-primary shrink-0 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-base text-on-surface truncate group-hover:text-primary transition-colors">
                        {block.name}
                      </h3>
                      {completedSetsCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-label-sm tabular-nums">
                          {completedSetsCount}/{block.sets.length} logged
                        </span>
                      )}
                    </div>
                    <p className="text-body-sm text-on-surface-variant truncate">
                      {block.targetDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-label-sm uppercase text-outline">Target Load</div>
                    <div className="text-label-lg text-on-surface tabular-nums">
                      {block.targetWeightKg > 0
                        ? `${block.targetWeightKg} ${block.unit}`
                        : 'Bodyweight'}
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/25 text-right">
                    <div className="text-label-md text-on-surface font-semibold tabular-nums">
                      {block.sets.length} × {block.repsRange}
                    </div>
                    <div className="text-label-sm text-outline tabular-nums">
                      Rest {block.restSeconds}s
                    </div>
                  </div>

                  {isEditingRoutine ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveWorkoutBlock(block.id);
                      }}
                      className="w-8 h-8 rounded-lg bg-error-container/30 text-error hover:bg-error-container/50 flex items-center justify-center transition-colors"
                      title="Remove block from today's routine"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  ) : (
                    <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                      chevron_right
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sleep Telemetry Modal */}
      {showSleepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-surface-container border border-outline-variant/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">bedtime</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-on-surface">
                    Nocturnal Recovery Architecture
                  </h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Oura Ring Gen 4 • Optical + Temperature Telemetry
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSleepModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <p className="text-label-sm uppercase text-outline">Sleep Score</p>
                <p className="font-display font-bold text-2xl text-primary tabular-nums mt-1">
                  {vitals.sleepScore}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <p className="text-label-sm uppercase text-outline">Total Asleep</p>
                <p className="font-display font-bold text-2xl text-on-surface tabular-nums mt-1">
                  {vitals.sleepHours}h {vitals.sleepMinutes}m
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <p className="text-label-sm uppercase text-outline">Mean HRV</p>
                <p className="font-display font-bold text-2xl text-emerald-400 tabular-nums mt-1">
                  {vitals.hrvMs} ms
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-body-sm mb-1">
                  <span className="text-on-surface font-medium">Deep Slow-Wave Sleep (SWS)</span>
                  <span className="text-primary font-semibold tabular-nums">1h 54m (30%)</span>
                </div>
                <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[30%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-body-sm mb-1">
                  <span className="text-on-surface font-medium">REM Sleep (Cognitive)</span>
                  <span className="text-primary-container font-semibold tabular-nums">
                    1h 48m (25%)
                  </span>
                </div>
                <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container w-[25%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-body-sm mb-1">
                  <span className="text-on-surface font-medium">Light Sleep (NREM 1-2)</span>
                  <span className="text-secondary font-semibold tabular-nums">4h 00m (45%)</span>
                </div>
                <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[45%] rounded-full" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSleepModal(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-display font-bold text-sm"
            >
              Close Telemetry Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
