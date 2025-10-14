'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

/**
 * GuestGuard - Protege rotas que só devem ser acessadas por usuários NÃO logados
 * Se o usuário estiver logado, redireciona para /dashboard/home
 */
export function GuestGuard({ children }: Props) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Verificar se o usuário está logado
      const authToken = localStorage.getItem('auth_token');
      const authUser = localStorage.getItem('auth_user');

      // Se estiver logado, redirecionar para dashboard
      if (authToken && authUser) {
        router.replace('/dashboard/home');
        return;
      }

      // Se não estiver logado, permitir acesso
      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  // Mostrar loading enquanto verifica
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
      }}>
        <div style={{
          border: '3px solid rgba(255, 255, 255, 0.3)',
          borderTop: '3px solid white',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
        }}></div>
        <p style={{ marginTop: '1rem' }}>Verificando...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}

