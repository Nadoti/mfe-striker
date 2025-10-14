'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { TransactionService } from '@/services/transactionService';
import type { Transaction } from '@/types/transaction';
import './recent-transactions.css';

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await TransactionService.getTransactions({}, { page: 1, limit: 5 });
      setTransactions(data.data);
    } catch (error) {
      console.error('Erro ao carregar transações recentes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recent-transactions-card">
        <h3>Transações Recentes</h3>
        <div className="chart-loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="recent-transactions-card">
        <h3>Transações Recentes</h3>
        <div className="chart-empty">Nenhuma transação registrada</div>
      </div>
    );
  }

  return (
    <div className="recent-transactions-card">
      <div className="card-header">
        <h3>Transações Recentes</h3>
        <Link href="/dashboard/transactions" className="view-all-link">
          Ver todas →
        </Link>
      </div>

      <div className="transactions-list">
        {transactions.slice(0, 3).map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-info">
              <p className="transaction-description">
                {transaction.description || transaction.category}
              </p>
              <span className="transaction-date">
                {format(new Date(transaction.date), "dd 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
            <div className="transaction-amount-wrapper">
              <span className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'} R$ {Number(transaction.amount).toFixed(2)}
              </span>
              <span className="transaction-category">{transaction.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

