import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Search, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { documentsApi } from "@/services/api";

interface CitizenDocument {
  id: string;
  filePath: string;
  documentType?: string;
  createdAt: string;
  citizenId: string;
  citizenName?: string;
}

const DOCUMENT_TYPES = [
  { value: "RESIDENCE_CERTIFICATE", label: "شهادة اقامة" },
  { value: "BIRTH_CERTIFICATE", label: "شهادة ميلاد" },
  { value: "TAX_CLEARANCE_CERTIFICATE", label: "شهادة اداء المستحقات الضريبية لا تتجاوز ثلاثة اشهر" },
  { value: "TAX_ID_NUMBER", label: "رقم تعريف الجبائي" },
];

const EmployeeDocumentsPage = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<CitizenDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await documentsApi.getAllForEmployee();
      setDocuments(res.data);
    } catch {
      toast({ title: t("common.error"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const getDocumentTypeLabel = (type?: string) => {
    const docType = DOCUMENT_TYPES.find((dt) => dt.value === type);
    return docType?.label || type || "Document";
  };

  const handleView = (doc: CitizenDocument) => {
    window.open(doc.filePath, "_blank");
  };

  const filtered = documents.filter((doc) => {
    const matchSearch =
      !search ||
      (doc.citizenName || "").toLowerCase().includes(search.toLowerCase()) ||
      (doc.documentType || "").toLowerCase().includes(search.toLowerCase()) ||
      getDocumentTypeLabel(doc.documentType).toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" || doc.documentType === filterType;
    return matchSearch && matchType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">
            {t("documents.citizenDocuments")}
          </h1>
          <Badge variant="secondary" className="text-sm px-3 py-1 w-fit">
            {filtered.length} {t("documents.total")}
          </Badge>
        </div>

        {/* Filters */}
        <Card>
          <div className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder={t("documents.filterByType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("documents.allTypes")}</SelectItem>
                {DOCUMENT_TYPES.map((dt) => (
                  <SelectItem key={dt.value} value={dt.value}>
                    {dt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("documents.file")}</TableHead>
                    <TableHead>{t("documents.type")}</TableHead>
                    <TableHead>{t("documents.citizen")}</TableHead>
                    <TableHead>{t("common.date")}</TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-muted-foreground"
                      >
                        {t("common.loading")}
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-muted-foreground"
                      >
                        {t("common.noData")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((doc) => (
                      <TableRow
                        key={doc.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary shrink-0" />
                            <span className="truncate max-w-[180px]">
                              {doc.filePath?.split("/").pop() || doc.id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {getDocumentTypeLabel(doc.documentType)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span>{doc.citizenName || doc.citizenId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => handleView(doc)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              {t("documents.download")}
                            </span>
                          </Button>
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

export default EmployeeDocumentsPage;
