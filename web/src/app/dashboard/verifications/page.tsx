'use client';

import { useState, useEffect, useCallback } from 'react';

interface VerificationAnswer {
  question: {
    content: string;
    type: string;
  };
  answer: string;
}

interface Verification {
  id: string;
  user: {
    username: string;
    discordId: string;
    avatar: string | null;
  };
  status: 'PENDING' | 'IN_REVIEW' | 'PASSED' | 'FAILED' | 'BLOCKED';
  createdAt: string;
  copyPasteCount: number;
  tabSwitchCount: number;
  answers: VerificationAnswer[];
  decidedBy?: {
    username: string;
  } | null;
}

type StatusFilter = 'ALL' | 'PENDING' | 'PASSED' | 'FAILED';

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('PENDING');
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVerifications = useCallback(async () => {
    try {
      // Validate filter against allowed values to prevent injection
      const validFilters: StatusFilter[] = ['ALL', 'PENDING', 'PASSED', 'FAILED'];
      const safeFilter = validFilters.includes(filter) ? filter : 'PENDING';
      const params = new URLSearchParams({ status: safeFilter });
      
      const response = await fetch(`/api/admin/verification?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setVerifications(data.attempts || []);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const handleDecision = async (id: string, decision: 'PASSED' | 'FAILED') => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/verification', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: id,
          decision,
          notes: decisionNotes,
        }),
      });

      if (response.ok) {
        // Refresh the list
        await fetchVerifications();
        setSelectedVerification(null);
        setDecisionNotes('');
      } else {
        const error = await response.json();
        alert(error.error || 'حدث خطأ أثناء معالجة القرار');
      }
    } catch (error) {
      console.error('Error submitting decision:', error);
      alert('حدث خطأ أثناء معالجة القرار');
    } finally {
      setIsSubmitting(false);
    }
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner w-8 h-8" />
          </div>
        ) : (
          <>
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
                {verifications.map((verification) => (
                  <tr key={verification.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                          👤
                        </div>
                        <span>{verification.user.username}</span>
                      </div>
                    </td>
                    <td className="ltr text-left font-mono text-sm">{verification.user.discordId}</td>
                    <td>{new Date(verification.createdAt).toLocaleDateString('ar-SA')}</td>
                    <td>
                      <span className={`badge ${
                        verification.status === 'PENDING' || verification.status === 'IN_REVIEW' ? 'badge-warning' :
                        verification.status === 'PASSED' ? 'badge-success' : 'badge-error'
                      }`}>
                        {verification.status === 'PENDING' ? 'معلق' :
                         verification.status === 'IN_REVIEW' ? 'قيد المراجعة' :
                         verification.status === 'PASSED' ? 'مقبول' : 'مرفوض'}
                      </span>
                    </td>
                    <td>
                      {(verification.copyPasteCount > 0 || verification.tabSwitchCount > 0) ? (
                        <span className="badge badge-warning">
                          ⚠️ {verification.copyPasteCount + verification.tabSwitchCount}
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

            {verifications.length === 0 && (
              <div className="text-center py-12 text-[var(--foreground-muted)]">
                لا توجد طلبات
              </div>
            )}
          </>
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
                  <h3 className="font-semibold text-lg">{selectedVerification.user.username}</h3>
                  <p className="text-sm text-[var(--foreground-muted)] ltr">
                    Discord: {selectedVerification.user.discordId}
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    تاريخ الإرسال: {new Date(selectedVerification.createdAt).toLocaleString('ar-SA')}
                  </p>
                </div>
              </div>
            </div>

            {/* Integrity Warnings */}
            {(selectedVerification.copyPasteCount > 0 || 
              selectedVerification.tabSwitchCount > 0) && (
              <div className="bg-[var(--warning)]/10 border border-[var(--warning)] rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-[var(--warning)] mb-2">⚠️ تحذيرات النزاهة</h4>
                <ul className="text-sm text-[var(--warning)] space-y-1">
                  {selectedVerification.tabSwitchCount > 0 && (
                    <li>• تبديل التبويب: {selectedVerification.tabSwitchCount} مرات</li>
                  )}
                  {selectedVerification.copyPasteCount > 0 && (
                    <li>• نسخ/لصق: {selectedVerification.copyPasteCount} مرات</li>
                  )}
                </ul>
              </div>
            )}

            {/* Answers */}
            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-[var(--primary)]">📝 الإجابات</h4>
              {selectedVerification.answers.map((answer, index) => (
                <div key={index} className="bg-[var(--background)] rounded-lg p-4">
                  <p className="font-medium mb-2">س{index + 1}: {answer.question.content}</p>
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
                disabled={isSubmitting}
                className="btn btn-success flex-1"
              >
                {isSubmitting ? <span className="spinner" /> : '✅ قبول'}
              </button>
              <button
                onClick={() => handleDecision(selectedVerification.id, 'FAILED')}
                disabled={isSubmitting}
                className="btn btn-danger flex-1"
              >
                {isSubmitting ? <span className="spinner" /> : '❌ رفض'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
