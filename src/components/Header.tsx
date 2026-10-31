import React, { useState } from 'react';
import { KINETIX_LOGO_URL, PROFILE_AVATAR_URL } from '../data/initialData';
import { TabId, ThemeMode } from '../types';

interface HeaderProps {
  activeTab: TabId;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onSelectTab: (tab: TabId) => void;
  onResetDemoData: () => void;
  lastSyncedText: string;
  onTriggerSync: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  theme,
  onToggleTheme,
  onSelectTab,
  onResetDemoData,
  lastSyncedText,
  onTriggerSync,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-md border-b border-outline-variant/20 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3 text-left group focus:outline-none"
          aria-label="KINETIX Home"
        >
          <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant/30 overflow-hidden shadow-sm group-hover:border-primary/50 transition-colors">
            <img
              src={KINETIX_LOGO_URL}
              alt="Kinetix Logo"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg tracking-tight text-on-surface">
              KINETIX
            </span>
            {activeTab === 'nutrition' && (
              <>
                <span className="text-xs font-medium text-outline px-1.5 py-0.5">/</span>
                <span className="text-label-md text-primary uppercase tracking-wider">
                  AI Nutrition
                </span>
              </>
            )}
          </div>
        </button>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 relative">
          {/* Body Comp Synced Pill */}
          {activeTab === 'body-comp' && (
            <button
              onClick={onTriggerSync}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high border border-outline-variant/30 hover:border-primary/40 transition-colors"
              title="Click to sync Withings Body Scan telemetry"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
                {lastSyncedText}
              </span>
            </button>
          )}

          {/* Design System Theme Switcher (Kinetic Minimal Dark <-> Clinical Performance Light) */}
          <button
            onClick={onToggleTheme}
            className="h-9 px-2.5 rounded-full bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors"
            title={
              theme === 'dark'
                ? 'Switch to Kinetix Clinical Performance (Light Mode)'
                : 'Switch to Kinetic Minimal (Dark Mode)'
            }
            aria-label="Toggle Design System Theme"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">
              {theme === 'dark' ? 'dark_mode' : 'light_mode'}
            </span>
            <span className="hidden sm:inline text-label-sm uppercase tracking-wider font-semibold">
              {theme === 'dark' ? 'Kinetic Dark' : 'Clinical Light'}
            </span>
          </button>

          {/* Notifications / Telemetry Feed Button */}
          <button
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowProfileMenu(false);
            }}
            className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors relative border border-outline-variant/25"
            aria-label="Telemetry Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">
              {activeTab === 'nutrition' ? 'history' : 'notifications'}
            </span>
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface" />
          </button>

          {/* Profile Avatar Button */}
          <button
            onClick={() => {
              setShowProfileMenu((prev) => !prev);
              setShowNotifications(false);
            }}
            className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant/40 overflow-hidden hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label="Athlete Profile & Settings"
          >
            <img
              src={PROFILE_AVATAR_URL}
              alt="Athlete Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-surface-container-high border border-outline-variant/40 rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/20">
                <span className="text-label-md font-semibold text-on-surface uppercase tracking-wider">
                  Physiological Telemetry
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="space-y-2.5 text-left">
                <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                    bolt
                  </span>
                  <div>
                    <p className="text-label-md font-semibold text-on-surface">
                      92% CNS Readiness Peak
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      HRV is +9ms above your 30-day rolling baseline. Optimal day for progressive overload on Pull movements.
                    </p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">
                    scale
                  </span>
                  <div>
                    <p className="text-label-md font-semibold text-on-surface">
                      Withings Body Scan Calibrated
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      Morning impedance matched DEXA reference curve (14.8% BF, 36.5 kg SMM).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile & Design System Settings Popover */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-72 bg-surface-container-high border border-outline-variant/40 rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center gap-3 pb-3 mb-3 border-b border-outline-variant/20">
                <img
                  src={PROFILE_AVATAR_URL}
                  alt="Athlete Profile"
                  className="w-10 h-10 rounded-full object-cover border border-primary/40"
                />
                <div>
                  <p className="font-display font-bold text-sm text-on-surface">Alex Vance</p>
                  <p className="text-body-sm text-on-surface-variant">
                    DEXA ID #KX-8841 • Pro Athlete
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    onToggleTheme();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-highest text-body-sm text-on-surface transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      palette
                    </span>
                    Design System
                  </span>
                  <span className="text-label-sm uppercase text-primary font-semibold">
                    {theme === 'dark' ? 'Kinetic Minimal' : 'Clinical Light'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    onResetDemoData();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-highest text-body-sm text-on-surface transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">
                      restart_alt
                    </span>
                    Reset Default Telemetry
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
