# 🔧 SOLUCIÓN RÁPIDA - Habilitar Eliminación de Comentarios

## Problema Actual
El botón de eliminar comentarios no funciona porque **Supabase tiene Row Level Security (RLS) que bloquea las eliminaciones**.

## ✅ SOLUCIÓN (5 minutos)

### Opción 1: Deshabilitar RLS Temporalmente (SOLO DESARROLLO)

**⚠️ ADVERTENCIA**: Esto NO es seguro para producción, pero funciona para testing.

1. Ve a **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Database** → **Tables** → Busca la tabla `comments`
4. Click en los 3 puntos `⋮` al lado de `comments`
5. Click en **Edit table**
6. **DESMARCA** la casilla "Enable Row Level Security (RLS)"
7. Click en **Save**

Ahora podrás eliminar comentarios desde el panel admin.

---

### Opción 2: Configurar Políticas RLS Correctamente (RECOMENDADO)

**✅ VENTAJA**: Seguro para producción.

#### Paso 1: Habilitar RLS (si no está habilitado)
```sql
-- Ejecutar en SQL Editor de Supabase
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
```

#### Paso 2: Crear Política de Eliminación para Todos

**⚠️ TEMPORAL - Para desarrollo**:
```sql
-- Política: Permitir eliminar a cualquiera (SOLO DESARROLLO)
CREATE POLICY "Permitir eliminación temporal"
ON comments
FOR DELETE
USING (true);
```

**✅ PRODUCCIÓN - Usando Service Role**:

Para producción, necesitas usar la **Service Role Key** que tiene permisos completos.

1. En tu archivo `.env.local`, añade:
```
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJ...tu_service_role_key_aqui
```

2. Ve a Supabase Dashboard → Settings → API
3. Copia la **Service Role Key** (secret, NO la anon key)
4. Pégala en `.env.local`

5. Crea un nuevo archivo `src/lib/supabaseAdmin.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

6. En `AdminDashboard.tsx`, cambia:
```typescript
// ANTES:
import { supabase } from '@/integrations/supabase/client';

// DESPUÉS:
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Y en la función deleteComment:
const { data, error } = await supabaseAdmin  // Usa supabaseAdmin
  .from('comments')
  .delete()
  .eq('id', commentId)
  .select();
```

7. Crea política RLS que SOLO permite Service Role:
```sql
-- Política: SOLO Service Role puede eliminar
CREATE POLICY "Solo admin puede eliminar"
ON comments
FOR DELETE
USING (false);  -- Bloquea a todos los clientes normales
-- Service Role ignora RLS automáticamente
```

---

## 🚀 Solución Rápida para Testing (1 minuto)

**Ejecuta esto en SQL Editor de Supabase**:

```sql
-- 1. Habilitar RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 2. Permitir eliminación a todos (TEMPORAL)
CREATE POLICY "temp_delete_all"
ON comments
FOR DELETE
USING (true);

-- 3. Verificar
SELECT * FROM pg_policies WHERE tablename = 'comments';
```

Después prueba eliminar un comentario desde el panel admin.

---

## 🔍 Verificar si Funciona

1. Abre el panel admin: http://localhost:8080/admin/login
2. Ve a la pestaña "Comentarios"
3. Si hay comentarios, haz click en el icono de basura 🗑️
4. Abre la **Consola del Navegador** (F12 → Console)
5. Busca mensajes:
   - ✅ `"Comentario eliminado correctamente"` → **FUNCIONA**
   - ❌ `"Error de permisos"` o `"PGRST301"` → **Problema RLS**

---

## 📝 IMPORTANTE para Producción

Antes del lanzamiento (30 dic):
- [ ] Cambiar política temporal por Service Role Key
- [ ] NUNCA exponer Service Role Key en frontend público
- [ ] Verificar que `.env.local` está en `.gitignore`
- [ ] Hacer backup de base de datos

---

**Última actualización**: 19 de diciembre de 2025  
**Problema reportado**: Botón eliminar no funciona  
**Causa**: RLS bloquea eliminaciones  
**Solución**: Configurar políticas RLS o usar Service Role Key
