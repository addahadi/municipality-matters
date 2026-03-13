import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";

interface DahabiaPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  amount: number;
}

const DahabiaPaymentDialog: React.FC<DahabiaPaymentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  amount,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gradient-to-br from-background to-muted/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {t("invoices.dahabiaTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Visual Card Representation */}
          <div className="relative h-48 w-full rounded-xl bg-gradient-to-r from-[#e67e22] to-[#f39c12] p-6 text-white shadow-xl overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                <div className="h-32 w-32 border-8 border-white rounded-full translate-x-12 -translate-y-12"></div>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="font-bold text-xl italic tracking-widest text-[#2c3e50] bg-white/30 px-2 rounded">Dahabia</span>
              <div className="h-10 w-14 bg-yellow-400/80 rounded-md border border-yellow-500 shadow-inner flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-3 gap-0.5 h-full w-full p-2 opacity-50">
                    {[...Array(9)].map((_, i) => <div key={i} className="bg-black/20 rounded-full"></div>)}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xl font-mono tracking-[0.25em] drop-shadow-md">
                {cardNumber.padEnd(16, "•").replace(/(.{4})/g, "$1 ")}
              </p>
            </div>

            <div className="mt-6 flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase opacity-80 tracking-tighter">{t("invoices.expiryDate")}</p>
                <p className="font-mono text-sm">{expiry || "MM/YY"}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase opacity-80 tracking-tighter">CVV</p>
                <p className="font-mono text-sm">{cvv ? "•••" : "000"}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center flex-col items-center gap-1 text-center bg-primary/5 p-3 rounded-lg border border-primary/10">
            <span className="text-sm font-medium text-muted-foreground">{t("invoices.paymentAmount")}</span>
            <span className="text-2xl font-bold text-primary">{amount} DA</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase text-muted-foreground ms-1">{t("invoices.cardNumber")}</label>
              <Input
                placeholder="6035 •••• •••• ••••"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                className="bg-background/50"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase text-muted-foreground ms-1">{t("invoices.expiryDate")}</label>
                <Input
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase text-muted-foreground ms-1">{t("invoices.cvv")}</label>
                <Input
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  className="bg-background/50"
                  required
                />
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground text-center animate-pulse">
                {t("invoices.edahabiaSimulation")}
            </p>

            <Button type="submit" className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("common.processing")}
                </>
              ) : (
                t("invoices.payNow")
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DahabiaPaymentDialog;
