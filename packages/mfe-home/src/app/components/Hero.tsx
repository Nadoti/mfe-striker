'use client'

import { useState, useEffect } from 'react'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => setIsVisible(true), []);

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className={isVisible ? "fade-in" : ""}>
          <h1 className="hero-title">
            O futuro do <span className="title-gradient">digital banking</span>
          </h1>
          <p className="hero-description">
            Experimente uma nova era bancária com tecnologia de ponta, segurança máxima e atendimento humanizado 24/7.
          </p>
          <div className="hero-buttons">
            <button className="primary">Abrir Conta Gratuita</button>
            <button className="secondary">Saiba Mais</button>
          </div>
        </div>
        <div className={isVisible ? "fade-in" : ""}>
          <div className="card">
            <div>
              <div className="card-title">BlueCard Premium Black</div>
              <div className="card-number">**** **** **** 1234</div>
            </div>
            <div>
              <div className="card-valid">Válido até 12/28</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}