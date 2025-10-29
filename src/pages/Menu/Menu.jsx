import { useRef } from "react";
import { useCart } from "../../context/CartContext.jsx";

const DATA = {
  origen: [
    { id:"o1", name:"Etiopía Yirgacheffe (250g)", price:8.50, desc:"Floral, cítrico" },
    { id:"o2", name:"Colombia Huila (250g)",      price:7.90, desc:"Caramelo, cacao" },
    { id:"o3", name:"Kenya AA (250g)",            price:9.90, desc:"Frutos rojos" },
  ],
  bebida: [
    { id:"b1", name:"Cold Brew", price:4.00, desc:"12h extracción en frío" },
    { id:"b2", name:"Latte",     price:3.20, desc:"Doble espresso + leche" },
    { id:"b3", name:"Americano", price:2.50, desc:"Espresso alargado" },
  ],
  postres: [
    { id:"p1", name:"Cheesecake",         price:5.00, desc:"Casero" },
    { id:"p2", name:"Brownie con nueces", price:4.50, desc:"" },
    { id:"p3", name:"Galletas de avena",  price:3.00, desc:"" },
  ],
  ediciones: [
    { id:"e1", name:"Pacamara (micro-lote)",   price:12.00, desc:"" },
    { id:"e2", name:"Geisha (limitada)",       price:18.00, desc:"" },
    { id:"e3", name:"Anaeróbico experimental", price:14.00, desc:"" },
  ],
};

function Row({title, items}){
  const { addItem } = useCart();
  const trackRef = useRef(null);
  const scroll = d => trackRef.current?.scrollBy({ left: d==="next" ? 340 : -340, behavior:"smooth" });

  return (
    <section className="menu-section">
      <h2 className="menu-title">{title}</h2>
      <div className="menu-carousel">
        <button className="menu-arrow prev" onClick={()=>scroll("prev")} aria-label="anterior">‹</button>
        <div className="menu-track" ref={trackRef}>
          {items.map(it=>(
            <article key={it.id} className="menu-card">
              <div className="menu-media" aria-hidden="true" />
              <div className="menu-body">
                <p className="menu-desc">{it.name}{it.desc?` — ${it.desc}`:""}</p>
                <div className="menu-meta">
                  <div className="menu-price"><b>Precio total {it.price.toFixed(2)}€</b></div>
                  <button className="menu-add" onClick={()=>addItem(it)}>Añadir</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <button className="menu-arrow next" onClick={()=>scroll("next")} aria-label="siguiente">›</button>
      </div>
    </section>
  );
}

export default function Menu(){
  return (
    <main className="menu-page">
      <Row title="Café de origen"       items={DATA.origen} />
      <Row title="Bebida"               items={DATA.bebida} />
      <Row title="Postres"              items={DATA.postres} />
      <Row title="Ediciones especiales" items={DATA.ediciones} />

      <div className="menu-footer">
        <a href="/booking">Contacto</a>
        <a href="/booking">Dónde encontrarnos</a>
        <a href="/feed">Opiniones</a>
        <a href="/about">Equipo</a>
      </div>
    </main>
  );
}
