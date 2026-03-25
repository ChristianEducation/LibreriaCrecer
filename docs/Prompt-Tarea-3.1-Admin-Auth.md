# Tarea 3.1 — Autenticación del Panel Admin

## Contexto
Este es el primer paso de la Fase 3 del proyecto Crecer Librería Cristiana. Las Fases 1 y 2 dejaron configurada la infraestructura completa y las API Routes públicas del catálogo, órdenes y pagos. Ahora necesitamos proteger el panel de administración con un sistema de login.

## Decisiones de arquitectura ya tomadas
- El admin vive dentro de la misma app Next.js bajo `/admin`
- La autenticación se hace contra la tabla `admin_users` en la base de datos (Drizzle ORM)
- No se usa Supabase Auth — el auth es propio
- Sesión basada en cookies HTTP-only (no localStorage)
- La UI del admin usa componentes funcionales básicos (se pulirá con el design system en Fase 4)

## Lo que necesito que hagas

### 1. Instalar dependencias
- `bcryptjs` — para hashear y comparar contraseñas
- `jose` — para JWT (JSON Web Tokens) en edge runtime compatible con Next.js middleware
- `@types/bcryptjs` — tipos de TypeScript

### 2. Crear el servicio de autenticación
- Ubicación: `src/features/admin/services/auth-service.ts`

**hashPassword(password):**
- Hashea una contraseña con bcrypt (salt rounds: 12)

**verifyPassword(password, hash):**
- Compara contraseña plana contra el hash

**login(email, password):**
- Busca el admin por email en admin_users
- Valida que exista y esté activo (is_active)
- Compara la contraseña contra password_hash
- Si es válido, genera un JWT con: { adminId, email, name }
- Retorna: { token, admin: { id, email, name } }

**verifyToken(token):**
- Verifica y decodifica el JWT
- Retorna: el payload o null si es inválido/expirado

**getAdminById(id):**
- Busca un admin por ID
- Retorna: admin sin password_hash

### 3. Configurar JWT
- Variable de entorno: `ADMIN_JWT_SECRET` — clave secreta para firmar tokens
- Expiración del token: 24 horas
- Usar `jose` (no jsonwebtoken) para compatibilidad con Edge Runtime de Next.js

### 4. Crear las API Routes de auth

`POST /api/admin/auth/login`
- Body: { email: string, password: string }
- Validar con Zod
- Llama a authService.login()
- Si éxito: setea cookie HTTP-only "admin-session" con el JWT y retorna datos del admin
- Si fallo: 401 Unauthorized
- Cookie config: httpOnly, secure (en producción), sameSite: "lax", path: "/", maxAge: 86400 (24h)

`POST /api/admin/auth/logout`
- Elimina la cookie "admin-session"
- Response: 200 OK

`GET /api/admin/auth/me`
- Lee la cookie, verifica el token
- Retorna datos del admin logueado o 401

### 5. Crear el middleware de protección
- Ubicación: `src/middleware.ts`
- Proteger todas las rutas que empiecen con `/admin` EXCEPTO `/admin/login`
- Proteger todas las API Routes que empiecen con `/api/admin` EXCEPTO `/api/admin/auth/login`
- Si no hay cookie válida, redirigir a `/admin/login` (para páginas) o retornar 401 (para APIs)
- Usar `jose` para verificar el JWT en el middleware (Edge Runtime compatible)

### 6. Crear la página de login
- Ubicación: `src/app/admin/login/page.tsx`
- Formulario simple con email y password
- Usar React Hook Form + Zod para validación del formulario
- Al hacer submit, llamar a POST /api/admin/auth/login
- Si éxito, redirigir a /admin
- Si error, mostrar mensaje de error
- Si ya está logueado, redirigir a /admin
- UI funcional básica: centrado en pantalla, inputs limpios, botón de submit. No necesita ser bonito aún.

### 7. Crear layout del admin
- Ubicación: `src/app/admin/layout.tsx`
- Layout base que incluya:
  - Sidebar o header con navegación: Productos, Categorías, Pedidos, Landing, Cerrar sesión
  - Zona de contenido principal
  - Nombre del admin logueado visible
- UI funcional básica — sidebar simple con links

### 8. Actualizar la página principal del admin
- Ubicación: `src/app/admin/page.tsx`
- Dashboard simple que muestre:
  - Bienvenida con nombre del admin
  - Links rápidos a las secciones (Productos, Categorías, Pedidos, Landing)
- Datos reales no son necesarios aún — solo la estructura

### 9. Crear script de seed para el primer admin
- Ubicación: `src/scripts/seed-admin.ts`
- Script ejecutable que crea el primer usuario admin en la base de datos
- Debe pedir o usar valores por defecto:
  - Email: admin@crecerlibreria.cl
  - Password: (definir una temporal que se cambie después)
  - Name: Administrador
- Hashea la contraseña antes de insertar
- Agregar comando en package.json: `"seed:admin": "npx tsx src/scripts/seed-admin.ts"`

### 10. Agregar variables de entorno
- `ADMIN_JWT_SECRET=una-clave-secreta-larga-y-segura` (generar una aleatoria)
- Agregar al `.env.local.example`

## Reglas importantes
- Las contraseñas NUNCA se almacenan en texto plano — siempre hasheadas con bcrypt
- El JWT se almacena en cookie HTTP-only — no accesible desde JavaScript del cliente
- El middleware debe ser Edge Runtime compatible (usar `jose`, no `jsonwebtoken`)
- No exponer password_hash en ninguna respuesta de API
- La página de login NO está protegida por el middleware (es la excepción)
- NO crear CRUD de productos ni pedidos (eso es Tarea 3.2 y 3.3)
- NO instalar librerías de UI como shadcn/ui — usar HTML/Tailwind básico por ahora
