import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../lib/constants/routes';

export function SuccessPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f7f2e8] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center">
        <div className="glass-panel w-full rounded-[32px] p-10 text-center">
          <CheckCircle2 className="mx-auto mb-6 h-20 w-20 text-secondary" />
          <h1 className="mb-4 text-3xl font-black text-[#1f2c22]">تم إرسال طلبك بنجاح!</h1>
          <p className="mb-8 leading-8 text-[#5f6e62]">
            شكراً لثقتك بنا. سيقوم فريق مبيعات عقارات دليل السبحي بمراجعة تفاصيل عقارك والتواصل معك قريباً.
          </p>

          <div className="flex flex-col gap-4">
            <a
              href="https://chat.whatsapp.com/ECEZfbsvjlU43eDvKa9XUu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-4 font-bold text-white shadow-lg shadow-secondary/20 transition hover:-translate-y-0.5 hover:bg-secondary/90"
            >
              تواصل معنا عبر واتساب الآن
            </a>
            <Link
              to={ROUTES.HOME}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#e4dac5] bg-white px-6 py-4 font-bold text-[#1f2c22] transition hover:-translate-y-0.5 hover:bg-[#fbf7ef]"
            >
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
