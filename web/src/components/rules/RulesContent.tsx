'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Rule {
  id: string;
  title: string;
  content: string;
  order?: number;
  enabled?: boolean;
}

interface RuleCategory {
  id: string;
  name: string;
  slug: string;
  order?: number;
  enabled?: boolean;
  rules: Rule[];
}

// Static rules data as fallback
const fallbackRulesData: RuleCategory[] = [
  {
    id: 'roleplay-basics',
    slug: 'roleplay-basics',
    name: '🧠 قوانين الرول بلاي الأساسية',
    rules: [
      {
        id: 'nlr',
        title: 'NLR – نظام الحياة الجديدة',
        content: `عند فقدان الوعي يمنع التحدث أو التحرك حتى الإنعاش.
الإنعاش العدائي يلغي تذكر الأحداث السابقة.
• يجب عليك نسيان كل ما حدث قبل فقدان الوعي
• لا يمكنك العودة إلى موقع وفاتك لمدة 15 دقيقة
• لا يمكنك الانتقام من الشخص الذي تسبب في موتك`,
      },
      {
        id: 'powergaming',
        title: 'PowerGaming',
        content: `استخدام أساليب غير واقعية للحصول على أفضلية.
• إجبار اللاعبين الآخرين على فعل شيء غير منطقي
• استخدام ميكانيكيات اللعبة بشكل غير واقعي
• رفع مستوى المهارات بطرق غير شرعية`,
      },
      {
        id: 'nvl',
        title: 'NVL – عدم تقدير الحياة',
        content: `عدم تقدير الحياة عند التهديد يعتبر مخالفة.
• يجب الامتثال للأوامر عند التهديد بالسلاح
• لا يمكنك المقاومة إذا كان هناك تفوق عددي واضح
• يجب التصرف كما لو أن حياتك حقيقية ومهمة`,
      },
      {
        id: 'metagaming',
        title: 'MetaGaming',
        content: `استخدام معلومات خارج اللعبة داخل الرول بلاي.
• لا يمكنك استخدام معلومات من البث المباشر
• لا يمكنك مشاركة معلومات عبر Discord أثناء اللعب
• يجب أن تكتسب المعلومات من داخل اللعبة فقط`,
      },
      {
        id: 'rdm',
        title: 'RDM – القتل العشوائي',
        content: `القتل بدون سبب رول بلاي واضح.
• يجب وجود تفاعل رول بلاي قبل أي قتال
• لا يمكنك قتل أي شخص بدون سبب واضح
• يجب توثيق سبب القتل في حال الشكوى`,
      },
    ],
  },
  {
    id: 'general-rules',
    slug: 'general-rules',
    name: '📌 القوانين العامة',
    rules: [
      {
        id: 'age',
        title: 'العمر',
        content: 'يجب أن يكون عمرك 18 سنة أو أكثر للعب على الخادم.',
      },
      {
        id: 'character',
        title: 'الشخصيات',
        content: `شخصية واحدة فقط لكل لاعب.
• يمنع إنشاء شخصيات متعددة
• يجب الالتزام بالشخصية المختارة`,
      },
      {
        id: 'names',
        title: 'الأسماء',
        content: `يمنع الأسماء غير الواقعية أو أسماء المشاهير.
• يجب استخدام اسم عربي أو إنجليزي واقعي
• لا يمكن استخدام أسماء شخصيات مشهورة`,
      },
      {
        id: 'accounts',
        title: 'الحسابات',
        content: 'يمنع مشاركة الحسابات بشكل قاطع.',
      },
      {
        id: 'roleplay-break',
        title: 'الخروج عن الرول',
        content: 'يمنع الخروج عن الرول بلاي في أي وقت أثناء اللعب.',
      },
      {
        id: 'exploitation',
        title: 'الاستغلال',
        content: 'يمنع استغلال الخدمات أو الثغرات في اللعبة.',
      },
      {
        id: 'behavior',
        title: 'السلوك',
        content: `يمنع السب، العنصرية، السياسة، الدين.
• يجب الاحترام المتبادل بين اللاعبين
• لا يسمح بأي نوع من التمييز`,
      },
      {
        id: 'money',
        title: 'الأموال',
        content: 'يمنع توزيع أموال كبيرة بدون خبرة كافية.',
      },
      {
        id: 'carrying',
        title: 'الحمل',
        content: 'يمنع حمل أكثر من شخص واحد في نفس الوقت.',
      },
    ],
  },
  {
    id: 'driving-rules',
    slug: 'driving-rules',
    name: '🚗 قوانين القيادة',
    rules: [
      {
        id: 'realistic-driving',
        title: 'القيادة الواقعية',
        content: `قيادة واقعية فقط.
• يجب احترام قوانين المرور
• يمنع القيادة بسرعات جنونية بدون سبب`,
      },
      {
        id: 'reckless-driving',
        title: 'القيادة المتهورة',
        content: `يمنع التهور، القفز، السرعة غير المبررة.
• لا يمكنك القفز بالسيارة من المنحدرات
• يجب الحفاظ على سلامة المركبة`,
      },
    ],
  },
  {
    id: 'warning-system',
    slug: 'warning-system',
    name: '⚠️ نظام التحذيرات',
    rules: [
      {
        id: 'warnings',
        title: 'نظام التحذيرات',
        content: `تصاعدي حتى الحظر المؤقت أو الدائم حسب التكرار.
• التحذير الأول: إنذار شفهي
• التحذير الثاني: حظر مؤقت 24 ساعة
• التحذير الثالث: حظر مؤقت 7 أيام
• التحذير الرابع: حظر دائم`,
      },
    ],
  },
  {
    id: 'police-rules',
    slug: 'police-rules',
    name: '👮‍♂️ قوانين الشرطة',
    rules: [
      {
        id: 'raids',
        title: 'المداهمات',
        content: 'المداهمات بأمر قضائي فقط.',
      },
      {
        id: 'force',
        title: 'استخدام القوة',
        content: 'استخدام القوة بقدر الحاجة فقط.',
      },
      {
        id: 'corruption',
        title: 'الفساد',
        content: 'يمنع الفساد في صفوف الشرطة.',
      },
      {
        id: 'citizen-rights',
        title: 'حقوق المواطنين',
        content: 'احترام حقوق المواطنين في جميع الأوقات.',
      },
    ],
  },
  {
    id: 'ems-rules',
    slug: 'ems-rules',
    name: '🚑 قوانين الإسعاف',
    rules: [
      {
        id: 'criminal-activity',
        title: 'النشاط الإجرامي',
        content: 'يمنع النشاط الإجرامي لأفراد الإسعاف.',
      },
      {
        id: 'weapons',
        title: 'الأسلحة',
        content: 'يمنع حمل السلاح أثناء الخدمة.',
      },
      {
        id: 'uniform',
        title: 'الزي والمهام',
        content: 'الالتزام بالزي والمهام المحددة.',
      },
      {
        id: 'absence',
        title: 'الغياب',
        content: 'الغياب غير المبرر يعرض للفصل.',
      },
    ],
  },
  {
    id: 'gang-rules',
    slug: 'gang-rules',
    name: '🪖 قوانين العصابات',
    rules: [
      {
        id: 'alliances',
        title: 'التحالفات',
        content: 'يمنع التحالف بدون موافقة الإدارة.',
      },
      {
        id: 'hostility',
        title: 'العداوات',
        content: 'العداوات موثقة فقط ويجب تسجيلها.',
      },
      {
        id: 'members',
        title: 'عدد الأعضاء',
        content: 'عدد الأعضاء يتراوح بين 10-25 عضو.',
      },
      {
        id: 'recording',
        title: 'التصوير',
        content: 'تصوير المواجهات إلزامي للتوثيق.',
      },
    ],
  },
  {
    id: 'justice-rules',
    slug: 'justice-rules',
    name: '⚖️ قوانين وزارة العدل',
    rules: [
      {
        id: 'ranks',
        title: 'الرتب',
        content: 'الرتب: قاضي – مدعي عام – محامي.',
      },
      {
        id: 'court-weapons',
        title: 'السلاح في المحكمة',
        content: 'يمنع دخول المحكمة بالسلاح.',
      },
      {
        id: 'immunity',
        title: 'حصانة القاضي',
        content: 'القاضي يتمتع بحصانة قضائية.',
      },
      {
        id: 'kidnapping',
        title: 'خطف القاضي',
        content: 'خطف القاضي جريمة كبرى تستوجب العقوبة القصوى.',
      },
    ],
  },
];

export default function RulesContent() {
  const [rulesData, setRulesData] = useState<RuleCategory[]>(fallbackRulesData);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const [agreed, setAgreed] = useState(false);

  // Fetch rules from API
  const fetchRules = useCallback(async () => {
    try {
      const response = await fetch('/api/rules');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          // Use API data directly since it matches our structure
          setRulesData(data);
        }
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
      // Keep using fallback data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  // Filter rules based on search
  const filteredRules = rulesData.map(category => ({
    ...category,
    rules: category.rules.filter(
      rule =>
        rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.content.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.rules.length > 0);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          current = section.getAttribute('data-section') || '';
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4" />
          <p className="text-[var(--foreground-muted)]">جاري تحميل القوانين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sticky Sidebar */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="lg:sticky lg:top-24 card">
          <h3 className="font-bold mb-4 text-[var(--primary)]">📑 جدول المحتويات</h3>
          <nav className="space-y-2">
            {rulesData.map(category => (
              <a
                key={category.id}
                href={`#${category.slug}`}
                className={`block text-sm py-2 px-3 rounded-lg transition-colors ${
                  activeSection === category.slug
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]'
                }`}
              >
                {category.name}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 ابحث في القوانين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pr-10"
          />
        </div>

        {/* Rules Sections */}
        {filteredRules.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-[var(--foreground-muted)]">
              لم يتم العثور على نتائج للبحث
            </p>
          </div>
        ) : (
          filteredRules.map(category => (
            <section
              key={category.id}
              id={category.slug}
              data-section={category.slug}
              className="scroll-mt-24"
            >
              <div className="card">
                <h2 className="text-2xl font-bold mb-6 gradient-text">
                  {category.name}
                </h2>
                <div className="space-y-6">
                  {category.rules.map(rule => (
                    <div
                      key={rule.id}
                      id={rule.id}
                      className="border-r-4 border-[var(--primary)] pr-4"
                    >
                      <h3 className="text-lg font-semibold mb-2 text-[var(--primary)]">
                        {rule.title}
                      </h3>
                      <div className="text-[var(--foreground-muted)] whitespace-pre-line">
                        {rule.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))
        )}

        {/* Agreement Section */}
        <div className="card border-2 border-[var(--primary)]">
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 mt-1 accent-[var(--primary)]"
            />
            <label htmlFor="agree" className="flex-1">
              <span className="font-semibold block mb-2">
                أوافق على جميع القوانين
              </span>
              <span className="text-[var(--foreground-muted)] text-sm">
                بتحديد هذا الخيار، أؤكد أنني قرأت وفهمت جميع قوانين الخادم وأوافق على الالتزام بها.
              </span>
            </label>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link
              href={agreed ? '/verify' : '#'}
              className={`btn ${agreed ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'} flex-1 justify-center`}
              onClick={(e) => !agreed && e.preventDefault()}
            >
              ✅ متابعة للتحقق
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
