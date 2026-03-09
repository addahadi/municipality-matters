import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Gavel, ClipboardList } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { statisticsApi } from '@/services/api';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    statisticsApi.getAdminStats().then(r => setData(r.data)).catch(() => {});
  }, []);

  const stats = [
    { label: t('dashboard.totalProperties'), value: data?.totalProperties ?? '—', icon: Building2, bg: 'bg-primary/10', color: 'text-primary' },
    { label: t('dashboard.totalCitizens'), value: data?.totalCitizens ?? '—', icon: Users, bg: 'bg-accent/10', color: 'text-accent' },
    { label: t('dashboard.activeAuctions'), value: data?.activeAuctions ?? '—', icon: Gavel, bg: 'bg-warning/10', color: 'text-warning' },
    { label: t('dashboard.pendingRequests'), value: data?.pendingRequests ?? '—', icon: ClipboardList, bg: 'bg-info/10', color: 'text-info' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-7">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{t('dashboard.welcome')}, {user?.username || 'Admin'}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t('app.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground py-6 text-center text-sm">{t('common.noData')}</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
