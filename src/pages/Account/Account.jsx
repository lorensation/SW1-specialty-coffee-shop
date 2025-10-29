import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Account(){
  const { user, login, register, logout } = useAuth();
  const [dark, setDark] = useState(false);

  // Modo oscuro (si ya tenías este bloque, déjalo igual)
  useEffect(()=>{
    document.body.classList.toggle("theme-dark", dark);
  }, [dark]);

  const reservas = ["19/07/2025 – 2 pax", "20/08/2025 – 3 pax", "24/08/2025 – 2 pax"];
  const opiniones = [
    { sitio:"StarBucks", rating:4 },
    { sitio:"Cafe rojo", rating:2 },
    { sitio:"Mocalia",   rating:5 },
  ];
  const Stars = ({n}) => <span className="stars">{"★".repeat(n)}{"☆".repeat(5-n)}</span>;

  return (
    <main className="account-page">
      <h1 className="account-title">Mi cuenta</h1>

      {/* Cabecera */}
      <section className="account-header">
        <div className="account-avatar" aria-hidden="true" />
        <div className="account-info">
          {user ? (
            <>
              <div><strong>Nombre de usuario</strong>: {user.name}</div>
              <div><strong>Correo electrónico</strong>: {user.email}</div>
            </>
          ) : (
            <div style={{color:"var(--muted)"}}>¿Aún no tienes cuenta?</div>
          )}
        </div>
        <div className="account-ctas">
          {!user ? (
            <>
              <button className="btn btn-primary" onClick={login}>Iniciar sesión</button>
              <button className="btn btn-outline" onClick={register}>Registrarse</button>
            </>
          ) : (
            <button className="btn btn-outline" onClick={logout}>Cerrar sesión</button>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="account-grid">
        <article className="account-card">
          <h3>Mis reservas</h3>
          <ul className="account-list">
            {reservas.map((r,i)=>(<li key={i}>{r}</li>))}
          </ul>
          <div style={{marginTop:".75rem"}}>
            <a className="btn btn-primary" href="/menu">Realizar nuevo pedido</a>
          </div>
        </article>

        <article className="account-card">
          <h3>Mis opiniones</h3>
          <ul className="account-list" style={{listStyle:"none", paddingLeft:0}}>
            {opiniones.map((o,i)=>(
              <li key={i} style={{display:"flex", justifyContent:"space-between", margin:".35rem 0"}}>
                <span>{o.sitio}</span><Stars n={o.rating} />
              </li>
            ))}
          </ul>
        </article>

        <article className="account-card">
          <h3>Preferencias</h3>
          <div className="pref-row">
            <div>Modo oscuro</div>
            <div
              className="switch"
              role="switch"
              aria-checked={dark}
              data-on={dark ? "true" : "false"}
              tabIndex={0}
              onClick={()=>setDark(v=>!v)}
              onKeyDown={(e)=>{ if(e.key==="Enter"||e.key===" ") setDark(v=>!v); }}
            />
          </div>
        </article>
      </section>

      <div className="account-footer">
        <a href="/booking">Contacto</a>
        <a href="/booking">Dónde encontrarnos</a>
        <a href="/feed">Opiniones</a>
        <a href="/about">Equipo</a>
      </div>
    </main>
  );
}
