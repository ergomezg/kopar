import React, { useState, useRef, useEffect } from 'react';
import { ArrowDown, ArrowUp, Camera, Plus, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Expense, Member } from '../types';
import { CustomCoverModal } from './modals/CustomCoverModal';

interface BalanceCardProps {
  currentMember: Member;
  expenses: Expense[];
  currency: string;
  onOpenSettleModal: () => void;
  householdName?: string;
  coverImage?: string;
  onUpdateCoverImage?: (newUrl: string) => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  currentMember,
  expenses,
  currency,
  onOpenSettleModal,
  householdName = 'Apartamento 402',
  coverImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  onUpdateCoverImage,
}) => {
  const [isCustomizingCover, setIsCustomizingCover] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  // Calculate teDeben and debes for currentMember
  let debes = 0;
  let teDeben = 0;

  expenses.forEach((expense) => {
    if (expense.paidById === currentMember.id) {
      expense.splits.forEach((split) => {
        if (split.memberId !== currentMember.id) {
          teDeben += split.amount;
        }
      });
    } else {
      expense.splits.forEach((split) => {
        if (split.memberId === currentMember.id) {
          debes += split.amount;
        }
      });
    }
  });

  const netBalance = teDeben - debes;

  return (
    <div className="px-3 pb-3 pt-[18px] sm:px-4 sm:pb-4 sm:pt-[18px]">
      <div className="flex flex-col rounded-[24px] bg-[#ffffff] border border-[#dedfe2] relative">
        {/* Editorial Photo Banner */}
        <div 
          className="w-full bg-center bg-no-repeat h-[160px] bg-cover relative border-b border-[#dedfe2] rounded-t-[23px] overflow-hidden group"
          style={{
            backgroundImage: `url('${coverImage}')`,
          }}
        >
          <div className="absolute inset-0 bg-[#0a0b0d]/20 h-[160px] w-full" />

          {/* Household Name Pill in Top Left */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0a0b0d]/75 backdrop-blur-xs text-[#ffffff] text-xs font-semibold border border-[#ffffff]/25 shadow-xs">
              {householdName}
            </span>
          </div>

          {/* Personalize Photo Button directly on the image */}
          <button
            onClick={() => setIsCustomizingCover(true)}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-[#0a0b0d]/80 hover:bg-[#0052ff] text-[#ffffff] border border-[#ffffff]/30 p-2 rounded-full transition-all backdrop-blur-xs flex items-center justify-center cursor-pointer"
            title="Personalizar foto de portada"
            aria-label="Personalizar foto de portada"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex w-full flex-col pt-4 px-4 pb-4 sm:pt-4 sm:px-5 sm:pb-5 bg-[#ffffff] text-[#0a0b0d] rounded-b-[23px]">
          <h2 className="font-display text-[28px] sm:text-[32px] font-extrabold leading-tight text-[#0a0b0d] tracking-tight">
            Balance general
          </h2>
          <p className="text-[12px] leading-[16px] text-[#5b616e] mt-1 mb-4">
            Deudas, cobros y saldo neto del hogar.
          </p>

          {/* Net Summary Block structured according to low-fidelity wireframe */}
          <div className="flex flex-col rounded-[16px] bg-[#f7f8f9] border border-[#dedfe2] relative">
            {/* Top Block: Balance neto */}
            <div className="p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-1.5 relative rounded-t-[15px]">
              <div className="relative inline-flex items-center justify-center gap-1.5" ref={tooltipRef}>
                <span className="text-[15px] font-medium text-[#5b616e]">
                  Balance neto
                </span>
                <button
                  type="button"
                  onClick={() => setShowTooltip((prev) => !prev)}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[#8a919e] hover:text-[#0052ff] hover:bg-[#eef0f3] focus:outline-hidden focus:ring-2 focus:ring-[#0052ff]/30 transition-colors cursor-pointer"
                  aria-label="¿Qué es el balance neto?"
                  title="¿Qué es el balance neto?"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>

                {/* Tooltip Content (Option 3) */}
                <AnimatePresence>
                  {showTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 max-w-[calc(100vw-48px)] p-3 rounded-[14px] bg-[#0a0b0d] text-[#ffffff] text-left text-[12px] leading-[17px] font-normal shadow-xl z-50 pointer-events-none"
                      role="tooltip"
                    >
                      <p>
                        Es la diferencia entre lo que te deben y lo que debes. Si es positivo, tienes saldo a favor; si es negativo, te toca ponerte al día.
                      </p>
                      {/* Tooltip arrow pointer */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-[#0a0b0d]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-baseline justify-center gap-2">
                <span
                  className={`font-display text-[26px] sm:text-[30px] font-extrabold tracking-tight leading-tight ${
                    netBalance < 0
                      ? 'text-[#f0616d]'
                      : netBalance > 0
                      ? 'text-[#27ad75]'
                      : 'text-[#0a0b0d]'
                  }`}
                >
                  {netBalance < 0
                    ? `-${currency}${Math.abs(netBalance).toLocaleString('es-CO')}`
                    : netBalance > 0
                    ? `+${currency}${netBalance.toLocaleString('es-CO')}`
                    : `${currency}0`}
                </span>
              </div>
            </div>

            {/* Bottom 2-Column Split: Debes | Te deben */}
            <div className="grid grid-cols-2 border-t border-[#dedfe2] bg-[#ffffff]/60 rounded-b-[15px] overflow-hidden">
              {/* Col 1: Debes */}
              <div className="p-3.5 sm:p-4 border-r border-[#dedfe2] flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#f0616d]/10 border border-[#f0616d]/30 flex items-center justify-center text-[#f0616d] shrink-0">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[13px] sm:text-[14px] font-semibold text-[#0a0b0d]">
                    Debes
                  </span>
                </div>
                <span className="font-display text-[15px] sm:text-[17px] font-bold text-[#f0616d]">
                  {currency}{debes.toLocaleString('es-CO')}
                </span>
              </div>

              {/* Col 2: Te deben */}
              <div className="p-3.5 sm:p-4 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#27ad75]/10 border border-[#27ad75]/30 flex items-center justify-center text-[#27ad75] shrink-0">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[13px] sm:text-[14px] font-semibold text-[#0a0b0d]">
                    Te deben
                  </span>
                </div>
                <span className="font-display text-[15px] sm:text-[17px] font-bold text-[#27ad75]">
                  {currency}{teDeben.toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCustomizingCover && (
        <CustomCoverModal
          currentCover={coverImage}
          onSaveCover={(newUrl) => {
            if (onUpdateCoverImage) {
              onUpdateCoverImage(newUrl);
            }
          }}
          onClose={() => setIsCustomizingCover(false)}
        />
      )}
    </div>
  );
};
