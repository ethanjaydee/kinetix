export type TabId = 'dashboard' | 'nutrition' | 'body-comp' | 'workouts';

export type ThemeMode = 'dark' | 'light';

export type MuscleGroup = 'All' | 'Chest' | 'Back' | 'Shoulders' | 'Legs' | 'Arms' | 'Core';

export type EquipmentType = 'Free Weights' | 'Cables' | 'Machines' | 'Bodyweight';

export interface SetRecord {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutBlock {
  id: string;
  exerciseId: string;
  blockNumber: string;
  name: string;
  targetDescription: string;
  targetWeightKg: number;
  unit: 'kg' | 'lbs' | 'BW';
  setsCount: number;
  repsRange: string;
  restSeconds: number;
  sets: SetRecord[];
}

export interface ExerciseItem {
  id: string;
  name: string;
  primaryMuscle: Exclude<MuscleGroup, 'All'>;
  muscleBadgeLabel: string;
  muscleBadgeTone: 'primary' | 'tertiary' | 'secondary';
  equipment: EquipmentType;
  equipmentSubLabel: string;
  sets: number;
  repsRange: string;
  restSeconds: number;
  defaultWeightKg: number;
  vectorType:
    | 'incline-db-press'
    | 'lat-pulldown'
    | 'romanian-deadlift'
    | 'lateral-raise'
    | 'cable-tricep-pushdown'
    | 'hanging-leg-raise'
    | 'chest-supported-row'
    | 'incline-db-curl'
    | 'hack-squat'
    | 'overhead-press'
    | 'cable-fly'
    | 'ab-wheel-rollout';
  bookmarked: boolean;
  biomechanicalNotes: string;
  coachingCues: string[];
}

export interface BoundingBoxTag {
  label: string;
  weightGrams: string;
  topPct: number;
  leftPct: number;
  widthPct: number;
  heightPct: number;
  tone: 'primary' | 'tertiary';
}

export interface MealItem {
  id: string;
  title: string;
  category: 'Breakfast' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | 'Pre-Workout' | 'Post-Workout';
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  confidence?: number;
  imageUrl?: string;
  icon?: string;
  isAiVerified?: boolean;
  boundingBoxes?: BoundingBoxTag[];
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface BodyCompScan {
  id: string;
  dateLabel: string;
  isoDate: string;
  sourceLabel: string;
  isDexaCalibrated: boolean;
  weightKg: number;
  bodyFatPct: number;
  skeletalMuscleKg: number;
  visceralFatLvl: number;
  bodyWaterPct: number;
  bmrKcal: number;
  trunkLeanKg: number;
  appendicularLeanKg: number;
}

export type TrajectoryTimeframe = '1M' | '3M' | '6M' | '1Y' | 'All';

export interface TrajectoryPoint {
  dateLabel: string;
  weightKg: number;
  bodyFatPct: number;
  skeletalMuscleKg: number;
}

export interface StreakDay {
  id: string;
  dayShort: string;
  dateLabel: string;
  completed: boolean;
  isToday?: boolean;
  sessionTitle?: string;
}

export interface VitalsData {
  steps: number;
  stepsGoal: number;
  activeBurnKcal: number;
  activeBurnDeltaPct: number;
  restingHrBpm: number;
  hrZoneLabel: string;
  sleepScore: number;
  sleepHours: number;
  sleepMinutes: number;
  deepSleepMinutes: number;
  remSleepMinutes: number;
  lightSleepMinutes: number;
  hrvMs: number;
  recoveryPct: number;
}
