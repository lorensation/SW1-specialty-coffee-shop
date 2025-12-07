import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import reservationService from "../../services/reservationService.js";
import "./Account.css";

export default function Account() {
  const { user, login, register, logout } = useAuth();
  // Inicializar estado desde localStorage
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Efecto para aplicar la clase al body y guardar en localStorage
  useEffect(() => {
    document.body.classList.toggle("theme-dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingresa un correo electrónico válido");
      setLoading(false);
      return;
    }

    // Validate password
    if (!formData.password || formData.password.length < 1) {
      setError("Por favor ingresa tu contraseña");
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      setShowLogin(false);
      setFormData({ name: "", email: "", password: "" });
      setSuccess("¡Sesión iniciada correctamente!");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.error || "Error al iniciar sesión");
    }
    setLoading(false);
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe incluir al menos una letra mayúscula";
    }
    if (!/[a-z]/.test(password)) {
      return "La contraseña debe incluir al menos una letra minúscula";
    }
    if (!/[0-9]/.test(password)) {
      return "La contraseña debe incluir al menos un número";
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate name
    if (!formData.name || formData.name.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      setLoading(false);
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingresa un correo electrónico válido");
      setLoading(false);
      return;
    }

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      setShowRegister(false);
      setFormData({ name: "", email: "", password: "" });
      setSuccess("¡Cuenta creada exitosamente! Bienvenido/a.");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.error || "Error al registrarse");
    }
    setLoading(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
    setFormData({ name: "", email: "", password: "" });
    setError("");
    setSuccess("");
  };

  // Estado para favoritos
  const [favoritos, setFavoritos] = useState([]);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem('token'); // Assuming token is stored here
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch Favorites
        const favResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/favorites`, {
          headers,
          credentials: 'include'
        });
        const favData = await favResponse.json();
        if (favData.success) {
          setFavoritos(favData.data);
        }

        // Fetch Reservations
        const resResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/reservations/user/me`, {
          headers,
          credentials: 'include'
        });
        const resData = await resResponse.json();
        if (resData.success) {
          // Filter out cancelled reservations
          setReservas(resData.data.filter(r => r.status !== 'cancelled'));
        }

      } catch (e) {
        console.error("Error loading account data", e);
      }
    };

    fetchData();
  }, [user]);

  const removeFavorite = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/favorites/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      setFavoritos(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error("Error removing favorite", error);
    }
  };


  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/users/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        window.location.reload();
      } else {
        console.error('Upload failed:', data.message);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar tu foto de perfil?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/users/avatar`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        window.location.reload();
      } else {
        console.error('Delete failed:', data.message);
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
    }
  };

  const cancelReservation = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        // Update local state to remove the cancelled reservation
        setReservas(prev => prev.filter(r => r.id !== id));
        setSuccess("Reserva cancelada correctamente");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Error al cancelar la reserva");
      }
    } catch (error) {
      console.error("Error cancelling reservation", error);
      setError("Error de conexión al cancelar la reserva");
    }
  };

  // Edit Reservation Logic
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [editFormData, setEditFormData] = useState({
    reservation_date: '',
    reservation_time: '',
    num_people: 1
  });

  const openEditModal = (reservation) => {
    setEditingReservation(reservation);
    setEditFormData({
      reservation_date: reservation.reservation_date.split('T')[0],
      reservation_time: reservation.reservation_time,
      num_people: reservation.num_people
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await reservationService.updateReservation(editingReservation.id, editFormData);

      if (result.success) {
        // Update local state
        setReservas(prev => prev.map(r => r.id === editingReservation.id ? result.data : r));
        setSuccess("Reserva modificada correctamente");
        setTimeout(() => setSuccess(""), 3000);
        setShowEditModal(false);
      } else {
        setError(result.message || "Error al modificar la reserva");
      }
    } catch (error) {
      console.error("Error updating reservation", error);
      setError("Error al modificar la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="account-page">
      <h1 className="account-title">Mi cuenta</h1>

      {/* Success Message */}
      {success && (
        <div className="success-notification">
          {success}
        </div>
      )}

      {/* Cabecera */}
      <section className="account-header">
        <div className="account-avatar">
          {user && user.avatar_url ? (
            <img
              src={`${(import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '')}${user.avatar_url}`}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )}
          {user && (
            <>
              <div className="avatar-wrapper" onClick={() => setShowAvatarMenu(!showAvatarMenu)}>
                <div className="avatar-edit-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </div>
              </div>

              {showAvatarMenu && (
                <div className="avatar-menu">
                  <label className="avatar-menu-item">
                    Cambiar foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {user.avatar_url && (
                    <button className="avatar-menu-item delete" onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAvatar();
                    }}>
                      Eliminar foto
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <div className="account-info">
          {user ? (
            <>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <button onClick={logout} className="btn btn-outline btn-sm">
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="user-info">
              <div style={{ color: "var(--muted)" }}>¿Aún no tienes cuenta?</div>
              <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Iniciar sesión</button>
              <button className="btn btn-outline" onClick={() => setShowRegister(true)}>Registrarse</button>
            </div>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="account-grid">
        <article className="account-card">
          <h3>Mis reservas</h3>
          <ul className="account-list">
            {reservas.length === 0 ? (
              <li style={{ color: "var(--muted)", fontStyle: "italic" }}>No tienes reservas activas.</li>
            ) : (
              reservas.map((r) => (
                <li key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    {new Date(r.reservation_date).toLocaleDateString()} – {r.reservation_time.slice(0, 5)} – {r.num_people} pax
                    <span style={{
                      marginLeft: '10px',
                      fontSize: '0.8em',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: r.status === 'confirmed' ? '#e8f5e9' : r.status === 'cancelled' ? '#ffebee' : '#fff3e0',
                      color: r.status === 'confirmed' ? '#2e7d32' : r.status === 'cancelled' ? '#c62828' : '#ef6c00'
                    }}>
                      {r.status === 'confirmed' ? 'Confirmada' : r.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                    </span>
                  </div>
                  {r.status !== 'cancelled' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => openEditModal(r)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', borderColor: '#3498db', color: '#3498db' }}
                      >
                        Modificar
                      </button>
                      <button
                        onClick={() => cancelReservation(r.id)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', borderColor: '#e74c3c', color: '#e74c3c' }}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
          <div style={{ marginTop: ".75rem" }}>
            <a className="btn btn-primary" href="/booking">Realizar nuevo pedido</a>
          </div>
        </article>

        <article className="account-card">
          <h3>Mis favoritos</h3>
          {favoritos.length === 0 ? (
            <p style={{ color: "var(--muted)", fontStyle: "italic" }}>No tienes productos favoritos aún.</p>
          ) : (
            <ul className="account-list" style={{ listStyle: "none", paddingLeft: 0 }}>
              {favoritos.map((fav) => (
                <li key={fav.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
                  {fav.image_url ? (
                    <img src={fav.image_url} alt={fav.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", marginRight: "0.75rem" }} />
                  ) : (
                    <div style={{ width: "40px", height: "40px", background: "#eee", borderRadius: "4px", marginRight: "0.75rem" }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "bold" }}>{fav.name}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{fav.price.toFixed(2)}€</div>
                  </div>
                  <button
                    onClick={() => removeFavorite(fav.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#e74c3c", fontSize: "1.2rem" }}
                    aria-label="Quitar de favoritos"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div style={{ marginTop: ".75rem" }}>
            <a className="btn btn-outline" href="/menu">Ver menú completo</a>
          </div>
        </article>

        <article className="account-card">
          <h3>Preferencias</h3>
          <div className="pref-row">
            <div>Modo oscuro</div>
            <div
              className="switch"
              role="switch"
              aria-checked={dark}
              data-on={dark ? "true" : "false"}
              tabIndex={0}
              onClick={() => setDark(v => !v)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setDark(v => !v); }}
            />
          </div>
        </article>
      </section>

      <div className="account-footer">
        <a href="/booking">Contacto</a>
        <a href="/booking">Dónde encontrarnos</a>
        <a href="/feed">Opiniones</a>
        <a href="/about">Equipo</a>
      </div>

      {/* Login Modal */}
      {
        showLogin && (
          <div className="modal-overlay" onClick={closeModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModals}>&times;</button>
              <h2>Iniciar sesión</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="login-email">Correo electrónico</label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="login-password">Contraseña</label>
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
                <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
                  <Link to="/forgot-password" onClick={closeModals} style={{ color: "var(--primary)", textDecoration: "none" }}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* Register Modal */}
      {
        showRegister && (
          <div className="modal-overlay" onClick={closeModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModals}>&times;</button>
              <h2>Registrarse</h2>
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label htmlFor="register-name">Nombre</label>
                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="register-email">Correo electrónico</label>
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="register-password">Contraseña</label>
                  <input
                    id="register-password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                    disabled={loading}
                  />
                  <small>Mínimo 8 caracteres, debe incluir mayúsculas, minúsculas y números</small>
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Registrando..." : "Registrarse"}
                </button>
              </form>
            </div>
          </div>
        )
      }
      {/* Edit Reservation Modal */}
      {
        showEditModal && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>&times;</button>
              <h2>Modificar Reserva</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label htmlFor="edit-date">Fecha</label>
                  <input
                    id="edit-date"
                    type="date"
                    name="reservation_date"
                    value={editFormData.reservation_date}
                    onChange={handleEditInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-time">Hora</label>
                  <select
                    id="edit-time"
                    name="reservation_time"
                    value={editFormData.reservation_time}
                    onChange={handleEditInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Selecciona una hora</option>
                    {['09:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00'].map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-people">Personas</label>
                  <input
                    id="edit-people"
                    type="number"
                    name="num_people"
                    value={editFormData.num_people}
                    onChange={handleEditInputChange}
                    required
                    min="1"
                    max="10"
                    disabled={loading}
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </form>
            </div>
          </div>
        )
      }
    </main >
  );
}
