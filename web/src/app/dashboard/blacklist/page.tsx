'use client';

import { useState } from 'react';

interface BlacklistEntry {
  id: string;
  discordId: string;
  username: string;
  reason: string;
  isPermanent: boolean;
  expiresAt?: string;
  createdAt: string;
  createdBy: string;
}

const sampleBlacklist: BlacklistEntry[] = [
  {
    id: '1',
    discordId: '123456789012345678',
    username: 'user1',
    reason: 'انتهاك متكرر للقوانين',
    isPermanent: true,
    createdAt: '2024-01-10T10:00:00',
    createdBy: 'Admin1',
  },
  {
    id: '2',
    discordId: '987654321098765432',
    username: 'user2',
    reason: 'استخدام برامج غير مسموحة',
    isPermanent: false,
    expiresAt: '2024-02-10T10:00:00',
    createdAt: '2024-01-15T14:30:00',
    createdBy: 'Admin2',
  },
];

export default function BlacklistPage() {
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>(sampleBlacklist);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    discordId: '',
    username: '',
    reason: '',
    isPermanent: true,
    expiresAt: '',
  });

  const filteredBlacklist = blacklist.filter(entry =>
    entry.discordId.includes(searchTerm) ||
    entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEntry = () => {
    if (!formData.discordId || !formData.reason) return;
    
    const newEntry: BlacklistEntry = {
      id: Date.now().toString(),
      discordId: formData.discordId,
      username: formData.username || 'غير معروف',
      reason: formData.reason,
      isPermanent: formData.isPermanent,
      expiresAt: formData.isPermanent ? undefined : formData.expiresAt,
      createdAt: new Date().toISOString(),
      createdBy: 'Current Admin',
    };
    
    setBlacklist(prev => [...prev, newEntry]);
    setFormData({ discordId: '', username: '', reason: '', isPermanent: true, expiresAt: '' });
    setShowAddEntry(false);
  };

  const removeEntry = (id: string) => {
    if (!confirm('هل أنت متأكد من إزالة هذا الحظر؟')) return;
    setBlacklist(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">🚫 القائمة السوداء</h1>
          <p className="text-[var(--foreground-muted)] mt-2">
            إدارة المستخدمين المحظورين
          </p>
        </div>
        <button
          onClick={() => setShowAddEntry(true)}
          className="btn btn-primary"
        >
          + إضافة حظر
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--error)]">{blacklist.length}</div>
          <div className="text-sm text-[var(--foreground-muted)]">إجمالي المحظورين</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--warning)]">
            {blacklist.filter(e => e.isPermanent).length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">حظر دائم</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--primary)]">
            {blacklist.filter(e => !e.isPermanent).length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">حظر مؤقت</div>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <input
          type="text"
          placeholder="🔍 البحث بـ Discord ID أو الاسم أو السبب..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />
      </div>

      {/* Blacklist Table */}
      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>المستخدم</th>
              <th>Discord ID</th>
              <th>السبب</th>
              <th>النوع</th>
              <th>تاريخ الإنشاء</th>
              <th>بواسطة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlacklist.map((entry) => (
              <tr key={entry.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--error)]/20 flex items-center justify-center text-[var(--error)]">
                      🚫
                    </div>
                    <span>{entry.username}</span>
                  </div>
                </td>
                <td className="ltr text-left font-mono text-sm">{entry.discordId}</td>
                <td className="max-w-xs truncate">{entry.reason}</td>
                <td>
                  {entry.isPermanent ? (
                    <span className="badge badge-error">دائم</span>
                  ) : (
                    <span className="badge badge-warning">
                      مؤقت حتى {new Date(entry.expiresAt!).toLocaleDateString('ar-SA')}
                    </span>
                  )}
                </td>
                <td>{new Date(entry.createdAt).toLocaleDateString('ar-SA')}</td>
                <td>{entry.createdBy}</td>
                <td>
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="btn btn-secondary text-sm py-2"
                  >
                    إزالة الحظر
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBlacklist.length === 0 && (
          <div className="text-center py-12 text-[var(--foreground-muted)]">
            لا توجد نتائج
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--background-card)] rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold gradient-text mb-6">إضافة حظر جديد</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Discord ID</label>
                <input
                  type="text"
                  value={formData.discordId}
                  onChange={(e) => setFormData(prev => ({ ...prev, discordId: e.target.value }))}
                  className="input ltr text-left"
                  placeholder="123456789012345678"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2">اسم المستخدم (اختياري)</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="input"
                  placeholder="اسم المستخدم"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2">سبب الحظر</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  className="input min-h-[100px] resize-none"
                  placeholder="سبب الحظر..."
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPermanent}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPermanent: e.target.checked }))}
                    className="w-4 h-4 accent-[var(--primary)]"
                  />
                  <span>حظر دائم</span>
                </label>
              </div>
              
              {!formData.isPermanent && (
                <div>
                  <label className="block font-semibold mb-2">تاريخ انتهاء الحظر</label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                    className="input ltr"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-4 mt-6">
              <button onClick={() => setShowAddEntry(false)} className="btn btn-secondary flex-1">
                إلغاء
              </button>
              <button onClick={handleAddEntry} className="btn btn-danger flex-1">
                إضافة الحظر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
