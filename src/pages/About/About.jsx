import { useRef, useState } from "react";

/* Importa las dos imágenes de contenido */
import about2 from "../../assets/about_2.jpg";
import about3 from "../../assets/about_3.jpg";

export default function About(){
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const el = trackRef.current;
    if(!el) return;
    const step = 220;
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
  };

  const [drag, setDrag] = useState({active:false, startX:0, scrollLeft:0});
  const onDown = (e) => {
    const el = trackRef.current;
    if(!el) return;
    const x = e.pageX ?? e.touches?.[0]?.pageX ?? 0;
    setDrag({active:true, startX:x, scrollLeft:el.scrollLeft});
  };
  const onMove = (e) => {
    if(!drag.active) return;
    const el = trackRef.current;
    const x = e.pageX ?? e.touches?.[0]?.pageX ?? 0;
    el.scrollLeft = drag.scrollLeft - (x - drag.startX);
  };
  const onUp = () => setDrag(d => ({...d, active:false}));

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
          <button className="prev" onClick={()=>scroll("prev")} aria-label="anterior">‹</button>

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
            <div className="card">Barista Jefe</div>
            <div className="card">Tostador</div>
            <div className="card">Gerente</div>
            <div className="card">Barista</div>
            <div className="card">Invitado</div>
          </div>

          <button className="next" onClick={()=>scroll("next")} aria-label="siguiente">›</button>
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
