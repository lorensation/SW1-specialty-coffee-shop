import { useRef, useEffect, useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "../../services/productService.js";

export default function Cart() {
  const { items, removeItem, updateQty, toggleChecked, totals, clearCart, addItem } = useCart();
  const { user } = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  // Fetch recommendations on mount
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await getFeaturedProducts();
        if (res.success) {
          // Take only 2-3 items for the sidebar
          setRecommended(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoadingRecs(false);
      }
    };
    fetchRecs();
  }, []);

  if (!user) {
    return (
      <main className="cart-page" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", gap: "1.5rem" }}>
        <h1 className="cart-title">Carrito de compras</h1>
        <div style={{ fontSize: "4rem" }}>🛒</div>
        <p style={{ fontSize: "1.2rem", color: "var(--muted)" }}>Para ver tu carrito necesitas iniciar sesión</p>
        <Link to="/account" className="btn btn-primary">Ir a Mi Cuenta</Link>
      </main>
    );
  }

  const simulate = () => {
    const sel = items.filter(i => i.checked);
    if (!sel.length) { alert("No hay productos seleccionados."); return; }
    alert(`Simulación de pedido:\n\n${sel.map(i => `• ${i.qty}× ${i.name}`).join("\n")}\n\nTotal: ${totals.total.toFixed(2)} €`);
  };

  return (
    <main className="cart-page">
      <h1 className="cart-title">Carrito de compras.</h1>
      <div className="cart-grid">
        <section className="cart-box">
          <div className="cart-head">
            <div></div>
            <div>Producto</div>
            <div>Cantidad</div>
            <div>Precio</div>
          </div>

          {items.length === 0 && <p style={{ color: "var(--muted)" }}>No hay productos en el carrito.</p>}

          {items.map(i => (
            <div key={i.id} className="cart-row">
              <input className="cart-check" type="checkbox" checked={i.checked ?? true} onChange={() => toggleChecked(i.id)} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <span>{i.name}</span>
                <button className="link" onClick={() => removeItem(i.id)} aria-label={`Eliminar ${i.name}`}>Eliminar</button>
              </div>
              <div className="cart-qty">
                <select value={i.qty} onChange={e => updateQty(i.id, e.target.value)}>
                  {Array.from({ length: 10 }, (_, k) => k + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>{i.price.toFixed(2)} €</div>
            </div>
          ))}

          <div className="cart-summary">
            <div className="line"><span>Subtotal</span><span>{totals.subtotal.toFixed(2)} €</span></div>
            <div className="line"><span>IVA ({(totals.IVA_PCT * 100).toFixed(0)}%)</span><span>{totals.iva.toFixed(2)} €</span></div>
            <div className="line"><strong>Total</strong><strong>{totals.total.toFixed(2)} €</strong></div>
          </div>

          <div className="cart-actions">
            <a className="link" href="/menu">← Seguir comprando</a>
            <button className="btn-primary" onClick={simulate}>Simular pedido</button>
            {items.length > 0 && <button className="btn-primary" onClick={clearCart} style={{ background: "#8c6b53" }}>Vaciar</button>}
          </div>
        </section>

        <aside className="cart-side">
          <div className="cart-box">
            <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "var(--brand)" }}>Te podría interesar:</h3>

            {loadingRecs ? (
              <p style={{ color: "var(--muted)", fontStyle: "italic" }}>Cargando sugerencias...</p>
            ) : recommended.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>No hay sugerencias por ahora.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {recommended.map(prod => (
                  <div key={prod.id} className="rec-card">
                    <div className="rec-img-box">
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "#e0e0e0" }} />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: "0 0 0.2rem", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {prod.name}
                      </h4>
                      <p style={{ margin: 0, color: "var(--brand)", fontWeight: "bold", fontSize: "0.9rem" }}>
                        {prod.price.toFixed(2)} €
                      </p>
                    </div>

                    <button
                      onClick={() => addItem(prod)}
                      className="rec-add-btn"
                      title="Añadir al carrito"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Link to="/menu" style={{ display: "block", marginTop: "1rem", textAlign: "center", fontSize: "0.9rem", textDecoration: "none", color: "var(--muted)" }}>
              Ver todo el menú
            </Link>
          </div>
        </aside>
      </div>

      <div className="cart-footer">
        <a href="/booking">Contacto</a>
        <a href="/booking">Dónde encontrarnos</a>
        <a href="/feed">Opiniones</a>
        <a href="/about">Equipo</a>
      </div>
    </main>
  );
}
