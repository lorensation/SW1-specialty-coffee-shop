import { useRef, useEffect, useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getProductsByCategory } from "../../services/productService.js";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Row({ title, category, loading, error, items, onAddClick, favorites, onToggleFavorite }) {
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
                <button
                  className={`fav-btn ${favorites.some(f => f.id === it.id) ? 'active' : ''}`}
                  onClick={() => onToggleFavorite(it)}
                  aria-label={favorites.some(f => f.id === it.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  {favorites.some(f => f.id === it.id) ? '♥' : '♡'}
                </button>
                {it.image_url ? (
                  <img src={it.image_url} alt={it.name} className="menu-media" />
                ) : (
                  <div className="menu-media" aria-hidden="true" />
                )}
                <div className="menu-body">
                  <div className="menu-info">
                    <h3 className="menu-name">{it.name}</h3>
                    {(it.tasting_notes || it.description) && (
                      <p className="menu-ingredients">
                        {it.tasting_notes || it.description}
                      </p>
                    )}
                  </div>
                  <div className="menu-meta">
                    <div className="menu-price"><b>Precio total {it.price.toFixed(2)}€</b></div>
                    <button
                      className="menu-add"
                      onClick={() => onAddClick(it)}
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
  const { addItem } = useCart();
  const { user } = useAuth();

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

  // UI States
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  const [favorites, setFavorites] = useState([]);

  // Load favorites on mount or user change
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/favorites`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          const data = await response.json();
          if (data.success) {
            setFavorites(data.data);
          }
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      } else {
        // Fallback to local storage
        try {
          const saved = localStorage.getItem("royal_favorites");
          if (saved) setFavorites(JSON.parse(saved));
        } catch {
          setFavorites([]);
        }
      }
    };
    loadFavorites();
  }, [user]);

  const toggleFavorite = async (product) => {
    const isFavorite = favorites.some(p => p.id === product.id);

    // Optimistic update
    let newFavs;
    if (isFavorite) {
      newFavs = favorites.filter(p => p.id !== product.id);
    } else {
      newFavs = [...favorites, product];
    }
    setFavorites(newFavs);

    if (user) {
      // Sync with backend
      try {
        const token = localStorage.getItem('token');
        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/favorites`;
        const method = isFavorite ? 'DELETE' : 'POST';
        const endpoint = isFavorite ? `${url}/${product.id}` : url;
        const body = isFavorite ? undefined : JSON.stringify({ productId: product.id });

        await fetch(endpoint, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body,
          credentials: 'include'
        });
      } catch (error) {
        console.error("Error syncing favorite:", error);
        // Revert on error (optional, but good practice)
      }
    } else {
      // Sync with local storage
      localStorage.setItem("royal_favorites", JSON.stringify(newFavs));
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    addItem(product);
    toast.success(`¡${product.name} añadido al carrito!`);
  };

  return (
    <main className="menu-page">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLoginModal(false)}>&times;</button>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
              <h3 style={{ marginBottom: '1rem' }}>Inicia sesión para comprar</h3>
              <p style={{ marginBottom: '1.5rem', color: 'var(--muted)' }}>
                Necesitas una cuenta para añadir productos al carrito.
              </p>
              <Link to="/account" className="btn btn-primary" style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
                Ir a Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      )}

      <Row
        title="Café de origen"
        category="origen"
        items={products.origen}
        loading={loading.origen}
        error={errors.origen}
        onAddClick={handleAddToCart}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
      <Row
        title="Bebida"
        category="bebida"
        items={products.bebida}
        loading={loading.bebida}
        error={errors.bebida}
        onAddClick={handleAddToCart}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
      <Row
        title="Postres"
        category="postres"
        items={products.postres}
        loading={loading.postres}
        error={errors.postres}
        onAddClick={handleAddToCart}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
      <Row
        title="Ediciones especiales"
        category="ediciones"
        items={products.ediciones}
        loading={loading.ediciones}
        error={errors.ediciones}
        onAddClick={handleAddToCart}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />

      <div className="menu-footer">
        <a href="/booking">Contacto</a>
        <a href="/booking">Dónde encontrarnos</a>
        <a href="/feed">Opiniones</a>
        <a href="/about">Equipo</a>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          backdrop-filter: blur(2px);
        }

        .modal-content {
          background: var(--background, white);
          padding: 2rem;
          border-radius: 12px;
          max-width: 400px;
          width: 90%;
          position: relative;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text);
        }

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

        .menu-card {
          position: relative;
        }

        .fav-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          z-index: 10;
          transition: transform 0.2s;
        }

        .fav-btn:hover {
          transform: scale(1.1);
        }

        .fav-btn.active {
          color: #e74c3c;
        }

        .menu-add:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </main>
  );
}
