import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { messagesApi, usersApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Mail, MailOpen } from 'lucide-react';

const MessagesPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ receiverId: '', content: '' });

  const fetchData = async () => {
    try {
      const [mRes, uRes] = await Promise.all([messagesApi.getAll(), usersApi.getAll()]);
      setMessages(mRes.data);
      setEmployees((uRes.data || []).filter((u: any) => u.role === 'EMPLOYEE' && u.id !== user?.id));
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSend = async () => {
    try {
      await messagesApi.send(form);
      toast({ title: t('common.success'), description: t('messages.sent') });
      setDialogOpen(false);
      setForm({ receiverId: '', content: '' });
      fetchData();
    } catch { toast({ title: t('common.error'), variant: 'destructive' }); }
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.messages')}</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Send className="h-4 w-4 mr-2" />{t('messages.compose')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('messages.compose')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t('messages.to')}</Label>
                  <Select value={form.receiverId} onValueChange={v => setForm(f => ({ ...f, receiverId: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {employees.map((e: any) => (
                        <SelectItem key={e.id} value={e.id}>{e.username}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>{t('messages.content')}</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} /></div>
                <Button onClick={handleSend} className="w-full">{t('messages.send')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {loading ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">{t('common.loading')}</CardContent></Card>
          ) : messages.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">{t('common.noData')}</CardContent></Card>
          ) : messages.map((m: any) => (
            <Card key={m.id} className={`cursor-pointer transition-colors ${!m.readStatus ? 'border-primary/50 bg-primary/5' : ''}`} onClick={() => !m.readStatus && handleMarkRead(m.id)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {m.readStatus ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}
                    {m.senderName || m.senderId}
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
