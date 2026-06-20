import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState, type FormEvent, type ReactNode } from 'react';
import { CheckCircle2, ChevronRight, MapPin } from 'lucide-react';
import { realEstateService } from '../../lib/api/real-estate-service';
import { formatCurrency, realEstateTypeLabels, realEstateFinishingLabels } from '../../lib/formatters';
import { ROUTES } from '../../lib/constants/routes';
import type { RealEstateInquiryType } from '../../lib/api/types';

export function DetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [inquiryType, setInquiryType] = useState<RealEstateInquiryType>('CONTACT');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['real-estate', 'listing', slug],
    queryFn: () => realEstateService.getRealEstateListing(slug!),
    enabled: !!slug,
  });

  const listing = data?.data;

  const inquiryMutation = useMutation({
    mutationFn: (payload: any) => realEstateService.createRealEstateInquiry(payload),
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (e: any) => {
      alert('حدث خطأ أثناء إرسال الطلب: ' + e.message);
    },
  });

  if (isLoading) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] bg-[#f7f2e8] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[40vh] max-w-7xl items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] bg-[#f7f2e8] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[40vh] max-w-3xl flex-col items-center justify-center text-center">
          <p className="font-bold text-error">عذراً، لم نتمكن من العثور على العقار المطلوب.</p>
          <Link to={ROUTES.PROPERTIES} className="mt-4 font-bold text-secondary hover:underline">
            العودة للقائمة
          </Link>
        </div>
      </main>
    );
  }

  const isLand = listing.type === 'LAND';
  const parentRoute = isLand ? ROUTES.LANDS : ROUTES.PROPERTIES;
  const parentLabel = isLand ? 'أراضي المنطقة' : 'عقارات المنطقة';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    inquiryMutation.mutate({
      listingId: listing.id,
      inquiryType,
      customerName: name,
      customerPhone: phone,
    });
  };

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f7f2e8] pb-20">
      <div className="border-b border-[#e4dac5] bg-white/75 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to={parentRoute}
            className="inline-flex items-center gap-2 rounded-full border border-[#e4dac5] bg-white px-4 py-2 text-sm font-bold text-[#1f2c22] shadow-sm transition hover:-translate-y-0.5"
          >
            <ChevronRight className="h-4 w-4" />
            العودة إلى {parentLabel}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="glass-card overflow-hidden rounded-[32px]">
              <div className="relative aspect-video bg-[#f3ede2]">
                {listing.images && listing.images.length > 0 ? (
                  <img src={listing.images[0].url} alt={listing.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#8c7f67]">بدون صورة</div>
                )}
                <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-secondary shadow-sm backdrop-blur-md">
                  {realEstateTypeLabels[listing.type]}
                </div>
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <h1 className="text-2xl font-black text-[#1f2c22] md:text-3xl">{listing.title}</h1>
                    <div className="mt-2 flex items-center gap-2 text-[#5f6e62]">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">دليل السبحي</span>
                    </div>
                  </div>
                  <div className="text-3xl font-black text-secondary" dir="ltr">
                    {formatCurrency(listing.price)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-[#e4dac5] py-6 md:grid-cols-4">
                  <DetailBox label="المساحة" value={`${listing.areaSqm} م²`} />
                  {!isLand && (
                    <>
                      <DetailBox label="عدد الغرف" value={listing.bedrooms?.toString() || '-'} />
                      <DetailBox label="عدد الحمامات" value={listing.bathrooms?.toString() || '-'} />
                      <DetailBox label="التشطيب" value={listing.finishingType ? realEstateFinishingLabels[listing.finishingType] : '-'} />
                    </>
                  )}
                  {isLand && (
                    <>
                      <DetailBox label="سعر المتر" value={listing.pricePerMeter ? formatCurrency(listing.pricePerMeter) : '-'} />
                      <DetailBox label="الواجهة" value={listing.frontage ? `${listing.frontage} م` : '-'} />
                      <DetailBox label="الاستخدام" value={listing.landUse || '-'} />
                    </>
                  )}
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-bold text-[#1f2c22]">تفاصيل إضافية</h3>
                  <p className="whitespace-pre-wrap leading-8 text-[#5f6e62]">{listing.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-panel sticky top-24 rounded-[28px] p-6">
              <h3 className="mb-6 text-xl font-bold text-[#1f2c22]">الاهتمام بالعقار</h3>

              {success ? (
                <div className="rounded-3xl border border-[#bfe6d8] bg-[#eefaf4] p-6 text-center">
                  <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-secondary" />
                  <h4 className="mb-2 text-lg font-bold text-[#1f2c22]">تم استلام طلبك بنجاح</h4>
                  <p className="mb-6 text-sm leading-7 text-[#5f6e62]">
                    سيتم التواصل معك من قبل فريق المبيعات في أقرب وقت.
                  </p>
                  <a
                    href="https://chat.whatsapp.com/ECEZfbsvjlU43eDvKa9XUu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 font-bold text-white shadow-lg shadow-secondary/20 transition hover:-translate-y-0.5 hover:bg-secondary/90"
                  >
                    تواصل معنا عبر واتساب الآن
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#1f2c22]">نوع الطلب</label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value as RealEstateInquiryType)}
                      className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                    >
                      <option value="CONTACT">استفسار عام</option>
                      <option value="INSPECTION">طلب معاينة</option>
                      <option value="INTEREST">إبداء اهتمام بالشراء</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#1f2c22]">الاسم بالكامل</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                      placeholder="اكتب اسمك الثلاثي"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#1f2c22]">رقم الهاتف</label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                      placeholder="رقم الهاتف للتواصل"
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={inquiryMutation.isPending}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-4 font-bold text-white shadow-lg shadow-secondary/20 transition hover:-translate-y-0.5 hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {inquiryMutation.isPending ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </button>

                  <p className="mt-4 text-center text-xs leading-6 text-[#5f6e62]">
                    بإرسال الطلب، سيقوم فريقنا بمراجعة البيانات والتواصل معك لترتيب المعاينة.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailBox({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[#5f6e62]">{label}</span>
      <span className="text-sm font-bold text-[#1f2c22]">{value}</span>
    </div>
  );
}
