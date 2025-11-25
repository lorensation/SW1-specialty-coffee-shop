import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Account(){
  const { user, login, register, logout } = useAuth();
  const [dark, setDark] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Modo oscuro (si ya tenías este bloque, déjalo igual)
  useEffect(()=>{
    document.body.classList.toggle("theme-dark", dark);
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

  const reservas = ["19/07/2025 – 2 pax", "20/08/2025 – 3 pax", "24/08/2025 – 2 pax"];
  const opiniones = [
    { sitio:"StarBucks", rating:4 },
    { sitio:"Cafe rojo", rating:2 },
    { sitio:"Mocalia",   rating:5 },
  ];
  const Stars = ({n}) => <span className="stars">{"★".repeat(n)}{"☆".repeat(5-n)}</span>;

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
        <div className="account-avatar" aria-hidden="true" />
        <div className="account-info">
          {user ? (
            <>
              <div><strong>Nombre de usuario</strong>: {user.name}</div>
              <div><strong>Correo electrónico</strong>: {user.email}</div>
            </>
          ) : (
            <div style={{color:"var(--muted)"}}>¿Aún no tienes cuenta?</div>
          )}
        </div>
        <div className="account-ctas">
          {!user ? (
            <>
              <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Iniciar sesión</button>
              <button className="btn btn-outline" onClick={() => setShowRegister(true)}>Registrarse</button>
            </>
          ) : (
            <button className="btn btn-outline" onClick={logout}>Cerrar sesión</button>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="account-grid">
        <article className="account-card">
          <h3>Mis reservas</h3>
          <ul className="account-list">
            {reservas.map((r,i)=>(<li key={i}>{r}</li>))}
          </ul>
          <div style={{marginTop:".75rem"}}>
            <a className="btn btn-primary" href="/menu">Realizar nuevo pedido</a>
          </div>
        </article>

        <article className="account-card">
          <h3>Mis opiniones</h3>
          <ul className="account-list" style={{listStyle:"none", paddingLeft:0}}>
            {opiniones.map((o,i)=>(
              <li key={i} style={{display:"flex", justifyContent:"space-between", margin:".35rem 0"}}>
                <span>{o.sitio}</span><Stars n={o.rating} />
              </li>
            ))}
          </ul>
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
              onClick={()=>setDark(v=>!v)}
              onKeyDown={(e)=>{ if(e.key==="Enter"||e.key===" ") setDark(v=>!v); }}
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
      {showLogin && (
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
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
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
      )}

      <style>{`
        .success-notification {
          position: fixed;
          top: 2rem;
          right: 2rem;
          background: #4caf50;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 4px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 2000;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: var(--background, white);
          padding: 2rem;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
          position: relative;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: var(--text, #333);
          line-height: 1;
        }

        .modal-content h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--border, #ddd);
          border-radius: 4px;
          font-size: 1rem;
        }

        .form-group small {
          display: block;
          margin-top: 0.25rem;
          color: var(--muted, #666);
          font-size: 0.85rem;
        }

        .error-message {
          color: #d32f2f;
          background: #ffebee;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .modal-content .btn {
          width: 100%;
          margin-top: 0.5rem;
        }
      `}</style>
    </main>
  );
}
