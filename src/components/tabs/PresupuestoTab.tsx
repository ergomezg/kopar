import React, { useState } from 'react';
import { AlertCircle, SlidersHorizontal, TrendingUp, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { Category, Expense } from '../../types';
import { EditBudgetModal } from '../modals/EditBudgetModal';
import { CategoryBudgetCard } from '../budget/CategoryBudgetCard';
import { analyzeBudgetHealth } from '../../utils/budgetInsights';
import { formatAmount } from '../../utils/format';

interface PresupuestoTabProps {
  categories: Category[];
  expenses: Expense[];
  currency: string;
  onUpdateCategoryBudget: (categoryId: string, newLimit: number) => void;
  onUpdateAllBudgets?: (updatedBudgets: Record<string, number>) => void;
}

export const PresupuestoTab: React.FC<PresupuestoTabProps> = ({
  categories,
  expenses,
  currency,
  onUpdateCategoryBudget,
  onUpdateAllBudgets,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Deterministic Financial Insights & Health Analysis
  const report = analyzeBudgetHealth(categories, expenses, currency);
  const { totalBudget, totalSpent, overallExecutionPct, categorySpending, insights } = report;

  const categorySpentMap: Record<string, number> = {};
  Object.keys(categorySpending).forEach((id) => {
    categorySpentMap[id] = categorySpending[id].spent;
  });

  const handleSaveAllBudgets = (updatedBudgets: Record<string, number>) => {
    if (onUpdateAllBudgets) {
      onUpdateAllBudgets(updatedBudgets);
    } else {
      Object.entries(updatedBudgets).forEach(([catId, limit]) => {
        onUpdateCategoryBudget(catId, limit);
      });
    }
  };

  return (
    <div className="px-4 sm:px-6 py-6 pb-28 space-y-5 max-w-xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#dedfe2] pb-3">
        <h2 className="font-display text-[28px] font-extrabold text-[#0a0b0d] tracking-tight">Presupuesto del hogar</h2>
        <p className="text-xs text-[#5b616e]">Límites, consumo y diagnóstico financiero determinista</p>
      </div>

      {/* Overall Budget Header Card */}
      <div className="bg-[#ffffff] text-[#0a0b0d] p-6 rounded-[24px] border border-[#dedfe2] space-y-4">
        <div>
          <p className="text-[10px] font-semibold text-[#5b616e] uppercase tracking-widest">
            Presupuesto total
          </p>
          <p className="text-[24px] font-extrabold text-[#0a0b0d] leading-tight mt-0.5">
            {currency}{totalSpent.toLocaleString('es-CO')} / <span className="text-[#8a919e]">{currency}{totalBudget.toLocaleString('es-CO')}</span>
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-[#eef0f3] h-2.5 rounded-full overflow-hidden border border-[#dedfe2]">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              overallExecutionPct > 100
                ? 'bg-[#f0616d]'
                : overallExecutionPct > 90
                ? 'bg-[#f0616d]/80'
                : 'bg-[#0052ff]'
            }`}
            style={{ width: `${Math.min(overallExecutionPct, 100)}%` }}
          />
        </div>

        {/* Below Progress Bar Info */}
        <div className="flex items-center justify-between text-xs text-[#5b616e]">
          <span>
            {totalSpent > totalBudget ? (
              <span className="text-[#f0616d] font-bold">
                Excedido en: {currency}{(totalSpent - totalBudget).toLocaleString('es-CO')}
              </span>
            ) : (
              <span>
                Disponible: <strong className="text-[#0a0b0d]">{currency}{Math.max(totalBudget - totalSpent, 0).toLocaleString('es-CO')}</strong>
              </span>
            )}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-0.5 rounded-full border ${
              overallExecutionPct > 100
                ? 'border-[#f0616d]/30 bg-[#f0616d]/10 text-[#f0616d]'
                : overallExecutionPct > 90
                ? 'border-[#f0616d]/30 bg-[#f0616d]/10 text-[#f0616d]'
                : 'border-[#0052ff]/30 bg-[#0052ff]/10 text-[#0052ff]'
            }`}
          >
            {overallExecutionPct > 100 && <AlertCircle className="w-3.5 h-3.5" />}
            <span>{overallExecutionPct.toFixed(0)}% ejecutado</span>
          </span>
        </div>

        {/* Footer Action Button */}
        <div className="pt-3 border-t border-[#dedfe2]">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-full border border-[#dedfe2] bg-[#ffffff] hover:bg-[#f7f8f9] hover:border-[#0052ff]/40 text-[#0052ff] text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Editar presupuesto</span>
          </button>
        </div>
      </div>

      {/* Deterministic Financial Insights Section */}
      {insights.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[14px] font-bold text-[#0a0b0d] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#0052ff]" />
            <span>Diagnóstico del periodo</span>
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {insights.map((insight) => {
              const isDanger = insight.type === 'danger';
              const isWarning = insight.type === 'warning';
              const isSuccess = insight.type === 'success';

              return (
                <div
                  key={insight.id}
                  className={`p-3.5 rounded-[16px] border flex items-start gap-3 transition-all ${
                    isDanger
                      ? 'bg-[#f0616d]/10 border-[#f0616d]/30 text-[#0a0b0d]'
                      : isWarning
                      ? 'bg-[#f59e0b]/10 border-[#f59e0b]/30 text-[#0a0b0d]'
                      : isSuccess
                      ? 'bg-[#27ad75]/10 border-[#27ad75]/30 text-[#0a0b0d]'
                      : 'bg-[#f7f8f9] border-[#dedfe2] text-[#0a0b0d]'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDanger && <AlertCircle className="w-4 h-4 text-[#f0616d]" />}
                    {isWarning && <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />}
                    {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#27ad75]" />}
                    {!isDanger && !isWarning && !isSuccess && <Info className="w-4 h-4 text-[#0052ff]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold truncate text-[#0a0b0d]">{insight.title}</h4>
                      {insight.metric && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffffff] border border-[#dedfe2] text-[#0a0b0d] shrink-0">
                          {insight.metric}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#5b616e] mt-0.5 leading-snug">{insight.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        <p className="text-[16px] leading-[24px] font-semibold text-[#5b616e] uppercase tracking-wider border-b border-[#dedfe2] pb-2">
          Desglose por categoría:
        </p>

        {categories.map((cat) => (
          <CategoryBudgetCard
            key={cat.id}
            category={cat}
            currency={currency}
            mode="display"
            spent={categorySpentMap[cat.id] || 0}
            budgetLimit={cat.budgetLimit}
            totalHouseholdBudget={totalBudget}
          />
        ))}
      </div>

      {/* Edit Budget Modal */}
      <EditBudgetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        categories={categories}
        currency={currency}
        categorySpentMap={categorySpentMap}
        onSaveBudgets={handleSaveAllBudgets}
      />
    </div>
  );
};
