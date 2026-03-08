import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormFieldWrapper from '@/components/ui/form-field';
import { toast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { loginSchema } from '@/lib/validations';
import { Building2, Globe, Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors, validate, clearFieldError } = useFormValidation(loginSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate({ username, password })) return;

    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      login(res.data.user, res.data.token);
      toast({ title: t('auth.loginSuccess'), variant: 'success' as any });
      const routes = { ADMIN: '/admin', EMPLOYEE: '/employee', CITIZEN: '/citizen' };
      navigate(routes[res.data.user.role as keyof typeof routes] || '/');
    } catch {
      toast({ title: t('auth.loginError'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 end-4">
        <Button variant="outline" size="sm" onClick={toggleLanguage} className="gap-2">
          <Globe className="h-4 w-4" />
          {i18n.language === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="mx-auto w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{t('auth.welcomeBack')}</CardTitle>
            <CardDescription className="mt-1">{t('auth.loginSubtitle')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormFieldWrapper label={t('auth.username')} error={errors.username} required>
              <Input
                value={username}
                onChange={(e) => { setUsername(e.target.value); clearFieldError('username'); }}
                placeholder={t('auth.username')}
                className={errors.username ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label={t('auth.password')} error={errors.password} required>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
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
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('auth.login')}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              {t('auth.register')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
