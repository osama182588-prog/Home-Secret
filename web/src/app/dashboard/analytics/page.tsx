export default function AnalyticsPage() {
  // Sample analytics data
  const stats = {
    daily: [
      { date: '2024-01-15', submitted: 25, passed: 18, failed: 7 },
      { date: '2024-01-14', submitted: 32, passed: 24, failed: 8 },
      { date: '2024-01-13', submitted: 28, passed: 20, failed: 8 },
      { date: '2024-01-12', submitted: 35, passed: 28, failed: 7 },
      { date: '2024-01-11', submitted: 22, passed: 16, failed: 6 },
      { date: '2024-01-10', submitted: 30, passed: 22, failed: 8 },
      { date: '2024-01-09', submitted: 27, passed: 21, failed: 6 },
    ],
    mostFailedQuestions: [
      { question: 'ما المقصود بـ PowerGaming؟', failRate: 45 },
      { question: 'اشرح قانون NVL', failRate: 38 },
      { question: 'ما هي عقوبة التحذير الثالث؟', failRate: 32 },
    ],
    adminPerformance: [
      { admin: 'Admin1', reviewed: 85, passRate: 72 },
      { admin: 'Admin2', reviewed: 62, passRate: 68 },
      { admin: 'Admin3', reviewed: 45, passRate: 75 },
    ],
    integrityStats: {
      totalViolations: 23,
      tabSwitches: 15,
      copyPaste: 8,
    },
  };

  const totalSubmitted = stats.daily.reduce((sum, d) => sum + d.submitted, 0);
  const totalPassed = stats.daily.reduce((sum, d) => sum + d.passed, 0);
  const totalFailed = stats.daily.reduce((sum, d) => sum + d.failed, 0);
  const passRate = Math.round((totalPassed / totalSubmitted) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">📊 الإحصائيات</h1>
        <p className="text-[var(--foreground-muted)] mt-2">
          تحليلات ومقاييس أداء نظام التحقق
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-3xl font-bold text-[var(--primary)]">{totalSubmitted}</div>
          <div className="text-[var(--foreground-muted)]">طلبات هذا الأسبوع</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-[var(--success)]">{totalPassed}</div>
          <div className="text-[var(--foreground-muted)]">تم القبول</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-[var(--error)]">{totalFailed}</div>
          <div className="text-[var(--foreground-muted)]">تم الرفض</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-[var(--primary)]">{passRate}%</div>
          <div className="text-[var(--foreground-muted)]">نسبة القبول</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Verifications */}
        <div className="card">
          <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">
            📈 التحقق اليومي
          </h2>
          <div className="space-y-3">
            {stats.daily.map((day) => {
              const total = day.submitted;
              const passPercent = (day.passed / total) * 100;
              return (
                <div key={day.date}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{new Date(day.date).toLocaleDateString('ar-SA')}</span>
                    <span>{day.submitted} طلب</span>
                  </div>
                  <div className="h-4 bg-[var(--background)] rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-[var(--success)]"
                      style={{ width: `${passPercent}%` }}
                    />
                    <div
                      className="h-full bg-[var(--error)]"
                      style={{ width: `${100 - passPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
              <span>مقبول</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--error)]" />
              <span>مرفوض</span>
            </div>
          </div>
        </div>

        {/* Most Failed Questions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">
            ❓ أكثر الأسئلة فشلاً
          </h2>
          <div className="space-y-4">
            {stats.mostFailedQuestions.map((q, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="truncate flex-1">{q.question}</span>
                  <span className="text-[var(--error)] mr-2">{q.failRate}%</span>
                </div>
                <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--error)]"
                    style={{ width: `${q.failRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Performance */}
        <div className="card">
          <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">
            👤 أداء الإداريين
          </h2>
          <div className="space-y-4">
            {stats.adminPerformance.map((admin, index) => (
              <div key={index} className="bg-[var(--background)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                      👤
                    </div>
                    <span className="font-semibold">{admin.admin}</span>
                  </div>
                  <span className="badge badge-info">{admin.passRate}% قبول</span>
                </div>
                <div className="text-sm text-[var(--foreground-muted)]">
                  راجع {admin.reviewed} طلب
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrity Stats */}
        <div className="card">
          <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">
            🛡️ إحصائيات النزاهة
          </h2>
          <div className="space-y-4">
            <div className="bg-[var(--warning)]/10 border border-[var(--warning)] rounded-lg p-4">
              <div className="text-2xl font-bold text-[var(--warning)]">
                {stats.integrityStats.totalViolations}
              </div>
              <div className="text-[var(--warning)]">إجمالي المخالفات</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--background)] rounded-lg p-4 text-center">
                <div className="text-xl font-bold">{stats.integrityStats.tabSwitches}</div>
                <div className="text-sm text-[var(--foreground-muted)]">تبديل تبويب</div>
              </div>
              <div className="bg-[var(--background)] rounded-lg p-4 text-center">
                <div className="text-xl font-bold">{stats.integrityStats.copyPaste}</div>
                <div className="text-sm text-[var(--foreground-muted)]">نسخ/لصق</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="card">
        <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">
          📤 تصدير البيانات
        </h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn btn-secondary">
            📊 تصدير إحصائيات CSV
          </button>
          <button className="btn btn-secondary">
            📋 تصدير سجل التحقق
          </button>
          <button className="btn btn-secondary">
            📝 تقرير الأداء
          </button>
        </div>
      </div>
    </div>
  );
}
