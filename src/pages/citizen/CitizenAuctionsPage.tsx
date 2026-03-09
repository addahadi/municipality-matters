import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FormFieldWrapper from '@/components/ui/form-field';
import { auctionsApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Search, Gavel, Calendar, DollarSign, Loader2 } from 'lucide-react';

interface Auction {
  id: string;
  propertyId: string;
  propertyTitle: string;
  startDate: string;
  endDate: string;
  startingPrice: number;
  currentPrice: number;
  status: string;
}

const CitizenAuctionsPage = () => {
  const { t } = useTranslation();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [search, setSearch] = useState('');
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAuctions = async () => {
    try {
      const res = await auctionsApi.getAll();
      setAuctions(res.data.filter((a: Auction) => a.status === 'OPEN'));
    } catch {}
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuction || !bidAmount) return;

    const amount = parseFloat(bidAmount);
    if (amount <= selectedAuction.currentPrice) {
      toast({
        title: t('auctions.bidTooLow'),
        description: t('auctions.bidMustBeHigher'),
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await auctionsApi.placeBid(selectedAuction.id, { amount });
      toast({ title: t('auctions.bidPlaced'), variant: 'success' as any });
      setBidDialogOpen(false);
      setBidAmount('');
      fetchAuctions();
    } catch {
      toast({ title: t('auctions.bidError'), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const openBidDialog = (auction: Auction) => {
    setSelectedAuction(auction);
    setBidAmount('');
    setBidDialogOpen(true);
  };

  const filtered = auctions.filter(
    (a) =>
      !search ||
      a.propertyTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.auctions')}</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">{t('common.noData')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((auction) => (
              <Card key={auction.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-snug">{auction.propertyTitle}</CardTitle>
                    <Badge className="bg-warning text-warning-foreground">{t('property.auction')}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>
                        {t('auctions.endsOn')}: {new Date(auction.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4 shrink-0" />
                      <span>
                        {t('auctions.startingPrice')}: {auction.startingPrice} DA
                      </span>
                    </div>
                    <p className="text-foreground font-bold text-base pt-1">
                      {t('auctions.currentBid')}: {auction.currentPrice} DA
                    </p>
                  </div>
                  <Dialog open={bidDialogOpen && selectedAuction?.id === auction.id} onOpenChange={(open) => {
                    if (!open) {
                      setBidDialogOpen(false);
                      setSelectedAuction(null);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button className="w-full gap-2" onClick={() => openBidDialog(auction)}>
                        <Gavel className="h-4 w-4" />
                        {t('auctions.placeBid')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('auctions.placeBid')}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handlePlaceBid} className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            {t('property.name')}: <span className="font-medium text-foreground">{auction.propertyTitle}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t('auctions.currentBid')}: <span className="font-medium text-foreground">{auction.currentPrice} DA</span>
                          </p>
                        </div>
                        <FormFieldWrapper label={t('auctions.yourBid')} required>
                          <Input
                            type="number"
                            step="0.01"
                            min={auction.currentPrice + 1}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder={`${t('common.minimum')}: ${auction.currentPrice + 1} DA`}
                          />
                        </FormFieldWrapper>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" type="button" onClick={() => setBidDialogOpen(false)}>
                            {t('common.cancel')}
                          </Button>
                          <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('auctions.placeBid')}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CitizenAuctionsPage;
