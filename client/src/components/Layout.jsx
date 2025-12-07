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
        <NavLink to="/feed">Novedades</NavLink>
        <NavLink to="/account">Mi cuenta</NavLink>
        <NavLink to="/admin">Admin</NavLink>
        <NavLink to="/cart">Carrito</NavLink>
      </nav>
      <main className="container"><Outlet /></main>
      <footer className="footer">
        Royal Coffee | Calle de la Princesa, 10, Madrid | Tel: +34 91 123 45 67
      </footer>
      <ChatWidget />
    </div>
  );
}
