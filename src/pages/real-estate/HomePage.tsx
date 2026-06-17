import { Building2, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../lib/constants/routes';

export function HomePage() {
  return (
    <main className="min-h-screen bg-surface flex flex-col items-center pt-24 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#f6f1df] to-[#c49a3a] mb-6 drop-shadow-xl" style={{ filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.5))' }}>عقارات دليل السبحي</h1>
        <p className="text-lg md:text-xl text-[#f6f1df] drop-shadow-md">بوابة مخصصة لعرض عقارات وأراضي المنطقة للبيع بطريقة واضحة وآمنة.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="bg-[#fdfbf7] rounded-3xl p-8 shadow-lg border-2 border-[#c49a3a]/30 hover:border-[#c49a3a]/60 hover:-translate-y-1 transition-all flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#0f4f3a]/10 flex items-center justify-center mb-6">
            <Building2 className="w-10 h-10 text-[#0f4f3a]" />
          </div>
          <h2 className="text-2xl font-bold text-[#111b10] mb-4">عقارات المنطقة</h2>
          <p className="text-[#0f4f3a]/80 font-medium mb-8 flex-grow">تصفح الشقق والوحدات السكنية المتاحة للبيع.</p>
          <Link
            to={ROUTES.PROPERTIES}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#111b10] text-[#c49a3a] font-bold hover:bg-[#111b10]/90 transition-colors shadow-md"
          >
            تصفح العقارات
          </Link>
        </div>

        <div className="bg-[#fdfbf7] rounded-3xl p-8 shadow-lg border-2 border-[#c49a3a]/30 hover:border-[#c49a3a]/60 hover:-translate-y-1 transition-all flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6">
            <Map className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h2 className="text-2xl font-bold text-[#111b10] mb-4">أراضي المنطقة</h2>
          <p className="text-[#0f4f3a]/80 font-medium mb-8 flex-grow">استعرض الأراضي المتاحة للبيع داخل المنطقة وحولها.</p>
          <Link
            to={ROUTES.LANDS}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#111b10] text-[#c49a3a] font-bold hover:bg-[#111b10]/90 transition-colors shadow-md"
          >
            تصفح الأراضي
          </Link>
        </div>
      </div>

      <div className="mt-20 mb-20 text-center">
        <p className="text-[#f6f1df] text-lg mb-6 drop-shadow-md">هل تمتلك عقاراً أو أرضاً للبيع؟</p>
        <Link
          to={ROUTES.SELL}
          className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full border-2 border-[#c49a3a] text-[#c49a3a] font-bold hover:bg-[#c49a3a] hover:text-[#111b10] transition-colors shadow-lg"
        >
          أعلن عن عقارك
        </Link>
      </div>
    </main>
  );
}
