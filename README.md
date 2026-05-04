# Pucon Hygge Stays — Sitio Web + Panel Admin

Sitio web de alquiler de departamentos en Pucón, Chile, con panel de administración CMS.

---

## Cómo poner el sitio en línea (paso a paso)

### Paso 1: Configurar Supabase (base de datos)

> Si ya corriste la query SQL y salió "Success", este paso ya está hecho.

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta gratis
2. Crea un nuevo proyecto (región: South America - São Paulo)
3. Ve a **SQL Editor** → New Query
4. Pega la query SQL completa (archivo `supabase-tables.sql` si lo tienes, o la que te entregaron) y haz clic en **Run**

### Paso 2: Conectar el código con Supabase

1. En Supabase, ve a **Settings** → **API** (menú de la izquierda)
2. Copia los dos valores que necesitas:
   - **Project URL** — algo como `https://abcdefg.supabase.co`
   - **anon public key** — un texto largo que empieza con `eyJ...`
3. Abre el archivo `js/config.js` y reemplaza los placeholders:

```javascript
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';  // ← pegar tu URL aquí
const SUPABASE_KEY = 'eyJ...tu-key-aqui...';              // ← pegar tu key aquí
```

4. Guarda el archivo. ¡Eso es todo el cambio de código necesario!

### Paso 3: Subir a GitHub

1. Crea una cuenta en [github.com](https://github.com) (gratis)
2. Haz clic en **New repository** (botón verde "+")
3. Nombre: `pucon-hygge-stays` (o el que quieras)
4. Déjalo **Public** y haz clic en **Create repository**
5. En la página que aparece, haz clic en **"uploading an existing file"**
6. Arrastra TODOS los archivos de esta carpeta (index.html, admin/, css/, js/, etc.)
7. Haz clic en **Commit changes**

### Paso 4: Publicar en Netlify

1. Crea una cuenta en [netlify.com](https://netlify.com) (gratis, usa tu cuenta de GitHub)
2. Haz clic en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub** y busca tu repositorio `pucon-hygge-stays`
4. Deja todo por defecto y haz clic en **Deploy site**
5. En ~1 minuto tendrás tu sitio en una URL tipo `https://nombre-random.netlify.app`
6. Puedes cambiar el nombre en **Site configuration** → **Change site name**

### Paso 5 (opcional): Dominio propio

Si tienes un dominio (ej: `puconhyggestays.cl`):
1. En Netlify, ve a **Domain management** → **Add custom domain**
2. Sigue las instrucciones para apuntar tu DNS

---

## Estructura del proyecto

```
pucoon/
├── index.html                  ← Sitio público principal
├── admin/
│   └── index.html              ← Panel de administración
├── css/
│   └── style.css               ← Estilos del sitio
├── js/
│   ├── config.js               ← ⚡ CONFIGURACIÓN DE SUPABASE (editar aquí)
│   ├── cms-loader.js           ← Carga datos dinámicos en el sitio
│   ├── site-data.js            ← Capa de datos alternativa
│   └── main.js                 ← Lógica del front (sliders, formularios, etc.)
├── pucon-hygge-stays-preview.html ← Vista previa alternativa
└── README.md                   ← Este archivo
```

---

## Uso del Panel Admin

1. Abre `admin/index.html` (o `tu-sitio.netlify.app/admin/`)
2. Credenciales: usuario `admin` · contraseña `hygge2025`
3. Desde ahí puedes gestionar:
   - Departamentos (activar/ocultar, precios, fotos)
   - Hero carousel (imágenes de portada)
   - Textos del sitio (CMS completo)
   - Actividades "Vive Pucón"
   - Fotos de áreas comunes y playa
   - Reservas y calendario
   - Noticias / blog
4. Después de hacer cambios, haz clic en **"Actualizar Front-End"** en la barra superior

---

## Tablas en Supabase

| Tabla | Para qué sirve |
|---|---|
| `departamentos` | Datos de los 3 deptos (nombre, precio, activo, etc.) |
| `depto_fotos` | Fotos del carrusel de cada departamento |
| `hero_carousel` | Imágenes de la portada (hero) |
| `actividades_pucon` | Cards "Vive Pucón" |
| `areas_comunes_fotos` | Galería de áreas comunes |
| `playa_fotos` | Galería de la playa privada |
| `cms_textos` | Todos los textos e imágenes editables del sitio (incluye nosotros_imagen_main/sec) |
| `reservas` | Solicitudes del formulario público |
| `reservas_admin` | Reservas gestionadas desde el admin |
| `fechas_bloqueadas` | Fechas no disponibles (calendario) |
| `noticias` | Blog / artículos |
| `mensajes` | Mensajes del formulario de contacto |
| `galeria_fotos` | Fotos de la sección Galería del sitio (subidas desde el admin) |

---

## Mantener activo el proyecto Supabase (plan gratuito)

Supabase puede pausar proyectos free tras períodos largos **sin actividad**. Este repo incluye un workflow de GitHub Actions (`.github/workflows/supabase-keepalive.yml`) que **dos veces al día** llama a la API REST (`cms_textos`) para generar uso real del proyecto.

### Pasos (una sola vez en GitHub)

1. Entra al repositorio en GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Crea estos **repository secrets** (los mismos valores que en `js/config.js`):

   | Nombre del secret | Valor |
   |---|---|
   | `SUPABASE_URL` | Tu Project URL, ej. `https://xxxxx.supabase.co` |
   | `SUPABASE_ANON_KEY` | Tu **anon public** key (el mismo que `SUPABASE_KEY` en `config.js`) |

3. Opcional: **Actions** → workflow **Supabase keep-alive** → **Run workflow** para probar manualmente.

> Los secrets **no** se suben al código; solo GitHub Actions los usa. Sin estos secrets el workflow termina en verde pero **no hace ping** (solo muestra un aviso en los logs).

> La garantía absoluta contra políticas del proveedor es el **plan de pago** en Supabase; este workflow solo reduce el riesgo en free tier.

---

## ⚡ Configurar Supabase Storage (OBLIGATORIO para subir fotos)

El admin ahora sube las fotos directamente a Supabase Storage. Sigue estos pasos **una sola vez**:

1. Ve a tu proyecto en [supabase.com/dashboard](https://supabase.com/dashboard)
2. En el menú lateral haz clic en **Storage**
3. Clic en **New bucket**
4. Nombre: `fotos` (exactamente así, minúsculas)
5. Marca la opción **Public bucket** → clic en **Save**
6. Ya está. Ahora puedes subir fotos desde el admin

> Si el bucket no es público, las imágenes no se verán en el sitio.

---

## SQL adicional — tabla galeria_fotos

Corre esta query en el **SQL Editor** de Supabase (además de la query principal):

```sql
-- Tabla para la galería de fotos del sitio
create table if not exists galeria_fotos (
  id          uuid primary key default gen_random_uuid(),
  imagen_url  text not null,
  titulo      text,
  categoria   text default 'general',
  orden       int default 1,
  activo      boolean default true,
  created_at  timestamptz default now()
);

alter table galeria_fotos enable row level security;

create policy "Public read galeria_fotos"
  on galeria_fotos for select using (true);

create policy "Admin insert galeria_fotos"
  on galeria_fotos for insert with check (true);

create policy "Admin update galeria_fotos"
  on galeria_fotos for update using (true);

create policy "Admin delete galeria_fotos"
  on galeria_fotos for delete using (true);
```

---

## Notas importantes

- **Imágenes**: Se suben directamente desde el admin a Supabase Storage (bucket `fotos`). No se necesita FTP ni hosting externo.
- **Imágenes de Nosotros**: Se editan en Admin → Editor CMS → sección "Nosotros / About".
- **Galería del sitio**: Se gestiona en Admin → Galería (sección independiente con subida de fotos).
- **Seguridad**: Las credenciales del admin están hardcodeadas. Para producción seria, se recomienda implementar autenticación con Supabase Auth.
- **El sitio funciona sin datos**: Si Supabase no responde, el sitio muestra el contenido HTML estático por defecto.
