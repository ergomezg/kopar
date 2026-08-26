import React, { useState } from 'react';
import { AlertCircle, SlidersHorizontal } from 'lucide-react';
import { Category, Expense } from '../../types';
import { EditBudgetModal } from '../modals/EditBudgetModal';
import { CategoryBudgetCard } from '../budget/CategoryBudgetCard';

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

  // Compute spent per category
  const categorySpentMap: Record<string, number> = {};
  categories.forEach((c) => {
    categorySpentMap[c.id] = 0;
  });

  expenses.forEach((e) => {
    if (categorySpentMap[e.categoryId] !== undefined) {
      categorySpentMap[e.categoryId] += e.amount;
    }
  });

  const totalBudget = categories.reduce((acc, c) => acc + c.budgetLimit, 0);
  const totalSpent = Object.values(categorySpentMap).reduce((acc, v) => acc + v, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

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
        <p className="text-xs text-[#5b616e]">Límites y consumo por categorías</p>
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
              overallPercentage > 100
                ? 'bg-[#f0616d]'
                : overallPercentage > 90
                ? 'bg-[#f0616d]/80'
                : 'bg-[#0052ff]'
            }`}
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
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
              overallPercentage > 100
                ? 'border-[#f0616d]/30 bg-[#f0616d]/10 text-[#f0616d]'
                : overallPercentage > 90
                ? 'border-[#f0616d]/30 bg-[#f0616d]/10 text-[#f0616d]'
                : 'border-[#0052ff]/30 bg-[#0052ff]/10 text-[#0052ff]'
            }`}
          >
            {overallPercentage > 100 && <AlertCircle className="w-3.5 h-3.5" />}
            <span>{overallPercentage.toFixed(0)}% ejecutado</span>
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
