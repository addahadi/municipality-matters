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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { announcementsApi } from '@/services/api';
import { Plus, Pencil } from 'lucide-react';

const AnnouncementsPage = () => {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', language: 'EN' });

  const fetchData = () => {
    setLoading(true);
    announcementsApi.getAll().then(r => setAnnouncements(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await announcementsApi.update(editId, form);
        toast({ title: t('common.success'), description: t('announcements.updated') });
      } else {
        await announcementsApi.create(form);
        toast({ title: t('common.success'), description: t('announcements.created') });
      }
      setDialogOpen(false);
      setEditId(null);
      setForm({ title: '', content: '', language: 'EN' });
      fetchData();
    } catch { toast({ title: t('common.error'), variant: 'destructive' }); }
  };

  const openEdit = (a: any) => {
    setEditId(a.id);
    setForm({ title: a.title, content: a.content, language: a.language });
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.announcements')}</h1>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditId(null); setForm({ title: '', content: '', language: 'EN' }); } }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />{t('announcements.create')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? t('announcements.edit') : t('announcements.create')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>{t('announcements.titleField')}</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
                <div><Label>{t('announcements.content')}</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} /></div>
                <div>
                  <Label>{t('announcements.language')}</Label>
                  <Select value={form.language} onValueChange={v => setForm(f => ({ ...f, language: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EN">English</SelectItem>
                      <SelectItem value="AR">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSubmit} className="w-full">{editId ? t('common.update') : t('common.create')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
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
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                ) : announcements.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                ) : announcements.map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.title}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{a.content}</TableCell>
                    <TableCell>{a.language}</TableCell>
                    <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => openEdit(a)}>
                        <Pencil className="h-4 w-4 mr-1" />{t('common.edit')}
                      </Button>
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

export default AnnouncementsPage;
