'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './components/navbar/navbar';
import { Header } from './components/header/header';
import { LogoutModal } from './components/logout-modal/logout-modal';
import { AuthGuard } from '@/components/auth-guard/auth-guard';
import { useLogoutStore } from '@/store/useLogoutStore';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import './dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isOpen, isLoading, closeModal, setLoading } = useLogoutStore();

  const handleLogout = async () => {
    setLoading(true);

    try {
      const { supabase: supabaseClient } = await import('@/lib/supabase');
      await supabaseClient.auth.signOut();
      
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_session');
      
      toast.success('Logout realizado com sucesso!');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="dashboard-container">
        <Navbar />

        <div>
          <Header />
          <main className="dashboard-content">
            {children}
          </main>
        </div>

        <LogoutModal
          isOpen={isOpen}
          onClose={closeModal}
          onConfirm={handleLogout}
          loading={isLoading}
        />
      </div>
    </AuthGuard>
  );
}
