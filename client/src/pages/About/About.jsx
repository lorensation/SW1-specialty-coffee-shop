import { useRef, useState } from "react";

/* Importa las imágenes de contenido */
import about2 from "../../assets/about_2.jpg";
import about3 from "../../assets/about_3.jpg";
import teamBarista from "../../assets/team-barista.png";
import teamRoaster from "../../assets/team-roaster.png";
import teamBarista2 from "../../assets/team-barista-2.png";
import teamManager from "../../assets/team-manager.png";

export default function About() {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    // Ancho tarjeta (280) + gap (16) approx = 300-320
    const step = 320;
    const current = el.scrollLeft;
    const target = dir === "next" ? current + step : current - step;

    el.scrollTo({ left: target, behavior: "smooth" });
  };

  const [drag, setDrag] = useState({ active: false, startX: 0, scrollLeft: 0 });

  const onDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    // Solo prevenir default si no es un botón
    if (e.target.tagName !== 'BUTTON') {
      // e.preventDefault(); // A veces bloquea el click, mejor no ponerlo aquí si no es necesario
    }
    const x = e.pageX ?? e.touches?.[0]?.pageX ?? 0;
    setDrag({ active: true, startX: x, scrollLeft: el.scrollLeft });
  };

  const onMove = (e) => {
    if (!drag.active) return;
    e.preventDefault(); // Importante para evitar selección de texto o arrastre de imagen nativo
    const el = trackRef.current;
    const x = e.pageX ?? e.touches?.[0]?.pageX ?? 0;
    const walk = (x - drag.startX) * 1.5; // Multiplicador para más velocidad
    el.scrollLeft = drag.scrollLeft - walk;
  };

  const onUp = () => setDrag(d => ({ ...d, active: false }));

  return (
    <section>
      {/* Hero: usa about_1.jpg desde CSS */}
      <div className="hero">
        <h1>Sobre Nosotros</h1>
      </div>

      {/* Bloque 1: imagen izda + historia dcha (about_2.jpg) */}
      <div className="about-grid">
        <img className="media" src={about2} alt="Nuestra historia" />
        <div className="section">
          <h2>Nuestra historia</h2>
          <p>Breve descripción de cómo nace el proyecto y sus hitos principales.</p>
          <ul>
            <li>2019: Nace RoyalCoffee</li>
            <li>2021: Primer micro-lote propio</li>
            <li>2024: Nueva tostadora</li>
          </ul>
        </div>
      </div>

      {/* Bloque 2: filosofía izda + imagen dcha (about_3.jpg) */}
      <div className="about-grid reverse">
        <div className="section">
          <h2>Filosofía del café</h2>
          <p>
            Café de especialidad con trazabilidad, tueste cuidadoso y enfoque en la experiencia
            del cliente en barra.
          </p>
          <ul>
            <li>Orígenes seleccionados</li>
            <li>Tueste responsable</li>
            <li>Experiencia en barra</li>
          </ul>
        </div>
        <img className="media" src={about3} alt="Filosofía del café" />
      </div>

      {/* Equipo (carrusel) */}
      <div className="team">
        <h2>Equipo</h2>
        <div className="carousel">
          <button
            className="prev"
            onClick={(e) => { e.stopPropagation(); scroll("prev"); }}
            aria-label="anterior"
          >
            ‹
          </button>

          <div
            className="carousel-track"
            ref={trackRef}
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseLeave={onUp}
            onMouseUp={onUp}
            onTouchStart={onDown}
            onTouchMove={onMove}
            onTouchEnd={onUp}
          >
            {/* Tarjetas con imagen */}
            <div className="card">
              <img src={teamBarista} alt="Barista Jefe" draggable="false" />
              <div className="card-info">
                <strong>Barista Jefe</strong>
                <small>Especialista en Latte Art</small>
              </div>
            </div>

            <div className="card">
              <img src={teamRoaster} alt="Tostador" draggable="false" />
              <div className="card-info">
                <strong>Tostador</strong>
                <small>Control de calidad</small>
              </div>
            </div>

            <div className="card">
              <img src={teamManager} alt="Gerente" style={{ objectPosition: 'top' }} draggable="false" />
              <div className="card-info">
                <strong>Gerente</strong>
                <small>Gestión</small>
              </div>
            </div>

            <div className="card">
              <img src={teamBarista2} alt="Barista" style={{ filter: 'sepia(0.2)' }} draggable="false" />
              <div className="card-info">
                <strong>Barista</strong>
                <small>Atención</small>
              </div>
            </div>

          </div>

          <button
            className="next"
            onClick={(e) => { e.stopPropagation(); scroll("next"); }}
            aria-label="siguiente"
          >
            ›
          </button>
        </div>
      </div>

      {/* Pie de enlaces */}
      <div className="about-footer">
        <a href="/booking">Contacto</a>
        <a href="/booking">Dónde encontrarnos</a>
        <a href="/feed">Opiniones</a>
        <a href="/about">Equipo</a>
      </div>
    </section>
  );
}
