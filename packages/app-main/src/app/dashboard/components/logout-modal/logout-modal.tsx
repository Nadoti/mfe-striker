'use client';

import './logout-modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function LogoutModal({ isOpen, onClose, onConfirm, loading = false }: Props) {
  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay" onClick={onClose}>
      <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="logout-modal-icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
            <path
              d="M12 7V13M12 17H12.01"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2 className="logout-modal-title">Sair da conta?</h2>
        <p className="logout-modal-message">
          Você será desconectado e precisará fazer login novamente para acessar o sistema.
        </p>

        <div className="logout-modal-actions">
          <button
            className="logout-modal-btn logout-modal-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="logout-modal-btn logout-modal-btn-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      </div>
    </div>
  );
}

