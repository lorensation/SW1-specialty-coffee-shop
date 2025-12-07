import React from 'react';
import { Trash2, Star, Eye, EyeOff, Megaphone } from 'lucide-react';

export default function CommentCard({ comment, user, onDelete, onToggleStatus }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <article
            className={`comment-card ${comment.type === 'news' ? 'news-card' : ''} ${comment.status === 'hidden' ? 'hidden-card' : ''}`}
        >
            {comment.status === 'hidden' && (
                <div className="hidden-badge">Oculto</div>
            )}

            <div className="comment-header-section">
                <div className="comment-user-info">
                    {comment.users?.avatar_url ? (
                        <img
                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'}${comment.users.avatar_url}`}
                            alt={comment.users.name}
                            className="comment-avatar"
                        />
                    ) : (
                        <div className="comment-avatar-placeholder">
                            {comment.type === 'news' ? <Megaphone size={20} /> : (comment.users?.name?.charAt(0).toUpperCase() || '?')}
                        </div>
                    )}
                    <div className="comment-meta">
                        <span className="comment-author">
                            {comment.type === 'news' ? 'Royal Coffee News' : (comment.users?.name || 'Usuario Anónimo')}
                        </span>
                        {comment.type === 'opinion' && (
                            <div className="comment-rating-stars">
                                {[...Array(comment.rating || 5)].map((_, i) => (
                                    <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                                ))}
                            </div>
                        )}
                        {comment.type === 'news' && (
                            <span className="news-date">{formatDate(comment.created_at)}</span>
                        )}
                    </div>
                </div>

                {(user && user.role === 'admin') && (
                    <div className="admin-actions">
                        <button
                            className="action-btn"
                            onClick={() => onToggleStatus(comment.id, comment.status)}
                            title={comment.status === 'approved' ? 'Ocultar' : 'Mostrar'}
                        >
                            {comment.status === 'approved' ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                            className="action-btn delete-btn"
                            onClick={() => onDelete(comment.id)}
                            title="Eliminar"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
                {/* Allow owner to delete if not admin */}
                {(user && user.role !== 'admin' && user.id === comment.user_id) && (
                    <button
                        className="delete-btn-icon"
                        onClick={() => onDelete(comment.id)}
                        title="Eliminar"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <div className="comment-body">
                <p className="comment-text">"{comment.content}"</p>
            </div>
        </article>
    );
}
