import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Check, 
  Building2, 
  Users, 
  Receipt, 
  Banknote,
  AlertCircle,
  ChevronDown,
  Search,
  PieChart,
  RotateCcw,
  Camera,
  Upload,
  User,
  X,
  Image as ImageIcon,
  Scale,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Member, Household, Expense, Category, SplitType } from '../../types';
import { CURRENCIES, CurrencyOption } from '../tabs/HogarTab';
import { INITIAL_CATEGORIES } from '../../data';
import { CategoryBudgetCard } from '../budget/CategoryBudgetCard';
import { formatDisplayName } from '../../utils/format';

interface InvitedMemberDraft {
  id: string;
  name: string;
  email: string;
}

export interface CategoryBudgetAllocation {
  categoryId: string;
  percentage: number;
  amount: number;
}

export interface OnboardingData {
  householdName: string;
  currency: string;
  coverImage?: string;
  creatorName: string;
  creatorEmail: string;
  creatorAvatar?: string;
  invitedMembers: { name: string; email: string }[];
  defaultSplitRule?: SplitType;
  budget?: {
    totalMonthly: number;
    categories: CategoryBudgetAllocation[];
  };
  initialExpense?: {
    title: string;
    amount: number;
    categoryId?: string;
    paidBy: 'creator' | 'invited_0';
  };
}

interface OnboardingWizardProps {
  onBackToWelcome: () => void;
  onComplete: (data: OnboardingData) => void;
}

// Default balanced distribution across the 4 standard categories
const DEFAULT_CATEGORY_PERCENTAGES: Record<string, number> = {
  cat_fijos: 50,
  cat_recurrentes: 20,
  cat_ocasionales: 20,
  cat_imprevistos: 10,
};

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80';

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onBackToWelcome,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Scroll to top on step changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [step]);

  // Step 1 State: Hogar e Identidad
  const [householdName, setHouseholdName] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('COP $');
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const [coverImage, setCoverImage] = useState<string>(DEFAULT_COVER_IMAGE);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const householdFileInputRef = useRef<HTMLInputElement>(null);

  const selectedCurrencyObj = CURRENCIES.find((c) => c.symbol === selectedCurrency) || CURRENCIES[0];
  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.country.toLowerCase().includes(currencySearch.toLowerCase())
  );

  // Step 2 State: Creador (Admin) + Invitación por correo + Avatar
  const [creatorName, setCreatorName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorAvatar, setCreatorAvatar] = useState<string | null>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  
  const [invitedMembers, setInvitedMembers] = useState<InvitedMemberDraft[]>([]);
  const [defaultSplitRule, setDefaultSplitRule] = useState<SplitType>('50_50');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [memberError, setMemberError] = useState('');

  // Handle Household Image Upload
  const handleHouseholdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
          setCoverImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveHouseholdImage = () => {
    setCoverImage(DEFAULT_COVER_IMAGE);
    setCoverImagePreview(null);
    if (householdFileInputRef.current) {
      householdFileInputRef.current.value = '';
    }
  };

  // Handle Creator Avatar Upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCreatorAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setCreatorAvatar(null);
    if (avatarFileInputRef.current) {
      avatarFileInputRef.current.value = '';
    }
  };

  // Step 3 State: Definir Presupuesto Mensual
  const [enableBudget, setEnableBudget] = useState(true);
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState<number | ''>(5200000);
  const [categoryPercentages, setCategoryPercentages] = useState<Record<string, number>>(DEFAULT_CATEGORY_PERCENTAGES);

  // Step 4 State: Primer gasto (Opcional)
  const [hasFirstExpense, setHasFirstExpense] = useState(false);
  const [expenseCategoryId, setExpenseCategoryId] = useState<string>('cat_fijos');
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number | ''>('');
  const [expensePaidBy, setExpensePaidBy] = useState<'creator' | 'invited_0'>('creator');

  // Helpers Step 2
  const handleAddMember = () => {
    setMemberError('');
    const trimmedName = newMemberName.trim();
    const trimmedEmail = newMemberEmail.trim().toLowerCase();

    if (!trimmedName) {
      setMemberError('Ingresa el nombre del integrante.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setMemberError('Ingresa un correo electrónico válido.');
      return;
    }
    if (trimmedEmail === creatorEmail.trim().toLowerCase()) {
      setMemberError('El correo no puede ser el mismo del administrador.');
      return;
    }
    if (invitedMembers.some((m) => m.email.toLowerCase() === trimmedEmail)) {
      setMemberError('Este correo ya está en la lista de invitados.');
      return;
    }

    setInvitedMembers((prev) => [
      ...prev,
      {
        id: `inv_${Date.now()}`,
        name: trimmedName,
        email: trimmedEmail,
      },
    ]);
    setNewMemberName('');
    setNewMemberEmail('');
  };

  const handleRemoveMember = (id: string) => {
    setInvitedMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Helpers Step 3: Presupuesto
  const totalPercentage = Object.values(categoryPercentages).reduce<number>((acc, val) => acc + Number(val || 0), 0);
  const isPercentageBalanced = totalPercentage === 100;

  const handlePercentageChange = (categoryId: string, value: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));
    setCategoryPercentages((prev) => ({
      ...prev,
      [categoryId]: clamped,
    }));
  };

  const handleResetPercentages = () => {
    setCategoryPercentages(DEFAULT_CATEGORY_PERCENTAGES);
  };

  const handleAutoBalancePercentages = () => {
    const keys = INITIAL_CATEGORIES.map((c) => c.id);
    const currentTotal = keys.reduce((acc, k) => acc + (categoryPercentages[k] || 0), 0);
    
    if (currentTotal === 0) {
      setCategoryPercentages(DEFAULT_CATEGORY_PERCENTAGES);
      return;
    }

    const newPercentages: Record<string, number> = {};
    let accumulated = 0;
    
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        newPercentages[key] = Math.max(0, 100 - accumulated);
      } else {
        const raw = Math.round(((categoryPercentages[key] || 0) / currentTotal) * 100);
        newPercentages[key] = raw;
        accumulated += raw;
      }
    });

    setCategoryPercentages(newPercentages);
  };

  // Validaciones por paso
  const isStep1Valid = householdName.trim().length >= 2;
  const isStep2Valid = creatorName.trim().length >= 2 && creatorEmail.trim().includes('@') && invitedMembers.length >= 1;
  const isStep3Valid = !enableBudget || (Number(totalMonthlyBudget) > 0 && isPercentageBalanced);

  const handleNext = () => {
    if (step === 1 && isStep1Valid) {
      setStep(2);
    } else if (step === 2 && isStep2Valid) {
      setStep(3);
    } else if (step === 3 && isStep3Valid) {
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onBackToWelcome();
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    }
  };

  const handleFinalSubmit = (skipExpense: boolean = false) => {
    const budgetData = (enableBudget && Number(totalMonthlyBudget) > 0)
      ? {
          totalMonthly: Number(totalMonthlyBudget),
          categories: INITIAL_CATEGORIES.map((cat) => {
            const pct = categoryPercentages[cat.id] ?? 25;
            const amount = Math.round((Number(totalMonthlyBudget) * pct) / 100);
            return {
              categoryId: cat.id,
              percentage: pct,
              amount,
            };
          }),
        }
      : undefined;

    onComplete({
      householdName: householdName.trim(),
      currency: selectedCurrency,
      coverImage: coverImage,
      creatorName: creatorName.trim(),
      creatorEmail: creatorEmail.trim(),
      creatorAvatar: creatorAvatar || undefined,
      invitedMembers: invitedMembers.map((m) => ({ name: m.name, email: m.email })),
      defaultSplitRule,
      budget: budgetData,
      initialExpense: (!skipExpense && hasFirstExpense && Number(expenseAmount) > 0)
        ? {
            title: expenseTitle.trim() || 'Gasto inicial',
            amount: Number(expenseAmount),
            categoryId: expenseCategoryId,
            paidBy: expensePaidBy,
          }
        : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0a0b0d] flex flex-col justify-between items-center p-4 sm:p-6 md:p-8 font-sans selection:bg-[#0052ff] selection:text-[#ffffff]">
      {/* Top Bar: Back & Progress */}
      <div className="w-full max-w-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="h-9 px-3 rounded-full border border-[#dedfe2] bg-[#ffffff] hover:bg-[#f7f8f9] text-[#0a0b0d] text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver</span>
          </button>
          
          <div className="flex items-center gap-3">
            {step === 3 && (
              <button
                type="button"
                onClick={() => {
                  setEnableBudget(false);
                  setStep(4);
                }}
                className="text-xs font-semibold text-[#5b616e] hover:text-[#0052ff] transition-colors cursor-pointer"
              >
                Omitir por ahora
              </button>
            )}
            <span className="text-[12px] font-semibold text-[#5b616e]">
              Paso {step} de 4
            </span>
          </div>
        </div>

        {/* Segmented Progress Bar */}
        <div className="w-full h-1.5 bg-[#eef0f3] rounded-full overflow-hidden flex gap-1">
          <div 
            className={`h-full flex-1 rounded-full transition-all duration-300 ${
              step >= 1 ? 'bg-[#0052ff]' : 'bg-transparent'
            }`} 
          />
          <div 
            className={`h-full flex-1 rounded-full transition-all duration-300 ${
              step >= 2 ? 'bg-[#0052ff]' : 'bg-transparent'
            }`} 
          />
          <div 
            className={`h-full flex-1 rounded-full transition-all duration-300 ${
              step >= 3 ? 'bg-[#0052ff]' : 'bg-transparent'
            }`} 
          />
          <div 
            className={`h-full flex-1 rounded-full transition-all duration-300 ${
              step >= 4 ? 'bg-[#0052ff]' : 'bg-transparent'
            }`} 
          />
        </div>
      </div>

      {/* Center Wizard Container */}
      <div className="w-full max-w-lg my-auto py-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: Hogar e Identidad */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <div className="mb-6">
                <h2 className="font-display font-extrabold text-[24px] sm:text-[28px] text-[#0a0b0d] tracking-tight leading-tight">
                  Identidad del hogar
                </h2>
                <p className="text-[13px] text-[#5b616e] mt-1">
                  Define cómo se llamará este espacio y la moneda principal de las cuentas.
                </p>
              </div>

              <div className="bg-[#f7f8f9] border border-[#dedfe2] rounded-[24px] p-5 sm:p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#0a0b0d] mb-1.5">
                    Nombre del hogar o grupo
                  </label>
                  <input
                    type="text"
                    value={householdName}
                    onChange={(e) => setHouseholdName(e.target.value)}
                    placeholder="Ej. Apartamento 402, Casa Campestre"
                    className="w-full h-11 px-3.5 bg-[#ffffff] border border-[#dedfe2] rounded-[12px] text-sm text-[#0a0b0d] placeholder:text-[#8a919e] focus:outline-none focus:border-[#0052ff] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#0a0b0d] mb-1.5">
                    Moneda principal
                  </label>
                  <div className="relative">
                    {/* Dropdown Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                      className="w-full h-11 flex items-center justify-between px-3.5 bg-[#ffffff] hover:bg-[#eef0f3] border border-[#dedfe2] rounded-[12px] text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base leading-none">{selectedCurrencyObj.flag}</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-bold text-[#0a0b0d] truncate">
                            {selectedCurrencyObj.country}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#0052ff]/10 text-[#0052ff]">
                            {selectedCurrencyObj.code}
                          </span>
                          <span className="text-xs text-[#5b616e] truncate">
                            ({selectedCurrencyObj.symbol.trim()})
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#5b616e] transition-transform duration-200 shrink-0 ml-2 ${
                          isCurrencyDropdownOpen ? 'rotate-180 text-[#0052ff]' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu Modal/Popover */}
                    <AnimatePresence>
                      {isCurrencyDropdownOpen && (
                        <>
                          {/* Invisible Backdrop to close on click outside */}
                          <div
                            className="fixed inset-0 z-30"
                            onClick={() => {
                              setIsCurrencyDropdownOpen(false);
                              setCurrencySearch('');
                            }}
                          />

                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute left-0 right-0 top-full mt-2 z-40 bg-[#ffffff] border border-[#dedfe2] rounded-[16px] p-2 space-y-1.5 max-h-60 flex flex-col"
                          >
                            {/* Search Field */}
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 text-[#8a919e] absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={currencySearch}
                                onChange={(e) => setCurrencySearch(e.target.value)}
                                placeholder="Buscar país, divisa o código..."
                                className="w-full h-8 pl-8 pr-3 text-xs bg-[#f7f8f9] border border-[#dedfe2] rounded-full text-[#0a0b0d] placeholder:text-[#8a919e] focus:outline-none focus:border-[#0052ff]"
                                autoFocus
                              />
                            </div>

                            {/* Options List */}
                            <div className="overflow-y-auto space-y-1 pr-0.5 flex-1 max-h-44">
                              {filteredCurrencies.length === 0 ? (
                                <p className="text-xs text-center text-[#8a919e] py-3">
                                  No se encontraron monedas.
                                </p>
                              ) : (
                                filteredCurrencies.map((curr) => {
                                  const isSelected = selectedCurrency === curr.symbol;
                                  return (
                                    <button
                                      key={curr.code}
                                      type="button"
                                      onClick={() => {
                                        setSelectedCurrency(curr.symbol);
                                        setIsCurrencyDropdownOpen(false);
                                        setCurrencySearch('');
                                      }}
                                      className={`w-full flex items-center justify-between p-2 rounded-[10px] text-left text-xs transition-colors cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#0052ff]/10 text-[#0052ff] font-bold'
                                          : 'hover:bg-[#f7f8f9] text-[#0a0b0d]'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-sm leading-none">{curr.flag}</span>
                                        <span className="truncate">{curr.name}</span>
                                        <span className="text-[10px] font-semibold text-[#5b616e]">
                                          ({curr.code} • {curr.symbol.trim()})
                                        </span>
                                      </div>
                                      {isSelected && <Check className="w-3.5 h-3.5 text-[#0052ff] shrink-0 ml-1.5" />}
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Fotografía o imagen del hogar */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#0a0b0d] mb-1.5">
                    Foto o imagen del hogar
                  </label>
                  
                  <input
                    ref={householdFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleHouseholdImageChange}
                    className="hidden"
                    id="household-cover-upload"
                  />

                  <div className="relative rounded-[16px] overflow-hidden border border-[#dedfe2] bg-[#ffffff] group">
                    <div 
                      className="w-full h-36 sm:h-40 bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${coverImage}')` }}
                    >
                      <div className="absolute inset-0 bg-[#0a0b0d]/25 transition-opacity group-hover:bg-[#0a0b0d]/35" />
                      
                      {/* Badge if custom image uploaded */}
                      {coverImagePreview && (
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#27ad75] text-[#ffffff] text-[10px] font-bold shadow-xs">
                            <Check className="w-3 h-3" />
                            Foto personalizada
                          </span>
                        </div>
                      )}

                      {/* Action buttons on image */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 p-4">
                        <button
                          type="button"
                          onClick={() => householdFileInputRef.current?.click()}
                          className="h-9 px-4 rounded-full bg-[#ffffff] hover:bg-[#f7f8f9] text-[#0a0b0d] text-xs font-semibold inline-flex items-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#0052ff]" />
                          <span>{coverImagePreview ? 'Cambiar foto' : 'Subir foto del hogar'}</span>
                        </button>
                        
                        {coverImagePreview && (
                          <button
                            type="button"
                            onClick={handleRemoveHouseholdImage}
                            className="h-9 w-9 rounded-full bg-[#ffffff] hover:bg-[#f0616d]/10 text-[#f0616d] flex items-center justify-center shadow-md transition-all cursor-pointer"
                            title="Restablecer foto predeterminada"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8a919e] mt-1.5 px-0.5">
                    Esta fotografía se mostrará como cabecera en la pantalla de inicio de tu hogar.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isStep1Valid}
                className={`mt-6 w-full h-12 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  isStep1Valid
                    ? 'bg-[#0052ff] hover:bg-[#0045d8] text-[#ffffff] cursor-pointer active:scale-[0.99]'
                    : 'bg-[#eef0f3] text-[#8a919e] cursor-not-allowed'
                }`}
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Creador (Admin) + Invitación por Correo */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <div className="mb-6">
                <h2 className="font-display font-extrabold text-[24px] sm:text-[28px] text-[#0a0b0d] tracking-tight leading-tight">
                  ¿Quiénes integran el hogar?
                </h2>
                <p className="text-[13px] text-[#5b616e] mt-1">
                  Tu perfil será el administrador. Invita al menos a 1 integrante por correo.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Creador / Administrador */}
                <div className="bg-[#f7f8f9] border border-[#dedfe2] rounded-[24px] p-5 flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0052ff]">
                      Tu perfil (Administrador)
                    </span>
                  </div>

                  {/* Creator Avatar Section */}
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="creator-avatar-upload"
                  />

                  <div className="flex items-center gap-3.5 pb-2 border-b border-[#dedfe2]">
                    <div className="relative">
                      {creatorAvatar ? (
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#0052ff] shrink-0 bg-[#ffffff]">
                          <img
                            src={creatorAvatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#0052ff]/10 text-[#0052ff] border-2 border-[#0052ff]/30 flex items-center justify-center font-bold text-lg shrink-0">
                          {creatorName.trim() ? creatorName.trim().charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0052ff] text-[#ffffff] flex items-center justify-center shadow-sm hover:bg-[#0045d8] transition-colors cursor-pointer"
                        title="Subir foto de avatar"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => avatarFileInputRef.current?.click()}
                          className="h-8 px-3 rounded-full bg-[#ffffff] hover:bg-[#eef0f3] text-[#0052ff] border border-[#dedfe2] text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>{creatorAvatar ? 'Cambiar foto' : 'Subir foto de perfil'}</span>
                        </button>
                        
                        {creatorAvatar && (
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="h-8 px-2.5 rounded-full bg-[#ffffff] hover:bg-[#f0616d]/10 text-[#f0616d] border border-[#dedfe2] text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer"
                            title="Usar avatar genérico con iniciales"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Quitar</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8a919e] mt-1">
                        {creatorAvatar ? 'Foto personalizada cargada' : 'Si no subes foto, se usarán las iniciales de tu nombre.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5b616e] mb-1">
                        Tu nombre
                      </label>
                      <input
                        type="text"
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        placeholder="Tu nombre completo"
                        className="w-full h-10 px-3 bg-[#ffffff] border border-[#dedfe2] rounded-[12px] text-xs text-[#0a0b0d] focus:outline-none focus:border-[#0052ff]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5b616e] mb-1">
                        Tu correo
                      </label>
                      <input
                        type="email"
                        value={creatorEmail}
                        onChange={(e) => setCreatorEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full h-10 px-3 bg-[#ffffff] border border-[#dedfe2] rounded-[12px] text-xs text-[#0a0b0d] focus:outline-none focus:border-[#0052ff]"
                      />
                    </div>
                  </div>
                </div>

                {/* Formulario para invitar integrante */}
                <div className="bg-[#f7f8f9] border border-[#dedfe2] rounded-[24px] p-5 flex flex-col gap-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5b616e]">
                    Invitar compañero(s) por correo
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5b616e] mb-1">
                        Nombre del integrante
                      </label>
                      <input
                        type="text"
                        value={newMemberName}
                        onChange={(e) => {
                          setNewMemberName(e.target.value);
                          setMemberError('');
                        }}
                        placeholder="Ej. Sofía Ramírez"
                        className="w-full h-10 px-3 bg-[#ffffff] border border-[#dedfe2] rounded-[12px] text-xs text-[#0a0b0d] focus:outline-none focus:border-[#0052ff]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5b616e] mb-1">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => {
                          setNewMemberEmail(e.target.value);
                          setMemberError('');
                        }}
                        placeholder="sofia@email.com"
                        className="w-full h-10 px-3 bg-[#ffffff] border border-[#dedfe2] rounded-[12px] text-xs text-[#0a0b0d] focus:outline-none focus:border-[#0052ff]"
                      />
                    </div>
                  </div>

                  {memberError && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#f0616d] font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{memberError}</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="h-9 px-4 rounded-full bg-[#ffffff] hover:bg-[#eef0f3] text-[#0052ff] border border-[#dedfe2] text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar integrante</span>
                    </button>
                  </div>
                </div>

                {/* Lista de integrantes */}
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-semibold text-[#0a0b0d] px-1">
                    Equipo del hogar ({invitedMembers.length + 1})
                  </span>

                  {/* Creador Card */}
                  <div className="flex items-center justify-between p-3 rounded-[16px] bg-[#ffffff] border border-[#dedfe2]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {creatorAvatar ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#0052ff] shrink-0">
                          <img src={creatorAvatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#0052ff]/10 text-[#0052ff] font-bold text-xs flex items-center justify-center shrink-0">
                          {creatorName.charAt(0).toUpperCase() || 'A'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0a0b0d] truncate">
                          {creatorName || 'Tú'} <span className="text-[#0052ff] font-normal">(Admin)</span>
                        </p>
                        <p className="text-[11px] text-[#8a919e] truncate">{creatorEmail || 'Sin correo'}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#27ad75] bg-[#27ad75]/10 px-2.5 py-0.5 rounded-full">
                      Tú
                    </span>
                  </div>

                  {/* Invitados */}
                  {invitedMembers.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between p-3 rounded-[16px] bg-[#ffffff] border border-[#dedfe2]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#f7f8f9] border border-[#dedfe2] text-[#0a0b0d] font-bold text-xs flex items-center justify-center shrink-0">
                          {inv.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0a0b0d] truncate">{inv.name}</p>
                          <p className="text-[11px] text-[#8a919e] truncate">{inv.email}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(inv.id)}
                        className="p-1.5 text-[#5b616e] hover:text-[#f0616d] hover:bg-[#f0616d]/10 rounded-full transition-colors cursor-pointer"
                        title="Eliminar invitado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Regla predeterminada de división */}
                <div className="bg-[#f7f8f9] border border-[#dedfe2] rounded-[24px] p-5 flex flex-col gap-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5b616e]">
                      Regla predeterminada de división
                    </span>
                    <p className="text-[11px] text-[#8a919e] mt-0.5">
                      Define cómo se repartirán los gastos comunes entre los integrantes
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Card 1: 50/50 Equitativo */}
                    <button
                      type="button"
                      onClick={() => setDefaultSplitRule('50_50')}
                      className={`p-4 rounded-[16px] border text-left transition-all cursor-pointer flex items-center justify-between gap-3.5 ${
                        defaultSplitRule === '50_50'
                          ? 'bg-[#ffffff] border-[#0052ff] ring-1 ring-[#0052ff]'
                          : 'bg-[#f7f8f9] border-[#dedfe2] hover:bg-[#ffffff] hover:border-[#8a919e]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            defaultSplitRule === '50_50'
                              ? 'bg-[#0052ff] text-[#ffffff]'
                              : 'bg-[#eef0f3] text-[#5b616e]'
                          }`}
                        >
                          <Scale className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0a0b0d]">Partes iguales (50 / 50)</p>
                          <p className="text-[11px] text-[#5b616e] mt-0.5 leading-snug">
                            Divide cada gasto de forma equitativa entre todos.
                          </p>
                        </div>
                      </div>

                      {defaultSplitRule === '50_50' ? (
                        <span className="w-5 h-5 rounded-full bg-[#0052ff] text-[#ffffff] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-[#dedfe2] bg-[#ffffff] shrink-0" />
                      )}
                    </button>

                    {/* Card 2: Personalizado por gasto */}
                    <button
                      type="button"
                      onClick={() => setDefaultSplitRule('CUSTOM')}
                      className={`p-4 rounded-[16px] border text-left transition-all cursor-pointer flex items-center justify-between gap-3.5 ${
                        defaultSplitRule === 'CUSTOM'
                          ? 'bg-[#ffffff] border-[#0052ff] ring-1 ring-[#0052ff]'
                          : 'bg-[#f7f8f9] border-[#dedfe2] hover:bg-[#ffffff] hover:border-[#8a919e]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            defaultSplitRule === 'CUSTOM'
                              ? 'bg-[#0052ff] text-[#ffffff]'
                              : 'bg-[#eef0f3] text-[#5b616e]'
                          }`}
                        >
                          <Percent className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0a0b0d]">Personalizado por gasto</p>
                          <p className="text-[11px] text-[#5b616e] mt-0.5 leading-snug">
                            Define porcentajes o aportes en cada registro.
                          </p>
                        </div>
                      </div>

                      {defaultSplitRule === 'CUSTOM' ? (
                        <span className="w-5 h-5 rounded-full bg-[#0052ff] text-[#ffffff] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-[#dedfe2] bg-[#ffffff] shrink-0" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isStep2Valid}
                className={`mt-6 w-full h-12 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  isStep2Valid
                    ? 'bg-[#0052ff] hover:bg-[#0045d8] text-[#ffffff] cursor-pointer active:scale-[0.99]'
                    : 'bg-[#eef0f3] text-[#8a919e] cursor-not-allowed'
                }`}
              >
                <span>Continuar a presupuesto</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 3: Definir Presupuesto Mensual */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <div className="mb-6">
                <h2 className="font-display font-extrabold text-[24px] sm:text-[28px] text-[#0a0b0d] tracking-tight leading-tight">
                  Presupuesto mensual
                </h2>
                <p className="text-[13px] text-[#5b616e] mt-1">
                  Fija un límite total para el hogar y asigna los porcentajes sugeridos por categoría.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Monto Total Mensual */}
                <div className="bg-[#f7f8f9] border border-[#dedfe2] rounded-[24px] p-5 flex flex-col gap-2">
                  <label className="block text-[12px] font-semibold text-[#0a0b0d]">
                    Presupuesto total del hogar
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#5b616e] pointer-events-none select-none">
                      {selectedCurrency}
                    </span>
                    <input
                      type="number"
                      value={totalMonthlyBudget}
                      onChange={(e) => setTotalMonthlyBudget(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="5200000"
                      className="w-full h-11 pl-[60px] pr-3.5 bg-[#ffffff] border border-[#dedfe2] rounded-[12px] text-sm font-semibold text-[#0a0b0d] placeholder:text-[#8a919e] focus:outline-none focus:border-[#0052ff] transition-all leading-normal"
                    />
                  </div>
                  <p className="text-[11px] text-[#5b616e] mt-0.5">
                    Monto global estimado para cubrir todos los gastos compartidos del mes.
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
                      {INITIAL_CATEGORIES.map((cat) => {
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
                      {INITIAL_CATEGORIES.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          <span className="truncate">{cat.name}: <strong className="text-[#0a0b0d]">{categoryPercentages[cat.id] || 0}%</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Listado de las 4 categorías */}
                  <div className="flex flex-col gap-2.5">
                    {INITIAL_CATEGORIES.map((category) => (
                      <CategoryBudgetCard
                        key={category.id}
                        category={category}
                        currency={selectedCurrency}
                        mode="interactive"
                        percentage={categoryPercentages[category.id] ?? 0}
                        totalBudget={Number(totalMonthlyBudget) || 0}
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
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isStep3Valid}
                className={`mt-6 w-full h-12 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  isStep3Valid
                    ? 'bg-[#0052ff] hover:bg-[#0045d8] text-[#ffffff] cursor-pointer active:scale-[0.99]'
                    : 'bg-[#eef0f3] text-[#8a919e] cursor-not-allowed'
                }`}
              >
                <span>Continuar al paso final</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 4: Saldo Inicial / Primer Gasto Opcional */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <div className="mb-6">
                <h2 className="font-display font-extrabold text-[24px] sm:text-[28px] text-[#0a0b0d] tracking-tight leading-tight">
                  Saldo inicial
                </h2>
                <p className="text-[13px] text-[#5b616e] mt-1">
                  ¿Quieres registrar un primer gasto común o ingresar directamente con balance en $0?
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {/* Opción 1: Balance en Cero */}
                <button
                  type="button"
                  onClick={() => setHasFirstExpense(false)}
                  className={`w-full p-4 rounded-[24px] border text-left transition-all cursor-pointer flex items-center justify-between ${
                    !hasFirstExpense
                      ? 'bg-[#ffffff] border-[#0052ff] ring-1 ring-[#0052ff]'
                      : 'bg-[#f7f8f9] border-[#dedfe2] hover:bg-[#ffffff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      !hasFirstExpense ? 'bg-[#0052ff] text-[#ffffff]' : 'bg-[#eef0f3] text-[#5b616e]'
                    }`}>
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0a0b0d]">Iniciar con balance en $0</p>
                      <p className="text-[11px] text-[#5b616e]">Registraré los gastos más adelante</p>
                    </div>
                  </div>
                  {!hasFirstExpense && <Check className="w-4 h-4 text-[#0052ff]" />}
                </button>

                {/* Opción 2: Registrar Primer Gasto */}
                <button
                  type="button"
                  onClick={() => setHasFirstExpense(true)}
                  className={`w-full p-4 rounded-[24px] border text-left transition-all cursor-pointer flex items-center justify-between ${
                    hasFirstExpense
                      ? 'bg-[#ffffff] border-[#0052ff] ring-1 ring-[#0052ff]'
                      : 'bg-[#f7f8f9] border-[#dedfe2] hover:bg-[#ffffff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      hasFirstExpense ? 'bg-[#0052ff] text-[#ffffff]' : 'bg-[#eef0f3] text-[#5b616e]'
                    }`}>
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0a0b0d]">Registrar un primer gasto</p>
                      <p className="text-[11px] text-[#5b616e]">Supermercado, arriendo o servicios</p>
                    </div>
                  </div>
                  {hasFirstExpense && <Check className="w-4 h-4 text-[#0052ff]" />}
                </button>

                {/* Formulario contextual si activó primer gasto */}
                <AnimatePresence>
                  {hasFirstExpense && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-[#f7f8f9] border border-[#dedfe2] rounded-[24px] p-5 flex flex-col gap-3 mt-1"
                    >
                      {/* Selector tipo dropdown de categoría (ubicado antes del concepto del gasto) */}
                      <div>
                        <label className="block text-[11px] font-semibold text-[#5b616e] mb-1">
                          Categoría del gasto
                        </label>
                        <div className="relative">
                          <select
                            value={expenseCategoryId}
                            onChange={(e) => setExpenseCategoryId(e.target.value)}
                            className="w-full h-10 pl-3 pr-9 bg-[#ffffff] border border-[#dedfe2] rounded-[12px] text-xs font-semibold text-[#0a0b0d] focus:outline-none focus:border-[#0052ff] cursor-pointer appearance-none"
                          >
                            {INITIAL_CATEGORIES.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5b616e]">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#5b616e] mb-1">
                          Concepto del gasto
                        </label>
                        <input
                          type="text"
                          value={expenseTitle}
                          onChange={(e) => setExpenseTitle(e.target.value)}
                          placeholder="Ej. Supermercado mensual"
                          className="w-full h-10 px-3 bg-[#ffffff] border border-[#dedfe2] rounded-[12px] text-xs text-[#0a0b0d] focus:outline-none focus:border-[#0052ff]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#5b616e] mb-1">
                            Monto ({selectedCurrency})
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#5b616e]">
                              {selectedCurrency}
                            </span>
                            <input
                              type="number"
                              value={expenseAmount}
                              onChange={(e) => setExpenseAmount(e.target.value === '' ? '' : Number(e.target.value))}
                              placeholder="120000"
                              className="w-full h-10 pl-11 pr-3 bg-[#ffffff] border border-[#dedfe2] rounded-[12px] text-xs text-[#0a0b0d] focus:outline-none focus:border-[#0052ff]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#5b616e] mb-1">
                            Pagado por
                          </label>
                          <select
                            value={expensePaidBy}
                            onChange={(e) => setExpensePaidBy(e.target.value as 'creator' | 'invited_0')}
                            className="w-full h-10 px-3 bg-[#ffffff] border border-[#dedfe2] rounded-[12px] text-xs text-[#0a0b0d] focus:outline-none focus:border-[#0052ff] cursor-pointer"
                          >
                            <option value="creator">{formatDisplayName(creatorName) || 'Tú (Admin)'}</option>
                            {invitedMembers[0] && (
                              <option value="invited_0">{formatDisplayName(invitedMembers[0].name)}</option>
                            )}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Botón Final */}
              <button
                type="button"
                onClick={() => handleFinalSubmit(false)}
                className="mt-6 w-full h-12 rounded-full bg-[#0052ff] hover:bg-[#0045d8] text-[#ffffff] font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
              >
                <span>Finalizar y entrar a KOPAR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <div className="w-full text-center py-2">
        <span className="text-[11px] text-[#8a919e]">
          KOPAR • Configuración segura de hogar
        </span>
      </div>
    </div>
  );
};

