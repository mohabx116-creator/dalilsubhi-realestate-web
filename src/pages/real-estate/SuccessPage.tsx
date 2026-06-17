import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../lib/constants/routes';

export function SuccessPage() {
  return (
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-sm border border-outline/10">
        <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-black text-primary mb-4">تم إرسال طلبك بنجاح!</h1>
        <p className="text-on-surface-variant leading-relaxed mb-8">
          شكراً لثقتك بنا. سيقوم فريق مبيعات عقارات دليل السبحي بمراجعة تفاصيل عقارك والتواصل معك قريباً.
        </p>
        
        <div className="flex flex-col gap-4">
          <a
            href="https://chat.whatsapp.com/ECEZfbsvjlU43eDvKa9XUu"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#25D366]/90 transition-colors"
          >
            تواصل معنا عبر واتساب الآن
          </a>
          <Link
            to={ROUTES.HOME}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-outline text-primary font-bold hover:bg-surface transition-colors"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
