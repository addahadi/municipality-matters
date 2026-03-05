import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { invoicesApi } from '@/services/api';
import { CreditCard } from 'lucide-react';

const CitizenInvoicesPage = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payDialog, setPayDialog] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [paying, setPaying] = useState(false);

  const fetchData = () => {
    setLoading(true);
    invoicesApi.getAll().then(r => setInvoices(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handlePay = async () => {
    if (!payDialog) return;
    setPaying(true);
    try {
      await invoicesApi.pay({ invoiceId: payDialog.id, amount: parseFloat(amount) });
      toast({ title: t('common.success'), description: t('invoices.paymentSuccess') });
      setPayDialog(null);
      setAmount('');
      fetchData();
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' });
    } finally { setPaying(false); }
  };

  const statusColor = (s: string) => {
    if (s === 'PAID') return 'default';
    if (s === 'PARTIAL') return 'secondary';
    return 'destructive';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.invoices')}</h1>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>{t('invoices.total')}</TableHead>
                  <TableHead>{t('invoices.amountPaid')}</TableHead>
                  <TableHead>{t('invoices.remaining')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead>{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                ) : invoices.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                ) : invoices.map((inv: any) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">{inv.id?.slice(0, 8)}</TableCell>
                    <TableCell>{inv.total} DA</TableCell>
                    <TableCell>{inv.amountPaid} DA</TableCell>
                    <TableCell>{inv.remainingAmount} DA</TableCell>
                    <TableCell><Badge variant={statusColor(inv.status)}>{inv.status}</Badge></TableCell>
                    <TableCell>
                      {inv.status !== 'PAID' && (
                        <Button size="sm" onClick={() => { setPayDialog(inv); setAmount(String(inv.remainingAmount)); }}>
                          <CreditCard className="h-4 w-4 mr-1" />{t('invoices.payEdahabia')}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={!!payDialog} onOpenChange={o => { if (!o) setPayDialog(null); }}>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('invoices.payEdahabia')}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted text-center">
                <p className="text-sm text-muted-foreground">{t('invoices.remaining')}</p>
                <p className="text-2xl font-bold text-foreground">{payDialog?.remainingAmount} DA</p>
              </div>
              <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">Edahabia</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{t('invoices.edahabiaSimulation')}</p>
              </div>
              <div><Label>{t('invoices.paymentAmount')}</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} /></div>
              <Button onClick={handlePay} disabled={paying} className="w-full">{paying ? t('common.loading') : t('invoices.confirmPayment')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CitizenInvoicesPage;
