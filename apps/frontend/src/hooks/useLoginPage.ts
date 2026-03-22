import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isAuthenticated, loginCompany } from '../services/auth.service';
import type { LoginRequest } from '../types/auth';

const initialForm: LoginRequest = {
  companyNit: '',
  email: '',
  password: '',
};

export function useLoginPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<LoginRequest>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/app/portal-empresa', { replace: true });
    }
  }, [navigate]);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await loginCompany(values);
      navigate('/app/portal-empresa', { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'No fue posible iniciar sesion.',
      );
    } finally {
      setLoading(false);
    }
  }, [navigate, values]);

  return useMemo(
    () => ({
      values,
      loading,
      error,
      setValues,
      onSubmit,
    }),
    [error, loading, onSubmit, values],
  );
}
