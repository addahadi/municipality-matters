import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormFieldWrapper from "@/components/ui/form-field";
import { auctionsApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { bidSchema } from "@/lib/validations";
import { Search, Gavel, Calendar, DollarSign, Loader2, Clock } from "lucide-react";
import CountdownTimer from "@/components/ui/countdown-timer";

interface Auction {
  id: string;
  propertyId: string;
  propertyTitle: string;
  startDate: string;
  endDate: string;
  startingPrice: number;
  currentPrice: number;
  status: string;
  propertyImage?: string;
}

const CitizenAuctionsPage = () => {
  const { t } = useTranslation();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [search, setSearch] = useState("");
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { errors, validate, clearErrors, clearFieldError } =
    useFormValidation(bidSchema);

  const fetchAuctions = async () => {
    try {
      const res = await auctionsApi.getAll();
      setAuctions(res.data.filter((a: Auction) => a.status === "OPEN"));
    } catch {}
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuction) return;

    if (!validate({ amount: bidAmount })) return;

    const amount = parseFloat(bidAmount);
    if (amount <= selectedAuction.currentPrice) {
      toast({
        title: t("auctions.bidTooLow"),
        description: t("auctions.bidMustBeHigher"),
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await auctionsApi.placeBid(selectedAuction.id, { amount });
      toast({ title: t("auctions.bidPlaced"), variant: "success" as any });
      setBidDialogOpen(false);
      setBidAmount("");
      clearErrors();
      fetchAuctions();
    } catch {
      toast({ title: t("auctions.bidError"), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const openBidDialog = (auction: Auction) => {
    setSelectedAuction(auction);
    setBidAmount("");
    clearErrors();
    setBidDialogOpen(true);
  };

  const filtered = auctions.filter(
    (a) =>
      !search || a.propertyTitle?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">
            {t("nav.auctions")}
          </h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            {t("common.noData")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((auction) => (
              <Card
                key={auction.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                {auction.propertyImage ? (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={auction.propertyImage}
                      alt={auction.propertyTitle}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground italic">
                    {t("property.noImage")}
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-snug">
                      {auction.propertyTitle}
                    </CardTitle>
                    <Badge className="bg-warning text-warning-foreground">
                      {t("property.auction")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-4 text-sm mt-2">
                    <CountdownTimer endDate={auction.endDate} />
                    
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {t("auctions.startingPrice")}
                        </span>
                        <span className="font-medium">{auction.startingPrice} DA</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1 text-primary">
                          <DollarSign className="h-3 w-3" />
                          {t("auctions.currentBid")}
                        </span>
                        <span className="font-bold text-primary">{auction.currentPrice} DA</span>
                      </div>
                    </div>
                  </div>
                  <Dialog
                    open={bidDialogOpen && selectedAuction?.id === auction.id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setBidDialogOpen(false);
                        setSelectedAuction(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full gap-2"
                        onClick={() => openBidDialog(auction)}
                      >
                        <Gavel className="h-4 w-4" />
                        {t("auctions.placeBid")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("auctions.placeBid")}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handlePlaceBid} className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            {t("property.name")}:{" "}
                            <span className="font-medium text-foreground">
                              {auction.propertyTitle}
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("auctions.currentBid")}:{" "}
                            <span className="font-medium text-foreground">
                              {auction.currentPrice} DA
                            </span>
                          </p>
                        </div>
                        <FormFieldWrapper
                          label={t("auctions.yourBid")}
                          error={errors.amount}
                          required
                        >
                          <Input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => {
                              setBidAmount(e.target.value);
                              clearFieldError("amount");
                            }}
                            placeholder={`${t("common.minimum")}: ${auction.currentPrice + 1} DA`}
                            className={
                              errors.amount ? "border-destructive" : ""
                            }
                          />
                        </FormFieldWrapper>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => setBidDialogOpen(false)}
                          >
                            {t("common.cancel")}
                          </Button>
                          <Button type="submit" disabled={submitting}>
                            {submitting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              t("auctions.placeBid")
                            )}
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
