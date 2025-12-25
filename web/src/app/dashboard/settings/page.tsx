'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [discordSettings, setDiscordSettings] = useState({
    guildId: '',
    verifiedRoleId: '',
    unverifiedRoleId: '',
    adminChannelId: '',
    logChannelId: '',
    reviewerRoleIds: '',
  });

  const [generalSettings, setGeneralSettings] = useState({
    questionsPerExam: 5,
    allowRetryAfterFail: false,
    retryDelayHours: 24,
    sendDMNotifications: true,
    autoRejectOnHighIntegrity: false,
    integrityThreshold: 5,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // In production, this would call the API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('تم حفظ الإعدادات بنجاح');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">⚙️ الإعدادات</h1>
        <p className="text-[var(--foreground-muted)] mt-2">
          إعدادات النظام والتكامل مع Discord
        </p>
      </div>

      {/* Discord Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold text-[var(--primary)] mb-6">
          🔗 إعدادات Discord
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Guild ID</label>
            <input
              type="text"
              value={discordSettings.guildId}
              onChange={(e) => setDiscordSettings(prev => ({ ...prev, guildId: e.target.value }))}
              className="input ltr text-left"
              placeholder="123456789012345678"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Verified Role ID</label>
            <input
              type="text"
              value={discordSettings.verifiedRoleId}
              onChange={(e) => setDiscordSettings(prev => ({ ...prev, verifiedRoleId: e.target.value }))}
              className="input ltr text-left"
              placeholder="ID الرتبة للمتحققين"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Unverified Role ID</label>
            <input
              type="text"
              value={discordSettings.unverifiedRoleId}
              onChange={(e) => setDiscordSettings(prev => ({ ...prev, unverifiedRoleId: e.target.value }))}
              className="input ltr text-left"
              placeholder="ID الرتبة لغير المتحققين"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Admin Channel ID</label>
            <input
              type="text"
              value={discordSettings.adminChannelId}
              onChange={(e) => setDiscordSettings(prev => ({ ...prev, adminChannelId: e.target.value }))}
              className="input ltr text-left"
              placeholder="قناة مراجعة الطلبات"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Log Channel ID</label>
            <input
              type="text"
              value={discordSettings.logChannelId}
              onChange={(e) => setDiscordSettings(prev => ({ ...prev, logChannelId: e.target.value }))}
              className="input ltr text-left"
              placeholder="قناة السجلات"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Reviewer Role IDs</label>
            <input
              type="text"
              value={discordSettings.reviewerRoleIds}
              onChange={(e) => setDiscordSettings(prev => ({ ...prev, reviewerRoleIds: e.target.value }))}
              className="input ltr text-left"
              placeholder="IDs الرتب للمراجعين (مفصولة بفاصلة)"
            />
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold text-[var(--primary)] mb-6">
          ⚡ الإعدادات العامة
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-semibold">عدد الأسئلة في الاختبار</label>
              <p className="text-sm text-[var(--foreground-muted)]">عدد الأسئلة العشوائية في كل اختبار</p>
            </div>
            <input
              type="number"
              min={1}
              max={20}
              value={generalSettings.questionsPerExam}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, questionsPerExam: parseInt(e.target.value) }))}
              className="input w-20 text-center"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-semibold">السماح بإعادة المحاولة</label>
              <p className="text-sm text-[var(--foreground-muted)]">السماح بإعادة التقديم بعد الرفض</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={generalSettings.allowRetryAfterFail}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, allowRetryAfterFail: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--background)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
            </label>
          </div>
          
          {generalSettings.allowRetryAfterFail && (
            <div className="flex items-center justify-between mr-6">
              <div>
                <label className="font-semibold">فترة الانتظار (ساعات)</label>
                <p className="text-sm text-[var(--foreground-muted)]">المدة قبل السماح بإعادة التقديم</p>
              </div>
              <input
                type="number"
                min={1}
                max={168}
                value={generalSettings.retryDelayHours}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, retryDelayHours: parseInt(e.target.value) }))}
                className="input w-20 text-center"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-semibold">إرسال إشعارات DM</label>
              <p className="text-sm text-[var(--foreground-muted)]">إرسال رسائل خاصة للمستخدمين</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={generalSettings.sendDMNotifications}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, sendDMNotifications: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--background)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-semibold">رفض تلقائي للمخالفات العالية</label>
              <p className="text-sm text-[var(--foreground-muted)]">رفض الطلبات ذات المخالفات الكثيرة تلقائياً</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={generalSettings.autoRejectOnHighIntegrity}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, autoRejectOnHighIntegrity: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--background)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
            </label>
          </div>
          
          {generalSettings.autoRejectOnHighIntegrity && (
            <div className="flex items-center justify-between mr-6">
              <div>
                <label className="font-semibold">حد المخالفات</label>
                <p className="text-sm text-[var(--foreground-muted)]">عدد المخالفات للرفض التلقائي</p>
              </div>
              <input
                type="number"
                min={1}
                max={20}
                value={generalSettings.integrityThreshold}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, integrityThreshold: parseInt(e.target.value) }))}
                className="input w-20 text-center"
              />
            </div>
          )}
        </div>
      </div>

      {/* Backup & Recovery */}
      <div className="card">
        <h2 className="text-xl font-semibold text-[var(--primary)] mb-6">
          💾 النسخ الاحتياطي والاستعادة
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="btn btn-secondary">
            📥 إنشاء نسخة احتياطية
          </button>
          <button className="btn btn-secondary">
            📤 استعادة من نسخة
          </button>
        </div>
        
        <div className="mt-6 bg-[var(--background)] rounded-lg p-4">
          <h3 className="font-semibold mb-2">آخر نسخة احتياطية</h3>
          <p className="text-sm text-[var(--foreground-muted)]">
            2024-01-15 10:30:00 • 2.5 MB
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-2 border-[var(--error)]">
        <h2 className="text-xl font-semibold text-[var(--error)] mb-6">
          ⚠️ منطقة الخطر
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">مسح جميع بيانات التحقق</p>
              <p className="text-sm text-[var(--foreground-muted)]">حذف جميع سجلات التحقق نهائياً</p>
            </div>
            <button className="btn btn-danger">
              مسح البيانات
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">إعادة تعيين الإعدادات</p>
              <p className="text-sm text-[var(--foreground-muted)]">استعادة الإعدادات الافتراضية</p>
            </div>
            <button className="btn btn-danger">
              إعادة تعيين
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary px-8"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <span className="spinner" />
              جاري الحفظ...
            </span>
          ) : (
            '💾 حفظ الإعدادات'
          )}
        </button>
      </div>
    </div>
  );
}
