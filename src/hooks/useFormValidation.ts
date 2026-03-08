import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';
import { useTranslation } from 'react-i18next';

export function useFormValidation<T extends Record<string, any>>(schema: ZodSchema<T>) {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((data: Record<string, any>): data is T => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          const field = e.path.join('.');
          fieldErrors[field] = t(e.message);
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  }, [schema, t]);

  const clearErrors = useCallback(() => setErrors({}), []);
  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return { errors, validate, clearErrors, clearFieldError };
}
