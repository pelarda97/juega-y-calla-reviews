# 🔐 Guía de Seguridad - Paso a Paso

Esta guía te explica exactamente cómo proteger tu base de datos para que **solo tú** puedas modificar reseñas, mientras los usuarios pueden comentar y dar likes de forma segura.

---

## 📚 Conceptos Básicos (para entender)

### ¿Qué son las claves de Supabase?

Supabase tiene **2 tipos de claves**:

| Clave | Nombre Técnico | ¿Dónde se usa? | Permisos |
|-------|----------------|----------------|----------|
| **Clave Pública** | `anon key` | Frontend (web pública) | Solo lo que RLS permite |
| **Clave Privada** | `service_role key` | Backend/Scripts (solo tú) | TODO (ignora RLS) |

**Analogía:** 
- **Anon key** = Llave de visitante (solo puede ver y comentar)
- **Service role key** = Llave maestra del admin (puede hacer TODO)

### ¿Qué es RLS (Row Level Security)?

Son **reglas de seguridad** en la base de datos que deciden quién puede:
- Ver datos (SELECT)
- Crear datos (INSERT)
- Modificar datos (UPDATE)  
- Borrar datos (DELETE)

**Ejemplo:**
```
Usuario con anon key intenta:
- Ver reseñas → ✅ Permitido (RLS dice: "SELECT = true")
- Editar reseña → ❌ Bloqueado (RLS dice: "UPDATE = false")

Tú con service key:
- Editar reseña → ✅ Permitido (service key ignora RLS)
```

---

## 🎯 ¿Qué vamos a lograr?

Después de seguir esta guía:

✅ **Reseñas 100% seguras:**
- Solo TÚ puedes crear, editar o borrar reseñas
- Usuarios solo pueden leerlas

✅ **Comentarios controlados:**
- Usuarios pueden escribir comentarios (con validaciones)
- Solo TÚ puedes editar/borrar comentarios (moderación)

✅ **Likes y Views protegidos:**
- Cada IP solo puede dar 1 like (conteo real)
- Nadie puede modificar ni borrar likes
- Nadie puede manipular el conteo de visitas

---

## 📝 PASO 1: Obtener tu Service Role Key

### 1.1. Ve a Supabase Dashboard

1. Abre https://supabase.com/dashboard
2. Selecciona tu proyecto "Juega Y Calla"
3. Ve a **Settings** (⚙️ en la barra lateral)
4. Haz clic en **API**

### 1.2. Copia la Service Role Key

Verás una tabla con tus claves:

```
Project URL:
https://your-project-id.supabase.co

anon/public key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (clave pública - visible en frontend)
└─ Esta ya la tienes en .env.local

service_role key: [Show]  ← HAZ CLIC EN "SHOW"
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (MUY larga - PRIVADA)
└─ ⚠️ ESTA ES LA QUE NECESITAS
```

**⚠️ ADVERTENCIA CRÍTICA:**
- Esta clave es **PRIVADA** como una contraseña
- **NUNCA** la subas a GitHub
- **NUNCA** la pongas en el código del frontend
- **SOLO** úsala en tu archivo `.env.local` (que está en .gitignore)

### 1.3. Copia la clave completa

Haz clic en **Show** → Selecciona TODO el texto → Ctrl+C

La clave es MUY larga, algo como:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IllPVVJfUFJPSkVDVF9JRCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MDU2Nzg4MDAsImV4cCI6MjAyMTI1NDgwMH0.YOUR_SECRET_HERE_VERY_LONG_STRING
```

---

## 📝 PASO 2: Configurar Variables de Entorno

### 2.1. Abre el archivo .env.local

En tu proyecto, abre el archivo `.env.local` (está en la raíz del proyecto).

**Si NO existe**, créalo:
1. Botón derecho en la carpeta raíz → Nuevo archivo
2. Nombre: `.env.local`

### 2.2. Añade la Service Role Key

Tu archivo `.env.local` debe tener estas 3 líneas:

```bash
# URL de tu proyecto Supabase
VITE_SUPABASE_URL=https://nfqlspoluvzvcjkcxsoq.supabase.co

# Clave pública (ya la tienes, para el frontend)
VITE_SUPABASE_ANON_KEY=eyJhbGc... (tu clave anon)

# ⚠️ NUEVA - Clave privada admin (solo para scripts)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUz... (pega aquí la service_role key que copiaste)
```

**Ejemplo completo:**
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 2.3. Guarda el archivo

Ctrl+S para guardar.

### 2.4. Verifica .gitignore

Abre el archivo `.gitignore` y verifica que contenga:

```
.env
.env.local
.env*.local
```

✅ Si está ahí → Perfecto, tu service key NUNCA se subirá a GitHub  
❌ Si NO está → Añade esas líneas y guarda

---

## 📝 PASO 3: Aplicar Políticas de Seguridad

### 3.1. Ve a Supabase Dashboard → SQL Editor

1. Abre https://supabase.com/dashboard
2. Tu proyecto "Juega Y Calla"
3. Haz clic en **SQL Editor** (ícono </> en la barra lateral)

### 3.2. Crear nueva query

1. Haz clic en **+ New query**
2. Dale nombre: "Políticas RLS Seguras"

### 3.3. Pega el código SQL

Abre el archivo que acabamos de crear:
```
supabase/migrations/20260110000000_secure_rls_policies.sql
```

1. Selecciona TODO el contenido (Ctrl+A)
2. Copia (Ctrl+C)
3. Pega en el SQL Editor de Supabase (Ctrl+V)

### 3.4. Ejecutar la migración

1. Haz clic en el botón **Run** (abajo a la derecha)
2. Espera a que aparezca: ✅ "Success. No rows returned"
3. Verás mensajes como:
   ```
   NOTICE: Políticas RLS seguras aplicadas correctamente
   NOTICE: Reviews: Solo modificables con service_role key
   NOTICE: Comments: Crear anónimo, editar/borrar solo admin
   NOTICE: Likes: Un voto por IP, no modificables
   NOTICE: Page Views: Solo inserción, conteo protegido
   ```

✅ **¡Listo!** Las políticas de seguridad están activadas.

---

## 📝 PASO 4: Verificar que Funciona

### 4.1. Probar que no puedes editar desde el frontend

Abre la consola del navegador (F12) en tu web y pega:

```javascript
// Intentar editar una reseña (debería FALLAR)
const { data, error } = await supabase
  .from('reviews')
  .update({ title: 'HACKEADO' })
  .eq('slug', 'clair-obscur-expedition-33');

console.log(error);
// Debería mostrar: "new row violates row-level security policy"
```

✅ **Si sale error** → Perfecto, está protegido  
❌ **Si funciona** → Algo salió mal, vuelve al PASO 3

### 4.2. Probar subir reseña con tu script (debería FUNCIONAR)

En PowerShell, ejecuta:

```bash
cd scripts
node upload-review.js ../reviews/clair-obscur-expedition-33.json
```

Deberías ver:
```
📂 Leyendo archivo: ...
✅ JSON válido
⚠️  Ya existe una reseña con este slug
📝 Actualizando reseña existente...
✅ Reseña actualizada exitosamente
```

✅ **Si funciona** → Perfecto, tu service key tiene permisos admin  
❌ **Si da error** → Verifica que copiaste bien la service key en .env.local

---

## 🎯 Resultado Final

### ✅ Lo que FUNCIONA ahora:

**Usuarios en la web (con anon key):**
- ✅ Ver todas las reseñas
- ✅ Leer todos los comentarios
- ✅ Escribir nuevos comentarios (validados: 10-5000 caracteres)
- ✅ Dar like/dislike (1 voto por IP)
- ✅ Registrar visitas a páginas
- ❌ Editar o borrar reseñas (bloqueado)
- ❌ Editar o borrar comentarios (bloqueado)
- ❌ Cambiar votos de likes (bloqueado)
- ❌ Manipular conteo de visitas (bloqueado)

**Tú con el script (service key):**
- ✅ Crear nuevas reseñas
- ✅ Editar reseñas existentes
- ✅ Borrar reseñas
- ✅ Moderar comentarios (editar/borrar)
- ✅ Ver todas las estadísticas
- ✅ TODO sin restricciones

---

## 🚀 Uso Diario

### Para subir una nueva reseña:

```bash
cd scripts
node upload-review.js hogwarts-legacy.json
```

El script usa automáticamente tu service key de `.env.local`.

### Para moderar comentarios (futuro):

Cuando quieras borrar un comentario spam:

```javascript
// Crear un script moderar-comentarios.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Borrar comentario por ID
const { error } = await supabase
  .from('comments')
  .delete()
  .eq('id', 123);

console.log('Comentario eliminado');
```

---

## ⚠️ Recordatorios de Seguridad

### ✅ Haz SIEMPRE:

1. Mantén `.env.local` en `.gitignore`
2. NUNCA subas `.env.local` a GitHub
3. NUNCA compartas tu service_role key
4. Usa service key SOLO en scripts locales

### ❌ NUNCA hagas:

1. ❌ Poner service key en el código del frontend
2. ❌ Exponerla en variables de Vercel/Netlify
3. ❌ Compartirla en Discord/Slack/etc
4. ❌ Subirla a GitHub (aunque sea privado)

### 🔄 Si crees que tu service key se filtró:

1. Ve a Supabase Dashboard → Settings → API
2. Haz clic en "Reset service_role key"
3. Copia la nueva clave
4. Actualiza `.env.local`
5. ✅ Problema resuelto

---

## 📊 ¿Cómo saber si está funcionando?

### Indicadores de seguridad funcionando:

✅ **En Supabase Dashboard → Logs:**
- Ya NO deberías ver alertas "RLS Policy Always True"
- Logs nuevos: "RLS Policy Violation" cuando alguien intenta modificar sin permisos

✅ **En tu web:**
- Usuarios pueden comentar
- Usuarios NO pueden editar nada crítico
- Likes se registran correctamente
- Conteo de visitas funciona

✅ **En tu script:**
- `upload-review.js` sube reseñas sin problemas
- Ves mensaje de éxito

---

## 🆘 Solución de Problemas

### Problema: "Service Role Key no configurada"

**Causa:** No has añadido la key a `.env.local`  
**Solución:** Vuelve al PASO 2

### Problema: "new row violates row-level security policy" al subir reseña

**Causa:** El script está usando anon key en lugar de service key  
**Solución:** 
1. Verifica `.env.local` tiene `SUPABASE_SERVICE_ROLE_KEY`
2. La clave debe empezar con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...`
3. Debe ser la clave LARGA (service_role), no la corta (anon)

### Problema: Siguen saltando alertas RLS en Supabase

**Causa:** No aplicaste la migración SQL  
**Solución:** Vuelve al PASO 3 y ejecuta el SQL en Supabase Dashboard

---

## ✅ Checklist Final

Antes de continuar, verifica:

- [ ] Service Role Key copiada de Supabase Dashboard
- [ ] `.env.local` tiene la variable `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `.env.local` está en `.gitignore`
- [ ] Migración SQL ejecutada en Supabase (PASO 3)
- [ ] Script `upload-review.js` actualizado (automático)
- [ ] Probado: frontend NO puede editar reseñas
- [ ] Probado: script SÍ puede subir reseñas
- [ ] Ya NO hay alertas RLS en Supabase Dashboard

✅ **Si todo está marcado → ¡Tu base de datos está protegida!**

---

**Última actualización:** 10 Enero 2026  
**Archivos modificados:**
- `supabase/migrations/20260110000000_secure_rls_policies.sql` (nuevo)
- `scripts/upload-review.js` (actualizado para usar service key)
- `src/lib/supabaseAdmin.ts` (corregido)
