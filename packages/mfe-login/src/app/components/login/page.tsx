'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import './login.css';
import { AuthLayout } from '../AuthLayout';
import { SignupForm } from '../SignupForm';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos!');
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
        setError('Email ou senha incorretos!');
        setLoading(false);
        return;
      }

      if (data.user) {
        // Salvar sessão no localStorage
        localStorage.setItem('auth_session', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          createdAt: data.user.created_at,
        }));

        // alert('✅ Login realizado com sucesso! Redirecionando...');
        // window.location.href = '/dashboard/home';
      }

    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      setError('Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-center">
      <AuthLayout title="Acesse sua conta">
        <SignupForm setEmail={setEmail} setPassword={setPassword} handleSubmit={handleSubmit} />
      </AuthLayout>
    </div>
  );
}

