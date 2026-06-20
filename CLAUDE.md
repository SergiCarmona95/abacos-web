# abacos-web — CLAUDE.md

Proyecto web del sindicato **ÁBACOS** del Ayuntamiento de Barcelona.

## Stack técnico

- **Astro v6** + **Tailwind CSS v4** (plugin `@tailwindcss/vite`)
- **Sveltia CMS** — panel en `public/admin/` (index.html + config.yml)
- **Content Collections** — noticias y documentos en `src/content/`
- Node.js >= 22

## Bilingüismo

- `/ca/` — catalán (idioma principal, ruta por defecto)
- `/es/` — castellano
- La raíz `/` redirige a `/ca/` (configurado en `netlify.toml` y antes en `vercel.json`)

## Estructura de páginas

```
/ca/  → inicio, qui-som, noticies, documents, afiliacio, contacte, avis-legal, privacitat, cookies
/es/  → inicio, quienes-somos, noticias, documentos, afiliacion, contacto, aviso-legal, privacidad, cookies
/admin/ → panel Sveltia CMS
```

## Repositorio y despliegue

- **Repo GitHub**: `SergiCarmona95/abacos-web` (privado)
- **Despliegue**: Netlify (migrado desde Vercel)
- **Site Netlify (OAuth)**: `dazzling-fenglisu-175fa2.netlify.app`
- **Dominio final**: `www.abacos.website`

## CMS (Sveltia CMS)

Autenticación OAuth de GitHub gestionada por Netlify Identity.

`public/admin/config.yml`:
```yaml
backend:
  name: github
  repo: SergiCarmona95/abacos-web
  branch: main
  site_domain: dazzling-fenglisu-175fa2.netlify.app
  base_url: https://api.netlify.com
  auth_endpoint: auth
```

**Requisito**: En el dashboard de Netlify del site `dazzling-fenglisu-175fa2`, ir a
**Site configuration → Access & security → OAuth** y añadir GitHub como provider
con las credenciales de la GitHub OAuth App.

### Collections del CMS

**noticies** (`src/content/noticies/`):
- `titol` (string, CA), `titolEs` (string, ES)
- `data` (datetime, formato `DD MMM YYYY`)
- `tag` (string, CA), `tagEs` (string, ES)
- `resum` (text, CA), `resumEs` (text, ES)
- `body` (markdown, CA)
- `video` (string, opcional — URL YouTube)
- `imatge` (image, opcional — `/uploads/noticies/`)

**documents** (`src/content/documents/`):
- `nom` (string, CA), `nomEs` (string, ES)
- `categoria` (select CA: Convenis / Permisos i llicències / Afiliació / Altres)
- `categoriaEs` (select ES: Convenios / Permisos y licencias / Afiliación / Otros)
- `mida` (string, ej. "2.4 MB")
- `url` (file — `/uploads/documents/`)

## Archivos clave

| Archivo | Propósito |
|---|---|
| `astro.config.mjs` | Configuración Astro (site, sitemap, Tailwind) |
| `netlify.toml` | Build, publish dir, redirect `/` → `/ca/`, headers |
| `public/admin/config.yml` | Config Sveltia CMS + OAuth GitHub/Netlify |
| `public/admin/index.html` | Shell del panel CMS |
| `src/content.config.ts` | Esquemas de Content Collections |
| `vercel.json` | Redirect legacy (ya no se usa, puede eliminarse) |

## Comandos habituales

```bash
npm run dev      # desarrollo local (localhost:4321)
npm run build    # build de producción → dist/
npm run preview  # preview del build
```

## Historial de decisiones importantes

- **Arquitectura dual Vercel + Netlify**: la web se sirve desde Vercel, pero el site de Netlify (`dazzling-fenglisu-175fa2`) actúa solo como gateway OAuth. No necesita tener el proyecto desplegado — solo necesita existir y tener el GitHub OAuth provider configurado.
- **`site_domain`**: debe ser el dominio del site de Netlify que tiene configurado el OAuth provider, no el dominio final de producción.
- **GitHub OAuth App**: callback URL debe ser `https://api.netlify.com/auth/done`. Las credenciales van en el dashboard de Netlify del site `dazzling-fenglisu-175fa2` → Site configuration → Access & security → OAuth.
- **CMS verificado funcionando** en `dazzling-fenglisu-175fa2.netlify.app/admin/` con colecciones Notícies y Documents accesibles.
