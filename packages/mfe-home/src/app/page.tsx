'use client'

import Hero from "./components/hero/hero";
import Stats from "./components/stats/stats";

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
      <div className="effects-container">
        <div className="effect-blob effect-blob-blue effect-blob-top-left"></div>
        <div className="effect-blob effect-blob-purple effect-blob-bottom-right effect-blob-delayed"></div>
      </div>
    </div>
  );
}
