'use client';

import './logout-modal.css';
import { FaExclamationCircle } from "react-icons/fa";

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
          <FaExclamationCircle color="#ef4444" size={64} />
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

