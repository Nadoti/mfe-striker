import BalanceBox from "./components/balance-box/balance-box";
import ChartBox from "./components/chart-box/chart-box";
import InfoBox from "./components/info-box/info-box";

const entrada = "R$ 5.000,00";
const saida = "R$ 5.000,00";
const saldo = "R$ 5.000,00";
const data = "Sexta-feira, 05/09/2025";

export default function HomePage() {
  return (
    <div style={{ padding: "36px", }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap" }}>
        <InfoBox label="Entrada:" value={entrada} />
        <InfoBox label="Saída:" value={saida} />
      </div>
      <BalanceBox value={saldo} date={data} />
      <ChartBox />
    </div>
  );
}
