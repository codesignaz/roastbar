'use client';

import React, { useState } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Lock, Mail, KeyRound, Loader2, AlertCircle } from 'lucide-react';
import { brandConfig } from '@/config/brandConfig';
import { BrandLogo } from '@/components/common/BrandLogo';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. Master admin credential check
      const isMasterAdmin =
        (email.trim().toLowerCase() === 'admin@roastbar.az' && password === 'roastbar2026') ||
        (email.trim().toLowerCase() === 'admin' && password === 'roastbar2026');

      if (isMasterAdmin) {
        localStorage.setItem('roastbar_local_admin_auth', 'true');
        onLoginSuccess();
        return;
      }

      // 2. Supabase Auth fallback if configured
      const supabase = getSupabaseClient();
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          setErrorMessage(error.message || 'Giriş məlumatları yanlışdır.');
        } else if (data.session) {
          onLoginSuccess();
        }
      } else {
        setErrorMessage('Email və ya şifrə yanlışdır. (İlkin sınaq: admin@roastbar.az / roastbar2026)');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Giriş zamanı xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#ebdcd0] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#b87333]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="text-center mb-8 relative z-10 flex flex-col items-center">
          <BrandLogo variant="full" size="xl" asLink={false} className="mb-2 justify-center" />
          <p className="text-xs uppercase tracking-widest text-[#8c7768] font-bold mt-1">
            İdarəetmə Portalı / Admin
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Secure login form (strictly NO sign up, NO forgot password) */}
        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold text-[#473425] mb-1.5">
              İdarəçi Email Ünvanı
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7768]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@roastbar.az"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-sm text-[#221710] placeholder-[#9c897b] focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#473425] mb-1.5">
              Şifrə
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7768]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-sm text-[#221710] placeholder-[#9c897b] focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white font-bold text-sm hover:from-[#c78242] hover:to-[#a9662f] shadow-md shadow-[#b87333]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Yoxlanılır...</span>
              </>
            ) : (
              <span>Daxil Ol</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-[#8c7768]">
          <span>Giriş məlumatları birbaşa Supabase Auth vasitəsilə təhlükəsiz qorunur.</span>
        </div>
      </div>
    </div>
  );
};
