import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext();

export function CartProvider({ children }){
  const [items, setItems] = useState(()=>{
    try { return JSON.parse(localStorage.getItem("cart_items")) || []; }
    catch { return []; }
  });

  // Persistencia
  useEffect(()=>{
    localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items]);

  // Acciones
  const addItem = (prod) => {
    // prod: {id, name, price, ...other fields from API}
    setItems(prev => {
      const found = prev.find(p => p.id === prod.id);
      if (found) {
        return prev.map(p => p.id === prod.id ? { ...p, qty: p.qty + 1, checked: true } : p);
      }
      // Store all product data but add qty and checked
      return [...prev, { ...prod, qty: 1, checked: true }];
    });
  };
  const removeItem   = (id)        => setItems(prev=>prev.filter(p=>p.id!==id));
  const updateQty    = (id, q)     => setItems(prev=>prev.map(p=>p.id===id ? {...p, qty:Number(q)} : p));
  const toggleChecked= (id)        => setItems(prev=>prev.map(p=>p.id===id ? {...p, checked:!p.checked} : p));
  const clearCart    = ()          => setItems([]);

  // Totales
  const IVA_PCT = 0.10;
  const totals = useMemo(()=>{
    const subtotal = items.filter(i=>i.checked).reduce((a,i)=>a + i.price*i.qty, 0);
    const iva = +(subtotal * IVA_PCT).toFixed(2);
    const total = +(subtotal + iva).toFixed(2);
    return { subtotal:+subtotal.toFixed(2), iva, total, IVA_PCT };
  }, [items]);

  return (
    <CartCtx.Provider value={{items, addItem, removeItem, updateQty, toggleChecked, clearCart, totals}}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
