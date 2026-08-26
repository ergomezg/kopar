import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Share2, Mail, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Household, Member } from '../../types';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  household: Household;
  onInviteMember: (email: string, name: string) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  household,
  onInviteMember,
}) => {
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [invitedSuccess, setInvitedSuccess] = useState(false);

  const inviteUrl = `https://kopar.app/join/${household.code}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmailInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    onInviteMember(inviteEmail.trim(), inviteName.trim() || 'Nuevo Miembro');
    setInviteEmail('');
    setInviteName('');
    setInvitedSuccess(true);
    setTimeout(() => setInvitedSuccess(false), 3000);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `¡Hola! Te invito a unirte a nuestro hogar "${household.name}" en KOPAR para llevar las cuentas claras sin líos: ${inviteUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
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
            className="w-full max-w-md bg-[#ffffff] rounded-t-[28px] sm:rounded-[28px] border border-[#dedfe2] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#dedfe2] bg-[#ffffff]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0052ff] text-[#ffffff] flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display text-[22px] font-bold text-[#0a0b0d]">Invitar a un integrante</h2>
                  <p className="text-[11px] text-[#5b616e]">Hogar: {household.name}</p>
                </div>
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
              {/* QR Code Container */}
              <div className="bg-[#f7f8f9] text-[#0a0b0d] p-6 rounded-[24px] border border-[#dedfe2] text-center flex flex-col items-center">
                <div className="bg-[#ffffff] p-3 rounded-[18px] border border-[#dedfe2] mb-2">
                  <QrCode className="w-24 h-24 text-[#0a0b0d]" />
                </div>
                <p className="font-display text-sm font-bold text-[#0a0b0d]">Escanea para unirte a {household.name}</p>
                <p className="text-[11px] text-[#5b616e] mt-0.5">Código único: <span className="font-mono font-bold text-[#0052ff]">{household.code}</span></p>
              </div>

              {/* Quick Share Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full border border-[#dedfe2] bg-[#ffffff] hover:bg-[#f7f8f9] text-[#0a0b0d] font-semibold text-xs transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-[#27ad75]" /> : <Copy className="w-4 h-4 text-[#0052ff]" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar enlace'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={shareWhatsApp}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full border border-[#0052ff] bg-[#0052ff] text-[#ffffff] hover:bg-[#0052ff]/90 font-semibold text-xs transition-all"
                >
                  <Share2 className="w-4 h-4 text-[#ffffff]" />
                  <span>WhatsApp</span>
                </motion.button>
              </div>

              {/* Email Invitation Form */}
              <form onSubmit={handleSendEmailInvite} className="pt-3 border-t border-[#dedfe2] space-y-2">
                <label className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider block">
                  Enviar invitación por correo
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nombre y Apellido (ej. Carlos Ramos)"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="px-3.5 py-2 rounded-full border border-[#dedfe2] text-xs font-semibold text-[#0a0b0d] bg-[#ffffff] focus:ring-2 focus:ring-[#0052ff] focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="px-3.5 py-2 rounded-full border border-[#dedfe2] text-xs font-semibold text-[#0a0b0d] bg-[#ffffff] focus:ring-2 focus:ring-[#0052ff] focus:outline-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#0052ff] hover:bg-[#0052ff]/90 text-[#ffffff] font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-[#0052ff]"
                >
                  <Mail className="w-4 h-4 text-[#ffffff]" />
                  <span>Enviar invitación</span>
                </motion.button>

                {invitedSuccess && (
                  <p className="text-xs text-[#27ad75] font-semibold text-center mt-1 flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#27ad75]" /> ¡Invitación registrada exitosamente!
                  </p>
                )}
              </form>

              {/* Current Members Status List */}
              <div className="pt-3 border-t border-[#dedfe2]">
                <p className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider mb-2">
                  Miembros actuales ({household.members.length}):
                </p>
                <div className="space-y-2">
                  {household.members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 rounded-[16px] bg-[#ffffff] border border-[#dedfe2]"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#dedfe2]"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#0a0b0d]">{m.name}</p>
                          <p className="text-[10px] text-[#5b616e]">{m.email}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          m.status === 'active'
                            ? 'border-[#27ad75]/30 bg-[#27ad75]/10 text-[#27ad75]'
                            : 'border-[#dedfe2] bg-[#f7f8f9] text-[#5b616e]'
                        }`}
                      >
                        {m.status === 'active' ? 'Aceptado' : 'Pendiente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

