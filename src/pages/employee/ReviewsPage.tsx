import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { reviewsApi } from '@/services/api';
import { EyeOff } from 'lucide-react';

const ReviewsPage = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    reviewsApi.getAll().then(r => setReviews(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleHide = async (id: string) => {
    try {
      await reviewsApi.hide(id);
      toast({ title: t('reviews.hidden'), variant: 'success' as any });
      fetchData();
    } catch { toast({ title: t('reviews.hideError'), variant: 'destructive' }); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.reviews')}</h1>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('reviews.content')}</TableHead>
                    <TableHead>{t('reviews.citizen')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                  ) : reviews.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                  ) : reviews.map((r: any) => (
                    <TableRow key={r.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="max-w-[300px] truncate">{r.content}</TableCell>
                      <TableCell>{r.citizenName || r.citizenId}</TableCell>
                      <TableCell><Badge variant={r.status === 'VISIBLE' ? 'default' : 'secondary'}>{r.status}</Badge></TableCell>
                      <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {r.status === 'VISIBLE' && (
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => handleHide(r.id)}>
                            <EyeOff className="h-4 w-4" />{t('reviews.hide')}
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
      </div>
    </DashboardLayout>
  );
};

export default ReviewsPage;
