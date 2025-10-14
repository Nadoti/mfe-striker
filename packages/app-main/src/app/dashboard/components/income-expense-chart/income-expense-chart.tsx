'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TransactionService } from '@/services/transactionService';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './income-expense-chart.css';

export function IncomeExpenseChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados dos últimos 6 meses
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const start = format(startOfMonth(date), 'yyyy-MM-dd');
        const end = format(endOfMonth(date), 'yyyy-MM-dd');
        const monthName = format(date, 'MMM/yy', { locale: ptBR });

        const summary = await TransactionService.getFinancialSummary(start, end);

        months.push({
          month: monthName,
          Receitas: summary.totalIncome,
          Despesas: summary.totalExpense,
        });
      }

      setData(months);
    } catch (error) {
      console.error('Erro ao carregar gráfico de receitas/despesas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="chart-card">
        <h3>Receitas vs Despesas (Últimos 6 Meses)</h3>
        <div className="chart-loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>Receitas vs Despesas (Últimos 6 Meses)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="Receitas" fill="#059669" />
          <Bar dataKey="Despesas" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

