import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormFieldWrapper from '@/components/ui/form-field';
import { toast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { accountEditSchema } from '@/lib/validations';
import { usersApi } from '@/services/api';
import { Pencil, Trash2, Loader2 } from 'lucide-react';

const AccountsPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ username: '', role: 'CITIZEN' as 'ADMIN' | 'EMPLOYEE' | 'CITIZEN' });
  const { errors, validate, clearErrors, clearFieldError } = useFormValidation(accountEditSchema);

  const fetchData = () => {
    setLoading(true);
    usersApi.getAll().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdate = async () => {
    if (!editUser || !validate(editForm)) return;
    setSaving(true);
    try {
      await usersApi.update(editUser.id, editForm);
      toast({ title: t('accounts.updated'), variant: 'success' as any });
      setEditUser(null);
      clearErrors();
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.accounts')}</h1>
        <Card>
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
                  ) : users.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                  ) : users.map((u: any) => (
                    <TableRow key={u.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{u.username}</TableCell>
                      <TableCell className="font-mono text-xs">{u.nationalId}</TableCell>
                      <TableCell><Badge variant={roleColor(u.role)}>{u.role}</Badge></TableCell>
                      <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="hover:bg-primary/10 hover:text-primary" onClick={() => { setEditUser(u); setEditForm({ username: u.username, role: u.role }); clearErrors(); }}>
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

        <Dialog open={!!editUser} onOpenChange={o => { if (!o) { setEditUser(null); clearErrors(); } }}>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('accounts.edit')}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <FormFieldWrapper label={t('auth.username')} error={errors.username} required>
                <Input value={editForm.username} onChange={e => { setEditForm(f => ({ ...f, username: e.target.value })); clearFieldError('username'); }} className={errors.username ? 'border-destructive' : ''} />
              </FormFieldWrapper>
              <FormFieldWrapper label={t('accounts.role')} required>
                <Select value={editForm.role} onValueChange={v => setEditForm(f => ({ ...f, role: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="CITIZEN">Citizen</SelectItem>
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
