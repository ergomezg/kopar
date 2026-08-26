import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown, 
  Calendar,
  Home,
  Repeat,
  Compass,
  AlertTriangle,
  Utensils,
  Wifi,
  ShoppingBag,
  Plus,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Expense, Member } from '../../types';
import { formatRelativeDate, formatDisplayName } from '../../utils/format';

interface ActividadTabProps {
  expenses: Expense[];
  categories: Category[];
  members: Member[];
  currentMember: Member;
  currency: string;
  onSelectExpense: (expense: Expense) => void;
  onOpenAddExpense: () => void;
}

export const ActividadTab: React.FC<ActividadTabProps> = ({
  expenses,
  categories,
  members,
  currentMember,
  currency,
  onSelectExpense,
  onOpenAddExpense,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMember, setSelectedMember] = useState<string>('ALL');
  const [exportedMsg, setExportedMsg] = useState(false);

  // Helper to get category icon component matching Home view
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

  // Filter logic
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.subcategory && e.subcategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.notes && e.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || e.categoryId === selectedCategory;
    const matchesMember = selectedMember === 'ALL' || e.paidById === selectedMember;

    return matchesSearch && matchesCategory && matchesMember;
  });

  const [visibleCount, setVisibleCount] = useState(15);

  const totalFilteredAmount = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const paginatedExpenses = filteredExpenses.slice(0, visibleCount);

  const handleExport = () => {
    setExportedMsg(true);
    setTimeout(() => setExportedMsg(false), 3000);
  };

  return (
    <div className="px-4 sm:px-6 py-6 pb-28 space-y-5 max-w-xl mx-auto">
      {/* Title & Header */}
      <div className="flex items-center justify-between border-b border-[#dedfe2] pb-3">
        <div>
          <h2 className="font-display text-[28px] font-extrabold text-[#0a0b0d] tracking-tight">Historial de gastos</h2>
          <p className="text-xs text-[#5b616e]">Registro completo de transacciones del hogar</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#dedfe2] bg-[#ffffff] text-[#0a0b0d] hover:bg-[#f7f8f9] font-semibold text-xs transition-all"
        >
          <Download className="w-3.5 h-3.5 text-[#0052ff]" />
          <span>CSV</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {exportedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="p-3 bg-[#0052ff] text-[#ffffff] rounded-[16px] text-xs font-semibold text-center"
          >
            ✓ Reporte de gastos exportado exitosamente.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total Gastos Card - Low-fidelity wireframe layout */}
      <div className="p-4 sm:p-5 rounded-[16px] bg-[#f7f8f9] text-[#0a0b0d] border border-[#dedfe2] flex flex-col gap-2">
        <span className="text-[15px] leading-[22.5px] font-medium text-[#5b616e] text-center">
          Gastos
        </span>
        <span className="font-display text-[26px] leading-[32.5px] font-extrabold text-[#0a0b0d] tracking-tight text-center py-2">
          {currency}{totalFilteredAmount.toLocaleString('es-CO')}
        </span>
        <div className="flex items-center justify-between text-xs text-[#5b616e] pt-2 pb-0 pl-[1px] border-t border-[#dedfe2]/60">
          <span>
            Registros: <strong className="text-[#0a0b0d] font-semibold">{filteredExpenses.length}</strong>
          </span>
          <span>
            Mes: <strong className="text-[#0a0b0d] font-semibold">Agosto</strong>
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8a919e] absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Buscar por concepto, nota o comercio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#dedfe2] bg-[#ffffff] text-xs font-medium text-[#0a0b0d] focus:outline-none focus:ring-2 focus:ring-[#0052ff] transition-colors"
        />
      </div>

      {/* Category Chips Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedCategory === 'ALL'
              ? 'bg-[#0052ff] text-[#ffffff] border-[#0052ff]'
              : 'bg-[#ffffff] text-[#5b616e] border-[#dedfe2] hover:border-[#0a0b0d]'
          }`}
        >
          Todas
        </motion.button>
        {categories.map((cat) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-[#0052ff] text-[#ffffff] border-[#0052ff]'
                : 'bg-[#ffffff] text-[#5b616e] border-[#dedfe2] hover:border-[#0a0b0d]'
            }`}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>

      {/* Expenses List */}
      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          expenses.length === 0 ? (
            /* 1. Global Zero Data State */
            <div className="bg-[#ffffff] p-8 rounded-[24px] text-center border border-[#dedfe2] space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#eef0f3] text-[#0052ff] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <p className="text-base font-bold text-[#0a0b0d]">Tu historial está listo</p>
                <p className="text-xs text-[#5b616e] max-w-xs mx-auto mt-1">
                  Aún no se han registrado gastos en este hogar. Cada movimiento que registres aparecerá aquí.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={onOpenAddExpense}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0052ff] hover:bg-[#0045d8] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Registrar nuevo gasto</span>
                </button>
              </div>
            </div>
          ) : (
            /* 2. Zero Results Filter State */
            <div className="bg-[#ffffff] p-8 rounded-[24px] text-center border border-[#dedfe2] space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#f7f8f9] text-[#5b616e] flex items-center justify-center mx-auto border border-[#dedfe2]">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-bold text-[#0a0b0d]">No encontramos resultados</p>
                <p className="text-xs text-[#5b616e] max-w-xs mx-auto mt-1">
                  No hay movimientos que coincidan con el término de búsqueda o filtros seleccionados.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('ALL');
                    setSelectedMember('ALL');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#dedfe2] bg-[#ffffff] hover:bg-[#f7f8f9] text-[#0a0b0d] text-xs font-semibold transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#0052ff]" />
                  <span>Restablecer filtros</span>
                </button>
              </div>
            </div>
          )
        ) : (
          <>
            {paginatedExpenses.map((expense) => {
              const category = categories.find((c) => c.id === expense.categoryId);
              const categoryIconName = category ? category.icon : 'Home';
              const payer = members.find((m) => m.id === expense.paidById);

              return (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  key={expense.id}
                  onClick={() => onSelectExpense(expense)}
                  className="flex items-center gap-4 p-4 bg-[#ffffff] border border-[#dedfe2] hover:bg-[#f7f8f9] rounded-[16px] cursor-pointer transition-all group"
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
                    <p className="text-[15px] font-semibold text-[#0a0b0d] truncate group-hover:text-[#0052ff]">{expense.title}</p>
                    <p className="text-[12px] font-medium text-[#0a0b0d] truncate mt-0.5">
                      {expense.subcategory || category?.name || 'General'}
                    </p>
                    <p className="text-[11px] font-medium text-[#5b616e] truncate mt-0.5">
                      {expense.paidById === currentMember.id ? 'Tú pagaste' : `${payer ? formatDisplayName(payer.name) : 'Alguien'} pagó`}
                    </p>
                    <span className="text-[11px] text-[#8a919e] mt-0.5">
                      {formatRelativeDate(expense.date)}
                    </span>
                  </div>

                  {/* [ 3. MONTO PRINCIPAL ] */}
                  <div className="text-right shrink-0">
                    <p className="text-[15px] font-bold text-[#0a0b0d]">
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
                </motion.div>
              );
            })}

            {visibleCount < filteredExpenses.length && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 15)}
                  className="px-5 py-2.5 rounded-full border border-[#dedfe2] bg-[#ffffff] hover:bg-[#f7f8f9] text-[#0a0b0d] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  Cargar más gastos ({filteredExpenses.length - visibleCount} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

