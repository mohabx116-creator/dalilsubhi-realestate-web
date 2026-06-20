import { Building2, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../lib/constants/routes';

export function HomePage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f7f2e8] px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e4dac5] bg-white/75 px-4 py-2 text-sm font-bold text-tertiary shadow-sm backdrop-blur-md">
            <Building2 className="h-4 w-4" />
            عقارات دليل السبحي
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight text-[#1f2c22] sm:text-5xl">
            عقارات المنطقة
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-9 text-[#5f6e62]">
            بوابة مخصصة لعرض عقارات وأراضي المنطقة للبيع بطريقة واضحة وآمنة ومريحة للعين.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="glass-panel rounded-[32px] p-8 text-center transition hover:-translate-y-1">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary/10 text-secondary">
              <Building2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black text-[#1f2c22]">عقارات المنطقة</h2>
            <p className="mt-4 text-[#5f6e62] leading-8">
              تصفح الشقق والوحدات السكنية المتاحة للبيع.
            </p>
            <Link
              to={ROUTES.PROPERTIES}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-secondary px-8 py-3 text-sm font-black text-white shadow-lg shadow-secondary/20 transition hover:bg-secondary/90"
            >
              تصفح العقارات
            </Link>
          </div>

          <div className="glass-panel rounded-[32px] p-8 text-center transition hover:-translate-y-1">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-tertiary/15 text-tertiary">
              <Map className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black text-[#1f2c22]">أراضي المنطقة</h2>
            <p className="mt-4 text-[#5f6e62] leading-8">
              استعرض الأراضي المتاحة للبيع داخل المنطقة وحولها.
            </p>
            <Link
              to={ROUTES.LANDS}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-secondary px-8 py-3 text-sm font-black text-white shadow-lg shadow-secondary/20 transition hover:bg-secondary/90"
            >
              تصفح الأراضي
            </Link>
          </div>
        </div>

        <div className="mt-14 text-center">
          <p className="text-lg font-semibold text-[#1f2c22]">هل تمتلك عقاراً أو أرضاً للبيع؟</p>
          <Link
            to={ROUTES.SELL}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-tertiary px-8 py-3 text-sm font-black text-tertiary transition hover:bg-tertiary hover:text-[#1f2c22]"
          >
            أعلن عن عقارك
          </Link>
        </div>
      </section>
    </main>
  );
}
