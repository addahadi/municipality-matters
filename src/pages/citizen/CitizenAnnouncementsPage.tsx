import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { announcementsApi } from '@/services/api';
import { Megaphone, Search } from 'lucide-react';

const CitizenAnnouncementsPage = () => {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('ALL');

  useEffect(() => { announcementsApi.getAll().then(r => setAnnouncements(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const filtered = announcements.filter(a => {
    const matchSearch = !search || a.title?.toLowerCase().includes(search.toLowerCase()) || a.content?.toLowerCase().includes(search.toLowerCase());
    const matchLang = filterLang === 'ALL' || a.language === filterLang;
    return matchSearch && matchLang;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.announcements')}</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} className="ps-9" />
          </div>
          <Select value={filterLang} onValueChange={setFilterLang}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t('common.filter')}: {t('announcements.language')}</SelectItem>
              <SelectItem value="EN">English</SelectItem>
              <SelectItem value="AR">العربية</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {loading ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">{t('common.loading')}</CardContent></Card>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">{t('common.noData')}</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((a: any) => (
              <Card key={a.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-lg"><Megaphone className="h-5 w-5 text-primary shrink-0" />{a.title}</CardTitle>
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
