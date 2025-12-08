import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Account.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { resetPassword } = useAuth();

    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: 'Las contraseñas no coinciden' });
            return;
        }

        if (password.length < 8) {
            setStatus({ type: 'error', message: 'La contraseña debe tener al menos 8 caracteres' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        const result = await resetPassword(token, password);

        if (result.success) {
            setStatus({
                type: 'success',
                message: 'Contraseña restablecida correctamente. Redirigiendo...'
            });
            setTimeout(() => {
                navigate('/account');
            }, 3000);
        } else {
            setStatus({
                type: 'error',
                message: result.error
            });
        }
        setLoading(false);
    };

    if (!token) {
        return (
            <div className="account-page">
                <div className="account-container">
                    <div className="auth-forms">
                        <div className="auth-form-container">
                            <div className="status-message error">
                                Token inválido o faltante. Por favor solicita un nuevo enlace.
                            </div>
                            <div className="auth-footer">
                                <a href="/forgot-password">Solicitar nuevo enlace</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="account-page">
            <div className="account-container">
                <div className="auth-forms">
                    <div className="auth-form-container">
                        <h2>Restablecer Contraseña</h2>
                        <p className="auth-description">
                            Ingresa tu nueva contraseña a continuación.
                        </p>

                        {status.message && (
                            <div className={`status-message ${status.type}`}>
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="password">Nueva Contraseña</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? (
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showConfirmPassword ? (
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Restableciendo...' : 'Cambiar Contraseña'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
