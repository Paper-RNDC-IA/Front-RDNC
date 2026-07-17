import { createHashRouter, Navigate } from 'react-router-dom';

import { DashboardLayout } from '../components/layout/DashboardLayout';
import { RequireAuth } from '../components/auth/RequireAuth';
import { HomePage } from '../pages/HomePage';
import { EstadisticasPage } from '../pages/EstadisticasPage';
import { ManifiestosPage } from '../pages/ManifiestosPage';
import { TelemetriaPage } from '../pages/TelemetriaPage';
import { GeographicAnalysis } from '../pages/GeographicAnalysis';
import { EmpresasPage } from '../pages/EmpresasPage';
import { DescargaInformePage } from '../pages/DescargaInformePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { CompanyWorkspacePage } from '../pages/CompanyWorkspacePage';
import { CompanyFilesPage } from '../pages/CompanyFilesPage';
import { CompanyChatPage } from '../pages/CompanyChatPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/estadisticas',
    element: <Navigate to="/app/estadisticas" replace />,
  },
  {
    path: '/manifiestos',
    element: <Navigate to="/app/manifiestos" replace />,
  },
  {
    path: '/telemetria',
    element: <Navigate to="/app/telemetria" replace />,
  },
  {
    path: '/geografia',
    element: <Navigate to="/app/geografia" replace />,
  },
  {
    path: '/empresas',
    element: <Navigate to="/app/empresas" replace />,
  },
  {
    path: '/descarga-informe',
    element: <Navigate to="/app/descarga-informe" replace />,
  },
  {
    path: '/portal-empresa',
    element: <Navigate to="/app/portal-empresa" replace />,
  },
  {
    path: '/mis-archivos',
    element: <Navigate to="/app/mis-archivos" replace />,
  },
  {
    path: '/app',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/estadisticas" replace />,
      },
      {
        path: 'estadisticas',
        element: <EstadisticasPage />,
      },
      {
        path: 'manifiestos',
        element: <ManifiestosPage />,
      },
      {
        path: 'telemetria',
        element: <TelemetriaPage />,
      },
      {
        path: 'geografia',
        element: <GeographicAnalysis />,
      },
      {
        path: 'empresas',
        element: <EmpresasPage />,
      },
      {
        path: 'descarga-informe',
        element: <DescargaInformePage />,
      },
      {
        path: 'portal-empresa',
        element: (
          <RequireAuth>
            <CompanyWorkspacePage />
          </RequireAuth>
        ),
      },
      {
        path: 'mis-archivos',
        element: (
          <RequireAuth>
            <CompanyFilesPage />
          </RequireAuth>
        ),
      },
      {
        path: 'chat-empresa',
        element: (
          <RequireAuth>
            <CompanyChatPage />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
