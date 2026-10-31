import React, { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { WorkoutSessionModal } from './components/WorkoutSessionModal';
import {
  INITIAL_BODY_COMP_SCANS,
  INITIAL_EXERCISES,
  INITIAL_LATEST_DETECTION,
  INITIAL_MACRO_TARGETS,
  INITIAL_MEALS,
  INITIAL_STREAK_DAYS,
  INITIAL_VITALS,
  INITIAL_WORKOUT_BLOCKS,
} from './data/initialData';
import {
  BodyCompScan,
  ExerciseItem,
  MealItem,
  StreakDay,
  TabId,
  ThemeMode,
  VitalsData,
  WorkoutBlock,
} from './types';
import { BodyCompView } from './views/BodyCompView';
import { DashboardView } from './views/DashboardView';
import { NutritionView } from './views/NutritionView';
import { WorkoutsView } from './views/WorkoutsView';

const STORAGE_KEY_PREFIX = 'kinetix_hub_v1_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>(() =>
    loadFromStorage<TabId>('activeTab', 'dashboard')
  );
  const [theme, setTheme] = useState<ThemeMode>(() =>
    loadFromStorage<ThemeMode>('theme', 'dark')
  );

  // Domain State
  const [vitals, setVitals] = useState<VitalsData>(() =>
    loadFromStorage('vitals', INITIAL_VITALS)
  );
  const [streakDays, setStreakDays] = useState<StreakDay[]>(() =>
    loadFromStorage('streakDays', INITIAL_STREAK_DAYS)
  );
  const [workoutBlocks, setWorkoutBlocks] = useState<WorkoutBlock[]>(() =>
    loadFromStorage('workoutBlocks', INITIAL_WORKOUT_BLOCKS)
  );
  const [latestDetection, setLatestDetection] = useState<MealItem>(() =>
    loadFromStorage('latestDetection', INITIAL_LATEST_DETECTION)
  );
  const [meals, setMeals] = useState<MealItem[]>(() =>
    loadFromStorage('meals', INITIAL_MEALS)
  );
  const [scans, setScans] = useState<BodyCompScan[]>(() =>
    loadFromStorage('scans', INITIAL_BODY_COMP_SCANS)
  );
  const [exercises, setExercises] = useState<ExerciseItem[]>(() =>
    loadFromStorage('exercises', INITIAL_EXERCISES)
  );

  // Transient UI state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedText, setLastSyncedText] = useState('Synced 2m ago');
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [focusBlockId, setFocusBlockId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme class with <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_PREFIX + 'theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'activeTab', JSON.stringify(activeTab));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'vitals', JSON.stringify(vitals));
  }, [vitals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'streakDays', JSON.stringify(streakDays));
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_PREFIX + 'workoutBlocks',
      JSON.stringify(workoutBlocks)
    );
  }, [workoutBlocks]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_PREFIX + 'latestDetection',
      JSON.stringify(latestDetection)
    );
  }, [latestDetection]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'scans', JSON.stringify(scans));
  }, [scans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'exercises', JSON.stringify(exercises));
  }, [exercises]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2600);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(
        next === 'dark'
          ? 'Design System: Kinetic Minimal (Dark)'
          : 'Design System: Kinetix Clinical Performance (Light)'
      );
      return next;
    });
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setVitals((prev) => ({
        ...prev,
        steps: Math.min(prev.stepsGoal, prev.steps + 140),
        restingHrBpm: 62 + Math.floor(Math.random() * 4),
      }));
      setIsSyncing(false);
      setLastSyncedText('Synced just now');
      showToast('Biometric & DEXA telemetry synchronized');
    }, 700);
  };

  const handleToggleStreakDay = (dayId: string) => {
    setStreakDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, completed: !d.completed } : d))
    );
  };

  const handleAddSteps = (delta: number) => {
    setVitals((prev) => ({
      ...prev,
      steps: prev.steps + delta,
      activeBurnKcal: prev.activeBurnKcal + Math.round(delta * 0.04),
    }));
    showToast(`Logged +${delta} steps (+${Math.round(delta * 0.04)} kcal active burn)`);
  };

  const handleOpenWorkoutSession = (blockId?: string) => {
    setFocusBlockId(blockId || null);
    setIsWorkoutModalOpen(true);
  };

  const handleRemoveWorkoutBlock = (blockId: string) => {
    setWorkoutBlocks((prev) =>
      prev
        .filter((b) => b.id !== blockId)
        .map((b, i) => ({ ...b, blockNumber: String(i + 1).padStart(2, '0') }))
    );
    showToast('Removed movement block from routine');
  };

  const handleFinishWorkoutSession = (caloriesBurned: number, totalVolumeKg: number) => {
    setVitals((prev) => ({
      ...prev,
      activeBurnKcal: prev.activeBurnKcal + caloriesBurned,
      activeBurnDeltaPct: prev.activeBurnDeltaPct + 6,
    }));
    setStreakDays((prev) =>
      prev.map((d) => (d.isToday ? { ...d, completed: true } : d))
    );
    setIsWorkoutModalOpen(false);
    showToast(
      `Session Complete! +${caloriesBurned} kcal & ${totalVolumeKg.toLocaleString()} kg logged`
    );
  };

  const handleLogScannedMeal = (meal: MealItem) => {
    if (meal.isAiVerified) {
      setLatestDetection(meal);
    }
    setMeals((prev) => [meal, ...prev]);
    showToast(`Logged "${meal.title}" (${meal.calories} kcal, ${meal.protein}g PRO)`);
  };

  const handleUpdateDetectionPortions = (updated: MealItem) => {
    setLatestDetection(updated);
    setMeals((prev) =>
      prev.map((m) =>
        m.id === updated.id || m.title.includes('Fitness Meal Bowl')
          ? {
              ...m,
              calories: updated.calories,
              protein: updated.protein,
              carbs: updated.carbs,
              fats: updated.fats,
              fiber: updated.fiber,
            }
          : m
      )
    );
    showToast(`Portions calibrated: ${updated.calories} kcal (${updated.protein}g PRO)`);
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
    showToast('Removed meal from Daily Fuel Allocation');
  };

  const handleAddManualScan = (newScan: BodyCompScan) => {
    setScans((prev) => [newScan, ...prev]);
    setLastSyncedText('Logged just now');
    showToast(
      `Logged Body Comp: ${newScan.weightKg.toFixed(1)} kg • ${newScan.bodyFatPct.toFixed(
        1
      )}% BF`
    );
  };

  const handleToggleBookmark = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId ? { ...ex, bookmarked: !ex.bookmarked } : ex
      )
    );
  };

  const handleAddExerciseToRoutine = (exercise: ExerciseItem) => {
    const alreadyExists = workoutBlocks.some(
      (b) => b.exerciseId === exercise.id || b.name === exercise.name
    );
    if (alreadyExists) {
      showToast(`"${exercise.name}" is already queued in Today's Routine`);
      return;
    }

    const defaultReps = parseInt(exercise.repsRange.split('-')[0] || '10', 10) || 10;
    const newBlock: WorkoutBlock = {
      id: `wb-${Date.now()}`,
      exerciseId: exercise.id,
      blockNumber: String(workoutBlocks.length + 1).padStart(2, '0'),
      name: exercise.name,
      targetDescription: `${exercise.muscleBadgeLabel} • ${exercise.equipment}`,
      targetWeightKg: exercise.defaultWeightKg,
      unit: exercise.defaultWeightKg > 0 ? 'kg' : 'BW',
      setsCount: exercise.sets,
      repsRange: exercise.repsRange,
      restSeconds: exercise.restSeconds,
      sets: Array.from({ length: exercise.sets }, (_, i) => ({
        setNumber: i + 1,
        weightKg: exercise.defaultWeightKg,
        reps: defaultReps,
        completed: false,
      })),
    };

    setWorkoutBlocks((prev) => [...prev, newBlock]);
    showToast(`Added "${exercise.name}" to Today's Routine`);
  };

  const handleCreateCustomExercise = (customEx: ExerciseItem) => {
    setExercises((prev) => [customEx, ...prev]);
  };

  const handleResetDemoData = () => {
    setVitals(INITIAL_VITALS);
    setStreakDays(INITIAL_STREAK_DAYS);
    setWorkoutBlocks(INITIAL_WORKOUT_BLOCKS);
    setLatestDetection(INITIAL_LATEST_DETECTION);
    setMeals(INITIAL_MEALS);
    setScans(INITIAL_BODY_COMP_SCANS);
    setExercises(INITIAL_EXERCISES);
    showToast('Restored default KINETIX physiological telemetry');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col pb-28 transition-colors duration-200">
      <Header
        activeTab={activeTab}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onSelectTab={setActiveTab}
        onResetDemoData={handleResetDemoData}
        lastSyncedText={lastSyncedText}
        onTriggerSync={handleSyncNow}
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            vitals={vitals}
            streakDays={streakDays}
            workoutBlocks={workoutBlocks}
            isSyncing={isSyncing}
            onSyncNow={handleSyncNow}
            onToggleStreakDay={handleToggleStreakDay}
            onAddSteps={handleAddSteps}
            onOpenWorkoutSession={handleOpenWorkoutSession}
            onRemoveWorkoutBlock={handleRemoveWorkoutBlock}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionView
            latestDetection={latestDetection}
            meals={meals}
            targets={INITIAL_MACRO_TARGETS}
            onLogScannedMeal={handleLogScannedMeal}
            onUpdateDetectionPortions={handleUpdateDetectionPortions}
            onDeleteMeal={handleDeleteMeal}
          />
        )}

        {activeTab === 'body-comp' && (
          <BodyCompView
            scans={scans}
            onAddManualScan={handleAddManualScan}
            onForceSyncScale={handleSyncNow}
            isSyncingScale={isSyncing}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutsView
            exercises={exercises}
            workoutBlocks={workoutBlocks}
            onToggleBookmark={handleToggleBookmark}
            onAddExerciseToRoutine={handleAddExerciseToRoutine}
            onOpenWorkoutSession={() => handleOpenWorkoutSession()}
            onLoadPullDayRecommendation={() =>
              showToast('Filtered to Pull Day (Back & Hypertrophy) recommendations')
            }
            onCreateCustomExercise={handleCreateCustomExercise}
          />
        )}
      </main>

      {/* Interactive Live Workout Session Modal */}
      <WorkoutSessionModal
        isOpen={isWorkoutModalOpen}
        initialFocusBlockId={focusBlockId}
        workoutBlocks={workoutBlocks}
        onUpdateBlocks={setWorkoutBlocks}
        onFinishSession={handleFinishWorkoutSession}
        onClose={() => setIsWorkoutModalOpen(false)}
      />

      {/* Feedback Toast Notification matching Stitch UI */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
          <div className="bg-surface-bright text-white px-4 py-2.5 rounded-xl shadow-xl border border-outline-variant/30 flex items-center gap-2 text-label-md">
            <span className="material-symbols-outlined text-primary text-[18px] icon-filled">
              check_circle
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
};
