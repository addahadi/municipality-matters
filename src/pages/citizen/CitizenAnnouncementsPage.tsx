import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { announcementsApi } from '@/services/api';
import { Megaphone } from 'lucide-react';

const CitizenAnnouncementsPage = () => {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    announcementsApi.getAll().then(r => setAnnouncements(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.announcements')}</h1>
        {loading ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">{t('common.loading')}</CardContent></Card>
        ) : announcements.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">{t('common.noData')}</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((a: any) => (
              <Card key={a.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Megaphone className="h-5 w-5 text-primary shrink-0" />
                      {a.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{a.language}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent><p className="text-foreground leading-relaxed">{a.content}</p></CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CitizenAnnouncementsPage;
