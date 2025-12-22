# 🚀 Mejoras de Seguridad Futuras
**Fecha:** 22 de diciembre de 2025  
**Estado:** Opcional - Post-lanzamiento  
**Prioridad:** Baja a Media

---

## 📝 Introducción

Este documento detalla **mejoras opcionales** de seguridad que pueden implementarse después del lanzamiento inicial. **Ninguna es crítica** para el funcionamiento seguro de la aplicación actual.

**Orden de implementación:** Por prioridad (ALTA → BAJA)

---

## 🔴 Prioridad ALTA

### 1. Mover Service Role Key a Backend Serverless

**Problema actual:**
- Service Role Key está en el bundle de frontend (`supabaseAdmin.ts`)
- Aunque protegida por login admin, es técnicamente accesible

**Solución propuesta:**
Crear Vercel Serverless Functions para operaciones admin:

#### Estructura:
```
/api
  /admin
    /delete-comment.ts
    /auth.ts
```

#### Implementación:
```typescript
// /api/admin/delete-comment.ts
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // 1. Verificar sesión admin (cookie HttpOnly)
  const session = req.cookies.admin_session;
  if (!isValidSession(session)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Usar Service Role Key desde variable de entorno Vercel
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Solo en servidor
  );

  // 3. Eliminar comentario
  const { commentId } = req.body;
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
```

**Beneficios:**
- ✅ Service Role Key nunca expuesta en frontend
- ✅ Mejor aislamiento de permisos
- ✅ Cookies HttpOnly más seguras que sessionStorage

**Esfuerzo:** 2-3 horas  
**Complejidad:** Media

---

## 🟡 Prioridad MEDIA

### 2. Implementar Honeypot Anti-Bot

**Objetivo:** Detectar bots automáticos en formularios

#### Implementación:
```tsx
// src/pages/Comments.tsx
<form onSubmit={handleSubmit}>
  {/* Campo honeypot (invisible para humanos) */}
  <input
    type="text"
    name="website"
    value={honeypot}
    onChange={(e) => setHoneypot(e.target.value)}
    style={{ 
      position: 'absolute',
      left: '-9999px',
      width: '1px',
      height: '1px'
    }}
    tabIndex={-1}
    autoComplete="off"
    aria-hidden="true"
  />
  
  {/* Campos normales */}
  <Input ... />
  <Textarea ... />
</form>

// En handleSubmit:
if (honeypot !== '') {
  // Bot detectado - ignorar silenciosamente
  return;
}
```

**Beneficios:**
- ✅ Bloquea bots simples sin afectar UX
- ✅ Sin dependencias externas
- ✅ Implementación simple

**Esfuerzo:** 30 minutos  
**Complejidad:** Baja

---

### 3. Añadir reCAPTCHA v3 (Solo si hay spam)

**Cuándo implementar:**
- Si detectas spam masivo después del lanzamiento
- Como última línea de defensa

#### Implementación:
```bash
npm install react-google-recaptcha-v3
```

```tsx
// src/pages/Comments.tsx
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const { executeRecaptcha } = useGoogleReCaptcha();

const handleSubmit = async () => {
  // Obtener token reCAPTCHA
  const token = await executeRecaptcha('submit_comment');
  
  // Enviar token junto con comentario
  const { data } = await supabase
    .from('comments')
    .insert({ 
      content, 
      author_name,
      recaptcha_token: token 
    });
}
```

**Validación servidor (Vercel Function):**
```typescript
// Verificar token con Google API
const response = await fetch(
  `https://www.google.com/recaptcha/api/siteverify`,
  {
    method: 'POST',
    body: `secret=${SECRET_KEY}&response=${token}`
  }
);

const { success, score } = await response.json();
if (score < 0.5) {
  // Probable bot
  return reject();
}
```

**Beneficios:**
- ✅ reCAPTCHA v3 es invisible (sin challenges)
- ✅ Score de 0.0 (bot) a 1.0 (humano)
- ✅ Muy efectivo contra bots sofisticados

**Costos:**
- Gratis hasta 1M requests/mes

**Esfuerzo:** 2 horas  
**Complejidad:** Media

---

### 4. Implementar Content Security Policy Estricto

**Problema actual:**
- CSP tiene `'unsafe-inline'` y `'unsafe-eval'` en `script-src`
- Necesario para Vite dev mode, pero no óptimo para producción

**Solución:**
```typescript
// vite.config.ts - Solo en producción
const cspPlugin = (): Plugin => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      if (import.meta.env.PROD) {
        // CSP estricto para producción
        const cspContent = [
          "default-src 'self'",
          "script-src 'self'", // ✅ Sin unsafe-inline
          "style-src 'self'",   // ✅ Sin unsafe-inline
          "connect-src 'self' https://*.supabase.co",
          // ... resto
        ].join('; ');
      } else {
        // CSP permisivo para desarrollo
        // ... actual
      }
    }
  };
};
```

**Requisito:**
- Eliminar inline styles
- Mover todo a CSS modules o Tailwind classes

**Beneficios:**
- ✅ Mayor protección XSS
- ✅ Mejor puntuación en auditorías

**Esfuerzo:** 3-4 horas  
**Complejidad:** Alta

---

## 🟢 Prioridad BAJA

### 5. Subresource Integrity (SRI)

**Objetivo:** Verificar integridad de recursos externos

```html
<!-- index.html -->
<script 
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"
></script>
```

**Estado actual:**
- No usas CDNs externos (todo bundled)
- Solo YouTube embeds (no necesita SRI)

**Cuándo implementar:**
- Si añades CDNs en el futuro

**Esfuerzo:** 1 hora  
**Complejidad:** Baja

---

### 6. Implementar Session Fixation Protection

**Mejora:** Regenerar session ID después de login exitoso

```typescript
// src/hooks/useAuth.ts
const login = async (password: string) => {
  // ... validación actual

  if (hashedPassword === correctHash) {
    // Limpiar sesión antigua
    sessionStorage.clear();
    
    // Generar nuevo session ID
    const newSessionId = `session_${Date.now()}_${crypto.randomUUID()}`;
    
    const session: AuthState = {
      isAuthenticated: true,
      lastActivity: Date.now(),
      sessionId: newSessionId
    };
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
};
```

**Beneficios:**
- ✅ Previene session fixation attacks
- ✅ Buena práctica de seguridad

**Esfuerzo:** 30 minutos  
**Complejidad:** Baja

---

### 7. Logging y Monitoring de Seguridad

**Implementar logs de eventos críticos:**

```typescript
// src/utils/securityLogger.ts
export const logSecurityEvent = async (event: {
  type: 'login_failed' | 'login_success' | 'comment_blocked' | 'rate_limit_exceeded',
  userId?: string,
  ip?: string,
  details?: any
}) => {
  if (import.meta.env.PROD) {
    // Enviar a servicio de logs (Vercel Analytics, Sentry, etc.)
    await fetch('/api/log-security', {
      method: 'POST',
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString()
      })
    });
  }
};
```

**Uso:**
```typescript
// En useAuth.ts
if (hashedPassword !== correctHash) {
  await logSecurityEvent({
    type: 'login_failed',
    details: { attempts: attempts.count }
  });
}
```

**Beneficios:**
- ✅ Detectar patrones de ataque
- ✅ Auditoría de accesos
- ✅ Alertas automáticas

**Servicios recomendados:**
- Vercel Analytics
- Sentry (errors + performance)
- LogRocket (session replay)

**Esfuerzo:** 2-3 horas  
**Complejidad:** Media

---

### 8. Añadir Timeout a Fetch Requests

**Problema:** Requests pueden colgar indefinidamente

```typescript
// src/utils/fetchWithTimeout.ts
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = 10000
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};
```

**Beneficios:**
- ✅ Mejor UX (no esperas infinitas)
- ✅ Previene DoS accidental

**Esfuerzo:** 1 hora  
**Complejidad:** Baja

---

## 📊 Resumen de Prioridades

| Mejora | Prioridad | Esfuerzo | Complejidad | Impacto Seguridad |
|--------|-----------|----------|-------------|-------------------|
| Service Role Key → Backend | 🔴 Alta | 2-3h | Media | Alto |
| Honeypot Anti-Bot | 🟡 Media | 30min | Baja | Medio |
| reCAPTCHA v3 | 🟡 Media | 2h | Media | Alto |
| CSP Estricto | 🟡 Media | 3-4h | Alta | Medio |
| SRI | 🟢 Baja | 1h | Baja | Bajo |
| Session Fixation | 🟢 Baja | 30min | Baja | Bajo |
| Security Logging | 🟢 Baja | 2-3h | Media | Medio |
| Fetch Timeout | 🟢 Baja | 1h | Baja | Bajo |

---

## 🎯 Roadmap Sugerido

### **Fase 1: Post-lanzamiento (Enero 2026)**
1. Mover Service Role Key a backend (si hay tráfico significativo)
2. Implementar honeypot (preventivo)

### **Fase 2: Optimización (Febrero 2026)**
3. Security logging y monitoring
4. Session fixation protection

### **Fase 3: Avanzado (Solo si necesario)**
5. reCAPTCHA v3 (solo si hay spam)
6. CSP estricto (mejora incremental)
7. SRI (si usas CDNs)
8. Fetch timeout (mejora UX)

---

## ✅ Conclusión

Todas estas mejoras son **opcionales** y no afectan la seguridad básica de la aplicación, que ya es robusta. Implementa según necesidad y recursos disponibles.

**Recomendación:** Lanzar primero, monitorear, y mejorar iterativamente basado en datos reales de uso.

---

**Próxima revisión:** Post-lanzamiento (enero 2026)
