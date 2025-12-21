# 🛡️ Guía de Seguridad - Panel de Administración

## Fecha: 18 de diciembre de 2025

Esta guía detalla todas las medidas de seguridad que debes implementar ANTES del lanzamiento en producción para proteger tu panel de administración.

---

## ✅ MEDIDAS YA IMPLEMENTADAS

### 1. Autenticación Segura
- ✅ **SHA-256 Hashing**: Las contraseñas nunca se almacenan en texto plano
- ✅ **Rate Limiting**: Máximo 5 intentos de login fallidos
- ✅ **Lockout Automático**: 15 minutos de bloqueo tras 5 intentos
- ✅ **Delay Progresivo**: 1s, 2s, 3s, 4s, 5s entre intentos (anti-brute-force)
- ✅ **Session Timeout**: 30 minutos de inactividad máxima
- ✅ **Activity Tracking**: Detecta movimiento del ratón, teclas, clicks, scroll

### 2. Almacenamiento Seguro
- ✅ **Variables de entorno**: Contraseña en `.env.local` (NO en código)
- ✅ **LocalStorage**: Datos de sesión solo en cliente
- ✅ **Gitignore**: `.env.local` excluido del repositorio

### 3. Gestión de Comentarios
- ✅ **Requisito RGPD**: Función eliminar comentarios (derecho al olvido)
- ✅ **Confirmación**: Diálogo antes de eliminar
- ✅ **Filtros**: Por reseña específica para gestión eficiente

---

## ⚠️ ACCIONES INMEDIATAS (Antes de Producción)

### 1. Cambiar Contraseña Default ⏰ URGENTE
**Estado Actual**: Contraseña ya cambiada ✅

**Verificación**:
- La contraseña "password" ya NO funciona
- Hash actual en `.env.local`: `e950ef1798c1425ead54cf31c44d62837ded6b28429966690af46e94abd24a4c`
- **NUNCA** compartas este hash públicamente

**Recomendaciones Adicionales**:
- Guarda tu contraseña en un gestor de contraseñas (LastPass, 1Password, Bitwarden)
- NO la escribas en papel o archivos de texto plano
- Usa mínimo 16 caracteres con mayúsculas, números y símbolos
- NO uses palabras del diccionario o datos personales (fechas, nombres)

---

### 2. Proteger Variables de Entorno ⏰ CRÍTICO

**Archivo**: `.env.local`

**Verificar Ahora**:
```powershell
# Verifica que .env.local esté en .gitignore
Get-Content .gitignore | Select-String "env.local"
```

**Si NO aparece**, añádelo:
```powershell
Add-Content .gitignore "`n.env.local"
```

**Verificar que NO se haya commiteado**:
```powershell
git status
git log --all --full-history -- .env.local
```

Si aparece en el historial:
```powershell
# ELIMINAR del historial (PELIGROSO - haz backup)
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env.local" --prune-empty --tag-name-filter cat -- --all
```

**⚠️ IMPORTANTE**: Si `.env.local` se ha subido alguna vez a GitHub/GitLab, considera tu contraseña **COMPROMETIDA** y cámbiala inmediatamente.

---

### 3. Configurar CSP Headers (Content Security Policy) ⏰ IMPORTANTE

**¿Qué es?** Previene ataques XSS (Cross-Site Scripting) limitando qué recursos puede cargar tu página.

**Implementación en Vite** (archivo `vite.config.ts`):
```typescript
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          '</head>',
          `<meta http-equiv="Content-Security-Policy" content="
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com;
            style-src 'self' 'unsafe-inline';
            img-src 'self' data: https: blob:;
            font-src 'self' data:;
            connect-src 'self' https://*.supabase.co;
            frame-src https://www.youtube.com;
            media-src 'self' https:;
          "></meta></head>`
        );
      }
    }
  ]
});
```

**O en tu servidor de producción** (Nginx/Apache/Vercel):
```nginx
# Nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.youtube.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co;";
```

---

### 4. Configurar RLS (Row Level Security) en Supabase ⏰ CRÍTICO

**¿Por qué?** Sin RLS, CUALQUIERA puede modificar/eliminar comentarios desde la consola del navegador.

**Accede a Supabase Dashboard**:
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a "Authentication" → "Policies"
4. Tabla `comments`:

**Política 1 - Lectura Pública** (ya existe):
```sql
-- Nombre: Enable read access for everyone
CREATE POLICY "Enable read access for everyone"
ON comments FOR SELECT
USING (true);
```

**Política 2 - Escritura Autenticada** (AÑADIR):
```sql
-- Nombre: Enable insert for authenticated users only
CREATE POLICY "Enable insert for authenticated users only"
ON comments FOR INSERT
WITH CHECK (true); -- Permitir insertar comentarios públicos
```

**Política 3 - Eliminación SOLO Admin** (AÑADIR):
```sql
-- Nombre: Enable delete for service role only
CREATE POLICY "Enable delete for service role only"
ON comments FOR DELETE
USING (false); -- Bloquea delete desde cliente

-- La eliminación solo será posible desde el Dashboard de Supabase
-- o con la Service Role Key (nunca expongas esta key)
```

**⚠️ IMPORTANTE**: Activa RLS en la tabla:
```sql
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
```

---

### 5. Auditoría de Dependencias ⏰ IMPORTANTE

**Ejecuta ahora**:
```powershell
npm audit
```

**Si hay vulnerabilidades HIGH/CRITICAL**:
```powershell
npm audit fix
```

**Si requiere cambios breaking**:
```powershell
npm audit fix --force
# CUIDADO: Puede romper compatibilidad
# Prueba la app después
```

**Mantener actualizado**:
```powershell
# Actualizar todas las dependencias
npx npm-check-updates -u
npm install
```

---

## 🔐 MEDIDAS ADICIONALES (Recomendadas)

### 6. HTTPS Obligatorio

**En producción, NUNCA uses HTTP**:
- ✅ Usa Vercel/Netlify (HTTPS automático)
- ✅ Usa Cloudflare (SSL/TLS gratis)
- ❌ NO uses hosting sin HTTPS

**Redirigir HTTP a HTTPS** (Nginx):
```nginx
server {
    listen 80;
    server_name juegaycalla.com www.juegaycalla.com;
    return 301 https://$server_name$request_uri;
}
```

---

### 7. Límite de Tasa (Rate Limiting) en Servidor

**Si usas Vercel**, añadir en `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/admin/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

**Si usas Cloudflare**:
1. Ve a Security → WAF
2. Crea regla: "Block más de 10 requests a /admin/login en 60 segundos"

---

### 8. Monitoreo de Accesos

**Implementar Logging** (futuro):
```typescript
// Guardar intentos de login en Supabase
const logLoginAttempt = async (success: boolean, ip: string) => {
  await supabase.from('admin_logs').insert({
    event: success ? 'login_success' : 'login_failed',
    ip_address: ip,
    timestamp: new Date().toISOString()
  });
};
```

**Crear tabla `admin_logs`** en Supabase:
```sql
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event TEXT NOT NULL,
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 9. Backup Regular

**Automático con Supabase**:
- Supabase hace backups diarios automáticos
- Plan gratuito: 7 días de retención
- Plan Pro: 30 días de retención

**Backup manual** (recomendado cada semana):
```powershell
# Backup comentarios
# Desde Supabase Dashboard → Database → Download CSV
```

**Backup código**:
```powershell
git push origin main
# Mantén siempre tu repo actualizado
```

---

### 10. Ocultar Ruta Admin

**Cambiar URL del panel**:
En vez de `/admin/login`, usa algo menos obvio:

```typescript
// En App.tsx
<Route path="/sistema-gestion/acceso" element={<AdminLogin />} />
<Route path="/sistema-gestion/panel" element={
  <ProtectedRoute><AdminDashboard /></ProtectedRoute>
} />
```

**⚠️ NOTA**: Esto es "seguridad por oscuridad" - NO es una medida robusta, pero añade una capa extra.

---

## 🚨 SEÑALES DE ATAQUE - Qué Vigilar

### Indica Posible Ataque:
- ❌ Múltiples intentos de login desde IPs diferentes
- ❌ Patrones de solicitudes automatizadas
- ❌ Comentarios masivos en poco tiempo
- ❌ Intentos de SQL injection en comentarios
- ❌ Acceso a rutas admin desde URLs sospechosas

### Cómo Detectar:
1. **Supabase Dashboard** → Logs → Busca:
   - `SELECT * FROM comments WHERE ...`
   - `'; DROP TABLE --`
   - Patrones de inyección SQL

2. **Google Analytics** (cuando lo implementes):
   - Picos de tráfico anormales a `/admin/*`
   - Sesiones desde países inesperados

3. **Cloudflare Analytics**:
   - Requests bloqueados por firewall
   - Ataques DDoS mitigados

---

## 📋 CHECKLIST PRE-LANZAMIENTO

Marca cada item ANTES de poner la web en producción:

### Seguridad Básica
- [x] Contraseña cambiada a una segura (16+ chars)
- [x] `.env.local` en `.gitignore`
- [ ] `.env.local` NUNCA commiteado a Git
- [ ] Hash de contraseña guardado en gestor de contraseñas
- [ ] Backup de `.env.local` en lugar seguro

### Configuración Servidor
- [ ] HTTPS habilitado y forzado
- [ ] CSP headers configurados
- [ ] Rate limiting en `/admin/*`
- [ ] Headers de seguridad (X-Frame-Options, etc)

### Supabase
- [ ] RLS habilitado en tabla `comments`
- [ ] Políticas de lectura/escritura/eliminación configuradas
- [ ] Service Role Key NUNCA expuesta en frontend
- [ ] Anon Key con permisos mínimos

### Monitoreo
- [ ] Google Analytics configurado
- [ ] Cloudflare analytics activo (si usas Cloudflare)
- [ ] Tabla `admin_logs` creada (opcional)
- [ ] Backup automático verificado

### Testing
- [ ] Intentar login con contraseña incorrecta (debe bloquear a los 5 intentos)
- [ ] Verificar session timeout a los 30 min
- [ ] Probar eliminar comentario (debe pedir confirmación)
- [ ] Verificar que solo admin puede eliminar comentarios
- [ ] Intentar acceder a `/admin/dashboard` sin login (debe redirigir)

---

## 🆘 QUÉ HACER SI TE HACKEAN

### Si sospechas acceso no autorizado:

**1. INMEDIATO** (primeros 5 minutos):
```powershell
# Cambia la contraseña AHORA
# Usa generate-hash.html para generar nuevo hash
# Actualiza .env.local
# Reinicia servidor
```

**2. Revisa logs** (primeros 30 minutos):
- Supabase → Database → Logs
- Busca: Comentarios eliminados sin tu autorización
- Busca: Cambios en reviews

**3. Haz Backup** (inmediato):
```powershell
# Backup Supabase (descarga CSV de todas las tablas)
# Backup código
git commit -am "Backup post-incidente"
git push
```

**4. Investiga**:
- Revisa historial Git: `git log --all`
- Revisa commits recientes: ¿Hay código malicioso?
- Cambia TODAS las contraseñas (Supabase, GitHub, Cloudflare, dominio)

**5. Restaura** (si es necesario):
```powershell
# Restaurar desde backup de Supabase
# O desde CSV descargado
```

**6. Refuerza seguridad**:
- Implementa TODAS las medidas de esta guía
- Considera añadir 2FA (cuando esté disponible)
- Monitorea activamente durante 2 semanas

---

## 📞 CONTACTO EMERGENCIAS

Si necesitas ayuda con seguridad:
- **Supabase Support**: https://supabase.com/support
- **Cloudflare Support**: https://support.cloudflare.com
- **React Security**: https://react.dev/reference/react/security

---

## 🎯 RESUMEN EJECUTIVO

### Medidas CRÍTICAS (implementar HOY):
1. ✅ Contraseña fuerte cambiada
2. ✅ `.env.local` en `.gitignore`
3. ⏰ Verificar que `.env.local` NO está en Git
4. ⏰ Configurar RLS en Supabase
5. ⏰ Ejecutar `npm audit` y corregir vulnerabilidades

### Medidas IMPORTANTES (implementar antes del lanzamiento):
6. CSP headers
7. HTTPS forzado
8. Rate limiting en servidor
9. Backup regular configurado
10. Testing completo de seguridad

### Medidas RECOMENDADAS (implementar post-lanzamiento):
11. Logging de accesos admin
12. Monitoreo con Google Analytics
13. Cloudflare WAF rules
14. URL admin personalizada

---

**Última actualización**: 18 de diciembre de 2025  
**Versión**: 1.0.0  
**Próxima revisión**: 19 de diciembre de 2025 (Security Audit)
