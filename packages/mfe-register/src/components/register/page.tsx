'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import './register.css';

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!email || !password) {
      setError('Por favor, preencha todos os campos!');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Por favor, insira um email válido!');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres!');
      return;
    }

    if (password !== password) {
      setError('As senhas não coincidem!');
      return;
    }

    setLoading(true);

    try {
      // Registrar no Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (signUpError) {
        setError(signUpError.message);
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

        alert('✅ Conta criada com sucesso! Redirecionando...');
        window.location.href = '/login';
      }

    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      setError('Erro ao criar conta. Tente novamente.');
      setLoading(false);
    }
  };

  return (
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

            <button type="submit" className="primary-button">
              Criar conta
            </button>
          </form>

          {error && (
            <p style={{ marginTop: "1rem", color: "#A5B4FC", fontSize: "0.9rem" }}>
              {error}
            </p>
          )}

          <div className="login-link">
            Já tem uma conta? <a href="/login">Entre aqui</a>
          </div>
        </div>
      </div>
    </div>
  );
}

