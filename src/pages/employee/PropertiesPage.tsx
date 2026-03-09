import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FormFieldWrapper from "@/components/ui/form-field";
import { propertiesApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { propertySchema } from "@/lib/validations";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";

type PropertyStatus = "AVAILABLE" | "RENTED" | "AUCTION" | "CLOSED";

interface Property {
  id: string;
  title: string;
  location: string;
  superficie: number;
  status: PropertyStatus;
  cahierPrice: number;
  startingAuctionPrice: number;
  createdAt: string;
}

const statusColors: Record<PropertyStatus, string> = {
  AVAILABLE: "bg-success text-success-foreground",
  RENTED: "bg-info text-info-foreground",
  AUCTION: "bg-warning text-warning-foreground",
  CLOSED: "bg-muted text-muted-foreground",
};

const PropertiesPage = () => {
  const { t } = useTranslation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [saving, setSaving] = useState(false);
  const [cahierFile, setCahierFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    location: "",
    superficie: "",
    status: "AVAILABLE" as PropertyStatus,
    cahierPrice: "",
    startingAuctionPrice: "",
  });
  const { errors, validate, clearErrors, clearFieldError } =
    useFormValidation(propertySchema);

  const fetchProperties = async () => {
    try {
      const res = await propertiesApi.getAll();
      setProperties(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const updateField = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    clearFieldError(field);
  };

  const handleCahierFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCahierFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;
    setSaving(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) =>
      formData.append(key, String(val)),
    );
    if (cahierFile) {
      formData.append("cahierDeChargePDF", cahierFile);
    }
    try {
      if (editingProperty) {
        await propertiesApi.update(editingProperty.id, formData);
        toast({ title: t("property.updated"), variant: "success" as any });
      } else {
        await propertiesApi.create(formData);
        toast({ title: t("property.created"), variant: "success" as any });
      }
      setDialogOpen(false);
      setEditingProperty(null);
      resetForm();
      fetchProperties();
    } catch {
      toast({ title: t("property.saveError"), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await propertiesApi.delete(id);
      toast({ title: t("property.deleted"), variant: "success" as any });
      fetchProperties();
    } catch {
      toast({ title: t("property.deleteError"), variant: "destructive" });
    }
  };

  const openEdit = (property: Property) => {
    setEditingProperty(property);
    setForm({
      title: property.title,
      location: property.location,
      superficie: String(property.superficie),
      status: property.status,
      cahierPrice: String(property.cahierPrice),
      startingAuctionPrice: String(property.startingAuctionPrice),
    });
    setCahierFile(null);
    clearErrors();
    setDialogOpen(true);
  };

  const resetForm = () => {
    setForm({
      title: "",
      location: "",
      superficie: "",
      status: "AVAILABLE",
      cahierPrice: "",
      startingAuctionPrice: "",
    });
    setCahierFile(null);
    clearErrors();
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">
            {t("property.title")}
          </h1>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingProperty(null);
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t("property.add")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? t("property.edit") : t("property.add")}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormFieldWrapper
                    label={t("property.name")}
                    error={errors.title}
                    required
                  >
                    <Input
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className={errors.title ? "border-destructive" : ""}
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    label={t("property.location")}
                    error={errors.location}
                    required
                  >
                    <Input
                      value={form.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      className={errors.location ? "border-destructive" : ""}
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    label={t("property.superficie")}
                    error={errors.superficie}
                    required
                  >
                    <Input
                      type="number"
                      value={form.superficie}
                      onChange={(e) =>
                        updateField("superficie", e.target.value)
                      }
                      className={errors.superficie ? "border-destructive" : ""}
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper label={t("property.status")}>
                    <Select
                      value={form.status}
                      onValueChange={(v) =>
                        setForm({ ...form, status: v as PropertyStatus })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">
                          {t("property.available")}
                        </SelectItem>
                        <SelectItem value="RENTED">
                          {t("property.rented")}
                        </SelectItem>
                        <SelectItem value="AUCTION">
                          {t("property.auction")}
                        </SelectItem>
                        <SelectItem value="CLOSED">
                          {t("property.closed")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    label={t("property.cahierPrice")}
                    error={errors.cahierPrice}
                  >
                    <Input
                      type="number"
                      value={form.cahierPrice}
                      onChange={(e) =>
                        updateField("cahierPrice", e.target.value)
                      }
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    label={t("property.auctionPrice")}
                    error={errors.startingAuctionPrice}
                  >
                    <Input
                      type="number"
                      value={form.startingAuctionPrice}
                      onChange={(e) =>
                        updateField("startingAuctionPrice", e.target.value)
                      }
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper label={t("property.cahierPdf")}>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleCahierFileChange}
                      className="cursor-pointer"
                    />
                    {cahierFile && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("common.selected")}: {cahierFile.name}
                      </p>
                    )}
                  </FormFieldWrapper>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setDialogOpen(false)}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t("common.save")
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-4">
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
                  <SelectItem value="AUCTION">
                    {t("property.auction")}
                  </SelectItem>
                  <SelectItem value="CLOSED">{t("property.closed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("property.name")}</TableHead>
                    <TableHead>{t("property.location")}</TableHead>
                    <TableHead>{t("property.superficie")}</TableHead>
                    <TableHead>{t("property.status")}</TableHead>
                    <TableHead>{t("property.cahierPrice")}</TableHead>
                    <TableHead>{t("property.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-12"
                      >
                        {t("common.noData")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((p) => (
                      <TableRow
                        key={p.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium">{p.title}</TableCell>
                        <TableCell>{p.location}</TableCell>
                        <TableCell>{p.superficie} m²</TableCell>
                        <TableCell>
                          <Badge className={statusColors[p.status]}>
                            {t(`property.${p.status.toLowerCase()}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>{p.cahierPrice} DA</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(p)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(p.id)}
                              className="hover:bg-destructive/10 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PropertiesPage;
