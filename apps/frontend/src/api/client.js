export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function api(path, options={}){
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers||{}) },
    ...options
  });
  if(!res.ok) throw new Error(`API ${res.status}`);
  return res.status === 204 ? null : res.json();
}
