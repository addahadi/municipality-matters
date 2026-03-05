import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { complaintsApi } from '@/services/api';
import { CheckCircle } from 'lucide-react';

const ComplaintsPage = () => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    complaintsApi.getAll().then(r => setComplaints(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleResolve = async (id: string) => {
    try {
      await complaintsApi.resolve(id);
      toast({ title: t('common.success'), description: t('complaints.resolved') });
      fetchData();
    } catch { toast({ title: t('common.error'), variant: 'destructive' }); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.complaints')}</h1>
        <Card>
          <CardContent className="p-0">
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
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                ) : complaints.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                ) : complaints.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="max-w-[300px] truncate">{c.description}</TableCell>
                    <TableCell>{c.citizenName || c.citizenId}</TableCell>
                    <TableCell><Badge variant={c.status === 'RESOLVED' ? 'default' : 'secondary'}>{c.status}</Badge></TableCell>
                    <TableCell>{new Date(c.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {c.status === 'PENDING' && (
                        <Button size="sm" onClick={() => handleResolve(c.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />{t('complaints.resolve')}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ComplaintsPage;
