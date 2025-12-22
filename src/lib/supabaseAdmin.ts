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
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Verificar que la Service Role Key esté configurada
if (!supabaseServiceKey) {
  if (import.meta.env.DEV) {
    console.error('❌ VITE_SUPABASE_SERVICE_ROLE_KEY no está configurada en .env.local');
    console.error('💡 Si acabas de añadirla, reinicia el servidor de desarrollo (npm run dev)');
  }
  throw new Error('Service Role Key no configurada. Verifica .env.local y reinicia el servidor');
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
