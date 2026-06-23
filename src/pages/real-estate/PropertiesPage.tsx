import { useQuery } from '@tanstack/react-query';
import { Building2, Bed, Bath, MapPin, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { realEstateService } from '../../lib/api/real-estate-service';
import { formatCurrency, realEstateTypeLabels } from '../../lib/formatters';
import { ROUTES } from '../../lib/constants/routes';

function ListingSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[32px] bg-white/75 shadow-[0_16px_50px_rgba(28,45,34,0.08)]">
      <div className="aspect-[16/11] bg-[#eee5d6]" />
      <div className="space-y-4 p-6">
        <div className="h-5 w-24 rounded-full bg-[#eee5d6]" />
        <div className="h-6 w-3/4 rounded-full bg-[#eee5d6]" />
        <div className="h-8 w-32 rounded-full bg-[#eee5d6]" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-14 rounded-2xl bg-[#eee5d6]" />
          <div className="h-14 rounded-2xl bg-[#eee5d6]" />
          <div className="h-14 rounded-2xl bg-[#eee5d6]" />
        </div>
      </div>
    </div>
  );
}

export function PropertiesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['real-estate', 'listings', 'properties'],
    queryFn: async () => {
      const response = await realEstateService.listRealEstateListings();
      return {
        ...response,
        data: response.data.filter((listing) => listing.type !== 'LAND'),
      };
    },
  });

  if (isLoading) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] bg-[#f7f2e8] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid min-h-[40vh] max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ListingSkeleton key={index} />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] bg-[#f7f2e8] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[40vh] max-w-3xl flex-col items-center justify-center text-center">
          <p className="font-bold text-error">عذراً، حدث خطأ أثناء تحميل العقارات.</p>
        </div>
      </main>
    );
  }

  const listings = data?.data || [];

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f7f2e8] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e4dac5] bg-white/75 px-4 py-2 text-sm font-bold text-tertiary shadow-sm backdrop-blur-md">
            <Building2 className="h-4 w-4" />
            عقارات المنطقة
          </span>
          <h1 className="mt-6 text-3xl font-black text-[#1f2c22] sm:text-5xl">عقارات المنطقة</h1>
          <p className="mt-4 text-base leading-8 text-[#5f6e62] sm:text-lg sm:leading-9">
            تصفح الشقق والوحدات السكنية المتاحة للبيع داخل المنطقة.
          </p>
        </header>

        {listings.length === 0 ? (
          <div className="glass-panel mt-12 rounded-[32px] p-10 text-center">
            <Building2 className="mx-auto h-14 w-14 text-tertiary" />
            <p className="mt-4 text-[#5f6e62]">لا توجد عقارات متاحة حالياً.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                to={ROUTES.PROPERTY_DETAIL(listing.slug)}
                className="glass-card group overflow-hidden rounded-[32px] transition hover:-translate-y-1"
              >
                <div className="relative aspect-[16/11] bg-[#f3ede2]">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Building2 className="h-12 w-12 text-[#d2c6ad]" />
                    </div>
                  )}
                  <div className="absolute right-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-[#1f2c22] shadow-sm backdrop-blur-md">
                    {realEstateTypeLabels[listing.type]}
                  </div>
                </div>

                <div className="space-y-4 p-5 text-right sm:p-6">
                  <div>
                    <h3 className="line-clamp-1 text-lg font-black text-[#1f2c22]">{listing.title}</h3>
                    <div className="mt-2 text-2xl font-black text-secondary" dir="ltr">
                      {formatCurrency(listing.price)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-y border-[#e4dac5] py-4 text-center">
                    <div className="flex flex-col items-center gap-1 text-[#5f6e62]">
                      <Maximize2 className="h-4 w-4" />
                      <span className="text-xs font-medium">{listing.areaSqm} م²</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-[#5f6e62]">
                      <Bed className="h-4 w-4" />
                      <span className="text-xs font-medium">{listing.bedrooms || '-'} غرف</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-[#5f6e62]">
                      <Bath className="h-4 w-4" />
                      <span className="text-xs font-medium">{listing.bathrooms || '-'} حمام</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-tertiary">عرض التفاصيل</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3ede2] text-[#1f2c22] transition-colors group-hover:bg-secondary group-hover:text-white">
                      <MapPin className="h-4 w-4" />
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
