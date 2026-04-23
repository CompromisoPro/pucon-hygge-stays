/*  ══════════════════════════════════════════════════════════════
    CONFIGURACIÓN DE SUPABASE — Pucon Hygge Stays
    ══════════════════════════════════════════════════════════════
    Instrucciones:
    1. Entra a tu proyecto en https://supabase.com/dashboard
    2. Ve a Settings → API
    3. Copia el "Project URL" y pégalo en SUPABASE_URL
    4. Copia el "anon public" key y pégalo en SUPABASE_KEY
    ══════════════════════════════════════════════════════════════ */

const SUPABASE_URL = 'https://vpoutrwyrtcwsvwhumwz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwb3V0cnd5cnRjd3N2d2h1bXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTg1NDUsImV4cCI6MjA5MjUzNDU0NX0.fO0eDhVcOntA0muHFGNG8K3kwgahRVyBTMv_p7rLvDY';

/* ── Flag de configuración ── */
const SUPABASE_CONFIGURED = !SUPABASE_URL.startsWith('PEGAR_AQUI') && !SUPABASE_KEY.startsWith('PEGAR_AQUI');

if (!SUPABASE_CONFIGURED) {
  console.warn('⚠️ Supabase no configurado. Edita js/config.js con tus credenciales para activar el backend.');
}

/* ── Helpers de API REST ── */
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

/* ── Fetch seguro: devuelve null si Supabase no está configurado ── */
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

/* ── Helper de Storage ── */
async function uploadToStorage(file, folder = 'general') {
  if (!SUPABASE_CONFIGURED) {
    throw new Error('Supabase no está configurado. Edita js/config.js con tus credenciales.');
  }
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error al subir imagen');
  }
  return `${SUPABASE_URL}/storage/v1/object/public/fotos/${filename}`;
}
