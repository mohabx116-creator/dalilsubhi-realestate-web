import { Building2, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../lib/constants/routes';

export function HomePage() {
  return (
    <main className="min-h-screen bg-surface flex flex-col items-center pt-24 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-6">عقارات دليل السبحي</h1>
        <p className="text-lg md:text-xl text-on-surface-variant">بوابة مخصصة لعرض عقارات وأراضي المنطقة للبيع بطريقة واضحة وآمنة.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-outline/10 hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
            <Building2 className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">عقارات المنطقة</h2>
          <p className="text-on-surface-variant mb-8 flex-grow">تصفح الشقق والوحدات السكنية المتاحة للبيع.</p>
          <Link
            to={ROUTES.PROPERTIES}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
          >
            تصفح العقارات
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-outline/10 hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6">
            <Map className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">أراضي المنطقة</h2>
          <p className="text-on-surface-variant mb-8 flex-grow">استعرض الأراضي المتاحة للبيع داخل المنطقة وحولها.</p>
          <Link
            to={ROUTES.LANDS}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
          >
            تصفح الأراضي
          </Link>
        </div>
      </div>

      <div className="mt-20 mb-20 text-center">
        <p className="text-on-surface-variant mb-6">هل تمتلك عقاراً أو أرضاً للبيع؟</p>
        <Link
          to={ROUTES.SELL}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors"
        >
          أعلن عن عقارك
        </Link>
      </div>
    </main>
  );
}
