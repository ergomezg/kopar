import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Home, 
  Check, 
  AlertCircle, 
  QrCode, 
  Shield,
  UserPlus,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRENCIES } from '../tabs/HogarTab';
import { AppLogo } from '../AppLogo';

interface AuthScreenProps {
  initialMode?: 'login' | 'signup';
  onBackToWelcome: () => void;
  onAuthSuccess: (userData: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'admin' | 'member';
    householdName?: string;
    householdCode?: string;
    currency?: string;
  }) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  onBackToWelcome,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Scroll to top on mode changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [mode]);
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [householdMode, setHouseholdMode] = useState<'create' | 'join'>('create');
  const [householdName, setHouseholdName] = useState('Mi Hogar Principal');
  const [inviteCode, setInviteCode] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('COP $');
  const [acceptTerms, setAcceptTerms] = useState(true);

  // UI States
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Quick Demo Login Helper
  const handleDemoLogin = (memberName: string, memberEmail: string) => {
    setIsSubmitting(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsSubmitting(false);
      onAuthSuccess({
        id: `user_${Date.now()}`,
        name: memberName,
        email: memberEmail,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        role: 'admin',
      });
    }, 600);
  };

  // Social Signup Helper (Google / Apple)
  const handleSocialSignup = (provider: 'google' | 'apple') => {
    setIsSubmitting(true);
    setErrorMsg('');
    const userName = provider === 'google' ? 'Laura Mendoza (Google)' : 'Laura Mendoza (Apple)';
    const userEmail = provider === 'google' ? 'laura.google@ejemplo.com' : 'laura.apple@ejemplo.com';

    const userRole = householdMode === 'join' ? 'member' : 'admin';

    setTimeout(() => {
      setIsSubmitting(false);
      onAuthSuccess({
        id: `user_${Date.now()}`,
        name: userName,
        email: userEmail,
        avatar: provider === 'google' 
          ? `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80`
          : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        role: userRole,
        householdName: householdMode === 'create' ? householdName : undefined,
        householdCode: householdMode === 'join' ? (inviteCode.trim().toUpperCase() || 'HOME-8921') : undefined,
        currency: selectedCurrency,
      });
    }, 700);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Por favor ingresa tu correo electrónico y contraseña.');
      return;
    }

    if (!loginEmail.includes('@')) {
      setErrorMsg('Ingresa un correo electrónico válido.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Simulate successful login
      onAuthSuccess({
        id: `user_${Date.now()}`,
        name: loginEmail.split('@')[0].replace('.', ' '),
        email: loginEmail,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        role: 'admin',
      });
    }, 800);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setErrorMsg('Todos los campos marcados son obligatorios.');
      return;
    }

    if (!signupEmail.includes('@')) {
      setErrorMsg('Ingresa un correo electrónico válido.');
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    if (householdMode === 'join' && !inviteCode.trim()) {
      setErrorMsg('Por favor ingresa el código de invitación de tu hogar.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('Debes aceptar los Términos de Servicio para continuar.');
      return;
    }

    const userRole = householdMode === 'join' ? 'member' : 'admin';

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onAuthSuccess({
        id: `user_${Date.now()}`,
        name: signupName,
        email: signupEmail,
        avatar: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80`,
        role: userRole,
        householdName: householdMode === 'create' ? householdName : undefined,
        householdCode: householdMode === 'join' ? inviteCode.toUpperCase() : undefined,
        currency: selectedCurrency,
      });
    }, 900);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
      setForgotEmail('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0a0b0d] flex flex-col justify-between p-6 max-w-lg mx-auto relative font-sans">
      {/* Top Bar with Back Button and Brand */}
      <div className="flex items-center justify-between pb-4 border-b border-[#dedfe2]">
        <button
          onClick={onBackToWelcome}
          className="w-10 h-10 rounded-full bg-[#f7f8f9] hover:bg-[#eef0f3] border border-[#dedfe2] flex items-center justify-center text-[#0a0b0d] transition-all"
          title="Volver a la pantalla de bienvenida"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <AppLogo className="w-7 h-7 rounded-[8px]" />
          <span className="font-display font-extrabold text-base tracking-wider text-[#0a0b0d]">
            KOPAR
          </span>
        </div>

        <div className="w-10" />
      </div>

      {/* Main Container */}
      <div className="py-6 flex-1 flex flex-col justify-center">
        {/* Toggle Segmented Tabs for Login / Signup */}
        <div className="p-1 rounded-[18px] bg-[#f7f8f9] border border-[#dedfe2] flex gap-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-[14px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-[#ffffff] text-[#0052ff] shadow-sm border border-[#dedfe2]'
                : 'text-[#5b616e] hover:text-[#0a0b0d]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Iniciar sesión</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-[14px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mode === 'signup'
                ? 'bg-[#ffffff] text-[#0052ff] shadow-sm border border-[#dedfe2]'
                : 'text-[#5b616e] hover:text-[#0a0b0d]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Crear cuenta</span>
          </button>
        </div>

        {/* Display Error Message */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-[16px] bg-[#f0616d]/10 border border-[#f0616d]/20 text-[#f0616d] text-xs font-semibold flex items-center gap-2.5 mb-5"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            /* LOGIN FORM */
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleLoginSubmit}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-black text-[#0a0b0d]">
                  ¡Hola de nuevo! 👋
                </h2>
                <p className="text-xs text-[#5b616e]">
                  Ingresa tus credenciales para acceder a tu hogar.
                </p>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0a0b0d]">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8a919e] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#f7f8f9] border border-[#dedfe2] rounded-[16px] text-xs text-[#0a0b0d] placeholder-[#8a919e] focus:outline-none focus:ring-2 focus:ring-[#0052ff] focus:bg-[#ffffff] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0a0b0d]">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-semibold text-[#0052ff] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8a919e] absolute left-3.5 top-3.5" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-[#f7f8f9] border border-[#dedfe2] rounded-[16px] text-xs text-[#0a0b0d] placeholder-[#8a919e] focus:outline-none focus:ring-2 focus:ring-[#0052ff] focus:bg-[#ffffff] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3.5 text-[#8a919e] hover:text-[#0a0b0d]"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#dedfe2] text-[#0052ff] focus:ring-[#0052ff]"
                />
                <label htmlFor="rememberMe" className="text-xs font-medium text-[#5b616e] cursor-pointer">
                  Recordarme en este dispositivo
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-[18px] bg-[#0052ff] hover:bg-[#0045d8] text-[#ffffff] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0052ff]/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Iniciar sesión</span>
                )}
              </button>

              {/* Social Login Divider */}
              <div className="relative py-2 text-center my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#dedfe2]" />
                </div>
                <span className="relative px-3 bg-[#ffffff] text-[11px] font-bold text-[#7a8290] uppercase tracking-wider">
                  O ENTRA CON
                </span>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Carlos Mendoza', 'carlos@ejemplo.com')}
                  className="py-3 px-4 rounded-full bg-[#f8f9fa] hover:bg-[#f1f3f5] border border-[#dedfe2] text-sm font-semibold text-[#1e232a] flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('Ana María Torres', 'ana@ejemplo.com')}
                  className="py-3 px-4 rounded-full bg-[#f8f9fa] hover:bg-[#f1f3f5] border border-[#dedfe2] text-sm font-semibold text-[#1e232a] flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 text-[#1e232a] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.12-1.96.99-3.11-1 .04-2.22.67-2.93 1.5-.64.74-1.2 1.92-1.05 3.05 1.12.09 2.32-.62 2.99-1.44z"/>
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              {/* Demo Account Box */}
              <div className="pt-2">
                <div className="p-3.5 rounded-[18px] bg-[#0052ff]/5 border border-[#0052ff]/15 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#0052ff]">¿Quieres probar sin contraseña?</p>
                    <p className="text-[11px] text-[#5b616e]">Entra al instante con la cuenta demo.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('Carlos Mendoza', 'carlos@ejemplo.com')}
                    className="px-3 py-1.5 rounded-full bg-[#0052ff] text-[#ffffff] text-xs font-bold hover:bg-[#0045d8] transition-all shrink-0"
                  >
                    Entrar demo
                  </button>
                </div>
              </div>
            </motion.form>
          ) : (
            /* SIGNUP FORM */
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSignupSubmit}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-black text-[#0a0b0d]">
                  Crea tu cuenta
                </h2>
                <p className="text-xs text-[#5b616e]">
                  Comienza a dividir gastos de tu hogar en menos de 1 minuto.
                </p>
              </div>

              {/* Social Signup Divider */}
              <div className="relative py-2 text-center my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#dedfe2]" />
                </div>
                <span className="relative px-3 bg-[#ffffff] text-[11px] font-bold text-[#7a8290] uppercase tracking-wider">
                  Regístrate con un click
                </span>
              </div>

              {/* Social Buttons (Google & Apple Pill Buttons) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialSignup('google')}
                  className="py-3 px-4 rounded-full bg-[#f8f9fa] hover:bg-[#f1f3f5] border border-[#dedfe2] text-sm font-semibold text-[#1e232a] flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialSignup('apple')}
                  className="py-3 px-4 rounded-full bg-[#f8f9fa] hover:bg-[#f1f3f5] border border-[#dedfe2] text-sm font-semibold text-[#1e232a] flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 text-[#1e232a] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.12-1.96.99-3.11-1 .04-2.22.67-2.93 1.5-.64.74-1.2 1.92-1.05 3.05 1.12.09 2.32-.62 2.99-1.44z"/>
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0a0b0d]">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8a919e] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Ej. Laura Mendoza"
                    className="w-full pl-10 pr-4 py-3 bg-[#f7f8f9] border border-[#dedfe2] rounded-[16px] text-xs text-[#0a0b0d] placeholder-[#8a919e] focus:outline-none focus:ring-2 focus:ring-[#0052ff] focus:bg-[#ffffff] transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0a0b0d]">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8a919e] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#f7f8f9] border border-[#dedfe2] rounded-[16px] text-xs text-[#0a0b0d] placeholder-[#8a919e] focus:outline-none focus:ring-2 focus:ring-[#0052ff] focus:bg-[#ffffff] transition-all"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0a0b0d]">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8a919e] absolute left-3.5 top-3.5" />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Mín. 6 carac."
                      className="w-full pl-10 pr-8 py-3 bg-[#f7f8f9] border border-[#dedfe2] rounded-[16px] text-xs text-[#0a0b0d] placeholder-[#8a919e] focus:outline-none focus:ring-2 focus:ring-[#0052ff] focus:bg-[#ffffff] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-2.5 top-3.5 text-[#8a919e]"
                    >
                      {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0a0b0d]">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8a919e] absolute left-3.5 top-3.5" />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Repite contraseña"
                      className="w-full pl-10 pr-4 py-3 bg-[#f7f8f9] border border-[#dedfe2] rounded-[16px] text-xs text-[#0a0b0d] placeholder-[#8a919e] focus:outline-none focus:ring-2 focus:ring-[#0052ff] focus:bg-[#ffffff] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Household Configuration Selection */}
              <div className="pt-2 border-t border-[#dedfe2] space-y-3">
                <label className="text-xs font-bold text-[#0a0b0d] block">
                  Configuración Inicial del Hogar:
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHouseholdMode('create')}
                    className={`p-3 rounded-[16px] border text-left transition-all ${
                      householdMode === 'create'
                        ? 'border-[#0052ff] bg-[#0052ff]/5 text-[#0052ff] font-bold'
                        : 'border-[#dedfe2] bg-[#f7f8f9] text-[#5b616e]'
                    }`}
                  >
                    <Home className="w-4 h-4 mb-1" />
                    <p className="text-xs font-extrabold">Crear nuevo hogar</p>
                    <p className="text-[10px] opacity-80">Serás el administrador</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHouseholdMode('join')}
                    className={`p-3 rounded-[16px] border text-left transition-all ${
                      householdMode === 'join'
                        ? 'border-[#0052ff] bg-[#0052ff]/5 text-[#0052ff] font-bold'
                        : 'border-[#dedfe2] bg-[#f7f8f9] text-[#5b616e]'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mb-1" />
                    <p className="text-xs font-extrabold">Unirme con código</p>
                    <p className="text-[10px] opacity-80">Si te invitaron a un hogar</p>
                  </button>
                </div>

                {householdMode === 'create' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#5b616e]">
                        Nombre del Hogar
                      </label>
                      <input
                        type="text"
                        value={householdName}
                        onChange={(e) => setHouseholdName(e.target.value)}
                        placeholder="Ej. Casa Los Pinos"
                        className="w-full px-3 py-2.5 bg-[#f7f8f9] border border-[#dedfe2] rounded-[14px] text-xs text-[#0a0b0d] focus:outline-none focus:ring-2 focus:ring-[#0052ff]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#5b616e]">
                        Moneda Principal
                      </label>
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#f7f8f9] border border-[#dedfe2] rounded-[14px] text-xs text-[#0a0b0d] focus:outline-none focus:ring-2 focus:ring-[#0052ff]"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.symbol}>
                            {c.flag} {c.country} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#5b616e]">
                      Código de Invitación del Hogar
                    </label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      placeholder="Ej. HOME-8921"
                      className="w-full px-3 py-2.5 bg-[#f7f8f9] border border-[#dedfe2] rounded-[14px] text-xs font-mono font-bold uppercase tracking-wider text-[#0a0b0d] focus:outline-none focus:ring-2 focus:ring-[#0052ff]"
                    />
                  </div>
                )}
              </div>

              {/* Accept Terms Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-[#dedfe2] text-[#0052ff] focus:ring-[#0052ff]"
                />
                <label htmlFor="acceptTerms" className="text-[11px] font-medium text-[#5b616e] cursor-pointer leading-tight">
                  Acepto los <span className="text-[#0052ff] underline">Términos de Servicio</span> y la <span className="text-[#0052ff] underline">Política de Privacidad</span>.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-[18px] bg-[#0052ff] hover:bg-[#0045d8] text-[#ffffff] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0052ff]/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Crear mi cuenta y continuar</span>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Forgot Password Modal Dialog */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0b0d]/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-[24px] bg-[#ffffff] border border-[#dedfe2] p-6 shadow-2xl space-y-4"
            >
              <div className="space-y-1">
                <h3 className="font-display font-black text-lg text-[#0a0b0d]">
                  Recuperar contraseña
                </h3>
                <p className="text-xs text-[#5b616e]">
                  Ingresa tu correo para enviarte un enlace de restablecimiento.
                </p>
              </div>

              {forgotSuccess ? (
                <div className="p-4 rounded-[16px] bg-[#27ad75]/10 border border-[#27ad75]/20 text-[#27ad75] text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Te enviamos un correo con las instrucciones.</span>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#f7f8f9] border border-[#dedfe2] rounded-[14px] text-xs text-[#0a0b0d] focus:outline-none focus:ring-2 focus:ring-[#0052ff]"
                  />
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2 rounded-full text-xs font-bold text-[#5b616e] hover:bg-[#f7f8f9]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-full bg-[#0052ff] text-[#ffffff] text-xs font-bold hover:bg-[#0045d8]"
                    >
                      Enviar enlace
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
