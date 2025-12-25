export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">لوحة التحكم</h1>
        <p className="text-[var(--foreground-muted)] mt-2">
          مرحباً بك في لوحة تحكم Secret CFW
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'طلبات معلقة', value: '12', icon: '⏳', color: 'warning' },
          { label: 'تم القبول اليوم', value: '8', icon: '✅', color: 'success' },
          { label: 'تم الرفض اليوم', value: '3', icon: '❌', color: 'error' },
          { label: 'إجمالي المتحققين', value: '1,234', icon: '👥', color: 'info' },
        ].map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--foreground-muted)] text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 rounded-xl bg-[var(--${stat.color})]/20 flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Verifications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--primary)]">
              ⏳ طلبات معلقة
            </h2>
            <a href="/dashboard/verifications" className="text-sm text-[var(--primary)] hover:underline">
              عرض الكل
            </a>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[var(--background)] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                    👤
                  </div>
                  <div>
                    <p className="font-semibold">مستخدم #{i}</p>
                    <p className="text-sm text-[var(--foreground-muted)]">منذ {i * 5} دقائق</p>
                  </div>
                </div>
                <button className="btn btn-primary text-sm py-2">
                  مراجعة
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--primary)]">
              📋 آخر القرارات
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { user: 'أحمد محمد', status: 'passed', admin: 'Admin1', time: '10 دقائق' },
              { user: 'سارة علي', status: 'failed', admin: 'Admin2', time: '25 دقيقة' },
              { user: 'محمد خالد', status: 'passed', admin: 'Admin1', time: '1 ساعة' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-[var(--background)] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.status === 'passed' 
                      ? 'bg-[var(--success)]/20 text-[var(--success)]'
                      : 'bg-[var(--error)]/20 text-[var(--error)]'
                  }`}>
                    {item.status === 'passed' ? '✓' : '✗'}
                  </div>
                  <div>
                    <p className="font-semibold">{item.user}</p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      بواسطة {item.admin} • منذ {item.time}
                    </p>
                  </div>
                </div>
                <span className={`badge ${item.status === 'passed' ? 'badge-success' : 'badge-error'}`}>
                  {item.status === 'passed' ? 'قبول' : 'رفض'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">
          ⚡ إجراءات سريعة
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'إضافة قانون', href: '/dashboard/rules', icon: '📝' },
            { label: 'إضافة سؤال', href: '/dashboard/questions', icon: '❓' },
            { label: 'إضافة للقائمة السوداء', href: '/dashboard/blacklist', icon: '🚫' },
            { label: 'عرض الإحصائيات', href: '/dashboard/analytics', icon: '📊' },
          ].map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="p-4 bg-[var(--background)] rounded-lg text-center hover:bg-[var(--background-card)] transition-colors"
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <span className="text-sm">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
