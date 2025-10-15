'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import './auth-guard.css';

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
      <div className="auth-guard-loading">
        <div className="auth-guard-spinner"></div>
        <p className="auth-guard-message">Verificando autenticação...</p>
      </div>
    );
  }

  return <>{children}</>;
}
