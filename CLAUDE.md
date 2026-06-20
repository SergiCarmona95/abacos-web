# abacos-web — CLAUDE.md

Proyecto web del sindicato **ÁBACOS** del Ayuntamiento de Barcelona.

## Stack técnico

- **Astro v6** + **Tailwind CSS v4** (plugin `@tailwindcss/vite`)
- **Decap CMS** — panel en `public/admin/` (index.html + config.yml)
- **Content Collections** — noticias y documentos en `src/content/`
- Node.js >= 22

## Bilingüismo

- `/ca/` — catalán (idioma principal, ruta por defecto siempre)
- `/es/` — castellano
- La raíz `/` redirige a `/ca/` via JS en `src/pages/index.astro` (no hay redirect en `netlify.toml` — lo gestiona el JS para no interferir con los tokens de Netlify Identity)

## Estructura de páginas

```
/ca/  → inicio, qui-som, noticies, documents, afiliacio, contacte, avis-legal, privacitat, cookies
/es/  → inicio, quienes-somos, noticias, documentos, afiliacion, contacto, aviso-legal, privacidad, cookies
/admin/ → panel Decap CMS
```

## Repositorio y despliegue

- **Repo GitHub**: `SergiCarmona95/abacos-web` (privado)
- **Despliegue**: Netlify — `dazzling-fenglisu-175fa2.netlify.app`
- **Dominio final**: `www.abacos.website`
- **Git remoto local**: configurado con `credential.useHttpPath true` y usuario `SergiCarmona95`

## CMS (Decap CMS)

Autenticación por **Netlify Identity** (email + contraseña). No requiere cuenta de GitHub para los editores.

`public/admin/config.yml`:
```yaml
backend:
  name: git-gateway
  branch: main
```

**Para invitar editores**: Netlify → site `dazzling-fenglisu-175fa2` → **Identity** → **Invite users** → email.

**Requisitos activos en Netlify**:
- Identity: activado, registro en "Invite only"
- Git Gateway: activado

**Nota**: Sveltia CMS fue descartado porque no soporta `git-gateway`. Se usa Decap CMS.

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
- `identificador` (string — slug del fichero, ej: `acord-condicions-2024`)
- `nom` (string, CA), `nomEs` (string, ES)
- `categoria` (select CA: Convenis / Permisos i llicències / Afiliació / Altres)
- `categoriaEs` (select ES: Convenios / Permisos y licencias / Afiliación / Otros)
- `mida` (string, ej. "2.4 MB")
- `url` (file — `/uploads/documents/`)

## Páginas conectadas al CMS

Todas usan `getCollection()` — los cambios en el CMS se reflejan automáticamente tras el rebuild:

| Página | Collection | Campos usados |
|---|---|---|
| `ca/noticies.astro` | `noticies` | titol, tag, data, resum |
| `es/noticias.astro` | `noticies` | titolEs, tagEs, data, resumEs |
| `ca/documents.astro` | `documents` | nom, categoria, mida, url |
| `es/documentos.astro` | `documents` | nomEs, categoriaEs, mida, url |
| `ca/afiliacio.astro` | `documents` | url (primer doc categoria=Afiliació) |
| `es/afiliacion.astro` | `documents` | url (primer doc categoriaEs=Afiliación) |

## Archivos clave

| Archivo | Propósito |
|---|---|
| `astro.config.mjs` | Configuración Astro (site, sitemap, Tailwind) |
| `netlify.toml` | Build command, publish dir, headers admin |
| `public/admin/config.yml` | Config Decap CMS + git-gateway |
| `public/admin/index.html` | Shell del panel CMS (carga identity widget + decap) |
| `src/pages/index.astro` | Redirect JS a /ca/ (preserva tokens Identity) |
| `src/content.config.ts` | Esquemas de Content Collections |
| `src/layouts/Layout.astro` | Layout principal (incluye netlify-identity-widget) |

## Comandos habituales

```bash
npm run dev      # desarrollo local (localhost:4321)
npm run build    # build de producción → dist/
npm run preview  # preview del build
```

## Historial de decisiones importantes

- **Netlify como hosting completo**: migrado desde arquitectura dual Vercel+Netlify. Netlify gestiona hosting, Identity y Git Gateway en un solo site.
- **Decap CMS en vez de Sveltia**: Sveltia CMS no soporta el backend `git-gateway` necesario para Netlify Identity.
- **Netlify Identity en vez de GitHub OAuth**: los editores no tienen cuentas de GitHub. Con Identity reciben un email de invitación y crean contraseña propia.
- **Redirect raíz sin netlify.toml**: el 302 servidor interfería con los `#invite_token` de Identity (el hash no se envía al servidor y se pierde). El JS de `index.astro` detecta el token y no redirige si está presente.
- **`is:inline` en scripts de index.astro**: necesario para que Astro no procese los scripts externos como módulos ES (evita error CORS).
- **Campo `identificador` en documents**: slug explícito para que el CMS genere nombres de fichero legibles en vez de hashes aleatorios.
- **CMS verificado funcionando** en `dazzling-fenglisu-175fa2.netlify.app/admin/` con login Netlify Identity y colecciones Notícies y Documents.
