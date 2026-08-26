import React, { useState } from 'react';
import { Users, UserPlus, Settings, Shield, Sliders, DollarSign, Check, RefreshCw, ChevronDown, Search, Globe, LogOut, Trash2, AlertCircle, ArrowRightLeft, Scale, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Household, Member, SplitType } from '../../types';
import { formatDisplayName } from '../../utils/format';

export interface CurrencyOption {
  code: string;
  country: string;
  flag: string;
  name: string;
  symbol: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'COP', country: 'Colombia', flag: '🇨🇴', name: 'Peso Colombiano', symbol: 'COP $' },
  { code: 'USD', country: 'Estados Unidos', flag: '🇺🇸', name: 'Dólar Estadounidense', symbol: 'USD $' },
  { code: 'EUR', country: 'Unión Europea', flag: '🇪🇺', name: 'Euro', symbol: 'EUR €' },
  { code: 'MXN', country: 'México', flag: '🇲🇽', name: 'Peso Mexicano', symbol: 'MXN $' },
  { code: 'ARS', country: 'Argentina', flag: '🇦🇷', name: 'Peso Argentino', symbol: 'ARS $' },
  { code: 'CLP', country: 'Chile', flag: '🇨🇱', name: 'Peso Chileno', symbol: 'CLP $' },
  { code: 'PEN', country: 'Perú', flag: '🇵🇪', name: 'Sol Peruano', symbol: 'PEN S/' },
  { code: 'BRL', country: 'Brasil', flag: '🇧🇷', name: 'Real Brasileño', symbol: 'BRL R$' },
  { code: 'GBP', country: 'Reino Unido', flag: '🇬🇧', name: 'Libra Esterlina', symbol: 'GBP £' },
  { code: 'UYU', country: 'Uruguay', flag: '🇺🇾', name: 'Peso Uruguayo', symbol: 'UYU $' },
  { code: 'CRC', country: 'Costa Rica', flag: '🇨🇷', name: 'Colón Costarricense', symbol: 'CRC ₡' },
  { code: 'GTQ', country: 'Guatemala', flag: '🇬🇹', name: 'Quetzal Guatemalteco', symbol: 'GTQ Q' },
  { code: 'DOP', country: 'República Dominicana', flag: '🇩🇴', name: 'Peso Dominicano', symbol: 'DOP $' },
  { code: 'BOB', country: 'Bolivia', flag: '🇧🇴', name: 'Boliviano', symbol: 'BOB Bs.' },
  { code: 'PYG', country: 'Paraguay', flag: '🇵🇾', name: 'Guaraní Paraguayo', symbol: 'PYG ₲' },
  { code: 'CAD', country: 'Canadá', flag: '🇨🇦', name: 'Dólar Canadiense', symbol: 'CAD $' },
  { code: 'CHF', country: 'Suiza', flag: '🇨🇭', name: 'Franco Suizo', symbol: 'CHF Fr.' },
];

interface HogarTabProps {
  household: Household;
  currentMember: Member;
  onOpenInvite: () => void;
  onUpdateHouseholdName: (newName: string) => void;
  onUpdateSplitRule: (rule: SplitType) => void;
  onUpdateCurrency: (curr: string) => void;
  onResetData: () => void;
  onLogout?: () => void;
  onDeleteMember?: (memberId: string) => void;
  onTransferAdmin?: (newAdminId: string) => void;
}

export const HogarTab: React.FC<HogarTabProps> = ({
  household,
  currentMember,
  onOpenInvite,
  onUpdateHouseholdName,
  onUpdateSplitRule,
  onUpdateCurrency,
  onResetData,
  onLogout,
  onDeleteMember,
  onTransferAdmin,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(household.name);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [transferTargetId, setTransferTargetId] = useState<string | null>(null);

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>(() => {
    const match = CURRENCIES.find(
      (c) => c.symbol === household.currency || c.code === household.currency || household.currency.startsWith(c.code)
    );
    return match ? match.code : 'COP';
  });

  const selectedCurrencyObj = CURRENCIES.find(
    (c) => c.code === selectedCurrencyCode
  ) || CURRENCIES.find(
    (c) => c.symbol === household.currency
  ) || {
    code: 'CUSTOM',
    country: 'Personalizada',
    flag: '🌐',
    name: 'Divisa Local',
    symbol: household.currency
  };

  const filteredCurrencies = CURRENCIES.filter(c => 
    c.country.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.symbol.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const handleSaveName = () => {
    if (nameVal.trim()) {
      onUpdateHouseholdName(nameVal.trim());
    }
    setIsEditingName(false);
  };

  const handleConfirmDeleteMember = (memberId: string) => {
    if (onDeleteMember) {
      onDeleteMember(memberId);
    }
    setMemberToDelete(null);
  };

  return (
    <div className="px-4 sm:px-6 py-6 pb-28 space-y-5 max-w-xl mx-auto">
      {/* Title */}
      <div className="border-b border-[#dedfe2] pb-3">
        <h2 className="font-display text-[28px] font-extrabold text-[#0a0b0d] tracking-tight">Configuración del hogar</h2>
        <p className="text-xs text-[#5b616e]">Integrantes, reglas y preferencias del espacio</p>
      </div>

      {/* Household Profile Card */}
      <div className="p-6 bg-[#ffffff] rounded-[24px] border border-[#dedfe2] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameVal}
                  onChange={(e) => setNameVal(e.target.value)}
                  className="px-3.5 py-1 border border-[#dedfe2] rounded-full text-sm font-semibold text-[#0a0b0d] bg-[#ffffff] focus:ring-2 focus:ring-[#0052ff] focus:outline-hidden"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-4 py-1 bg-[#0052ff] text-[#ffffff] rounded-full text-xs font-semibold cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <h3 className="font-display text-[22px] font-bold text-[#0a0b0d] flex items-center gap-2">
                {household.name}
                {currentMember.role === 'admin' && (
                  <button
                    onClick={() => {
                      setIsEditingName(true);
                      setNameVal(household.name);
                    }}
                    className="text-xs text-[#578bfa] hover:text-[#0052ff] font-sans font-semibold underline cursor-pointer"
                  >
                    Editar
                  </button>
                )}
              </h3>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-[#dedfe2]">
          <div>
            <p className="text-[#5b616e]">Creado el:</p>
            <p className="font-semibold text-[#0a0b0d]">{household.createdDate}</p>
          </div>
          <div>
            <p className="text-[#5b616e]">Tu Rol:</p>
            <p className="font-semibold text-[#0a0b0d] capitalize">{currentMember.role === 'admin' ? 'Administrador' : 'Miembro'}</p>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="p-6 bg-[#ffffff] rounded-[24px] border border-[#dedfe2] space-y-4">
        <div className="flex items-center justify-between border-b border-[#dedfe2] pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0052ff]" />
            <h4 className="text-[15px] font-bold text-[#0a0b0d]">
              Integrantes ({household.members.length})
            </h4>
          </div>

          <button
            onClick={onOpenInvite}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0a0b0d] border border-[#dedfe2] px-3.5 py-1.5 rounded-full hover:bg-[#f7f8f9] transition-all"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#0052ff]" />
            <span>Invitar</span>
          </button>
        </div>

        {/* Informative Rule Note */}
        <div className="flex items-start gap-2.5 p-3 rounded-[14px] bg-[#f7f8f9] border border-[#dedfe2] text-xs text-[#5b616e]">
          <Shield className="w-4 h-4 text-[#0052ff] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#0a0b0d] font-semibold">Regla del hogar:</strong> Solo puede haber 1 usuario con rol de administrador activo por hogar.
          </p>
        </div>

        <div className="space-y-2.5">
          {household.members.map((m) => {
            const isAdmin = m.role === 'admin';
            const isDeletingThis = memberToDelete === m.id;
            const isTransferringThis = transferTargetId === m.id;

            return (
              <div
                key={m.id}
                className="p-3.5 rounded-[16px] bg-[#f7f8f9] border border-[#dedfe2] space-y-3 ml-0 mt-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#dedfe2] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0a0b0d] truncate">
                        {formatDisplayName(m.name)} {m.id === currentMember.id ? '(Tú)' : ''}
                      </p>
                      <p className="text-[11px] text-[#5b616e] mt-0.5 truncate">{m.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isAdmin
                              ? 'bg-[#0052ff]/10 text-[#0052ff] border border-[#0052ff]/20'
                              : 'bg-[#eef0f3] text-[#5b616e] border border-[#dedfe2]'
                          }`}
                        >
                          {isAdmin && <Shield className="w-2.5 h-2.5" />}
                          {isAdmin ? 'Administrador único' : 'Miembro'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button for Non-Admins */}
                  {!isAdmin && onDeleteMember && (
                    <div className="shrink-0">
                      {isDeletingThis ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleConfirmDeleteMember(m.id)}
                            className="px-2.5 py-1 rounded-full bg-[#f0616d] text-[#ffffff] text-[10px] font-bold hover:bg-[#f0616d]/90 transition-all"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setMemberToDelete(null)}
                            className="px-2.5 py-1 rounded-full bg-[#ffffff] border border-[#dedfe2] text-[#5b616e] text-[10px] font-bold"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setMemberToDelete(m.id)}
                          className="p-1.5 rounded-full text-[#8a919e] hover:text-[#f0616d] hover:bg-[#f0616d]/10 transition-colors"
                          title="Eliminar integrante"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Transfer Admin Button - Full Width */}
                {!isAdmin && onTransferAdmin && (
                  <div className="pt-1 border-t border-[#dedfe2]/70 w-full">
                    {isTransferringThis ? (
                      <div className="flex items-center justify-between gap-2 bg-[#ffffff] p-2 rounded-[12px] border border-[#dedfe2] w-full">
                        <span className="text-[11px] font-bold text-[#0a0b0d]">¿Reasignar rol de administrador?</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              onTransferAdmin(m.id);
                              setTransferTargetId(null);
                            }}
                            className="px-3 py-1.5 rounded-full bg-[#0052ff] text-[#ffffff] text-xs font-bold hover:bg-[#0045d8] transition-all shadow-xs"
                          >
                            Sí, reasignar
                          </button>
                          <button
                            onClick={() => setTransferTargetId(null)}
                            className="px-3 py-1.5 rounded-full bg-[#f7f8f9] hover:bg-[#eef0f3] text-[#5b616e] text-xs font-semibold transition-all border border-[#dedfe2]"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setTransferTargetId(m.id)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 mt-1.5 rounded-full border border-[#dedfe2] bg-[#ffffff] hover:bg-[#0052ff]/5 hover:border-[#0052ff]/40 text-[#5b616e] hover:text-[#0052ff] text-xs font-semibold transition-all shadow-2xs"
                        title="Reasignar rol de administrador a este integrante"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5 text-[#0052ff]" />
                        <span>Hacer administrador</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Default Split Rule & Currency Preferences */}
      <div className="p-6 bg-[#ffffff] rounded-[24px] border border-[#dedfe2] space-y-4">
        <div className="flex items-center gap-2 border-b border-[#dedfe2] pb-3">
          <Sliders className="w-4 h-4 text-[#0052ff]" />
          <h4 className="text-[15px] font-bold text-[#0a0b0d]">Regla predeterminada de gastos</h4>
        </div>

        {/* Card Selector for Default Split Rule (Horizontal Distribution) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Card 1: 50/50 Equitativo */}
          <button
            type="button"
            onClick={() => onUpdateSplitRule('50_50')}
            className={`p-4 rounded-[16px] border text-left transition-all cursor-pointer flex items-center justify-between gap-3.5 ${
              household.defaultSplitRule === '50_50'
                ? 'bg-[#ffffff] border-[#0052ff] ring-1 ring-[#0052ff]'
                : 'bg-[#f7f8f9] border-[#dedfe2] hover:bg-[#ffffff] hover:border-[#8a919e]/60'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  household.defaultSplitRule === '50_50'
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

            {household.defaultSplitRule === '50_50' ? (
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
            onClick={() => onUpdateSplitRule('CUSTOM')}
            className={`p-4 rounded-[16px] border text-left transition-all cursor-pointer flex items-center justify-between gap-3.5 ${
              household.defaultSplitRule === 'CUSTOM'
                ? 'bg-[#ffffff] border-[#0052ff] ring-1 ring-[#0052ff]'
                : 'bg-[#f7f8f9] border-[#dedfe2] hover:bg-[#ffffff] hover:border-[#8a919e]/60'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  household.defaultSplitRule === 'CUSTOM'
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

            {household.defaultSplitRule === 'CUSTOM' ? (
              <span className="w-5 h-5 rounded-full bg-[#0052ff] text-[#ffffff] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </span>
            ) : (
              <span className="w-5 h-5 rounded-full border border-[#dedfe2] bg-[#ffffff] shrink-0" />
            )}
          </button>
        </div>

        {/* Currency Selector */}
        <div className="pt-4 border-t border-[#dedfe2] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider">
              Moneda del hogar
            </span>
            <span className="text-[11px] text-[#8a919e]">País y divisa principal</span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="w-full flex items-center justify-between p-3 bg-[#f7f8f9] hover:bg-[#eef0f3] border border-[#dedfe2] rounded-[16px] text-left transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-lg leading-none">{selectedCurrencyObj.flag}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0a0b0d] truncate flex items-center gap-1.5">
                    <span>{selectedCurrencyObj.country}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0052ff]/10 text-[#0052ff]">{selectedCurrencyObj.code}</span>
                  </p>
                  <p className="text-[11px] text-[#5b616e] truncate">
                    {selectedCurrencyObj.name} ({selectedCurrencyObj.symbol})
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#5b616e] transition-transform duration-300 shrink-0 ml-2 ${isCurrencyDropdownOpen ? 'rotate-180 text-[#0052ff]' : ''}`} />
            </button>

            <AnimatePresence>
              {isCurrencyDropdownOpen && (
                <>
                  {/* Backdrop to close on click outside */}
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
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 right-0 mt-2 z-40 bg-[#ffffff] border border-[#dedfe2] rounded-[20px] shadow-xl overflow-hidden p-2 space-y-2 max-h-72 flex flex-col"
                  >
                    {/* Search Input */}
                    <div className="relative px-1 pt-1">
                      <Search className="w-3.5 h-3.5 text-[#8a919e] absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={currencySearch}
                        onChange={(e) => setCurrencySearch(e.target.value)}
                        placeholder="Buscar país o moneda..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f7f8f9] border border-[#dedfe2] rounded-full text-[#0a0b0d] placeholder-[#8a919e] focus:outline-none focus:ring-2 focus:ring-[#0052ff]"
                        autoFocus
                      />
                    </div>

                    {/* Scrollable currency list */}
                    <div className="overflow-y-auto space-y-1 pr-1 flex-1">
                      {filteredCurrencies.length === 0 ? (
                        <p className="text-xs text-center text-[#8a919e] py-4">
                          No se encontraron monedas.
                        </p>
                      ) : (
                        filteredCurrencies.map((curr) => {
                          const isSelected = selectedCurrencyObj.code === curr.code;
                          return (
                            <button
                              key={curr.code}
                              type="button"
                              onClick={() => {
                                setSelectedCurrencyCode(curr.code);
                                onUpdateCurrency(curr.symbol);
                                setIsCurrencyDropdownOpen(false);
                                setCurrencySearch('');
                              }}
                              className={`w-full flex items-center justify-between p-2.5 rounded-[12px] text-left text-xs transition-colors ${
                                isSelected
                                  ? 'bg-[#0052ff]/10 text-[#0052ff] font-bold'
                                  : 'hover:bg-[#f7f8f9] text-[#0a0b0d]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-base leading-none">{curr.flag}</span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold block truncate">{curr.country}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isSelected ? 'bg-[#0052ff]/20 text-[#0052ff]' : 'bg-[#eef0f3] text-[#5b616e]'}`}>{curr.code}</span>
                                  </div>
                                  <span className={`text-[10px] block truncate ${isSelected ? 'text-[#0052ff]/80' : 'text-[#5b616e]'}`}>
                                    {curr.name} ({curr.symbol})
                                  </span>
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-[#0052ff] shrink-0 ml-2" />}
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
      </div>

      {/* Reset Demo Data & Logout */}
      <div className="pt-2 space-y-2">
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full py-3.5 px-4 rounded-full border border-[#f0616d]/30 bg-[#f0616d]/10 text-[#f0616d] hover:bg-[#f0616d]/20 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión</span>
          </button>
        )}

        {resetConfirm ? (
          <div className="p-5 bg-[#0a0b0d] text-[#ffffff] border border-[#0a0b0d] rounded-[24px] text-center space-y-3">
            <p className="text-xs font-semibold">
              ¿Restablecer datos iniciales de demostración?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  onResetData();
                  setResetConfirm(false);
                }}
                className="px-5 py-2 bg-[#f0616d] text-[#ffffff] rounded-full text-xs font-semibold hover:bg-[#f0616d]/90"
              >
                Sí, restablecer
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="px-5 py-2 bg-transparent text-[#ffffff] border border-[#ffffff]/40 rounded-full text-xs font-semibold hover:bg-[#ffffff]/10"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setResetConfirm(true)}
            className="w-full py-3.5 px-4 rounded-full border border-[#dedfe2] text-[#0a0b0d] hover:bg-[#f7f8f9] font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#5b616e]" />
            <span>Restablecer datos demo</span>
          </button>
        )}
      </div>
    </div>
  );
};
