import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { requestsApi } from '@/services/api';
import { CheckCircle, XCircle } from 'lucide-react';

const RequestsPage = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    requestsApi.getAll().then(r => setRequests(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id: string) => {
    try {
      await requestsApi.approve(id);
      toast({ title: t('requests.approved'), variant: 'success' as any });
      fetchData();
    } catch { toast({ title: t('requests.actionError'), variant: 'destructive' }); }
  };

  const handleReject = async (id: string) => {
    try {
      await requestsApi.reject(id);
      toast({ title: t('requests.rejected'), variant: 'warning' as any });
      fetchData();
    } catch { toast({ title: t('requests.actionError'), variant: 'destructive' }); }
  };

  const statusColor = (s: string) => {
    if (s === 'APPROVED') return 'default' as const;
    if (s === 'REJECTED') return 'destructive' as const;
    return 'secondary' as const;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.requests')}</h1>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('requests.type')}</TableHead>
                    <TableHead>{t('requests.description')}</TableHead>
                    <TableHead>{t('requests.citizen')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                  ) : requests.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                  ) : requests.map((req: any) => (
                    <TableRow key={req.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{req.type}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{req.description}</TableCell>
                      <TableCell>{req.citizenName || req.citizenId}</TableCell>
                      <TableCell><Badge variant={statusColor(req.status)}>{req.status}</Badge></TableCell>
                      <TableCell>{new Date(req.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {req.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button size="sm" className="gap-1" onClick={() => handleApprove(req.id)}><CheckCircle className="h-4 w-4" />{t('requests.approve')}</Button>
                            <Button size="sm" variant="destructive" className="gap-1" onClick={() => handleReject(req.id)}><XCircle className="h-4 w-4" />{t('requests.reject')}</Button>
                          </div>
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

export default RequestsPage;
