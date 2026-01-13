# 🎮 Juega Y Calla - Reseñas de Videojuegos

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

> 🌐 **[Ver Demo en Vivo](https://juega-y-calla.vercel.app)** | 📖 [Documentación](./Documentación/)

Plataforma web moderna para reseñas honestas de videojuegos. Análisis completos con sistema de ratings intuitivo, filtros por género, comentarios en tiempo real y arquitectura escalable.

---

## ✨ Características Principales

- 🎯 **Sistema de ratings decimales** con iconos gamepad animados
- 🎮 **Filtros por género** (RPG, Acción, Aventura, etc.)
- 💬 **Sistema de comentarios en tiempo real** con Supabase Realtime
- 👍 **Sistema de likes/dislikes** por review
- 📊 **Analytics integrados** con page views tracking
- 🔒 **Row Level Security (RLS)** para protección de datos
- 🚀 **CI/CD automatizado** con Vercel + GitHub
- 📱 **Responsive design** optimizado para móviles
- ⚡ **Rendimiento optimizado** con lazy loading y code splitting
- 🔐 **Autenticación segura** con service role keys

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **React 18.3.1** - Biblioteca UI con hooks
- **TypeScript 5.5.3** - Tipado estático y seguridad
- **Vite 5.4.1** - Build tool ultrarrápido
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - Componentes UI reutilizables
- **React Router 6.26.2** - Navegación SPA

### **Backend**
- **Supabase PostgreSQL** - Base de datos relacional
- **Supabase Realtime** - Actualizaciones en tiempo real
- **Row Level Security** - Políticas de seguridad a nivel de fila
- **Node.js** - Scripts de gestión (upload-review.js)

### **DevOps & Tools**
- **Vercel** - Hosting y CI/CD
- **Git/GitHub** - Control de versiones
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento CSS

---

## 🚀 Inicio Rápido

### **Prerrequisitos**
- Node.js 18+ o Bun
- Cuenta Supabase (para backend)
- Git

### **Instalación**

```bash
# 1. Clonar el repositorio
git clone https://github.com/pelarda97/juega-y-calla-reviews.git
cd juega-y-calla-reviews

# 2. Instalar dependencias
npm install
# o con Bun (más rápido)
bun install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales Supabase

# 4. Iniciar servidor de desarrollo
npm run dev
# o
bun dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## ⚙️ Configuración

### **Variables de Entorno**

Crear archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Scripts (solo local)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**⚠️ IMPORTANTE:** 
- El archivo `.env.local` está en `.gitignore` y nunca debe committearse
- La `ANON_KEY` es pública (usada en frontend)
- La `SERVICE_ROLE_KEY` es privada (solo para scripts admin locales)

### **Modo Desarrollo Sin Backend**

Para desarrollo local sin conexión a Supabase, editar `src/data/mockReviews.ts`:

```typescript
export const USE_MOCK_DATA = true; // Activar mock data
```

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo (puerto 5173)
npm run build            # Compilar para producción
npm run preview          # Previsualizar build de producción
npm run lint             # Ejecutar ESLint

# Gestión de Reseñas (Admin)
npm run upload-review <archivo.json>   # Subir reseña a Supabase
```

### **Ejemplo: Subir Reseña**

```bash
npm run upload-review reviews/the-last-of-us-2.json
```

---

## 📁 Estructura del Proyecto

```
juega-y-calla-reviews/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes React reutilizables
│   │   └── ui/         # Componentes shadcn/ui
│   ├── pages/          # Páginas principales (routing)
│   ├── integrations/   # Integraciones externas (Supabase)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilidades y helpers
│   └── data/           # Mock data para desarrollo
├── reviews/            # Reseñas en formato JSON
├── scripts/            # Scripts Node.js (admin)
├── supabase/           # Migraciones SQL y configuración
│   └── migrations/     # Migraciones de base de datos
└── Documentación/      # Documentación técnica del proyecto
```

---

## 🗄️ Estructura de Reseñas (JSON)

Las reseñas se almacenan en formato JSON en `/reviews`:

```json
{
  "title": "The Last of Us Part II",
  "slug": "the-last-of-us-2",
  "genre": "Acción-Aventura",
  "platform": "PlayStation 5",
  "developer": "Naughty Dog",
  "publisher": "Sony Interactive Entertainment",
  "rating": 4.8,
  "author": "Juega y Calla",
  "author_name": "Manel",
  "summary": "Descripción breve de la reseña (150-200 caracteres)",
  "sections": [
    {
      "title": "Introducción",
      "content": "<p>Contenido HTML con formato</p>",
      "spoiler": false,
      "order": 1
    },
    {
      "title": "Spoilers",
      "content": "<p>Sección con spoilers colapsable</p>",
      "spoiler": true,
      "order": 2
    }
  ],
  "images": [
    "https://url-imagen-principal.jpg",
    "https://url-screenshot-1.jpg"
  ],
  "tags": ["narrativa", "emocional", "acción"],
  "published_at": "2025-01-10T12:00:00Z"
}
```

---

## 🔐 Seguridad

Este proyecto implementa múltiples capas de seguridad:

### **Row Level Security (RLS)**
- ✅ Políticas restrictivas en todas las tablas
- ✅ Lectura pública, escritura solo admin
- ✅ Protección contra modificaciones no autorizadas

### **Variables de Entorno**
- ✅ Keys nunca hardcodeadas en código fuente
- ✅ `.env.local` ignorado por Git
- ✅ Service role key solo en entorno local

### **Migraciones SQL**
Ver `/supabase/migrations/` para políticas de seguridad aplicadas.

Más detalles en [`Documentación/GUIA-SEGURIDAD.md`](./Documentación/GUIA-SEGURIDAD.md)

---

## 🚀 Deployment

### **Vercel (Recomendado)**

1. **Conectar repositorio:**
   - Ve a [vercel.com](https://vercel.com)
   - Import Git Repository
   - Selecciona este repositorio

2. **Configurar variables de entorno:**
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   ```

3. **Deploy automático:**
   - Cada push a `main` dispara deploy automático
   - Preview deployments para branches

### **Build Manual**

```bash
npm run build
# Archivos generados en /dist
```

---

## 📊 Características Técnicas

- **17,555 líneas de código** (sin dependencias)
  - TypeScript/TSX: 9,758 líneas (55.6%)
  - JSON: 7,398 líneas (42.2%)
  - Otros: 399 líneas (2.3%)

- **Arquitectura escalable** con separación de concerns
- **Componentización modular** con React
- **Tipado fuerte** con TypeScript
- **Real-time updates** con Supabase Realtime
- **Optimización SEO** con meta tags dinámicos

---

## 🗺️ Roadmap

### **Completado ✅**
- [x] Sistema de ratings decimales con iconos gamepad
- [x] Filtros por género de videojuegos
- [x] Secciones con spoilers colapsables
- [x] Sistema de comentarios en tiempo real
- [x] Sistema de likes/dislikes por review
- [x] Analytics con page views tracking
- [x] Row Level Security policies
- [x] CI/CD automatizado con Vercel
- [x] Responsive design mobile-first

### **En Desarrollo 🔄**
- [ ] Panel admin para gestión de reseñas
- [ ] Sistema de búsqueda full-text
- [ ] Filtros avanzados (plataforma, año, desarrollador)

### **Futuro 📅**
- [ ] Autenticación de usuarios
- [ ] Perfiles de usuario personalizados
- [ ] Sistema de favoritos
- [ ] Notificaciones de nuevas reseñas

---

## 🤝 Contribuciones

Este es un proyecto personal de portfolio, pero las sugerencias son bienvenidas:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👤 Autor

**Manel Pelarda**

- 🌐 Portfolio: [juega-y-calla.vercel.app](https://juega-y-calla.vercel.app)
- 💼 LinkedIn: [linkedin.com/in/tu-perfil](https://linkedin.com/in/tu-perfil)
- 🐙 GitHub: [@pelarda97](https://github.com/pelarda97)

---

## 🙏 Agradecimientos

- [Supabase](https://supabase.com/) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Lucide Icons](https://lucide.dev/) - Iconos
- [Vercel](https://vercel.com/) - Hosting y deployment

---

⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub
