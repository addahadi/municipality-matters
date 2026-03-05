import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { usersApi } from '@/services/api';
import { Pencil, Trash2 } from 'lucide-react';

const AccountsPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ username: '', role: '' });

  const fetchData = () => {
    setLoading(true);
    usersApi.getAll().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdate = async () => {
    if (!editUser) return;
    try {
      await usersApi.update(editUser.id, editForm);
      toast({ title: t('common.success'), description: t('accounts.updated') });
      setEditUser(null);
      fetchData();
    } catch { toast({ title: t('common.error'), variant: 'destructive' }); }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.delete(id);
      toast({ title: t('common.success'), description: t('accounts.deleted') });
      fetchData();
    } catch { toast({ title: t('common.error'), variant: 'destructive' }); }
  };

  const roleColor = (r: string) => {
    if (r === 'ADMIN') return 'destructive';
    if (r === 'EMPLOYEE') return 'default';
    return 'secondary';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.accounts')}</h1>
        <Card>
          <CardContent className="p-0">
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
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                ) : users.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                ) : users.map((u: any) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.username}</TableCell>
                    <TableCell>{u.nationalId}</TableCell>
                    <TableCell><Badge variant={roleColor(u.role)}>{u.role}</Badge></TableCell>
                    <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditUser(u); setEditForm({ username: u.username, role: u.role }); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('accounts.confirmDelete')}</AlertDialogTitle>
                              <AlertDialogDescription>{t('accounts.deleteWarning')}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(u.id)}>{t('common.delete')}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={!!editUser} onOpenChange={o => { if (!o) setEditUser(null); }}>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('accounts.edit')}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>{t('auth.username')}</Label><Input value={editForm.username} onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))} /></div>
              <div>
                <Label>{t('accounts.role')}</Label>
                <Select value={editForm.role} onValueChange={v => setEditForm(f => ({ ...f, role: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="CITIZEN">Citizen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdate} className="w-full">{t('common.update')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AccountsPage;
