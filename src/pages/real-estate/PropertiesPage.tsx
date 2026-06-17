import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Maximize2, Bed, Bath } from 'lucide-react';
import { realEstateService } from '../../lib/api/real-estate-service';
import { formatCurrency, realEstateTypeLabels } from '../../lib/formatters';
import { ROUTES } from '../../lib/constants/routes';

export function PropertiesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['real-estate', 'listings', 'properties'],
    queryFn: () => realEstateService.listRealEstateListings({ type: 'APARTMENT' }), // Ideally backend handles multiple types, for now just APARTMENT
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface p-8 flex flex-col items-center justify-center text-center">
        <p className="text-error font-bold mb-4">عذراً، حدث خطأ أثناء تحميل العقارات.</p>
      </div>
    );
  }

  const listings = data?.data || [];

  return (
    <main className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-black text-[#f6f1df] mb-4 drop-shadow-md">عقارات المنطقة</h1>
          <p className="text-[#f6f1df] drop-shadow-sm">تصفح الشقق والوحدات السكنية المتاحة للبيع.</p>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-outline/10">
            <Building2 className="w-16 h-16 text-outline mx-auto mb-4" />
            <p className="text-on-surface-variant font-medium">لا توجد عقارات متاحة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                to={ROUTES.PROPERTY_DETAIL(listing.slug)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-outline/10 hover:shadow-md transition-all group"
              >
                <div className="relative aspect-[4/3] bg-surface-variant">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-outline/30" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-[#111b10] shadow-sm">
                    {realEstateTypeLabels[listing.type]}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#111b10] mb-2 line-clamp-1">{listing.title}</h3>
                  <div className="text-2xl font-black text-[#0f4f3a] mb-4" dir="ltr">
                    {formatCurrency(listing.price)}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-6 border-t border-b border-outline/10 py-4">
                    <div className="flex flex-col items-center gap-1 text-on-surface-variant">
                      <Maximize2 className="w-4 h-4" />
                      <span className="text-xs font-medium">{listing.areaSqm} م²</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-on-surface-variant">
                      <Bed className="w-4 h-4" />
                      <span className="text-xs font-medium">{listing.bedrooms || '-'} غرف</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-on-surface-variant">
                      <Bath className="w-4 h-4" />
                      <span className="text-xs font-medium">{listing.bathrooms || '-'} حمام</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-tertiary">عرض التفاصيل</span>
                    <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
