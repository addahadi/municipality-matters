import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface CitizenDocument {
  id: string;
  filePath: string;
  createdAt: string;
  fileName?: string;
}

const CitizenDocumentsPage = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<CitizenDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/documents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setDocuments(await res.json());
      } catch { /* */ } finally { setLoading(false); }
    };
    fetchDocs();
  }, []);

  const handleDownload = (doc: CitizenDocument) => {
    const token = localStorage.getItem('token');
    window.open(`${API_BASE_URL}/documents/${doc.id}/download?token=${token}`, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.documents')}</h1>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('documents.file')}</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-12 text-muted-foreground">{t('common.loading')}</TableCell></TableRow>
                  ) : documents.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-12 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
                  ) : documents.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span>{doc.fileName || doc.filePath?.split('/').pop() || doc.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => handleDownload(doc)}>
                          <Download className="h-4 w-4" />{t('documents.download')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CitizenDocumentsPage;
