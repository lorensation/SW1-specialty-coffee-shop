import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ChatWidget from "./ChatWidget.jsx";

export default function Layout() {
  const { user } = useAuth();
  return (
    <div className="app">
      <nav className="nav">
        <NavLink to="/">RoyalCoffee</NavLink>
        <div className="grow" />
        <NavLink to="/about">Sobre nosotros</NavLink>
        <NavLink to="/menu">Menú</NavLink>
        <NavLink to="/booking">Reservas</NavLink>
        <NavLink to="/feed">Opiniones</NavLink>
        <NavLink to="/account">Mi cuenta</NavLink>
        <NavLink to="/admin">Admin</NavLink>
        <NavLink to="/cart">Carrito</NavLink>
      </nav>
      <main className="container"><Outlet /></main>
      <footer className="footer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <span>Royal Coffee | Calle de la Princesa, 10, Madrid | Tel: +34 91 123 45 67</span>
          <NavLink to="/feed" style={{ color: 'inherit', textDecoration: 'none', marginLeft: '1rem' }}>Opiniones</NavLink>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
}
