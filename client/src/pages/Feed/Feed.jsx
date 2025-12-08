import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import commentService from '../../services/commentService';
import heroImage from '../../assets/about_1.jpg';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';
import './Feed.css';

export default function Feed() {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await commentService.getAllComments();
      if (response.success) {
        setComments(response.data);
      } else {
        setError('Error al cargar comentarios');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async (commentData) => {
    setSubmitting(true);
    try {
      const response = await commentService.createComment(commentData);
      if (response.success) {
        setShowForm(false);
        fetchComments(); // Refresh list
      }
    } catch (err) {
      console.error(err);
      alert('Error al publicar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este elemento?')) return;

    try {
      const response = await commentService.deleteComment(id);
      if (response.success) {
        setComments(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'approved' ? 'hidden' : 'approved';
    try {
      const response = await commentService.updateCommentStatus(id, newStatus);
      if (response.success) {
        setComments(prev => prev.map(c =>
          c.id === id ? { ...c, status: newStatus } : c
        ));
      }
    } catch (err) {
      console.error(err);
      alert('Error al cambiar estado');
    }
  };

  const scrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('comment-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <main className="feed-page">
      {/* Hero Section */}
      <section className="feed-hero">
        <div className="feed-hero-content">
          <h1 className="feed-title">Novedades</h1>
          <p className="feed-description">
            Descubre las experiencias de nuestra comunidad. Tu opinión es el ingrediente secreto que nos ayuda a mejorar cada día y a seguir sirviendo el mejor café de especialidad.
          </p>
          <button className="hero-btn" onClick={scrollToForm}>
            {user?.role === 'admin' ? 'Publicar Novedad' : 'Dejar opinión'}
          </button>
        </div>
        <div className="feed-hero-image">
          <img src={heroImage} alt="Coffee Shop Ambience" />
        </div>
      </section>

      {/* Comments Grid */}
      <section className="comments-section">
        {loading ? (
          <div className="loading-state">Cargando...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : comments.length === 0 ? (
          <div className="empty-feed">No hay publicaciones aún.</div>
        ) : (
          <div className="comments-grid">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                user={user}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </section>

      {/* Comment Form Section */}
      <div id="comment-form-section" className={`comment-form-wrapper ${showForm ? 'visible' : ''}`}>
        <CommentForm
          user={user}
          onSubmit={handleCreateComment}
          onCancel={() => setShowForm(false)}
          submitting={submitting}
        />
      </div>
    </main>
  );
}

