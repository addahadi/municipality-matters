import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { complaintsApi } from '@/services/api';
import { Plus } from 'lucide-react';

const CitizenComplaintsPage = () => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [description, setDescription] = useState('');

  const fetchData = () => {
    setLoading(true);
    complaintsApi.getAll().then(r => setComplaints(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    try {
      await complaintsApi.create({ description });
      toast({ title: t('common.success'), description: t('complaints.submitted') });
      setDialogOpen(false);
      setDescription('');
      fetchData();
    } catch { toast({ title: t('common.error'), variant: 'destructive' }); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.complaints')}</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />{t('complaints.submit')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('complaints.submit')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>{t('complaints.description')}</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} /></div>
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
                  <TableHead>{t('complaints.description')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                ) : complaints.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                ) : complaints.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="max-w-[300px] truncate">{c.description}</TableCell>
                    <TableCell><Badge variant={c.status === 'RESOLVED' ? 'default' : 'secondary'}>{c.status}</Badge></TableCell>
                    <TableCell>{new Date(c.date).toLocaleDateString()}</TableCell>
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

export default CitizenComplaintsPage;
