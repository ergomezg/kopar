import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, Bell, Check, Trash2, User, Shield, LogOut, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Member } from '../types';
import { AppLogo } from './AppLogo';
import { formatDisplayName } from '../utils/format';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'expense' | 'settlement' | 'system' | 'member';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Nuevo gasto registrado',
    description: 'Mateo agregó "Supermercado Carulla" por $185.000',
    time: 'Hace 15 min',
    read: false,
    type: 'expense',
  },
  {
    id: 'n2',
    title: 'Pago liquidado',
    description: 'Sofía confirmó el pago de $45.000 correspondiente a servicios',
    time: 'Hace 2 horas',
    read: false,
    type: 'settlement',
  },
  {
    id: 'n3',
    title: 'Presupuesto de Servicios',
    description: 'Se ha alcanzado el 85% del presupuesto mensual estimado',
    time: 'Ayer',
    read: true,
    type: 'system',
  },
];

interface HeaderProps {
  currentMember?: Member;
  allMembers?: Member[];
  onSwitchUser?: (member: Member) => void;
  onOpenInvite: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMember,
  allMembers = [],
  onSwitchUser,
  onOpenInvite,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-[#ffffff] px-6 py-4 border-b border-[#dedfe2]">
      {/* Title: KOPAR Brand with AppLogo */}
      <div className="flex items-center gap-2">
        <AppLogo className="w-6 h-6 rounded-[7px]" />
        <h1 className="font-display text-[20px] font-extrabold tracking-wider text-[#0a0b0d] select-none">
          KOPAR
        </h1>
      </div>

      {/* Right Controls: Invite Button + Profile Button + Notifications Button */}
      <div className="flex items-center gap-2">
        {/* Invite Button with UserPlus icon */}
        <button 
          onClick={onOpenInvite}
          className="h-9 w-9 flex items-center justify-center border border-[#dedfe2] rounded-full bg-[#ffffff] text-[#0052ff] hover:bg-[#eef0f3] hover:border-[#0052ff]/40 transition-all shrink-0 box-border cursor-pointer"
          title="Invitar a un integrante"
          aria-label="Invitar a un integrante"
        >
          <UserPlus className="w-4 h-4 text-[#0052ff]" />
        </button>

        {/* User Profile Button: Avatar + Nombre e Inicial del apellido */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="h-9 w-[110px] pl-1 pr-3 flex items-center gap-2 border border-[#dedfe2] rounded-full bg-[#ffffff] hover:bg-[#f7f8f9] hover:border-[#0052ff]/60 hover:ring-2 hover:ring-[#0052ff]/10 transition-all shrink-0 box-border cursor-pointer select-none"
            title={currentMember ? `Perfil: ${currentMember.name}` : "Perfil de usuario"}
            aria-label="Perfil de usuario"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-[#dedfe2] shrink-0">
              {currentMember?.avatar ? (
                <img
                  src={currentMember.avatar}
                  alt={currentMember.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-[#eef0f3] text-[#0052ff] flex items-center justify-center text-xs font-bold">
                  {currentMember?.name ? currentMember.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
              )}
            </div>
            <span className="text-xs font-bold text-[#0a0b0d] truncate max-w-[110px]">
              {formatDisplayName(currentMember?.name)}
            </span>
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-2 w-72 rounded-[24px] bg-[#ffffff] border border-[#dedfe2] p-4 z-50 shadow-xl space-y-3.5"
              >
                {/* Current User Info */}
                <div className="flex items-center gap-3 pb-3 border-b border-[#dedfe2]">
                  {currentMember?.avatar ? (
                    <img
                      src={currentMember.avatar}
                      alt={currentMember.name}
                      className="w-11 h-11 rounded-full object-cover border border-[#dedfe2] shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#eef0f3] text-[#0052ff] flex items-center justify-center text-sm font-bold shrink-0">
                      {currentMember?.name ? currentMember.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#0a0b0d] truncate">
                      {formatDisplayName(currentMember?.name)}
                    </p>
                    <p className="text-[11px] text-[#5b616e] truncate">
                      {currentMember?.email || 'Sin correo asignado'}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          currentMember?.role === 'admin'
                            ? 'bg-[#0052ff]/10 text-[#0052ff] border border-[#0052ff]/20'
                            : 'bg-[#eef0f3] text-[#5b616e] border border-[#dedfe2]'
                        }`}
                      >
                        {currentMember?.role === 'admin' && <Shield className="w-2.5 h-2.5" />}
                        {currentMember?.role === 'admin' ? 'Administrador' : 'Miembro'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Switch User List if multiple members exist */}
                {allMembers.length > 1 && onSwitchUser && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#5b616e] uppercase tracking-wider px-1">
                      <span>Cambiar usuario</span>
                      <Users className="w-3.5 h-3.5 text-[#8a919e]" />
                    </div>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {allMembers.map((m) => {
                        const isCurrent = m.id === currentMember?.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              onSwitchUser(m);
                              setShowProfile(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-[12px] text-left transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-[#0052ff]/10 text-[#0052ff]'
                                : 'hover:bg-[#f7f8f9] text-[#0a0b0d]'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={m.avatar}
                                alt={m.name}
                                className="w-6 h-6 rounded-full object-cover border border-[#dedfe2] shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate">{formatDisplayName(m.name)}</p>
                              </div>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-[#0052ff] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Logout Action */}
                {onLogout && (
                  <div className="pt-2 border-t border-[#dedfe2]">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfile(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs font-semibold text-[#f0616d] hover:bg-[#f0616d]/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications Button */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
            }}
            className="relative h-9 w-9 flex items-center justify-center border border-[#dedfe2] rounded-full bg-[#ffffff] text-[#0a0b0d] hover:bg-[#eef0f3] hover:text-[#0052ff] hover:border-[#0052ff]/40 transition-all shrink-0 box-border cursor-pointer"
            title="Notificaciones"
            aria-label="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0052ff] ring-2 ring-[#ffffff]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-2 w-80 sm:w-92 rounded-[24px] bg-[#ffffff] border border-[#dedfe2] p-4 z-50 shadow-xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#dedfe2]">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#0a0b0d]">Notificaciones</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#0052ff]/10 text-[#0052ff] text-[11px] font-bold">
                        {unreadCount} nuevas
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="p-1 text-[#5b616e] hover:text-[#0052ff] rounded-full hover:bg-[#f7f8f9] transition-colors"
                          title="Marcar todas como leídas"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={handleClearNotifications}
                        className="p-1 text-[#5b616e] hover:text-[#f0616d] rounded-full hover:bg-[#f7f8f9] transition-colors"
                        title="Limpiar todas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#eef0f3] flex items-center justify-center text-[#5b616e]">
                      <Bell className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-[#0a0b0d]">Sin notificaciones</p>
                    <p className="text-[11px] text-[#5b616e] mt-0.5">Estás al día con la actividad del hogar</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#dedfe2] max-h-72 overflow-y-auto mt-1">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleRead(item.id)}
                        className={`py-3 px-2 rounded-[14px] flex items-start gap-3 cursor-pointer transition-colors ${
                          item.read ? 'hover:bg-[#f7f8f9] opacity-75' : 'bg-[#0052ff]/5 hover:bg-[#0052ff]/10'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                            item.read ? 'bg-transparent' : 'bg-[#0052ff]'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${item.read ? 'text-[#0a0b0d]' : 'text-[#0052ff]'}`}>
                            {item.title}
                          </p>
                          <p className="text-[11px] text-[#5b616e] mt-0.5 leading-snug">
                            {item.description}
                          </p>
                          <span className="text-[10px] text-[#8a919e] mt-1 block">
                            {item.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};


