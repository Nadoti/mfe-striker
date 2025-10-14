'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { TransactionService } from '@/services/transactionService';
import { StorageService } from '@/services/storageService';
import type { Transaction, CreateTransactionDTO, TransactionAttachment } from '@/types/transaction';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types/transaction';
import { useCategorySuggestions, useAmountValidation, useDateValidation } from '@/hooks/useCategorySuggestions';
import './transaction-modal.css';

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: () => void;
}

export function TransactionModal({ transaction, onClose, onSave }: Props) {
  const isEditing = !!transaction;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<CreateTransactionDTO>({
    type: 'expense',
    category: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    attachments: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categorySuggestions = useCategorySuggestions(formData.description || '', formData.type);
  const amountWarning = useAmountValidation(formData.amount, formData.type);
  const dateWarning = useDateValidation(formData.date);

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        category: transaction.category,
        amount: Number(transaction.amount),
        description: transaction.description || '',
        date: transaction.date,
        attachments: transaction.attachments || [],
      });
    }
  }, [transaction]);

  useEffect(() => {
    setShowSuggestions(categorySuggestions.length > 0 && !formData.category);
  }, [categorySuggestions, formData.category]);

  const handleChange = (field: keyof CreateTransactionDTO, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applySuggestion = (category: string) => {
    handleChange('category', category);
    setShowSuggestions(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentAttachments = formData.attachments || [];
    if (currentAttachments.length + files.length > 3) {
      toast.error('Máximo de 3 anexos por transação');
      return;
    }

    setUploadingFiles(true);

    try {
      const filesArray = Array.from(files);
      const uploadedAttachments = await StorageService.uploadMultipleFiles(filesArray);
      
      handleChange('attachments', [...currentAttachments, ...uploadedAttachments]);
      toast.success(`${uploadedAttachments.length} arquivo(s) enviado(s) com sucesso!`);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer upload dos arquivos');
    } finally {
      setUploadingFiles(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = async (index: number) => {
    const attachments = formData.attachments || [];
    const attachmentToRemove = attachments[index];

    if (isEditing) {
      try {
        await StorageService.deleteFile(attachmentToRemove.url);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    const newAttachments = attachments.filter((_, i) => i !== index);
    handleChange('attachments', newAttachments);
    toast.success('Anexo removido');
  };

  const validateForm = (): boolean => {
    if (!formData.category) {
      toast.error('Selecione uma categoria!');
      return false;
    }

    if (formData.amount <= 0) {
      toast.error('O valor deve ser maior que zero!');
      return false;
    }

    if (!formData.date) {
      toast.error('Selecione uma data!');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        await TransactionService.updateTransaction({
          id: transaction.id,
          ...formData,
        });
        toast.success('Transação atualizada com sucesso!');
      } else {
        await TransactionService.createTransaction(formData);
        toast.success('Transação criada com sucesso!');
      }

      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar transação');
    } finally {
      setLoading(false);
    }
  };

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Transação' : 'Nova Transação'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label>Tipo *</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-btn ${formData.type === 'income' ? 'active' : ''}`}
                onClick={() => {
                  handleChange('type', 'income');
                  handleChange('category', '');
                }}
              >
                Receita
              </button>
              <button
                type="button"
                className={`type-btn ${formData.type === 'expense' ? 'active' : ''}`}
                onClick={() => {
                  handleChange('type', 'expense');
                  handleChange('category', '');
                }}
              >
                Despesa
              </button>
            </div>
          </div>

           <div className="form-group">
            <label>Categoria *</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            
            {showSuggestions && categorySuggestions.length > 0 && (
              <div className="category-suggestions">
                <p className="suggestions-label">💡 Sugestões baseadas na descrição:</p>
                <div className="suggestions-buttons">
                  {categorySuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="suggestion-btn"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Valor *</label>
            <input
              type="number"
              placeholder="R$ 0,00"
              value={formData.amount || ''}
              onChange={(e) => handleChange('amount', Number(e.target.value))}
              min="0"
              step="0.01"
              required
            />
            {amountWarning && (
              <p className="field-warning">{amountWarning}</p>
            )}
          </div>

          <div className="form-group">
            <label>Data *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
            {dateWarning && (
              <p className="field-warning">{dateWarning}</p>
            )}
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              placeholder="Ex: Almoço no restaurante, Compra de material..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
            <p className="field-hint">
              💡 Dica: Descreva a transação para receber sugestões automáticas de categoria
            </p>
          </div>

          <div className="form-group">
            <label>Anexos (Recibos, Notas Fiscais)</label>
            <div className="attachments-section">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={uploadingFiles || (formData.attachments?.length || 0) >= 3}
              />
              
              <button
                type="button"
                className="btn-upload"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFiles || (formData.attachments?.length || 0) >= 3}
              >
                {uploadingFiles ? '📤 Enviando...' : '📎 Adicionar Anexo'}
              </button>

              <p className="field-hint">
                Máximo 3 arquivos • JPG, PNG, WEBP ou PDF • Até 5MB cada
              </p>

              {formData.attachments && formData.attachments.length > 0 && (
                <div className="attachments-list">
                  {formData.attachments.map((attachment, index) => (
                    <div key={index} className="attachment-item">
                      <div className="attachment-info">
                        <span className="attachment-icon">
                          {StorageService.getFileIcon(attachment.type)}
                        </span>
                        <div className="attachment-details">
                          <p className="attachment-name">{attachment.name}</p>
                          <p className="attachment-size">
                            {StorageService.formatFileSize(attachment.size)}
                          </p>
                        </div>
                      </div>
                      <div className="attachment-actions">
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="attachment-view"
                          title="Visualizar"
                        >
                          👁️
                        </a>
                        <button
                          type="button"
                          className="attachment-remove"
                          onClick={() => removeAttachment(index)}
                          title="Remover"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

