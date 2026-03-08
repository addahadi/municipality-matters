import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormFieldWrapper from '@/components/ui/form-field';
import { toast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { registerSchema } from '@/lib/validations';
import { Building2, Eye, EyeOff, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', nationalId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors, validate, clearFieldError } = useFormValidation(registerSchema);

  const updateField = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    clearFieldError(field);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;

    setLoading(true);
    try {
      await authApi.register({ ...form, role: 'CITIZEN' });
      toast({ title: t('auth.registerSuccess'), variant: 'success' as any });
      navigate('/login');
    } catch {
      toast({ title: t('auth.registerError'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="mx-auto w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{t('auth.register')}</CardTitle>
            <CardDescription className="mt-1">{t('auth.registerSubtitle')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormFieldWrapper label={t('auth.username')} error={errors.username} required>
              <Input
                value={form.username}
                onChange={(e) => updateField('username', e.target.value)}
                placeholder={t('auth.username')}
                className={errors.username ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label={t('auth.nationalId')} error={errors.nationalId} required>
              <Input
                value={form.nationalId}
                onChange={(e) => updateField('nationalId', e.target.value)}
                placeholder={t('auth.nationalId')}
                className={errors.nationalId ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label={t('auth.password')} error={errors.password} required>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder={t('auth.password')}
                  className={`pe-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormFieldWrapper>

            <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('auth.register')}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
