# Modulo Administrador - LAIKA Club (laika-admin)

Modulo de administracion y control central para la plataforma LAIKA Club. Aplicacion web SPA desacoplada, disenada para personal directivo y administradores del sistema con permisos de alto nivel.

---

## 1. Descripcion General

El modulo `laika-admin` proporciona una interfaz grafica para la supervision y gestion global de la plataforma: control de accesos basados en roles (RBAC), aprobacion de mercancias propuestas por gestores, configuracion de anuncios publicitarios, auditoria en tiempo real del estado de bases de datos relacionales, trazabilidad de respaldos SQL Vault y diseno interactivo de recintos y mapas de asientos mediante lienzos graficos.

La aplicacion opera desacoplada de la interfaz publica y se comunica de forma exclusiva con el backend mediante el API Gateway central (Pilgrim) en el puerto 8000.

---

## 2. Stack Tecnologico

- **Framework Web**: React 19.0.0
- **Empaquetador y Servidor de Desarrollo**: Vite 6.0.0
- **Enrutamiento**: React Router DOM 7.1.0
- **Lienzo Grafico Interactivo (Venue Designer)**: Konva 10.5.0 y React-Konva 19.2.7
- **Visualizacion de Analitica y Datos**: Plotly.js 3.0.0 y React-Plotly.js 2.6.0
- **Exportacion de Reportes y Auditorias**: jsPDF 2.5.2 y html2canvas 1.4.1
- **Cliente HTTP**: Axios 1.7.9
- **Iconografia**: Lucide React 0.460.0

---

## 3. Arquitectura y Comunicacion

- **Puerto Local**: 3010 (rango de red asignado para el rol administrador: 3010-3019)
- **API Gateway (Pilgrim)**: `http://localhost:8000/api/admin`
- **Mecanismo de Autenticacion**: Tokens JWT transmitidos en cabecera `Authorization: Bearer <token>`, verificados perimetralmente en el Gateway antes de su resolucion en el microservicio de autenticacion (`laika_auth`: 8101) y administracion (`laika_admin`: 8102).

```
[ Navegador Web ]
       |
       | HTTP / Localhost:3010
       v
[ laika-admin (Vite SPA) ]
       |
       | Peticiones REST con JWT
       v
[ Pilgrim API Gateway (Puerto 8000) ]
       |
       +---> /api/admin/*    ---> Microservicio Admin (Puerto 8102)
       +---> /api/auth/*     ---> Microservicio Auth (Puerto 8101)
       +---> /api/events/*   ---> Microservicio Events (Puerto 8201)
       +---> /api/database/* ---> Monitor SQL y Vault (Puerto 8102)
```

---

## 4. Funcionalidades Principales

1. **Gestion de Usuarios y Seguridad (RBAC)**:
   - Consulta, alta, edicion y revocacion de cuentas de usuarios.
   - Asignacion granular de roles (`admin`, `gestor`, `operador`, `usuario`).
   - Revision de registros de intentos de acceso y bloqueos de seguridad.

2. **Aprobacion y Supervision de Mercancia**:
   - Bandeja de entrada para productos de tienda propuestos por los gestores de eventos.
   - Aprobacion, rechazo o solicitud de modificaciones antes de la publicacion en el catalogo general.

3. **Editor Grafico de Recintos y Asientos**:
   - Disenador visual interactivo basado en Konva para trazar filas, columnas y zonas de recintos.
   - Asignacion de identificadores unicos por asiento y definicion de aforos maximos.

4. **Monitoreo de Base de Datos y SqlVault**:
   - Consola de estado del motor MySQL en tiempo real.
   - Gestion de respaldos manuales y programados con descarga de archivos SQL.

5. **Campanas Publicitarias y Anuncios**:
   - Administracion de banners promocionales, asignacion de prioridades y fechas de vigencia.

---

## 5. Estructura del Proyecto

```
laika-admin/
├── src/
│   ├── assets/              # Recursos estaticos e imagenes
│   ├── components/          # Componentes reutilizables de UI (modales, tablas, alertas)
│   ├── hooks/               # Custom hooks de logica desacoplada
│   ├── pages/               # Vistas principales del panel administrativo
│   │   ├── Dashboard/       # Metricas globales del sistema
│   │   ├── Users/           # Administracion de usuarios y roles
│   │   ├── Events/          # Auditoria de eventos activos y concluidos
│   │   ├── Merchandise/     # Aprobacion de articulos de catalogo
│   │   ├── Venues/          # Disenador de mapas y recintos
│   │   ├── Database/        # Consola de estado MySQL y SqlVault
│   │   └── Ads/             # Gestion de campanas publicitarias
│   ├── services/            # Clientes HTTP y contratos de integracion API
│   ├── styles/              # Hojas de estilo y tokens de diseno
│   ├── App.jsx              # Enrutador principal de la aplicacion
│   └── main.jsx             # Punto de entrada y montaje DOM
├── package.json
└── vite.config.js
```

---

## 6. Instalacion y Puesta en Marcha

### Prerrequisitos
- Node.js version 18 o superior.
- Gestor de paquetes npm version 9 o superior.
- API Gateway Pilgrim activo en el puerto 8000.

### Instalacion de Dependencias
```bash
cd laika-admin
npm install
```

### Ejecucion en Entorno de Desarrollo
```bash
npm run dev
```
La aplicacion estara disponible en `http://localhost:3010`.

### Compilacion para Produccion
```bash
npm run build
```
Los archivos estaticos optimizados se generaran en el directorio `dist/`.

### Previsualizacion de Build Productivo
```bash
npm run preview
```
Inicia un servidor local en el puerto 3010 sirviendo el paquete optimizado de produccion.
