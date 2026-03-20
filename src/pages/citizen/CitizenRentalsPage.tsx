import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Maximize2,
  FileText,
  Download,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { propertiesApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import DahabiaPaymentDialog from "@/components/payment/DahabiaPaymentDialog";

interface Property {
  id: string;
  title: string;
  superficie: number;
  location: string;
  status: string;
  rentalContractPDF: string | null;
  imageUrl: string | null;
  registrationFeesPaid?: boolean;
  guaranteesPaid?: boolean;
}

const CitizenRentalsPage = () => {
  const { t } = useTranslation();
  const [rentals, setRentals] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{ id: string; type: "registration" | "guarantees" } | null>(null);


  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const res = await propertiesApi.getMyRentals();
      setRentals(res.data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      toast({
        title: t("common.error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadContract = (url: string) => {
    window.open(url, "_blank");
  };

  const openPaymentDialog = (id: string, type: "registration" | "guarantees") => {
    setSelectedPayment({ id, type });
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedPayment) return;
    try {
      if (selectedPayment.type === "registration") {
        await propertiesApi.payRegistrationFees(selectedPayment.id);
        toast({ title: t("property.registrationFeesPaid"), variant: "success" as any });
      } else {
        await propertiesApi.payGuarantees(selectedPayment.id);
        toast({ title: t("property.guaranteesPaid"), variant: "success" as any });
      }
      setPaymentDialogOpen(false);
      setSelectedPayment(null);
      fetchRentals();
    } catch (error) {
      console.error("Payment error:", error);
      toast({ title: t("common.error"), variant: "destructive" });
    }
  };


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("nav.myRentals")}
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : rentals.length === 0 ? (
          <Card className="border-dashed flex flex-col items-center justify-center py-20 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {t("common.noData")}
            </CardTitle>
            <CardDescription className="max-w-[300px] mt-1">
              {t("property.noRentals", "You don't have any rented properties yet.")}
            </CardDescription>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((property) => (
              <Card key={property.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="h-48 overflow-hidden relative">
                  {property.imageUrl ? (
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md border-none shadow-lg">
                    {t(`property.${property.status.toLowerCase()}`, property.status)}
                  </Badge>
                </div>

                <CardContent className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors truncate">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-muted-foreground mt-2 text-sm">
                      <MapPin className="h-3.5 w-3.5 me-1.5 shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="h-4 w-4" />
                      <span>{property.superficie} m²</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50">
                    {!property.registrationFeesPaid || !property.guaranteesPaid ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-3 text-warning font-medium">
                          <AlertCircle className="h-4 w-4" />
                          {t("property.pendingPayments")}
                        </div>
                        {!property.registrationFeesPaid && (
                          <Button
                            className="w-full"
                            variant="default"
                            onClick={() => openPaymentDialog(property.id, "registration")}
                          >
                            {t("property.payRegistrationFees")}
                          </Button>
                        )}
                        {!property.guaranteesPaid && (
                          <Button
                            className="w-full"
                            variant="secondary"
                            onClick={() => openPaymentDialog(property.id, "guarantees")}
                          >
                            {t("property.payGuarantees")}
                          </Button>
                        )}
                      </div>
                    ) : property.rentalContractPDF ? (
                      <Button
                        className="w-full gap-2 shadow-sm"
                        onClick={() => handleDownloadContract(property.rentalContractPDF!)}
                      >
                        <FileText className="h-4 w-4" />
                        {t("property.viewContract")}
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-muted/50 text-muted-foreground text-sm font-medium">
                        <AlertCircle className="h-4 w-4" />
                        {t("property.noContract")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <DahabiaPaymentDialog
        open={paymentDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPaymentDialogOpen(false);
            setSelectedPayment(null);
          }
        }}
        onSuccess={handlePaymentSuccess}
        amount={selectedPayment?.type === "registration" ? 5000 : 15000}
      />
    </DashboardLayout>
  );
};

export default CitizenRentalsPage;
