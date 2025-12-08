import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Account.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
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
