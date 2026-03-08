import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import FormFieldWrapper from '@/components/ui/form-field';
import { toast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { announcementSchema } from '@/lib/validations';
import { announcementsApi } from '@/services/api';
import { Plus, Pencil, Loader2, Search } from 'lucide-react';

const AnnouncementsPage = () => {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('ALL');
  const [form, setForm] = useState({ title: '', content: '', language: 'EN' as 'EN' | 'AR' });
  const { errors, validate, clearErrors, clearFieldError } = useFormValidation(announcementSchema);

  const fetchData = () => { setLoading(true); announcementsApi.getAll().then(r => setAnnouncements(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { fetchData(); }, []);

  const updateField = (field: string, value: string) => { setForm(f => ({ ...f, [field]: value })); clearFieldError(field); };

  const handleSubmit = async () => {
    if (!validate(form)) return;
    setSaving(true);
    try {
      if (editId) { await announcementsApi.update(editId, form); toast({ title: t('announcements.updated'), variant: 'success' as any }); }
      else { await announcementsApi.create(form); toast({ title: t('announcements.created'), variant: 'success' as any }); }
      setDialogOpen(false); setEditId(null); setForm({ title: '', content: '', language: 'EN' }); clearErrors(); fetchData();
    } catch { toast({ title: t('announcements.createError'), variant: 'destructive' }); } finally { setSaving(false); }
  };

  const openEdit = (a: any) => { setEditId(a.id); setForm({ title: a.title, content: a.content, language: a.language }); clearErrors(); setDialogOpen(true); };

  const filtered = announcements.filter(a => {
    const matchSearch = !search || a.title?.toLowerCase().includes(search.toLowerCase()) || a.content?.toLowerCase().includes(search.toLowerCase());
    const matchLang = filterLang === 'ALL' || a.language === filterLang;
    return matchSearch && matchLang;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.announcements')}</h1>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditId(null); setForm({ title: '', content: '', language: 'EN' }); clearErrors(); } }}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />{t('announcements.create')}</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? t('announcements.edit') : t('announcements.create')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <FormFieldWrapper label={t('announcements.titleField')} error={errors.title} required><Input value={form.title} onChange={e => updateField('title', e.target.value)} className={errors.title ? 'border-destructive' : ''} /></FormFieldWrapper>
                <FormFieldWrapper label={t('announcements.content')} error={errors.content} required><Textarea value={form.content} onChange={e => updateField('content', e.target.value)} rows={4} className={errors.content ? 'border-destructive' : ''} /></FormFieldWrapper>
                <FormFieldWrapper label={t('announcements.language')}>
                  <Select value={form.language} onValueChange={v => setForm(f => ({ ...f, language: v as 'EN' | 'AR' }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="EN">English</SelectItem><SelectItem value="AR">العربية</SelectItem></SelectContent>
                  </Select>
                </FormFieldWrapper>
                <Button onClick={handleSubmit} className="w-full" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? t('common.update') : t('common.create')}</Button>
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
            <Select value={filterLang} onValueChange={setFilterLang}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('common.filter')}: {t('announcements.language')}</SelectItem>
                <SelectItem value="EN">English</SelectItem>
                <SelectItem value="AR">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('announcements.titleField')}</TableHead>
                    <TableHead>{t('announcements.content')}</TableHead>
                    <TableHead>{t('announcements.language')}</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                  ) : filtered.map((a: any) => (
                    <TableRow key={a.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{a.content}</TableCell>
                      <TableCell><Badge variant="outline">{a.language}</Badge></TableCell>
                      <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => openEdit(a)} className="gap-1 hover:bg-primary/10 hover:text-primary">
                          <Pencil className="h-4 w-4" />{t('common.edit')}
                        </Button>
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

export default AnnouncementsPage;
