import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormFieldWrapper from '@/components/ui/form-field';
import { toast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { auctionSchema } from '@/lib/validations';
import { auctionsApi, propertiesApi } from '@/services/api';
import { Plus, XCircle, Loader2, Search } from 'lucide-react';

const AuctionsPage = () => {
  const { t } = useTranslation();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [form, setForm] = useState({ propertyId: '', startDate: '', endDate: '', startingPrice: '' });
  const { errors, validate, clearFieldError, clearErrors } = useFormValidation(auctionSchema);

  const fetchData = async () => {
    try {
      const [aRes, pRes] = await Promise.all([auctionsApi.getAll(), propertiesApi.getAll()]);
      setAuctions(aRes.data); setProperties(pRes.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const updateField = (field: string, value: string) => { setForm(f => ({ ...f, [field]: value })); clearFieldError(field); };

  const handleCreate = async () => {
    if (!validate(form)) return;
    setSaving(true);
    try {
      await auctionsApi.create({ propertyId: form.propertyId, startDate: form.startDate, endDate: form.endDate, startingPrice: parseFloat(form.startingPrice) });
      toast({ title: t('auctions.created'), variant: 'success' as any });
      setDialogOpen(false); setForm({ propertyId: '', startDate: '', endDate: '', startingPrice: '' }); clearErrors(); fetchData();
    } catch { toast({ title: t('auctions.createError'), variant: 'destructive' }); } finally { setSaving(false); }
  };

  const handleClose = async (id: string) => {
    try { await auctionsApi.close(id); toast({ title: t('auctions.closed'), variant: 'success' as any }); fetchData(); }
    catch { toast({ title: t('auctions.closeError'), variant: 'destructive' }); }
  };

  const filtered = auctions.filter(a => {
    const matchSearch = !search || (a.propertyTitle || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.auctions')}</h1>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) clearErrors(); }}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />{t('auctions.create')}</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('auctions.create')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <FormFieldWrapper label={t('nav.properties')} error={errors.propertyId} required>
                  <Select value={form.propertyId} onValueChange={v => updateField('propertyId', v)}>
                    <SelectTrigger className={errors.propertyId ? 'border-destructive' : ''}><SelectValue /></SelectTrigger>
                    <SelectContent>{properties.map((p: any) => (<SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>))}</SelectContent>
                  </Select>
                </FormFieldWrapper>
                <div className="grid grid-cols-2 gap-4">
                  <FormFieldWrapper label={t('auctions.startDate')} error={errors.startDate} required><Input type="date" value={form.startDate} onChange={e => updateField('startDate', e.target.value)} className={errors.startDate ? 'border-destructive' : ''} /></FormFieldWrapper>
                  <FormFieldWrapper label={t('auctions.endDate')} error={errors.endDate} required><Input type="date" value={form.endDate} onChange={e => updateField('endDate', e.target.value)} className={errors.endDate ? 'border-destructive' : ''} /></FormFieldWrapper>
                </div>
                <FormFieldWrapper label={t('auctions.startingPrice')} error={errors.startingPrice} required><Input type="number" value={form.startingPrice} onChange={e => updateField('startingPrice', e.target.value)} className={errors.startingPrice ? 'border-destructive' : ''} /></FormFieldWrapper>
                <Button onClick={handleCreate} className="w-full" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common.create')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

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
                <SelectItem value="OPEN">OPEN</SelectItem>
                <SelectItem value="CLOSED">CLOSED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('nav.properties')}</TableHead>
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
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                  ) : filtered.map((a: any) => (
                    <TableRow key={a.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{a.propertyTitle || a.propertyId}</TableCell>
                      <TableCell>{new Date(a.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(a.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>{a.startingPrice} DA</TableCell>
                      <TableCell>{a.finalPrice ? `${a.finalPrice} DA` : '—'}</TableCell>
                      <TableCell><Badge variant={a.status === 'OPEN' ? 'default' : 'secondary'}>{a.status}</Badge></TableCell>
                      <TableCell>
                        {a.status === 'OPEN' && (
                          <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleClose(a.id)}>
                            <XCircle className="h-4 w-4" />{t('auctions.close')}
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

export default AuctionsPage;
