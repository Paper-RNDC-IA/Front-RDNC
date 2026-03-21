# TransData RNDC Frontend - Integracion con Backend

Este documento describe:

- Estructura logica del frontend.
- Funcionalidades implementadas por modulo.
- Endpoints que el frontend consume para conectarse con backend.
- Flujo de datos interno (services, adapters, hooks, pages, components).
- Estrategia actual de fallback cuando el backend no esta disponible.

## 1. Arquitectura funcional

El frontend esta organizado en capas:

- app: arranque y enrutamiento.
- pages: vistas de alto nivel por modulo.
- components: bloques UI reutilizables.
- hooks: orquestacion de estado y casos de uso por pagina.
- services: llamadas HTTP y acceso a datos externos.
- adapters: transformacion de respuesta API a modelos para UI.
- types: contratos TypeScript de request/response y estado.
- constants: datos mock para modo fallback.
- utils: exportaciones, formatos, fechas.

### Flujo base de datos

1. Page renderiza un Hook.
2. Hook pide datos a Services.
3. Service llama endpoint backend.
4. Si falla endpoint, aplica fallback mock/local.
5. Hook transforma con Adapters.
6. Componentes renderizan data ya preparada.

## 2. Enrutamiento y modulos

### Rutas publicas

- /: pagina principal de entrada.
- /login: inicio de sesion de empresa.
- /register: registro de empresa.

### Rutas internas

- /app/estadisticas
- /app/manifiestos
- /app/telemetria
- /app/geografia
- /app/empresas
- /app/descarga-informe
- /app/portal-empresa

### Proteccion de rutas

- /app/portal-empresa usa guard de autenticacion.
- Si no hay sesion activa, redirige a /login.

## 3. Endpoints consumidos por el frontend

Base URL configurada por variable de entorno:

- VITE_API_BASE_URL

El cliente HTTP arma URL final como:

- BASE_URL + endpoint

## 3.0 Ubicacion del codigo que llama a la API

Esta es la parte exacta del frontend donde vive el service layer y las llamadas HTTP:

### Cliente HTTP base

- src/services/http.ts
  - Funcion base: httpRequest
  - Maneja fetch, headers, parseo de respuesta y errores HTTP.

### Wrapper de API (metodos genericos)

- src/services/api.ts
  - api.get
  - api.post
  - api.postForm
  - api.delete
  - withMockFallback (fallback en caso de error de backend)

### Catalogo de rutas backend

- src/services/endpoints.ts
  - Define todas las rutas API usadas por el frontend.

### Service layer por modulo

- src/services/auth.service.ts
  - Registro, login, sesion actual, logout.

- src/services/company-portal.service.ts
  - Listado de archivos, resumen, upload, delete e insights por archivo.

- src/services/stats.service.ts
  - KPIs, tendencias y resumen del dashboard estadistico.

- src/services/manifests.service.ts
  - KPIs, tendencias, ranking de rutas, ranking de empresas y distribucion.

- src/services/telemetry.service.ts
  - KPIs, velocidades, alertas, corredor, eventos de seguridad, upload telemetria.

- src/services/routes.service.ts
  - KPIs y datos territoriales base.

- src/services/geography/api.ts
  - Capas geograficas: produccion, demanda y regalias.

- src/services/companies.service.ts
  - KPIs, listado y detalle de empresas.

- src/services/export.service.ts
  - Exportacion consolidada (POST /api/export/combined).

### Archivos de apoyo de la capa de datos

- src/adapters/*.ts
  - Transforman response API a formato de UI.

- src/types/*.ts
  - Contratos TypeScript request/response.

- src/constants/mocks.ts
- src/constants/company-portal.mocks.ts
  - Datos mock usados como fallback temporal.

## 3.1 Auth empresa

### POST /api/auth/register

Uso:

- Registro de empresa.

Body esperado desde frontend:

- company_name
- company_nit
- email
- password

Respuesta esperada:

- access_token
- token_type
- company_id
- company_name
- company_nit
- email
- expires_at

### POST /api/auth/login

Uso:

- Inicio de sesion.

Body esperado:

- company_nit
- email
- password

Respuesta esperada:

- access_token
- token_type
- company_id
- company_name
- company_nit
- email
- expires_at

### GET /api/auth/me

Uso:

- Validar/renovar datos de sesion.

### POST /api/auth/logout

Uso:

- Cierre de sesion.

## 3.2 Estadisticas

Todos soportan query opcional:

- from
- to

### GET /api/stats/kpis
### GET /api/stats/trends
### GET /api/stats/summary

## 3.3 Manifiestos

Todos soportan query opcional:

- from
- to

### GET /api/manifests/kpis
### GET /api/manifests/trends
### GET /api/manifests/ranking-routes
### GET /api/manifests/ranking-companies
### GET /api/manifests/distribution

## 3.4 Telemetria

Con query opcional:

- from
- to

### GET /api/telemetry/kpis
### GET /api/telemetry/speeds
### GET /api/telemetry/alerts
### GET /api/telemetry/corridor
### GET /api/telemetry/security-events

### POST /api/telemetry/upload

Uso:

- Cargar archivo Excel GPS.

FormData:

- file

## 3.5 Geografia / Rutas

### GET /api/routes/kpis
### GET /api/routes/departments
### GET /api/routes/production-map
### GET /api/routes/demand-map
### GET /api/routes/royalties-map

## 3.6 Empresas habilitadas

Con query opcional:

- from
- to

### GET /api/companies/kpis
### GET /api/companies/list
### GET /api/companies/{companyId}

## 3.7 Exportacion consolidada

### POST /api/export/combined

Body:

- module
- date_range

## 3.8 Portal privado de empresa

### GET /api/company-files

Query:

- company_id

### POST /api/company-files/upload

FormData:

- file
- company_id

### GET /api/company-files/summary

Query:

- company_id

### DELETE /api/company-files/{fileId}

### GET /api/company-files/{fileId}/insights

Query:

- company_id

### /api/company-files/reports

- Endpoint reservado para reporteria futura. Aun no consumido directamente en hook actual.

## 3.9 Tabla maestra completa de endpoints (catalogo frontend)

Las siguientes tablas resumen todos los endpoints declarados en src/services/endpoints.ts, el service layer que los usa, y su estado actual de integracion.

### Auth

| Metodo | Endpoint | Service | Funcion | Estado |
|---|---|---|---|---|
| POST | /api/auth/register | src/services/auth.service.ts | registerCompany | Consumido con fallback mock |
| POST | /api/auth/login | src/services/auth.service.ts | loginCompany | Consumido con fallback mock |
| GET | /api/auth/me | src/services/auth.service.ts | getCurrentSession | Consumido con fallback a sesion local |
| POST | /api/auth/logout | src/services/auth.service.ts | logoutCompany | Consumido con fallback noop |

### Stats

| Metodo | Endpoint | Service | Funcion | Estado |
|---|---|---|---|---|
| GET | /api/stats/kpis | src/services/stats.service.ts | getStatsKpis | Consumido con withMockFallback |
| GET | /api/stats/trends | src/services/stats.service.ts | getStatsTrends | Consumido con withMockFallback |
| GET | /api/stats/summary | src/services/stats.service.ts | getStatsSummary | Consumido con withMockFallback |

### Manifests

| Metodo | Endpoint | Service | Funcion | Estado |
|---|---|---|---|---|
| GET | /api/manifests/kpis | src/services/manifests.service.ts | getManifestKpis | Consumido con withMockFallback |
| GET | /api/manifests/trends | src/services/manifests.service.ts | getManifestTrends | Consumido con withMockFallback |
| GET | /api/manifests/ranking-routes | src/services/manifests.service.ts | getRouteRanking | Consumido con withMockFallback |
| GET | /api/manifests/ranking-companies | src/services/manifests.service.ts | getCompanyRanking | Consumido con withMockFallback |
| GET | /api/manifests/distribution | src/services/manifests.service.ts | getManifestDistribution | Consumido con withMockFallback |

### Telemetry

| Metodo | Endpoint | Service | Funcion | Estado |
|---|---|---|---|---|
| GET | /api/telemetry/kpis | src/services/telemetry.service.ts | getTelemetryKpis | Consumido con withMockFallback |
| GET | /api/telemetry/speeds | src/services/telemetry.service.ts | getSpeedTrend | Consumido con withMockFallback |
| GET | /api/telemetry/alerts | src/services/telemetry.service.ts | getTelemetryAlerts | Consumido con withMockFallback |
| GET | /api/telemetry/corridor | src/services/telemetry.service.ts | getCorridorSummary | Consumido con withMockFallback |
| GET | /api/telemetry/security-events | src/services/telemetry.service.ts | getSecurityEvents | Consumido con withMockFallback |
| POST | /api/telemetry/upload | src/services/telemetry.service.ts | uploadTelemetryExcel | Consumido con withMockFallback |

### Routes / Geography

| Metodo | Endpoint | Service | Funcion | Estado |
|---|---|---|---|---|
| GET | /api/routes/kpis | src/services/routes.service.ts | getRouteKpis | Consumido con withMockFallback |
| GET | /api/routes/departments | src/services/routes.service.ts | getDepartmentIntensity | Consumido con withMockFallback |
| GET | /api/routes/production-map | src/services/geography/api.ts | fetchProductionMap | Consumido con withMockFallback |
| GET | /api/routes/demand-map | src/services/geography/api.ts | fetchDemandMap | Consumido con withMockFallback |
| GET | /api/routes/royalties-map | src/services/geography/api.ts | fetchRoyaltiesMap | Consumido con withMockFallback |

### Companies

| Metodo | Endpoint | Service | Funcion | Estado |
|---|---|---|---|---|
| GET | /api/companies/kpis | src/services/companies.service.ts | getCompanyKpis | Consumido con withMockFallback |
| GET | /api/companies/list | src/services/companies.service.ts | getCompanies | Consumido con withMockFallback |
| GET | /api/companies/{companyId} | src/services/companies.service.ts | getCompanyDetail | Consumido con withMockFallback |

### Company Portal

| Metodo | Endpoint | Service | Funcion | Estado |
|---|---|---|---|---|
| GET | /api/company-files | src/services/company-portal.service.ts | getCompanyFiles | Consumido con fallback localStorage |
| POST | /api/company-files/upload | src/services/company-portal.service.ts | uploadCompanyFile | Consumido con fallback localStorage |
| GET | /api/company-files/summary | src/services/company-portal.service.ts | getCompanyFilesSummary | Consumido con fallback localStorage |
| DELETE | /api/company-files/{fileId} | src/services/company-portal.service.ts | deleteCompanyFile | Consumido con fallback localStorage |
| GET | /api/company-files/{fileId}/insights | src/services/company-portal.service.ts | getCompanyFileInsight | Consumido con fallback localStorage |
| N/A | /api/company-files/reports | N/A | N/A | Declarado, pendiente de uso directo |

### Export

| Metodo | Endpoint | Service | Funcion | Estado |
|---|---|---|---|---|
| POST | /api/export/combined | src/services/export.service.ts | getCombinedExport | Consumido con withMockFallback |

## 4. Funcionalidades implementadas

## 4.1 Home

- Entrada principal progresiva.
- Accesos rapidos a panel interno, inicio de sesion y registro.
- Bloques de resumen funcional.

## 4.2 Registro y Login de empresa

- Registro de empresa con validacion basica.
- Inicio de sesion por NIT + correo + contrasena.
- Persistencia de sesion en localStorage.
- Redireccion automatica al portal privado.

## 4.3 Portal privado empresa

- Carga de archivos internos (xlsx, xls, csv, json).
- Tabla de archivos por empresa.
- Eliminacion de archivos.
- Resumen de archivos procesados.
- Analitica por archivo seleccionado:
  - KPIs
  - tendencia
  - categorias
  - notas
- Exportacion de analisis en:
  - CSV
  - Excel
  - PDF

## 4.4 Estadisticas

- KPIs generales.
- Tendencia temporal.
- Resumen por modulo.
- Filtro de rango de fechas.

## 4.5 Manifiestos

- KPIs de manifiestos.
- Tendencia.
- Ranking de rutas.
- Ranking de empresas.
- Distribucion de estados.

## 4.6 Telemetria

- KPIs de telemetria.
- Carga Excel GPS.
- Tendencia de velocidad.
- Tabla de alertas.
- Tabla de eventos de seguridad.

## 4.7 Geografia

- Carga paralela de capas: produccion, demanda, regalias.
- Mapa SVG interactivo de departamentos.
- Tooltip, seleccion por departamento y zoom.
- Escala de color por capa/intensidad.
- Panel lateral de detalle.
- Modal de informe detallado.
- Exportacion de informe geografia en PDF/Excel.

## 4.8 Empresas

- KPIs de empresas habilitadas.
- Tabla de empresas.
- Seleccion de empresa y detalle lateral.

## 4.9 Descarga de informe

- Filtros por modulo y rango.
- Exportaciones: CSV, Excel, PDF.
- Resumen de dataset consolidado.

## 5. Funcionamiento de fallback (modo desarrollo)

Cuando una llamada al backend falla:

- Muchos services usan withMockFallback para retornar datos mock.
- El portal empresarial usa fallback con localStorage por company_id.

Esto permite que la aplicacion siga operativa sin depender completamente del backend en cada endpoint.

## 6. Contratos de datos relevantes

Archivos de tipos clave:

- src/types/auth.ts
- src/types/company-portal.ts
- src/types/stats.ts
- src/types/manifests.ts
- src/types/telemetry.ts
- src/types/routes.ts
- src/types/geography-map.ts
- src/types/export.ts
- src/types/common.ts

## 7. Puntos de conexion backend recomendados

Para conectar backend de forma estable:

1. Implementar todos los endpoints listados.
2. Respetar llaves de request y response que el frontend ya espera.
3. Mantener Content-Type application/json, excepto uploads (multipart/form-data).
4. Incluir CORS y credenciales si aplica autenticacion por cookie/token.
5. Retornar errores con codigo HTTP correcto y payload JSON.

## 8. Estado actual de integracion

- Frontend compilando correctamente.
- Endpoints definidos y consumidos por modulo.
- Fallback activo para desarrollo local.
- Listo para conectar backend FastAPI endpoint por endpoint.

## 9. Comandos utiles

Desde la raiz del repo:

- cd apps/frontend
- npm install
- npm run dev
- npm run lint
- npm run test -- --run
- npm run build
