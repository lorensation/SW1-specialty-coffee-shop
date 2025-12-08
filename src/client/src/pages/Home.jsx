import { Link } from "react-router-dom";
import heroImg from "../assets/home-hero.png";
import originImg from "../assets/home-origin.png";
import roastImg from "../assets/home-roast.png";
import baristaImg from "../assets/home-barista.png";

export default function Home() {
  return (
    <main className="home-page">
      {/* Hero con CTA */}
      <section
        className="home-hero"
        aria-label="Destacado"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="cta">
          <Link className="btn-primary" to="/menu">Menú</Link>
        </div>
      </section>

      {/* Tres bloques inferiores */}
      <section className="home-features">
        <article className="feature-card">
          <img
            src={originImg}
            alt="Café de origen"
            className="feature-media"
            style={{ width: '100%', objectFit: 'cover' }}
          />
          <h3>Café de origen</h3>
          <p className="feature-text" style={{ margin: 0 }}>
            Seleccionamos micro-lotes con trazabilidad completa para realzar
            los perfiles de cada finca. Descubre notas florales, frutales y cacao.
          </p>
          <div style={{ textAlign: "center", marginTop: ".6rem" }}>
            <Link to="/menu" className="btn-primary">Ver cafés</Link>
          </div>
        </article>

        <article className="feature-card">
          <img
            src={roastImg}
            alt="Tostamos cada semana"
            className="feature-media"
            style={{ width: '100%', objectFit: 'cover' }}
          />
          <h3>Tostamos cada semana</h3>
          <p className="feature-text" style={{ margin: 0 }}>
            Tostado fresco en pequeños lotes para asegurar aroma y dulzor.
            Indicamos fecha de tueste y recomendación de consumo.
          </p>
          <div style={{ textAlign: "center", marginTop: ".6rem" }}>
            <Link to="/feed" className="btn-primary">Novedades</Link>
          </div>
        </article>

        <article className="feature-card">
          <img
            src={baristaImg}
            alt="Experiencia en barra"
            className="feature-media"
            style={{ width: '100%', objectFit: 'cover' }}
          />
          <h3>Experiencia en barra</h3>
          <p className="feature-text" style={{ margin: 0 }}>
            Baristas certificados, recetas calibradas y equipos de precisión.
            Reserva tu mesa y vive la experiencia specialty.
          </p>
          <div style={{ textAlign: "center", marginTop: ".6rem" }}>
            <Link to="/booking" className="btn-primary">Reservar</Link>
          </div>
        </article>
      </section>

      {/* Footer enlaces */}
      <div className="home-footer">
        <a href="/booking">Contacto</a>
        <a href="/booking">Dónde encontrarnos</a>
        <a href="/feed">Opiniones</a>
        <a href="/about">Equipo</a>
      </div>
    </main>
  );
}
