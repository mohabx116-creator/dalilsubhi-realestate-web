import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { Megaphone } from 'lucide-react';
import { realEstateService } from '../../lib/api/real-estate-service';
import { ROUTES } from '../../lib/constants/routes';
import { type RealEstateType, realEstateTypes } from '../../lib/api/types';
import { realEstateTypeLabels } from '../../lib/formatters';

export function SellPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    submitterName: '',
    submitterPhone: '',
    type: 'APARTMENT' as RealEstateType,
    title: '',
    price: '',
    areaSqm: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      } catch (e) {}

      setErrorMessage(apiMessage ? `تأكد من صحة البيانات: ${apiMessage}` : 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.');
      setLoading(false);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const payload: any = {
      ...formData,
      price: Number(formData.price),
      areaSqm: Number(formData.areaSqm),
      bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
    };

    if (payload.type === 'LAND') {
      delete payload.bedrooms;
      delete payload.bathrooms;
    }

    submitMutation.mutate(payload);
  };

  const isLand = formData.type === 'LAND';

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
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
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
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="border-b border-[#e4dac5] pb-4 text-xl font-bold text-[#1f2c22]">بيانات العقار الأساسية</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">
                  نوع العقار <span className="text-tertiary">*</span>
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as RealEstateType })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                >
                  {realEstateTypes.map((t) => (
                    <option key={t} value={t}>
                      {realEstateTypeLabels[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#1f2c22]">
                  عنوان الإعلان <span className="text-tertiary">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="مثال: شقة للبيع بحدائق أكتوبر"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
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
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
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
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
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
                  className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                />
              </div>
            </div>
          </div>

          {!isLand && (
            <div className="space-y-6">
              <h2 className="border-b border-[#e4dac5] pb-4 text-xl font-bold text-[#1f2c22]">التفاصيل الداخلية</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#1f2c22]">عدد الغرف</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="مثال: 3"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
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
                    className="w-full rounded-xl border border-[#e4dac5] bg-white px-4 py-3 text-[#1f2c22] placeholder-[#8c7f67] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-[#bfe6d8] bg-[#eefaf4] p-6">
            <p className="text-sm leading-7 text-[#0f5b46]">
              <strong>ملاحظة:</strong> سيقوم فريقنا بمراجعة البيانات والتواصل معك قريباً.
              <br />
              (إرفاق الصور متاح بالتنسيق مع الإدارة بعد التواصل)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-4 font-bold text-white shadow-lg shadow-secondary/20 transition-all hover:-translate-y-1 hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال طلب العرض'}
          </button>
        </form>
      </div>
    </main>
  );
}
