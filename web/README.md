# 🎮 Secret CFW - منصة القوانين والتحقق

<div align="center">

**منصة شاملة للقوانين والتحقق لخادم FiveM**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?logo=discord)](https://discord.js.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

## 📋 نظرة عامة

Secret CFW هي منصة متكاملة مصممة لخوادم FiveM، توفر:

- 📜 **صفحة القوانين** - عرض ديناميكي للقوانين مع بحث وروابط عميقة
- ✅ **نظام التحقق** - اختبار من 5 أسئلة عشوائية مع مراجعة بشرية
- 🤖 **تكامل Discord** - تسجيل دخول OAuth2 وإشعارات ورتب تلقائية
- 👨‍💼 **لوحة تحكم** - إدارة كاملة للقوانين والأسئلة والتحققات
- 🛡️ **نظام نزاهة** - كشف السلوك المشبوه أثناء الاختبار
- 📊 **إحصائيات** - تحليلات شاملة للأداء

## 🚀 البدء السريع

### المتطلبات

- Node.js 18+
- PostgreSQL 14+
- Discord Application

### التثبيت

```bash
npm install
cp .env.example .env
# أكمل إعدادات .env

# إنشاء جداول قاعدة البيانات
npm run db:push

# بذر البيانات الأولية
npm run db:seed

# تشغيل الخادم
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## 📁 هيكل المشروع

```
├── prisma/
│   ├── schema.prisma        # مخطط قاعدة البيانات
│   └── seed/                # بيانات البذر
├── src/
│   ├── app/                 # صفحات Next.js (App Router)
│   │   ├── api/             # API Routes
│   │   ├── dashboard/       # لوحة التحكم
│   │   ├── rules/           # صفحة القوانين
│   │   └── verify/          # صفحة التحقق
│   ├── components/          # مكونات React
│   └── lib/                 # مكتبات مساعدة
└── public/                  # ملفات ثابتة
```

## 🔧 الإعدادات

### متغيرات البيئة (.env)

```env
# قاعدة البيانات
DATABASE_URL="postgresql://user:password@localhost:5432/secret_cfw"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Discord OAuth
DISCORD_CLIENT_ID="xxx"
DISCORD_CLIENT_SECRET="xxx"
DISCORD_BOT_TOKEN="xxx"
DISCORD_GUILD_ID="xxx"
```

## 🔐 الأدوار والصلاحيات

| الدور | الصلاحيات |
|-------|----------|
| `USER` | عرض القوانين، التقديم للتحقق |
| `REVIEWER` | مراجعة طلبات التحقق |
| `SENIOR_REVIEWER` | + تجاوز القرارات، إدارة القائمة السوداء |
| `SUPERVISOR` | + إدارة القوانين والأسئلة، الإحصائيات |
| `ADMIN` | وصول كامل |

## 📱 الصفحات

- **الرئيسية (/)** - عرض مميزات المنصة
- **القوانين (/rules)** - عرض جميع القوانين مع فهرس جانبي
- **التحقق (/verify)** - تسجيل دخول واختبار 5 أسئلة
- **لوحة التحكم (/dashboard)** - إدارة كاملة للنظام

## 🛡️ ميزات الأمان

- ✅ التحقق من عضوية الـ Guild
- ✅ كشف تبديل التبويب
- ✅ كشف النسخ/اللصق
- ✅ حماية CSRF
- ✅ تحقق من صلاحيات الإداريين
- ✅ سجل تدقيق شامل

## 🌐 التصميم

- **اللغة**: العربية (RTL)
- **الثيم**: Dark Blue + Cyan Gradient
- **الخط**: Noto Sans Arabic
- **المتجاوب**: Desktop, Tablet, Mobile

## 📝 أوامر مفيدة

```bash
npm run dev          # تشغيل التطوير
npm run build        # بناء للإنتاج
npm run db:push      # تحديث قاعدة البيانات
npm run db:seed      # بذر البيانات
npm run lint         # فحص الكود
```

## 🚀 النشر على Vercel

```bash
vercel
```

## 📄 الترخيص

MIT License

---

<div align="center">
صنع بـ ❤️ لمجتمع Secret CFW
</div>
