import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { reviewsApi } from '@/services/api';
import { Plus } from 'lucide-react';

const CitizenReviewsPage = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [content, setContent] = useState('');

  const fetchData = () => {
    setLoading(true);
    reviewsApi.getAll().then(r => setReviews(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    try {
      await reviewsApi.create({ content });
      toast({ title: t('common.success'), description: t('reviews.submitted') });
      setDialogOpen(false);
      setContent('');
      fetchData();
    } catch { toast({ title: t('common.error'), variant: 'destructive' }); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.reviews')}</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />{t('reviews.submit')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('reviews.submit')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>{t('reviews.content')}</Label><Textarea value={content} onChange={e => setContent(e.target.value)} rows={4} /></div>
                <Button onClick={handleSubmit} className="w-full">{t('common.submit')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('reviews.content')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                ) : reviews.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                ) : reviews.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="max-w-[300px] truncate">{r.content}</TableCell>
                    <TableCell><Badge variant={r.status === 'VISIBLE' ? 'default' : 'secondary'}>{r.status}</Badge></TableCell>
                    <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
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

export default CitizenReviewsPage;
