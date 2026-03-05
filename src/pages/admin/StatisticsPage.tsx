import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { statisticsApi } from '@/services/api';
import { Building2, Users, FileText, Gavel } from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', 'hsl(var(--destructive))'];

const StatisticsPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statisticsApi.getPropertyStats()
      .then(r => setStats(r.data))
      .catch(() => {
        // Fallback mock data for demo
        setStats({
          totalProperties: 156,
          totalUsers: 89,
          totalInvoices: 234,
          totalAuctions: 12,
          propertyByStatus: [
            { name: 'AVAILABLE', value: 80 },
            { name: 'RENTED', value: 45 },
            { name: 'AUCTION', value: 20 },
            { name: 'CLOSED', value: 11 },
          ],
          monthlyRevenue: [
            { month: 'Jan', revenue: 45000 },
            { month: 'Feb', revenue: 52000 },
            { month: 'Mar', revenue: 49000 },
            { month: 'Apr', revenue: 63000 },
            { month: 'May', revenue: 58000 },
            { month: 'Jun', revenue: 71000 },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">{t('common.loading')}</div>
      </DashboardLayout>
    );
  }

  const summaryCards = [
    { label: t('statistics.totalProperties'), value: stats?.totalProperties || 0, icon: Building2, color: 'text-primary' },
    { label: t('statistics.totalUsers'), value: stats?.totalUsers || 0, icon: Users, color: 'text-accent-foreground' },
    { label: t('statistics.totalInvoices'), value: stats?.totalInvoices || 0, icon: FileText, color: 'text-muted-foreground' },
    { label: t('statistics.totalAuctions'), value: stats?.totalAuctions || 0, icon: Gavel, color: 'text-destructive' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.statistics')}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </CardHeader>
              <CardContent><p className="text-3xl font-bold text-foreground">{s.value}</p></CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>{t('statistics.propertyByStatus')}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={stats?.propertyByStatus || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {(stats?.propertyByStatus || []).map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{t('statistics.monthlyRevenue')}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.monthlyRevenue || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StatisticsPage;
