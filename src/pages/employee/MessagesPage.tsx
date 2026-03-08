import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormFieldWrapper from '@/components/ui/form-field';
import { toast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { messageSchema } from '@/lib/validations';
import { messagesApi, usersApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Mail, MailOpen, Loader2 } from 'lucide-react';

const MessagesPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ receiverId: '', content: '' });
  const { errors, validate, clearErrors, clearFieldError } = useFormValidation(messageSchema);

  const fetchData = async () => {
    try {
      const [mRes, uRes] = await Promise.all([messagesApi.getAll(), usersApi.getAll()]);
      setMessages(mRes.data);
      setEmployees((uRes.data || []).filter((u: any) => u.role === 'EMPLOYEE' && u.id !== user?.id));
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSend = async () => {
    if (!validate(form)) return;
    setSaving(true);
    try {
      await messagesApi.send(form);
      toast({ title: t('messages.sent'), variant: 'success' as any });
      setDialogOpen(false);
      setForm({ receiverId: '', content: '' });
      clearErrors();
      fetchData();
    } catch {
      toast({ title: t('messages.sendError'), variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await messagesApi.markAsRead(id);
      fetchData();
    } catch { /* */ }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.messages')}</h1>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm({ receiverId: '', content: '' }); clearErrors(); } }}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Send className="h-4 w-4" />{t('messages.compose')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('messages.compose')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <FormFieldWrapper label={t('messages.to')} error={errors.receiverId} required>
                  <Select value={form.receiverId} onValueChange={v => { setForm(f => ({ ...f, receiverId: v })); clearFieldError('receiverId'); }}>
                    <SelectTrigger className={errors.receiverId ? 'border-destructive' : ''}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {employees.map((e: any) => (
                        <SelectItem key={e.id} value={e.id}>{e.username}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>
                <FormFieldWrapper label={t('messages.content')} error={errors.content} required>
                  <Textarea value={form.content} onChange={e => { setForm(f => ({ ...f, content: e.target.value })); clearFieldError('content'); }} rows={4} className={errors.content ? 'border-destructive' : ''} />
                </FormFieldWrapper>
                <Button onClick={handleSend} className="w-full" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t('messages.send')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {loading ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">{t('common.loading')}</CardContent></Card>
          ) : messages.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">{t('common.noData')}</CardContent></Card>
          ) : messages.map((m: any) => (
            <Card
              key={m.id}
              className={`cursor-pointer transition-all hover:shadow-md ${!m.readStatus ? 'border-primary/40 bg-primary/5 shadow-sm' : ''}`}
              onClick={() => !m.readStatus && handleMarkRead(m.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {m.readStatus ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}
                    <span className={!m.readStatus ? 'font-bold' : ''}>{m.senderName || m.senderId}</span>
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">{new Date(m.date).toLocaleString()}</span>
                </div>
              </CardHeader>
              <CardContent><p className="text-sm text-foreground">{m.content}</p></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
