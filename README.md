# Frontend — TransData RNDC

React 19 + Vite + TypeScript

## Setup

```bash
npm install
echo "VITE_API_URL=http://localhost:8000" > .env.local
npm run dev
# App: http://localhost:3000
```

## Scripts

```bash
npm run dev           # Desarrollo
npm run build         # Build producción
npm run lint          # ESLint
npm run test          # Vitest watch
npm run test:run      # Vitest CI
```

## Estructura

```
apps/frontend/src/
├── pages/
│   ├── Estadisticas.tsx       # Dashboard consolidado
│   ├── Manifiestos.tsx        # KPIs + trend + ranking
│   ├── Telemetria.tsx         # Alertas GPS y velocidades
│   ├── GeographicAnalysis.tsx # Mapa SVG Colombia
│   ├── Empresas.tsx           # Empresas habilitadas
│   └── DescargaInforme.tsx    # Export CSV / Excel / PDF
├── services/api.ts            # Fetch al backend
├── adapters/adapters.ts       # Response → tipos frontend
├── hooks/useExportReport.ts   # exportToPDF / Excel / CSV
└── types.ts                   # Interfaces TypeScript
```

## Flujo de ramas

```bash
# Feature o fix
git checkout develop && git pull
git checkout -b feature/nombre
git push origin feature/nombre
# PR: feature/nombre → develop → merge → eliminar rama

# Release
# PR: develop → main → merge → deploy automático (Vercel)
git checkout main && git pull
git tag vX.Y.Z && git push origin vX.Y.Z

# Hotfix
git checkout main && git pull
git checkout -b hotfix/descripcion
git push origin hotfix/descripcion
# 1. PR: hotfix/descripcion → main   (deploy automático al mergear)
# 2. PR: hotfix/descripcion → develop (sync obligatorio)
git branch -d hotfix/descripcion && git push origin --delete hotfix/descripcion
```
