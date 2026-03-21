import { type PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { isAuthenticated } from '../../services/auth.service';

type RequireAuthProps = PropsWithChildren;

export function RequireAuth({ children }: RequireAuthProps): JSX.Element {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
