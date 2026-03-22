import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isAuthenticated, registerCompany } from '../services/auth.service';
import type { RegisterCompanyRequest } from '../types/auth';

const initialForm: RegisterCompanyRequest = {
  companyName: '',
  companyNit: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function useRegisterPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<RegisterCompanyRequest>(initialForm);
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
      await registerCompany(values);
      navigate('/app/portal-empresa', { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'No fue posible registrar la empresa.',
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
