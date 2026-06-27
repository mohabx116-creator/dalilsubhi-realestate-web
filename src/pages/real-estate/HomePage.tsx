import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OWNER_SUBMISSION_URL } from '../../lib/constants/links';
import { ROUTES } from '../../lib/constants/routes';

export function HomePage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#fcfaf6] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ebdcb9]/60 bg-white/70 px-3.5 py-1.5 text-xs font-bold text-tertiary shadow-sm backdrop-blur-md">
            <Building2 className="h-3.5 w-3.5" />
            عقارات دليل السبحي
          </span>
          <h1 className="mt-5 text-3xl font-black leading-tight text-[#12221b] sm:text-5xl">
            عقارات المنطقة
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#506053] sm:text-base sm:leading-8">
            بوابة مخصصة لعرض عقارات المنطقة للبيع بطريقة واضحة وآمنة ومريحة للعين.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl gap-6">
          <div className="rounded-2xl border border-[#ebdcb9]/60 bg-white/70 p-8 text-center shadow-[0_8px_30px_rgba(28,45,34,0.02)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#d6b25e]/30">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/5 text-secondary">
              <Building2 className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-black text-[#12221b]">عقارات المنطقة</h2>
            <p className="mt-3 text-xs leading-6 text-[#506053]">
              تصفح الشقق والوحدات السكنية المتاحة للبيع.
            </p>
            <Link
              to={ROUTES.PROPERTIES}
              className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full bg-secondary px-6 py-2 text-xs font-bold text-white shadow-md shadow-secondary/15 transition hover:bg-secondary/95"
            >
              تصفح العقارات
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center max-w-xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl border border-[#ebdcb9]/65 bg-[#fdfcf9]">
            <p className="text-sm font-bold text-[#12221b]">هل تمتلك عقاراً للبيع؟</p>
            <p className="mt-1 text-xs text-neutral-500">أضف عقارك بسهولة في خطوات بسيطة وسريعة وسنتواصل معك.</p>
            <Link
              to={ROUTES.SELL}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-[#12221b] bg-white px-6 py-2 text-xs font-bold text-[#12221b] transition hover:bg-[#12221b] hover:text-white"
            >
              أعلن عن عقارك
            </Link>
          </div>

          <div className="md:hidden">
            <a
              href={OWNER_SUBMISSION_URL}
              className="flex items-start gap-4 rounded-2xl border border-[#d6b25e]/25 bg-white p-5 text-right shadow-[0_8px_30px_rgba(7,22,20,0.03)] transition hover:-translate-y-0.5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0fa37f] to-[#0c8a6b] text-white shadow-md shadow-[#0fa37f]/15">
                <Building2 className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black leading-5 text-[#071614]">عندك وحدة للإيجار؟ أعلن عنها</p>
                <p className="mt-1 text-xs leading-4 text-neutral-500">انشر وحدتك ضمن قسم الإيجارات</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
