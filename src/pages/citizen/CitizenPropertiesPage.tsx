import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { propertiesApi } from '@/services/api';
import { Search, MapPin, Maximize2 } from 'lucide-react';

type PropertyStatus = 'AVAILABLE' | 'RENTED' | 'AUCTION' | 'CLOSED';

interface Property {
  id: string;
  title: string;
  location: string;
  superficie: number;
  status: PropertyStatus;
  cahierPrice: number;
  startingAuctionPrice: number;
}

const statusColors: Record<PropertyStatus, string> = {
  AVAILABLE: 'bg-success text-success-foreground',
  RENTED: 'bg-info text-info-foreground',
  AUCTION: 'bg-warning text-warning-foreground',
  CLOSED: 'bg-muted text-muted-foreground',
};

const CitizenPropertiesPage = () => {
  const { t } = useTranslation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    propertiesApi.getAll().then(res => setProperties(res.data)).catch(() => {});
  }, []);

  const filtered = properties.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('nav.properties')}</h1>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder={t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        </div>
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">{t('common.noData')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <Card key={p.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    <Badge className={statusColors[p.status]}>{t(`property.${p.status.toLowerCase()}`)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />{p.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Maximize2 className="h-4 w-4" />{p.superficie} m²
                  </div>
                  <p className="text-foreground font-semibold">{p.cahierPrice} DA</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CitizenPropertiesPage;
