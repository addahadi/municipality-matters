import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { auctionsApi, propertiesApi } from '@/services/api';
import { Plus, XCircle } from 'lucide-react';

const AuctionsPage = () => {
  const { t } = useTranslation();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ propertyId: '', startDate: '', endDate: '', startingPrice: '' });

  const fetchData = async () => {
    try {
      const [aRes, pRes] = await Promise.all([auctionsApi.getAll(), propertiesApi.getAll()]);
      setAuctions(aRes.data);
      setProperties(pRes.data);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    try {
      await auctionsApi.create({
        propertyId: form.propertyId,
        startDate: form.startDate,
        endDate: form.endDate,
        startingPrice: parseFloat(form.startingPrice),
      });
      toast({ title: t('common.success'), description: t('auctions.created') });
      setDialogOpen(false);
      setForm({ propertyId: '', startDate: '', endDate: '', startingPrice: '' });
      fetchData();
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' });
    }
  };

  const handleClose = async (id: string) => {
    try {
      await auctionsApi.close(id);
      toast({ title: t('common.success'), description: t('auctions.closed') });
      fetchData();
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' });
    }
  };

  const statusColor = (s: string) => {
    if (s === 'OPEN') return 'default';
    return 'secondary';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.auctions')}</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />{t('auctions.create')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('auctions.create')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t('properties.title')}</Label>
                  <Select value={form.propertyId} onValueChange={v => setForm(f => ({ ...f, propertyId: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {properties.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>{t('auctions.startDate')}</Label><Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
                  <div><Label>{t('auctions.endDate')}</Label><Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
                </div>
                <div><Label>{t('auctions.startingPrice')}</Label><Input type="number" value={form.startingPrice} onChange={e => setForm(f => ({ ...f, startingPrice: e.target.value }))} /></div>
                <Button onClick={handleCreate} className="w-full">{t('common.create')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('properties.title')}</TableHead>
                  <TableHead>{t('auctions.startDate')}</TableHead>
                  <TableHead>{t('auctions.endDate')}</TableHead>
                  <TableHead>{t('auctions.startingPrice')}</TableHead>
                  <TableHead>{t('auctions.finalPrice')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead>{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                ) : auctions.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                ) : auctions.map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.propertyTitle || a.propertyId}</TableCell>
                    <TableCell>{new Date(a.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(a.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{a.startingPrice}</TableCell>
                    <TableCell>{a.finalPrice || '—'}</TableCell>
                    <TableCell><Badge variant={statusColor(a.status)}>{a.status}</Badge></TableCell>
                    <TableCell>
                      {a.status === 'OPEN' && (
                        <Button variant="destructive" size="sm" onClick={() => handleClose(a.id)}>
                          <XCircle className="h-4 w-4 mr-1" />{t('auctions.close')}
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

export default AuctionsPage;
