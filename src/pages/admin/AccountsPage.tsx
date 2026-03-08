import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormFieldWrapper from '@/components/ui/form-field';
import { toast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { accountEditSchema, accountCreateSchema } from '@/lib/validations';
import { usersApi } from '@/services/api';
import { Pencil, Trash2, Loader2, Plus, Search } from 'lucide-react';

const AccountsPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ username: '', role: 'CITIZEN' as 'ADMIN' | 'EMPLOYEE' | 'CITIZEN' });
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ username: '', nationalId: '', password: '', role: 'CITIZEN' as 'EMPLOYEE' | 'CITIZEN' });
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const editValidation = useFormValidation(accountEditSchema);
  const createValidation = useFormValidation(accountCreateSchema);

  const fetchData = () => {
    setLoading(true);
    usersApi.getAll().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!createValidation.validate(createForm)) return;
    setSaving(true);
    try {
      await usersApi.create(createForm);
      toast({ title: t('accounts.created'), variant: 'success' as any });
      setCreateOpen(false);
      setCreateForm({ username: '', nationalId: '', password: '', role: 'CITIZEN' });
      createValidation.clearErrors();
      fetchData();
    } catch {
      toast({ title: t('accounts.createError'), variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    if (!editUser || !editValidation.validate(editForm)) return;
    setSaving(true);
    try {
      await usersApi.update(editUser.id, editForm);
      toast({ title: t('accounts.updated'), variant: 'success' as any });
      setEditUser(null);
      editValidation.clearErrors();
      fetchData();
    } catch {
      toast({ title: t('accounts.updateError'), variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.delete(id);
      toast({ title: t('accounts.deleted'), variant: 'success' as any });
      fetchData();
    } catch {
      toast({ title: t('accounts.deleteError'), variant: 'destructive' });
    }
  };

  const roleColor = (r: string) => {
    if (r === 'ADMIN') return 'destructive' as const;
    if (r === 'EMPLOYEE') return 'default' as const;
    return 'secondary' as const;
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.username?.toLowerCase().includes(search.toLowerCase()) || u.nationalId?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.accounts')}</h1>
          <Dialog open={createOpen} onOpenChange={o => { setCreateOpen(o); if (!o) { setCreateForm({ username: '', nationalId: '', password: '', role: 'CITIZEN' }); createValidation.clearErrors(); } }}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />{t('accounts.create')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('accounts.create')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <FormFieldWrapper label={t('auth.username')} error={createValidation.errors.username} required>
                  <Input value={createForm.username} onChange={e => { setCreateForm(f => ({ ...f, username: e.target.value })); createValidation.clearFieldError('username'); }} className={createValidation.errors.username ? 'border-destructive' : ''} />
                </FormFieldWrapper>
                <FormFieldWrapper label={t('auth.nationalId')} error={createValidation.errors.nationalId} required>
                  <Input value={createForm.nationalId} onChange={e => { setCreateForm(f => ({ ...f, nationalId: e.target.value })); createValidation.clearFieldError('nationalId'); }} className={createValidation.errors.nationalId ? 'border-destructive' : ''} />
                </FormFieldWrapper>
                <FormFieldWrapper label={t('auth.password')} error={createValidation.errors.password} required>
                  <Input type="password" value={createForm.password} onChange={e => { setCreateForm(f => ({ ...f, password: e.target.value })); createValidation.clearFieldError('password'); }} className={createValidation.errors.password ? 'border-destructive' : ''} />
                </FormFieldWrapper>
                <FormFieldWrapper label={t('accounts.role')} required>
                  <Select value={createForm.role} onValueChange={v => setCreateForm(f => ({ ...f, role: v as any }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMPLOYEE">{t('accounts.employee')}</SelectItem>
                      <SelectItem value="CITIZEN">{t('accounts.citizen')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>
                <Button onClick={handleCreate} className="w-full" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common.create')}
                </Button>
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
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('common.filter')}: {t('accounts.allRoles')}</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="EMPLOYEE">{t('accounts.employee')}</SelectItem>
                <SelectItem value="CITIZEN">{t('accounts.citizen')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('auth.username')}</TableHead>
                    <TableHead>{t('auth.nationalId')}</TableHead>
                    <TableHead>{t('accounts.role')}</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                  ) : filtered.map((u: any) => (
                    <TableRow key={u.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{u.username}</TableCell>
                      <TableCell className="font-mono text-xs">{u.nationalId}</TableCell>
                      <TableCell><Badge variant={roleColor(u.role)}>{u.role}</Badge></TableCell>
                      <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="hover:bg-primary/10 hover:text-primary" onClick={() => { setEditUser(u); setEditForm({ username: u.username, role: u.role }); editValidation.clearErrors(); }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('accounts.confirmDelete')}</AlertDialogTitle>
                                <AlertDialogDescription>{t('accounts.deleteWarning')}</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(u.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t('common.delete')}</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={!!editUser} onOpenChange={o => { if (!o) { setEditUser(null); editValidation.clearErrors(); } }}>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('accounts.edit')}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <FormFieldWrapper label={t('auth.username')} error={editValidation.errors.username} required>
                <Input value={editForm.username} onChange={e => { setEditForm(f => ({ ...f, username: e.target.value })); editValidation.clearFieldError('username'); }} className={editValidation.errors.username ? 'border-destructive' : ''} />
              </FormFieldWrapper>
              <FormFieldWrapper label={t('accounts.role')} required>
                <Select value={editForm.role} onValueChange={v => setEditForm(f => ({ ...f, role: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="EMPLOYEE">{t('accounts.employee')}</SelectItem>
                    <SelectItem value="CITIZEN">{t('accounts.citizen')}</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
              <Button onClick={handleUpdate} className="w-full" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common.update')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AccountsPage;
