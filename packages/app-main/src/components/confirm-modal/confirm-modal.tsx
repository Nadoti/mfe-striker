'use client';

import './confirm-modal.css';

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
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 22h20L12 2z"
              stroke="#ef4444"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M12 9v4M12 17h.01"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2" />
            <path
              d="M12 7V13M12 17H12.01"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      default:
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2" />
            <path
              d="M12 7V13M12 17H12.01"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
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

