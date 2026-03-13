import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormFieldWrapper from '@/components/ui/form-field';
import { toast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { paymentSchema } from '@/lib/validations';
import { invoicesApi } from '@/services/api';
import DahabiaPaymentDialog from '@/components/payment/DahabiaPaymentDialog';
import { CreditCard, Loader2, Search } from 'lucide-react';

const CitizenInvoicesPage = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payDialog, setPayDialog] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [paying, setPaying] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const { errors, validate, clearErrors, clearFieldError } = useFormValidation(paymentSchema);

  const fetchData = () => { setLoading(true); invoicesApi.getAll().then(r => setInvoices(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { fetchData(); }, []);

  const handlePay = async () => {
    setPaymentDialogOpen(true);
  };

  const processPayment = async () => {
    if (!payDialog || !validate({ amount })) return;
    setPaymentDialogOpen(false);
    setPaying(true);
    try {
      await invoicesApi.pay({ invoiceId: payDialog.id, amount: parseFloat(amount) });
      toast({ title: t('invoices.paymentSuccess'), variant: 'success' as any });
      setPayDialog(null); setAmount(''); clearErrors(); fetchData();
    } catch { toast({ title: t('invoices.paymentError'), variant: 'destructive' }); } finally { setPaying(false); }
  };

  const statusColor = (s: string) => { if (s === 'PAID') return 'default' as const; if (s === 'PARTIAL') return 'secondary' as const; return 'destructive' as const; };

  const filtered = invoices.filter(inv => {
    const matchSearch = !search || inv.id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.invoices')}</h1>
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
                <SelectItem value="PAID">{t('common.paid')}</SelectItem>
                <SelectItem value="PARTIAL">{t('common.partial')}</SelectItem>
                <SelectItem value="UNPAID">{t('common.unpaid')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
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
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                  ) : filtered.map((inv: any) => (
                    <TableRow key={inv.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs">{inv.id?.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium">{inv.total} DA</TableCell>
                      <TableCell>{inv.amountPaid} DA</TableCell>
                      <TableCell>{inv.remainingAmount} DA</TableCell>
                      <TableCell><Badge variant={statusColor(inv.status)}>{inv.status}</Badge></TableCell>
                      <TableCell>
                        {inv.status !== 'PAID' && (
                          <Button size="sm" className="gap-1" onClick={() => { setPayDialog(inv); setAmount(String(inv.remainingAmount)); clearErrors(); }}>
                            <CreditCard className="h-4 w-4" />{t('invoices.payEdahabia')}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <DahabiaPaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          amount={parseFloat(amount) || 0}
          onSuccess={processPayment}
        />
      </div>
    </DashboardLayout>
  );
};

export default CitizenInvoicesPage;
