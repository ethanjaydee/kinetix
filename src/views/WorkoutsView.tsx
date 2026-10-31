import React, { useMemo, useState } from 'react';
import { ExerciseVectorSvg } from '../components/ExerciseVectorSvg';
import { EquipmentType, ExerciseItem, MuscleGroup, WorkoutBlock } from '../types';

interface WorkoutsViewProps {
  exercises: ExerciseItem[];
  workoutBlocks: WorkoutBlock[];
  onToggleBookmark: (exerciseId: string) => void;
  onAddExerciseToRoutine: (exercise: ExerciseItem) => void;
  onOpenWorkoutSession: () => void;
  onLoadPullDayRecommendation: () => void;
  onCreateCustomExercise: (exercise: ExerciseItem) => void;
}

const MUSCLE_TABS: MuscleGroup[] = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Legs',
  'Arms',
  'Core',
];

const EQUIPMENT_PILLS: { type: EquipmentType; icon: string }[] = [
  { type: 'Free Weights', icon: 'fitness_center' },
  { type: 'Cables', icon: 'settings_input_component' },
  { type: 'Machines', icon: 'precision_manufacturing' },
  { type: 'Bodyweight', icon: 'accessibility_new' },
];

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({
  exercises,
  workoutBlocks,
  onToggleBookmark,
  onAddExerciseToRoutine,
  onOpenWorkoutSession,
  onLoadPullDayRecommendation,
  onCreateCustomExercise,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  const [inspectExercise, setInspectExercise] = useState<ExerciseItem | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom exercise form state
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState<Exclude<MuscleGroup, 'All'>>('Back');
  const [customEquipment, setCustomEquipment] = useState<EquipmentType>('Free Weights');
  const [customSets, setCustomSets] = useState(4);
  const [customReps, setCustomReps] = useState('8-10');
  const [customRest, setCustomRest] = useState(90);
  const [customWeight, setCustomWeight] = useState(60);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      if (onlyBookmarked && !ex.bookmarked) return false;
      if (selectedMuscle !== 'All' && ex.primaryMuscle !== selectedMuscle) return false;
      if (selectedEquipment && ex.equipment !== selectedEquipment) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = ex.name.toLowerCase().includes(q);
        const matchMuscle = ex.muscleBadgeLabel.toLowerCase().includes(q);
        const matchEquip = ex.equipmentSubLabel.toLowerCase().includes(q);
        return matchName || matchMuscle || matchEquip;
      }
      return true;
    });
  }, [exercises, onlyBookmarked, selectedMuscle, selectedEquipment, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMuscle('All');
    setSelectedEquipment(null);
    setOnlyBookmarked(false);
  };

  const getBadgeClasses = (tone: ExerciseItem['muscleBadgeTone']) => {
    switch (tone) {
      case 'tertiary':
        return 'bg-tertiary/15 text-tertiary border-tertiary/30';
      case 'secondary':
        return 'bg-secondary-container/60 text-secondary-fixed border-secondary/30';
      case 'primary':
      default:
        return 'bg-primary/15 text-primary border-primary/30';
    }
  };

  const handleCreateCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const newEx: ExerciseItem = {
      id: `ex-custom-${Date.now()}`,
      name: customName.trim(),
      primaryMuscle: customMuscle,
      muscleBadgeLabel: `${customMuscle} • Custom`,
      muscleBadgeTone:
        customMuscle === 'Legs' || customMuscle === 'Core' ? 'tertiary' : 'primary',
      equipment: customEquipment,
      equipmentSubLabel: `${customEquipment} • Custom Protocol`,
      sets: Number(customSets) || 3,
      repsRange: customReps || '8-12',
      restSeconds: Number(customRest) || 90,
      defaultWeightKg: Number(customWeight) || 40,
      vectorType: 'chest-supported-row',
      bookmarked: true,
      biomechanicalNotes:
        'Custom athlete-programmed hypertrophy movement with progressive overload tracking.',
      coachingCues: [
        'Control eccentric tempo for 2.5 seconds on every repetition.',
        'Maintain rigid spinal bracing and full range of motion.',
      ],
    };
    onCreateCustomExercise(newEx);
    onAddExerciseToRoutine(newEx);
    setCustomName('');
    setShowCustomModal(false);
  };

  return (
    <div className="space-y-6 pb-14 animate-fadeIn">
      {/* SECTION 1: PAGE HEADER & SUMMARY METRICS */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-primary" />
            <span className="text-label-sm uppercase text-primary tracking-wider">
              Hypertrophy &amp; Strength
            </span>
          </div>
          <h1 className="font-display text-headline-lg-mobile sm:text-headline-lg text-on-surface">
            Exercise Library
          </h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            Biomechanical movement database &amp; hypertrophy programming
          </p>
        </div>

        {/* Quick Database Stats Pill */}
        <div className="flex items-center gap-2 self-start sm:self-end">
          <button
            onClick={() => setOnlyBookmarked((b) => !b)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-label-md transition-colors ${
              onlyBookmarked
                ? 'bg-primary/15 border-primary text-primary'
                : 'bg-surface-container-low border-outline-variant/25 text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                onlyBookmarked ? 'icon-filled text-primary' : ''
              }`}
            >
              bookmark
            </span>
            <span>Saved</span>
          </button>

          <div className="bg-surface-container-low border border-outline-variant/25 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">
              dataset
            </span>
            <span className="text-label-md text-on-surface tabular-nums">284 Moves</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: SEARCH & MULTI-TIER FILTERING */}
      <section className="space-y-3" aria-label="Filter Exercises">
        {/* Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises, target muscles, or movement patterns..."
            className="w-full h-12 pl-11 pr-10 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Primary Filter: Muscle Group Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {MUSCLE_TABS.map((muscle) => {
            const isActive = selectedMuscle === muscle;
            return (
              <button
                key={muscle}
                onClick={() => setSelectedMuscle(muscle)}
                className={`px-4 py-2 rounded-lg text-label-md whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary font-semibold shadow-sm shadow-primary/20'
                    : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/20'
                }`}
              >
                {muscle === 'All' ? 'All Muscles' : muscle}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter: Equipment Type Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5">
          <span className="text-label-sm uppercase text-outline mr-1 shrink-0">
            Equipment:
          </span>
          {EQUIPMENT_PILLS.map((eq) => {
            const isSelected = selectedEquipment === eq.type;
            return (
              <button
                key={eq.type}
                onClick={() =>
                  setSelectedEquipment((prev) => (prev === eq.type ? null : eq.type))
                }
                className={`px-3 py-1 rounded-full text-label-sm flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-primary/15 border-primary text-primary font-semibold'
                    : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{eq.icon}</span>
                {eq.type}
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: ACTIVE ROUTINE BANNER INSIGHT */}
      <section className="rounded-xl bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container border border-outline-variant/30 p-4 flex items-center justify-between gap-4 clinical-card">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[22px]">bolt</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-label-sm uppercase text-primary">
                Active Micro-Cycle Recommendation
              </span>
            </div>
            <p className="text-label-lg text-on-surface mt-0.5">
              Pull Day Focus (Back &amp; Biceps) •{' '}
              <span className="text-on-surface-variant font-normal">
                {workoutBlocks.length} movements queued in session
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedMuscle('Back');
            onLoadPullDayRecommendation();
          }}
          className="px-3.5 py-2 rounded-lg bg-surface-container-highest hover:bg-primary hover:text-on-primary text-label-md text-primary transition-colors shrink-0 cursor-pointer"
        >
          Load Today
        </button>
      </section>

      {/* SECTION 4: EXERCISE GRID */}
      {filteredExercises.length > 0 ? (
        <section
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          aria-label="Exercise Results"
        >
          {filteredExercises.map((exercise) => {
            const isAddedToToday = workoutBlocks.some(
              (b) => b.exerciseId === exercise.id || b.name === exercise.name
            );

            return (
              <article
                key={exercise.id}
                className="group rounded-xl bg-surface-container border border-outline-variant/25 hover:border-primary/40 transition-all duration-200 overflow-hidden flex flex-col justify-between clinical-card"
              >
                <div>
                  {/* Top Visual Vector Container */}
                  <div
                    onClick={() => setInspectExercise(exercise)}
                    className="h-36 bg-surface-container-lowest bg-grid-pattern relative flex items-center justify-center p-4 border-b border-outline-variant/15 cursor-pointer"
                  >
                    {/* Primary Muscle Badge */}
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-md border text-label-sm uppercase ${getBadgeClasses(
                        exercise.muscleBadgeTone
                      )}`}
                    >
                      {exercise.muscleBadgeLabel}
                    </span>

                    {/* Bookmark / Favorite Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(exercise.id);
                      }}
                      aria-label="Bookmark exercise"
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-surface-container/80 hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-colors"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          exercise.bookmarked ? 'icon-filled text-primary' : ''
                        }`}
                      >
                        bookmark
                      </span>
                    </button>

                    {/* Minimalist Biomechanical SVG Vector */}
                    <ExerciseVectorSvg vectorType={exercise.vectorType} />
                  </div>

                  {/* Card Body: Title & Equipment */}
                  <div
                    onClick={() => setInspectExercise(exercise)}
                    className="p-4 pb-3 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-display text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                        {exercise.name}
                      </h2>
                    </div>
                    <p className="text-body-sm text-outline mt-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">
                        fitness_center
                      </span>
                      {exercise.equipmentSubLabel}
                    </p>
                  </div>
                </div>

                {/* Prescribed Sets / Reps Pill Bar */}
                <div className="px-4 pb-4 pt-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 tabular-nums">
                    <div>
                      <span className="text-[10px] uppercase text-outline block leading-none">
                        Sets
                      </span>
                      <span className="text-label-md text-on-surface font-bold">
                        {exercise.sets}
                      </span>
                    </div>
                    <div className="w-px h-5 bg-outline-variant/30" />
                    <div>
                      <span className="text-[10px] uppercase text-outline block leading-none">
                        Reps
                      </span>
                      <span className="text-label-md text-on-surface font-bold">
                        {exercise.repsRange}
                      </span>
                    </div>
                    <div className="w-px h-5 bg-outline-variant/30" />
                    <div>
                      <span className="text-[10px] uppercase text-outline block leading-none">
                        Rest
                      </span>
                      <span className="text-label-md text-on-surface-variant">
                        {exercise.restSeconds}s
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddExerciseToRoutine(exercise)}
                    className={`h-9 px-3 rounded-lg text-label-md flex items-center gap-1 transition-all cursor-pointer ${
                      isAddedToToday
                        ? 'bg-primary text-on-primary font-semibold'
                        : 'bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isAddedToToday ? 'check' : 'add'}
                    </span>
                    {isAddedToToday ? 'Queued' : 'Add'}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        /* SECTION 5: EMPTY SEARCH RESULT STATE */
        <section className="rounded-xl bg-surface-container-low border border-outline-variant/20 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[24px]">search_off</span>
          </div>
          <h3 className="font-display text-headline-sm text-on-surface">
            No Matching Movements Found
          </h3>
          <p className="text-body-sm text-on-surface-variant max-w-sm mx-auto">
            Try clearing your equipment filters or searching for a broader muscle group.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-label-md text-primary transition-colors"
          >
            Reset All Filters
          </button>
        </section>
      )}

      {/* FLOATING ROUTINE BUILDER / QUICK START PILL */}
      <div className="fixed bottom-[76px] left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4 pointer-events-none">
        <div className="pointer-events-auto bg-surface-container-high/95 backdrop-blur-md border border-outline-variant/40 rounded-2xl p-2 shadow-2xl flex items-center justify-between gap-2">
          <button
            onClick={() => setShowCustomModal(true)}
            className="flex-1 h-11 px-4 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface text-label-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">
              playlist_add
            </span>
            <span>Custom Routine</span>
          </button>
          <button
            onClick={onOpenWorkoutSession}
            className="flex-1 h-11 px-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-display font-bold text-label-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:opacity-95 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] icon-filled">
              play_arrow
            </span>
            <span>Start Today&apos;s Split</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: BIOMECHANICAL MOVEMENT INSPECTOR */}
      {inspectExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface-container border border-outline-variant/40 rounded-3xl overflow-hidden shadow-2xl">
            <div className="h-44 bg-surface-container-lowest bg-grid-pattern relative flex items-center justify-center border-b border-outline-variant/20">
              <span
                className={`absolute top-4 left-4 px-2.5 py-1 rounded-md border text-label-sm uppercase ${getBadgeClasses(
                  inspectExercise.muscleBadgeTone
                )}`}
              >
                {inspectExercise.muscleBadgeLabel}
              </span>
              <button
                onClick={() => setInspectExercise(null)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
              <ExerciseVectorSvg
                vectorType={inspectExercise.vectorType}
                className="w-28 h-28"
              />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-display font-bold text-xl text-on-surface">
                  {inspectExercise.name}
                </h3>
                <p className="text-body-sm text-outline mt-0.5">
                  {inspectExercise.equipmentSubLabel}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-label-sm uppercase text-primary font-bold block mb-1">
                  Biomechanical Vector Analysis
                </span>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {inspectExercise.biomechanicalNotes}
                </p>
              </div>

              <div>
                <span className="text-label-sm uppercase text-outline block mb-2">
                  Execution &amp; Coaching Cues
                </span>
                <ul className="space-y-1.5">
                  {inspectExercise.coachingCues.map((cue, idx) => (
                    <li
                      key={idx}
                      className="text-body-sm text-on-surface flex items-start gap-2"
                    >
                      <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">
                        check_circle
                      </span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setInspectExercise(null)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-high text-label-md text-on-surface-variant"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onAddExerciseToRoutine(inspectExercise);
                    setInspectExercise(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-display font-bold text-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add to Today&apos;s Split
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CUSTOM ROUTINE / MOVEMENT BUILDER */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateCustomSubmit}
            className="w-full max-w-md bg-surface-container border border-outline-variant/40 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-on-surface">
                Program Custom Movement Block
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-label-sm uppercase text-outline mb-1">
                  Exercise Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Meadows Single-Arm Landmine Row"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-body-md focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm uppercase text-outline mb-1">
                    Target Muscle
                  </label>
                  <select
                    value={customMuscle}
                    onChange={(e) =>
                      setCustomMuscle(e.target.value as Exclude<MuscleGroup, 'All'>)
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-body-md"
                  >
                    <option value="Chest">Chest</option>
                    <option value="Back">Back</option>
                    <option value="Shoulders">Shoulders</option>
                    <option value="Legs">Legs</option>
                    <option value="Arms">Arms</option>
                    <option value="Core">Core</option>
                  </select>
                </div>

                <div>
                  <label className="block text-label-sm uppercase text-outline mb-1">
                    Modality
                  </label>
                  <select
                    value={customEquipment}
                    onChange={(e) => setCustomEquipment(e.target.value as EquipmentType)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-body-md"
                  >
                    <option value="Free Weights">Free Weights</option>
                    <option value="Cables">Cables</option>
                    <option value="Machines">Machines</option>
                    <option value="Bodyweight">Bodyweight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-label-sm uppercase text-outline mb-1">
                    Working Sets
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={customSets}
                    onChange={(e) => setCustomSets(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-display font-bold tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-label-sm uppercase text-outline mb-1">
                    Rep Target Range
                  </label>
                  <input
                    type="text"
                    value={customReps}
                    onChange={(e) => setCustomReps(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-display font-bold tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-label-sm uppercase text-outline mb-1">
                    Target Load (kg)
                  </label>
                  <input
                    type="number"
                    value={customWeight}
                    onChange={(e) => setCustomWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-display font-bold tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-label-sm uppercase text-outline mb-1">
                    Rest Interval (s)
                  </label>
                  <input
                    type="number"
                    value={customRest}
                    onChange={(e) => setCustomRest(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-display font-bold tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2.5 rounded-xl bg-surface-container-high text-label-md text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-display font-bold text-sm"
              >
                Save &amp; Queue in Split
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
