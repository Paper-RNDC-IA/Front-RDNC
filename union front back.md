# Informe de Integracion Frontend + Backend

## 1. Objetivo
Dejar el frontend funcionando con datos reales del backend desplegado en Render, eliminando dependencias de mocks en produccion y corrigiendo incompatibilidades de respuesta entre ambos lados.

Backend objetivo:
- https://back-rndc.onrender.com

Frontend:
- apps/frontend

---

## 2. Problemas Raiz Detectados

1. El frontend tenia fallbacks a mocks en servicios clave.
- Cuando fallaba una llamada real, la UI mostraba datos simulados y ocultaba el problema de integracion.

2. Configuracion de entorno no alineada.
- Se estaba usando VITE_API_BASE_URL en varios flujos, y faltaba consistencia con VITE_API_URL para despliegue.

3. Diferencias de shape entre respuestas reales y lo esperado por la UI.
- Varios endpoints devuelven objeto agregado (no arreglo), o listas paginadas con items.
- En telemetria y rankings habia diferencias de claves (label/value, motivo, toneladas, etc.).

4. Comandos npm ejecutados en carpeta incorrecta.
- Error ENOENT por ejecutar npm install / npm run dev en la raiz del repo, donde no existe package.json.

---

## 3. Solucion Aplicada

### 3.1 Conexion y cliente HTTP

Se reforzo la capa HTTP para uso real con backend:
- Prioridad de URL base: VITE_API_URL y compatibilidad con VITE_API_BASE_URL.
- Timeout configurable con VITE_API_TIMEOUT_MS.
- Manejo uniforme de errores de red, timeout y estados HTTP.
- Header Authorization Bearer desde sesion local.
- Logs de request solo en desarrollo.

Archivo principal:
- apps/frontend/src/services/http.ts

Tambien se elimino fallback mock global:
- apps/frontend/src/services/api.ts

---

### 3.2 Eliminacion de mocks en servicios

Se removieron fallbacks y dependencias mock en:
- auth
- stats
- manifests
- telemetry
- routes / geography
- companies
- export
- company portal

Archivos clave:
- apps/frontend/src/services/auth.service.ts
- apps/frontend/src/services/stats.service.ts
- apps/frontend/src/services/manifests.service.ts
- apps/frontend/src/services/telemetry.service.ts
- apps/frontend/src/services/routes.service.ts
- apps/frontend/src/services/geography/api.ts
- apps/frontend/src/services/companies.service.ts
- apps/frontend/src/services/export.service.ts
- apps/frontend/src/services/company-portal.service.ts

---

### 3.3 Normalizacion de respuestas reales

Se agregaron normalizadores para adaptar payloads reales del backend a la UI:
- Objetos agregados a listas de KPIs para componentes.
- Agrupaciones de alerts/events por motivo.
- Soporte de listas paginadas por items.
- Mapeo de claves alternativas (label, value, toneladas, motivo, etc.).

Archivos relevantes:
- apps/frontend/src/services/stats.service.ts
- apps/frontend/src/services/manifests.service.ts
- apps/frontend/src/services/telemetry.service.ts
- apps/frontend/src/services/routes.service.ts
- apps/frontend/src/services/companies.service.ts
- apps/frontend/src/services/export.service.ts

---

### 3.4 Endpoints y catalogo de rutas

Se expandio y alineo el catalogo de endpoints para cubrir rutas reales del backend.

Archivo:
- apps/frontend/src/services/endpoints.ts

---

### 3.5 Ajustes visuales y de experiencia

Se mejoro la visualizacion de la seccion de Manifiestos:
- Mejora de grafico de tendencia (estetica, tooltip, legibilidad).
- Mejora de grafico de distribucion (donut, leyenda visual, estado vacio).
- Ajuste de etiquetas de tablas para reflejar toneladas reales.

Archivos:
- apps/frontend/src/components/charts/LineChartWidget.tsx
- apps/frontend/src/components/charts/PieChartWidget.tsx
- apps/frontend/src/components/charts/ChartCard.tsx
- apps/frontend/src/pages/ManifiestosPage.tsx
- apps/frontend/src/adapters/manifests.adapter.ts

---

### 3.6 Sello de trazabilidad de carga en modulos

Se agrego un bloque visual de trazabilidad y luego se simplifico por solicitud del usuario.
Estado final:
- Solo muestra Ultima carga.

Componente:
- apps/frontend/src/components/common/DataSourceBadge.tsx

Integrado en paginas:
- apps/frontend/src/pages/EstadisticasPage.tsx
- apps/frontend/src/pages/ManifiestosPage.tsx
- apps/frontend/src/pages/TelemetriaPage.tsx
- apps/frontend/src/pages/GeografiaPage.tsx
- apps/frontend/src/pages/EmpresasPage.tsx
- apps/frontend/src/pages/DescargaInformePage.tsx
- apps/frontend/src/pages/CompanyWorkspacePage.tsx

---

## 4. Configuracion de Entorno

Se dejo ejemplo y archivo local para apuntar a Render:

Variables:
- VITE_API_URL=https://back-rndc.onrender.com
- VITE_API_TIMEOUT_MS=25000

Archivos:
- apps/frontend/.env.example
- apps/frontend/.env.local

---

## 5. Verificaciones Ejecutadas

### 5.1 Build
- npm run build ejecutado varias veces en apps/frontend.
- Resultado: build exitoso.

### 5.2 CORS
- Se ejecuto preflight OPTIONS a backend con origen Vercel.
- Respuesta con access-control-allow-origin y metodos permitidos.

### 5.3 Endpoints reales
Se verificaron respuestas reales de modulos clave contra Render, incluyendo:
- stats
- manifests
- telemetry
- routes / map
- companies
- export

Resultado: los valores mostrados en UI coinciden con payloads reales del backend para los casos validados.

---

## 6. Evidencia de que el frontend consume backend real

1. Sin mocks activos en servicios principales.
2. Base URL configurada a Render.
3. Respuestas y agregaciones en UI consistentes con payload real.
4. Estados de error muestran errores reales de HTTP cuando hay fallos.

---

## 7. Comandos Correctos de Trabajo

Desde raiz del repo:

- npm --prefix apps/frontend install
- npm --prefix apps/frontend run dev
- npm --prefix apps/frontend run build

Alternativa entrando a carpeta:

- cd apps/frontend
- npm install
- npm run dev
- npm run build

---

## 8. Estado Final

Integracion frontend-backend completada para consumo real en los modulos principales.

Estado actual:
- Frontend funcional con backend de Render.
- Mocks removidos de rutas de negocio principales.
- Visualizacion de Manifiestos mejorada.
- Indicador de Ultima carga visible por modulo.
- Build de produccion estable.
