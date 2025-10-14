'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { GuestGuard } from '@/components/guest-guard/guest-guard';
import './register.css';

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos!');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Por favor, insira um email válido!');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres!');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (signUpError) {
        toast.error(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        localStorage.setItem('auth_user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          createdAt: data.user.created_at,
        }));

        if (data.session) {
          localStorage.setItem('auth_token', data.session.access_token);
          localStorage.setItem('auth_refresh_token', data.session.refresh_token);
        }

        toast.success('Conta criada com sucesso! Redirecionando...');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }

    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      toast.error('Erro ao criar conta. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <GuestGuard>
      <div className="d-flex justify-center align-items-center height-100">
        <div className="auth-container">
          <h1 className="brand">Blue Bank</h1>

          <div className="auth-box">
            <h2 className="auth-title">Crie sua conta</h2>

            <form onSubmit={handleSubmit}>

              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>

            <div className="login-link">
              Já tem uma conta? <a href="/login">Entre aqui</a>
            </div>
          </div>
        </div>
      </div>
    </GuestGuard>
  );
}

