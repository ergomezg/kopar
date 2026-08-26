import React from 'react';
import { Home, Receipt, PieChart, Settings } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'inicio' as ActiveTab, label: 'Inicio', icon: Home },
    { id: 'actividad' as ActiveTab, label: 'Historial', icon: Receipt },
    { id: 'presupuesto' as ActiveTab, label: 'Presupuesto', icon: PieChart },
    { id: 'hogar' as ActiveTab, label: 'Ajustes', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff] border-t border-[#dedfe2]">
      <div className="max-w-lg mx-auto flex items-center justify-around px-4 py-2.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all ${
                isActive
                  ? 'bg-[#0052ff] text-[#ffffff] font-semibold'
                  : 'text-[#5b616e] hover:text-[#0a0b0d] hover:bg-[#f7f8f9]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-semibold tracking-wide uppercase mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
