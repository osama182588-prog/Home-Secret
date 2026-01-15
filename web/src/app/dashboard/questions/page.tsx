'use client';

import { useState } from 'react';

type QuestionType = 'SHORT_ANSWER';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface Question {
  id: string;
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  category: string;
  enabled: boolean;
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    content: 'ما هو قانون NLR؟',
    type: 'SHORT_ANSWER',
    difficulty: 'EASY',
    category: 'الرول بلاي الأساسية',
    enabled: true,
  },
  {
    id: '2',
    content: 'اشرح ما المقصود بـ MetaGaming',
    type: 'SHORT_ANSWER',
    difficulty: 'EASY',
    category: 'الرول بلاي الأساسية',
    enabled: true,
  },
  {
    id: '3',
    content: 'اشرح ما المقصود بـ PowerGaming',
    type: 'SHORT_ANSWER',
    difficulty: 'MEDIUM',
    category: 'الرول بلاي الأساسية',
    enabled: true,
  },
];

const categories = [
  'الرول بلاي الأساسية',
  'القوانين العامة',
  'قوانين الشرطة',
  'قوانين الإسعاف',
  'قوانين العصابات',
  'نظام التحذيرات',
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [filter, setFilter] = useState<{ difficulty?: Difficulty; category?: string }>({});
  const [formData, setFormData] = useState<Partial<Question>>({
    content: '',
    type: 'SHORT_ANSWER',
    difficulty: 'MEDIUM',
    category: '',
    enabled: true,
  });

  const filteredQuestions = questions.filter(q => {
    if (filter.difficulty && q.difficulty !== filter.difficulty) return false;
    if (filter.category && q.category !== filter.category) return false;
    return true;
  });

  const handleAddQuestion = () => {
    if (!formData.content || !formData.category) return;
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      content: formData.content!,
      type: 'SHORT_ANSWER',
      difficulty: formData.difficulty!,
      category: formData.category!,
      enabled: formData.enabled!,
    };
    
    setQuestions(prev => [...prev, newQuestion]);
    setFormData({
      content: '',
      type: 'SHORT_ANSWER',
      difficulty: 'MEDIUM',
      category: '',
      enabled: true,
    });
    setShowAddQuestion(false);
  };

  const toggleEnabled = (id: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, enabled: !q.enabled } : q
    ));
  };

  const deleteQuestion = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'EASY': return <span className="badge badge-success">سهل</span>;
      case 'MEDIUM': return <span className="badge badge-warning">متوسط</span>;
      case 'HARD': return <span className="badge badge-error">صعب</span>;
    }
  };

  const getTypeBadge = () => {
    return <span className="badge badge-info">إجابة كتابية</span>;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">❓ بنك الأسئلة</h1>
          <p className="text-[var(--foreground-muted)] mt-2">
            إدارة أسئلة اختبار التحقق
          </p>
        </div>
        <button
          onClick={() => setShowAddQuestion(true)}
          className="btn btn-primary"
        >
          + إضافة سؤال
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--primary)]">{questions.length}</div>
          <div className="text-sm text-[var(--foreground-muted)]">إجمالي الأسئلة</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--success)]">{questions.filter(q => q.enabled).length}</div>
          <div className="text-sm text-[var(--foreground-muted)]">أسئلة مفعلة</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--warning)]">{questions.filter(q => q.difficulty === 'MEDIUM').length}</div>
          <div className="text-sm text-[var(--foreground-muted)]">متوسطة الصعوبة</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--error)]">{questions.filter(q => q.difficulty === 'HARD').length}</div>
          <div className="text-sm text-[var(--foreground-muted)]">صعبة</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <h3 className="font-semibold mb-4">🔍 تصفية</h3>
        <div className="flex flex-wrap gap-4">
          <select
            value={filter.difficulty || ''}
            onChange={(e) => setFilter(prev => ({ ...prev, difficulty: e.target.value as Difficulty || undefined }))}
            className="input w-auto"
          >
            <option value="">كل المستويات</option>
            <option value="EASY">سهل</option>
            <option value="MEDIUM">متوسط</option>
            <option value="HARD">صعب</option>
          </select>
          
          <select
            value={filter.category || ''}
            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value || undefined }))}
            className="input w-auto"
          >
            <option value="">كل الفئات</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          {(filter.difficulty || filter.category) && (
            <button
              onClick={() => setFilter({})}
              className="btn btn-secondary text-sm"
            >
              مسح الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div
            key={question.id}
            className={`card ${!question.enabled && 'opacity-60'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeBadge()}
                  {getDifficultyBadge(question.difficulty)}
                  <span className="text-sm text-[var(--foreground-muted)]">{question.category}</span>
                </div>
                <h3 className="font-semibold text-lg mb-3">{question.content}</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleEnabled(question.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    question.enabled
                      ? 'bg-[var(--success)]/20 text-[var(--success)]'
                      : 'bg-[var(--foreground-muted)]/20 text-[var(--foreground-muted)]'
                  }`}
                  title={question.enabled ? 'تعطيل' : 'تفعيل'}
                >
                  {question.enabled ? '✓' : '○'}
                </button>
                <button
                  onClick={() => deleteQuestion(question.id)}
                  className="p-2 rounded-lg bg-[var(--error)]/20 text-[var(--error)]"
                  title="حذف"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="card text-center py-12 text-[var(--foreground-muted)]">
            لا توجد أسئلة
          </div>
        )}
      </div>

      {/* Add Question Modal */}
      {showAddQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--background-card)] rounded-xl max-w-lg w-full max-h-[90vh] overflow-auto p-6">
            <h2 className="text-xl font-bold gradient-text mb-6">إضافة سؤال جديد</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">الصعوبة</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as Difficulty }))}
                  className="input"
                >
                  <option value="EASY">سهل</option>
                  <option value="MEDIUM">متوسط</option>
                  <option value="HARD">صعب</option>
                </select>
              </div>
              
              <div>
                <label className="block font-semibold mb-2">الفئة</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="input"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block font-semibold mb-2">السؤال</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="input min-h-[100px] resize-none"
                  placeholder="اكتب السؤال هنا..."
                />
              </div>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="w-4 h-4 accent-[var(--primary)]"
                />
                <span>مفعل</span>
              </label>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button onClick={() => setShowAddQuestion(false)} className="btn btn-secondary flex-1">
                إلغاء
              </button>
              <button onClick={handleAddQuestion} className="btn btn-primary flex-1">
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
