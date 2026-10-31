import React from 'react';
import { ExerciseItem } from '../types';

interface ExerciseVectorSvgProps {
  vectorType: ExerciseItem['vectorType'];
  className?: string;
}

export const ExerciseVectorSvg: React.FC<ExerciseVectorSvgProps> = ({
  vectorType,
  className = 'w-24 h-24 opacity-90 group-hover:scale-105 transition-transform duration-300',
}) => {
  switch (vectorType) {
    case 'incline-db-press':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bench line */}
          <path d="M20 80 L75 35" stroke="currentColor" className="text-outline-variant" strokeWidth="4" strokeLinecap="round" />
          <path d="M35 68 L35 85 M65 43 L65 85" stroke="currentColor" className="text-outline-variant" strokeWidth="3" strokeLinecap="round" />
          {/* Body silhouette */}
          <circle cx="62" cy="26" r="6" fill="currentColor" className="text-on-surface-variant" />
          <path d="M58 34 L36 52 L25 75" stroke="currentColor" className="text-on-surface-variant" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Active Chest & Arm Vector */}
          <path d="M52 38 L46 22" stroke="currentColor" className="text-primary" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="51" cy="40" r="6" className="fill-primary/30 stroke-primary" strokeWidth="1.5" />
          {/* Dumbbell */}
          <rect x="38" y="16" width="16" height="5" rx="2" fill="currentColor" className="text-primary" />
          {/* Force arrow */}
          <path d="M46 12 L46 5 M43 8 L46 5 L49 8" stroke="currentColor" className="text-primary-container" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'lat-pulldown':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cable & Bar */}
          <line x1="50" y1="5" x2="50" y2="25" stroke="currentColor" className="text-outline-variant" strokeWidth="2" strokeDasharray="2 2" />
          <path d="M22 28 L30 24 L70 24 L78 28" stroke="currentColor" className="text-on-surface" strokeWidth="3" strokeLinecap="round" />
          {/* Torso & Lats Highlight */}
          <circle cx="50" cy="40" r="6" fill="currentColor" className="text-on-surface-variant" />
          <path d="M38 50 L62 50 L56 76 L44 76 Z" className="fill-primary/20 stroke-primary" strokeWidth="2" strokeLinejoin="round" />
          {/* Arms pulling down */}
          <path d="M38 50 L26 38 L28 26 M62 50 L74 38 L72 26" stroke="currentColor" className="text-primary" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Seat */}
          <line x1="35" y1="80" x2="65" y2="80" stroke="currentColor" className="text-outline-variant" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'romanian-deadlift':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Floor */}
          <line x1="15" y1="88" x2="85" y2="88" stroke="currentColor" className="text-outline-variant" strokeWidth="2" />
          {/* Hinged Body */}
          <circle cx="68" cy="30" r="6" fill="currentColor" className="text-on-surface-variant" />
          {/* Back */}
          <line x1="62" y1="34" x2="32" y2="48" stroke="currentColor" className="text-on-surface" strokeWidth="5" strokeLinecap="round" />
          {/* Hamstrings / Glutes Highlight (Tertiary Amber) */}
          <path d="M32 48 L38 68 L36 86" stroke="currentColor" className="text-tertiary" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="32" cy="48" r="5" className="fill-tertiary/30 stroke-tertiary" strokeWidth="1.5" />
          {/* Arms & Barbell */}
          <line x1="56" y1="38" x2="56" y2="66" stroke="currentColor" className="text-on-surface-variant" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="56" cy="68" r="9" className="fill-surface-container-highest stroke-primary" strokeWidth="2.5" />
          <circle cx="56" cy="68" r="2.5" fill="currentColor" className="text-primary" />
        </svg>
      );

    case 'lateral-raise':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="24" r="6" fill="currentColor" className="text-on-surface-variant" />
          {/* Torso */}
          <path d="M42 36 L58 36 L55 68 L45 68 Z" fill="currentColor" className="text-outline-variant/60" />
          {/* Deltoid Caps Highlight */}
          <circle cx="38" cy="38" r="5.5" className="fill-primary/30 stroke-primary" strokeWidth="2" />
          <circle cx="62" cy="38" r="5.5" className="fill-primary/30 stroke-primary" strokeWidth="2" />
          {/* Abducted Arms */}
          <path d="M38 38 L16 34 M62 38 L84 34" stroke="currentColor" className="text-primary" strokeWidth="4" strokeLinecap="round" />
          {/* Dumbbells */}
          <rect x="10" y="30" width="8" height="8" rx="1.5" fill="currentColor" className="text-on-surface" />
          <rect x="82" y="30" width="8" height="8" rx="1.5" fill="currentColor" className="text-on-surface" />
          {/* Arc paths */}
          <path d="M22 55 A 24 24 0 0 1 16 40" stroke="currentColor" className="text-primary" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M78 55 A 24 24 0 0 0 84 40" stroke="currentColor" className="text-primary" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      );

    case 'cable-tricep-pushdown':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cable column */}
          <line x1="25" y1="10" x2="25" y2="90" stroke="currentColor" className="text-outline-variant" strokeWidth="4" strokeLinecap="round" />
          <line x1="25" y1="14" x2="48" y2="52" stroke="currentColor" className="text-outline" strokeWidth="1.5" strokeDasharray="2 2" />
          {/* Standing Athlete */}
          <circle cx="62" cy="24" r="6" fill="currentColor" className="text-on-surface-variant" />
          <line x1="60" y1="34" x2="58" y2="66" stroke="currentColor" className="text-on-surface-variant" strokeWidth="6" strokeLinecap="round" />
          <line x1="58" y1="66" x2="58" y2="88" stroke="currentColor" className="text-outline-variant" strokeWidth="5" strokeLinecap="round" />
          {/* Upper arm + Tricep Highlight + Forearm Pushdown */}
          <line x1="58" y1="36" x2="54" y2="52" stroke="currentColor" className="text-primary" strokeWidth="5" strokeLinecap="round" />
          <circle cx="56" cy="44" r="5" className="fill-primary/30 stroke-primary" strokeWidth="1.5" />
          <line x1="54" y1="52" x2="45" y2="66" stroke="currentColor" className="text-on-surface" strokeWidth="4" strokeLinecap="round" />
          {/* Force vector */}
          <path d="M40 58 L36 68 M33 65 L36 68 L40 66" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'hanging-leg-raise':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pull-up Bar */}
          <line x1="20" y1="12" x2="80" y2="12" stroke="currentColor" className="text-outline-variant" strokeWidth="4" strokeLinecap="round" />
          {/* Hanging Arms & Torso */}
          <line x1="44" y1="12" x2="44" y2="32" stroke="currentColor" className="text-on-surface-variant" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="44" cy="26" r="5" fill="currentColor" className="text-on-surface-variant" />
          <line x1="44" y1="32" x2="44" y2="56" stroke="currentColor" className="text-on-surface" strokeWidth="6" strokeLinecap="round" />
          {/* Core Highlight */}
          <rect x="41" y="42" width="7" height="14" rx="3" className="fill-tertiary/40 stroke-tertiary" strokeWidth="1.5" />
          {/* Raised Straight Legs (90 deg) */}
          <line x1="44" y1="56" x2="78" y2="52" stroke="currentColor" className="text-tertiary" strokeWidth="5" strokeLinecap="round" />
          {/* Arc */}
          <path d="M52 78 A 26 26 0 0 0 76 60" stroke="currentColor" className="text-tertiary" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      );

    case 'chest-supported-row':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Incline Chest Pad */}
          <path d="M25 75 L68 35" stroke="currentColor" className="text-outline-variant" strokeWidth="5" strokeLinecap="round" />
          <line x1="52" y1="50" x2="65" y2="85" stroke="currentColor" className="text-outline-variant" strokeWidth="3" strokeLinecap="round" />
          {/* Athlete */}
          <circle cx="66" cy="25" r="5.5" fill="currentColor" className="text-on-surface-variant" />
          <path d="M60 32 L38 52 L26 78" stroke="currentColor" className="text-on-surface" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Rhomboids / Upper Back Vector */}
          <circle cx="50" cy="40" r="6" className="fill-primary/30 stroke-primary" strokeWidth="1.5" />
          <path d="M52 38 L42 28 L55 56" stroke="currentColor" className="text-primary" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {/* T-Bar Plate */}
          <circle cx="62" cy="66" r="8" className="fill-surface-container-highest stroke-primary" strokeWidth="2.5" />
        </svg>
      );

    case 'incline-db-curl':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 45 deg Bench */}
          <path d="M22 82 L68 32" stroke="currentColor" className="text-outline-variant" strokeWidth="4" strokeLinecap="round" />
          <circle cx="64" cy="24" r="5.5" fill="currentColor" className="text-on-surface-variant" />
          {/* Reclined Torso */}
          <line x1="58" y1="32" x2="36" y2="56" stroke="currentColor" className="text-on-surface-variant" strokeWidth="5" strokeLinecap="round" />
          {/* Hanging Upper Arm Behind Torso + Biceps Long Head */}
          <line x1="56" y1="35" x2="56" y2="60" stroke="currentColor" className="text-primary" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="56" cy="48" r="5" className="fill-primary/30 stroke-primary" strokeWidth="1.5" />
          {/* Curled Forearm */}
          <line x1="56" y1="60" x2="72" y2="45" stroke="currentColor" className="text-on-surface" strokeWidth="4" strokeLinecap="round" />
          <rect x="70" y="39" width="9" height="6" rx="1.5" fill="currentColor" className="text-primary" />
        </svg>
      );

    case 'hack-squat':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Linear Sled Rail */}
          <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" className="text-outline-variant" strokeWidth="3" strokeDasharray="4 3" />
          {/* Footplate */}
          <line x1="65" y1="82" x2="85" y2="64" stroke="currentColor" className="text-outline" strokeWidth="4" strokeLinecap="round" />
          {/* Squatting Athlete */}
          <circle cx="34" cy="28" r="5.5" fill="currentColor" className="text-on-surface-variant" />
          <line x1="38" y1="35" x2="54" y2="52" stroke="currentColor" className="text-on-surface" strokeWidth="5" strokeLinecap="round" />
          {/* Quad Highlight */}
          <path d="M54 52 L68 42 L74 70" stroke="currentColor" className="text-tertiary" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="62" cy="46" r="5.5" className="fill-tertiary/30 stroke-tertiary" strokeWidth="1.5" />
        </svg>
      );

    case 'cable-fly':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dual Cables */}
          <line x1="12" y1="35" x2="44" y2="48" stroke="currentColor" className="text-outline" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="88" y1="35" x2="56" y2="48" stroke="currentColor" className="text-outline" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="50" cy="26" r="6" fill="currentColor" className="text-on-surface-variant" />
          {/* Pectoral Sternal Highlight */}
          <rect x="39" y="36" width="22" height="16" rx="4" className="fill-primary/25 stroke-primary" strokeWidth="2" />
          {/* Converging Arms */}
          <path d="M39 40 Q 28 46 45 50 M61 40 Q 72 46 55 50" stroke="currentColor" className="text-primary" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'overhead-press':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="38" r="6" fill="currentColor" className="text-on-surface-variant" />
          <rect x="42" y="46" width="16" height="28" rx="3" fill="currentColor" className="text-outline-variant/60" />
          {/* Deltoids */}
          <circle cx="38" cy="48" r="5" className="fill-primary/30 stroke-primary" strokeWidth="2" />
          <circle cx="62" cy="48" r="5" className="fill-primary/30 stroke-primary" strokeWidth="2" />
          {/* Overhead Pressing Arms */}
          <path d="M38 48 L28 38 L32 18 M62 48 L72 38 L68 18" stroke="currentColor" className="text-primary" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="22" y1="18" x2="78" y2="18" stroke="currentColor" className="text-on-surface" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'ab-wheel-rollout':
    default:
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="12" y1="78" x2="88" y2="78" stroke="currentColor" className="text-outline-variant" strokeWidth="2" />
          {/* Extended Plank Athlete */}
          <circle cx="66" cy="44" r="5" fill="currentColor" className="text-on-surface-variant" />
          <path d="M22 76 L38 56 L62 48" stroke="currentColor" className="text-tertiary" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="62" y1="48" x2="78" y2="70" stroke="currentColor" className="text-primary" strokeWidth="4" strokeLinecap="round" />
          {/* Ab Wheel */}
          <circle cx="78" cy="71" r="6" className="fill-surface-container-highest stroke-primary" strokeWidth="2.5" />
        </svg>
      );
  }
};
