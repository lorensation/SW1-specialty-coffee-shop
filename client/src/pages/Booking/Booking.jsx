import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", people: "2", date: "", time: "", message: ""
  });
  const [ok, setOk] = useState(false);
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validación mínima
    const newErrors = {};
    if (!form.name || form.name.trim() === "") newErrors.name = "El nombre es obligatorio";
    if (!form.email || form.email.trim() === "") newErrors.email = "El email es obligatorio";
    if (!form.date) newErrors.date = "La fecha es obligatoria";
    if (!form.time) newErrors.time = "La hora es obligatoria";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    setErrors({});
    setShowError(false);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/reservations`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          num_people: parseInt(form.people),
          reservation_date: form.date,
          reservation_time: form.time,
          message: form.message
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOk(true);
        setErrors({});
        setForm(prev => ({ ...prev, date: "", time: "", message: "" }));
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          const serverErrors = {};
          data.errors.forEach(err => {
            serverErrors[err.field] = err.message;
          });
          setErrors(serverErrors);
        } else {
          setErrors({ general: data.message || 'Error al realizar la reserva' });
        }
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setErrors({ general: 'Error de conexión al realizar la reserva' });
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (ok) {
    return (
      <main className="booking-page">
        <h1 className="booking-title">Reserva tu mesa</h1>
        <div className="booking-grid" style={{ display: 'flex', justifyContent: 'center' }}>
          <section className="booking-card" style={{ textAlign: 'center', padding: '40px' }}>
            <div className="confirm" role="status" aria-live="polite" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '20px', borderRadius: '8px' }}>
              <h2 style={{ marginTop: 0 }}>¡Reserva confirmada!</h2>
              <p style={{ fontSize: '1.1rem' }}>
                Hemos enviado un correo a <b>{form.email}</b> con los detalles de tu reserva.
              </p>
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {user && (
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/account')}
                  >
                    Ver mis reservas
                  </button>
                )}
                <button
                  className="btn-secondary"
                  onClick={() => navigate('/')}
                  style={{ padding: '10px 20px', cursor: 'pointer' }}
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <h1 className="booking-title">Reserva tu mesa</h1>
      <p className="booking-sub">Disfruta del mejor café de especialidad con nosotros</p>

      <div className="booking-grid">
        {/* Izquierda: Formulario */}
        <section className="booking-card">
          {showError && Object.keys(errors).length > 0 && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #ef9a9a',
              animation: 'slideDown 0.3s ease-out'
            }}>
              <strong>Por favor, corrige los siguientes errores:</strong>
              <ul style={{ margin: '10px 0 0 20px', padding: 0 }}>
                {errors.general && <li>{errors.general}</li>}
                {errors.name && <li>{errors.name}</li>}
                {errors.email && <li>{errors.email}</li>}
                {errors.date && <li>{errors.date}</li>}
                {errors.time && <li>{errors.time}</li>}
              </ul>
            </div>
          )}
          <form onSubmit={onSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="name">
                Nombre completo
                {errors.name && <span style={{ color: '#c62828', marginLeft: '5px' }}>*</span>}
              </label>
              <input
                id="name"
                name="name"
                className="input"
                value={form.name}
                onChange={onChange}
                placeholder="Tu nombre"
                disabled={!!user || loading}
                style={{
                  ...(user ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}),
                  ...(errors.name ? { borderColor: '#c62828', borderWidth: '2px' } : {})
                }}
              />
            </div>

            <div className="form-row">
              <label htmlFor="email">
                Correo electrónico
                {errors.email && <span style={{ color: '#c62828', marginLeft: '5px' }}>*</span>}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                value={form.email}
                onChange={onChange}
                placeholder="tucorreo@ejemplo.com"
                disabled={!!user || loading}
                style={{
                  ...(user ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}),
                  ...(errors.email ? { borderColor: '#c62828', borderWidth: '2px' } : {})
                }}
              />
            </div>

            <div className="form-row">
              <label htmlFor="people">Número de personas</label>
              <select id="people" name="people" className="select" value={form.people} onChange={onChange} disabled={loading}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={String(n)}>{n}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="date">
                Fecha
                {errors.date && <span style={{ color: '#c62828', marginLeft: '5px' }}>*</span>}
              </label>
              <input 
                id="date" 
                name="date" 
                type="date" 
                className="input"
                value={form.date} 
                onChange={onChange} 
                disabled={loading}
                style={errors.date ? { borderColor: '#c62828', borderWidth: '2px' } : {}}
              />
            </div>

            <div className="form-row">
              <label htmlFor="time">
                Hora
                {errors.time && <span style={{ color: '#c62828', marginLeft: '5px' }}>*</span>}
              </label>
              <select
                id="time"
                name="time"
                className="select"
                value={form.time}
                onChange={onChange}
                disabled={loading}
                style={errors.time ? { borderColor: '#c62828', borderWidth: '2px' } : {}}
              >
                <option value="">Selecciona una hora</option>
                {(() => {
                  const slots = [];
                  let start = 9 * 60; // 9:00
                  const end = 22 * 60; // 22:00
                  while (start <= end) {
                    const h = Math.floor(start / 60).toString().padStart(2, '0');
                    const m = (start % 60).toString().padStart(2, '0');
                    slots.push(`${h}:${m}`);
                    start += 30;
                  }
                  return slots.map(t => <option key={t} value={t}>{t}</option>);
                })()}
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="message">Mensaje opcional</label>
              <textarea id="message" name="message" className="textarea"
                value={form.message} onChange={onChange} placeholder="Alguna preferencia o comentario" disabled={loading} />
            </div>

            <div className="form-row">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Enviando..." : "Confirmar reserva"}
              </button>
            </div>
          </form>
        </section>

        {/* Derecha: Dónde encontrarnos (mapa placeholder) */}
        <aside>
          <div className="booking-card">
            <h3 style={{ marginTop: 0 }}>Dónde encontrarnos</h3>
            <div className="map-box" style={{ overflow: "hidden", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <iframe
                src="https://maps.google.com/maps?q=Calle+de+la+Princesa,+10,+Madrid&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "340px", display: "block" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer enlaces (como en wireframe) */}
      <div className="booking-footer">
        <a href="/booking">Contacto</a>
        <a href="/booking">Dónde encontrarnos</a>
        <a href="/feed">Opiniones</a>
        <a href="/about">Equipo</a>
      </div>
    </main>
  );
}
