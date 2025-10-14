'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import './login.css';
import { AuthLayout } from '../auth-layout/auth-layout';
import { SignupForm } from '../signup-form/signup-form';
import { GuestGuard } from '@/components/guest-guard/guest-guard';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos!');
      return;
    }

    setLoading(true);

    try {
      // Fazer login no Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        toast.error('Email ou senha incorretos!');
        setLoading(false);
        return;
      }

      if (data.user && data.session) {
        // Salvar dados do usuário no localStorage
        localStorage.setItem('auth_user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          createdAt: data.user.created_at,
        }));

        // Salvar token de sessão no localStorage
        localStorage.setItem('auth_token', data.session.access_token);
        localStorage.setItem('auth_refresh_token', data.session.refresh_token);

        toast.success('Login realizado com sucesso! Redirecionando...');
        
        // Redirecionar após 1 segundo
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }

    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast.error('Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <GuestGuard>
      <div className="d-flex justify-center">
        <AuthLayout title="Acesse sua conta">
          <SignupForm 
            setEmail={setEmail} 
            setPassword={setPassword} 
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </AuthLayout>
      </div>
    </GuestGuard>
  );
}

