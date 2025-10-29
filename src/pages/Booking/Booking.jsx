import { useState } from "react";

export default function Booking(){
  const [form, setForm] = useState({
    name: "", email: "", people: "2", date: "", time: "", message: ""
  });
  const [ok, setOk] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Validación mínima
    if(!form.name || !form.email || !form.date || !form.time){
      alert("Completa nombre, email, fecha y hora.");
      return;
    }
    setOk(true);
  };

  return (
    <main className="booking-page">
      <h1 className="booking-title">Reserva tu mesa</h1>
      <p className="booking-sub">Disfruta del mejor café de especialidad con nosotros</p>

      <div className="booking-grid">
        {/* Izquierda: Formulario */}
        <section className="booking-card">
          <form onSubmit={onSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="name">Nombre completo</label>
              <input id="name" name="name" className="input"
                     value={form.name} onChange={onChange} placeholder="Tu nombre" />
            </div>

            <div className="form-row">
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" name="email" type="email" className="input"
                     value={form.email} onChange={onChange} placeholder="tucorreo@ejemplo.com" />
            </div>

            <div className="form-row">
              <label htmlFor="people">Número de personas</label>
              <select id="people" name="people" className="select" value={form.people} onChange={onChange}>
                {Array.from({length:10}, (_,i)=>i+1).map(n=>(
                  <option key={n} value={String(n)}>{n}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="date">Fecha</label>
              <input id="date" name="date" type="date" className="input"
                     value={form.date} onChange={onChange} />
            </div>

            <div className="form-row">
              <label htmlFor="time">Hora</label>
              <input id="time" name="time" type="time" className="input"
                     value={form.time} onChange={onChange} />
            </div>

            <div className="form-row">
              <label htmlFor="message">Mensaje opcional</label>
              <textarea id="message" name="message" className="textarea"
                        value={form.message} onChange={onChange} placeholder="Alguna preferencia o comentario" />
            </div>

            <div className="form-row">
              <button type="submit" className="btn-primary">Confirmar reserva</button>
            </div>
          </form>

          {ok && (
            <div className="confirm" role="status" aria-live="polite">
              <b>¡Reserva recibida!</b>
              <p>
                {form.name} — {form.people} persona(s), el {form.date} a las {form.time}.<br/>
                Te escribiremos a <b>{form.email}</b> con la confirmación.
              </p>
            </div>
          )}
        </section>

        {/* Derecha: Dónde encontrarnos (mapa placeholder) */}
        <aside>
          <div className="booking-card">
            <h3 style={{marginTop:0}}>Dónde encontrarnos</h3>
            <div className="map-box" aria-label="Mapa / localización" />
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
