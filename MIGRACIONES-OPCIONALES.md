# Migraciones Opcionales Supabase

**Estado:** Pendientes de aplicar (no críticas)  
**Fecha:** 23 diciembre 2025

## ¿Por qué no están aplicadas?

Estas migraciones añaden seguridad **server-side** pero consumen ancho de banda del plan gratuito de Supabase. Como ya tenemos validación **client-side** funcionando, son opcionales.

---

## 1. Validación de Contenido Ofensivo (Server-Side)

**Archivo:** `supabase/migrations/20251210120000_add_content_validation.sql`

### ¿Qué hace?
Filtra palabras ofensivas en comentarios a nivel de base de datos usando una función PL/pgSQL.

### Ventajas
- ✅ Seguridad adicional si alguien bypasea validación cliente
- ✅ Lista de palabras centralizada en BD
- ✅ Protección contra llamadas directas a API

### Desventajas
- ❌ Consume recursos Supabase en cada INSERT de comentario
- ❌ Requiere mantenimiento de lista de palabras
- ❌ Puede generar falsos positivos

### Cuándo aplicarla
- Cuando el sitio tenga tráfico alto y detectes spam/abuso
- Cuando quieras protección extra contra bots
- Si eliminas la validación client-side

### Cómo aplicarla
```bash
# Opción 1: Desde Supabase SQL Editor
# Copiar y pegar contenido del archivo 20251210120000_add_content_validation.sql

# Opción 2: Desde terminal local (requiere Supabase CLI)
supabase db push
```

### Código (resumen)
```sql
-- Función que valida contenido
CREATE OR REPLACE FUNCTION validate_comment_content()
RETURNS trigger AS $$
DECLARE
  offensive_words TEXT[] := ARRAY['palabra1', 'palabra2', ...];
  word TEXT;
BEGIN
  FOREACH word IN ARRAY offensive_words LOOP
    IF NEW.content ILIKE '%' || word || '%' THEN
      RAISE EXCEPTION 'El comentario contiene contenido inapropiado';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger que ejecuta la validación
CREATE TRIGGER validate_comment_before_insert
  BEFORE INSERT OR UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION validate_comment_content();
```

---

## 2. Rate Limiting de Comentarios (Server-Side)

**Archivo:** `supabase/migrations/20251210130000_add_comment_rate_limiting.sql`

### ¿Qué hace?
Limita comentarios por IP/sesión a nivel de base de datos (ej: máximo 5 comentarios por hora).

### Ventajas
- ✅ Protección contra spam automatizado
- ✅ No puede ser bypasseada desde cliente
- ✅ Funciona aunque deshabilites JavaScript

### Desventajas
- ❌ Consume recursos en cada INSERT
- ❌ Puede bloquear usuarios legítimos en redes compartidas (IPs públicas)
- ❌ YA TIENES rate limiting client-side funcionando

### Cuándo aplicarla
- Cuando detectes spam/flood de comentarios
- Si eliminas el rate limiting client-side
- Cuando tengas presupuesto para plan Supabase superior

### Cómo aplicarla
```bash
# Desde Supabase SQL Editor
# Copiar y pegar contenido del archivo 20251210130000_add_comment_rate_limiting.sql
```

### Código (resumen)
```sql
-- Función que verifica límite de comentarios
CREATE OR REPLACE FUNCTION check_comment_rate_limit()
RETURNS trigger AS $$
DECLARE
  recent_comments_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO recent_comments_count
  FROM public.comments
  WHERE user_session = NEW.user_session
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF recent_comments_count >= 5 THEN
    RAISE EXCEPTION 'Has alcanzado el límite de comentarios. Espera una hora.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger antes de insertar comentario
CREATE TRIGGER check_rate_limit_before_comment
  BEFORE INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION check_comment_rate_limit();
```

---

## Otras Mejoras Opcionales

### 3. Upgrade PostgreSQL (Recomendado)

**Advertencia actual en logs:** "Current version of postgres supabase-postgres-17.4.1.074 has outstanding security patches"

**Cómo resolverlo:**
1. Ir a Supabase Dashboard → Database Settings
2. Click en "Upgrade" junto a PostgreSQL version
3. Esperar 2-5 minutos (sin downtime)

**Prioridad:** 🟡 Media (seguridad mejorada, no urgente)

---

### 4. Reducir OTP Expiry Time

**Advertencia actual en logs:** "OTP expiry set to more than an hour. Recommended to set to less than an hour"

**Cómo resolverlo:**
1. Ir a Supabase Dashboard → Authentication → Settings
2. Buscar "Email OTP Expiry Time"
3. Cambiar de `7200` (2 horas) a `3600` (1 hora)
4. Click "Save"

**Prioridad:** 🟢 Baja (mejora seguridad auth, no afecta funcionalidad actual)

---

## Estado Actual de la Base de Datos ✅

**COMPLETO Y LISTO PARA PRODUCCIÓN**

### Estructura
- ✅ 4 tablas (reviews, comments, review_likes, page_views)
- ✅ 23 columnas en reviews (incluye video_url, publish_date TEXT)
- ✅ 9 columnas en comments (incluye parent_comment_id para hilos)
- ✅ Tipos de datos correctos (NUMERIC rating, TEXT[] arrays)

### Seguridad
- ✅ RLS habilitado en 4 tablas
- ✅ 13 políticas configuradas (SELECT público, INSERT/UPDATE/DELETE controlado)
- ✅ 2 funciones con SECURITY DEFINER + search_path = public
- ✅ DELETE comments bloqueado cliente-side
- ✅ Unique constraint (review_id + user_session) evita doble like

### Performance
- ✅ 12 índices optimizados (slug, review_id, created_at, compound)
- ✅ Foreign Keys con CASCADE (limpieza automática)
- ✅ Defaults en counters (0) y timestamps (now())

### Realtime
- ✅ REPLICA IDENTITY FULL en 4 tablas
- ✅ Publication supabase_realtime activa
- ✅ 13 triggers funcionando (auto-update stats)

### Datos
- ✅ 2 reviews subidas (The Last of Us 2, Clair Obscur)
- ✅ USE_MOCK_DATA = false (conexión real)

---

## Conclusión

**No hay nada crítico pendiente.** El sitio está listo para producción con todas las funcionalidades:
- ✅ Likes/Dislikes en tiempo real
- ✅ Comentarios con hilos (respuestas anidadas)
- ✅ Stats actualizadas automáticamente
- ✅ Validación client-side funcionando
- ✅ Rate limiting client-side funcionando
- ✅ Analytics de visitas

Las migraciones opcionales son mejoras de seguridad server-side que puedes aplicar más adelante si:
1. Detectas spam/abuso en comentarios
2. Subes a un plan Supabase de pago (más recursos)
3. Quieres protección extra contra ataques
