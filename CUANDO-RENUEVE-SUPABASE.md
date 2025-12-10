# 🔄 Pasos a seguir cuando se renueve Supabase

## Contexto
Actualmente el plan gratuito de Supabase ha excedido el límite de **Egress** (ancho de banda de salida).
Esto impide:
- Ejecutar UPDATE/INSERT en la base de datos
- Aplicar migraciones SQL

## ✅ Cuando se renueve el límite mensual

### PASO 1: Aplicar migración de rating decimal

Ve a Supabase Dashboard → SQL Editor y ejecuta:

```sql
ALTER TABLE reviews 
ALTER COLUMN rating TYPE NUMERIC(3,1);

ALTER TABLE reviews 
DROP CONSTRAINT IF EXISTS reviews_rating_check;

ALTER TABLE reviews 
ADD CONSTRAINT reviews_rating_check CHECK (rating >= 0 AND rating <= 5);
```

### PASO 2: Actualizar la reseña con rating 3.8

```bash
npm run upload-review reviews/the-last-of-us-2.json
```

### PASO 3: Verificar que funciona

1. Abre http://localhost:5173
2. Verifica que se muestre "3.8" 
3. Verifica que haya 3 mandos completos + 1 mando al 80%

---

## 📝 Notas

- La migración SQL está en: `supabase/migrations/20251203182158_change_rating_to_decimal.sql`
- El código ya soporta decimales, solo falta actualizar la BD
- Esto solo necesitas hacerlo UNA VEZ
- Después de esto, todas las reseñas nuevas soportarán decimales automáticamente
