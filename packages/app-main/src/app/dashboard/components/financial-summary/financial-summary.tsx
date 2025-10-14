'use client';

import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import './financial-summary.css';

interface Props {
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
}

export function FinancialSummary({ summary }: Props) {
  return (
    <div className="financial-summary">
      <div className="summary-card income-card">
        <div className="card-icon">
          <FiTrendingUp />
        </div>
        <div className="card-content">
          <p className="card-label">Receitas</p>
          <h3 className="card-value">R$ {summary.totalIncome.toFixed(2)}</h3>
        </div>
      </div>

      <div className="summary-card expense-card">
        <div className="card-icon">
          <FiTrendingDown />
        </div>
        <div className="card-content">
          <p className="card-label">Despesas</p>
          <h3 className="card-value">R$ {summary.totalExpense.toFixed(2)}</h3>
        </div>
      </div>

      <div className="summary-card balance-card">
        <div className="card-icon">
          <FiDollarSign />
        </div>
        <div className="card-content">
          <p className="card-label">Saldo</p>
          <h3 className={`card-value ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
            R$ {summary.balance.toFixed(2)}
          </h3>
        </div>
      </div>
    </div>
  );
}

