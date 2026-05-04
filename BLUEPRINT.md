# Blueprint: Landing Page Inmobiliaria
## Basado en la arquitectura de Pucon Hygge Stays

Este documento es la guía completa para construir una nueva landing page inmobiliaria
desde cero, usando la misma arquitectura del proyecto Pucon Hygge Stays pero con
estilo, marca y contenido completamente distintos.

---

## Stack tecnológico

- **Frontend**: HTML + CSS puro + JavaScript vanilla (sin frameworks)
- **Backend / Base de datos**: [Supabase](https://supabase.com) (gratis hasta cierto límite)
- **Storage de imágenes**: Supabase Storage (bucket público llamado `fotos`)
- **Fuentes**: Google Fonts (cualquiera, cambiar según marca)
- **Iconos**: Font Awesome 6 (CDN)
- **Deploy**: Cualquier hosting estático (Netlify, Vercel, GitHub Pages, etc.)

**Sin bundler, sin npm, sin build step.** Todo corre directo en el browser.

---

## Estructura de archivos a crear

```
mi-proyecto-inmobiliario/
├── index.html          ← Landing page pública (todo en un solo archivo)
├── admin/
│   └── index.html      ← Panel de administración (todo en un solo archivo)
├── js/
│   ├── config.js       ← Credenciales Supabase (SUPABASE_URL y SUPABASE_KEY)
│   ├── site-data.js    ← Carga datos dinámicos de Supabase al DOM
│   └── cms-loader.js   ← Loader secundario de textos CMS
└── css/
    └── style.css       ← Estilos globales (opcional, o todo inline en index.html)
```

---

## Arquitectura del sistema

### Cómo funciona el CMS

El sistema funciona en 3 capas:

1. **Supabase** → guarda todos los datos (textos, imágenes, propiedades)
2. **Admin** (`/admin/index.html`) → interfaz visual para editar todo sin tocar código
3. **Site** (`/index.html`) → al cargar, hace fetch a Supabase y reemplaza el HTML estático con datos reales

El HTML del `index.html` tiene contenido estático de fallback. Si Supabase no responde
o no está configurado, el sitio sigue funcionando con el contenido hardcodeado en el HTML.

### Patrón CMS (IDs en el HTML)

Los elementos editables tienen IDs con prefijo `cms-`:

```html
<!-- En index.html -->
<span id="cms-hero-eyebrow">Texto de ejemplo</span>
<h1 id="cms-hero-title">Título del proyecto</h1>
```

```javascript
// En site-data.js, al cargar:
if (map.hero_eyebrow) document.getElementById('cms-hero-eyebrow').textContent = map.hero_eyebrow;
```

La tabla `cms_textos` en Supabase tiene dos columnas: `campo` y `valor`.
Cada fila es un par clave-valor que mapea al ID del elemento HTML.

---

## Schema de Supabase (SQL a ejecutar)

Ejecutar en el SQL Editor de Supabase (`supabase.com/dashboard` → SQL Editor):

```sql
-- ═══════════════════════════════════════════
-- TABLA: cms_textos (textos editables del sitio)
-- ═══════════════════════════════════════════
create table if not exists cms_textos (
  id bigint generated always as identity primary key,
  campo text unique not null,
  valor text,
  created_at timestamptz default now()
);

-- Insertar textos iniciales (personalizar según el proyecto)
insert into cms_textos (campo, valor) values
  ('hero_eyebrow',      'Proyecto en preventa'),
  ('hero_titulo',       'Nombre del Proyecto'),
  ('hero_subtitulo',    'Descripción corta del proyecto'),
  ('hero_cta',          'Ver unidades'),
  ('hero_cta2',         'Más información'),
  ('hero_stat1',        '120'),
  ('hero_stat1_label',  'Unidades disponibles'),
  ('hero_stat2',        '2026'),
  ('hero_stat2_label',  'Entrega estimada'),
  ('whatsapp',          '+56912345678'),
  ('email',             'ventas@proyecto.cl'),
  ('instagram',         '@proyecto'),
  ('direccion',         'Calle 123, Ciudad'),
  ('footer_tagline',    'Tagline del proyecto'),
  ('footer_copyright',  '© 2025 Mi Proyecto. Todos los derechos reservados.');

-- ═══════════════════════════════════════════
-- TABLA: hero_carousel (imágenes del hero)
-- ═══════════════════════════════════════════
create table if not exists hero_carousel (
  id bigint generated always as identity primary key,
  imagen_url text not null,
  titulo text,
  subtitulo text,
  orden int default 0,
  activo boolean default true,
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════════
-- TABLA: unidades (las propiedades/unidades a vender)
-- Equivalente a "departamentos" en el proyecto original
-- ═══════════════════════════════════════════
create table if not exists unidades (
  id bigint generated always as identity primary key,
  nombre text,
  numero text,
  slug text unique,
  tipo text,                    -- 'departamento', 'casa', 'parcela', etc.
  descripcion text,
  descripcion_corta text,
  dormitorios int,
  banos int,
  superficie_util numeric,      -- m²
  superficie_terraza numeric,   -- m²
  precio numeric,               -- precio de venta
  precio_uf numeric,            -- precio en UF
  amenidades text,              -- lista separada por saltos de línea
  imagen_principal text,        -- URL de imagen
  piso int,
  orientacion text,
  estado text default 'disponible', -- 'disponible', 'reservada', 'vendida'
  badge text,
  tag text,
  activo boolean default true,
  orden int default 0,
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════════
-- TABLA: unidad_fotos (fotos por unidad)
-- ═══════════════════════════════════════════
create table if not exists unidad_fotos (
  id bigint generated always as identity primary key,
  unidad_id bigint references unidades(id) on delete cascade,
  imagen_url text not null,
  titulo text,
  activo boolean default true,
  orden int default 0,
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════════
-- TABLA: amenidades_proyecto (amenidades comunes del edificio/proyecto)
-- ═══════════════════════════════════════════
create table if not exists amenidades_proyecto (
  id bigint generated always as identity primary key,
  titulo text not null,
  descripcion text,
  icono text,                   -- clase de FontAwesome, ej: 'fa-swimming-pool'
  imagen_url text,
  activo boolean default true,
  orden int default 0,
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════════
-- TABLA: galeria_fotos (galería general del proyecto)
-- ═══════════════════════════════════════════
create table if not exists galeria_fotos (
  id bigint generated always as identity primary key,
  imagen_url text not null,
  titulo text,
  categoria text,               -- 'exterior', 'interior', 'amenidades', etc.
  activo boolean default true,
  orden int default 0,
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════════
-- TABLA: contactos (formulario de interés)
-- ═══════════════════════════════════════════
create table if not exists contactos (
  id bigint generated always as identity primary key,
  nombre text,
  email text,
  telefono text,
  mensaje text,
  unidad_interes text,
  estado text default 'nuevo',  -- 'nuevo', 'contactado', 'descartado'
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════════
-- POLÍTICAS RLS (Row Level Security)
-- ═══════════════════════════════════════════
-- Habilitar RLS en todas las tablas
alter table cms_textos enable row level security;
alter table hero_carousel enable row level security;
alter table unidades enable row level security;
alter table unidad_fotos enable row level security;
alter table amenidades_proyecto enable row level security;
alter table galeria_fotos enable row level security;
alter table contactos enable row level security;

-- Lectura pública para todo (el sitio lee sin autenticación)
create policy "Lectura pública" on cms_textos for select using (true);
create policy "Lectura pública" on hero_carousel for select using (true);
create policy "Lectura pública" on unidades for select using (true);
create policy "Lectura pública" on unidad_fotos for select using (true);
create policy "Lectura pública" on amenidades_proyecto for select using (true);
create policy "Lectura pública" on galeria_fotos for select using (true);

-- Escritura pública en contactos (formulario de interés)
create policy "Insert público" on contactos for insert with check (true);

-- Escritura completa solo con service_role (admin usa anon key con bypass)
-- Nota: en el admin se usan las mismas anon keys con RLS deshabilitado temporalmente
-- Para producción, usar service_role key en el admin (variable de entorno)
create policy "Escritura anon" on cms_textos for all using (true);
create policy "Escritura anon" on hero_carousel for all using (true);
create policy "Escritura anon" on unidades for all using (true);
create policy "Escritura anon" on unidad_fotos for all using (true);
create policy "Escritura anon" on amenidades_proyecto for all using (true);
create policy "Escritura anon" on galeria_fotos for all using (true);
create policy "Escritura anon" on contactos for all using (true);
```

### Storage (bucket de imágenes)

En Supabase → Storage → Create bucket:
- Nombre: `fotos`
- Public: **activado**

---

## js/config.js (copiar y adaptar)

```javascript
const SUPABASE_URL = 'https://TU-PROJECT-ID.supabase.co';
const SUPABASE_KEY = 'TU-ANON-PUBLIC-KEY';

const SUPABASE_CONFIGURED = !SUPABASE_URL.includes('TU-PROJECT');

function supaHeaders(extra = {}) {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    ...extra
  };
}

function supaUrl(table, params = '') {
  return `${SUPABASE_URL}/rest/v1/${table}?select=*${params}`;
}

async function supaFetch(url, opts = {}) {
  if (!SUPABASE_CONFIGURED) return null;
  try {
    const res = await fetch(url, opts);
    return res;
  } catch (e) {
    console.warn('supaFetch error:', e.message);
    return null;
  }
}

async function uploadToStorage(file, folder = 'general') {
  const ext = file.name.split('.').pop();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/fotos/${filename}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'x-upsert': 'true',
        'Content-Type': file.type
      },
      body: file
    }
  );
  if (!res.ok) throw new Error('Error al subir imagen');
  return `${SUPABASE_URL}/storage/v1/object/public/fotos/${filename}`;
}
```

---

## Secciones del index.html a construir

Para una landing inmobiliaria estas son las secciones recomendadas en orden:

1. **Navbar** — logo + links de navegación + CTA "Cotizar"
2. **Hero** — imagen grande con carousel, título del proyecto, stats (unidades, precio desde, entrega)
3. **Strip de valores** — 4-6 íconos con propuesta de valor (ej: "Financiamiento directo", "Entrega 2026", "Ubicación privilegiada")
4. **Nosotros / El proyecto** — descripción del proyecto, quiénes somos, visión
5. **Unidades / Tipologías** — grid de cards con cada tipo de unidad (precio, m², dormitorios, CTA)
6. **Amenidades** — grid de amenidades del edificio/proyecto
7. **Galería** — galería de renders o fotos reales
8. **Ubicación** — mapa embebido + descripción del sector
9. **Avance de obra** — (opcional) galería de fotos de avance
10. **Preguntas frecuentes** — acordeón FAQ
11. **Formulario de contacto** — nombre, email, teléfono, mensaje
12. **Footer** — logo, redes sociales, datos de contacto

---

## Patrón de componente de tarjeta de unidad

```html
<article class="unit-card">
  <div class="unit-card-image">
    <!-- slider de fotos -->
    <div class="unit-slider" id="slider-[id]">
      <div class="unit-slides">
        <img src="..." alt="..." />
      </div>
    </div>
    <div class="unit-badge">Disponible</div>
    <div class="unit-tag">2 dorm · 65 m²</div>
  </div>
  <div class="unit-card-body">
    <h3 class="unit-name">Tipología <em>A</em></h3>
    <p class="unit-desc">Descripción breve de la unidad.</p>
    <ul class="unit-features">
      <li><i class="fa-solid fa-check"></i> 2 dormitorios</li>
      <li><i class="fa-solid fa-check"></i> 1 baño</li>
      <li><i class="fa-solid fa-check"></i> Terraza 12 m²</li>
    </ul>
    <div class="unit-price">
      <div class="price-block">
        <span class="price-label">Desde</span>
        <span class="price-amount">UF 2.800</span>
      </div>
      <a href="#contacto" class="btn btn-primary btn-sm">Cotizar</a>
    </div>
  </div>
</article>
```

---

## Panel de Administración (admin/index.html)

El admin es un single-page app protegido por usuario/contraseña hardcodeada.
Las secciones mínimas necesarias:

| Sección nav | Qué gestiona |
|---|---|
| Dashboard | Resumen rápido + accesos |
| Unidades | CRUD de tipologías/unidades |
| Hero | Imágenes del carrusel principal |
| Amenidades | CRUD de amenidades del proyecto |
| Galería | Upload de fotos generales |
| Contactos | Lista de formularios recibidos |
| CMS Editor | Edición de todos los textos del sitio |

### Login del admin (hardcodeado, simple)

```javascript
const ADMIN_USERS = {
  'admin': 'password123',  // cambiar esto
  'ventas': 'ventas2025'
};

function doLogin(e) {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;
  if (ADMIN_USERS[user] === pass) {
    sessionStorage.setItem('admin_auth', user);
    showAdminApp();
  } else {
    document.getElementById('loginError').classList.add('show');
  }
}
```

---

## Paleta de colores sugerida para proyecto inmobiliario (cambiar según marca)

Estilos modernos y limpios vs. el tono tierra/bosque del proyecto original:

### Opción A: Moderno / Minimalista (blanco + negro + acento)
```css
:root {
  --bg: #FAFAFA;
  --white: #FFFFFF;
  --black: #0A0A0A;
  --dark: #1A1A1A;
  --mid: #6B6B6B;
  --light: #CCCCCC;
  --primary: #0A0A0A;
  --accent: #C8A96E;    /* dorado cálido */
  --accent-light: #F5EDD6;
}
```

### Opción B: Lujo / Premium (azul marino + dorado)
```css
:root {
  --bg: #F8F8F6;
  --white: #FFFFFF;
  --navy: #0D1F3C;
  --navy-mid: #1A3055;
  --gold: #B8963E;
  --gold-light: #F0E6CC;
  --mid: #8A8A8A;
  --primary: #0D1F3C;
  --accent: #B8963E;
}
```

### Opción C: Natural / Sustentable (verde + beige)
```css
:root {
  --bg: #F5F2ED;
  --white: #FFFFFF;
  --green: #2D5A3D;
  --green-mid: #4A7C5F;
  --beige: #C9B99A;
  --beige-light: #EDE8DF;
  --mid: #7A6F65;
  --primary: #2D5A3D;
  --accent: #C9B99A;
}
```

---

## Tipografías sugeridas (Google Fonts)

Para inmobiliaria de lujo:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
```
- Display: `Cormorant Garamond` (elegante, serif)
- Body: `Jost` (moderno, geométrico)

Para proyecto moderno/urbano:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
```
- Display: `DM Serif Display`
- Body: `DM Sans`

---

## Pasos para arrancar el nuevo proyecto

1. **Crear carpeta nueva** (ej: `mi-proyecto/`)
2. **Crear cuenta Supabase** → nuevo proyecto → copiar URL y anon key
3. **Ejecutar el SQL** de este documento en el SQL Editor de Supabase
4. **Crear bucket `fotos`** en Supabase Storage (público)
5. **Copiar estructura de archivos** de Pucon Hygge Stays como base
6. **Editar `js/config.js`** con las nuevas credenciales
7. **Rediseñar `index.html`**: cambiar paleta CSS, fuentes, secciones, contenido
8. **Adaptar `js/site-data.js`**: renombrar tablas (`departamentos` → `unidades`, etc.)
9. **Adaptar `admin/index.html`**: cambiar secciones del sidebar según las nuevas tablas
10. **Subir a hosting** (Netlify drag-and-drop es la opción más rápida)

---

## Qué cambiar vs. qué reutilizar

| Componente | Acción |
|---|---|
| `js/config.js` | Copiar tal cual, cambiar solo las credenciales |
| `js/site-data.js` | Copiar y adaptar: renombrar tablas y campos según el nuevo proyecto |
| `js/cms-loader.js` | Copiar y adaptar: mapear los nuevos IDs CMS |
| Hero carousel (JS) | Copiar tal cual, funciona igual |
| Apt slider (JS) | Copiar tal cual, renombrar variables si se quiere |
| Admin login | Copiar tal cual, cambiar usuarios/contraseñas |
| Admin sidebar + layout | Copiar y cambiar secciones del nav |
| Admin CMS editor | Copiar y adaptar los campos del formulario |
| Estilos CSS `:root` vars | Cambiar paleta de colores completamente |
| Fuentes Google | Cambiar según nueva identidad |
| Secciones HTML | Adaptar o reescribir según el tipo de proyecto |

---

## Datos de contacto del proyecto original (NO copiar)

- Supabase URL: `https://vpoutrwyrtcwsvwhumwz.supabase.co`
- Proyecto: Pucon Hygge Stays — departamentos en Pucón, Chile
- Bucket: `fotos`

> ⚠️ El nuevo proyecto debe tener su propio proyecto Supabase con nuevas credenciales.
