import { PrismaClient, QuestionType, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.verificationAnswer.deleteMany();
  await prisma.verificationAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.rule.deleteMany();
  await prisma.ruleCategory.deleteMany();
  await prisma.blacklist.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.setting.deleteMany();

  // Create rule categories
  const categories = await Promise.all([
    prisma.ruleCategory.create({
      data: {
        name: '🧠 قوانين الرول بلاي الأساسية',
        nameEn: 'Basic Roleplay Rules',
        slug: 'roleplay-basics',
        order: 1,
      },
    }),
    prisma.ruleCategory.create({
      data: {
        name: '📌 القوانين العامة',
        nameEn: 'General Rules',
        slug: 'general-rules',
        order: 2,
      },
    }),
    prisma.ruleCategory.create({
      data: {
        name: '🚗 قوانين القيادة',
        nameEn: 'Driving Rules',
        slug: 'driving-rules',
        order: 3,
      },
    }),
    prisma.ruleCategory.create({
      data: {
        name: '⚠️ نظام التحذيرات',
        nameEn: 'Warning System',
        slug: 'warning-system',
        order: 4,
      },
    }),
    prisma.ruleCategory.create({
      data: {
        name: '👮‍♂️ قوانين الشرطة',
        nameEn: 'Police Rules',
        slug: 'police-rules',
        order: 5,
      },
    }),
    prisma.ruleCategory.create({
      data: {
        name: '🚑 قوانين الإسعاف',
        nameEn: 'EMS Rules',
        slug: 'ems-rules',
        order: 6,
      },
    }),
    prisma.ruleCategory.create({
      data: {
        name: '🪖 قوانين العصابات',
        nameEn: 'Gang Rules',
        slug: 'gang-rules',
        order: 7,
      },
    }),
    prisma.ruleCategory.create({
      data: {
        name: '⚖️ قوانين وزارة العدل',
        nameEn: 'Justice Rules',
        slug: 'justice-rules',
        order: 8,
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Create rules
  const [roleplayBasics, generalRules, drivingRules, warningSystem, policeRules, emsRules, gangRules, justiceRules] = categories;

  // Roleplay Basics Rules
  await prisma.rule.createMany({
    data: [
      {
        categoryId: roleplayBasics.id,
        title: 'NLR – نظام الحياة الجديدة',
        content: `عند فقدان الوعي يمنع التحدث أو التحرك حتى الإنعاش.
الإنعاش العدائي يلغي تذكر الأحداث السابقة.
• يجب عليك نسيان كل ما حدث قبل فقدان الوعي
• لا يمكنك العودة إلى موقع وفاتك لمدة 15 دقيقة
• لا يمكنك الانتقام من الشخص الذي تسبب في موتك`,
        order: 1,
      },
      {
        categoryId: roleplayBasics.id,
        title: 'PowerGaming',
        content: `استخدام أساليب غير واقعية للحصول على أفضلية.
• إجبار اللاعبين الآخرين على فعل شيء غير منطقي
• استخدام ميكانيكيات اللعبة بشكل غير واقعي
• رفع مستوى المهارات بطرق غير شرعية`,
        order: 2,
      },
      {
        categoryId: roleplayBasics.id,
        title: 'NVL – عدم تقدير الحياة',
        content: `عدم تقدير الحياة عند التهديد يعتبر مخالفة.
• يجب الامتثال للأوامر عند التهديد بالسلاح
• لا يمكنك المقاومة إذا كان هناك تفوق عددي واضح
• يجب التصرف كما لو أن حياتك حقيقية ومهمة`,
        order: 3,
      },
      {
        categoryId: roleplayBasics.id,
        title: 'MetaGaming',
        content: `استخدام معلومات خارج اللعبة داخل الرول بلاي.
• لا يمكنك استخدام معلومات من البث المباشر
• لا يمكنك مشاركة معلومات عبر Discord أثناء اللعب
• يجب أن تكتسب المعلومات من داخل اللعبة فقط`,
        order: 4,
      },
      {
        categoryId: roleplayBasics.id,
        title: 'RDM – القتل العشوائي',
        content: `القتل بدون سبب رول بلاي واضح.
• يجب وجود تفاعل رول بلاي قبل أي قتال
• لا يمكنك قتل أي شخص بدون سبب واضح
• يجب توثيق سبب القتل في حال الشكوى`,
        order: 5,
      },
    ],
  });

  // General Rules
  await prisma.rule.createMany({
    data: [
      { categoryId: generalRules.id, title: 'العمر', content: 'يجب أن يكون عمرك 18 سنة أو أكثر للعب على الخادم.', order: 1 },
      { categoryId: generalRules.id, title: 'الشخصيات', content: 'شخصية واحدة فقط لكل لاعب.\n• يمنع إنشاء شخصيات متعددة\n• يجب الالتزام بالشخصية المختارة', order: 2 },
      { categoryId: generalRules.id, title: 'الأسماء', content: 'يمنع الأسماء غير الواقعية أو أسماء المشاهير.\n• يجب استخدام اسم عربي أو إنجليزي واقعي\n• لا يمكن استخدام أسماء شخصيات مشهورة', order: 3 },
      { categoryId: generalRules.id, title: 'الحسابات', content: 'يمنع مشاركة الحسابات بشكل قاطع.', order: 4 },
      { categoryId: generalRules.id, title: 'الخروج عن الرول', content: 'يمنع الخروج عن الرول بلاي في أي وقت أثناء اللعب.', order: 5 },
      { categoryId: generalRules.id, title: 'الاستغلال', content: 'يمنع استغلال الخدمات أو الثغرات في اللعبة.', order: 6 },
      { categoryId: generalRules.id, title: 'السلوك', content: 'يمنع السب، العنصرية، السياسة، الدين.\n• يجب الاحترام المتبادل بين اللاعبين\n• لا يسمح بأي نوع من التمييز', order: 7 },
      { categoryId: generalRules.id, title: 'الأموال', content: 'يمنع توزيع أموال كبيرة بدون خبرة كافية.', order: 8 },
      { categoryId: generalRules.id, title: 'الحمل', content: 'يمنع حمل أكثر من شخص واحد في نفس الوقت.', order: 9 },
    ],
  });

  // Driving Rules
  await prisma.rule.createMany({
    data: [
      { categoryId: drivingRules.id, title: 'القيادة الواقعية', content: 'قيادة واقعية فقط.\n• يجب احترام قوانين المرور\n• يمنع القيادة بسرعات جنونية بدون سبب', order: 1 },
      { categoryId: drivingRules.id, title: 'القيادة المتهورة', content: 'يمنع التهور، القفز، السرعة غير المبررة.\n• لا يمكنك القفز بالسيارة من المنحدرات\n• يجب الحفاظ على سلامة المركبة', order: 2 },
    ],
  });

  // Warning System
  await prisma.rule.createMany({
    data: [
      { categoryId: warningSystem.id, title: 'نظام التحذيرات', content: 'تصاعدي حتى الحظر المؤقت أو الدائم حسب التكرار.\n• التحذير الأول: إنذار شفهي\n• التحذير الثاني: حظر مؤقت 24 ساعة\n• التحذير الثالث: حظر مؤقت 7 أيام\n• التحذير الرابع: حظر دائم', order: 1 },
    ],
  });

  // Police Rules
  await prisma.rule.createMany({
    data: [
      { categoryId: policeRules.id, title: 'المداهمات', content: 'المداهمات بأمر قضائي فقط.', order: 1 },
      { categoryId: policeRules.id, title: 'استخدام القوة', content: 'استخدام القوة بقدر الحاجة فقط.', order: 2 },
      { categoryId: policeRules.id, title: 'الفساد', content: 'يمنع الفساد في صفوف الشرطة.', order: 3 },
      { categoryId: policeRules.id, title: 'حقوق المواطنين', content: 'احترام حقوق المواطنين في جميع الأوقات.', order: 4 },
    ],
  });

  // EMS Rules
  await prisma.rule.createMany({
    data: [
      { categoryId: emsRules.id, title: 'النشاط الإجرامي', content: 'يمنع النشاط الإجرامي لأفراد الإسعاف.', order: 1 },
      { categoryId: emsRules.id, title: 'الأسلحة', content: 'يمنع حمل السلاح أثناء الخدمة.', order: 2 },
      { categoryId: emsRules.id, title: 'الزي والمهام', content: 'الالتزام بالزي والمهام المحددة.', order: 3 },
      { categoryId: emsRules.id, title: 'الغياب', content: 'الغياب غير المبرر يعرض للفصل.', order: 4 },
    ],
  });

  // Gang Rules
  await prisma.rule.createMany({
    data: [
      { categoryId: gangRules.id, title: 'التحالفات', content: 'يمنع التحالف بدون موافقة الإدارة.', order: 1 },
      { categoryId: gangRules.id, title: 'العداوات', content: 'العداوات موثقة فقط ويجب تسجيلها.', order: 2 },
      { categoryId: gangRules.id, title: 'عدد الأعضاء', content: 'عدد الأعضاء يتراوح بين 10-25 عضو.', order: 3 },
      { categoryId: gangRules.id, title: 'التصوير', content: 'تصوير المواجهات إلزامي للتوثيق.', order: 4 },
    ],
  });

  // Justice Rules
  await prisma.rule.createMany({
    data: [
      { categoryId: justiceRules.id, title: 'الرتب', content: 'الرتب: قاضي – مدعي عام – محامي.', order: 1 },
      { categoryId: justiceRules.id, title: 'السلاح في المحكمة', content: 'يمنع دخول المحكمة بالسلاح.', order: 2 },
      { categoryId: justiceRules.id, title: 'حصانة القاضي', content: 'القاضي يتمتع بحصانة قضائية.', order: 3 },
      { categoryId: justiceRules.id, title: 'خطف القاضي', content: 'خطف القاضي جريمة كبرى تستوجب العقوبة القصوى.', order: 4 },
    ],
  });

  console.log('✅ Rules created');

  // Create questions
  await prisma.question.createMany({
    data: [
      // Roleplay Basics Questions
      {
        categoryId: roleplayBasics.id,
        content: 'ما هو قانون NLR؟',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        options: ['قانون يمنع التحدث أو التحرك عند فقدان الوعي', 'قانون يسمح بالقتل العشوائي', 'قانون يمنع استخدام المركبات', 'قانون يسمح باستخدام معلومات خارج اللعبة'],
        correctAnswer: 'قانون يمنع التحدث أو التحرك عند فقدان الوعي',
      },
      {
        categoryId: roleplayBasics.id,
        content: 'هل يُسمح باستخدام معلومات من البث المباشر داخل اللعبة؟',
        type: QuestionType.TRUE_FALSE,
        difficulty: Difficulty.EASY,
        options: ['نعم', 'لا'],
        correctAnswer: 'لا',
      },
      {
        categoryId: roleplayBasics.id,
        content: 'ما المقصود بـ PowerGaming؟',
        type: QuestionType.SHORT_ANSWER,
        difficulty: Difficulty.MEDIUM,
        correctAnswer: 'استخدام أساليب غير واقعية للحصول على أفضلية',
      },
      {
        categoryId: roleplayBasics.id,
        content: 'اشرح ما المقصود بقانون NVL وأعطِ مثالاً.',
        type: QuestionType.SHORT_ANSWER,
        difficulty: Difficulty.HARD,
        correctAnswer: 'عدم تقدير الحياة عند التهديد',
      },
      {
        categoryId: roleplayBasics.id,
        content: 'ما هو RDM؟',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        options: ['القتل بدون سبب رول بلاي واضح', 'استخدام معلومات خارج اللعبة', 'القيادة المتهورة', 'استخدام الثغرات'],
        correctAnswer: 'القتل بدون سبب رول بلاي واضح',
      },
      // General Rules Questions
      {
        categoryId: generalRules.id,
        content: 'ما هو الحد الأدنى للعمر المطلوب للعب على الخادم؟',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        options: ['16 سنة', '18 سنة', '21 سنة', 'لا يوجد حد عمري'],
        correctAnswer: '18 سنة',
      },
      {
        categoryId: generalRules.id,
        content: 'كم عدد الشخصيات المسموح بها لكل لاعب؟',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        options: ['شخصية واحدة', 'شخصيتان', 'ثلاث شخصيات', 'بلا حدود'],
        correctAnswer: 'شخصية واحدة',
      },
      {
        categoryId: generalRules.id,
        content: 'هل يُسمح بمشاركة الحسابات مع الآخرين؟',
        type: QuestionType.TRUE_FALSE,
        difficulty: Difficulty.EASY,
        options: ['نعم', 'لا'],
        correctAnswer: 'لا',
      },
      // Police Rules Questions
      {
        categoryId: policeRules.id,
        content: 'هل يُسمح للشرطة بالمداهمة بدون أمر قضائي؟',
        type: QuestionType.TRUE_FALSE,
        difficulty: Difficulty.MEDIUM,
        options: ['نعم', 'لا'],
        correctAnswer: 'لا',
      },
      // Gang Rules Questions
      {
        categoryId: gangRules.id,
        content: 'ما هو الحد الأقصى لعدد أعضاء العصابة؟',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.MEDIUM,
        options: ['10 أعضاء', '15 عضو', '25 عضو', '50 عضو'],
        correctAnswer: '25 عضو',
      },
      // Warning System Questions
      {
        categoryId: warningSystem.id,
        content: 'ماذا يحدث عند التحذير الرابع؟',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.MEDIUM,
        options: ['إنذار شفهي', 'حظر 24 ساعة', 'حظر 7 أيام', 'حظر دائم'],
        correctAnswer: 'حظر دائم',
      },
      // EMS Rules Questions
      {
        categoryId: emsRules.id,
        content: 'هل يُسمح لأفراد الإسعاف بحمل السلاح أثناء الخدمة؟',
        type: QuestionType.TRUE_FALSE,
        difficulty: Difficulty.EASY,
        options: ['نعم', 'لا'],
        correctAnswer: 'لا',
      },
    ],
  });

  console.log('✅ Questions created');

  // Create default settings
  await prisma.setting.createMany({
    data: [
      { key: 'questions_per_exam', value: { count: 5 } },
      { key: 'allow_retry_after_fail', value: { enabled: false, delay_hours: 24 } },
      { key: 'send_dm_notifications', value: { enabled: true } },
      { key: 'auto_reject_high_integrity', value: { enabled: false, threshold: 5 } },
    ],
  });

  console.log('✅ Settings created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
