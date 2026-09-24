# Changelog

## [1.4.0] - 2026-09-24
### Autor
Kms_Bismarck003 <jreyes6458@gmail.com> & Equipo

### Lo nuevo o lo que se añadio
- Refactorización visual a arquitectura *Bento Box* en todas las interfaces de gestión (Usuarios, Config, Notificaciones, etc).
- Implementación de un sistema de temas global (Light/Dark mode) con variables CSS en `theme.css` y `variables.css`.
- Erradicación masiva de archivos `.css` monolíticos heredados (`admin.css`, `UserManagement.css`).
- Resolución de conflictos de merge (`git merge`) garantizando la convivencia del nuevo layout Bento con el motor de temas globales (lucide-react).
- Corrección de bugs de scroll y `overflow` en el Sidebar.
## [1.3.0] - 2026-09-18
### Autor
Kms_Bismarck003 <jreyes6458@gmail.com>

### Lo nuevo o lo que se añadio
- Rediseño completo del login a un estilo premium (Glassmorphism), acatando estrictamente el estilo de tarjeta de cristal sin bordes de inputs.
- Refactorización de `Login.jsx` (monolito) dividiéndolo en componentes de UI independientes (`LoginLayout`, `LoginHeader`, `LoginForm`, `LoginFooter`).
- Reestructuración de colores, layout y variables estéticas priorizando una identidad corporativa limpia.

---

## [1.2.0] - 2026-09-14
### Autor
Kms_Bismarck003 <jreyes6458@gmail.com>

### Lo nuevo o lo que se añadio
- Implementación completa del sistema de mapeo interactivo 2D con Konva (diseño, renderizado, templates de recinto y asignación de asientos).
- Integración fullstack funcional de boletos y asientos con la base de datos (ventas simuladas, validación de estado ocupado/disponible).

---

## [1.1.0] - 2026-09-14
### Autor
Equipo de Desarrollo

### Lo nuevo o lo que se añadio
- Sincronizacion de estado de autenticacion (AuthSync).
- Implementacion de Modal de Coincidencia de Roles (RoleMismatchModal).
- Proteccion de rutas segun el rol del usuario (AdminProtectedRoute).
- Depuracion de rutas dinamicas.
- Analisis de herramienta de mapeo.
