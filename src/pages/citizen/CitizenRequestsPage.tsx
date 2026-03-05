import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { requestsApi } from '@/services/api';
import { Plus } from 'lucide-react';

const CitizenRequestsPage = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ type: '', description: '' });

  const fetchData = () => {
    setLoading(true);
    requestsApi.getAll().then(r => setRequests(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    try {
      await requestsApi.create(form);
      toast({ title: t('common.success'), description: t('requests.submitted') });
      setDialogOpen(false);
      setForm({ type: '', description: '' });
      fetchData();
    } catch { toast({ title: t('common.error'), variant: 'destructive' }); }
  };

  const statusColor = (s: string) => {
    if (s === 'APPROVED') return 'default';
    if (s === 'REJECTED') return 'destructive';
    return 'secondary';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.requests')}</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />{t('requests.submit')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('requests.submit')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>{t('requests.type')}</Label><Input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} /></div>
                <div><Label>{t('requests.description')}</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} /></div>
                <Button onClick={handleSubmit} className="w-full">{t('common.submit')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('requests.type')}</TableHead>
                  <TableHead>{t('requests.description')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                ) : requests.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                ) : requests.map((req: any) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.type}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{req.description}</TableCell>
                    <TableCell><Badge variant={statusColor(req.status)}>{req.status}</Badge></TableCell>
                    <TableCell>{new Date(req.date).toLocaleDateString()}</TableCell>
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

export default CitizenRequestsPage;
