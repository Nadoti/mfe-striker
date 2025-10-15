'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import './profile.css';

interface Session {
  id: string;
  email: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = () => {
      try {
        const sessionData = localStorage.getItem('auth_user');
        if (!sessionData) {
          return null;
        }
        return JSON.parse(sessionData);
      } catch (error) {
        console.error('Erro ao obter sessão:', error);
        return null;
      }
    };

    const userSession = getSession();
    
    if (!userSession) {
      window.location.href = '/login';
    } else {
      setSession(userSession);
    }
    
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    toast.promise(
      async () => {
        await supabase.auth.signOut();
        
        localStorage.removeItem('auth_session');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh_token');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        window.location.href = '/login';
      },
      {
        loading: 'Saindo da conta...',
        success: 'Logout realizado com sucesso!',
        error: 'Erro ao fazer logout',
      }
    );
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {session.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h1>Meu Perfil</h1>
        </div>

        <div className="profile-info">
          <div className="info-row">
            <span className="info-label">📧 Email</span>
            <span className="info-value">{session.email}</span>
          </div>

          <div className="info-row">
            <span className="info-label">🆔 ID</span>
            <span className="info-value">{session.id}</span>
          </div>

          <div className="info-row">
            <span className="info-label">📅 Conta criada em</span>
            <span className="info-value">{formatDate(session.createdAt)}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button className="logout-button" onClick={handleLogout}>
            Sair da Conta
          </button>
        </div>

      </div>
    </div>
  );
}

