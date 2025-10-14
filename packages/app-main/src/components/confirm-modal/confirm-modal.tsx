'use client';

import './confirm-modal.css';
import { BsExclamationCircle, BsExclamationTriangle, BsInfoCircle } from "react-icons/bs";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = 'Confirmar ação',
  message = 'Tem certeza que deseja continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
}: Props) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
         
          <BsExclamationTriangle color="#ef4444" size={64} />
        );
      case 'warning':
        return (
          <BsExclamationCircle color="#f59e0b" size={64} />
        );
      default:
        return (
          <BsInfoCircle color="#3b82f6" size={64} />
        );
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-icon">{getIcon()}</div>

        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>

        <div className="confirm-modal-actions">
          <button
            className="confirm-modal-btn confirm-modal-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className={`confirm-modal-btn confirm-modal-btn-confirm confirm-modal-btn-${type}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

