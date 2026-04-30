# Transporte Fluvial — Delta del Tigre

Mapa interactivo de las lanchas colectivas del Delta del Tigre. Muestra recorridos, horarios y posición en tiempo real de las líneas 450 a 455 que parten desde la Estación Fluvial Tigre.

## Stack

- **Build / dev server:** [Vite 8](https://vite.dev/)
- **Lenguaje:** TypeScript (sin framework de UI — DOM nativo)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (vía `@tailwindcss/vite`)
- **Mapa:** [Leaflet](https://leafletjs.com/)
- **Tracking en vivo:** API pública de embarcaciones del Delta
- **Hosting:** estático (Vercel / cualquier CDN)

## Estructura

```
.
├── docs/
│   └── lineas/                # PDFs originales de las líneas 450–455 (fuente de datos)
├── public/                    # Assets estáticos (favicons, manifest, logo)
├── src/
│   ├── components/            # Sidebar, search bar, schedule table
│   ├── data/                  # Datos parseados por línea (linea450.ts … linea455.ts)
│   ├── map/                   # mapManager + liveBoats (Leaflet + tracking)
│   ├── app.ts                 # Layout + entrypoint UI
│   ├── main.ts                # Bootstrap
│   ├── style.css              # Tailwind + estilos custom
│   └── types.ts
├── index.html
├── vite.config.ts
└── tsconfig.json
```

## Requisitos

- Node.js 20+ (recomendado LTS)
- npm 10+ (o pnpm / yarn equivalente)

## Cómo levantar el proyecto

```bash
# Instalar dependencias
npm install

# Dev server (http://localhost:5173)
npm run dev

# Build de producción → dist/
npm run build

# Preview del build
npm run preview
```

## Scripts

| Script        | Acción                                 |
|---------------|----------------------------------------|
| `npm run dev` | Vite dev server con HMR                |
| `npm run build` | Type-check (`tsc`) + build de Vite   |
| `npm run preview` | Sirve `dist/` localmente           |

## Datos de las líneas

Los recorridos y horarios se transcribieron desde los PDFs oficiales ubicados en `docs/lineas/`. Cada línea tiene su archivo en `src/data/lineaXXX.ts`. Para actualizar horarios o recorridos, editá esos archivos.

## Deploy

Build estático en `dist/`. Subible directo a Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, etc. No requiere backend.
