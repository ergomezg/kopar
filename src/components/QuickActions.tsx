import React from 'react';
import { PlusCircle, Scale } from 'lucide-react';

interface QuickActionsProps {
  onOpenAddExpense: () => void;
  onOpenInvite: () => void;
  onOpenSettleModal: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenAddExpense,
  onOpenSettleModal,
}) => {
  return (
    <div className="flex flex-col gap-2.5 px-4 sm:px-6 mb-6">
      {/* 1. Add Expense Button - Primary Coinbase Blue Pill CTA */}
      <button
        onClick={onOpenAddExpense}
        className="w-full flex items-center justify-center gap-2 bg-[#0052ff] text-[#ffffff] hover:bg-[#0052ff]/90 py-3.5 px-6 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs"
      >
        <PlusCircle className="w-4 h-4 text-[#ffffff]" />
        <span>Añadir gasto</span>
      </button>

      {/* 2. Settle Accounts Button - Secondary Pill CTA */}
      <button
        onClick={onOpenSettleModal}
        className="w-full flex items-center justify-center gap-2 bg-[#ffffff] text-[#0a0b0d] hover:bg-[#f7f8f9] py-3.5 px-6 rounded-full text-xs font-semibold tracking-wide transition-all border border-[#dedfe2] cursor-pointer"
      >
        <Scale className="w-4 h-4 text-[#0052ff]" />
        <span>Saldar cuentas</span>
      </button>
    </div>
  );
};
