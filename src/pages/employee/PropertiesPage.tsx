import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { propertiesApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

type PropertyStatus = 'AVAILABLE' | 'RENTED' | 'AUCTION' | 'CLOSED';

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
  AVAILABLE: 'bg-success text-success-foreground',
  RENTED: 'bg-info text-info-foreground',
  AUCTION: 'bg-warning text-warning-foreground',
  CLOSED: 'bg-muted text-muted-foreground',
};

const PropertiesPage = () => {
  const { t } = useTranslation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [form, setForm] = useState({
    title: '', location: '', superficie: '', status: 'AVAILABLE' as PropertyStatus,
    cahierPrice: '', startingAuctionPrice: '',
  });

  const fetchProperties = async () => {
    try {
      const res = await propertiesApi.getAll();
      setProperties(res.data);
    } catch {
      // API not connected yet
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, String(val)));
    try {
      if (editingProperty) {
        await propertiesApi.update(editingProperty.id, formData);
        toast({ title: t('property.updated') });
      } else {
        await propertiesApi.create(formData);
        toast({ title: t('property.created') });
      }
      setDialogOpen(false);
      setEditingProperty(null);
      resetForm();
      fetchProperties();
    } catch {
      toast({ title: 'Error saving property', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await propertiesApi.delete(id);
      toast({ title: t('property.deleted') });
      fetchProperties();
    } catch {
      toast({ title: 'Error deleting property', variant: 'destructive' });
    }
  };

  const openEdit = (property: Property) => {
    setEditingProperty(property);
    setForm({
      title: property.title, location: property.location,
      superficie: String(property.superficie), status: property.status,
      cahierPrice: String(property.cahierPrice), startingAuctionPrice: String(property.startingAuctionPrice),
    });
    setDialogOpen(true);
  };

  const resetForm = () => setForm({ title: '', location: '', superficie: '', status: 'AVAILABLE', cahierPrice: '', startingAuctionPrice: '' });

  const filtered = properties.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('property.title')}</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingProperty(null); resetForm(); } }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />{t('property.add')}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingProperty ? t('property.edit') : t('property.add')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('property.name')}</Label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('property.location')}</Label>
                    <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('property.superficie')}</Label>
                    <Input type="number" value={form.superficie} onChange={(e) => setForm({ ...form, superficie: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('property.status')}</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as PropertyStatus })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">{t('property.available')}</SelectItem>
                        <SelectItem value="RENTED">{t('property.rented')}</SelectItem>
                        <SelectItem value="AUCTION">{t('property.auction')}</SelectItem>
                        <SelectItem value="CLOSED">{t('property.closed')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('property.cahierPrice')}</Label>
                    <Input type="number" value={form.cahierPrice} onChange={(e) => setForm({ ...form, cahierPrice: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('property.auctionPrice')}</Label>
                    <Input type="number" value={form.startingAuctionPrice} onChange={(e) => setForm({ ...form, startingAuctionPrice: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
                  <Button type="submit">{t('common.save')}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder={t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('property.name')}</TableHead>
                  <TableHead>{t('property.location')}</TableHead>
                  <TableHead>{t('property.superficie')}</TableHead>
                  <TableHead>{t('property.status')}</TableHead>
                  <TableHead>{t('property.cahierPrice')}</TableHead>
                  <TableHead>{t('property.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">{t('common.noData')}</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>{p.location}</TableCell>
                      <TableCell>{p.superficie} m²</TableCell>
                      <TableCell><Badge className={statusColors[p.status]}>{t(`property.${p.status.toLowerCase()}`)}</Badge></TableCell>
                      <TableCell>{p.cahierPrice} DA</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PropertiesPage;
