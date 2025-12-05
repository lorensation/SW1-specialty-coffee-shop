export default function Feed() {
  return (
    <main className="feed-page">
      <h1 className="feed-title">Novedades</h1>

      {/* Destacado superior: Evento de cata */}
      <section className="feed-hero">
        <article className="feed-card">
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--brand)" }}>Cata de Café: Etiopía Yirgacheffe</h2>
          <p style={{ marginBottom: "1rem" }}>
            Este sábado a las 11:00h te invitamos a descubrir los matices florales y cítricos de nuestro nuevo lote de Etiopía.
            Aprenderás sobre el proceso de lavado y cómo preparar el V60 perfecto. Plazas limitadas.
          </p>
          <div className="feed-actions">
            <a href="/booking" className="btn-primary" style={{ textDecoration: "none" }}>Reservar Mi Plaza</a>
          </div>
        </article>

        <div className="feed-media" style={{ background: "url('/src/assets/home-origin.png') center/cover no-repeat" }} aria-label="Imagen de preparación de café" />
      </section>

      {/* Opiniones (3 tarjetas) */}
      <section className="feed-cards">
        <article className="feed-quote">
          <p>
            “El mejor café de especialidad de la ciudad. El ambiente es súper acogedor y los baristas saben recomendarte según tus gustos. ¡El Flat White es increíble!”
          </p>
          <div className="feed-author">
            <div className="feed-avatar" style={{ background: "#d4c5b5" }} aria-hidden="true" />
            <div>
              <strong>María García</strong><br />
              <small>Cliente frecuente</small>
            </div>
          </div>
        </article>

        <article className="feed-quote">
          <p>
            “Me encanta venir a trabajar aquí. Buena música, wifi rápido y unos postres caseros que son una perdición. Recomendadísimo el bizcocho de zanahoria.”
          </p>
          <div className="feed-author">
            <div className="feed-avatar" style={{ background: "#b5c7d4" }} aria-hidden="true" />
            <div>
              <strong>Carlos Ruiz</strong><br />
              <small>Digital Nomad</small>
            </div>
          </div>
        </article>

        <article className="feed-quote">
          <p>
            “Compramos café en grano para casa todas las semanas. La calidad es constante y siempre nos ayudan a ajustar la molienda para nuestra cafetera.”
          </p>
          <div className="feed-author">
            <div className="feed-avatar" style={{ background: "#b5d4bb" }} aria-hidden="true" />
            <div>
              <strong>Laura y Pedro</strong><br />
              <small>Amantes del café</small>
            </div>
          </div>
        </article>
      </section>

      {/* Footer enlaces */}
      <div className="feed-footer">
        <a href="/booking">Contacto</a>
        <a href="/booking">Dónde encontrarnos</a>
        <a href="/feed">Opiniones</a>
        <a href="/about">Equipo</a>
      </div>
    </main>
  );
}
