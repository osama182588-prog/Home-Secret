# 🎮 Secret CFW - منصة القوانين والتحقق

<div align="center">

**منصة شاملة للقوانين والتحقق لخادم FiveM - Secret CFW**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?logo=discord)](https://discord.js.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

## 📋 نظرة عامة

Secret CFW هي منصة متكاملة مصممة لخوادم FiveM، توفر نظام قوانين وتحقق متكامل مع Discord.

### المميزات الرئيسية

- 📜 **صفحة القوانين** - عرض ديناميكي للقوانين مع بحث وروابط عميقة
- ✅ **نظام التحقق** - اختبار من 5 أسئلة عشوائية مع مراجعة بشرية
- 🤖 **تكامل Discord** - تسجيل دخول OAuth2 وإشعارات ورتب تلقائية
- 👨‍💼 **لوحة تحكم** - إدارة كاملة للقوانين والأسئلة والتحققات
- 🛡️ **نظام نزاهة** - كشف السلوك المشبوه أثناء الاختبار
- 📊 **إحصائيات** - تحليلات شاملة للأداء

## 📁 هيكل المشروع

```
├── web/                    # تطبيق Next.js الرئيسي
│   ├── prisma/             # مخطط قاعدة البيانات
│   └── src/                # كود المصدر
│
├── bot/                    # بوت Discord
│   └── src/                # كود البوت
│
└── README.md               # هذا الملف
```

## 🚀 البدء السريع

### تطبيق الويب

```bash
cd web
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

### بوت Discord

```bash
cd bot
npm install
cp .env.example .env
npm run dev
```

## 🔧 التقنيات المستخدمة

- **Frontend**: Next.js 16, TailwindCSS 4, React 19
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: NextAuth.js with Discord OAuth2
- **Bot**: discord.js v14, Express.js

## 📄 الترخيص

MIT License

---

<div align="center">
صنع بـ ❤️ لمجتمع Secret CFW
</div>