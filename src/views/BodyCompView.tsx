import React, { useState } from 'react';
import { TRAJECTORY_SERIES } from '../data/initialData';
import { BodyCompScan, TrajectoryTimeframe } from '../types';

interface BodyCompViewProps {
  scans: BodyCompScan[];
  onAddManualScan: (scan: BodyCompScan) => void;
  onForceSyncScale: () => void;
  isSyncingScale: boolean;
}

export const BodyCompView: React.FC<BodyCompViewProps> = ({
  scans,
  onAddManualScan,
  onForceSyncScale,
  isSyncingScale,
}) => {
  const [timeframe, setTimeframe] = useState<TrajectoryTimeframe>('1M');
  const [showWeightCurve, setShowWeightCurve] = useState(true);
  const [showBodyFatCurve, setShowBodyFatCurve] = useState(true);
  const [showMuscleCurve, setShowMuscleCurve] = useState(true);
  const [activePointIndex, setActivePointIndex] = useState<number>(4);

  const [selectedScanModal, setSelectedScanModal] = useState<BodyCompScan | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  const latestScan = scans[0];
  const [manualWeight, setManualWeight] = useState(latestScan?.weightKg ?? 74.2);
  const [manualBodyFat, setManualBodyFat] = useState(latestScan?.bodyFatPct ?? 14.8);
  const [manualMuscle, setManualMuscle] = useState(latestScan?.skeletalMuscleKg ?? 36.5);
  const [manualVisceral, setManualVisceral] = useState(latestScan?.visceralFatLvl ?? 4);
  const [manualWater, setManualWater] = useState(latestScan?.bodyWaterPct ?? 62.4);

  const currentSeries = TRAJECTORY_SERIES[timeframe];
  const activePoint = currentSeries[activePointIndex] || currentSeries[currentSeries.length - 1];

  // Compute SVG coordinates for the 5 points across x = [30, 165, 300, 435, 570]
  const xCoords = [30, 165, 300, 435, 570];

  const getWeightY = (w: number) => {
    // Map weight [73..83] to y [155..35]
    const ratio = (w - 73) / 10;
    return Math.round(155 - Math.max(0, Math.min(1, ratio)) * 120);
  };

  const getBfY = (bf: number) => {
    // Map bodyFat [13..23] to y [175..55]
    const ratio = (bf - 13) / 10;
    return Math.round(175 - Math.max(0, Math.min(1, ratio)) * 120);
  };

  const getMuscleY = (smm: number) => {
    // Map muscle [32..38] to y [185..110]
    const ratio = (smm - 32) / 6;
    return Math.round(185 - Math.max(0, Math.min(1, ratio)) * 75);
  };

  const weightPoints = currentSeries.map((pt, i) => ({ x: xCoords[i], y: getWeightY(pt.weightKg) }));
  const bfPoints = currentSeries.map((pt, i) => ({ x: xCoords[i], y: getBfY(pt.bodyFatPct) }));
  const musclePoints = currentSeries.map((pt, i) => ({
    x: xCoords[i],
    y: getMuscleY(pt.skeletalMuscleKg),
  }));

  const buildPolyline = (pts: { x: number; y: number }[]) =>
    pts.map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  const weightPath = buildPolyline(weightPoints);
  const weightAreaPath = `${weightPath} L570,210 L30,210 Z`;
  const bfPath = buildPolyline(bfPoints);
  const musclePath = buildPolyline(musclePoints);

  const handleExportCsv = () => {
    const headers = [
      'Date',
      'Source',
      'Weight (kg)',
      'Body Fat (%)',
      'Skeletal Muscle (kg)',
      'Visceral Fat Level',
      'Body Water (%)',
      'BMR (kcal)',
    ];
    const rows = scans.map((s) => [
      `"${s.dateLabel}"`,
      `"${s.sourceLabel}"`,
      s.weightKg,
      s.bodyFatPct,
      s.skeletalMuscleKg,
      s.visceralFatLvl,
      s.bodyWaterPct,
      s.bmrKcal,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'kinetix_body_composition_telemetry.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const dateLabel = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeLabel = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newScan: BodyCompScan = {
      id: `scan-manual-${Date.now()}`,
      dateLabel,
      isoDate: today.toISOString().slice(0, 10),
      sourceLabel: `${timeLabel} • Manual Telemetry`,
      isDexaCalibrated: false,
      weightKg: Number(manualWeight),
      bodyFatPct: Number(manualBodyFat),
      skeletalMuscleKg: Number(manualMuscle),
      visceralFatLvl: Number(manualVisceral),
      bodyWaterPct: Number(manualWater),
      bmrKcal: Math.round(370 + 21.6 * (Number(manualWeight) * (1 - Number(manualBodyFat) / 100))),
      trunkLeanKg: Number((Number(manualMuscle) * 0.73).toFixed(1)),
      appendicularLeanKg: Number((Number(manualMuscle) * 0.8).toFixed(1)),
    };
    onAddManualScan(newScan);
    setShowManualModal(false);
  };

  const fatMassKg = ((latestScan.weightKg * latestScan.bodyFatPct) / 100).toFixed(1);
  const musclePctOfMass = ((latestScan.skeletalMuscleKg / latestScan.weightKg) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* SECTION 1: SCREEN HEADER */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-label-md text-primary uppercase tracking-wider mb-1">
            Physiological Analytics
          </p>
          <h1 className="font-display text-headline-lg-mobile sm:text-headline-lg text-on-surface">
            Body Composition
          </h1>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-label-md">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            DEXA Synced
          </span>
        </div>
      </section>

      {/* SECTION 2: PRIMARY METRIC 2X2 GRID */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Card 1: Total Weight */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-colors clinical-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label-md text-on-surface-variant uppercase">
              Total Weight
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-label-sm tabular-nums">
              <span className="material-symbols-outlined text-[12px]">south_east</span>
              -1.2 kg
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl sm:text-metric-display text-on-surface tabular-nums">
                {latestScan.weightKg.toFixed(1)}
              </span>
              <span className="text-label-lg text-outline font-normal">kg</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-body-sm text-outline">
            <span>30-day rolling mean</span>
            <span className="tabular-nums text-on-surface-variant font-medium">
              Target: 72.5 kg
            </span>
          </div>
        </div>

        {/* Card 2: Body Fat % */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-colors clinical-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label-md text-on-surface-variant uppercase">
              Body Fat %
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-label-sm tabular-nums">
              <span className="material-symbols-outlined text-[12px]">south_east</span>
              -1.2%
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl sm:text-metric-display text-primary tabular-nums">
                {latestScan.bodyFatPct.toFixed(1)}
              </span>
              <span className="text-label-lg text-primary/70 font-normal">%</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-body-sm text-outline">
            <span>Athletic Range</span>
            <span className="tabular-nums text-on-surface-variant font-medium">
              {fatMassKg} kg fat mass
            </span>
          </div>
        </div>

        {/* Card 3: Skeletal Muscle Mass */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden group hover:border-tertiary/40 transition-colors clinical-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label-md text-on-surface-variant uppercase">
              Skeletal Muscle
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary/15 text-tertiary text-label-sm tabular-nums">
              <span className="material-symbols-outlined text-[12px]">north_east</span>
              +0.6 kg
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl sm:text-metric-display text-tertiary tabular-nums">
                {latestScan.skeletalMuscleKg.toFixed(1)}
              </span>
              <span className="text-label-lg text-tertiary/70 font-normal">kg</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-body-sm text-outline">
            <span>{musclePctOfMass}% of body mass</span>
            <span className="text-tertiary font-medium">Peak Hypertrophy</span>
          </div>
        </div>

        {/* Card 4: Visceral Fat & Hydration */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden clinical-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-md text-on-surface-variant uppercase">
              Visceral &amp; Water
            </span>
            <span className="material-symbols-outlined text-[18px] text-outline">
              water_drop
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 my-1">
            <div>
              <div className="text-body-sm text-outline mb-0.5">Visceral Fat</div>
              <div className="font-display text-2xl font-bold text-on-surface tabular-nums">
                Lvl {latestScan.visceralFatLvl}
              </div>
              <span className="text-label-sm text-emerald-400 uppercase">Optimal</span>
            </div>
            <div className="border-l border-outline-variant/30 pl-3">
              <div className="text-body-sm text-outline mb-0.5">Body Water</div>
              <div className="font-display text-2xl font-bold text-on-surface tabular-nums">
                {latestScan.bodyWaterPct}%
              </div>
              <span className="text-label-sm text-primary uppercase">Hydrated</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-body-sm text-outline">
            <span>Basal Metabolic Rate</span>
            <span className="tabular-nums text-on-surface font-medium">
              {latestScan.bmrKcal.toLocaleString()} kcal/day
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE TRAJECTORY CHART CARD */}
      <section className="p-5 sm:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-5 clinical-card">
        {/* Chart Header & Timeframe Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-headline-sm text-on-surface">
              Trajectory Analysis
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Multi-variable recomposition velocity ({timeframe} window)
            </p>
          </div>
          {/* Timeframe Selector Pills */}
          <div className="inline-flex p-1 rounded-xl bg-surface-container-lowest border border-outline-variant/25 self-start sm:self-auto">
            {(['1M', '3M', '6M', '1Y', 'All'] as TrajectoryTimeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  setTimeframe(tf);
                  setActivePointIndex(4);
                }}
                className={`px-3 py-1 rounded-lg text-label-md transition-colors ${
                  timeframe === tf
                    ? 'bg-surface-container-high text-primary shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Legend / Toggle Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowWeightCurve((v) => !v)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-label-md transition-all ${
              showWeightCurve
                ? 'bg-primary/15 border-primary/30 text-on-surface'
                : 'bg-surface-container border-outline-variant/20 text-outline opacity-60'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span>Weight</span>
            <span className="text-primary tabular-nums ml-1">
              {activePoint.weightKg.toFixed(1)} kg
            </span>
          </button>

          <button
            onClick={() => setShowBodyFatCurve((v) => !v)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-label-md transition-all ${
              showBodyFatCurve
                ? 'bg-surface-container border-outline-variant/30 text-on-surface-variant'
                : 'bg-surface-container border-outline-variant/20 text-outline opacity-60'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
            <span>Body Fat %</span>
            <span className="text-tertiary tabular-nums ml-1">
              {activePoint.bodyFatPct.toFixed(1)}%
            </span>
          </button>

          <button
            onClick={() => setShowMuscleCurve((v) => !v)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-label-md transition-all ${
              showMuscleCurve
                ? 'bg-surface-container border-outline-variant/30 text-on-surface-variant'
                : 'bg-surface-container border-outline-variant/20 text-outline opacity-60'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <span>Muscle Mass</span>
            <span className="text-secondary tabular-nums ml-1">
              {activePoint.skeletalMuscleKg.toFixed(1)} kg
            </span>
          </button>
        </div>

        {/* SVG Chart Container */}
        <div className="relative pt-2">
          <svg
            viewBox="0 0 600 220"
            className="w-full h-48 sm:h-56 overflow-visible"
            aria-label="Body Composition Trend Graph"
          >
            <defs>
              <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--c-primary))" stopOpacity="0.24" />
                <stop offset="100%" stopColor="rgb(var(--c-primary))" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Reference Grid Lines */}
            <line
              x1="0"
              y1="30"
              x2="600"
              y2="30"
              stroke="currentColor"
              className="text-outline-variant/30"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <line
              x1="0"
              y1="90"
              x2="600"
              y2="90"
              stroke="currentColor"
              className="text-outline-variant/30"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <line
              x1="0"
              y1="150"
              x2="600"
              y2="150"
              stroke="currentColor"
              className="text-outline-variant/30"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <line
              x1="0"
              y1="210"
              x2="600"
              y2="210"
              stroke="currentColor"
              className="text-outline-variant/50"
              strokeWidth="1"
            />

            {/* Active Vertical Cursor Line */}
            <line
              x1={xCoords[activePointIndex]}
              y1="20"
              x2={xCoords[activePointIndex]}
              y2="210"
              stroke="currentColor"
              className="text-primary/50"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />

            {/* Muscle Mass Line */}
            {showMuscleCurve && (
              <path
                d={musclePath}
                fill="none"
                stroke="currentColor"
                className="text-secondary"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.65"
              />
            )}

            {/* Body Fat % Line (Tertiary Dashed) */}
            {showBodyFatCurve && (
              <>
                <path
                  d={bfPath}
                  fill="none"
                  stroke="currentColor"
                  className="text-tertiary"
                  strokeWidth="2.25"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
                {bfPoints.map((pt, idx) => (
                  <circle
                    key={`bf-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={activePointIndex === idx ? 5.5 : 4}
                    className="fill-surface-container-low stroke-tertiary cursor-pointer"
                    strokeWidth="2.5"
                    onClick={() => setActivePointIndex(idx)}
                  />
                ))}
              </>
            )}

            {/* Weight Area & Line (Primary Solid) */}
            {showWeightCurve && (
              <>
                <path d={weightAreaPath} fill="url(#weightAreaGrad)" />
                <path
                  d={weightPath}
                  fill="none"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {weightPoints.map((pt, idx) => (
                  <g
                    key={`w-${idx}`}
                    className="cursor-pointer"
                    onClick={() => setActivePointIndex(idx)}
                  >
                    {activePointIndex === idx && (
                      <circle cx={pt.x} cy={pt.y} r="10" className="fill-primary/20" />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={activePointIndex === idx ? 5.5 : 4}
                      className={
                        activePointIndex === idx
                          ? 'fill-primary stroke-surface-container-low'
                          : 'fill-surface-container-low stroke-primary'
                      }
                      strokeWidth="2.5"
                    />
                  </g>
                ))}
              </>
            )}
          </svg>

          {/* Floating Active Data Callout Badge */}
          <div className="absolute top-1 right-1 sm:right-4 bg-surface-container-high/95 backdrop-blur-md border border-outline-variant/40 rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-3">
            <span className="text-label-sm text-on-surface-variant uppercase">
              {activePoint.dateLabel}
            </span>
            <span className="text-label-md text-primary font-bold tabular-nums">
              {activePoint.weightKg.toFixed(1)}kg
            </span>
            <span className="text-label-md text-tertiary font-bold tabular-nums">
              {activePoint.bodyFatPct.toFixed(1)}% BF
            </span>
          </div>

          {/* X-Axis Labels (Interactive) */}
          <div className="flex justify-between text-label-sm text-outline pt-2 px-2 tabular-nums">
            {currentSeries.map((pt, idx) => (
              <button
                key={pt.dateLabel}
                onClick={() => setActivePointIndex(idx)}
                className={`transition-colors ${
                  activePointIndex === idx
                    ? 'text-primary font-bold'
                    : 'hover:text-on-surface'
                }`}
              >
                {pt.dateLabel}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CONNECTED HARDWARE SYNC STATUS */}
      <section className="p-4 rounded-xl bg-surface-container border border-outline-variant/25 flex items-center justify-between gap-4 clinical-card">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[22px]">monitor_weight</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-label-lg text-on-surface">Withings Body Scan</h3>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              Segmental Bioelectrical Impedance • Battery 84%
            </p>
          </div>
        </div>
        <button
          onClick={onForceSyncScale}
          className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-label-md text-on-surface transition-colors shrink-0 flex items-center gap-1.5 border border-outline-variant/30"
        >
          <span
            className={`material-symbols-outlined text-[16px] ${
              isSyncingScale ? 'animate-spin text-primary' : ''
            }`}
          >
            sync
          </span>
          <span>{isSyncingScale ? 'Syncing...' : 'Force Sync'}</span>
        </button>
      </section>

      {/* SECTION 5: RECENT SCAN HISTORY & MANUAL LOG */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-headline-sm text-on-surface">Scan History</h2>
          <button
            onClick={handleExportCsv}
            className="text-label-md text-primary hover:underline flex items-center gap-1"
          >
            <span>Export CSV</span>
            <span className="material-symbols-outlined text-[16px]">download</span>
          </button>
        </div>

        <div className="space-y-2">
          {scans.map((scan) => (
            <div
              key={scan.id}
              onClick={() => setSelectedScanModal(scan)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedScanModal(scan)}
              className="p-3.5 sm:p-4 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 transition-colors flex items-center justify-between gap-2 cursor-pointer clinical-card"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    scan.isDexaCalibrated
                      ? 'bg-primary/10 border border-primary/20 text-primary'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {scan.isDexaCalibrated ? 'biotech' : 'calendar_today'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-label-lg text-on-surface">{scan.dateLabel}</span>
                    {scan.isDexaCalibrated && (
                      <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[10px] font-semibold uppercase">
                        Calibrated
                      </span>
                    )}
                  </div>
                  <div className="text-body-sm text-outline">{scan.sourceLabel}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 tabular-nums">
                <div className="text-right">
                  <div className="text-label-lg text-on-surface">
                    {scan.weightKg.toFixed(1)} kg
                  </div>
                  <div className="text-label-sm text-outline uppercase">Weight</div>
                </div>
                <div className="text-right">
                  <div className="text-label-lg text-primary">
                    {scan.bodyFatPct.toFixed(1)}%
                  </div>
                  <div className="text-label-sm text-outline uppercase">Body Fat</div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-label-lg text-tertiary">
                    {scan.skeletalMuscleKg.toFixed(1)} kg
                  </div>
                  <div className="text-label-sm text-outline uppercase">Muscle</div>
                </div>
                <span className="material-symbols-outlined text-outline text-[18px]">
                  chevron_right
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Manual Entry CTA Button */}
        <div className="pt-2">
          <button
            onClick={() => setShowManualModal(true)}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-display font-bold text-label-lg shadow-lg shadow-primary/15 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Log Manual Body Composition
          </button>
        </div>
      </section>

      {/* MODAL 1: SEGMENTAL DEXA SCAN BREAKDOWN */}
      {selectedScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-surface-container border border-outline-variant/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-label-sm uppercase text-primary font-bold">
                  Segmental Impedance Report
                </span>
                <h3 className="font-display font-bold text-lg text-on-surface">
                  {selectedScanModal.dateLabel}
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  {selectedScanModal.sourceLabel}
                </p>
              </div>
              <button
                onClick={() => setSelectedScanModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 tabular-nums">
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-label-sm uppercase text-outline">Total Mass</span>
                <p className="font-display font-bold text-xl text-on-surface mt-0.5">
                  {selectedScanModal.weightKg.toFixed(1)} kg
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-label-sm uppercase text-outline">Adipose Ratio</span>
                <p className="font-display font-bold text-xl text-primary mt-0.5">
                  {selectedScanModal.bodyFatPct.toFixed(1)}%
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-label-sm uppercase text-outline">Trunk Lean Mass</span>
                <p className="font-display font-bold text-xl text-tertiary mt-0.5">
                  {selectedScanModal.trunkLeanKg.toFixed(1)} kg
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-label-sm uppercase text-outline">Appendicular Lean</span>
                <p className="font-display font-bold text-xl text-emerald-400 mt-0.5">
                  {selectedScanModal.appendicularLeanKg.toFixed(1)} kg
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedScanModal(null)}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-display font-bold text-sm"
            >
              Close Segmental Report
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: MANUAL BODY COMPOSITION ENTRY */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <form
            onSubmit={handleManualSubmit}
            className="w-full max-w-md bg-surface-container border border-outline-variant/40 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-on-surface">
                Log Manual Body Composition
              </h3>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-label-sm uppercase text-outline mb-1">
                  Total Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={manualWeight}
                  onChange={(e) => setManualWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-display font-bold tabular-nums"
                />
              </div>
              <div>
                <label className="block text-label-sm uppercase text-primary mb-1">
                  Body Fat (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={manualBodyFat}
                  onChange={(e) => setManualBodyFat(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-display font-bold tabular-nums"
                />
              </div>
              <div>
                <label className="block text-label-sm uppercase text-tertiary mb-1">
                  Skeletal Muscle (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={manualMuscle}
                  onChange={(e) => setManualMuscle(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-display font-bold tabular-nums"
                />
              </div>
              <div>
                <label className="block text-label-sm uppercase text-emerald-400 mb-1">
                  Visceral Fat (Lvl)
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={manualVisceral}
                  onChange={(e) => setManualVisceral(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-display font-bold tabular-nums"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-label-sm uppercase text-outline mb-1">
                  Total Body Water (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={manualWater}
                  onChange={(e) => setManualWater(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-display font-bold tabular-nums"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2.5 rounded-xl bg-surface-container-high text-label-lg text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-display font-bold text-sm"
              >
                Save Telemetry Scan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
