/**
 * Supabase Admin Client
 * 
 * Este cliente usa la Service Role Key para operaciones administrativas
 * que requieren permisos elevados (como eliminar comentarios).
 * 
 * ⚠️ IMPORTANTE: Este cliente ignora las políticas RLS (Row Level Security)
 * Solo debe usarse en contextos seguros donde el usuario esté autenticado como admin.
 * 
 * NUNCA expongas la Service Role Key públicamente.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nfqlspoluvzvcjkcxsoq.supabase.co";

// ⚠️ NOTA: Esta variable SOLO se usa en scripts Node.js (upload-review.js)
// NO se debe usar en el frontend porque expondría la clave privada
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verificar que la Service Role Key esté configurada (solo en Node.js)
if (!supabaseServiceKey && typeof process !== 'undefined') {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY no está configurada en .env.local');
  console.error('💡 Sigue la guía GUIA-SEGURIDAD.md para configurarla');
  throw new Error('Service Role Key no configurada. Verifica .env.local');
}

// Cliente admin con permisos elevados
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Helper para verificar que estamos en un contexto admin
 * Esto es una capa adicional de seguridad
 */
export const isAdminContext = (): boolean => {
  // Verifica que la Service Role Key esté disponible
  return !!supabaseServiceKey;
};
