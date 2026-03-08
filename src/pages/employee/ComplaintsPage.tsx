import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { complaintsApi } from '@/services/api';
import { CheckCircle, Search } from 'lucide-react';

const ComplaintsPage = () => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchData = () => { setLoading(true); complaintsApi.getAll().then(r => setComplaints(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { fetchData(); }, []);

  const handleResolve = async (id: string) => {
    try { await complaintsApi.resolve(id); toast({ title: t('complaints.resolved'), variant: 'success' as any }); fetchData(); }
    catch { toast({ title: t('complaints.resolveError'), variant: 'destructive' }); }
  };

  const filtered = complaints.filter(c => {
    const matchSearch = !search || c.description?.toLowerCase().includes(search.toLowerCase()) || (c.citizenName || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.complaints')}</h1>
        <Card>
          <div className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} className="ps-9" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('common.filter')}: {t('common.status')}</SelectItem>
                <SelectItem value="PENDING">{t('common.pending')}</SelectItem>
                <SelectItem value="RESOLVED">{t('common.resolved')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('complaints.description')}</TableHead>
                    <TableHead>{t('complaints.citizen')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                  ) : filtered.map((c: any) => (
                    <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="max-w-[300px] truncate">{c.description}</TableCell>
                      <TableCell>{c.citizenName || c.citizenId}</TableCell>
                      <TableCell><Badge variant={c.status === 'RESOLVED' ? 'default' : 'secondary'}>{c.status}</Badge></TableCell>
                      <TableCell>{new Date(c.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {c.status === 'PENDING' && (
                          <Button size="sm" className="gap-1" onClick={() => handleResolve(c.id)}>
                            <CheckCircle className="h-4 w-4" />{t('complaints.resolve')}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ComplaintsPage;
