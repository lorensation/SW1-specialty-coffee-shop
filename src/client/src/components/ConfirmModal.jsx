import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Shield, Ban } from 'lucide-react';
import './ConfirmModal.css';

/**
 * Modal de confirmación reutilizable
 * @param {boolean} isOpen - Controla si el modal está visible
 * @param {function} onClose - Función para cerrar el modal
 * @param {function} onConfirm - Función ejecutada al confirmar
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje de confirmación
 * @param {string} confirmText - Texto del botón de confirmación (default: "Confirmar")
 * @param {string} cancelText - Texto del botón de cancelación (default: "Cancelar")
 * @param {string} variant - Tipo de acción: 'danger', 'warning', 'success', 'info', 'promote', 'demote' (default: 'info')
 */
export default function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'info'
}) {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const getIcon = () => {
        switch (variant) {
            case 'danger':
                return <XCircle size={48} className="confirm-icon danger" />;
            case 'warning':
                return <AlertCircle size={48} className="confirm-icon warning" />;
            case 'success':
                return <CheckCircle size={48} className="confirm-icon success" />;
            case 'promote':
                return <Shield size={48} className="confirm-icon promote" />;
            case 'demote':
                return <Ban size={48} className="confirm-icon demote" />;
            default:
                return <AlertCircle size={48} className="confirm-icon info" />;
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header-confirm">
                    {getIcon()}
                    <h3>{title || '¿Estás seguro?'}</h3>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button 
                        className="modal-btn modal-btn-cancel" 
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button 
                        className={`modal-btn modal-btn-confirm ${variant}`}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
