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

### Nota de backend

Cuando los endpoints de auth no estan disponibles, el frontend usa fallback mock para desarrollo local.

## Registro e inicio de sesion: como se maneja

- Contratos: src/types/auth.ts
- Servicio auth: src/services/auth.service.ts
- Transformacion de sesion: src/adapters/auth.adapter.ts
- Mocks auth/portal: src/constants/company-portal.mocks.ts
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

- VITE_API_BASE_URL=http://localhost:8000

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

## Estado de mocks

Actualmente hay mocks para:

- autenticacion y registro empresarial
- portal de archivos empresariales
- analitica general por modulos
- capas geograficas

Estos mocks se usan como fallback para que el frontend no dependa al 100% del backend durante el desarrollo.

## Documento adicional de integracion

Para ver inventario completo de endpoints, metodos, payloads y flujo tecnico de conexion con backend:

- README-INTEGRACION-BACKEND.md

## Nota de workflow

Cambio menor de documentacion para validar flujo de commit en el repositorio.
