import { useCart } from "../../context/CartContext.jsx";

import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function Cart() {
  const { items, removeItem, updateQty, toggleChecked, totals, clearCart } = useCart();
  const { user } = useAuth();

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
            <h3>Te podría interesar:</h3>
            <div className="rec-card" aria-label="Recomendación 1" />
            <div className="rec-card" aria-label="Recomendación 2" />
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
