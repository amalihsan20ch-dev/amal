# جمعية الأمل والإحسان — البوابة العامة ونظام الإدارة

منصّة Next.js (App Router) + Supabase + Tailwind، تعمل كـ PWA. الألوان مُشتقّة فعليًا من شعار الجمعية، والأرقام العامة مبذورة من تقرير الأعمال.

## 1) التشغيل المحلي
```bash
npm install
cp .env.example .env.local      # ثم املأ القيم
npm run dev                     # http://localhost:3000
```
> ملاحظة: الـ PWA مُعطّل في وضع التطوير (لتفادي ضجيج الـ Service Worker)؛ يُفعَّل تلقائيًا في الإنتاج.

## 2) إعداد Supabase (مرّة واحدة، بالترتيب)
في SQL Editor نفّذ ملفًا واحدًا شاملًا:
- `supabase/database.sql` — كل شيء (Enums، الجداول، المحفّزات، RLS، التخزين، البذر). آمن للتشغيل مرّة أو أكثر (idempotent) حتى على قاعدة منشورة مسبقًا.

### ترقية أول مدير (Super Admin)
بعد إنشاء حسابك عبر `/volunteer/register`، نفّذ:
```sql
update profiles set role = 'super_admin' where id = (
  select id from auth.users where email = 'YOUR_EMAIL'
);
```

## 3) النشر (Vercel)
- اربط مستودع GitHub بـ Vercel.
- أضف متغيّرات البيئة نفسها من `.env.example`.
- النطاق الناتج هو الذي تضعه في رابط الـ Webhook أدناه.

## 4) إشعار Telegram للمتطوّعين الجدد (القسم 6)
أنشئ بوت عبر BotFather واحصل على `TELEGRAM_BOT_TOKEN` و `TELEGRAM_CHAT_ID`، ثم:
**Supabase → Database → Webhooks → Create**
- Table: `volunteers` · Events: `INSERT`
- Type: HTTP Request · Method: `POST`
- URL: `https://YOUR_APP.vercel.app/api/volunteer-webhook`
- Header: `x-webhook-secret = <WEBHOOK_SECRET>` (نفس القيمة في البيئة)

## 5) الأدوار (RBAC)
`super_admin` و `coordinator` يديران كل شيء؛ `volunteer` يرى طلبه ومهامه والمكتبة بعد القبول. الحماية الفعلية في قاعدة البيانات عبر RLS — والـ middleware للتوجيه فقط.

## 6) الخصوصية (Do No Harm)
- لا توجد قوائم عامة للمتبرعين أو المستفيدين.
- جدولا `beneficiaries` و `donor_interactions` بلا أي سياسة قراءة عامة → RLS يمنع غير الطاقم.
- الواجهة العامة تقرأ `impact_metrics` و `achievements` المنشورة فقط.

## 7) العمل دون اتصال
- `next-pwa` يخزّن القشرة وقراءات Supabase (GET).
- الكتابات الميدانية تمرّ عبر **صندوق الإرسال** `src/lib/outbox.js` (IndexedDB + Background Sync) لتُزامَن عند عودة الاتصال دون فقد أو تكرار (UUID من العميل).

## البنية
```
src/
  app/
    page.jsx                 البوابة العامة (Server)
    login/                   تسجيل الدخول
    volunteer/register/      تسجيل المتطوّع + رفع السيرة
    dashboard/               توجيه حسب الدور
      volunteer/  admin/
    api/volunteer-webhook/   إشعار Telegram
  components/public/         Hero · ImpactDashboard · Achievements · ...
  lib/supabase/              عميل المتصفّح/الخادم
  lib/outbox.js              مزامنة أوفلاين
  middleware.js              توجيه RBAC + تحديث الجلسة
supabase/  schema.sql · rls.sql · seed.sql
public/    logo.png · icons/ · manifest.json
```

## الأرقام المبذورة (من التقرير، تراكميًا)
256 عملية جراحية · +1,475 سلة غذائية · 55 مريض سرطان مدعوم · +135 امرأة في التمكين · 8 محافظات · ~2,500 عائلة/سنة (المطبخ الميداني) · حتى 50 عائلة أيتام بكفالة · 3 آبار مياه · +4 سنوات.
