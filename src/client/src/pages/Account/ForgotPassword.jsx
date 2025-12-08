import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Account.css'; // Reusing Account styles

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        const result = await forgotPassword(email);

        if (result.success) {
            setStatus({
                type: 'success',
                message: result.message
            });
            setEmail('');
        } else {
            setStatus({
                type: 'error',
                message: result.error
            });
        }
        setLoading(false);
    };

    return (
        <div className="account-page">
            <div className="account-container">
                <div className="auth-forms">
                    <div className="auth-form-container">
                        <h2>Recuperar Contraseña</h2>
                        <p className="auth-description">
                            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                        </p>

                        {status.message && (
                            <div className={`status-message ${status.type}`}>
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Enviando...' : 'Enviar enlace'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                ¿Te acordaste? <Link to="/account">Iniciar Sesión</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
