import React, { useEffect, useState } from 'react';
import { WorkoutBlock } from '../types';

interface WorkoutSessionModalProps {
  isOpen: boolean;
  initialFocusBlockId?: string | null;
  workoutBlocks: WorkoutBlock[];
  onUpdateBlocks: (blocks: WorkoutBlock[]) => void;
  onFinishSession: (caloriesBurned: number, totalVolumeKg: number) => void;
  onClose: () => void;
}

export const WorkoutSessionModal: React.FC<WorkoutSessionModalProps> = ({
  isOpen,
  initialFocusBlockId,
  workoutBlocks,
  onUpdateBlocks,
  onFinishSession,
  onClose,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(1420); // 23:40 into pull session
  const [isPaused, setIsPaused] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<string>(
    initialFocusBlockId || workoutBlocks[0]?.id || ''
  );

  useEffect(() => {
    if (initialFocusBlockId) {
      setActiveBlockId(initialFocusBlockId);
    } else if (workoutBlocks[0] && !activeBlockId) {
      setActiveBlockId(workoutBlocks[0].id);
    }
  }, [initialFocusBlockId, workoutBlocks, activeBlockId]);

  useEffect(() => {
    if (!isOpen || isPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      setRestSecondsLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isPaused]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const handleToggleSet = (blockId: string, setNumber: number, restDuration: number) => {
    const updated = workoutBlocks.map((block) => {
      if (block.id !== blockId) return block;
      const nextSets = block.sets.map((s) => {
        if (s.setNumber !== setNumber) return s;
        const nextCompleted = !s.completed;
        if (nextCompleted) {
          setRestSecondsLeft(restDuration);
        }
        return { ...s, completed: nextCompleted };
      });
      return { ...block, sets: nextSets };
    });
    onUpdateBlocks(updated);
  };

  const handleChangeSetField = (
    blockId: string,
    setNumber: number,
    field: 'weightKg' | 'reps',
    value: number
  ) => {
    const updated = workoutBlocks.map((block) => {
      if (block.id !== blockId) return block;
      const nextSets = block.sets.map((s) =>
        s.setNumber === setNumber ? { ...s, [field]: Math.max(0, value) } : s
      );
      return {
        ...block,
        targetWeightKg:
          field === 'weightKg' && setNumber === 1 ? Math.max(0, value) : block.targetWeightKg,
        sets: nextSets,
      };
    });
    onUpdateBlocks(updated);
  };

  const handleAddSet = (blockId: string) => {
    const updated = workoutBlocks.map((block) => {
      if (block.id !== blockId) return block;
      const lastSet = block.sets[block.sets.length - 1] || {
        setNumber: 0,
        weightKg: block.targetWeightKg,
        reps: 10,
        completed: false,
      };
      const nextSet = {
        setNumber: lastSet.setNumber + 1,
        weightKg: lastSet.weightKg,
        reps: lastSet.reps,
        completed: false,
      };
      return {
        ...block,
        setsCount: block.sets.length + 1,
        sets: [...block.sets, nextSet],
      };
    });
    onUpdateBlocks(updated);
  };

  const totalSets = workoutBlocks.reduce((acc, b) => acc + b.sets.length, 0);
  const completedSets = workoutBlocks.reduce(
    (acc, b) => acc + b.sets.filter((s) => s.completed).length,
    0
  );
  const totalVolumeKg = workoutBlocks.reduce(
    (acc, b) =>
      acc +
      b.sets
        .filter((s) => s.completed)
        .reduce((sAcc, s) => sAcc + (s.weightKg || 25) * s.reps, 0),
    0
  );
  const estimatedKcal = Math.max(120, Math.round(completedSets * 28));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-2xl bg-surface-container border border-outline-variant/40 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Session Header */}
        <div className="px-5 py-4 bg-surface-container-high border-b border-outline-variant/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined icon-filled">bolt</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-label-sm uppercase tracking-wider text-primary font-bold">
                  Live Telemetry Session
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface">
                Back &amp; Biceps Hypertrophy Split
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center gap-1.5 text-on-surface font-display font-bold tabular-nums text-sm hover:border-primary/40 transition-colors"
              title={isPaused ? 'Resume Timer' : 'Pause Timer'}
            >
              <span className="material-symbols-outlined text-[16px] text-primary">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
              {formatTime(elapsedSeconds)}
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant"
              aria-label="Close Live Session"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Rest Timer Banner (when active) */}
        {restSecondsLeft !== null && (
          <div className="px-5 py-2.5 bg-primary/15 border-b border-primary/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
              <span className="text-label-md font-semibold text-on-surface">
                ATP-PCr Recovery Rest:{' '}
                <strong className="font-display text-primary tabular-nums">
                  {formatTime(restSecondsLeft)}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setRestSecondsLeft((r) => (r ? Math.max(0, r - 15) : null))}
                className="px-2 py-0.5 rounded bg-surface-container text-label-sm text-on-surface-variant hover:text-on-surface"
              >
                -15s
              </button>
              <button
                onClick={() => setRestSecondsLeft((r) => (r ? r + 15 : 15))}
                className="px-2 py-0.5 rounded bg-surface-container text-label-sm text-on-surface-variant hover:text-on-surface"
              >
                +15s
              </button>
              <button
                onClick={() => setRestSecondsLeft(null)}
                className="px-2.5 py-0.5 rounded bg-primary text-on-primary text-label-sm font-bold"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Session Summary Strip */}
        <div className="grid grid-cols-3 divide-x divide-outline-variant/20 bg-surface-container-low border-b border-outline-variant/20 py-2.5 px-4 text-center">
          <div>
            <p className="text-label-sm uppercase text-outline">Completed Sets</p>
            <p className="font-display font-bold text-sm text-on-surface tabular-nums">
              {completedSets} / {totalSets}
            </p>
          </div>
          <div>
            <p className="text-label-sm uppercase text-outline">Session Volume</p>
            <p className="font-display font-bold text-sm text-primary tabular-nums">
              {totalVolumeKg.toLocaleString()} kg
            </p>
          </div>
          <div>
            <p className="text-label-sm uppercase text-outline">Est. Metabolic Output</p>
            <p className="font-display font-bold text-sm text-tertiary tabular-nums">
              +{estimatedKcal} kcal
            </p>
          </div>
        </div>

        {/* Scrollable Blocks */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {workoutBlocks.map((block) => {
            const isExpanded = activeBlockId === block.id;
            const blockDoneCount = block.sets.filter((s) => s.completed).length;

            return (
              <div
                key={block.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? 'bg-surface-container-low border-primary/40 shadow-md'
                    : 'bg-surface-container-low/60 border-outline-variant/25'
                }`}
              >
                <button
                  onClick={() => setActiveBlockId(isExpanded ? '' : block.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center font-display font-bold text-sm text-primary tabular-nums">
                      {block.blockNumber}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-base text-on-surface">
                        {block.name}
                      </h4>
                      <p className="text-body-sm text-on-surface-variant">
                        {block.targetDescription} • Rest {block.restSeconds}s
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-label-sm font-bold tabular-nums ${
                        blockDoneCount === block.sets.length
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {blockDoneCount}/{block.sets.length} Sets
                    </span>
                    <span className="material-symbols-outlined text-outline">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-outline-variant/15 space-y-2">
                    <div className="grid grid-cols-12 gap-2 text-label-sm uppercase text-outline px-2 py-1">
                      <span className="col-span-2">Set</span>
                      <span className="col-span-4">Load ({block.unit})</span>
                      <span className="col-span-3">Reps</span>
                      <span className="col-span-3 text-right">Log</span>
                    </div>

                    {block.sets.map((setItem) => (
                      <div
                        key={setItem.setNumber}
                        className={`grid grid-cols-12 gap-2 items-center px-2.5 py-2 rounded-xl border transition-colors ${
                          setItem.completed
                            ? 'bg-primary/10 border-primary/30'
                            : 'bg-surface-container border-outline-variant/20'
                        }`}
                      >
                        <div className="col-span-2 font-display font-bold text-sm text-on-surface-variant tabular-nums">
                          #{setItem.setNumber}
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={setItem.weightKg}
                            onChange={(e) =>
                              handleChangeSetField(
                                block.id,
                                setItem.setNumber,
                                'weightKg',
                                Number(e.target.value)
                              )
                            }
                            aria-label={`Set ${setItem.setNumber} Weight`}
                            className="w-20 px-2.5 py-1 rounded-lg bg-surface-container-high border border-outline-variant/30 font-display font-bold text-sm text-on-surface tabular-nums focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={setItem.reps}
                            onChange={(e) =>
                              handleChangeSetField(
                                block.id,
                                setItem.setNumber,
                                'reps',
                                Number(e.target.value)
                              )
                            }
                            aria-label={`Set ${setItem.setNumber} Reps`}
                            className="w-16 px-2.5 py-1 rounded-lg bg-surface-container-high border border-outline-variant/30 font-display font-bold text-sm text-on-surface tabular-nums focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="col-span-3 flex justify-end">
                          <button
                            onClick={() =>
                              handleToggleSet(block.id, setItem.setNumber, block.restSeconds)
                            }
                            className={`h-8 px-3 rounded-lg flex items-center gap-1 text-label-sm font-bold transition-all ${
                              setItem.completed
                                ? 'bg-primary text-on-primary shadow-sm'
                                : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {setItem.completed ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            {setItem.completed ? 'Done' : 'Log'}
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => handleAddSet(block.id)}
                      className="w-full py-2 mt-1 rounded-xl border border-dashed border-outline-variant/40 hover:border-primary/50 text-label-md text-on-surface-variant hover:text-primary flex items-center justify-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      Add Progressive Set
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-container-high border-t border-outline-variant/25 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-highest text-label-lg text-on-surface-variant transition-colors"
          >
            Minimize Session
          </button>
          <button
            onClick={() => onFinishSession(estimatedKcal, totalVolumeKg)}
            className="flex-1 py-2.5 px-5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-display font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] icon-filled">task_alt</span>
            Complete Session (+{estimatedKcal} kcal)
          </button>
        </div>
      </div>
    </div>
  );
};
