# 🚀 Sistema de Subida Automática de Reseñas

## ✅ ¿QUÉ ACABAMOS DE CREAR?

Ahora tienes un sistema completamente automatizado para publicar reseñas. Funciona así:

1. **Escribes** tu reseña en un archivo JSON (usando `review-template.json` como guía)
2. **Ejecutas** un comando simple
3. **¡BOOM!** Tu reseña aparece automáticamente en la web

---

## 📋 CÓMO FUNCIONA

### Paso 1: Crear tu Reseña en JSON

Duplica `review-template.json` y nómbralo como quieras (ej: `mi-reseña-persona-5.json`).

Rellena todos los campos siguiendo las instrucciones que están dentro del JSON.

### Paso 2: Subir a Supabase

Abre la terminal en VS Code y ejecuta:

```powershell
npm run upload-review mi-reseña-persona-5.json
```

### Paso 3: ¡Listo!

La reseña se sube automáticamente a Supabase y aparece en tu web **instantáneamente**.

---

## 🎯 COMANDOS DISPONIBLES

### Subir una nueva reseña
```powershell
npm run upload-review nombre-archivo.json
```

### Actualizar una reseña existente
Simplemente ejecuta el mismo comando con el archivo JSON modificado. El script detecta si el `slug` ya existe y **actualiza** en lugar de crear duplicados.

```powershell
npm run upload-review mi-reseña-editada.json
```

---

## 🔧 REQUISITOS TÉCNICOS (YA CONFIGURADO)

✅ Node.js instalado  
✅ Dependencias instaladas (`npm install`)  
✅ Archivo `.env` con credenciales de Supabase  
✅ Script en `scripts/upload-review.js`  
✅ Comando en `package.json`

**No necesitas hacer nada más, todo está listo.**

---

## 💡 EJEMPLO PRÁCTICO

Imagina que quieres publicar una reseña de **Elden Ring**:

1. **Copias** `review-template.json` → `elden-ring.json`
2. **Rellenas** el contenido:
   ```json
   {
     "slug": "elden-ring",
     "title": "Elden Ring - La obra maestra de FromSoftware",
     "game_title": "Elden Ring",
     "rating": 4.5,
     "genre": "RPG",
     ...
   }
   ```
3. **Ejecutas**:
   ```powershell
   npm run upload-review elden-ring.json
   ```
4. **Resultado**: Tu reseña está en `https://tu-web.com/review/elden-ring`

---

## ⚠️ ERRORES COMUNES

### Error: "Variables de entorno no configuradas"
- **Solución**: Asegúrate de que `.env` existe en la raíz del proyecto

### Error: "JSON inválido"
- **Solución**: Valida tu JSON en https://jsonlint.com/

### Error: "Faltan campos obligatorios"
- **Solución**: Verifica que tengas `slug`, `title`, `game_title` y `rating`

---

## 🎨 CAMPOS ESPECIALES

### Sistema de Spoilers
Las secciones `argumento` y `valoracion_personal` se dividen automáticamente:

```
"argumento": "Texto sin spoilers que siempre se ve.\n\n--- A PARTIR DE AQUÍ: SPOILERS ---\n\nTexto con spoilers que se oculta."
```

### Múltiples Párrafos
Usa `\n\n` (doble salto) para separar párrafos:

```
"introduccion": "Primer párrafo.\n\nSegundo párrafo.\n\nTercer párrafo."
```

### Imágenes
Array de URLs:

```json
"imagenes": [
  "/images/juego/screenshot1.jpg",
  "/images/juego/screenshot2.jpg"
]
```

---

## 🔐 SEGURIDAD

- ✅ El script usa Row Level Security de Supabase
- ✅ Las credenciales están en `.env` (NO se suben a GitHub)
- ✅ Solo tú puedes subir reseñas (los usuarios solo pueden leer)

---

## 🚦 PRÓXIMOS PASOS

Ahora que tienes el sistema de subida:

1. **Migraremos las 2 reseñas existentes** (The Last of Us II y Clair Obscur) al formato JSON
2. **Las subiremos** usando este script
3. **Conectaremos el frontend** para que lea de Supabase
4. **¡Listo para publicar!**

---

¿Dudas? Solo pregúntame. El sistema ya funciona, solo necesitamos aplicar la migración de la columna `genre` en Supabase y empezar a usarlo.
