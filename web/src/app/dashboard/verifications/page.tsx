'use client';

import { useState } from 'react';

// Sample data (in production, this comes from database)
const sampleVerifications = [
  {
    id: '1',
    user: { name: 'أحمد محمد', discordId: '123456789', avatar: null },
    status: 'PENDING',
    submittedAt: '2024-01-15T10:30:00',
    integrityFlags: { copyPasteCount: 0, tabSwitchCount: 1 },
    answers: [
      { question: 'ما هو قانون NLR؟', answer: 'قانون يمنع التحدث أو التحرك عند فقدان الوعي' },
      { question: 'هل يُسمح باستخدام معلومات من البث المباشر؟', answer: 'لا' },
    ],
  },
  {
    id: '2',
    user: { name: 'سارة علي', discordId: '987654321', avatar: null },
    status: 'PENDING',
    submittedAt: '2024-01-15T11:15:00',
    integrityFlags: { copyPasteCount: 2, tabSwitchCount: 3 },
    answers: [
      { question: 'ما هو قانون NVL؟', answer: 'عدم تقدير الحياة' },
      { question: 'كم عمر اللعب المطلوب؟', answer: '18 سنة' },
    ],
  },
];

type StatusFilter = 'ALL' | 'PENDING' | 'PASSED' | 'FAILED';

export default function VerificationsPage() {
  const [filter, setFilter] = useState<StatusFilter>('PENDING');
  const [selectedVerification, setSelectedVerification] = useState<typeof sampleVerifications[0] | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');

  const filteredVerifications = filter === 'ALL' 
    ? sampleVerifications 
    : sampleVerifications.filter(v => v.status === filter);

  const handleDecision = (id: string, decision: 'PASSED' | 'FAILED') => {
    // In production, this would call the API
    console.log('Decision:', { id, decision, notes: decisionNotes });
    setSelectedVerification(null);
    setDecisionNotes('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">✅ طلبات التحقق</h1>
        <p className="text-[var(--foreground-muted)] mt-2">
          مراجعة وإدارة طلبات التحقق من اللاعبين
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          {[
            { value: 'ALL', label: 'الكل' },
            { value: 'PENDING', label: 'معلق' },
            { value: 'PASSED', label: 'مقبول' },
            { value: 'FAILED', label: 'مرفوض' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as StatusFilter)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === option.value
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--background)] hover:bg-[var(--background-card)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verifications List */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>المستخدم</th>
              <th>Discord ID</th>
              <th>تاريخ الإرسال</th>
              <th>الحالة</th>
              <th>التحذيرات</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredVerifications.map((verification) => (
              <tr key={verification.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                      👤
                    </div>
                    <span>{verification.user.name}</span>
                  </div>
                </td>
                <td className="ltr text-left font-mono text-sm">{verification.user.discordId}</td>
                <td>{new Date(verification.submittedAt).toLocaleDateString('ar-SA')}</td>
                <td>
                  <span className={`badge ${
                    verification.status === 'PENDING' ? 'badge-warning' :
                    verification.status === 'PASSED' ? 'badge-success' : 'badge-error'
                  }`}>
                    {verification.status === 'PENDING' ? 'معلق' :
                     verification.status === 'PASSED' ? 'مقبول' : 'مرفوض'}
                  </span>
                </td>
                <td>
                  {(verification.integrityFlags.copyPasteCount > 0 || verification.integrityFlags.tabSwitchCount > 0) ? (
                    <span className="badge badge-warning">
                      ⚠️ {verification.integrityFlags.copyPasteCount + verification.integrityFlags.tabSwitchCount}
                    </span>
                  ) : (
                    <span className="text-[var(--foreground-muted)]">-</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => setSelectedVerification(verification)}
                    className="btn btn-primary text-sm py-2"
                  >
                    مراجعة
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredVerifications.length === 0 && (
          <div className="text-center py-12 text-[var(--foreground-muted)]">
            لا توجد طلبات
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--background-card)] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold gradient-text">مراجعة الطلب</h2>
              <button
                onClick={() => setSelectedVerification(null)}
                className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            {/* User Info */}
            <div className="bg-[var(--background)] rounded-lg p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedVerification.user.name}</h3>
                  <p className="text-sm text-[var(--foreground-muted)] ltr">
                    Discord: {selectedVerification.user.discordId}
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    تاريخ الإرسال: {new Date(selectedVerification.submittedAt).toLocaleString('ar-SA')}
                  </p>
                </div>
              </div>
            </div>

            {/* Integrity Warnings */}
            {(selectedVerification.integrityFlags.copyPasteCount > 0 || 
              selectedVerification.integrityFlags.tabSwitchCount > 0) && (
              <div className="bg-[var(--warning)]/10 border border-[var(--warning)] rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-[var(--warning)] mb-2">⚠️ تحذيرات النزاهة</h4>
                <ul className="text-sm text-[var(--warning)] space-y-1">
                  {selectedVerification.integrityFlags.tabSwitchCount > 0 && (
                    <li>• تبديل التبويب: {selectedVerification.integrityFlags.tabSwitchCount} مرات</li>
                  )}
                  {selectedVerification.integrityFlags.copyPasteCount > 0 && (
                    <li>• نسخ/لصق: {selectedVerification.integrityFlags.copyPasteCount} مرات</li>
                  )}
                </ul>
              </div>
            )}

            {/* Answers */}
            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-[var(--primary)]">📝 الإجابات</h4>
              {selectedVerification.answers.map((answer, index) => (
                <div key={index} className="bg-[var(--background)] rounded-lg p-4">
                  <p className="font-medium mb-2">س{index + 1}: {answer.question}</p>
                  <p className="text-[var(--foreground-muted)] border-r-2 border-[var(--primary)] pr-3">
                    {answer.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Decision Notes */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">ملاحظات (اختياري)</label>
              <textarea
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder="أضف ملاحظات حول قرارك..."
                className="input min-h-[100px] resize-none"
              />
            </div>

            {/* Decision Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => handleDecision(selectedVerification.id, 'PASSED')}
                className="btn btn-success flex-1"
              >
                ✅ قبول
              </button>
              <button
                onClick={() => handleDecision(selectedVerification.id, 'FAILED')}
                className="btn btn-danger flex-1"
              >
                ❌ رفض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
