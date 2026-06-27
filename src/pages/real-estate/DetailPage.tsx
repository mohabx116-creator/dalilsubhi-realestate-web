import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronRight, Expand, MapPin, X } from 'lucide-react';
import { realEstateService } from '../../lib/api/real-estate-service';
import {
  formatCurrency,
  formatRealEstateFloor,
  formatRealEstateAmenity,
  normalizeRealEstateAmenities,
  realEstateFinishingLabels,
  realEstateFinishingStatusLabels,
  realEstatePhaseLabels,
  realEstateOwnershipProofTypeLabels,
} from '../../lib/formatters';
import { ROUTES } from '../../lib/constants/routes';
import type { ImageDto } from '../../lib/api/types';

export function DetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const whatsappWindowRef = useRef<Window | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['real-estate', 'listing', slug],
    queryFn: () => realEstateService.getRealEstateListing(slug!),
    enabled: !!slug,
  });

  const listing = data?.data;

  const inquiryMutation = useMutation({
    mutationFn: (payload: { listingId: string; customerName: string; customerPhone: string }) =>
      realEstateService.createRealEstateInquiry(payload),
    onSuccess: (response) => {
      setSuccess(true);
      setWhatsappUrl(response.data.whatsappUrl ?? null);
      setErrorMessage(null);

      if (whatsappWindowRef.current && response.data.whatsappUrl) {
        whatsappWindowRef.current.location.href = response.data.whatsappUrl;
        whatsappWindowRef.current.focus();
      }

      whatsappWindowRef.current = null;
    },
    onError: (error: any) => {
      let apiMessage = error.details?.message || error.message;

      try {
        if (apiMessage && apiMessage.startsWith('[')) {
          const parsed = JSON.parse(apiMessage);
          if (Array.isArray(parsed)) {
            apiMessage = parsed.map((p: any) => p.message || p.path?.join('.')).join('، ');
          }
        }
      } catch {
        // keep original text
      }

      setErrorMessage(apiMessage ? `تأكد من صحة البيانات: ${apiMessage}` : 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.');
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
          <p className="font-bold text-error">عذرًا، لم نتمكن من العثور على العقار المطلوب.</p>
          <Link to={ROUTES.PROPERTIES} className="mt-4 font-bold text-secondary hover:underline">
            العودة للقائمة
          </Link>
        </div>
      </main>
    );
  }

  const images = listing.images ?? [];

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f7f2e8] pb-20">
      <div className="border-b border-[#e4dac5] bg-white/75 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to={ROUTES.PROPERTIES}
            className="inline-flex items-center gap-2 rounded-full border border-[#e4dac5] bg-white px-4 py-2 text-sm font-bold text-[#1f2c22] shadow-sm transition hover:-translate-y-0.5"
          >
            <ChevronRight className="h-4 w-4" />
            العودة إلى عقارات المنطقة
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="glass-card overflow-hidden rounded-[32px]">
              <div className="relative aspect-video bg-[#f3ede2]">
                <PropertyGallery images={images} title={listing.title} />
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
                  <DetailBox label="عدد الغرف" value={listing.bedrooms?.toString() || '-'} />
                  <DetailBox label="عدد الحمامات" value={listing.bathrooms?.toString() || '-'} />
                  <DetailBox label="التشطيب" value={listing.finishingType ? realEstateFinishingLabels[listing.finishingType] : '-'} />
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-bold text-[#1f2c22]">تفاصيل إضافية</h3>
                  <p className="whitespace-pre-wrap leading-8 text-[#5f6e62]">{listing.description}</p>
                </div>

                {(() => {
                  const amenities = normalizeRealEstateAmenities(listing.amenities);
                  return listing.finishingStatus || listing.finishingType || listing.floor || listing.phase || listing.ownershipProofType || amenities.length || listing.areInstallmentsSettled !== undefined || listing.isDepositSettled !== undefined || listing.hasFinalContract !== undefined;
                })() && (
                  <div className="rounded-[28px] border border-[#e4dac5] bg-[#fcfaf6] p-5 sm:p-6">
                    <h3 className="mb-4 text-lg font-bold text-[#1f2c22]">مواصفات العقار</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <DetailBox
                        label="حالة التشطيب"
                        value={
                          listing.finishingStatus
                            ? realEstateFinishingStatusLabels[listing.finishingStatus]
                            : listing.finishingType
                              ? realEstateFinishingLabels[listing.finishingType]
                              : '-'
                        }
                      />
                      <DetailBox label="الدور" value={formatRealEstateFloor(listing.floor)} />
                      <DetailBox label="المرحلة" value={listing.phase ? realEstatePhaseLabels[listing.phase] : '-'} />
                      <DetailBox label="نوع إثبات الملكية" value={listing.ownershipProofType ? realEstateOwnershipProofTypeLabels[listing.ownershipProofType] : '-'} />
                      <DetailBox label="الأقساط خالصة؟" value={listing.areInstallmentsSettled === undefined ? '-' : (listing.areInstallmentsSettled ? 'نعم' : 'لا')} />
                      <DetailBox label="الوديعة خالصة؟" value={listing.isDepositSettled === undefined ? '-' : (listing.isDepositSettled ? 'نعم' : 'لا')} />
                      <DetailBox label="يوجد عقد نهائي؟" value={listing.hasFinalContract === undefined ? '-' : (listing.hasFinalContract ? 'نعم' : 'لا')} />
                    </div>

                    {normalizeRealEstateAmenities(listing.amenities).length > 0 && (
                      <div className="mt-5 border-t border-[#e4dac5] pt-4">
                        <p className="mb-3 text-sm font-bold text-[#1f2c22]">الكماليات</p>
                        <div className="flex flex-wrap gap-2">
                          {normalizeRealEstateAmenities(listing.amenities).map((amenity) => (
                            <span key={amenity} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1f2c22] shadow-sm">
                              {formatRealEstateAmenity(amenity)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-panel sticky top-24 rounded-[28px] p-6">
              <h3 className="mb-6 text-xl font-bold text-[#1f2c22]">إرسال طلب العرض</h3>

              {success ? (
                <div className="rounded-3xl border border-[#bfe6d8] bg-[#eefaf4] p-6 text-center">
                  <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-secondary" />
                  <h4 className="mb-2 text-lg font-bold text-[#1f2c22]">تم استلام طلبك بنجاح</h4>
                  <p className="mb-6 text-sm leading-7 text-[#5f6e62]">
                    سيتم مراجعة بيانات الطلب ثم فتح واتساب لإكمال التواصل معك.
                  </p>
                  {whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 font-bold text-white shadow-lg shadow-secondary/20 transition hover:-translate-y-0.5 hover:bg-secondary/90"
                    >
                      فتح واتساب لإكمال الطلب
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-[#5f6e62]">إذا لم يفتح واتساب تلقائيًا، فحاول مرة أخرى من زر الإرسال.</p>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setErrorMessage(null);
                    whatsappWindowRef.current = window.open('', '_blank', 'noopener,noreferrer');
                    inquiryMutation.mutate({
                      listingId: listing.id,
                      customerName: name,
                      customerPhone: phone,
                    });
                  }}
                  className="mt-6 flex flex-col space-y-4"
                >
                  {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600">
                      {errorMessage}
                    </div>
                  )}

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
                    {inquiryMutation.isPending ? 'جاري الإرسال...' : 'إرسال طلب العرض'}
                  </button>

                  <p className="mt-4 text-center text-xs leading-6 text-[#5f6e62]">
                    بإرسال الطلب، سيقوم فريقنا بمراجعة البيانات والتواصل معك لتنسيق المعاينة.
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

function PropertyGallery({ images, title }: { images: ImageDto[]; title: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);

  const hasMultiple = images.length > 1;
  useEffect(() => {
    setActiveIndex(0);
    setZoomedIndex(null);
  }, [images]);

  useEffect(() => {
    if (!hasMultiple || !viewportRef.current) return;
    const viewport = viewportRef.current;
    const width = viewport.clientWidth || 1;
    viewport.scrollTo({ left: activeIndex * width, behavior: 'smooth' });
  }, [activeIndex, hasMultiple]);

  useEffect(() => {
    if (zoomedIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomedIndex(null);
      if (event.key === 'ArrowRight' && images.length > 1) {
        setZoomedIndex((current) => (current === null ? 0 : (current + 1) % images.length));
      }
      if (event.key === 'ArrowLeft' && images.length > 1) {
        setZoomedIndex((current) => (current === null ? 0 : (current - 1 + images.length) % images.length));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [images.length, zoomedIndex]);

  function handleScroll() {
    if (!viewportRef.current) return;
    const width = viewportRef.current.clientWidth || 1;
    const nextIndex = Math.round(viewportRef.current.scrollLeft / width);
    if (nextIndex !== activeIndex) {
      setActiveIndex(Math.max(0, Math.min(images.length - 1, nextIndex)));
    }
  }

  function step(delta: number) {
    const nextIndex = Math.max(0, Math.min(images.length - 1, activeIndex + delta));
    setActiveIndex(nextIndex);
  }

  if (images.length === 0) {
    return <div className="flex h-full w-full items-center justify-center text-[#8c7f67]">بدون صورة</div>;
  }

  if (!hasMultiple) {
    return (
      <>
        <button
          type="button"
          onClick={() => setZoomedIndex(0)}
          className="group relative block h-full w-full cursor-zoom-in"
          aria-label={`فتح الصورة بحجم أكبر: ${title}`}
        >
          <img src={images[0].url} alt={title} className="h-full w-full object-cover" />
          <span className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <Expand className="h-3.5 w-3.5" />
            تكبير الصورة
          </span>
        </button>
        {zoomedIndex === 0 && <Lightbox images={images} title={title} activeIndex={0} onClose={() => setZoomedIndex(null)} onChange={setZoomedIndex} />}
      </>
    );
  }

  return (
    <>
      <div className="relative h-full w-full">
        <div
          ref={viewportRef}
          onScroll={handleScroll}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth touch-pan-x"
          aria-label={`معرض صور العقار، ${activeIndex + 1} من ${images.length}`}
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setZoomedIndex(index)}
              className="relative h-full min-w-full snap-start cursor-zoom-in"
              aria-label={`فتح الصورة ${index + 1} من ${images.length} بحجم أكبر`}
            >
              <img src={image.url} alt={`${title} - صورة ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-3">
          <span className="inline-flex items-center rounded-full bg-black/65 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            {activeIndex + 1} / {images.length}
          </span>
          <span className="inline-flex items-center rounded-full bg-black/65 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            اسحب بين الصور
          </span>
        </div>

        <div className="absolute inset-y-0 right-3 flex items-center">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={activeIndex === 0}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#1f2c22] shadow-lg backdrop-blur-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 rtl:rotate-180"
            aria-label="الصورة السابقة"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute inset-y-0 left-3 flex items-center">
          <button
            type="button"
            onClick={() => step(1)}
            disabled={activeIndex === images.length - 1}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#1f2c22] shadow-lg backdrop-blur-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 rtl:rotate-180"
            aria-label="الصورة التالية"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setZoomedIndex(activeIndex)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-black/75"
          aria-label={`فتح الصورة الحالية بحجم أكبر: ${title}`}
        >
          <Expand className="h-3.5 w-3.5" />
          تكبير الصورة
        </button>
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
              index === activeIndex ? 'border-secondary shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
            }`}
            aria-label={`عرض الصورة ${index + 1} من ${images.length}`}
          >
            <img src={image.url} alt={`${title} - مصغرة ${index + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {zoomedIndex !== null && (
        <Lightbox
          images={images}
          title={title}
          activeIndex={zoomedIndex}
          onClose={() => setZoomedIndex(null)}
          onChange={setZoomedIndex}
        />
      )}
    </>
  );
}

function Lightbox({
  images,
  title,
  activeIndex,
  onClose,
  onChange,
}: {
  images: ImageDto[];
  title: string;
  activeIndex: number;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  const hasMultiple = images.length > 1;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (!hasMultiple) return;
      if (event.key === 'ArrowRight') onChange((activeIndex + 1) % images.length);
      if (event.key === 'ArrowLeft') onChange((activeIndex - 1 + images.length) % images.length);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, hasMultiple, images.length, onChange, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={`معاينة صور العقار: ${title}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl overflow-hidden rounded-[28px] bg-black shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
          <span className="text-sm font-semibold">
            {activeIndex + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            aria-label="إغلاق المعاينة"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative bg-black">
          <div className="flex min-h-[50vh] items-center justify-center">
            <img
              src={images[activeIndex].url}
              alt={`${title} - صورة ${activeIndex + 1}`}
              className="max-h-[75vh] w-full object-contain"
            />
          </div>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={() => onChange((activeIndex - 1 + images.length) % images.length)}
                className="absolute inset-y-0 right-3 my-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#1f2c22] shadow-lg transition hover:bg-white rtl:rotate-180"
                aria-label="الصورة السابقة"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => onChange((activeIndex + 1) % images.length)}
                className="absolute inset-y-0 left-3 my-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#1f2c22] shadow-lg transition hover:bg-white rtl:rotate-180"
                aria-label="الصورة التالية"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
