import { Outlet, NavLink } from "react-router-dom";
export default function Layout(){
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
        <NavLink to="/cart">Carrito</NavLink>
      </nav>
      <main className="container"><Outlet /></main>
      <footer className="footer">© RoyalCoffee</footer>
    </div>
  );
}
