export default function Feed(){
  return (
    <main className="feed-page">
      <h1 className="feed-title">Novedades</h1>

      {/* Destacado superior: texto + botón / media a la derecha */}
      <section className="feed-hero">
        <article className="feed-card">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            id augue ut nunc pulvinar pretium. Breve texto introductorio de la
            novedad principal.
          </p>
          <div className="feed-actions">
            <button className="btn-primary">Leer más</button>
          </div>
        </article>

        <div className="feed-media" aria-label="Imagen o vídeo de la novedad" />
      </section>

      {/* Opiniones (3 tarjetas) */}
      <section className="feed-cards">
        <article className="feed-quote">
          <p>
            “Lorem ipsum dolor sit amet et delectus accommodare his consul copiosae.”
          </p>
          <div className="feed-author">
            <div className="feed-avatar" aria-hidden="true" />
            <div>
              <strong>Name Lastname</strong><br/>
              <small>Company name</small>
            </div>
          </div>
        </article>

        <article className="feed-quote">
          <p>
            “Vidit dissentiet eos cu eum an brute copiosae hendrerit. Muy recomendable.”
          </p>
          <div className="feed-author">
            <div className="feed-avatar" aria-hidden="true" />
            <div>
              <strong>Name Lastname</strong><br/>
              <small>Company name</small>
            </div>
          </div>
        </article>

        <article className="feed-quote">
          <p>
            “Excelente experiencia: servicio, ambiente y café de primera.”
          </p>
          <div className="feed-author">
            <div className="feed-avatar" aria-hidden="true" />
            <div>
              <strong>Name Lastname</strong><br/>
              <small>Company name</small>
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
