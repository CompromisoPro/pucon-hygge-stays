/*  ══════════════════════════════════════════════════════════════
    CONFIGURACIÓN DE SUPABASE — Pucon Hygge Stays
    ══════════════════════════════════════════════════════════════
    Instrucciones:
    1. Entra a tu proyecto en https://supabase.com/dashboard
    2. Ve a Settings → API
    3. Copia el "Project URL" y pégalo en SUPABASE_URL
    4. Copia el "anon public" key y pégalo en SUPABASE_KEY
    ══════════════════════════════════════════════════════════════ */

const SUPABASE_URL = 'PEGAR_AQUI_TU_PROJECT_URL';
const SUPABASE_KEY = 'PEGAR_AQUI_TU_ANON_PUBLIC_KEY';

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

/* ── Helper de Storage ── */
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error al subir imagen');
  }
  return `${SUPABASE_URL}/storage/v1/object/public/fotos/${filename}`;
}
