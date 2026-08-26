import React from 'react';
import { 
  Home, 
  Repeat, 
  Compass, 
  AlertTriangle, 
  PieChart,
  Lock,
  Unlock
} from 'lucide-react';
import { Category } from '../../types';

export interface CategoryBudgetCardProps {
  category: Category;
  currency: string;
  mode: 'interactive' | 'display';

  // Props for mode="interactive"
  percentage?: number;
  totalBudget?: number;
  isLocked?: boolean;
  onToggleLock?: (categoryId: string) => void;
  onPercentageChange?: (categoryId: string, percentage: number) => void;

  // Props for mode="display"
  spent?: number;
  budgetLimit?: number;
  totalHouseholdBudget?: number;
}

export const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({
  category,
  currency,
  mode,
  percentage = 0,
  totalBudget = 0,
  isLocked = false,
  onToggleLock,
  onPercentageChange,
  spent = 0,
  budgetLimit = 0,
  totalHouseholdBudget = 0,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-4 h-4" />;
      case 'Repeat':
        return <Repeat className="w-4 h-4" />;
      case 'Compass':
        return <Compass className="w-4 h-4" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <PieChart className="w-4 h-4" />;
    }
  };

  if (mode === 'interactive') {
    const calculatedAmount =
      totalBudget > 0 ? Math.round((totalBudget * percentage) / 100) : 0;

    return (
      <div className="bg-[#ffffff] border border-[#dedfe2] rounded-[16px] p-3.5 flex flex-col gap-2.5 transition-all shadow-2xs hover:border-[#0052ff]/40">
        {/* Row 1: Left = Icon + Name + Description; Right = Calculated Money Amount */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 font-bold"
              style={{ backgroundColor: `${category.color}15`, color: category.color }}
            >
              {getCategoryIcon(category.icon)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0a0b0d] truncate">
                {category.name}
              </p>
              {category.definition && (
                <p className="text-[11px] text-[#5b616e] truncate mt-0.5" title={category.definition}>
                  {category.definition}
                </p>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs sm:text-sm font-bold text-[#0a0b0d]">
              {currency}{calculatedAmount.toLocaleString('es-CO')}
            </p>
            <p className="text-[10px] font-medium text-[#8a919e]">
              Cuota estimada
            </p>
          </div>
        </div>

        {/* Row 2: Ergonomic Slider & Percentage Input Pill + Lock Toggle */}
        <div className="flex items-center gap-2.5 pt-1 border-t border-[#dedfe2]/60">
          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={percentage}
              onChange={(e) =>
                onPercentageChange?.(category.id, Number(e.target.value))
              }
              className="w-full h-2 bg-[#eef0f3] rounded-full appearance-none cursor-pointer accent-[#0052ff]"
              style={{
                background: `linear-gradient(to right, ${category.color} 0%, ${category.color} ${percentage}%, #eef0f3 ${percentage}%, #eef0f3 100%)`
              }}
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Lock button */}
            <button
              type="button"
              onClick={() => onToggleLock?.(category.id)}
              title={isLocked ? 'Porcentaje bloqueado (no se modificará al ajustar)' : 'Bloquear porcentaje'}
              className={`h-7.5 w-7.5 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                isLocked
                  ? 'bg-[#0052ff]/10 border-[#0052ff]/30 text-[#0052ff]'
                  : 'bg-[#f7f8f9] border-[#dedfe2] text-[#8a919e] hover:text-[#0a0b0d] hover:border-[#8a919e]'
              }`}
            >
              {isLocked ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Unlock className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Numeric input */}
            <div className="relative w-15">
              <input
                type="number"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) =>
                  onPercentageChange?.(
                    category.id,
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full h-7.5 pr-5 pl-2 text-right bg-[#f7f8f9] border border-[#dedfe2] rounded-full text-xs font-bold text-[#0a0b0d] focus:outline-none focus:border-[#0052ff] focus:bg-[#ffffff] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#5b616e] pointer-events-none select-none">
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // mode === 'display'
  const limit = budgetLimit > 0 ? budgetLimit : category.budgetLimit || 1;
  const executionPct = limit > 0 ? (spent / limit) * 100 : 0;
  const assignedPct =
    totalHouseholdBudget > 0
      ? Math.round((limit / totalHouseholdBudget) * 100)
      : 0;

  return (
    <div className="bg-[#ffffff] border border-[#dedfe2] rounded-[16px] p-4 flex flex-col gap-3 transition-all">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
              style={{ backgroundColor: `${category.color}15`, color: category.color }}
            >
              {getCategoryIcon(category.icon)}
            </div>
            <p className="text-sm font-bold text-[#0a0b0d] truncate">
              {category.name}
            </p>
          </div>

          {/* Top Right Assigned Percentage */}
          {assignedPct > 0 && (
            <span className="text-xs font-semibold text-[#5b616e] shrink-0">
              {assignedPct}% asignado
            </span>
          )}
        </div>

        {/* Full-width Definition */}
        {category.definition && (
          <p className="text-[11px] text-[#5b616e] leading-relaxed break-words w-full">
            {category.definition}
          </p>
        )}
      </div>

      {/* Execution Progress Bar */}
      <div className="w-full bg-[#eef0f3] h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            executionPct > 100 
              ? 'bg-[#f0616d]' 
              : executionPct > 90 
              ? 'bg-[#f0616d]/80' 
              : 'bg-[#0052ff]'
          }`}
          style={{ width: `${Math.min(executionPct, 100)}%` }}
        />
      </div>

      {/* Footer: Spent / Limit on the left, Executed % on the right */}
      <div className="flex items-center justify-between text-xs text-[#5b616e]">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-[#0a0b0d]">
            {currency}
            {spent.toLocaleString('es-CO')}
          </span>
          <span>de</span>
          <span>
            {currency}
            {limit.toLocaleString('es-CO')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {executionPct > 100 && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#f0616d]/10 border border-[#f0616d]/20 text-[10px] font-bold text-[#f0616d]">
              <AlertTriangle className="w-3 h-3" />
              <span>Sobregiro</span>
            </span>
          )}
          <span
            className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap"
            style={{
              backgroundColor: `${category.color}15`,
              color: category.color,
              borderColor: `${category.color}35`,
            }}
          >
            {executionPct.toFixed(0)}% ejecutado
          </span>
        </div>
      </div>
    </div>
  );
};
