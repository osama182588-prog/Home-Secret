'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

type Step = 'intro' | 'rules' | 'exam' | 'submitted' | 'loading';

interface Question {
  id: string;
  content: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  category?: { name: string } | null;
}

interface APIQuestion {
  id: string;
  content: string;
  type: string;
  options?: unknown;
  category?: { name: string } | null;
}

interface Answer {
  questionId: string;
  answer: string;
}

interface IntegrityFlags {
  copyPasteCount: number;
  tabSwitchCount: number;
  startTime: number;
}

// Type guard for string array
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

export default function VerifyContent() {
  const { data: session, status } = useSession();
  const [step, setStep] = useState<Step>('intro');
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [integrityFlags, setIntegrityFlags] = useState<IntegrityFlags>({
    copyPasteCount: 0,
    tabSwitchCount: 0,
    startTime: 0,
  });

  // Fetch questions from API and start exam
  const startExam = useCallback(async () => {
    setIsLoadingQuestions(true);
    setLoadError(null);
    
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 5 }),
      });
      
      if (!response.ok) {
        throw new Error('فشل في تحميل الأسئلة');
      }
      
      const data: APIQuestion[] = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error('لا توجد أسئلة متاحة حالياً');
      }
      
      // Transform the data to match our expected format
      const transformedQuestions: Question[] = data.map((q: APIQuestion) => ({
        id: q.id,
        content: q.content,
        type: q.type as 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER',
        options: q.type === 'TRUE_FALSE' 
          ? ['نعم', 'لا'] 
          : (isStringArray(q.options) ? q.options : undefined),
        category: q.category,
      }));
      
      setQuestions(transformedQuestions);
      setCurrentQuestion(0);
      setAnswers([]);
      setCurrentAnswer('');
      setIntegrityFlags({
        copyPasteCount: 0,
        tabSwitchCount: 0,
        startTime: Date.now(),
      });
      setStep('exam');
    } catch (error) {
      console.error('Error loading questions:', error);
      setLoadError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    } finally {
      setIsLoadingQuestions(false);
    }
  }, []);

  // Track tab visibility changes
  useEffect(() => {
    if (step !== 'exam') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIntegrityFlags(prev => ({
          ...prev,
          tabSwitchCount: prev.tabSwitchCount + 1,
        }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [step]);

  // Track copy/paste
  useEffect(() => {
    if (step !== 'exam') return;

    const handleCopyPaste = () => {
      setIntegrityFlags(prev => ({
        ...prev,
        copyPasteCount: prev.copyPasteCount + 1,
      }));
    };

    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('copy', handleCopyPaste);
    return () => {
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('copy', handleCopyPaste);
    };
  }, [step]);

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) return;

    const newAnswers = [...answers, { questionId: questions[currentQuestion].id, answer: currentAnswer }];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Submit all answers
      handleFinalSubmit(newAnswers);
    }
  };

  const handleFinalSubmit = async (finalAnswers: Answer[]) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: finalAnswers,
          integrityFlags,
          questions: questions.map(q => ({ id: q.id, content: q.content })),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit verification');
      }
      
      setStep('submitted');
    } catch (error) {
      console.error('Error submitting verification:', error);
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner w-12 h-12" />
      </div>
    );
  }

  // Not logged in
  if (!session) {
    return (
      <div className="card text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
          <svg className="w-12 h-12 text-[var(--primary)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">تسجيل الدخول مطلوب</h2>
        <p className="text-[var(--foreground-muted)] mb-6">
          يرجى تسجيل الدخول باستخدام Discord للمتابعة
        </p>
        <button
          onClick={() => signIn('discord')}
          className="btn btn-primary mx-auto"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z"/>
          </svg>
          تسجيل بواسطة Discord
        </button>
      </div>
    );
  }

  // Step: Intro
  if (step === 'intro') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 gradient-text">
            ✅ التحقق من العضوية
          </h1>
          <p className="text-[var(--foreground-muted)]">
            مرحباً {session.user?.name}! اتبع الخطوات التالية لإتمام التحقق
          </p>
        </div>

        {/* User Info */}
        <div className="card flex items-center gap-4">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={64}
              height={64}
              className="rounded-full border-2 border-[var(--primary)]"
            />
          )}
          <div>
            <h3 className="font-semibold">{session.user?.name}</h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              Discord ID: {session.user?.discordId || 'غير متوفر'}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">
            خطوات التحقق:
          </h3>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center flex-shrink-0">
                1
              </span>
              <div>
                <span className="font-semibold">قراءة القوانين</span>
                <p className="text-sm text-[var(--foreground-muted)]">
                  راجع جميع قوانين الخادم
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center flex-shrink-0">
                2
              </span>
              <div>
                <span className="font-semibold">اختبار من 5 أسئلة</span>
                <p className="text-sm text-[var(--foreground-muted)]">
                  أجب على أسئلة عشوائية حول القوانين
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center flex-shrink-0">
                3
              </span>
              <div>
                <span className="font-semibold">انتظار المراجعة</span>
                <p className="text-sm text-[var(--foreground-muted)]">
                  سيراجع الإداريون إجاباتك
                </p>
              </div>
            </li>
          </ol>
        </div>

        <button onClick={() => setStep('rules')} className="btn btn-primary w-full">
          البدء ➜
        </button>
      </div>
    );
  }

  // Step: Rules Agreement
  if (step === 'rules') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 gradient-text">
            📜 ملخص القوانين
          </h2>
          <p className="text-[var(--foreground-muted)]">
            يجب الموافقة على القوانين قبل بدء الاختبار
          </p>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4 text-[var(--primary)]">القوانين الأساسية:</h3>
          <ul className="space-y-3 text-[var(--foreground-muted)]">
            <li>• NLR - نظام الحياة الجديدة</li>
            <li>• PowerGaming - استخدام أساليب غير واقعية</li>
            <li>• NVL - عدم تقدير الحياة</li>
            <li>• MetaGaming - استخدام معلومات خارج اللعبة</li>
            <li>• RDM - القتل العشوائي</li>
            <li>• العمر 18+ مطلوب</li>
          </ul>
          
          <Link
            href="/rules"
            target="_blank"
            className="inline-block mt-4 text-[var(--primary)] hover:underline"
          >
            قراءة القوانين الكاملة ←
          </Link>
        </div>

        <div className="card border-2 border-[var(--primary)]">
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToRules}
              onChange={(e) => setAgreedToRules(e.target.checked)}
              className="w-5 h-5 mt-1 accent-[var(--primary)]"
            />
            <div>
              <span className="font-semibold block">
                أوافق على جميع قوانين الخادم
              </span>
              <span className="text-sm text-[var(--foreground-muted)]">
                أفهم أن انتهاك القوانين قد يؤدي إلى الحظر
              </span>
            </div>
          </label>
        </div>

        {loadError && (
          <div className="bg-[var(--error)]/10 border border-[var(--error)] rounded-lg p-4">
            <p className="text-[var(--error)]">{loadError}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={() => setStep('intro')} className="btn btn-secondary flex-1">
            ← السابق
          </button>
          <button
            onClick={startExam}
            disabled={!agreedToRules || isLoadingQuestions}
            className={`btn flex-1 ${agreedToRules && !isLoadingQuestions ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'}`}
          >
            {isLoadingQuestions ? (
              <span className="flex items-center gap-2">
                <span className="spinner" />
                جاري التحميل...
              </span>
            ) : (
              'بدء الاختبار ➜'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Step: Exam
  if (step === 'exam') {
    const question = questions[currentQuestion];

    return (
      <div className="space-y-8">
        {/* Progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[var(--foreground-muted)]">
              السؤال {currentQuestion + 1} من {questions.length}
            </span>
            <span className="badge badge-info">
              {question?.category?.name || 'عام'}
            </span>
          </div>
          <div className="w-full h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Integrity Warning */}
        {(integrityFlags.tabSwitchCount > 0 || integrityFlags.copyPasteCount > 0) && (
          <div className="bg-[var(--warning)]/10 border border-[var(--warning)] rounded-lg p-4">
            <p className="text-[var(--warning)] text-sm">
              ⚠️ تم رصد نشاط مشبوه ({integrityFlags.tabSwitchCount} تبديل تبويب، {integrityFlags.copyPasteCount} نسخ/لصق)
            </p>
          </div>
        )}

        {/* Question */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-6">
            {question?.content}
          </h3>

          {question?.type === 'MULTIPLE_CHOICE' && (
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    currentAnswer === option
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                      : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={currentAnswer === option}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    className="w-4 h-4 accent-[var(--primary)]"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {question?.type === 'TRUE_FALSE' && (
            <div className="flex gap-4">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAnswer(option)}
                  className={`flex-1 p-4 rounded-lg border font-semibold transition-colors ${
                    currentAnswer === option
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {question?.type === 'SHORT_ANSWER' && (
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="اكتب إجابتك هنا..."
              className="input min-h-[150px] resize-none"
            />
          )}
        </div>

        <button
          onClick={handleAnswerSubmit}
          disabled={!currentAnswer.trim() || isSubmitting}
          className={`btn btn-primary w-full ${
            (!currentAnswer.trim() || isSubmitting) && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="spinner" />
              جاري الإرسال...
            </span>
          ) : currentQuestion < questions.length - 1 ? (
            'السؤال التالي ➜'
          ) : (
            'إرسال الإجابات ✓'
          )}
        </button>
      </div>
    );
  }

  // Step: Submitted
  if (step === 'submitted') {
    return (
      <div className="card text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--success)]/20 flex items-center justify-center">
          <svg className="w-12 h-12 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 gradient-text">
          تم إرسال طلب التحقق!
        </h2>
        <p className="text-[var(--foreground-muted)] mb-6">
          سيتم مراجعة إجاباتك من قبل الإداريين وستتلقى إشعاراً على Discord
        </p>
        
        {(integrityFlags.tabSwitchCount > 0 || integrityFlags.copyPasteCount > 0) && (
          <div className="bg-[var(--warning)]/10 border border-[var(--warning)] rounded-lg p-4 mb-6 text-right">
            <p className="text-[var(--warning)] text-sm font-semibold mb-2">
              ⚠️ تنبيه
            </p>
            <p className="text-[var(--warning)] text-sm">
              تم تسجيل بعض السلوكيات المشبوهة أثناء الاختبار وسيتم مراجعتها مع طلبك.
            </p>
          </div>
        )}

        <Link href="/" className="btn btn-primary">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return null;
}
