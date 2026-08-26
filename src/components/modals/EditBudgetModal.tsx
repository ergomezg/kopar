import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  PieChart, 
  Check, 
  AlertCircle, 
  RotateCcw,
  Loader2
} from 'lucide-react';
import { Category } from '../../types';
import { CategoryBudgetCard } from '../budget/CategoryBudgetCard';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currency: string;
  categorySpentMap: Record<string, number>;
  onSaveBudgets: (updatedBudgets: Record<string, number>) => void;
}

const DEFAULT_CATEGORY_PERCENTAGES: Record<string, number> = {
  cat_fijos: 50,
  cat_recurrentes: 20,
  cat_ocasionales: 20,
  cat_imprevistos: 10,
};

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({
  isOpen,
  onClose,
  categories,
  currency,
  categorySpentMap,
  onSaveBudgets,
}) => {
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState<number | ''>(5200000);
  const [categoryPercentages, setCategoryPercentages] = useState<Record<string, number>>({});
  const [lockedCategoryIds, setLockedCategoryIds] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentSum = categories.reduce((acc, cat) => acc + (cat.budgetLimit || 0), 0);
      const total = currentSum > 0 ? currentSum : 5200000;
      setTotalMonthlyBudget(total);

      // Calculate initial percentages based on existing budget limits
      const pcts: Record<string, number> = {};
      categories.forEach((cat) => {
        if (currentSum > 0) {
          pcts[cat.id] = Math.round(((cat.budgetLimit || 0) / currentSum) * 100);
        } else {
          pcts[cat.id] = DEFAULT_CATEGORY_PERCENTAGES[cat.id] ?? Math.round(100 / categories.length);
        }
      });

      // Normalize if slight rounding drift
      const sumPcts = Object.values(pcts).reduce((a, b) => a + b, 0);
      if (sumPcts !== 100 && categories.length > 0) {
        const diff = 100 - sumPcts;
        pcts[categories[0].id] = (pcts[categories[0].id] || 0) + diff;
      }

      setCategoryPercentages(pcts);
      setLockedCategoryIds({});
    }
  }, [isOpen, categories]);

  const totalPercentage = Object.values(categoryPercentages).reduce<number>(
    (acc, val) => acc + Number(val || 0),
    0
  );
  const isPercentageBalanced = totalPercentage === 100;
  const isFormValid = Number(totalMonthlyBudget) > 0 && isPercentageBalanced;

  const handlePercentageChange = (categoryId: string, value: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));
    setCategoryPercentages((prev) => ({
      ...prev,
      [categoryId]: clamped,
    }));
  };

  const handleToggleLock = (categoryId: string) => {
    setLockedCategoryIds((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleResetPercentages = () => {
    setCategoryPercentages(DEFAULT_CATEGORY_PERCENTAGES);
    setLockedCategoryIds({});
  };

  const handleAutoBalancePercentages = () => {
    if (categories.length === 0) return;
    const keys = categories.map((c) => c.id);
    
    // Identify locked vs unlocked categories
    const lockedKeys = keys.filter((k) => lockedCategoryIds[k]);
    const unlockedKeys = keys.filter((k) => !lockedCategoryIds[k]);

    // If all are locked or none unlocked, we cannot adjust unlocked categories
    if (unlockedKeys.length === 0) {
      return;
    }

    // Calculate sum of locked percentages
    const lockedSum = lockedKeys.reduce((acc, k) => acc + (categoryPercentages[k] || 0), 0);
    const targetUnlockedTotal = Math.max(0, 100 - lockedSum);

    const newPercentages: Record<string, number> = { ...categoryPercentages };

    // Sum of currently assigned percentages to unlocked categories
    const currentUnlockedSum = unlockedKeys.reduce((acc, k) => acc + (categoryPercentages[k] || 0), 0);

    if (currentUnlockedSum === 0 || targetUnlockedTotal === 0) {
      // Distribute evenly among unlocked categories
      const baseShare = Math.floor(targetUnlockedTotal / unlockedKeys.length);
      let remainder = targetUnlockedTotal % unlockedKeys.length;

      unlockedKeys.forEach((key) => {
        const extra = remainder > 0 ? 1 : 0;
        newPercentages[key] = baseShare + extra;
        if (remainder > 0) remainder--;
      });
    } else {
      // Distribute proportionally based on current non-zero ratios
      let accumulated = 0;
      unlockedKeys.forEach((key, index) => {
        if (index === unlockedKeys.length - 1) {
          newPercentages[key] = Math.max(0, targetUnlockedTotal - accumulated);
        } else {
          const ratio = (categoryPercentages[key] || 0) / currentUnlockedSum;
          const assigned = Math.round(ratio * targetUnlockedTotal);
          newPercentages[key] = assigned;
          accumulated += assigned;
        }
      });
    }

    setCategoryPercentages(newPercentages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    const updatedBudgets: Record<string, number> = {};
    categories.forEach((cat) => {
      const pct = categoryPercentages[cat.id] ?? 0;
      updatedBudgets[cat.id] = Math.round((Number(totalMonthlyBudget) * pct) / 100);
    });

    setTimeout(() => {
      onSaveBudgets(updatedBudgets);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0a0b0d]/60 backdrop-blur-xs p-0 sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg bg-[#ffffff] rounded-t-[28px] sm:rounded-[28px] border border-[#dedfe2] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Mobile Drag Handle Indicator */}
            <div className="pt-2.5 pb-1 block sm:hidden">
              <div className="w-12 h-1 bg-[#dedfe2] rounded-full mx-auto" />
            </div>

            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#dedfe2] flex items-center justify-between bg-[#ffffff]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0052ff]/10 text-[#0052ff] flex items-center justify-center shrink-0">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-[22px] font-bold text-[#0a0b0d]">
                    Editar presupuesto mensual
                  </h2>
                  <p className="text-xs text-[#5b616e] mt-0.5">
                    Ajusta el monto total y asigna porcentajes por categoría
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#5b616e] hover:text-[#0a0b0d] hover:bg-[#f7f8f9] transition-colors cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Presupuesto Total Mensual */}
              <div className="bg-[#f7f8f9] border border-[#dedfe2] rounded-[24px] p-5 flex flex-col gap-2">
                <label className="block text-[12px] font-semibold text-[#0a0b0d]">
                  Presupuesto total del hogar
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#5b616e] pointer-events-none select-none">
                    {currency}
                  </span>
                  <input
                    type="number"
                    value={totalMonthlyBudget}
                    onChange={(e) =>
                      setTotalMonthlyBudget(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    placeholder="5200000"
                    className="w-full h-11 pl-[60px] pr-3.5 bg-[#ffffff] border border-[#dedfe2] rounded-[12px] text-sm font-semibold text-[#0a0b0d] placeholder:text-[#8a919e] focus:outline-none focus:border-[#0052ff] transition-all leading-normal"
                  />
                </div>
                <p className="text-[11px] text-[#5b616e] mt-0.5">
                  Monto global que se distribuirá entre las categorías para el mes actual.
                </p>
              </div>

              {/* Distribución por Categorías */}
              <div className="bg-[#f7f8f9] border border-[#dedfe2] rounded-[24px] p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5b616e]">
                      Distribución por categorías
                    </span>
                    <p className="text-[11px] text-[#8a919e] mt-0.5">
                      Define la proporción de cada cuota sobre el 100% mensual
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetPercentages}
                    className="text-[11px] font-semibold text-[#0052ff] hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Sugeridos</span>
                  </button>
                </div>

                {/* Segmented Real-Time Distribution Bar */}
                <div className="flex flex-col gap-2 bg-[#ffffff] border border-[#dedfe2] p-3.5 rounded-[16px]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0a0b0d]">Distribución total</span>
                    <span className={`font-bold ${isPercentageBalanced ? 'text-[#27ad75]' : totalPercentage > 100 ? 'text-[#f0616d]' : 'text-[#0052ff]'}`}>
                      {totalPercentage}% / 100%
                    </span>
                  </div>

                  <div className="w-full bg-[#eef0f3] h-2.5 rounded-full overflow-hidden flex border border-[#dedfe2]/60">
                    {categories.map((cat) => {
                      const pct = categoryPercentages[cat.id] || 0;
                      if (pct <= 0) return null;
                      return (
                        <div
                          key={cat.id}
                          className="h-full transition-all duration-300 relative"
                          style={{
                            width: `${Math.min(pct, 100)}%`,
                            backgroundColor: cat.color,
                          }}
                          title={`${cat.name}: ${pct}%`}
                        />
                      );
                    })}
                    {totalPercentage > 100 && (
                      <div
                        className="h-full bg-[#f0616d] animate-pulse"
                        style={{ width: `${Math.min(totalPercentage - 100, 100)}%` }}
                        title="Exceso de porcentaje"
                      />
                    )}
                  </div>

                  {/* Mini Color Legend */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[10px] text-[#5b616e]">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="truncate">{cat.name}: <strong className="text-[#0a0b0d]">{categoryPercentages[cat.id] || 0}%</strong></span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* List of Category Cards with Slider */}
                <div className="flex flex-col gap-2.5">
                  {categories.map((category) => (
                    <CategoryBudgetCard
                      key={category.id}
                      category={category}
                      currency={currency}
                      mode="interactive"
                      percentage={categoryPercentages[category.id] ?? 0}
                      totalBudget={Number(totalMonthlyBudget) || 0}
                      isLocked={Boolean(lockedCategoryIds[category.id])}
                      onToggleLock={handleToggleLock}
                      onPercentageChange={handlePercentageChange}
                    />
                  ))}
                </div>

                {/* Balance Status Banner (Toast colors for confirmation/warning) & 1-Click Ghost Link */}
                <div
                  className={`rounded-[16px] px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border transition-all ${
                    isPercentageBalanced
                      ? 'bg-[#27ad75]/10 border-[#27ad75]/30 text-[#27ad75]'
                      : 'bg-[#f0616d]/10 border-[#f0616d]/30 text-[#f0616d]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isPercentageBalanced ? (
                      <>
                        <Check className="w-4 h-4 text-[#27ad75] shrink-0" />
                        <span className="text-xs font-semibold text-[#27ad75]">
                          Distribución balanceada (100% asignado)
                        </span>
                      </>
                    ) : totalPercentage > 100 ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-[#f0616d] shrink-0" />
                        <span className="text-xs font-semibold text-[#f0616d]">
                          Excedido por <strong className="font-extrabold">{totalPercentage - 100}%</strong> (Total: {totalPercentage}%)
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-[#f0616d] shrink-0" />
                        <span className="text-xs font-semibold text-[#f0616d]">
                          Falta asignar <strong className="font-extrabold">{100 - totalPercentage}%</strong> (Total: {totalPercentage}%)
                        </span>
                      </>
                    )}
                  </div>

                  {!isPercentageBalanced && (
                    <button
                      type="button"
                      onClick={handleAutoBalancePercentages}
                      className="text-[#0052ff] hover:text-[#0045d8] font-bold text-xs inline-flex items-center gap-1.5 hover:underline transition-colors cursor-pointer shrink-0 bg-transparent border-0 p-0 self-end sm:self-auto"
                    >
                      <span>Ajustar al 100%</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 pb-1 flex flex-col gap-2.5 border-t border-[#dedfe2] w-full">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full h-11 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isFormValid && !isSubmitting
                      ? 'bg-[#0052ff] hover:bg-[#0045d8] text-[#ffffff] cursor-pointer shadow-xs active:scale-[0.98]'
                      : 'bg-[#eef0f3] text-[#8a919e] cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#ffffff]" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Guardar presupuesto</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-full border border-[#dedfe2] text-xs font-semibold text-[#5b616e] hover:bg-[#f7f8f9] hover:text-[#0a0b0d] transition-colors cursor-pointer disabled:opacity-50 text-center flex items-center justify-center"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

