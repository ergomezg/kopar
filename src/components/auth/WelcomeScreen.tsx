import React, { useEffect } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { AppLogo } from '../AppLogo';

interface WelcomeScreenProps {
  onGoToLogin: () => void;
  onGoToSignup: () => void;
  onContinueAsGuest: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGoToLogin,
  onGoToSignup,
  onContinueAsGuest,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);
  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0a0b0d] flex flex-col justify-between items-center p-6 sm:p-8 font-sans selection:bg-[#0052ff] selection:text-[#ffffff]">
      {/* Top Spacer for balance */}
      <div className="w-full h-8" />

      {/* Center Container: Brand + Core Action */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm flex flex-col items-center text-center"
      >
        {/* Brand Mark & Title */}
        <div className="flex flex-col items-center mb-6">
          <AppLogo className="w-14 h-14 rounded-[14px] mb-4" />
          <h1 className="font-display font-extrabold text-[28px] sm:text-[32px] tracking-tight text-[#0a0b0d] leading-tight">
            KOPAR
          </h1>
          <p className="text-[14px] text-[#5b616e] leading-normal mt-2 max-w-xs">
            Divide gastos, mantén la armonía en casa.
          </p>
        </div>

        {/* Central Card with Direct Actions */}
        <div className="w-full bg-[#f7f8f9] border border-[#dedfe2] rounded-[24px] p-5 sm:p-6 flex flex-col gap-3">
          {/* Primary CTA */}
          <button
            type="button"
            onClick={onGoToSignup}
            className="w-full h-12 rounded-full bg-[#0052ff] hover:bg-[#0045d8] text-[#ffffff] font-semibold text-sm px-6 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
          >
            <span>Comenzar</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary CTA: Login */}
          <button
            type="button"
            onClick={onGoToLogin}
            className="w-full h-11 rounded-full bg-[#ffffff] hover:bg-[#eef0f3] text-[#0a0b0d] font-semibold text-sm px-6 border border-[#dedfe2] flex items-center justify-center transition-all cursor-pointer active:scale-[0.99]"
          >
            Ya tengo una cuenta
          </button>
        </div>

        {/* Quick Demo Shortcut */}
        <button
          type="button"
          onClick={onContinueAsGuest}
          className="mt-5 text-[12px] font-medium text-[#5b616e] hover:text-[#0052ff] inline-flex items-center gap-1 transition-colors cursor-pointer py-1"
        >
          <span>Explorar en modo demostración</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Subtle Footer Note */}
      <div className="w-full text-center">
        <span className="text-[11px] text-[#8a919e]">
          Gastos claros • Cuentas equilibradas
        </span>
      </div>
    </div>
  );
};
