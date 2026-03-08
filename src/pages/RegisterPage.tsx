import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FormFieldWrapper from '@/components/ui/form-field';
import { toast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { registerSchema } from '@/lib/validations';
import { Building2, Eye, EyeOff, Loader2, Globe, FileText, Home, MessageSquare } from 'lucide-react';
import authSideImg from '@/assets/auth-side.jpg';

const RegisterPage = () => {
  const { t, i18n } = useTranslation();
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

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        <div className="absolute top-5 end-5">
          <Button variant="outline" size="sm" onClick={toggleLanguage} className="gap-2 rounded-full">
            <Globe className="h-4 w-4" />
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('auth.register')}</h1>
              <p className="text-muted-foreground mt-1.5">{t('auth.registerSubtitle')}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormFieldWrapper label={t('auth.username')} error={errors.username} required>
              <Input
                value={form.username}
                onChange={(e) => updateField('username', e.target.value)}
                placeholder={t('auth.username')}
                className={`h-12 rounded-xl ${errors.username ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label={t('auth.nationalId')} error={errors.nationalId} required>
              <Input
                value={form.nationalId}
                onChange={(e) => updateField('nationalId', e.target.value)}
                placeholder={t('auth.nationalId')}
                className={`h-12 rounded-xl ${errors.nationalId ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label={t('auth.password')} error={errors.password} required>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder={t('auth.password')}
                  className={`h-12 rounded-xl pe-12 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormFieldWrapper>

            <Button type="submit" className="w-full h-12 rounded-xl font-semibold text-base shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t('auth.register')}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </div>

      {/* Side Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={authSideImg}
          alt="Smart city"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-primary/20" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-primary-foreground">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            {t('auth.registerSideTitle', 'Join Our Platform')}
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-md">
            {t('auth.registerSideDescription', 'Create your citizen account and access all municipal services from one place.')}
          </p>
          <div className="flex gap-6">
            {[
              { icon: FileText, label: t('auth.regFeature1', 'Documents') },
              { icon: Home, label: t('auth.regFeature2', 'Properties') },
              { icon: MessageSquare, label: t('auth.regFeature3', 'Requests') },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm opacity-80">
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
