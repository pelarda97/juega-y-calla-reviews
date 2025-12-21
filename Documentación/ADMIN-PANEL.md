# Panel de Administración - Guía Completa

## 🔐 Acceso al Panel

**URL:** `http://localhost:8080/admin/login` (desarrollo) o `https://tudominio.com/admin/login` (producción)

**Contraseña por defecto:** `password` 

⚠️ **IMPORTANTE:** Cambia esta contraseña INMEDIATAMENTE antes del lanzamiento.

---

## 🔑 Cambiar la Contraseña

### Opción 1: Usando PowerShell (Windows)
```powershell
# Reemplaza "TuContraseñaSegura" con tu contraseña real
$password = "TuContraseñaSegura"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($password)
$hasher = [System.Security.Cryptography.SHA256]::Create()
$hash = $hasher.ComputeHash($bytes)
$hashString = [System.BitConverter]::ToString($hash).Replace("-", "").ToLower()
Write-Host "Tu hash SHA-256 es: $hashString"
```

### Opción 2: Usando Node.js
```javascript
// En la consola del navegador (DevTools -> Console)
async function generateHash(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  console.log('Hash SHA-256:', hashHex);
}
generateHash('TuContraseñaSegura');
```

### Opción 3: Usando Online Tool (menos seguro)
1. Ve a: https://emn178.github.io/online-tools/sha256.html
2. Escribe tu contraseña
3. Copia el hash generado (64 caracteres hexadecimales)

### Aplicar el Nuevo Hash
Edita el archivo `.env.local` en la raíz del proyecto:
```
VITE_ADMIN_PASSWORD_HASH=tu_nuevo_hash_aqui
```

⚠️ **Reinicia el servidor** después de cambiar `.env.local`

---

## 🛡️ Características de Seguridad

### Rate Limiting
- **Máximo:** 5 intentos de login fallidos
- **Bloqueo:** 15 minutos automático
- **Delay progresivo:** 1s, 2s, 3s, 4s, 5s entre intentos

### Session Timeout
- **Duración:** 30 minutos de inactividad
- **Tracking:** Detecta movimiento del ratón, teclas, clicks, scroll
- **Check automático:** Cada 60 segundos

### Encriptación
- **Algoritmo:** SHA-256
- **Storage:** Solo hash, nunca contraseña plana
- **Browser API:** crypto.subtle (estándar Web)

---

## 📊 Funcionalidades del Dashboard

### 1. Dashboard Principal
- **Estadísticas generales:** Reseñas, comentarios, likes, dislikes, visitas
- **Actividad reciente:** Últimos eventos en la plataforma
- **Cards métricas:** Visualización rápida de KPIs

### 2. Gestión de Comentarios
- **Lista completa:** Todos los comentarios con filtros
- **Moderación:** Eliminar comentarios inapropiados (requisito RGPD)
- **Filtros:** Por reseña, fecha, usuario
- **Futuro:** Respuestas admin, bloqueo usuarios

### 3. Subir Reseñas
- **Upload JSON:** Validación automática de estructura
- **Preview:** Ver reseña antes de publicar
- **Formato requerido:**
  ```json
  {
    "id": "nombre-juego",
    "title": "Título del Juego",
    "genre": "Acción",
    "platform": "PS5, PC",
    "rating": 9.5,
    "summary": "Resumen corto...",
    "sections": [...],
    "images": [...],
    "pros": [...],
    "cons": [...]
  }
  ```

### 4. Estadísticas Avanzadas
- **Top reseñas:** Por visitas, likes, engagement
- **Tendencias:** Análisis temporal
- **Géneros:** Popularidad por categoría
- **Fuentes:** Origen del tráfico
- **Futuro:** Integración Google Analytics

---

## 🚀 Próximas Mejoras

### Corto Plazo (post-lanzamiento)
- [ ] Funciones CRUD comentarios completas
- [ ] Upload real de archivos JSON
- [ ] Integración Supabase para stats reales
- [ ] Sistema de notificaciones admin

### Medio Plazo
- [ ] Roles y permisos (super-admin, moderador)
- [ ] Panel de analíticas Google Analytics
- [ ] Backup automático de contenido
- [ ] Editor visual de reseñas

### Largo Plazo
- [ ] Multi-idioma (admin panel)
- [ ] API REST para gestión externa
- [ ] Logs de auditoría detallados
- [ ] Dashboard móvil optimizado

---

## 🔧 Solución de Problemas

### No puedo acceder al panel
- Verifica que `.env.local` existe y tiene el hash correcto
- Reinicia el servidor con `npm run dev`
- Limpia localStorage del navegador (DevTools -> Application -> Clear storage)

### Olvidé mi contraseña
1. Genera un nuevo hash (ver sección "Cambiar la Contraseña")
2. Reemplaza el hash en `.env.local`
3. Reinicia el servidor
4. Intenta login con la nueva contraseña

### Bloqueado por rate limiting
- Espera 15 minutos
- O limpia `localStorage` manualmente:
  ```javascript
  localStorage.removeItem('login_attempts');
  ```

### Session expira constantemente
- Verifica que estás moviendo el ratón/usando el teclado
- El timeout es de 30 minutos de **inactividad total**
- Revisa la consola del navegador por errores JavaScript

---

## 📝 Notas de Seguridad

### ✅ Buenas Prácticas Implementadas
- Hash SHA-256 de contraseñas
- Rate limiting anti-brute-force
- Session timeout automático
- Activity tracking
- Storage local (no cookies)
- Delay progresivo
- Variables de entorno

### ⚠️ Consideraciones Producción
- **NUNCA** commitees `.env.local` con contraseña real
- Usa contraseña compleja: 16+ caracteres, mayúsculas, números, símbolos
- Monitorea logs de intentos de acceso
- Configura CSP headers en producción
- Considera 2FA para futuras versiones
- Backup regular de `.env.local` (cifrado)

### 🔒 Legislación Aplicable
- **RGPD (UE):** Derecho al olvido (gestión comentarios obligatoria)
- **LSSI (España):** Datos titular en Aviso Legal
- **Cookies:** LocalStorage NO requiere banner (no son cookies)

---

## 📞 Soporte

Si encuentras bugs o tienes sugerencias:
- **Email:** juegaycalla.reviews@gmail.com
- **GitHub Issues:** (cuando esté el repo público)

---

**Última actualización:** 18 diciembre 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Funcional (auth completa, dashboard básico)
