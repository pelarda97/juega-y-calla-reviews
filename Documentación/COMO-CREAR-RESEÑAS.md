# 📝 Guía para Crear Nuevas Reseñas

## 🎯 Flujo de Trabajo Rápido

### Paso 1: Duplica la Plantilla
1. Abre el archivo `review-template.json`
2. Cópialo y guárdalo como `mi-nueva-reseña.json` (el nombre no importa, es temporal)

### Paso 2: Rellena el Contenido
Edita el JSON con el contenido de tu reseña. Sigue estas reglas:

#### 📌 Campos Obligatorios
- **slug**: Identificador único en minúsculas con guiones (ej: `persona-5-royal`)
- **title**: Título que aparecerá en la web
- **game_title**: Nombre oficial completo del juego
- **rating**: Puntuación de 0 a 5 (acepta decimales: 4.5)
- **genre**: Género principal para filtros

#### 📄 Secciones de Texto
Todas las secciones siguen el mismo formato. Usa `\n\n` para separar párrafos:

```json
"introduccion": "Primer párrafo de la introducción.\n\nSegundo párrafo con más detalles.\n\nTercer párrafo concluyendo."
```

#### ⚠️ Secciones con SPOILERS (IMPORTANTE)
`argumento` y `valoracion_personal` tienen un **sistema especial de botón colapsable**:

**El Separador Mágico:**
```
--- A PARTIR DE AQUÍ: SPOILERS ---
```

**Ejemplo completo:**
```json
"argumento": "Ellie vive en Jackson cinco años después del primer juego. Un evento traumático la empuja a buscar venganza y viaja a Seattle.\n\nLa ciudad está controlada por dos facciones rivales: el WLF y los Seraphites. Ellie debe infiltrarse en este conflicto.\n\n--- A PARTIR DE AQUÍ: SPOILERS ---\n\nAbby, la antagonista, resulta ser la hija de Jerry, el cirujano que Joel mató al final del primer juego. El juego te obliga a jugar como ella durante varias horas.\n\nAl final, Ellie deja ir su venganza pero pierde a Dina y sus dedos en el proceso, quedando incapaz de tocar la guitarra que Joel le enseñó."
```

**Lo que ve el usuario:**

1. **Antes de pulsar el botón:**
   ```
   Ellie vive en Jackson cinco años después...
   La ciudad está controlada por dos facciones...
   
   ⚠️ [BOTÓN: Mostrar spoilers]
   ```

2. **Después de pulsar el botón:**
   ```
   Ellie vive en Jackson cinco años después...
   La ciudad está controlada por dos facciones...
   
   ✅ [CONTENIDO REVELADO]
   Abby, la antagonista, resulta ser...
   Al final, Ellie deja ir su venganza...
   ```

**REGLAS:**
- ✅ El separador DEBE escribirse **EXACTAMENTE** así: `--- A PARTIR DE AQUÍ: SPOILERS ---`
- ✅ TODO lo que esté ANTES se muestra siempre
- ✅ TODO lo que esté DESPUÉS se oculta detrás del botón
- ✅ Si NO incluyes el separador, todo el contenido se muestra sin botón

#### 🖼️ Imágenes
```json
"imagenes": [
  "/images/mi-juego/screenshot1.jpg",
  "/images/mi-juego/screenshot2.jpg",
  "/images/mi-juego/screenshot3.jpg"
]
```

Por ahora usa `/placeholder.svg`. Más adelante te explicaré cómo subir imágenes reales.

### Paso 3: Valida el JSON
Antes de subirlo, asegúrate de que el JSON sea válido:
- Usa un validador online: https://jsonlint.com/
- O instala una extensión de VS Code para JSON

### Paso 4: Sube la Reseña (PRÓXIMAMENTE)
Ejecutarás un comando como:
```bash
npm run upload-review mi-nueva-reseña.json
```

Y la reseña se subirá automáticamente a la base de datos. ¡La web se actualizará sola!

---

## 💡 Consejos de Escritura

### Longitud Recomendada por Sección
- **Introducción**: 2-3 párrafos (100-200 palabras)
- **Argumento**: 3-5 párrafos sin spoilers + 4-6 con spoilers
- **Gameplay**: 4-6 párrafos (300-500 palabras)
- **Funciones**: 3-4 párrafos
- **Duración**: 2-3 párrafos
- **Valoración Personal**: 3-4 párrafos + pros/contras

### Estructura del Argumento
La clave es dividir bien:
- **Parte 1 (sin spoilers)**: Premisa inicial, protagonista, contexto, primeras horas
- **Parte 2 (con spoilers)**: Giros, revelaciones, actos 2 y 3, final

### Ejemplo Real de Separación
```
"argumento": "Horizon Forbidden West nos lleva de vuelta al mundo post-apocalíptico de Aloy. Esta secuela promete expandir el universo con nuevas máquinas y misterios.\n\nLa aventura comienza un año después de los eventos del primer juego...\n\n--- A PARTIR DE AQUÍ: SPOILERS ---\n\nAloy descubre que el sistema GAIA ha sido fragmentado y debe recuperar todas sus subfunciones. Durante su viaje, se revela que..."
```

---

## 🎨 Géneros Disponibles para Filtros

Usa uno de estos géneros exactos (para que los filtros funcionen):
- `RPG`
- `Acción/Aventura`
- `Shooter`
- `Plataformas`
- `Estrategia`
- `Puzzle`
- `Terror`
- `Deportes`
- `Carreras`
- `Lucha`
- `Simulación`
- `Aventura Gráfica`
- `Metroidvania`
- `Roguelike`
- `Battle Royale`
- `MOBA`
- `MMO`

Si tu juego mezcla géneros, elige el más representativo o usa `/` (ej: `Acción/RPG`).

---

## ❓ FAQ

**P: ¿Puedo usar HTML en los textos?**  
R: No, usa texto plano. Los saltos de línea con `\n\n` se convertirán automáticamente en párrafos.

**P: ¿Qué pasa si me equivoco en el slug?**  
R: El slug se convierte en la URL (ej: `tudominio.com/review/mi-slug`). Si lo cambias después, la URL antigua dejará de funcionar.

**P: ¿Puedo editar una reseña ya publicada?**  
R: Sí, solo tienes que volver a ejecutar el script de subida con el mismo slug y se actualizará automáticamente.

**P: ¿Las imágenes tienen que estar en un orden específico?**  
R: No, se mostrarán en el orden del array. La primera suele ser la más representativa.

---

## 🚀 Próximos Pasos

Una vez tengas tu JSON listo:
1. Yo (tu socio técnico) lo revisaré
2. Crearemos el script de subida automática
3. ¡Tu reseña estará live en segundos!

¿Dudas? Pregúntame lo que necesites.
