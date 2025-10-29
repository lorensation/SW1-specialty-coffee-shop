import { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(()=>{
    try { return JSON.parse(localStorage.getItem("demo_user")) || null; }
    catch { return null; }
  });

  useEffect(()=>{
    localStorage.setItem("demo_user", JSON.stringify(user));
  }, [user]);

  const login = () => setUser({ name:"Juan Pérez", email:"juan@example.com" });
  const register = () => setUser({ name:"Nueva Persona", email:"nuevo@example.com" });
  const logout = () => setUser(null);

  return (
    <AuthCtx.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
