import React, { useState } from 'react';
import { X, Scale, CheckCircle2, ArrowRight, ShieldCheck, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Expense, Member } from '../../types';
import { formatAmount, formatDisplayName } from '../../utils/format';

interface SettleModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  members: Member[];
  currentMember: Member;
  currency: string;
  onSettlePeriod: (settlementNote: string) => void;
}

export const SettleModal: React.FC<SettleModalProps> = ({
  isOpen,
  onClose,
  expenses,
  members,
  currentMember,
  currency,
  onSettlePeriod,
}) => {
  const [settleNote, setSettleNote] = useState('Pago por PSE / Transferencia Bancaria');
  const [settledSuccess, setSettledSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total spent & breakdown per member
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Paid by each member
  const paidMap: Record<string, number> = {};
  // Owed share by each member
  const owedMap: Record<string, number> = {};

  members.forEach((m) => {
    paidMap[m.id] = 0;
    owedMap[m.id] = 0;
  });

  expenses.forEach((e) => {
    if (paidMap[e.paidById] !== undefined) {
      paidMap[e.paidById] += e.amount;
    }
    e.splits.forEach((s) => {
      if (owedMap[s.memberId] !== undefined) {
        owedMap[s.memberId] += s.amount;
      }
    });
  });

  // Calculate net balances: net = paid - share
  // If net > 0, member is owed money. If net < 0, member owes money.
  const netBalances = members.map((m) => {
    const paid = paidMap[m.id] || 0;
    const share = owedMap[m.id] || 0;
    return {
      member: m,
      paid,
      share,
      net: paid - share,
    };
  });

  // Find debtor and creditor for simple 2-person or pairwise settlement
  const debtors = netBalances.filter((b) => b.net < -0.01);
  const creditors = netBalances.filter((b) => b.net > 0.01);

  const handleConfirmSettle = () => {
    if (isSubmitting || expenses.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSettlePeriod(settleNote);
      setIsSubmitting(false);
      setSettledSuccess(true);
      setTimeout(() => {
        setSettledSuccess(false);
        onClose();
      }, 2000);
    }, 450);
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
            className="w-full max-w-lg bg-[#ffffff] rounded-t-[28px] sm:rounded-[28px] border border-[#dedfe2] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#dedfe2] bg-[#ffffff]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0052ff] text-[#ffffff] flex items-center justify-center font-bold">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display text-[22px] font-bold text-[#0a0b0d]">Poner cuentas al día</h2>
                  <p className="text-[11px] text-[#5b616e]">Registra las transferencias y mantén el equilibrio</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-[#f7f8f9] text-[#0a0b0d] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {settledSuccess ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-12 text-center space-y-3"
                >
                  <div className="w-16 h-16 rounded-full bg-[#27ad75]/10 text-[#27ad75] flex items-center justify-center mx-auto border border-[#27ad75]/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-[28px] font-extrabold text-[#0a0b0d]">¡Cuentas saldadas!</h3>
                  <p className="text-xs text-[#5b616e] max-w-xs mx-auto">
                    El balance entre los integrantes ha quedado en $0 y en completa armonía.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Total Spent Summary */}
                  <div className="bg-[#f7f8f9] text-[#0a0b0d] p-6 rounded-[24px] border border-[#dedfe2]">
                    <p className="text-[10px] font-semibold text-[#5b616e] uppercase tracking-widest">
                      Gasto total acumulado
                    </p>
                    <p className="font-display text-3xl font-extrabold text-[#0052ff] mt-0.5">
                      {formatAmount(totalSpent, currency)}
                    </p>
                    <p className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider mt-1">
                      {expenses.length} {expenses.length === 1 ? 'movimiento' : 'movimientos'}
                    </p>
                  </div>

                  {/* Individual Contribution Breakdown */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider">
                      Aportes vs. Cuota correspondiente:
                    </p>
                    <div className="space-y-2">
                      {netBalances.map((b) => (
                        <div
                          key={b.member.id}
                          className="p-4 rounded-[16px] bg-[#ffffff] border border-[#dedfe2] space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={b.member.avatar}
                                alt={b.member.name}
                                className="w-6 h-6 rounded-full object-cover border border-[#dedfe2]"
                              />
                              <span className="text-xs font-bold text-[#0a0b0d]">
                                {formatDisplayName(b.member.name)}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                b.net > 0
                                  ? 'border-[#27ad75]/30 bg-[#27ad75]/10 text-[#27ad75]'
                                  : b.net < 0
                                  ? 'border-[#f0616d]/30 bg-[#f0616d]/10 text-[#f0616d]'
                                  : 'border-[#dedfe2] bg-[#f7f8f9] text-[#5b616e]'
                              }`}
                            >
                              {b.net > 0
                                ? `Le deben ${formatAmount(b.net, currency)}`
                                : b.net < 0
                                ? `Debe ${formatAmount(Math.abs(b.net), currency)}`
                                : 'Al día ($0)'}
                            </span>
                          </div>

                          <div className="flex justify-between text-[11px] text-[#5b616e] pt-1.5 border-t border-[#dedfe2]">
                            <span>Pagó: {formatAmount(b.paid, currency)}</span>
                            <span>Le correspondía: {formatAmount(b.share, currency)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Settlement Net Debt Card */}
                  <div className="bg-[#f7f8f9] p-4 rounded-[16px] border border-[#dedfe2] space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0a0b0d] uppercase tracking-wider">
                      <span>Transferencias recomendadas:</span>
                    </div>

                    {debtors.length === 0 && creditors.length === 0 ? (
                      <p className="text-xs font-semibold text-[#5b616e]">
                        ¡No hay deudas pendientes! El balance de todos los integrantes está exactamente en $0.
                      </p>
                    ) : (
                      debtors.map((d) =>
                        creditors.map((c) => {
                          const amountToPay = Math.min(Math.abs(d.net), c.net);
                          if (amountToPay <= 0) return null;

                          return (
                            <div
                              key={`${d.member.id}-${c.member.id}`}
                              className="flex items-center justify-between bg-[#ffffff] p-3 rounded-full border border-[#dedfe2]"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-[#0a0b0d]">
                                  {formatDisplayName(d.member.name)}
                                </span>
                                <ArrowRight className="w-4 h-4 text-[#0052ff]" />
                                <span className="text-xs font-semibold text-[#0a0b0d]">
                                  {formatDisplayName(c.member.name)}
                                </span>
                              </div>
                              <span className="text-sm font-bold text-[#0052ff]">
                                {formatAmount(amountToPay, currency)}
                              </span>
                            </div>
                          );
                        })
                      )
                    )}
                  </div>

                  {/* Settlement Note Field */}
                  <div>
                    <label className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider block mb-1">
                      Método o nota de pago
                    </label>
                    <input
                      type="text"
                      value={settleNote}
                      onChange={(e) => setSettleNote(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full border border-[#dedfe2] text-xs font-semibold text-[#0a0b0d] bg-[#ffffff] focus:ring-2 focus:ring-[#0052ff] focus:outline-none"
                      placeholder="Ej: Transferencia Bancolombia, Nequi, PSE, Efectivo"
                    />
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <motion.button
                      whileHover={!isSubmitting && expenses.length > 0 ? { scale: 1.01 } : undefined}
                      whileTap={!isSubmitting && expenses.length > 0 ? { scale: 0.98 } : undefined}
                      onClick={handleConfirmSettle}
                      disabled={isSubmitting || expenses.length === 0}
                      className="w-full py-3.5 px-4 rounded-full bg-[#0052ff] hover:bg-[#0045d8] disabled:bg-[#dedfe2] disabled:text-[#8a919e] text-[#ffffff] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#ffffff]" />
                          <span>Registrando liquidación...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-[#ffffff]" />
                          <span>Registrar pago y dejar cuentas en $0</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

