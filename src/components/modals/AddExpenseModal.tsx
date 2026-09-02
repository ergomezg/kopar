import React, { useState, useEffect, useMemo } from 'react';
import { X, DollarSign, Calendar, Upload, AlertCircle, Check, Percent, Loader2, ChevronDown, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Expense, Member, SplitType } from '../../types';
import { formatAmount, formatDisplayName } from '../../utils/format';
import { matchCategoryFromTitle, MatchResult } from '../../utils/categoryMatcher';
import { detectPotentialDuplicates, DuplicateMatch } from '../../utils/duplicateDetector';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expenseData: Omit<Expense, 'id' | 'createdAt'>) => void;
  onUpdateExpense?: (expenseId: string, expenseData: Omit<Expense, 'id' | 'createdAt'>) => void;
  initialExpense?: Expense | null;
  categories: Category[];
  members: Member[];
  currentMember: Member;
  currency: string;
  existingExpenses?: Expense[];
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  onUpdateExpense,
  initialExpense,
  categories,
  members,
  currentMember,
  currency,
  existingExpenses = [],
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat_fijos');
  const [paidById, setPaidById] = useState(currentMember.id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [splitType, setSplitType] = useState<SplitType>('50_50');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-categorization state
  const [autoMatchedCategory, setAutoMatchedCategory] = useState<MatchResult | null>(null);
  const [hasManuallySelectedCategory, setHasManuallySelectedCategory] = useState(false);

  // Selected category object
  const currentCategory = categories.find((c) => c.id === categoryId) || categories[0];
  
  // Custom split percentages per member
  const [customPercentages, setCustomPercentages] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    const equalShare = members.length > 0 ? Math.round(100 / members.length) : 0;
    members.forEach((m, idx) => {
      if (idx === 0) {
        initial[m.id] = 100 - equalShare * (members.length - 1);
      } else {
        initial[m.id] = equalShare;
      }
    });
    return initial;
  });

  useEffect(() => {
    if (isOpen && initialExpense) {
      setTitle(initialExpense.title);
      setAmount(initialExpense.amount.toString());
      setCategoryId(initialExpense.categoryId);
      setPaidById(initialExpense.paidById);
      setDate(initialExpense.date);
      setHasManuallySelectedCategory(true);
      setAutoMatchedCategory(null);
      if (initialExpense.splits && initialExpense.splits.length > 0) {
        const splitsMap: Record<string, number> = {};
        initialExpense.splits.forEach((s) => {
          splitsMap[s.memberId] = s.percentage;
        });
        setCustomPercentages(splitsMap);
      }
    } else if (isOpen && !initialExpense) {
      setTitle('');
      setAmount('');
      setCategoryId(categories[0]?.id || 'cat_fijos');
      setPaidById(currentMember.id);
      setDate(new Date().toISOString().split('T')[0]);
      setSplitType('50_50');
      setReceiptFileName(null);
      setHasManuallySelectedCategory(false);
      setAutoMatchedCategory(null);
    }
  }, [isOpen, initialExpense, categories, currentMember.id]);

  // Reactive Deterministic Category Matcher on Title change
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!hasManuallySelectedCategory && newTitle.trim().length >= 2) {
      const match = matchCategoryFromTitle(newTitle);
      if (match) {
        setCategoryId(match.categoryId);
        setAutoMatchedCategory(match);
      } else {
        setAutoMatchedCategory(null);
      }
    }
  };

  const handleSelectCategory = (catId: string) => {
    setCategoryId(catId);
    setHasManuallySelectedCategory(true);
    setAutoMatchedCategory(null);
  };

  // Re-sync default percentages when members change
  useEffect(() => {
    setCustomPercentages((prev) => {
      const updated: Record<string, number> = {};
      const equalShare = members.length > 0 ? Math.floor(100 / members.length) : 0;
      let remainder = 100 - equalShare * members.length;
      members.forEach((m) => {
        if (prev[m.id] !== undefined) {
          updated[m.id] = prev[m.id];
        } else {
          updated[m.id] = equalShare + (remainder > 0 ? 1 : 0);
          if (remainder > 0) remainder--;
        }
      });
      return updated;
    });
  }, [members]);

  const numAmount = parseFloat(amount) || 0;

  // Real-time Duplicate Detection
  const potentialDuplicates = useMemo(() => {
    if (!isOpen || numAmount <= 0 || !title.trim()) return [];
    return detectPotentialDuplicates(
      {
        id: initialExpense?.id,
        title: title.trim(),
        amount: numAmount,
        categoryId,
        date,
        paidById,
      },
      existingExpenses
    );
  }, [isOpen, title, numAmount, categoryId, date, paidById, initialExpense?.id, existingExpenses]);

  // Compute calculated splits based on split type with exact accounting rounding compensation
  const calculateSplits = () => {
    if (members.length === 0) return [];
    if (splitType === '50_50') {
      const equalPercent = 100 / members.length;
      let distributed = 0;
      return members.map((m, idx) => {
        let amt: number;
        if (idx === members.length - 1) {
          amt = Math.max(0, numAmount - distributed);
        } else {
          amt = Math.round((numAmount * equalPercent) / 100);
          distributed += amt;
        }
        return {
          memberId: m.id,
          amount: amt,
          percentage: equalPercent,
        };
      });
    } else if (splitType === '100_PAID_BY_ME') {
      return members.map((m) => ({
        memberId: m.id,
        amount: m.id === paidById ? numAmount : 0,
        percentage: m.id === paidById ? 100 : 0,
      }));
    } else {
      // Custom percentage split with balance compensation
      let distributed = 0;
      return members.map((m, idx) => {
        const pct = customPercentages[m.id] || 0;
        let amt: number;
        if (idx === members.length - 1 && Math.abs(sumCustomPct - 100) < 0.01) {
          amt = Math.max(0, numAmount - distributed);
        } else {
          amt = Math.round((numAmount * pct) / 100);
          distributed += amt;
        }
        return {
          memberId: m.id,
          amount: amt,
          percentage: pct,
        };
      });
    }
  };

  const sumCustomPct = members.reduce((acc, m) => acc + (customPercentages[m.id] || 0), 0);
  const currentSplits = calculateSplits();
  const isCustomValid = splitType !== 'CUSTOM' || Math.abs(sumCustomPct - 100) < 0.01;

  // Auto-balance custom percentages to reach exactly 100%
  const handleAutoBalanceCustomPercentages = () => {
    if (members.length === 0) return;
    const equalShare = Math.floor(100 / members.length);
    let remainder = 100 - equalShare * members.length;
    const newPercentages: Record<string, number> = {};
    members.forEach((m) => {
      newPercentages[m.id] = equalShare + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
    });
    setCustomPercentages(newPercentages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || numAmount <= 0 || isSubmitting) return;
    if (!isCustomValid) return;

    setIsSubmitting(true);

    // Determine status relative to currentMember
    let status: 'PAGADO' | 'PENDIENTE' | 'DEBES' = 'PAGADO';
    if (paidById !== currentMember.id) {
      status = 'DEBES';
    } else {
      status = 'PAGADO';
    }

    const payload = {
      title: title.trim(),
      amount: numAmount,
      categoryId,
      paidById,
      date,
      receiptUrl: receiptFileName ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80' : (initialExpense?.receiptUrl || undefined),
      status,
      splits: currentSplits,
    };

    if (initialExpense && onUpdateExpense) {
      onUpdateExpense(initialExpense.id, payload);
    } else {
      onAddExpense(payload);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setTitle('');
      setAmount('');
      setReceiptFileName(null);
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
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0a0b0d]/60 backdrop-blur-xs p-0 sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg bg-[#ffffff] rounded-t-[28px] sm:rounded-[28px] border border-[#dedfe2] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#dedfe2] bg-[#ffffff]">
              <h2 className="font-display text-[22px] font-bold text-[#0a0b0d]">
                {initialExpense ? 'Editar gasto compartido' : 'Añadir gasto compartido'}
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-[#f7f8f9] text-[#0a0b0d] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Duplicate Warning Alert */}
              {potentialDuplicates.length > 0 && (
                <div className="p-3 rounded-[16px] bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#0a0b0d] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#b45309]">
                    <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0" />
                    <span>Posible gasto duplicado detectado</span>
                  </div>
                  <p className="text-[11px] text-[#5b616e] leading-snug">
                    {potentialDuplicates[0].reason}
                  </p>
                </div>
              )}

              {/* Amount Highlight Input with $ Label */}
              <div className="bg-[#f7f8f9] text-[#0a0b0d] p-6 rounded-[24px] border border-[#dedfe2] text-center flex flex-col items-center justify-center gap-1">
                <p className="text-[11px] font-semibold text-[#5b616e] uppercase tracking-wider">
                  Valor total pagado
                </p>
                <div className="relative inline-flex items-center justify-center w-full mt-1">
                  <span className="text-2xl font-display font-extrabold text-[#0052ff] mr-1">$</span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-4xl font-display font-extrabold text-[#0a0b0d] bg-transparent text-center focus:outline-none w-56 placeholder:text-[#8a919e]"
                  />
                </div>
              </div>

              {/* Title input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider block">
                    Descripción o detalle *
                  </label>
                  {autoMatchedCategory && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0052ff] bg-[#0052ff]/10 px-2 py-0.5 rounded-full border border-[#0052ff]/20">
                      <Sparkles className="w-3 h-3" />
                      Auto: {categories.find((c) => c.id === autoMatchedCategory.categoryId)?.name}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mercado Éxito, Recibo Luz, Cena Crepes"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-[#dedfe2] focus:ring-2 focus:ring-[#0052ff] focus:outline-none text-xs font-semibold text-[#0a0b0d] bg-[#ffffff]"
                />
              </div>

              {/* Category Selector */}
              <div>
                <label className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider block mb-1.5">
                  Categoría del gasto *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`flex items-center justify-between p-3 rounded-[16px] border text-xs font-semibold transition-all ${
                        categoryId === cat.id
                          ? 'border-[#0052ff] bg-[#0052ff] text-[#ffffff] shadow-sm'
                          : 'border-[#dedfe2] bg-[#ffffff] hover:border-[#0a0b0d] text-[#0a0b0d]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-3 h-3 rounded-full shrink-0 ${categoryId === cat.id ? 'border-2 border-[#ffffff]' : 'border border-[#dedfe2]'}`}
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      {categoryId === cat.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </motion.button>
                  ))}
                </div>

                {/* Definition note for selected category */}
                {currentCategory?.definition && (
                  <p className="text-[11px] text-[#5b616e] mt-2 px-1 italic">
                    💡 <strong>{currentCategory.name}:</strong> {currentCategory.definition}
                  </p>
                )}
              </div>

              {/* Who Paid & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider block mb-1">
                    ¿Quién pagó el gasto?
                  </label>
                  <div className="relative">
                    <select
                      value={paidById}
                      onChange={(e) => setPaidById(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 rounded-full border border-[#dedfe2] focus:ring-2 focus:ring-[#0052ff] focus:outline-none text-xs font-semibold bg-[#ffffff] text-[#0a0b0d] appearance-none cursor-pointer"
                    >
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {formatDisplayName(m.name)} {m.id === currentMember.id ? '(Tú)' : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#5b616e] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider block mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-[#dedfe2] focus:ring-2 focus:ring-[#0052ff] focus:outline-none text-xs font-semibold bg-[#ffffff] text-[#0a0b0d]"
                  />
                </div>
              </div>

              {/* Split Rule Selector */}
              <div className="pt-2 border-t border-[#dedfe2]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider block">
                    ¿Cómo se divide?
                  </label>
                  <span className="text-[11px] text-[#5b616e]">
                    {splitType === '50_50' ? 'Equitativo' : 'Ajustable'}
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setSplitType('50_50')}
                    className={`flex-1 py-2 px-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                      splitType === '50_50'
                        ? 'border-[#0052ff] bg-[#0052ff] text-[#ffffff]'
                        : 'border-[#dedfe2] bg-[#ffffff] text-[#5b616e] hover:border-[#0a0b0d]'
                    }`}
                  >
                    En partes iguales ({members.length > 0 ? (100 / members.length).toFixed(0) : 50}%)
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setSplitType('CUSTOM')}
                    className={`flex-1 py-2 px-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                      splitType === 'CUSTOM'
                        ? 'border-[#0052ff] bg-[#0052ff] text-[#ffffff]'
                        : 'border-[#dedfe2] bg-[#ffffff] text-[#5b616e] hover:border-[#0a0b0d]'
                    }`}
                  >
                    Por porcentaje (%)
                  </motion.button>
                </div>

                {/* Display calculated split breakdown */}
                <div className="mt-3 p-4 pb-4 rounded-[16px] bg-[#f7f8f9] border border-[#dedfe2] space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#5b616e] uppercase tracking-wider">
                    <span>Aporte de cada integrante:</span>
                    {splitType === 'CUSTOM' && (
                      <span className={`font-bold ${Math.abs(sumCustomPct - 100) < 0.01 ? 'text-[#27ad75]' : 'text-[#f0616d]'}`}>
                        Total: {sumCustomPct}% / 100%
                      </span>
                    )}
                  </div>

                  {members.map((m) => {
                    const split = currentSplits.find((s) => s.memberId === m.id);
                    const isPayer = m.id === paidById;
                    const calculatedSplitAmt = split?.amount || 0;

                    return (
                      <div key={m.id} className="py-1.5 mb-[10px] pb-[10px] border-b last:border-b-0 border-[#dedfe2]/40">
                        <div className="flex items-center justify-between text-xs gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <img
                              src={m.avatar}
                              alt={m.name}
                              className="w-7 h-7 shrink-0 rounded-full object-cover border border-[#dedfe2]"
                            />
                            <span className="font-bold text-[#0a0b0d] text-xs truncate">
                              {formatDisplayName(m.name)}
                            </span>
                          </div>

                          {splitType === 'CUSTOM' ? (
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="flex items-center gap-0.5 bg-[#ffffff] px-2 py-0.5 rounded-full border border-[#dedfe2] focus-within:ring-2 focus-within:ring-[#0052ff]">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  className="w-7 text-right font-bold text-xs text-[#0a0b0d] bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  value={customPercentages[m.id] !== undefined ? customPercentages[m.id] : ''}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    setCustomPercentages((prev) => ({
                                      ...prev,
                                      [m.id]: val,
                                    }));
                                  }}
                                />
                                <span className="text-[#5b616e] font-bold text-[11px] select-none">%</span>
                              </div>
                              <span className="font-bold text-xs text-[#0052ff] text-right shrink-0 whitespace-nowrap">
                                {formatAmount(calculatedSplitAmt, currency)}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#ffffff] text-[#5b616e] border border-[#dedfe2]">
                                {split?.percentage.toFixed(0)}%
                              </span>
                              <span className="font-bold text-xs text-[#0052ff] text-right shrink-0 whitespace-nowrap">
                                {formatAmount(calculatedSplitAmt, currency)}
                              </span>
                            </div>
                          )}
                        </div>

                        {isPayer && (
                          <div className="pl-[38px] mt-1">
                            <span className="inline-block text-[9.5px] leading-tight font-semibold text-[#0052ff] bg-[#0052ff]/10 px-2 py-0.5 rounded-full border border-[#0052ff]/20">
                              (Pagó)
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {splitType === 'CUSTOM' && !isCustomValid && (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-[12px] bg-[#f0616d]/10 border border-[#f0616d]/20 text-[#f0616d] text-xs font-semibold">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="truncate">
                          Suma: {sumCustomPct}% (debe ser 100%)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoBalanceCustomPercentages}
                        className="shrink-0 px-2.5 py-1 rounded-full bg-[#f0616d] hover:bg-[#d94a56] text-[#ffffff] text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>Ajustar 100%</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Receipt Upload Simulation */}
              <div className="pt-2 border-t border-[#dedfe2]">
                <label className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider block my-1">
                  Adjuntar comprobante o recibo (opcional)
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full border border-[#dedfe2] text-xs font-semibold text-[#0a0b0d] bg-[#ffffff] hover:bg-[#f7f8f9] transition-all">
                    <Upload className="w-4 h-4 text-[#0052ff]" />
                    <span>{receiptFileName ? 'Cambiar recibo' : 'Subir imagen'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setReceiptFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                  {receiptFileName && (
                    <span className="text-xs font-semibold text-[#0a0b0d] flex items-center gap-1 truncate">
                      <Check className="w-3.5 h-3.5 text-[#27ad75]" /> {receiptFileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-3">
                <motion.button
                  whileHover={!isSubmitting ? { scale: 1.01 } : undefined}
                  whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
                  type="submit"
                  disabled={numAmount <= 0 || !title.trim() || !isCustomValid || isSubmitting}
                  className="w-full py-3.5 px-4 rounded-full bg-[#0052ff] hover:bg-[#0045d8] disabled:bg-[#dedfe2] disabled:text-[#8a919e] text-[#ffffff] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#ffffff]" />
                      <span>{initialExpense ? 'Guardando cambios...' : 'Registrando y repartiendo...'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#ffffff]" />
                      <span>{initialExpense ? 'Guardar cambios' : 'Registrar y repartir'}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
