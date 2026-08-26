import React, { useState } from 'react';
import { X, Trash2, Calendar, FileText, Image as ImageIcon, Pencil, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Expense, Member } from '../../types';
import { formatAmount, formatDateDDMMAAAA, formatDisplayName } from '../../utils/format';

interface ExpenseDetailModalProps {
  expense: Expense | null;
  onClose: () => void;
  onEditExpense?: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  categories: Category[];
  members: Member[];
  currency: string;
}

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({
  expense,
  onClose,
  onEditExpense,
  onDeleteExpense,
  categories,
  members,
  currency,
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const category = expense ? categories.find((c) => c.id === expense.categoryId) : null;
  const payer = expense ? members.find((m) => m.id === expense.paidById) : null;

  return (
    <AnimatePresence>
      {expense && (
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
            className="w-full max-w-md bg-[#ffffff] rounded-t-[28px] sm:rounded-[28px] border border-[#dedfe2] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#dedfe2] bg-[#ffffff]">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-[#dedfe2]"
                  style={{ backgroundColor: category?.color || '#0a0b0d' }}
                />
                <h2 className="font-display text-[22px] font-bold text-[#0a0b0d]">Detalle del gasto</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-[#f7f8f9] text-[#0a0b0d] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Main Title & Amount Box */}
              <div className="bg-[#f7f8f9] text-[#0a0b0d] p-6 rounded-[24px] border border-[#dedfe2] text-center">
                <p className="font-display text-[22px] font-bold text-[#0a0b0d] mb-1">{expense.title}</p>
                <p className="font-display text-3xl font-extrabold text-[#0052ff]">
                  {formatAmount(expense.amount, currency)}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffffff] text-[#0a0b0d] text-xs font-semibold border border-[#dedfe2]">
                    <Calendar className="w-3.5 h-3.5 text-[#0052ff]" />
                    <span>{formatDateDDMMAAAA(expense.date)}</span>
                  </div>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#ffffff] shadow-xs"
                    style={{ backgroundColor: category?.color || '#0052ff' }}
                  >
                    <span>{category?.name || 'General'}</span>
                  </div>
                  {expense.subcategory && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ffffff] text-[#0a0b0d] text-xs font-bold border border-[#dedfe2]">
                      <span>{expense.subcategory}</span>
                    </div>
                  )}
                </div>
                {category?.definition && (
                  <p className="text-[11px] text-[#5b616e] mt-2.5 px-3 italic">
                    {category.definition}
                  </p>
                )}
              </div>

              {/* Paid by info */}
              <div className="p-4 rounded-[16px] bg-[#ffffff] border border-[#dedfe2] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#5b616e]">Pagado por:</span>
                <div className="flex items-center gap-2">
                  <img
                    src={payer?.avatar}
                    alt={payer?.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#dedfe2]"
                  />
                  <span className="text-xs font-bold text-[#0a0b0d]">
                    {payer ? formatDisplayName(payer.name) : 'Integrante'}
                  </span>
                </div>
              </div>

              {/* Splits Breakdown */}
              <div className="p-4 rounded-[16px] bg-[#ffffff] border border-[#dedfe2] space-y-2.5">
                <p className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider">
                  División de este gasto:
                </p>
                <div className="space-y-2">
                  {expense.splits.map((s) => {
                    const member = members.find((m) => m.id === s.memberId);
                    return (
                      <div key={s.memberId} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={member?.avatar}
                            alt={member?.name}
                            className="w-5 h-5 rounded-full object-cover border border-[#dedfe2]"
                          />
                          <span className="font-semibold text-[#0a0b0d]">
                            {member ? formatDisplayName(member.name) : 'Miembro'}
                          </span>
                        </div>
                        <span className="font-semibold text-[#0a0b0d]">
                          {formatAmount(s.amount, currency)} ({s.percentage.toFixed(0)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes if any */}
              {expense.notes && (
                <div className="p-4 rounded-[16px] bg-[#f7f8f9] border border-[#dedfe2] text-xs text-[#0a0b0d] flex items-start gap-2">
                  <FileText className="w-4 h-4 text-[#0052ff] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0a0b0d] mb-0.5">Notas:</p>
                    <p className="text-[#5b616e]">{expense.notes}</p>
                  </div>
                </div>
              )}

              {/* Receipt Image if available */}
              {expense.receiptUrl && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider flex items-center gap-1">
                    <ImageIcon className="w-4 h-4 text-[#0052ff]" />
                    Comprobante adjunto:
                  </p>
                  <div className="rounded-[16px] overflow-hidden border border-[#dedfe2] max-h-48">
                    <img
                      src={expense.receiptUrl}
                      alt="Comprobante"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Vertical Action Hierarchy */}
              <div className="pt-3 border-t border-[#dedfe2] flex flex-col gap-2.5 w-full">
                {/* 1. Cerrar - Botón primario */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full py-3.5 px-4 rounded-full bg-[#0052ff] hover:bg-[#0045d8] text-[#ffffff] font-bold text-sm transition-all shadow-xs flex items-center justify-center"
                >
                  Cerrar
                </motion.button>

                {/* 2. Editar - Botón secundario */}
                {onEditExpense && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onEditExpense(expense);
                    }}
                    className="w-full py-3 px-4 rounded-full bg-[#ffffff] hover:bg-[#f7f8f9] text-[#0a0b0d] font-semibold text-sm transition-all border border-[#dedfe2] flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Pencil className="w-4 h-4 text-[#0052ff]" />
                    <span>Editar gasto</span>
                  </motion.button>
                )}

                {/* 3. Eliminar - Botón secundario */}
                {isConfirmingDelete ? (
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-[16px] bg-[#fdf2f2] border border-[#f0616d]/30 w-full">
                    <span className="text-xs font-semibold text-[#f0616d] pl-2">¿Eliminar este gasto y recalcular balances?</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        disabled={isDeleting}
                        onClick={() => {
                          setIsDeleting(true);
                          setTimeout(() => {
                            onDeleteExpense(expense.id);
                            setIsDeleting(false);
                            setIsConfirmingDelete(false);
                            onClose();
                          }, 350);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#f0616d] hover:bg-[#e04f5b] disabled:opacity-50 text-[#ffffff] text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-white" />
                            <span>Borrando...</span>
                          </>
                        ) : (
                          <span>Sí, eliminar</span>
                        )}
                      </button>
                      <button
                        disabled={isDeleting}
                        onClick={() => setIsConfirmingDelete(false)}
                        className="px-3 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#f7f8f9] disabled:opacity-50 text-[#5b616e] text-xs font-semibold transition-all border border-[#dedfe2] cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsConfirmingDelete(true)}
                    className="w-full py-3 px-4 rounded-full bg-[#ffffff] hover:bg-[#f0616d]/10 text-[#f0616d] font-semibold text-sm transition-all border border-[#dedfe2] hover:border-[#f0616d]/40 flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Trash2 className="w-4 h-4 text-[#f0616d]" />
                    <span>Eliminar gasto</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

