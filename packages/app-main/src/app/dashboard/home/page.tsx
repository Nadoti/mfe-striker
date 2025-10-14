'use client';

import { useState, useEffect } from 'react';
import { TransactionService } from '@/services/transactionService';
import { FinancialSummary } from '../components/financial-summary/financial-summary';
import { ExpenseChart } from '../components/expense-chart/expense-chart';
import { IncomeExpenseChart } from '../components/income-expense-chart/income-expense-chart';
import { RecentTransactions } from '../components/recent-transactions/recent-transactions';
import '../dashboard.css';

export default function DashboardHome() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const summaryData = await TransactionService.getFinancialSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard Financeiro</h1>
        <p>Visão geral das suas finanças</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      ) : (
        <>
          <FinancialSummary summary={summary} />
          
          <div className="charts-grid">
            <IncomeExpenseChart />
            <ExpenseChart />
          </div>

          <RecentTransactions />
        </>
      )}
    </div>
  );
}
