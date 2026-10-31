import React, { useState } from 'react';
import { AI_SCAN_PRESETS, MACRO_SNAP_BOWL_URL } from '../data/initialData';
import { MacroTargets, MealItem } from '../types';

interface NutritionViewProps {
  latestDetection: MealItem;
  meals: MealItem[];
  targets: MacroTargets;
  onLogScannedMeal: (meal: MealItem) => void;
  onUpdateDetectionPortions: (updated: MealItem) => void;
  onDeleteMeal: (mealId: string) => void;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  latestDetection,
  meals,
  targets,
  onLogScannedMeal,
  onUpdateDetectionPortions,
  onDeleteMeal,
}) => {
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [isScanningAnimation, setIsScanningAnimation] = useState(false);
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);

  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState<MealItem['category']>('Afternoon Snack');
  const [quickCalories, setQuickCalories] = useState(260);
  const [quickProtein, setQuickProtein] = useState(28);
  const [quickCarbs, setQuickCarbs] = useState(22);
  const [quickFats, setQuickFats] = useState(6);

  const [showEditPortionModal, setShowEditPortionModal] = useState(false);
  const [portionMultiplier, setPortionMultiplier] = useState(1);

  // Totals computed dynamically from logged meals
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFats = meals.reduce((sum, m) => sum + m.fats, 0);

  const remainingCalories = Math.max(0, targets.calories - totalCalories);
  const caloriePct = Math.min(100, Math.round((totalCalories / targets.calories) * 100));
  const proteinPct = Math.min(100, Math.round((totalProtein / targets.protein) * 100));
  const carbsPct = Math.min(100, Math.round((totalCarbs / targets.carbs) * 100));
  const fatsPct = Math.min(100, Math.round((totalFats / targets.fats) * 100));

  const handleRunNeuralScan = (preset: MealItem) => {
    setIsScanningAnimation(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMeal: MealItem = {
        ...preset,
        id: `meal-snap-${Date.now()}`,
        time: timeStr,
      };
      onLogScannedMeal(newMeal);
      setIsScanningAnimation(false);
      setShowScannerModal(false);
    }, 900);
  };

  const handleSaveQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMeal: MealItem = {
      id: `meal-custom-${Date.now()}`,
      title: quickTitle.trim(),
      category: quickCategory,
      time: timeStr,
      calories: Number(quickCalories) || 0,
      protein: Number(quickProtein) || 0,
      carbs: Number(quickCarbs) || 0,
      fats: Number(quickFats) || 0,
      fiber: 4,
      icon: 'nutrition',
      isAiVerified: false,
    };
    onLogScannedMeal(newMeal);
    setQuickTitle('');
    setShowQuickAddModal(false);
  };

  const handleApplyPortionMultiplier = () => {
    const updated: MealItem = {
      ...latestDetection,
      calories: Math.round(520 * portionMultiplier),
      protein: Math.round(46 * portionMultiplier),
      carbs: Math.round(48 * portionMultiplier),
      fats: Math.round(14 * portionMultiplier),
      fiber: Math.round(8 * portionMultiplier),
    };
    onUpdateDetectionPortions(updated);
    setShowEditPortionModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* SECTION 1: MACRO SNAP AI CALLOUT HERO CARD */}
      <section aria-label="Macro Snap AI Scanner">
        <div className="relative rounded-2xl bg-surface-container border border-outline-variant/30 p-5 sm:p-6 overflow-hidden shadow-lg clinical-card">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-label-sm uppercase text-primary tracking-wider">
                  Neural Lens v2.4 Active
                </span>
              </div>
              <h1 className="font-display text-headline-lg-mobile sm:text-headline-lg text-on-surface">
                Macro Snap
              </h1>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Instant volumetric food recognition. Point your camera at any plate to extract precise caloric density and amino-acid profiles.
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowScannerModal(true)}
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-display font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                  <span>Scan Meal with Camera</span>
                </button>
                <button
                  onClick={() => setShowScannerModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-label-lg border border-outline-variant/30 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                    upload_file
                  </span>
                  <span>Upload</span>
                </button>
              </div>
            </div>

            {/* Visual Scanner Reticle Preview */}
            <div
              onClick={() => setShowScannerModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setShowScannerModal(true)}
              title="Click to launch interactive Neural Lens Scanner"
              className="relative w-full sm:w-44 h-40 sm:h-44 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center overflow-hidden shrink-0 group cursor-pointer"
            >
              <img
                src={latestDetection.imageUrl || MACRO_SNAP_BOWL_URL}
                alt="Recent Scanned Plate"
                className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-surface-container-lowest/60" />

              {/* Reticle Corner Brackets */}
              <div className="absolute inset-3 pointer-events-none">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-sm" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-sm" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-sm" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-sm" />
                {/* Animated Laser Line */}
                <div className="scanner-line absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_8px_#38bdf8]" />
              </div>

              {/* Floating Live Tag Pills */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest/90 backdrop-blur-md border border-primary/40 text-primary text-label-sm font-bold tabular-nums shadow-md">
                  {latestDetection.protein}g PRO
                </span>
                <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest/90 backdrop-blur-md border border-tertiary/40 text-tertiary text-label-sm font-bold tabular-nums shadow-md">
                  {latestDetection.calories} KCAL
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: LATEST AI DETECTION SHOWCASE CARD */}
      <section aria-label="Latest AI Detection Result" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">
              auto_awesome
            </span>
            <h2 className="font-display text-headline-sm text-on-surface">
              Latest Detection
            </h2>
          </div>
          <span className="text-label-md text-outline tabular-nums">
            Scanned {latestDetection.time} • {latestDetection.category}
          </span>
        </div>

        <div className="rounded-2xl bg-surface-container-low border border-outline-variant/25 overflow-hidden clinical-card">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Image & Bounding Box Overlay */}
            <div className="md:col-span-5 relative min-h-[220px] bg-surface-container-lowest overflow-hidden">
              <img
                src={latestDetection.imageUrl || MACRO_SNAP_BOWL_URL}
                alt={latestDetection.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

              {/* Confidence Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[14px] icon-filled">
                  verified
                </span>
                <span className="text-label-sm text-white tabular-nums">
                  {latestDetection.confidence || 98}% Confidence
                </span>
              </div>

              {/* AI Bounding Box Annotations */}
              {(latestDetection.boundingBoxes || []).map((box, i) => (
                <div
                  key={i}
                  style={{
                    top: `${box.topPct}%`,
                    left: `${box.leftPct}%`,
                    width: `${box.widthPct}%`,
                    height: `${box.heightPct}%`,
                  }}
                  className={`absolute border border-dashed rounded-lg pointer-events-none ${
                    box.tone === 'primary'
                      ? 'border-primary/80 bg-primary/10'
                      : 'border-tertiary/80 bg-tertiary/10'
                  }`}
                >
                  <span
                    className={`absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow ${
                      box.tone === 'primary'
                        ? 'bg-primary text-on-primary'
                        : 'bg-tertiary text-on-tertiary'
                    }`}
                  >
                    {box.label} • {box.weightGrams}
                  </span>
                </div>
              ))}
            </div>

            {/* Extracted Nutritional Data */}
            <div className="md:col-span-7 p-5 flex flex-col justify-between space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-label-sm uppercase text-primary tracking-wider">
                    AI Verified
                  </span>
                  <h3 className="font-display text-headline-md text-on-surface mt-0.5">
                    {latestDetection.title}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display text-3xl font-bold text-on-surface tabular-nums leading-none">
                    {latestDetection.calories}
                  </div>
                  <span className="text-label-sm uppercase text-outline tracking-wider">
                    kcal total
                  </span>
                </div>
              </div>

              {/* 4-Column Macro Breakdown */}
              <div className="grid grid-cols-4 gap-2.5 pt-2 border-t border-outline-variant/20">
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-label-sm uppercase text-on-surface-variant">
                      Protein
                    </span>
                  </div>
                  <div className="font-display text-xl font-bold text-on-surface tabular-nums">
                    {latestDetection.protein}
                    <span className="text-xs font-normal text-outline ml-0.5">g</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-tertiary" />
                    <span className="text-label-sm uppercase text-on-surface-variant">
                      Carbs
                    </span>
                  </div>
                  <div className="font-display text-xl font-bold text-on-surface tabular-nums">
                    {latestDetection.carbs}
                    <span className="text-xs font-normal text-outline ml-0.5">g</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="text-label-sm uppercase text-on-surface-variant">
                      Fats
                    </span>
                  </div>
                  <div className="font-display text-xl font-bold text-on-surface tabular-nums">
                    {latestDetection.fats}
                    <span className="text-xs font-normal text-outline ml-0.5">g</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-label-sm uppercase text-on-surface-variant">
                      Fiber
                    </span>
                  </div>
                  <div className="font-display text-xl font-bold text-on-surface tabular-nums">
                    {latestDetection.fiber}
                    <span className="text-xs font-normal text-outline ml-0.5">g</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  onClick={() => setShowEditPortionModal(true)}
                  className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Edit Portions</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-label-md border border-primary/25">
                    <span className="material-symbols-outlined text-[16px] icon-filled">
                      check_circle
                    </span>
                    <span>Logged to Today</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DAILY FUEL ALLOCATION */}
      <section aria-label="Daily Macro Goals Progress">
        <div className="rounded-2xl bg-surface-container-low border border-outline-variant/25 p-5 sm:p-6 space-y-6 clinical-card">
          {/* Top Energy Summary */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-outline-variant/20">
            <div>
              <span className="text-label-sm uppercase text-outline tracking-wider">
                Daily Fuel Allocation
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-metric-display text-on-surface tabular-nums">
                  {totalCalories.toLocaleString()}
                </span>
                <span className="font-display text-lg text-outline tabular-nums">
                  / {targets.calories.toLocaleString()} kcal
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-3.5 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-right">
                <div className="text-label-sm uppercase text-outline">Remaining</div>
                <div className="font-display text-lg font-bold text-primary tabular-nums">
                  {remainingCalories.toLocaleString()} kcal
                </div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-right">
                <div className="text-label-sm uppercase text-outline">Target Hit</div>
                <div className="font-display text-lg font-bold text-on-surface tabular-nums">
                  {caloriePct}%
                </div>
              </div>
            </div>
          </div>

          {/* 3-Column Macro Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Protein */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-label-md text-on-surface font-semibold">Protein</span>
                <span className="text-label-md text-on-surface-variant tabular-nums">
                  <strong className="text-on-surface">{totalProtein}g</strong> / {targets.protein}g
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${proteinPct}%` }}
                />
              </div>
              <div className="flex justify-between text-body-sm text-outline tabular-nums">
                <span>Anabolic target</span>
                <span>{Math.max(0, targets.protein - totalProtein)}g left</span>
              </div>
            </div>

            {/* Carbohydrates */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-label-md text-on-surface font-semibold">
                  Carbohydrates
                </span>
                <span className="text-label-md text-on-surface-variant tabular-nums">
                  <strong className="text-on-surface">{totalCarbs}g</strong> / {targets.carbs}g
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-tertiary rounded-full transition-all duration-500"
                  style={{ width: `${carbsPct}%` }}
                />
              </div>
              <div className="flex justify-between text-body-sm text-outline tabular-nums">
                <span>Glycogen load</span>
                <span>{Math.max(0, targets.carbs - totalCarbs)}g left</span>
              </div>
            </div>

            {/* Dietary Fats */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-label-md text-on-surface font-semibold">
                  Dietary Fats
                </span>
                <span className="text-label-md text-on-surface-variant tabular-nums">
                  <strong className="text-on-surface">{totalFats}g</strong> / {targets.fats}g
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-500"
                  style={{ width: `${fatsPct}%` }}
                />
              </div>
              <div className="flex justify-between text-body-sm text-outline tabular-nums">
                <span>Lipid baseline</span>
                <span>{Math.max(0, targets.fats - totalFats)}g left</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TODAY'S MEAL LOGS */}
      <section aria-label="Today's Logged Meals" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display text-headline-sm text-on-surface">
            Today&apos;s Meals
          </h2>
          <button
            onClick={() => setShowQuickAddModal(true)}
            className="text-label-md text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Quick Add Item</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className={`rounded-xl p-4 flex items-center justify-between gap-4 transition-colors clinical-card ${
                meal.isAiVerified
                  ? 'bg-surface-container border border-primary/25'
                  : 'bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {meal.imageUrl ? (
                  <div className="w-11 h-11 rounded-lg bg-surface-container-highest overflow-hidden shrink-0 border border-primary/30">
                    <img
                      src={meal.imageUrl}
                      alt={meal.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center shrink-0 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">
                      {meal.icon || 'restaurant'}
                    </span>
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-label-sm uppercase text-primary tracking-wider">
                      {meal.category}
                    </span>
                    <span className="text-body-sm text-outline tabular-nums">
                      • {meal.time}
                    </span>
                    {meal.isAiVerified && (
                      <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[10px] font-semibold">
                        AI Snap
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-semibold text-on-surface text-sm sm:text-base truncate">
                    {meal.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="font-display font-bold text-on-surface tabular-nums">
                    {meal.calories}{' '}
                    <span className="text-xs font-normal text-outline">kcal</span>
                  </div>
                  <div className="text-body-sm text-on-surface-variant tabular-nums">
                    <span className="text-primary">{meal.protein}P</span> •{' '}
                    <span className="text-tertiary">{meal.carbs}C</span> •{' '}
                    <span>{meal.fats}F</span>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteMeal(meal.id)}
                  title="Remove meal entry"
                  className="w-8 h-8 rounded-lg hover:bg-surface-container-highest text-outline hover:text-error flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL 1: NEURAL LENS AI SCANNER */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface-container border border-outline-variant/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">center_focus_strong</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-on-surface">
                    Neural Lens v2.4 Volumetric Scanner
                  </h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Select a detected plate to run depth-map macro extraction
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowScannerModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {AI_SCAN_PRESETS.map((preset, idx) => {
                const isSelected = selectedPresetIdx === idx;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPresetIdx(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary shadow-sm'
                        : 'bg-surface-container-low border-outline-variant/25 hover:border-outline'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-label-sm uppercase text-primary font-bold">
                          {preset.confidence}% Match
                        </span>
                        <span className="text-body-sm text-outline">• {preset.category}</span>
                      </div>
                      <h4 className="font-display font-semibold text-base text-on-surface mt-0.5">
                        {preset.title}
                      </h4>
                    </div>
                    <div className="text-right tabular-nums">
                      <div className="font-display font-bold text-on-surface">
                        {preset.calories} kcal
                      </div>
                      <div className="text-body-sm text-primary">
                        {preset.protein}P • {preset.carbs}C • {preset.fats}F
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowScannerModal(false)}
                className="px-4 py-2.5 rounded-xl bg-surface-container-high text-label-lg text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                disabled={isScanningAnimation}
                onClick={() => handleRunNeuralScan(AI_SCAN_PRESETS[selectedPresetIdx])}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-display font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isScanningAnimation ? 'autorenew' : 'photo_camera'}
                </span>
                <span>
                  {isScanningAnimation
                    ? 'Extracting Amino Profile...'
                    : 'Extract & Log Macros'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK ADD CUSTOM MEAL */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveQuickAdd}
            className="w-full max-w-md bg-surface-container border border-outline-variant/40 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-on-surface">
                Quick Add Nutrition Entry
              </h3>
              <button
                type="button"
                onClick={() => setShowQuickAddModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-label-sm uppercase text-outline mb-1">
                  Meal / Supplement Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Double Espresso & Whey Isolate"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-body-md focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-label-sm uppercase text-outline mb-1">
                  Meal Window
                </label>
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickCategory(e.target.value as MealItem['category'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-body-md focus:outline-none focus:border-primary"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Afternoon Snack">Afternoon Snack</option>
                  <option value="Pre-Workout">Pre-Workout</option>
                  <option value="Post-Workout">Post-Workout</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm uppercase text-outline mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={quickCalories}
                    onChange={(e) => setQuickCalories(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-display font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-label-sm uppercase text-primary mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={quickProtein}
                    onChange={(e) => setQuickProtein(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-display font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-label-sm uppercase text-tertiary mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={quickCarbs}
                    onChange={(e) => setQuickCarbs(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-display font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-label-sm uppercase text-secondary mb-1">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    value={quickFats}
                    onChange={(e) => setQuickFats(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-display font-bold tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowQuickAddModal(false)}
                className="px-4 py-2.5 rounded-xl bg-surface-container-high text-label-lg text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-display font-bold text-sm"
              >
                Log to Fuel Allocation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: EDIT PORTIONS */}
      {showEditPortionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-surface-container border border-outline-variant/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-lg text-on-surface">
              Calibrate Volumetric Portion
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              Scale the detected weight of {latestDetection.title}:
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[0.75, 1, 1.25, 1.5].map((mult) => (
                <button
                  key={mult}
                  onClick={() => setPortionMultiplier(mult)}
                  className={`py-2.5 rounded-xl font-display font-bold text-sm border transition-all ${
                    portionMultiplier === mult
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/30'
                  }`}
                >
                  {mult}x
                </button>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex justify-between text-body-sm tabular-nums">
              <span className="text-on-surface-variant">Adjusted Output:</span>
              <strong className="text-primary">
                {Math.round(520 * portionMultiplier)} kcal •{' '}
                {Math.round(46 * portionMultiplier)}g PRO
              </strong>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditPortionModal(false)}
                className="px-4 py-2 rounded-xl bg-surface-container-high text-label-md text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyPortionMultiplier}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary font-display font-bold text-sm"
              >
                Apply Calibration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
