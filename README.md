# RoyalCoffee — Entrega P3 (solo frontend, sin servidor)

Requisitos de P3 cumplidos por este proyecto:
- Sin backend ni llamadas a API (datos hardcodeados).
- Navegación entre páginas (React Router).
- HTML/CSS/JS propios (Vite + React con código propio).
- Preparado para publicar en `docs/` (GitHub Pages).

## Ejecutar en local
```bash
npm i
npm run dev
# abre http://localhost:5173
```

## Publicar en `docs/` para P3
```bash
npm run build
rm -rf docs && mkdir docs
cp -r dist/* docs/
# sube el repo a GitHub y activa Pages: main → /docs
```