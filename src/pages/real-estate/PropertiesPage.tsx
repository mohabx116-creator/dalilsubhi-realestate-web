import { useEffect, useState } from 'react';
import { Building2, Bed, Bath, MapPin, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeRealEstateImage } from '../../components/real-estate/SafeRealEstateImage';
import { realEstateService } from '../../lib/api/real-estate-service';
import type { RealEstateListing } from '../../lib/api/types';
import { formatCurrency } from '../../lib/formatters';
import { ROUTES } from '../../lib/constants/routes';
import {
  getFallbackRealEstateProperties,
  replaceRealEstateListingsBySource,
} from '../../lib/real-estate-fallback';

export function PropertiesPage() {
  const [listings, setListings] = useState<RealEstateListing[]>(() => getFallbackRealEstateProperties());

  useEffect(() => {
    let active = true;

    realEstateService
      .listRealEstateListings()
      .then((response) => {
        if (!active) {
          return;
        }

        const freshListings = replaceRealEstateListingsBySource(response.data, 'properties');
        if (freshListings.length > 0) {
          setListings(freshListings);
        }
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setListings(getFallbackRealEstateProperties());
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#fcfaf6] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ebdcb9]/60 bg-white/70 px-3.5 py-1.5 text-xs font-bold text-tertiary shadow-sm backdrop-blur-md">
            <Building2 className="h-3.5 w-3.5" />
            عقارات المنطقة
          </span>
          <h1 className="mt-5 text-3xl font-black text-[#12221b] sm:text-5xl">عقارات المنطقة</h1>
          <p className="mt-4 text-sm leading-7 text-[#506053] sm:text-base sm:leading-8">
            تصفح الشقق والوحدات السكنية المتاحة للبيع داخل المنطقة.
          </p>
        </header>

        {listings.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-[#ebdcb9]/60 bg-white/70 p-10 text-center shadow-[0_8px_30px_rgba(28,45,34,0.02)] backdrop-blur-sm">
            <Building2 className="mx-auto h-10 w-10 text-tertiary" />
            <p className="mt-3 text-sm text-neutral-500">
              لا توجد عقارات متاحة حاليًا. تواصل معنا لإضافة عقار معروض جديد.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={ROUTES.SELL}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-secondary px-5 py-3 text-sm font-bold text-white shadow-md shadow-secondary/15 transition hover:bg-secondary/95"
              >
                أضف عقارك
              </Link>
              <Link
                to={ROUTES.HOME}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#e4dac5] bg-white px-5 py-3 text-sm font-bold text-[#1f2c22] transition hover:bg-[#fbf7ef]"
              >
                العودة للرئيسية
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                to={ROUTES.PROPERTY_DETAIL(listing.slug)}
                className="group overflow-hidden rounded-2xl border border-[#ebdcb9]/50 bg-white shadow-[0_8px_30px_rgba(28,45,34,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d6b25e]/30 hover:shadow-[0_20px_48px_rgba(28,45,34,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-50">
                  <SafeRealEstateImage
                    src={listing.images?.[0]?.url}
                    alt={listing.title}
                    className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    imgClassName="h-full w-full object-cover"
                    iconClassName="h-10 w-10 text-neutral-400"
                  />
                  {((listing.images?.length ?? 0) > 1) && (
                    <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#12221b] shadow-sm backdrop-blur-md">
                      {listing.images?.length} صور
                    </div>
                  )}
                </div>

                <div className="space-y-4 p-5 text-right">
                  <div>
                    <h3 className="line-clamp-1 text-base font-black text-[#12221b] transition group-hover:text-tertiary">{listing.title}</h3>
                    <div className="mt-2 text-2xl font-black text-secondary" dir="ltr">
                      {formatCurrency(listing.price)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-xl border-y border-neutral-100 bg-neutral-50/50 py-3 text-center text-xs text-neutral-600">
                    <div className="flex flex-col items-center gap-1">
                      <Maximize2 className="h-3.5 w-3.5 text-[#8c7a52]" />
                      <span className="font-bold text-[#12221b]">{listing.areaSqm} م²</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Bed className="h-3.5 w-3.5 text-[#8c7a52]" />
                      <span className="font-bold text-[#12221b]">{listing.bedrooms || '-'} غرف</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Bath className="h-3.5 w-3.5 text-[#8c7a52]" />
                      <span className="font-bold text-[#12221b]">{listing.bathrooms || '-'} حمام</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-tertiary">عرض التفاصيل</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50 text-[#12221b] transition group-hover:bg-[#12221b] group-hover:text-white">
                      <MapPin className="h-3.5 w-3.5" />
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
