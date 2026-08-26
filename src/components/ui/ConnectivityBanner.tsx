import React, { useState, useEffect } from 'react';
import { WifiOff, RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ConnectivityBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#0a0b0d] text-[#ffffff] px-4 py-2 text-xs font-semibold flex items-center justify-between z-50 sticky top-0 border-b border-[#222]"
        >
          <div className="flex items-center gap-2 max-w-md mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f0616d] animate-pulse" />
              <WifiOff className="w-3.5 h-3.5 text-[#f0616d]" />
              <span>Modo sin conexión • Los cambios se sincronizarán al reconectar</span>
            </div>
            <span className="text-[10px] text-[#8a919e] font-mono uppercase bg-[#1a1c20] px-2 py-0.5 rounded-full">
              Local
            </span>
          </div>
        </motion.div>
      )}

      {showReconnected && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#27ad75] text-[#ffffff] px-4 py-2 text-xs font-semibold flex items-center justify-center z-50 sticky top-0"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Conexión restablecida • Datos sincronizados</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
