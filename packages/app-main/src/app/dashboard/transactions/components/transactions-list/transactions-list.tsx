'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Transaction } from '@/types/transaction';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import './transactions-list.css';

interface Props {
  transactions: Transaction[];
  loading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionsList({ transactions, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhuma transação encontrada</p>
        <span>Adicione sua primeira transação para começar!</span>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Anexos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
              </td>
              <td>{transaction.description || '-'}</td>
              <td>
                <span className="category-badge">{transaction.category}</span>
              </td>
              <td>
                <span className={`type-badge type-${transaction.type}`}>
                  {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                </span>
              </td>
              <td>
                <span className={`amount amount-${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'} R$ {Number(transaction.amount).toFixed(2)}
                </span>
              </td>
              <td>
                {transaction.attachments && transaction.attachments.length > 0 ? (
                  <span className="attachments-badge" title={`${transaction.attachments.length} anexo(s)`}>
                    📎 {transaction.attachments.length}
                  </span>
                ) : (
                  <span className="no-attachments">-</span>
                )}
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => onEdit(transaction)}
                    title="Editar"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => onDelete(transaction.id)}
                    title="Excluir"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

