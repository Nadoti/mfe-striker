'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TransactionService } from '@/services/transactionService';
import './expense-chart.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

export function ExpenseChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const categories = await TransactionService.getTransactionsByCategory('expense');
      const formatted = categories.map((item: any) => ({
        name: item.category,
        value: item.total,
      }));
      setData(formatted);
    } catch (error) {
      console.error('Erro ao carregar gráfico de despesas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="chart-card">
        <h3>Despesas por Categoria</h3>
        <div className="chart-loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <h3>Despesas por Categoria</h3>
        <div className="chart-empty">Nenhuma despesa registrada</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>Despesas por Categoria</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: R$ ${entry.value.toFixed(2)}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

