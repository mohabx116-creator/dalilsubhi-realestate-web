import { useEffect } from 'react';
import { Home, Megaphone } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import dalilSubhiLogo from '../../assets/dalil-subhi-logo.jpg';
import { ROUTES } from '../../lib/constants/routes';

const REAL_ESTATE_ORIGIN = 'https://realestate-ds-core-91.dalilsubhi.com';

function updateHeadTag(
  selector: string,
  create: () => HTMLElement,
  update: (element: HTMLElement) => void,
): void {
  const element = document.head.querySelector(selector) as HTMLElement | null;
  if (element) {
    update(element);
    return;
  }

  const created = create();
  update(created);
  document.head.appendChild(created);
}

function useRealEstateSeo(pathname: string) {
  useEffect(() => {
    const normalizedPath = pathname.replace(/\/+$/, '') || '/';
    const canonicalUrl = `${REAL_ESTATE_ORIGIN}${normalizedPath === '/' ? '/' : normalizedPath}`;

    const seo =
      normalizedPath === '/'
        ? {
            title: 'عقارات دليل السبحي | البيع والعروض الرسمية',
            description: 'استعرض العقارات والفرص المتاحة عبر البوابة الرسمية لعقارات دليل السبحي.',
          }
        : normalizedPath === '/properties'
          ? {
              title: 'عقارات دليل السبحي | قائمة العقارات',
              description: 'تصفح قائمة العقارات المعروضة للبيع من خلال البوابة الرسمية.',
            }
          : normalizedPath === '/lands'
            ? {
                title: 'أراضي دليل السبحي | قائمة الأراضي',
                description: 'استعرض الأراضي المتاحة عبر البوابة الرسمية لعقارات دليل السبحي.',
              }
            : normalizedPath === '/sell'
              ? {
                  title: 'أعلن عن عقارك | دليل السبحي',
                  description: 'أرسل بيانات العقار أو الأرض لعرضه عبر بوابة عقارات دليل السبحي.',
                }
              : normalizedPath === '/success'
                ? {
                    title: 'تم الإرسال | دليل السبحي',
                    description: 'تم إرسال طلبك بنجاح عبر بوابة عقارات دليل السبحي.',
                  }
                : normalizedPath.startsWith('/properties/') || normalizedPath.startsWith('/lands/')
                  ? {
                      title: 'تفاصيل العقار | دليل السبحي',
                      description: 'اطلع على تفاصيل العقار وصوره ومعلوماته عبر البوابة الرسمية.',
                    }
                  : {
                      title: 'عقارات دليل السبحي | البيع والعروض الرسمية',
                      description: 'استعرض العقارات والفرص المتاحة عبر البوابة الرسمية لعقارات دليل السبحي.',
                    };

    document.title = seo.title;

    updateHeadTag(
      'meta[name="description"]',
      () => document.createElement('meta'),
      (element) => {
        element.setAttribute('name', 'description');
        element.setAttribute('content', seo.description);
      },
    );

    updateHeadTag(
      'meta[property="og:title"]',
      () => document.createElement('meta'),
      (element) => {
        element.setAttribute('property', 'og:title');
        element.setAttribute('content', seo.title);
      },
    );

    updateHeadTag(
      'meta[property="og:description"]',
      () => document.createElement('meta'),
      (element) => {
        element.setAttribute('property', 'og:description');
        element.setAttribute('content', seo.description);
      },
    );

    updateHeadTag(
      'meta[property="og:url"]',
      () => document.createElement('meta'),
      (element) => {
        element.setAttribute('property', 'og:url');
        element.setAttribute('content', canonicalUrl);
      },
    );

    updateHeadTag(
      'meta[name="twitter:title"]',
      () => document.createElement('meta'),
      (element) => {
        element.setAttribute('name', 'twitter:title');
        element.setAttribute('content', seo.title);
      },
    );

    updateHeadTag(
      'meta[name="twitter:description"]',
      () => document.createElement('meta'),
      (element) => {
        element.setAttribute('name', 'twitter:description');
        element.setAttribute('content', seo.description);
      },
    );

    updateHeadTag(
      'link[rel="canonical"]',
      () => document.createElement('link'),
      (element) => {
        element.setAttribute('rel', 'canonical');
        element.setAttribute('href', canonicalUrl);
      },
    );
  }, [pathname]);
}

export function PublicRealEstateShell() {
  const location = useLocation();
  useRealEstateSeo(location.pathname);

  return (
    <div className="min-h-dvh bg-[#f7f2e8] font-sans text-[#1f2c22]">
      <header className="sticky top-0 z-40 border-b border-[#ebdcb9]/50 bg-white/90 shadow-[0_8px_30px_rgba(28,45,34,0.03)] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" to="/">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[14px] border border-[#ebdcb9]/80 bg-white shadow-sm">
              <img src={dalilSubhiLogo} alt="دليل السبحي" className="h-full w-full object-contain mix-blend-multiply" />
            </span>
            <div className="text-right">
              <p className="text-sm font-black text-[#12221b] sm:text-base">عقارات دليل السبحي</p>
              <p className="hidden text-[10px] font-semibold text-neutral-500 sm:block">بوابة مخصصة لعرض العقارات والأراضي المعروضة للبيع</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1.5 text-xs font-bold text-[#12221b]">
            <a
              className="hidden min-h-9 items-center gap-1.5 rounded-full px-3.5 py-2 transition duration-200 hover:bg-[#f6eee0] hover:text-[#7b5d14] sm:inline-flex"
              href="https://dalilsubhi.com/"
            >
              دليل السبحي
            </a>
            <Link
              className="hidden items-center gap-1.5 rounded-full px-3.5 py-2 transition duration-200 hover:bg-[#f6eee0] hover:text-[#7b5d14] md:inline-flex"
              to={ROUTES.SELL}
            >
              <Megaphone className="h-3.5 w-3.5 text-[#7b5d14]" />
              أعلن عن عقارك
            </Link>
            <Link
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-secondary px-4.5 py-2 text-white shadow-md shadow-secondary/15 transition duration-200 hover:bg-secondary/95"
              to={ROUTES.PROPERTIES}
            >
              <Home className="h-3.5 w-3.5" />
              العقارات
            </Link>
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="border-t border-[#ebdcb9]/65 bg-[#f3edd9] text-[#243128]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 text-right md:grid-cols-4" dir="rtl">
            <div className="space-y-3">
              <h3 className="text-sm font-black text-[#12221b]">مجمع الخدمات للمنطقة</h3>
              <p className="text-xs leading-relaxed text-neutral-500">منصة آمنة لعرض خدمات المنطقة</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-black text-[#12221b]">للتواصل والدعم</h3>
              <div className="mt-2 flex flex-col gap-2">
                <a
                  href="https://chat.whatsapp.com/ECEZfbsvjlU43eDvKa9XUu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-1.5 text-xs text-[#7b5d14] transition-colors hover:text-[#5c440d]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  خدمة العملاء
                </a>
                <a
                  href="https://www.facebook.com/share/g/1CzbCwjugk/?mibextid=KtfwRi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-1.5 text-xs text-[#7b5d14] transition-colors hover:text-[#5c440d]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  جروب الفيس بوك
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-black text-[#12221b]">روابط مهمة</h3>
              <ul className="space-y-2 text-xs text-neutral-500">
                <li>
                  <a
                    href="https://dalilsubhi.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#7b5d14]"
                  >
                    الصفحة الرئيسية
                  </a>
                </li>
                <li>
                  <a
                    href="https://chat.whatsapp.com/ECEZfbsvjlU43eDvKa9XUu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#7b5d14]"
                  >
                    خدمة العملاء
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/share/g/1CzbCwjugk/?mibextid=KtfwRi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#7b5d14]"
                  >
                    جروب الفيس بوك
                  </a>
                </li>
                <li>
                  <a
                    href="https://dalilsubhi.com/publishing-policy"
                    className="transition-colors hover:text-[#7b5d14]"
                  >
                    سياسة النشر والإعلان
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-8 border-t border-[#ebdcb9]/50 pt-6 text-center">
            <p className="text-[10px] text-neutral-400">© 2026 مجمع الخدمات للمنطقة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
