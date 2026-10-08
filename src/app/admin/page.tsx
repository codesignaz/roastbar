'use client';

import React, { useState, useEffect } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      // 1. Check local admin token
      if (typeof window !== 'undefined' && localStorage.getItem('roastbar_local_admin_auth') === 'true') {
        setIsAuthenticated(true);
        return;
      }

      // 2. Supabase session check
      const supabase = getSupabaseClient();
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            setIsAuthenticated(true);
            return;
          }

          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
              setIsAuthenticated(true);
            } else if (localStorage.getItem('roastbar_local_admin_auth') !== 'true') {
              setIsAuthenticated(false);
            }
          });

          return () => {
            subscription.unsubscribe();
          };
        } catch (err) {
          console.error('Supabase auth check error:', err);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('roastbar_local_admin_auth');
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#b87333]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onSignOut={handleSignOut} />;
}
