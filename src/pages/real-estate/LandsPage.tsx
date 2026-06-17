import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Map, Maximize2, MoveHorizontal, MoveVertical } from 'lucide-react';
import { realEstateService } from '../../lib/api/real-estate-service';
import { formatCurrency, realEstateTypeLabels } from '../../lib/formatters';
import { ROUTES } from '../../lib/constants/routes';

export function LandsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['real-estate', 'listings', 'lands'],
    queryFn: () => realEstateService.listRealEstateListings({ type: 'LAND' }),
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
        <p className="text-error font-bold mb-4">عذراً، حدث خطأ أثناء تحميل الأراضي.</p>
      </div>
    );
  }

  const listings = data?.data || [];

  return (
    <main className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-black text-primary mb-4">أراضي المنطقة</h1>
          <p className="text-on-surface-variant">استعرض الأراضي المتاحة للبيع داخل المنطقة وحولها.</p>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-outline/10">
            <Map className="w-16 h-16 text-outline mx-auto mb-4" />
            <p className="text-on-surface-variant font-medium">لا توجد أراضي متاحة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                to={ROUTES.LAND_DETAIL(listing.slug)}
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
                      <Map className="w-12 h-12 text-outline/30" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-[#D4AF37]">
                    {realEstateTypeLabels[listing.type]}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-on-surface mb-2 line-clamp-1">{listing.title}</h3>
                  <div className="text-2xl font-black text-primary mb-4" dir="ltr">
                    {formatCurrency(listing.price)}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-6 border-t border-b border-outline/10 py-4">
                    <div className="flex flex-col items-center gap-1 text-on-surface-variant">
                      <Maximize2 className="w-4 h-4" />
                      <span className="text-xs font-medium">{listing.areaSqm} م²</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-on-surface-variant">
                      <MoveHorizontal className="w-4 h-4" />
                      <span className="text-xs font-medium">{listing.frontage ? `${listing.frontage} م` : '-'} واجهة</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-on-surface-variant">
                      <MoveVertical className="w-4 h-4" />
                      <span className="text-xs font-medium">{listing.depth ? `${listing.depth} م` : '-'} عمق</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-tertiary">عرض التفاصيل</span>
                    <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                      <Map className="w-4 h-4" />
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
