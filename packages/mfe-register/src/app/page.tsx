"use client";

import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Simulação de envio — depois você pode conectar com a API real
    if (!name || !email || !password) {
      setMessage("Preencha todos os campos.");
      return;
    }

    // Simulação de sucesso
    setMessage("Conta criada com sucesso! 🚀");

    // Limpa os campos
    setName("");
    setEmail("");
    setPassword("");
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
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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

          {message && (
            <p style={{ marginTop: "1rem", color: "#A5B4FC", fontSize: "0.9rem" }}>
              {message}
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

