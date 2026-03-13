import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import FormFieldWrapper from '@/components/ui/form-field';
import { toast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { auctionSchema } from '@/lib/validations';
import { auctionsApi, propertiesApi } from '@/services/api';
import { Plus, XCircle, Loader2, Search, Eye, Users, TrendingUp, Trophy, Calendar, History } from 'lucide-react';

interface Bid {
  id: string;
  amount: string;
  date: string;
  citizenName: string;
}

interface Auction {
  id: string;
  propertyId: string;
  propertyTitle: string;
  startDate: string;
  endDate: string;
  status: string;
  startingPrice: string;
  currentPrice: string;
  finalPrice: string | null;
  createdAt: string;
}

const AuctionsPage = () => {
  const { t } = useTranslation();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [bidHistoryDialogOpen, setBidHistoryDialogOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [form, setForm] = useState({ propertyId: '', startDate: '', endDate: '', startingPrice: '' });
  const { errors, validate, clearFieldError, clearErrors } = useFormValidation(auctionSchema);

  const fetchData = async () => {
    try {
      const [aRes, pRes] = await Promise.all([auctionsApi.getAll(), propertiesApi.getAll()]);
      setAuctions(aRes.data);
      setProperties(pRes.data);
    } catch { } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateField = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    clearFieldError(field);
  };

  const handleCreate = async () => {
    if (!validate(form)) return;
    setSaving(true);
    try {
      await auctionsApi.create({
        propertyId: form.propertyId,
        startDate: form.startDate,
        endDate: form.endDate,
        startingPrice: parseFloat(form.startingPrice)
      });
      toast({ title: t('auctions.created'), variant: 'success' as any });
      setDialogOpen(false);
      setForm({ propertyId: '', startDate: '', endDate: '', startingPrice: '' });
      clearErrors();
      fetchData();
    } catch {
      toast({ title: t('auctions.createError'), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = async (id: string) => {
    try {
      await auctionsApi.close(id);
      toast({ title: t('auctions.closed'), variant: 'success' as any });
      fetchData();
      if (selectedAuction?.id === id) {
        setDetailDialogOpen(false);
      }
    } catch {
      toast({ title: t('auctions.closeError'), variant: 'destructive' });
    }
  };

  const fetchBids = async (auction: Auction) => {
    setLoadingBids(true);
    setBids([]);
    try {
      const res = await auctionsApi.getBids(auction.id);
      setBids(res.data);
    } catch {
      setBids([]);
    } finally {
      setLoadingBids(false);
    }
  };

  const handleViewDetails = async (auction: Auction) => {
    setSelectedAuction(auction);
    setDetailDialogOpen(true);
    await fetchBids(auction);
  };

  const handleViewBidHistory = async (auction: Auction) => {
    setSelectedAuction(auction);
    setBidHistoryDialogOpen(true);
    await fetchBids(auction);
  };

  const filtered = auctions.filter(a => {
    const matchSearch = !search || (a.propertyTitle || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const uniqueParticipants = new Set(bids.map(b => b.citizenName)).size;
  const highestBid = bids.length > 0 ? bids[0] : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.auctions')}</h1>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) clearErrors(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />{t('auctions.create')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('auctions.create')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <FormFieldWrapper label={t('nav.properties')} error={errors.propertyId} required>
                  <Select value={form.propertyId} onValueChange={v => updateField('propertyId', v)}>
                    <SelectTrigger className={errors.propertyId ? 'border-destructive' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>
                <div className="grid grid-cols-2 gap-4">
                  <FormFieldWrapper label={t('auctions.startDate')} error={errors.startDate} required>
                    <Input type="date" value={form.startDate} onChange={e => updateField('startDate', e.target.value)} className={errors.startDate ? 'border-destructive' : ''} />
                  </FormFieldWrapper>
                  <FormFieldWrapper label={t('auctions.endDate')} error={errors.endDate} required>
                    <Input type="date" value={form.endDate} onChange={e => updateField('endDate', e.target.value)} className={errors.endDate ? 'border-destructive' : ''} />
                  </FormFieldWrapper>
                </div>
                <FormFieldWrapper label={t('auctions.startingPrice')} error={errors.startingPrice} required>
                  <Input type="number" value={form.startingPrice} onChange={e => updateField('startingPrice', e.target.value)} className={errors.startingPrice ? 'border-destructive' : ''} />
                </FormFieldWrapper>
                <Button onClick={handleCreate} className="w-full" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common.create')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

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
                <SelectItem value="OPEN">OPEN</SelectItem>
                <SelectItem value="CLOSED">CLOSED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('nav.properties')}</TableHead>
                    <TableHead>{t('auctions.startDate')}</TableHead>
                    <TableHead>{t('auctions.endDate')}</TableHead>
                    <TableHead>{t('auctions.startingPrice')}</TableHead>
                    <TableHead>{t('auctions.currentBid')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                  ) : filtered.map((a) => (
                    <TableRow key={a.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{a.propertyTitle || a.propertyId}</TableCell>
                      <TableCell>{new Date(a.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(a.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>{a.startingPrice} DA</TableCell>
                      <TableCell className="font-semibold text-primary">{a.currentPrice} DA</TableCell>
                      <TableCell>
                        <Badge variant={a.status === 'OPEN' ? 'default' : 'secondary'}>{a.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleViewDetails(a)}>
                            <Eye className="h-4 w-4" /><span className="hidden lg:inline">{t('auctions.details')}</span>
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleViewBidHistory(a)}>
                            <History className="h-4 w-4" /><span className="hidden lg:inline">{t('auctions.bidHistory')}</span>
                          </Button>
                          {a.status === 'OPEN' && (
                            <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleClose(a.id)}>
                              <XCircle className="h-4 w-4" /><span className="hidden lg:inline">{t('auctions.close')}</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* ── Auction Details Dialog ── */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t('auctions.details')}
              </DialogTitle>
            </DialogHeader>
            {selectedAuction && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-muted-foreground mb-1">{t('auctions.startingPrice')}</div>
                      <div className="font-semibold">{selectedAuction.startingPrice} DA</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/10 border-primary/20">
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-muted-foreground mb-1">{t('auctions.highestBid')}</div>
                      <div className="font-bold text-primary">{selectedAuction.currentPrice} DA</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-muted-foreground mb-1">{t('auctions.totalBids')}</div>
                      <div className="font-semibold">{bids.length}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-muted-foreground mb-1">{t('auctions.participants')}</div>
                      <div className="font-semibold flex items-center justify-center gap-1">
                        <Users className="h-4 w-4" /> {uniqueParticipants}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Property & Dates */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('nav.properties')}</span>
                      <span className="font-medium">{selectedAuction.propertyTitle}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {t('auctions.startDate')}
                      </span>
                      <span>{new Date(selectedAuction.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {t('auctions.endDate')}
                      </span>
                      <span>{new Date(selectedAuction.endDate).toLocaleDateString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('common.status')}</span>
                      <Badge variant={selectedAuction.status === 'OPEN' ? 'default' : 'secondary'}>
                        {selectedAuction.status}
                      </Badge>
                    </div>
                    {selectedAuction.status === 'CLOSED' && highestBid && (
                      <>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-yellow-500" /> {t('auctions.winner')}
                          </span>
                          <span className="font-semibold text-primary">{highestBid.citizenName}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Open Bid History in separate modal */}
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    setDetailDialogOpen(false);
                    setBidHistoryDialogOpen(true);
                  }}
                >
                  <History className="h-4 w-4" /> {t('auctions.bidHistory')}
                </Button>

                {selectedAuction.status === 'OPEN' && (
                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={() => handleClose(selectedAuction.id)}
                  >
                    <XCircle className="h-4 w-4" /> {t('auctions.close')}
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Bid History Dialog (Separate) ── */}
        <Dialog open={bidHistoryDialogOpen} onOpenChange={setBidHistoryDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                {t('auctions.bidHistory')}
                {selectedAuction && (
                  <span className="text-muted-foreground font-normal text-sm">
                    — {selectedAuction.propertyTitle}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>

            {/* Summary row */}
            {selectedAuction && (
              <div className="grid grid-cols-3 gap-3 mb-2">
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{t('auctions.highestBid')}</div>
                    <div className="font-bold text-primary">{selectedAuction.currentPrice} DA</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{t('auctions.totalBids')}</div>
                    <div className="font-semibold">{bids.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{t('auctions.participants')}</div>
                    <div className="font-semibold flex items-center justify-center gap-1">
                      <Users className="h-4 w-4" /> {uniqueParticipants}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardContent className="p-0">
                {loadingBids ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : bids.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    {t('auctions.noBids')}
                  </div>
                ) : (
                  <ScrollArea className="h-[380px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>{t('auctions.bidder')}</TableHead>
                          <TableHead>{t('auctions.bidAmount')}</TableHead>
                          <TableHead>{t('auctions.bidDate')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bids.map((bid, idx) => (
                          <TableRow key={bid.id} className={idx === 0 ? 'bg-primary/5' : ''}>
                            <TableCell>
                              {idx === 0 ? (
                                <Trophy className="h-4 w-4 text-yellow-500" />
                              ) : (
                                idx + 1
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{bid.citizenName}</TableCell>
                            <TableCell className={idx === 0 ? 'font-bold text-primary' : ''}>
                              {bid.amount} DA
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(bid.date).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default AuctionsPage;