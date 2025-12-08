import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function CommentForm({ user, onSubmit, onCancel, submitting }) {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [isNews, setIsNews] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ content, rating, type: isNews ? 'news' : 'opinion' });
        // Reset form is handled by parent or we can do it here if we want to be self-contained, 
        // but parent controls visibility so it might unmount.
        // Let's reset local state just in case.
        setContent('');
        setRating(5);
        setIsNews(false);
    };

    if (!user) {
        return (
            <div className="login-prompt">
                <p>Para participar, necesitas <Link to="/account" className="login-link">iniciar sesión</Link>.</p>
            </div>
        );
    }

    return (
        <div className="comment-form-container">
            <h3>{user.role === 'admin' && isNews ? 'Publicar Novedad' : 'Comparte tu experiencia'}</h3>

            <form onSubmit={handleSubmit} className="comment-form">
                {user.role === 'admin' && (
                    <div className="form-type-toggle">
                        <label>
                            <input
                                type="checkbox"
                                checked={isNews}
                                onChange={(e) => setIsNews(e.target.checked)}
                            />
                            Publicar como Novedad Oficial
                        </label>
                    </div>
                )}

                {!isNews && (
                    <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`star-btn ${star <= rating ? 'active' : ''}`}
                                onClick={() => setRating(star)}
                            >
                                <Star fill={star <= rating ? "currentColor" : "none"} size={24} />
                            </button>
                        ))}
                    </div>
                )}

                <textarea
                    className="comment-textarea"
                    placeholder={isNews ? "Escribe la novedad aquí..." : "Escribe tu opinión aquí..."}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={onCancel}>Cancelar</button>
                    <button type="submit" className="submit-btn" disabled={submitting}>
                        {submitting ? 'Publicando...' : 'Publicar'}
                    </button>
                </div>
            </form>
        </div>
    );
}
