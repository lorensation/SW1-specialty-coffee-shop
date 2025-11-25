import { useRef, useEffect, useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { getProductsByCategory } from "../../services/productService.js";

function Row({ title, category, loading, error, items }) {
  const { addItem } = useCart();
  const trackRef = useRef(null);
  const scroll = d => trackRef.current?.scrollBy({ left: d === "next" ? 340 : -340, behavior: "smooth" });

  return (
    <section className="menu-section">
      <h2 className="menu-title">{title}</h2>
      <div className="menu-carousel">
        <button className="menu-arrow prev" onClick={() => scroll("prev")} aria-label="anterior">‹</button>
        <div className="menu-track" ref={trackRef}>
          {loading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, i) => (
              <article key={i} className="menu-card loading-skeleton">
                <div className="menu-media skeleton-shimmer" aria-hidden="true" />
                <div className="menu-body">
                  <div className="skeleton-text" style={{ width: '80%', height: '20px', marginBottom: '10px' }}></div>
                  <div className="skeleton-text" style={{ width: '40%', height: '16px' }}></div>
                </div>
              </article>
            ))
          ) : error ? (
            <div className="menu-error">
              <p>Error al cargar productos: {error}</p>
              <button className="btn btn-outline" onClick={() => window.location.reload()}>
                Reintentar
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="menu-empty">
              <p>No hay productos disponibles en esta categoría</p>
            </div>
          ) : (
            items.map(it => (
              <article key={it.id} className="menu-card">
                {it.image_url ? (
                  <img src={it.image_url} alt={it.name} className="menu-media" />
                ) : (
                  <div className="menu-media" aria-hidden="true" />
                )}
                <div className="menu-body">
                  <p className="menu-desc">
                    {it.name}
                    {it.tasting_notes && ` — ${it.tasting_notes}`}
                    {it.description && !it.tasting_notes && ` — ${it.description}`}
                  </p>
                  <div className="menu-meta">
                    <div className="menu-price"><b>Precio total {it.price.toFixed(2)}€</b></div>
                    <button 
                      className="menu-add" 
                      onClick={() => addItem(it)}
                      disabled={it.stock_quantity === 0}
                    >
                      {it.stock_quantity === 0 ? 'Agotado' : 'Añadir'}
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
        <button className="menu-arrow next" onClick={() => scroll("next")} aria-label="siguiente">›</button>
      </div>
    </section>
  );
}

export default function Menu() {
  const [products, setProducts] = useState({
    origen: [],
    bebida: [],
    postres: [],
    ediciones: []
  });
  const [loading, setLoading] = useState({
    origen: true,
    bebida: true,
    postres: true,
    ediciones: true
  });
  const [errors, setErrors] = useState({
    origen: null,
    bebida: null,
    postres: null,
    ediciones: null
  });

  useEffect(() => {
    const categories = ['origen', 'bebida', 'postres', 'ediciones'];
    
    // Fetch products for each category
    categories.forEach(async (category) => {
      try {
        const response = await getProductsByCategory(category);
        
        if (response.success) {
          setProducts(prev => ({ ...prev, [category]: response.data }));
          setErrors(prev => ({ ...prev, [category]: null }));
        } else {
          setErrors(prev => ({ ...prev, [category]: response.message || 'Error al cargar productos' }));
        }
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        setErrors(prev => ({ ...prev, [category]: error.message }));
      } finally {
        setLoading(prev => ({ ...prev, [category]: false }));
      }
    });
  }, []);

  return (
    <main className="menu-page">
      <Row 
        title="Café de origen" 
        category="origen"
        items={products.origen}
        loading={loading.origen}
        error={errors.origen}
      />
      <Row 
        title="Bebida" 
        category="bebida"
        items={products.bebida}
        loading={loading.bebida}
        error={errors.bebida}
      />
      <Row 
        title="Postres" 
        category="postres"
        items={products.postres}
        loading={loading.postres}
        error={errors.postres}
      />
      <Row 
        title="Ediciones especiales" 
        category="ediciones"
        items={products.ediciones}
        loading={loading.ediciones}
        error={errors.ediciones}
      />

      <div className="menu-footer">
        <a href="/booking">Contacto</a>
        <a href="/booking">Dónde encontrarnos</a>
        <a href="/feed">Opiniones</a>
        <a href="/about">Equipo</a>
      </div>

      <style>{`
        .loading-skeleton {
          opacity: 0.6;
          pointer-events: none;
        }

        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            var(--border, #e0e0e0) 25%,
            var(--background, #f0f0f0) 50%,
            var(--border, #e0e0e0) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-text {
          background: var(--border, #e0e0e0);
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .menu-error, .menu-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          min-width: 300px;
          text-align: center;
          color: var(--muted, #666);
        }

        .menu-error p {
          color: #d32f2f;
          margin-bottom: 1rem;
        }

        .menu-media {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px 8px 0 0;
        }

        .menu-add:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </main>
  );
}
