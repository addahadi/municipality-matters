import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { invoicesApi } from '@/services/api';

const InvoicesPage = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invoicesApi.getAll().then(r => setInvoices(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusColor = (s: string) => {
    if (s === 'PAID') return 'default' as const;
    if (s === 'PARTIAL') return 'secondary' as const;
    return 'destructive' as const;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.invoices')}</h1>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t('invoices.citizen')}</TableHead>
                    <TableHead>{t('invoices.total')}</TableHead>
                    <TableHead>{t('invoices.amountPaid')}</TableHead>
                    <TableHead>{t('invoices.remaining')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                  ) : invoices.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                  ) : invoices.map((inv: any) => (
                    <TableRow key={inv.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs">{inv.id?.slice(0, 8)}</TableCell>
                      <TableCell>{inv.citizenName || inv.citizenId}</TableCell>
                      <TableCell className="font-medium">{inv.total} DA</TableCell>
                      <TableCell>{inv.amountPaid} DA</TableCell>
                      <TableCell>{inv.remainingAmount} DA</TableCell>
                      <TableCell><Badge variant={statusColor(inv.status)}>{inv.status}</Badge></TableCell>
                      <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
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

export default InvoicesPage;
