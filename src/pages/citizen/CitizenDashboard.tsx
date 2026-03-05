import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, FileText, ClipboardList, Megaphone } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const CitizenDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const stats = [
    { label: t('nav.properties'), value: '—', icon: Building2, color: 'text-primary' },
    { label: t('nav.invoices'), value: '—', icon: FileText, color: 'text-warning' },
    { label: t('nav.requests'), value: '—', icon: ClipboardList, color: 'text-info' },
    { label: t('nav.announcements'), value: '—', icon: Megaphone, color: 'text-accent' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('dashboard.welcome')}, {user?.username}</h1>
          <p className="text-muted-foreground">{t('app.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
