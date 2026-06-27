import { useMutation } from '@tanstack/react-query';
import { Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { realEstateService } from '../../lib/api/real-estate-service';
import { ROUTES } from '../../lib/constants/routes';
import {
  normalizeRealEstateAmenities,
  realEstateAmenityLabels,
  realEstateFinishingStatusLabels,
  realEstateOwnershipProofTypeLabels,
  realEstatePhaseLabels,
} from '../../lib/formatters';

const finishingStatusOptions = [
  { value: '', label: 'بدون تحديد' },
  ...Object.entries(realEstateFinishingStatusLabels).map(([value, label]) => ({ value, label })),
];

const floorOptions = [
  { value: '', label: 'بدون تحديد' },
  { value: 'GROUND', label: 'أرضي' },
  { value: '1', label: 'الأول' },
  { value: '2', label: 'الثاني' },
  { value: '3', label: 'الثالث' },
  { value: '4', label: 'الرابع' },
  { value: '5', label: 'الخامس' },
  { value: '6', label: 'السادس' },
  { value: 'ROOF', label: 'روف' },
];

const amenityOptions = Object.entries(realEstateAmenityLabels).map(([value, label]) => ({ value, label }));

const phaseOptions = [
  { value: '', label: 'بدون تحديد' },
  ...Object.entries(realEstatePhaseLabels).map(([value, label]) => ({ value, label })),
];

const ownershipProofOptions = [
  { value: '', label: 'بدون تحديد' },
  ...Object.entries(realEstateOwnershipProofTypeLabels).map(([value, label]) => ({ value, label })),
];

const yesNoOptions = [
  { value: '', label: 'بدون تحديد' },
  { value: 'true', label: 'نعم' },
  { value: 'false', label: 'لا' },
];

type UploadedImage = {
  id: string;
  url: string;
  publicId?: string;
  alt?: string;
  isCover: boolean;
  sortOrder: number;
};

const MAX_IMAGES = 12;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function normalizeUploadedImages(images: UploadedImage[]) {
  const coverIndex = images.findIndex((image) => image.isCover);
  const normalizedCoverIndex = coverIndex === -1 ? 0 : coverIndex;

  return images.map((image, index) => ({
    ...image,
    sortOrder: index,
    isCover: index === normalizedCoverIndex,
  }));
}

export function SellPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    submitterName: '',
    submitterPhone: '',
    title: '',
    price: '',
    areaSqm: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    buildingNumber: '',
    apartmentNumber: '',
    finishingStatus: '',
    furnishingStatus: '',
    amenities: [] as string[],
    phase: '',
    ownershipProofType: '',
    areInstallmentsSettled: '',
    isDepositSettled: '',
    hasFinalContract: '',
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imagesError, setImagesError] = useState<string | null>(null);

  const updateImages = (updater: (current: UploadedImage[]) => UploadedImage[]) => {
    setImages((current) => normalizeUploadedImages(updater(current)));
  };

  const setCoverImage = (imageId: string) => {
    updateImages((current) =>
      current.map((image) => ({
        ...image,
        isCover: image.id === imageId,
      })),
    );
  };

  const removeImage = (imageId: string) => {
    updateImages((current) => {
      const remaining = current.filter((image) => image.id !== imageId);
      return remaining.length > 0
        ? remaining
        : [];
    });
  };

  const uploadSingleImage = async (file: File, sortOrder: number, isCover: boolean) => {
    const signature = await realEstateService.createRealEstateUploadSignature();
    const formData = new FormData();

    Object.entries(signature.fields).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    formData.append('file', file);

    const response = await fetch(signature.uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const result = await response.json();

    return {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      url: result.secure_url as string,
      publicId: result.public_id as string | undefined,
      alt: file.name,
      isCover,
      sortOrder,
    } satisfies UploadedImage;
  };

  const handleImageSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (files.length === 0) {
      return;
    }

    const invalidType = files.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type));
    if (invalidType) {
      setImagesError('صيغة الصورة غير مدعومة. استخدم JPEG أو PNG أو WEBP.');
      return;
    }

    const oversized = files.find((file) => file.size > MAX_IMAGE_SIZE);
    if (oversized) {
      setImagesError('كل صورة يجب أن تكون بحجم 5 ميجابايت أو أقل.');
      return;
    }

    if (images.length + files.length > MAX_IMAGES) {
      setImagesError('يمكنك رفع حتى 12 صورة فقط.');
      return;
    }

    setImagesError(null);
    setIsUploadingImages(true);

    try {
      const nextImages: UploadedImage[] = [];
      for (const [index, file] of files.entries()) {
        const uploaded = await uploadSingleImage(
          file,
          images.length + index,
          images.length === 0 && index === 0,
        );
        nextImages.push(uploaded);
      }

      setImages((current) => normalizeUploadedImages([...current, ...nextImages]));
    } catch {
      setImagesError('تعذر رفع الصور الآن. حاول مرة أخرى.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const submitMutation = useMutation({
    mutationFn: (data: any) => realEstateService.createRealEstateSubmission(data),
    onSuccess: () => {
      navigate(ROUTES.SUCCESS);
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
        // keep the original message
      }

      setErrorMessage(apiMessage ? `تأكد من صحة البيانات: ${apiMessage}` : 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.');
      setLoading(false);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isUploadingImages) {
      setErrorMessage('يرجى انتظار انتهاء رفع الصور قبل الإرسال.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const payload = {
      submitterName: formData.submitterName,
      submitterPhone: formData.submitterPhone,
      title: formData.title,
      price: Number(formData.price),
      areaSqm: Number(formData.areaSqm),
      description: formData.description,
      bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
      floor: formData.floor || undefined,
      buildingNumber: formData.buildingNumber || undefined,
      apartmentNumber: formData.apartmentNumber || undefined,
      finishingStatus: formData.finishingStatus || undefined,
      furnishingStatus: formData.furnishingStatus || undefined,
      amenities: formData.amenities.length ? normalizeRealEstateAmenities(formData.amenities) : undefined,
      phase: formData.phase || undefined,
      ownershipProofType: formData.ownershipProofType || undefined,
      areInstallmentsSettled: formData.areInstallmentsSettled === '' ? undefined : formData.areInstallmentsSettled === 'true',
      isDepositSettled: formData.isDepositSettled === '' ? undefined : formData.isDepositSettled === 'true',
      hasFinalContract: formData.hasFinalContract === '' ? undefined : formData.hasFinalContract === 'true',
      images: images.length
        ? images.map((image) => ({
            url: image.url,
            publicId: image.publicId,
            alt: image.alt,
            isCover: image.isCover,
            sortOrder: image.sortOrder,
          }))
        : undefined,
    };

    submitMutation.mutate(payload);
  };

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f7f2e8] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <Megaphone className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-3xl font-black text-[#1f2c22]">أعلن عن عقارك</h1>
          <p className="text-lg leading-8 text-[#5f6e62]">
            أرسل بيانات عقارك وسنقوم بمراجعتها والتواصل معك لعرضه للبيع عبر بوابتنا.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel space-y-8 rounded-[32px] p-6 shadow-xl sm:p-10">
          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
              {errorMessage}
            </div>
          )}

          <div className="space-y-6">
            <h2 className="border-b border-[#e4dac5] pb-4 text-xl font-bold text-[#1f2c22]">البيانات الشخصية</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">
                  الاسم بالكامل <span className="text-tertiary">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="الاسم الثلاثي"
                  value={formData.submitterName}
                  onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">
                  رقم الهاتف <span className="text-tertiary">*</span>
                </label>
                <input
                  required
                  type="tel"
                  dir="ltr"
                  placeholder="01xxxxxxxxx"
                  value={formData.submitterPhone}
                  onChange={(e) => setFormData({ ...formData, submitterPhone: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="border-b border-[#e4dac5] pb-4 text-xl font-bold text-[#1f2c22]">بيانات العقار الأساسية</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">
                  عنوان الإعلان <span className="text-tertiary">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="مثال: شقة للبيع بحي هادئ"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">
                  السعر المطلوب (ج.م) <span className="text-tertiary">*</span>
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  placeholder="أدخل السعر الإجمالي"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">
                  المساحة (م²) <span className="text-tertiary">*</span>
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  placeholder="أدخل المساحة بالمتر المربع"
                  value={formData.areaSqm}
                  onChange={(e) => setFormData({ ...formData, areaSqm: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">
                  وصف العقار <span className="text-tertiary">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="اذكر أهم التفاصيل الإضافية"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="border-b border-[#e4dac5] pb-4 text-xl font-bold text-[#1f2c22]">تفاصيل الوحدة</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">عدد الغرف</label>
                <input
                  type="number"
                  min="0"
                  placeholder="مثال: 3"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">عدد الحمامات</label>
                <input
                  type="number"
                  min="0"
                  placeholder="مثال: 2"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">رقم العمارة</label>
                <input
                  type="text"
                  placeholder="مثال: 12"
                  value={formData.buildingNumber}
                  onChange={(e) => setFormData({ ...formData, buildingNumber: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">رقم الشقة</label>
                <input
                  type="text"
                  placeholder="مثال: 4B"
                  value={formData.apartmentNumber}
                  onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="border-b border-[#e4dac5] pb-4 text-xl font-bold text-[#1f2c22]">رفع الصور</h2>
            <div className="rounded-2xl border border-dashed border-[#d4c8b0] bg-white/80 p-5">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-[#e4dac5] bg-[#faf6ef] px-6 py-8 text-center transition hover:border-secondary hover:bg-white">
                <span className="text-base font-bold text-[#1f2c22]">اختيار صور العقار</span>
                <span className="text-sm leading-7 text-[#5f6e62]">
                  الحد الأقصى 12 صورة. كل صورة حتى 5 ميجابايت. JPEG أو PNG أو WEBP فقط.
                </span>
                <span className="rounded-full bg-secondary px-4 py-2 text-sm font-bold text-white">
                  {isUploadingImages ? 'جاري الرفع...' : 'اختر الصور'}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelection}
                  className="hidden"
                  disabled={isUploadingImages}
                />
              </label>

              {imagesError && (
                <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {imagesError}
                </p>
              )}

              {images.length > 0 && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {images.map((image, index) => (
                    <div key={image.id} className="overflow-hidden rounded-2xl border border-[#e4dac5] bg-white">
                      <div className="relative aspect-[4/3] bg-[#f8f3ea]">
                        <img src={image.url} alt={image.alt || `صورة ${index + 1}`} className="h-full w-full object-cover" />
                        {image.isCover && (
                          <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white">
                            غلاف
                          </span>
                        )}
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <label className="flex items-center gap-2 text-sm font-semibold text-[#1f2c22]">
                            <input
                              type="radio"
                              name="cover-image"
                              checked={image.isCover}
                              onChange={() => setCoverImage(image.id)}
                              className="h-4 w-4"
                            />
                            صورة الغلاف
                          </label>
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="text-sm font-bold text-red-600 transition hover:text-red-700"
                          >
                            إزالة
                          </button>
                        </div>
                        <p className="text-xs text-[#5f6e62]">ترتيب العرض: {index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 text-sm leading-7 text-[#5f6e62]">
                يمكنك إعادة رفع الصور أو تغيير صورة الغلاف قبل إرسال الطلب. بعد المراجعة ستظهر الصور مع الإعلان عند الموافقة.
              </p>
            </div>

          </div>

          <div className="space-y-6">
            <h2 className="border-b border-[#e4dac5] pb-4 text-xl font-bold text-[#1f2c22]">التشطيب والدور</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">حالة التشطيب</label>
                <select
                  value={formData.finishingStatus}
                  onChange={(e) => setFormData({ ...formData, finishingStatus: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  {finishingStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">الدور</label>
                <select
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  {floorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">حالة الفرش</label>
                <select
                  value={formData.furnishingStatus}
                  onChange={(e) => setFormData({ ...formData, furnishingStatus: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  <option value="">بدون تحديد</option>
                  <option value="FURNISHED">مفروشة</option>
                  <option value="SEMI_FURNISHED">نصف مفروشة</option>
                  <option value="UNFURNISHED">غير مفروشة</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="border-b border-[#e4dac5] pb-4 text-xl font-bold text-[#1f2c22]">الكماليات والمرافق</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {amenityOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-sm font-semibold"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(option.value)}
                    onChange={() => {
                      setFormData((prev) => ({
                        ...prev,
                        amenities: prev.amenities.includes(option.value)
                          ? prev.amenities.filter((item) => item !== option.value)
                          : [...prev.amenities, option.value],
                      }));
                    }}
                    className="h-4 w-4"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="border-b border-[#e4dac5] pb-4 text-xl font-bold text-[#1f2c22]">المرحلة وإثبات الملكية</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">المرحلة</label>
                <select
                  value={formData.phase}
                  onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  {phaseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">نوع إثبات الملكية</label>
                <select
                  value={formData.ownershipProofType}
                  onChange={(e) => setFormData({ ...formData, ownershipProofType: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  {ownershipProofOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="border-b border-[#e4dac5] pb-4 text-xl font-bold text-[#1f2c22]">الوضع المالي والقانوني</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">الأقساط خالصة؟</label>
                <select
                  value={formData.areInstallmentsSettled}
                  onChange={(e) => setFormData({ ...formData, areInstallmentsSettled: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  {yesNoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">الوديعة خالصة؟</label>
                <select
                  value={formData.isDepositSettled}
                  onChange={(e) => setFormData({ ...formData, isDepositSettled: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  {yesNoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">يوجد عقد نهائي؟</label>
                <select
                  value={formData.hasFinalContract}
                  onChange={(e) => setFormData({ ...formData, hasFinalContract: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  {yesNoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#bfe6d8] bg-[#eefaf4] p-6">
            <p className="text-sm leading-7 text-[#0f5b46]">
              <strong>ملاحظة:</strong> سنقوم بمراجعة البيانات والتواصل معك قريباً.
              <br />
              (إرفاق الصور متاح بالتنسيق مع الإدارة بعد التواصل)
            </p>
          </div>

          <p className="pt-2 text-center text-sm text-[#5f6e62]">
            بإرسال الإعلان، فإنك تقر بالاطلاع على{' '}
            <a
              href="https://dalilsubhi.com/publishing-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline underline-offset-4 transition hover:text-emerald-800"
            >
              سياسة النشر والإعلان
            </a>{' '}
            والالتزام بها.
          </p>

          <button
            type="submit"
            disabled={loading || isUploadingImages}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-4 font-bold text-white shadow-lg shadow-secondary/20 transition-all hover:-translate-y-1 hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال طلب العرض'}
          </button>
        </form>
      </div>
    </main>
  );
}
