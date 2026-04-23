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

/* ── Helpers compartidos (no tocar) ── */

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
