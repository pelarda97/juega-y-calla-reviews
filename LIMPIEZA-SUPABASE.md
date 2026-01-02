# 🧹 Limpieza y Mantenimiento Supabase

**Fecha:** 2 enero 2026  
**Objetivo:** Reducir consumo de recursos (de 1.6GB a <200MB mensuales)

---

## 📊 Consumo Detectado (Antes de optimización)

- **PostREST Egress:** 562 MB
- **Realtime Egress:** 1.098 GB ⚠️ **CRÍTICO**
- **Database Size:** 168 MB de 500 MB (33%)
- **Realtime Messages:** 40,000

**Problema identificado:** Realtime enviaba reviews COMPLETAS (30KB cada una) en cada update de stats.

---

## ✅ Optimizaciones Aplicadas

### 1. **Reemplazar Realtime por Polling** (Reduce 1GB → 50MB)

**Antes:**
```typescript
// WebSocket abierto 24/7, recibiendo fila completa en cada UPDATE
supabase.channel('review-stats')
  .on('postgres_changes', { table: 'reviews' })
```

**Después:**
```typescript
// Polling cada 30 segundos, solo stats necesarios
setInterval(() => {
  supabase.from('reviews')
    .select('likes_count, dislikes_count, comments_count, views_count')
    .eq('slug', reviewSlug)
}, 30000);
```

**Impacto:** 
- Egress: 1GB → ~50MB (-95%)
- UX: Stats actualizan cada 30s en vez de tiempo real (imperceptible)

---

### 2. **Optimizar SELECT en Reviews/Featured** (Reduce 200MB)

**Antes:**
```sql
SELECT * FROM reviews;  -- Trae TODO (argumento 4KB, gameplay 3KB...)
```

**Después:**
```sql
SELECT slug, title, genre, rating, publish_date, author, image_url, 
       likes_count, views_count, comments_count, 
       argumento, introduccion  -- Solo para excerpt
FROM reviews;
```

**Impacto:**
- De 30KB por review → 8KB por review (-73%)
- Carga página Reviews: 180KB → 50KB

---

### 3. **Limpieza Automática page_views** (Previene crecimiento)

La tabla `page_views` crece infinitamente (cada visita = 1 fila). 

**Ejecutar MANUALMENTE cada mes en Supabase SQL Editor:**

```sql
-- Eliminar visitas más antiguas de 90 días
DELETE FROM page_views 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Ver cuántas filas se eliminarán (ejecutar primero)
SELECT COUNT(*) FROM page_views 
WHERE created_at < NOW() - INTERVAL '90 days';
```

**Programar automáticamente (requiere plan PRO $25/mes):**

```sql
-- Crear función de limpieza
CREATE OR REPLACE FUNCTION cleanup_old_page_views()
RETURNS void AS $$
BEGIN
  DELETE FROM page_views 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Programar con pg_cron (solo plan PRO)
SELECT cron.schedule(
  'cleanup-page-views',
  '0 3 1 * *',  -- Cada día 1 del mes a las 3 AM
  'SELECT cleanup_old_page_views();'
);
```

---

## 📈 Consumo Esperado (Después de optimización)

**Proyección mensual:**
- **PostREST Egress:** ~150 MB (↓ -73%)
- **Realtime Egress:** 0 MB (↓ -100%, deshabilitado)
- **Database Size:** <200 MB (estable con limpieza)
- **Total:** ~150 MB/mes (dentro de 10GB gratuitos)

---

## 🔄 Tareas de Mantenimiento Recomendadas

### **Cada mes:**
1. Ejecutar limpieza de `page_views` (SQL arriba)
2. Revisar consumo en Dashboard → Usage
3. Si Realtime Egress > 0, verificar que polling funciona

### **Cada 3 meses:**
1. Limpiar comentarios spam (si los hay)
2. Verificar tamaño BD: `SELECT pg_size_pretty(pg_database_size('postgres'));`

### **Antes de añadir 50+ reviews:**
Considerar crear índices adicionales:
```sql
-- Para búsquedas por género
CREATE INDEX IF NOT EXISTS idx_reviews_genre ON reviews(genre);

-- Para ordenar por rating
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);
```

---

## 🚨 Alertas de Consumo

**Si ves estos números, actuar inmediatamente:**

| Métrica | Normal | Crítico | Acción |
|---------|--------|---------|--------|
| PostREST Egress | <200 MB/mes | >500 MB/mes | Revisar SELECT *, añadir caché |
| Realtime Egress | 0 MB | >100 MB | Verificar que polling funciona |
| Database Size | <250 MB | >450 MB | Limpiar page_views, revisar logs |
| Realtime Messages | 0 | >5000 | Desactivar Realtime en Supabase |

---

## 💡 Optimizaciones Futuras (Si crece el tráfico)

### **1. Caché del lado cliente (localStorage)**
```typescript
// Cachear lista de reviews 5 minutos
const CACHE_KEY = 'reviews_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 min

const cachedData = localStorage.getItem(CACHE_KEY);
if (cachedData) {
  const { data, timestamp } = JSON.parse(cachedData);
  if (Date.now() - timestamp < CACHE_DURATION) {
    return data; // Usar caché, no hacer query
  }
}
```

### **2. CDN para imágenes**
Actualmente usas IGDB URLs (✅ gratis), pero si subes propias:
- Usar Cloudinary (10GB/mes gratis)
- O Supabase Storage (1GB gratis, luego $0.021/GB)

### **3. Pagination en Reviews**
Si tienes 100+ reviews:
```typescript
const { data } = await supabase
  .from('reviews')
  .select('...')
  .range(0, 19); // Solo primeras 20
```

---

## 📝 Notas

- Plan Free Supabase: 10GB egress/mes (actualmente usas ~150MB = 1.5%)
- Database Size: 500MB máximo (actualmente 168MB = 33%)
- Realtime: Ilimitado pero consume mucho egress → mejor usar polling
- Upgrade a plan PRO ($25/mes) solo si superas límites consistentemente
