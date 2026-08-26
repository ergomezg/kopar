import React from 'react';
import { 
  Home, 
  Repeat, 
  Compass, 
  AlertTriangle, 
  Utensils, 
  Wifi, 
  ShoppingBag, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { Category, Expense, Member } from '../types';
import { formatRelativeDate, formatDisplayName } from '../utils/format';

interface RecentActivityProps {
  expenses: Expense[];
  categories: Category[];
  members: Member[];
  currentMember: Member;
  currency: string;
  onSelectExpense: (expense: Expense) => void;
  onViewAll: () => void;
  onOpenAddExpense?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  expenses,
  categories,
  members,
  currentMember,
  currency,
  onSelectExpense,
  onViewAll,
  onOpenAddExpense,
}) => {
  // Helper to get category icon component
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-4 h-4 text-white" />;
      case 'Repeat':
        return <Repeat className="w-4 h-4 text-white" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-white" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4 text-white" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-white" />;
      case 'Wifi':
        return <Wifi className="w-4 h-4 text-white" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-white" />;
    }
  };

  const getPayerName = (paidById: string) => {
    if (paidById === currentMember.id) return 'Tú pagaste';
    const payer = members.find((m) => m.id === paidById);
    return `${payer ? formatDisplayName(payer.name) : 'Alguien'} pagó`;
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'General';
  };

  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="px-4 sm:px-6 pb-28">
      <div className="flex items-center justify-between mb-4 border-b border-[#dedfe2] pb-3">
        <h3 className="font-display text-[#0a0b0d] text-[22px] font-extrabold tracking-tight">
          Actividad reciente
        </h3>
        <button
          onClick={onViewAll}
          className="text-[#578bfa] hover:text-[#0052ff] text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <span>Ver todo</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {recentExpenses.length === 0 ? (
          <div className="bg-[#ffffff] p-8 rounded-[24px] text-center border border-[#dedfe2] space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#eef0f3] text-[#0052ff] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#0a0b0d]">Aún no hay movimientos registrados</p>
              <p className="text-xs text-[#5b616e] max-w-xs mx-auto mt-1">
                Registra el primer gasto compartido para comenzar a llevar las cuentas claras en tu hogar.
              </p>
            </div>
            {onOpenAddExpense && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAddExpense}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0052ff] hover:bg-[#0045d8] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Registrar primer gasto</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          recentExpenses.map((expense) => {
            const category = categories.find((c) => c.id === expense.categoryId);
            const categoryIconName = category ? category.icon : 'Home';

            return (
              <div
                key={expense.id}
                onClick={() => onSelectExpense(expense)}
                className="flex items-center gap-4 bg-[#ffffff] border border-[#dedfe2] hover:bg-[#f7f8f9] p-4 rounded-[16px] transition-all cursor-pointer group"
              >
                {/* [ 1. ICONO ] */}
                <div
                  className="flex items-center justify-center rounded-full shrink-0 w-10 h-10 shadow-xs"
                  style={{ backgroundColor: category?.color || '#0a0b0d' }}
                >
                  {getCategoryIcon(categoryIconName)}
                </div>

                {/* [ 2. TÍTULO / CONCEPTO ] */}
                <div className="flex flex-1 flex-col justify-center min-w-0">
                  <p className="text-[#0a0b0d] text-[15px] font-semibold truncate group-hover:text-[#0052ff]">
                    {expense.title}
                  </p>
                  <p className="text-[12px] font-medium text-[#0a0b0d] truncate mt-0.5">
                    {expense.subcategory || getCategoryName(expense.categoryId)}
                  </p>
                  <p className="text-[11px] font-medium text-[#5b616e] truncate mt-0.5">
                    {getPayerName(expense.paidById)}
                  </p>
                  <span className="text-[11px] text-[#8a919e] mt-0.5">
                    {formatRelativeDate(expense.date)}
                  </span>
                </div>

                {/* [ 3. MONTO PRINCIPAL ] */}
                <div className="text-right shrink-0">
                  <p className="text-[#0a0b0d] text-[15px] font-bold">
                    {currency}{expense.amount.toLocaleString('es-CO')}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      expense.status === 'PAGADO'
                        ? 'bg-[#27ad75]/10 text-[#27ad75] border border-[#27ad75]/30'
                        : expense.status === 'DEBES'
                        ? 'bg-[#f0616d]/10 text-[#f0616d] border border-[#f0616d]/30'
                        : 'bg-[#eef0f3] text-[#5b616e] border border-[#dedfe2]'
                    }`}
                  >
                    {expense.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
