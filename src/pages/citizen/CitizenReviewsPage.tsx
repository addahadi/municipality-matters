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
import { reviewSchema } from '@/lib/validations';
import { reviewsApi } from '@/services/api';
import { Plus, Loader2, Search } from 'lucide-react';

const CitizenReviewsPage = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [content, setContent] = useState('');
  const { errors, validate, clearErrors, clearFieldError } = useFormValidation(reviewSchema);

  const fetchData = () => { setLoading(true); reviewsApi.getAll().then(r => setReviews(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    if (!validate({ content })) return;
    setSaving(true);
    try {
      await reviewsApi.create({ content });
      toast({ title: t('reviews.submitted'), variant: 'success' as any });
      setDialogOpen(false); setContent(''); clearErrors(); fetchData();
    } catch { toast({ title: t('reviews.submitError'), variant: 'destructive' }); } finally { setSaving(false); }
  };

  const filtered = reviews.filter(r => {
    const matchSearch = !search || r.content?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.reviews')}</h1>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setContent(''); clearErrors(); } }}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />{t('reviews.submit')}</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('reviews.submit')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <FormFieldWrapper label={t('reviews.content')} error={errors.content} required><Textarea value={content} onChange={e => { setContent(e.target.value); clearFieldError('content'); }} rows={4} className={errors.content ? 'border-destructive' : ''} /></FormFieldWrapper>
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
                <SelectItem value="VISIBLE">VISIBLE</SelectItem>
                <SelectItem value="HIDDEN">HIDDEN</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('reviews.content')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-12 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-12 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                  ) : filtered.map((r: any) => (
                    <TableRow key={r.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="max-w-[300px] truncate">{r.content}</TableCell>
                      <TableCell><Badge variant={r.status === 'VISIBLE' ? 'default' : 'secondary'}>{r.status}</Badge></TableCell>
                      <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
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

export default CitizenReviewsPage;
