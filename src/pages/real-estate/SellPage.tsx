import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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

  const submitMutation = useMutation({
    mutationFn: (data: any) => realEstateService.createRealEstateSubmission(data),
    onSuccess: () => {
      navigate(ROUTES.SUCCESS);
    },
    onError: (error: any) => {
      alert('خطأ أثناء إرسال الطلب: ' + error.message);
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
    <main className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-tertiary/10 flex items-center justify-center mx-auto mb-6">
            <Megaphone className="w-8 h-8 text-tertiary" />
          </div>
          <h1 className="text-3xl font-black text-[#f6f1df] mb-4 drop-shadow-md">أعلن عن عقارك</h1>
          <p className="text-[#f6f1df] drop-shadow-sm">
            أرسل بيانات عقارك وسنقوم بمراجعتها والتواصل معك لعرضه للبيع عبر بوابتنا.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gradient-to-b from-[#fdfbf7] to-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#c49a3a]/20 space-y-8">
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#111b10] border-b border-[#c49a3a]/20 pb-4">البيانات الشخصية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#111b10] mb-2">الاسم بالكامل <span className="text-[#c49a3a]">*</span></label>
                <input required type="text" placeholder="الاسم الثلاثي" value={formData.submitterName} onChange={e => setFormData({...formData, submitterName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#c49a3a]/30 bg-white text-[#111b10] placeholder-[#0f4f3a]/40 focus:outline-none focus:ring-2 focus:ring-[#c49a3a]/30 focus:border-[#c49a3a] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111b10] mb-2">رقم الهاتف <span className="text-[#c49a3a]">*</span></label>
                <input required type="tel" dir="ltr" placeholder="01xxxxxxxxx" value={formData.submitterPhone} onChange={e => setFormData({...formData, submitterPhone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#c49a3a]/30 bg-white text-[#111b10] placeholder-[#0f4f3a]/40 focus:outline-none focus:ring-2 focus:ring-[#c49a3a]/30 focus:border-[#c49a3a] transition-all" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#111b10] border-b border-[#c49a3a]/20 pb-4">بيانات العقار الأساسية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#111b10] mb-2">نوع العقار <span className="text-[#c49a3a]">*</span></label>
                <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as RealEstateType})} className="w-full px-4 py-3 rounded-xl border border-[#c49a3a]/30 bg-white text-[#111b10] focus:outline-none focus:ring-2 focus:ring-[#c49a3a]/30 focus:border-[#c49a3a] transition-all">
                  {realEstateTypes.map(t => <option key={t} value={t}>{realEstateTypeLabels[t]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111b10] mb-2">عنوان الإعلان <span className="text-[#c49a3a]">*</span></label>
                <input required type="text" placeholder="مثال: شقة للبيع بحدائق أكتوبر" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#c49a3a]/30 bg-white text-[#111b10] placeholder-[#0f4f3a]/40 focus:outline-none focus:ring-2 focus:ring-[#c49a3a]/30 focus:border-[#c49a3a] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111b10] mb-2">السعر المطلوب (ج.م) <span className="text-[#c49a3a]">*</span></label>
                <input required type="number" min="1" placeholder="أدخل السعر الإجمالي" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#c49a3a]/30 bg-white text-[#111b10] placeholder-[#0f4f3a]/40 focus:outline-none focus:ring-2 focus:ring-[#c49a3a]/30 focus:border-[#c49a3a] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111b10] mb-2">المساحة (م²) <span className="text-[#c49a3a]">*</span></label>
                <input required type="number" min="1" placeholder="أدخل المساحة بالمتر المربع" value={formData.areaSqm} onChange={e => setFormData({...formData, areaSqm: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#c49a3a]/30 bg-white text-[#111b10] placeholder-[#0f4f3a]/40 focus:outline-none focus:ring-2 focus:ring-[#c49a3a]/30 focus:border-[#c49a3a] transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#111b10] mb-2">وصف العقار <span className="text-[#c49a3a]">*</span></label>
                <textarea required rows={4} placeholder="اذكر أهم التفاصيل الإضافية" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#c49a3a]/30 bg-white text-[#111b10] placeholder-[#0f4f3a]/40 focus:outline-none focus:ring-2 focus:ring-[#c49a3a]/30 focus:border-[#c49a3a] transition-all" />
              </div>
            </div>
          </div>

          {!isLand && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#111b10] border-b border-[#c49a3a]/20 pb-4">التفاصيل الداخلية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#111b10] mb-2">عدد الغرف</label>
                  <input type="number" min="0" placeholder="مثال: 3" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#c49a3a]/30 bg-white text-[#111b10] placeholder-[#0f4f3a]/40 focus:outline-none focus:ring-2 focus:ring-[#c49a3a]/30 focus:border-[#c49a3a] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111b10] mb-2">عدد الحمامات</label>
                  <input type="number" min="0" placeholder="مثال: 2" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#c49a3a]/30 bg-white text-[#111b10] placeholder-[#0f4f3a]/40 focus:outline-none focus:ring-2 focus:ring-[#c49a3a]/30 focus:border-[#c49a3a] transition-all" />
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#0f4f3a]/5 p-6 rounded-2xl border border-[#0f4f3a]/10">
            <p className="text-sm text-[#0f4f3a] leading-relaxed">
              <strong>ملاحظة:</strong> سيقوم فريقنا بمراجعة البيانات والتواصل معك قريباً. 
              <br/> (إرفاق الصور متاح بالتنسيق مع الإدارة بعد التواصل)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#111b10] text-[#c49a3a] font-bold hover:bg-[#111b10]/90 transition-all shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال طلب العرض'}
          </button>
        </form>
      </div>
    </main>
  );
}
