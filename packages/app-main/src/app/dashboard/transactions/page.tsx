'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { TransactionService } from '@/services/transactionService';
import type { Transaction, TransactionFilters, PaginatedResponse } from '@/types/transaction';
import { TransactionsList } from './components/transactions-list/transactions-list';
import { TransactionFilter } from './components/transaction-filter/transaction-filter';
import { TransactionModal } from './components/transaction-modal/transaction-modal';
import { ConfirmModal } from '@/components/confirm-modal/confirm-modal';
import './transactions.css';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<PaginatedResponse<Transaction>>({
    data: [],
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Carregar transações
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await TransactionService.getTransactions(filters, {
        page,
        limit: 6,
      });
      setTransactions(data);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  // Recarregar ao mudar filtros ou página
  useEffect(() => {
    loadTransactions();
  }, [filters, page]);

  // Abrir modal para criar
  const handleCreate = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Abrir modal de confirmação de exclusão
  const handleDelete = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Confirmar exclusão
  const confirmDelete = async () => {
    if (!transactionToDelete) return;

    setIsDeleting(true);

    try {
      await TransactionService.deleteTransaction(transactionToDelete);
      toast.success('Transação excluída com sucesso!');
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
      loadTransactions();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir transação');
    } finally {
      setIsDeleting(false);
    }
  };

  // Após salvar no modal
  const handleSave = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    loadTransactions();
  };
console.log('transactions', transactions  )
  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h1>Transações</h1>
        <button className="btn-primary" onClick={handleCreate}>
          + Nova Transação
        </button>
      </div>

      <TransactionFilter 
        filters={filters} 
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
          setPage(1); // Reset para primeira página
        }} 
      />

      <TransactionsList
        transactions={transactions.data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Paginação */}
      {transactions.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </button>
          
          <span className="pagination-info">
            Página {page} de {transactions.totalPages}
          </span>
          
          <button
            className="pagination-btn"
            onClick={() => setPage(page + 1)}
            disabled={page === transactions.totalPages}
          >
            Próxima
          </button>
        </div>
      )}

      {/* Modal para criar/editar */}
      {isModalOpen && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTransactionToDelete(null);
        }}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Excluir transação?"
        message="Esta ação não pode ser desfeita. A transação será permanentemente removida do sistema."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}

