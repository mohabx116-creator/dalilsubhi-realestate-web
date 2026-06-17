import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
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
      <div className="min-h-screen bg-surface p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-surface p-8 flex flex-col items-center justify-center text-center">
        <p className="text-error font-bold mb-4">عذراً، لم نتمكن من العثور على العقار المطلوب.</p>
        <Link to={ROUTES.PROPERTIES} className="text-primary font-bold hover:underline">العودة للقائمة</Link>
      </div>
    );
  }

  const isLand = listing.type === 'LAND';
  const parentRoute = isLand ? ROUTES.LANDS : ROUTES.PROPERTIES;
  const parentLabel = isLand ? 'أراضي المنطقة' : 'عقارات المنطقة';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inquiryMutation.mutate({
      listingId: listing.id,
      inquiryType,
      customerName: name,
      customerPhone: phone,
    });
  };

  return (
    <main className="min-h-screen bg-surface pb-20">
      <div className="bg-white border-b border-outline/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to={parentRoute} className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
            <ChevronRight className="w-4 h-4" />
            العودة إلى {parentLabel}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-outline/10">
              <div className="relative aspect-video bg-surface-variant">
                {listing.images && listing.images.length > 0 ? (
                  <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-outline/30">بدون صورة</div>
                )}
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-primary">
                  {realEstateTypeLabels[listing.type]}
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black text-primary mb-2">{listing.title}</h1>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">دليل السبحي</span>
                    </div>
                  </div>
                  <div className="text-3xl font-black text-primary" dir="ltr">
                    {formatCurrency(listing.price)}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-outline/10 mb-8">
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
                  <h3 className="text-lg font-bold text-primary mb-4">تفاصيل إضافية</h3>
                  <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">{listing.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-[#fdfbf7] to-white rounded-3xl p-6 shadow-xl border border-[#c49a3a]/20 sticky top-24">
              <h3 className="text-xl font-bold text-[#111b10] mb-6">الاهتمام بالعقار</h3>
              
              {success ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-primary mb-2">تم استلام طلبك بنجاح!</h4>
                  <p className="text-sm text-on-surface-variant mb-6">سيتم التواصل معك من قبل فريق المبيعات في أقرب وقت.</p>
                  
                  <a
                    href="https://chat.whatsapp.com/ECEZfbsvjlU43eDvKa9XUu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#25D366]/90 transition-colors"
                  >
                    تواصل معنا عبر واتساب الآن
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#111b10] mb-2">نوع الطلب</label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl border border-[#c49a3a]/30 bg-white text-[#111b10] focus:outline-none focus:ring-2 focus:ring-[#c49a3a]/30 focus:border-[#c49a3a] transition-all"
                    >
                      <option value="CONTACT">استفسار عام</option>
                      <option value="INSPECTION">طلب معاينة</option>
                      <option value="INTEREST">إبداء اهتمام بالشراء</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#111b10] mb-2">الاسم بالكامل</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#c49a3a]/30 bg-white text-[#111b10] placeholder-[#0f4f3a]/40 focus:outline-none focus:ring-2 focus:ring-[#c49a3a]/30 focus:border-[#c49a3a] transition-all"
                      placeholder="اكتب اسمك الثلاثي"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#111b10] mb-2">رقم الهاتف</label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#c49a3a]/30 bg-white text-[#111b10] placeholder-[#0f4f3a]/40 focus:outline-none focus:ring-2 focus:ring-[#c49a3a]/30 focus:border-[#c49a3a] transition-all"
                      placeholder="رقم الهاتف للتواصل"
                      dir="ltr"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={inquiryMutation.isPending}
                    className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#111b10] text-[#c49a3a] font-bold hover:bg-[#111b10]/90 transition-all shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {inquiryMutation.isPending ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </button>
                  <p className="text-xs text-center text-[#0f4f3a]/80 mt-4 leading-relaxed">
                    بإرسالك الطلب، سيتم مراجعة بياناتك والتواصل معك لترتيب المعاينة. لن يتم عرض بياناتك للعامة.
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

function DetailBox({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-on-surface-variant">{label}</span>
      <span className="text-sm font-bold text-on-surface">{value}</span>
    </div>
  );
}
