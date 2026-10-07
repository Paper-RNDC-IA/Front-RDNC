# TransData RNDC Frontend

Frontend web del proyecto TransData RNDC para monitoreo y analitica de transporte de carga terrestre en Colombia.

## Objetivo

Este frontend ofrece:

- Una pagina principal de entrada para navegacion progresiva.
- Modulos de analitica RNDC (estadisticas, manifiestos, telemetria, geografia, empresas, exportaciones).
- Un portal privado por empresa con registro, inicio de sesion, carga de archivos, gestion y analisis.

## Stack

- React 19
- Vite 5
- TypeScript 5
- React Router 7 (HashRouter)
- Tailwind CSS
- Recharts
- jsPDF + html2canvas
- XLSX
- Vitest
- ESLint + Prettier

## Estructura principal

```text
apps/frontend/
  src/
    app/                # bootstrapping y router
    pages/              # vistas
    components/         # UI reutilizable
    services/           # acceso a API/HTTP
    adapters/           # transformaciones API -> UI
    hooks/              # logica por pagina
    types/              # contratos de datos
    constants/          # mocks y constantes
    utils/              # utilidades (format, export, fechas)
    styles/             # estilos globales
    test/               # pruebas
```

## Rutas

Publicas:

- / : HomePage (entrada principal)
- /login : inicio de sesion de empresa
- /register : registro de empresa

Internas:

- /app/estadisticas
- /app/manifiestos
- /app/telemetria
- /app/geografia
- /app/empresas
- /app/descarga-informe
- /app/portal-empresa (protegida por autenticacion)

## Flujo de autenticacion empresarial

1. La empresa se registra en /register.
2. Si el registro es exitoso, se inicia sesion automaticamente.
3. La sesion se guarda en localStorage.
4. La ruta /app/portal-empresa exige sesion activa.
5. Al cerrar sesion, se limpia el storage y se redirige a /login.

## Registro e inicio de sesion: como se maneja

- Contratos: src/types/auth.ts
- Servicio auth: src/services/auth.service.ts
- Transformacion de sesion: src/adapters/auth.adapter.ts
- Guard de rutas: src/components/auth/RequireAuth.tsx

### Datos minimos requeridos en registro

- Nombre de empresa
- NIT
- Correo corporativo
- Contrasena + confirmacion

## Portal privado de empresa

Desde /app/portal-empresa la empresa puede:

- Subir archivos internos (Excel/CSV)
- Listar y eliminar archivos
- Consultar resumen de procesamiento
- Ver insights (KPIs, tendencias, categorias, notas)
- Exportar resultados en CSV, Excel y PDF

## Geografia interactiva

Modulo geografia con:

- Carga paralela de capas de datos (produccion, demanda, regalias)
- Mapa SVG interactivo por departamento
- Tooltip, seleccion y zoom
- Panel lateral de detalle
- Modal de reporte detallado con exportacion

Archivos clave:

- src/pages/GeographicAnalysis.tsx
- src/components/maps/ColombiaMap.tsx
- src/components/maps/DetailedReportModal.tsx
- src/services/geography/api.ts
- src/types/geography-map.ts

## Arquitectura de datos

Se mantiene separacion por capas:

- services: IO y llamadas HTTP
- adapters: normalizacion y formato para UI
- hooks: orquestacion de estado por pagina
- types: contratos estrictos

Patron de carga recomendado:

- Promise.all para paginas con multiples endpoints.

## Variables de entorno

Archivo:

- .env.example

Variable principal:

- VITE_API_URL=http://127.0.0.1:8000 (backend local; en el servidor de la universidad, la URL publica del backend)

## Desarrollo local

Desde la raiz del repo:

```bash
cd apps/frontend
npm install
npm run dev
```

Build, lint y test:

```bash
npm run lint
npm run test -- --run
npm run build
```

## Sistema visual

Basado en `DESIGN.md` (guia de estilo "industrial command deck"):

- Lienzo gris `#f5f5f5`, tarjetas blancas con borde `#e5e7eb` y sombra suave; barra lateral Carbon `#1f1f1f`.
- Un unico color de acento, bermellon `#e42b0c`, solo para acciones y elementos activos (la escala `orange` de Tailwind esta remapeada a bermellon en `tailwind.config.*`). Los graficos usan bermellon, carbon y grises.
- Tipografia Inter (sustituto de telegraf): titulos livianos con tracking negativo, etiquetas en mayuscula con tracking 0.025em.
- Radio unico de 8 px y cuerpo de 16 px.

## Datos que muestra

- Los datos del RNDC son agregados mensuales (una fila no es un viaje): las pantallas muestran **viajes** (`VIAJESTOTALES`) y distinguen "registros".
- Los anios incompletos se rotulan ("2026 (6 meses)") y no se comparan contra anios completos.
- Sin filtro de fechas se consulta todo el corpus (2022-2026); el rango por defecto ya no es "ultimos 30 dias".
- El directorio publico de empresas no trae vehiculos ni cumplimiento: esas piezas se ocultan cuando no hay datos.
- La capa "Regalias" del mapa es ilustrativa (factor arbitrario en el backend) y no debe citarse.

## Cambios recientes

- Rediseno completo segun `DESIGN.md`.
- Graficos de barras y de torta corregidos (Fragments incompatibles con recharts 2.15 + React 19; contenedor de alto fijo en tortas con muchas categorias).
- Tablas con clave de fila compuesta (`getRowKey`) para evitar claves duplicadas.
- Estadisticas: KPI de viajes y toneladas con variacion real contra el periodo anterior; "Participacion por anio" en lugar de por modulo.
- `.env.local`, `node_modules`, `dist` y `*.tsbuildinfo` ya no se versionan.
