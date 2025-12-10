# Juega Y Calla - Reseñas de Videojuegos

Plataforma web para reseñas honestas de videojuegos. Análisis completos con sistema de ratings, categorías por género, y gestión de comentarios.

## Stack Tecnológico

- **Frontend**: React 18.3.1 + TypeScript 5.5.3
- **Build Tool**: Vite 5.4.1
- **UI**: Tailwind CSS + shadcn/ui
- **Routing**: React Router 6.26.2
- **Backend**: Supabase PostgreSQL
- **Deployment**: Vercel (recomendado)

## Desarrollo Local

```sh
# Clonar el repositorio
git clone <YOUR_GIT_URL>

# Navegar al directorio
cd juega-y-calla

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Modo Mock Data

Para desarrollo local sin conexión a Supabase, editar `src/data/mockReviews.ts`:

```typescript
export const USE_MOCK_DATA = true; // Modo desarrollo local
```

Cambiar a `false` para producción con Supabase.

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run preview` - Previsualizar build de producción
- `npm run upload-review <archivo.json>` - Subir reseña a Supabase

## Estructura de Reseñas

Las reseñas se almacenan en formato JSON en `/reviews`:

```json
{
  "title": "Nombre del Juego",
  "slug": "nombre-del-juego",
  "genre": "Género",
  "rating": 4.5,
  "sections": [
    {
      "title": "Sección",
      "content": "Contenido HTML permitido",
      "order": 1
    }
  ],
  "images": ["https://url-imagen.jpg"]
}
```

## Variables de Entorno

Crear archivo `.env` con:

```
VITE_SUPABASE_URL=tu-url-supabase
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

## Deployment

### Vercel (Recomendado)

1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Configurar variables de entorno Supabase
3. Deploy automático con cada push a main

### Build Manual

```sh
npm run build
# Archivos generados en /dist
```

## Roadmap

- ✅ Sistema de ratings decimales con iconos de gamepad
- ✅ Filtros por género
- ✅ Secciones con spoilers colapsables
- ✅ Modo mock data para desarrollo local
- 🔄 Sistema de comentarios (UI pendiente)
- 📅 Lanzamiento: Diciembre 23, 2025
