import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormFieldWrapper from '@/components/ui/form-field';
import { toast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { requestSchema } from '@/lib/validations';
import { requestsApi } from '@/services/api';
import { Plus, Loader2, Search } from 'lucide-react';

const CitizenRequestsPage = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [form, setForm] = useState({ type: '', description: '' });
  const { errors, validate, clearErrors, clearFieldError } = useFormValidation(requestSchema);

  const fetchData = () => { setLoading(true); requestsApi.getAll().then(r => setRequests(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { fetchData(); }, []);

  const updateField = (field: string, value: string) => { setForm(f => ({ ...f, [field]: value })); clearFieldError(field); };

  const handleSubmit = async () => {
    if (!validate(form)) return;
    setSaving(true);
    try {
      await requestsApi.create(form);
      toast({ title: t('requests.submitted'), variant: 'success' as any });
      setDialogOpen(false); setForm({ type: '', description: '' }); clearErrors(); fetchData();
    } catch { toast({ title: t('requests.submitError'), variant: 'destructive' }); } finally { setSaving(false); }
  };

  const statusColor = (s: string) => { if (s === 'APPROVED') return 'default' as const; if (s === 'REJECTED') return 'destructive' as const; return 'secondary' as const; };

  const filtered = requests.filter(req => {
    const matchSearch = !search || req.type?.toLowerCase().includes(search.toLowerCase()) || req.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || req.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.requests')}</h1>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm({ type: '', description: '' }); clearErrors(); } }}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />{t('requests.submit')}</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('requests.submit')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <FormFieldWrapper label={t('requests.type')} error={errors.type} required><Input value={form.type} onChange={e => updateField('type', e.target.value)} className={errors.type ? 'border-destructive' : ''} /></FormFieldWrapper>
                <FormFieldWrapper label={t('requests.description')} error={errors.description} required><Textarea value={form.description} onChange={e => updateField('description', e.target.value)} rows={4} className={errors.description ? 'border-destructive' : ''} /></FormFieldWrapper>
                <Button onClick={handleSubmit} className="w-full" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common.submit')}</Button>
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
                <SelectItem value="PENDING">{t('common.pending')}</SelectItem>
                <SelectItem value="APPROVED">{t('common.approved')}</SelectItem>
                <SelectItem value="REJECTED">{t('common.rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
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
                    <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                  ) : filtered.map((req: any) => (
                    <TableRow key={req.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{req.type}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{req.description}</TableCell>
                      <TableCell><Badge variant={statusColor(req.status)}>{req.status}</Badge></TableCell>
                      <TableCell>{new Date(req.date).toLocaleDateString()}</TableCell>
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

export default CitizenRequestsPage;
