'use client'

import Hero from "./components/Hero";
import Stats from "./components/Stats";

const statsData = [
  { number: "2M+", label: "Clientes Ativos" },
  { number: "50B+", label: "Transacionado" },
  { number: "84", label: "NPS" },
  { number: "24/7", label: "Suporte" },
];

export default function App() {
  return (
    <div className="home-container">
      <Hero />
      <Stats stats={statsData} />
      <div className="fx-container">
        <div className="pos-top-left-quarter size-96 bg-blue-soft rounded-full blur-xl animate-pulse"></div>
        <div className="pos-bottom-right-quarter size-96 bg-purple-soft rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
