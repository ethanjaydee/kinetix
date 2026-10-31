import React from 'react';
import { TabId } from '../types';

interface BottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

const NAV_ITEMS: { id: TabId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
  { id: 'nutrition', label: 'Nutrition', icon: 'center_focus_strong' },
  { id: 'body-comp', label: 'Body Comp', icon: 'accessibility_new' },
  { id: 'workouts', label: 'Workouts', icon: 'fitness_center' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/90 backdrop-blur-lg border-t border-outline-variant/20 transition-colors duration-200"
      aria-label="Primary Bottom Navigation"
    >
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 w-20 py-1 transition-colors group ${
                isActive ? 'text-primary' : 'text-outline hover:text-on-surface-variant'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`w-12 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-primary/15'
                    : 'group-hover:bg-surface-container-high'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isActive ? 'icon-filled' : ''
                  }`}
                >
                  {item.icon}
                </span>
              </div>
              <span
                className={`text-label-sm ${
                  isActive ? 'font-semibold text-primary' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
