'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

interface Props {
  children: React.ReactNode;
}

export function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated() && pathname.startsWith('/dashboard')) {
        router.replace('/login');
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#262627',
        color: '#fff',
      }}>
        <div style={{
          border: '3px solid #333',
          borderTop: '3px solid #667eea',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
        }}></div>
        <p style={{ marginTop: '1rem' }}>Verificando autenticação...</p>
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

