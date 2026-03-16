import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import FormFieldWrapper from "@/components/ui/form-field";
import { Download, FileText, Plus, Loader2, Edit2, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { documentsApi } from "@/services/api";

interface CitizenDocument {
  id: string;
  filePath: string;
  documentType?: string;
  createdAt: string;
  fileName?: string;
}

const DOCUMENT_TYPES = [
  { value: "RESIDENCE_CERTIFICATE", label: "شهادة اقامة" },
  { value: "BIRTH_CERTIFICATE", label: "شهادة ميلاد" },
  { value: "TAX_CLEARANCE_CERTIFICATE", label: "شهادة اداء المستحقات الضريبية لا تتجاوز ثلاثة اشهر" },
  { value: "TAX_ID_NUMBER", label: "رقم تعريف الجبائي" },
];

const CitizenDocumentsPage = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<CitizenDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("RESIDENCE_CERTIFICATE");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<CitizenDocument | null>(null);
  const [editType, setEditType] = useState("RESIDENCE_CERTIFICATE");
  const [editing, setEditing] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await documentsApi.getAll();
      setDocuments(res.data);
    } catch (error) {
      toast({ title: t("common.error"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({ title: t("common.selectFile"), variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("documentType", documentType);

      await documentsApi.upload(formData);
      toast({ title: t("documents.uploadSuccess"), variant: "success" as any });
      setDialogOpen(false);
      setSelectedFile(null);
      setDocumentType("RESIDENCE_CERTIFICATE");
      fetchDocs();
    } catch (error) {
      toast({ title: t("documents.uploadError"), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const getDocumentTypeLabel = (type?: string) => {
    const docType = DOCUMENT_TYPES.find((dt) => dt.value === type);
    return docType?.label || type || "Document";
  };

  const handleDownload = (doc: CitizenDocument) => {
    // Open Cloudinary URL directly in new tab
    window.open(doc.filePath, "_blank");
  };

  const handleEditOpen = (doc: CitizenDocument) => {
    setEditingDoc(doc);
    setEditType(doc.documentType || "RESIDENCE_CERTIFICATE");
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingDoc) return;

    setEditing(true);
    try {
      await documentsApi.update(editingDoc.id, { documentType: editType });
      toast({ title: t("documents.updateSuccess"), variant: "success" as any });
      setEditDialogOpen(false);
      fetchDocs();
    } catch (error) {
      toast({ title: t("documents.updateError"), variant: "destructive" });
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteOpen = (doc: CitizenDocument) => {
    setDeletingDocId(doc.id);
    setDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDocId) return;

    setDeleting(true);
    try {
      await documentsApi.delete(deletingDocId);
      toast({ title: t("documents.deleteSuccess"), variant: "success" as any });
      setDeleteAlertOpen(false);
      setDeletingDocId(null);
      fetchDocs();
    } catch (error) {
      toast({ title: t("documents.deleteError"), variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">
            {t("nav.documents")}
          </h1>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open("https://etatcivil.interieur.gov.dz/", "_blank")}
            >
              <FileText className="h-4 w-4" />
              {t("documents.getExternal")}
            </Button>
            <Dialog
              open={dialogOpen}
              onOpenChange={(o) => {
                setDialogOpen(o);
                if (!o) {
                  setSelectedFile(null);
                  setDocumentType("RESIDENCE_CERTIFICATE");
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("documents.add")}
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("documents.add")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <FormFieldWrapper label={t("documents.type")} required>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("documents.selectType")} />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((dt) => (
                        <SelectItem key={dt.value} value={dt.value}>
                          {dt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>
                <FormFieldWrapper label={t("documents.file")} required>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </FormFieldWrapper>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    {t("common.selected")}: {selectedFile.name}
                  </p>
                )}
                <Button
                  onClick={handleUpload}
                  className="w-full"
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {t("common.upload")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("documents.file")}</TableHead>
                    <TableHead>{t("documents.type")}</TableHead>
                    <TableHead>{t("common.date")}</TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-12 text-muted-foreground"
                      >
                        {t("common.loading")}
                      </TableCell>
                    </TableRow>
                  ) : documents.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-12 text-muted-foreground"
                      >
                        {t("common.noData")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((doc) => (
                      <TableRow
                        key={doc.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary shrink-0" />
                            <span>
                              {doc.fileName ||
                                doc.filePath?.split("/").pop() ||
                                doc.id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getDocumentTypeLabel(doc.documentType)}
                        </TableCell>
                        <TableCell>
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-1">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 sm:h-auto sm:w-auto sm:gap-1 sm:px-3"
                              onClick={() => handleDownload(doc)}
                              title={t("documents.download")}
                            >
                              <Download className="h-4 w-4" />
                              <span className="hidden sm:inline">{t("documents.download")}</span>
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 sm:h-auto sm:w-auto sm:gap-1 sm:px-3"
                              onClick={() => handleEditOpen(doc)}
                              title={t("common.edit")}
                            >
                              <Edit2 className="h-4 w-4" />
                              <span className="hidden sm:inline">{t("common.edit")}</span>
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 sm:h-auto sm:w-auto sm:gap-1 sm:px-3 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteOpen(doc)}
                              title={t("common.delete")}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline">{t("common.delete")}</span>
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

        {/* Edit Document Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("documents.edit")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <FormFieldWrapper label={t("documents.type")} required>
                <Select value={editType} onValueChange={setEditType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("documents.selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((dt) => (
                      <SelectItem key={dt.value} value={dt.value}>
                        {dt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
              <Button
                onClick={handleEditSave}
                className="w-full"
                disabled={editing}
              >
                {editing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {t("common.save")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("documents.deleteTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("documents.deleteMessage")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-3">
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {t("common.delete")}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default CitizenDocumentsPage;
