import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormFieldWrapper from "@/components/ui/form-field";
import { propertiesApi, invoicesApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import DahabiaPaymentDialog from "@/components/payment/DahabiaPaymentDialog";
import {
  Search,
  MapPin,
  Maximize2,
  FileText,
  ShoppingCart,
  Loader2,
} from "lucide-react";

type PropertyStatus = "AVAILABLE" | "RENTED" | "AUCTION" | "CLOSED";

interface Property {
  id: string;
  title: string;
  location: string;
  superficie: number;
  status: PropertyStatus;
  cahierPrice: number;
  startingAuctionPrice: number;
  imageUrl?: string;
}

const statusColors: Record<PropertyStatus, string> = {
  AVAILABLE: "bg-success text-success-foreground",
  RENTED: "bg-info text-info-foreground",
  AUCTION: "bg-warning text-warning-foreground",
  CLOSED: "bg-muted text-muted-foreground",
};

const CitizenPropertiesPage = () => {
  const { t } = useTranslation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [paidCahiers, setPaidCahiers] = useState<Set<string>>(new Set());
  const [purchasing, setPurchasing] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  useEffect(() => {
    propertiesApi
      .getAll()
      .then((res) => setProperties(res.data))
      .catch(() => {});
  }, []);

  const handlePurchaseCahier = async (property: Property) => {
    setPaymentDialogOpen(true);
  };

  const processPayment = async () => {
    if (!selectedProperty) return;
    setPaymentDialogOpen(false);
    setPurchasing(true);
    try {
      // Step 1: Create invoice
      const invoiceRes = await invoicesApi.create({
        total: selectedProperty.cahierPrice,
      });

      // Step 2: Pay the full invoice
      await invoicesApi.pay({
        invoiceId: invoiceRes.data.id,
        amount: selectedProperty.cahierPrice,
      });

      // Step 3: Record cahier purchase
      const purchaseRes = await propertiesApi.purchaseCahier(selectedProperty.id);
      console.log("Purchase response:", purchaseRes.data);

      // Step 4: Verify purchase was recorded by fetching it
      const myPurchases = await propertiesApi.getMyPurchases();
      const purchased = myPurchases.data.some(
        (p: any) => p.propertyId === selectedProperty.id,
      );

      if (!purchased) {
        throw new Error("Purchase verification failed - please try again");
      }

      toast({ title: t("property.purchased"), variant: "success" as any });
      setPaidCahiers((prev) => new Set(prev).add(selectedProperty.id));
      setPurchaseDialogOpen(false);
    } catch (err: any) {
      console.error("Purchase error:", err);
      toast({
        title:
          err?.response?.data?.message ||
          err?.message ||
          t("property.purchaseError"),
        variant: "destructive",
      });
    } finally {
      setPurchasing(false);
    }
  };

  const viewCahier = async (propertyId: string) => {
    try {
      const response = await propertiesApi.getCahier(propertyId);
      window.open(response.data.url, "_blank");
    } catch (err: any) {
      if (err?.response?.status === 403) {
        toast({ title: t("common.error"), variant: "destructive" });
      } else {
        toast({ title: "PDF not available", variant: "destructive" });
      }
    }
  };

  const openPurchaseDialog = (property: Property) => {
    setSelectedProperty(property);
    setPurchaseDialogOpen(true);
  };

  const filtered = properties.filter((p) => {
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">
          {t("nav.properties")}
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                {t("common.filter")}: {t("common.status")}
              </SelectItem>
              <SelectItem value="AVAILABLE">
                {t("property.available")}
              </SelectItem>
              <SelectItem value="RENTED">{t("property.rented")}</SelectItem>
              <SelectItem value="AUCTION">{t("property.auction")}</SelectItem>
              <SelectItem value="CLOSED">{t("property.closed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            {t("common.noData")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <Card
                key={p.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                {p.imageUrl ? (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
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
                      {p.title}
                    </CardTitle>
                    <Badge className={statusColors[p.status]}>
                      {t(`property.${p.status.toLowerCase()}`)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{p.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Maximize2 className="h-4 w-4 shrink-0" />
                    <span>{p.superficie} m²</span>
                  </div>
                  <p className="text-foreground font-bold text-base pt-1">
                    {p.cahierPrice} DA
                  </p>
                  <div className="pt-2">
                    {paidCahiers.has(p.id) ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => viewCahier(p.id)}
                      >
                        <FileText className="h-4 w-4" />
                        {t("property.viewCahier")}
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => openPurchaseDialog(p)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {t("property.purchaseCahier")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Purchase Dialog */}
        <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("property.purchaseDialog")}</DialogTitle>
            </DialogHeader>
            {selectedProperty && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t("property.purchaseDescription")}
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">
                      {t("property.name")}:
                    </span>
                    <p className="text-foreground">{selectedProperty.title}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      {t("property.location")}:
                    </span>
                    <p className="text-foreground">
                      {selectedProperty.location}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      {t("property.cahierPrice")}:
                    </span>
                    <p className="text-foreground font-bold">
                      {selectedProperty.cahierPrice} DA
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setPurchaseDialogOpen(false)}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    onClick={() => handlePurchaseCahier(selectedProperty)}
                    disabled={purchasing}
                  >
                    {purchasing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t("common.purchase")
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <DahabiaPaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          amount={selectedProperty?.cahierPrice || 0}
          onSuccess={processPayment}
        />
      </div>
    </DashboardLayout>
  );
};

export default CitizenPropertiesPage;
