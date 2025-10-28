
import { useEffect, useState } from "react";
import { api } from "../../api/client";

export default function Menu(){
  const [items, setItems] = useState([]);
  useEffect(()=>{ api("/api/products").then(setItems).catch(console.error); }, []);
  return (
    <section>
      <h1>Menú</h1>
      <ul>{items.map(p=> <li key={p.id}>{p.name} — {p.price}€</li>)}</ul>
    </section>
  );
}
