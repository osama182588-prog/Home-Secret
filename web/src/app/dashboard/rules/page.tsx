'use client';

import { useState } from 'react';

// Sample rules data
const sampleCategories = [
  {
    id: '1',
    name: '🧠 قوانين الرول بلاي الأساسية',
    slug: 'roleplay-basics',
    enabled: true,
    order: 1,
    rules: [
      { id: '1-1', title: 'NLR – نظام الحياة الجديدة', content: 'عند فقدان الوعي يمنع التحدث أو التحرك حتى الإنعاش.', enabled: true },
      { id: '1-2', title: 'PowerGaming', content: 'استخدام أساليب غير واقعية للحصول على أفضلية.', enabled: true },
      { id: '1-3', title: 'NVL', content: 'عدم تقدير الحياة عند التهديد يعتبر مخالفة.', enabled: true },
    ],
  },
  {
    id: '2',
    name: '📌 القوانين العامة',
    slug: 'general-rules',
    enabled: true,
    order: 2,
    rules: [
      { id: '2-1', title: 'العمر', content: 'العمر 18+.', enabled: true },
      { id: '2-2', title: 'الشخصيات', content: 'شخصية واحدة فقط لكل لاعب.', enabled: true },
    ],
  },
];

interface RuleFormData {
  title: string;
  content: string;
  categoryId: string;
  enabled: boolean;
}

export default function RulesManagementPage() {
  const [categories, setCategories] = useState(sampleCategories);
  const [showAddRule, setShowAddRule] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [, setEditingRule] = useState<{ categoryId: string; rule: typeof sampleCategories[0]['rules'][0] } | null>(null);
  const [formData, setFormData] = useState<RuleFormData>({
    title: '',
    content: '',
    categoryId: '',
    enabled: true,
  });
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddRule = () => {
    if (!formData.title || !formData.content || !formData.categoryId) return;
    
    setCategories(prev => prev.map(cat => {
      if (cat.id === formData.categoryId) {
        return {
          ...cat,
          rules: [...cat.rules, {
            id: Date.now().toString(),
            title: formData.title,
            content: formData.content,
            enabled: formData.enabled,
          }],
        };
      }
      return cat;
    }));
    
    setFormData({ title: '', content: '', categoryId: '', enabled: true });
    setShowAddRule(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    
    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      slug: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      enabled: true,
      order: categories.length + 1,
      rules: [],
    };
    
    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const toggleRuleEnabled = (categoryId: string, ruleId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          rules: cat.rules.map(rule => 
            rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
          ),
        };
      }
      return cat;
    }));
  };

  const deleteRule = (categoryId: string, ruleId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القانون؟')) return;
    
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          rules: cat.rules.filter(rule => rule.id !== ruleId),
        };
      }
      return cat;
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">📜 إدارة القوانين</h1>
          <p className="text-[var(--foreground-muted)] mt-2">
            إضافة وتعديل وحذف قوانين الخادم
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddCategory(true)}
            className="btn btn-secondary"
          >
            + إضافة فئة
          </button>
          <button
            onClick={() => setShowAddRule(true)}
            className="btn btn-primary"
          >
            + إضافة قانون
          </button>
        </div>
      </div>

      {/* Categories and Rules */}
      {categories.map((category) => (
        <div key={category.id} className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--primary)]">
              {category.name}
            </h2>
            <div className="flex items-center gap-2">
              <span className={`badge ${category.enabled ? 'badge-success' : 'badge-warning'}`}>
                {category.enabled ? 'مفعل' : 'معطل'}
              </span>
              <span className="text-sm text-[var(--foreground-muted)]">
                {category.rules.length} قانون
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {category.rules.map((rule) => (
              <div
                key={rule.id}
                className={`bg-[var(--background)] rounded-lg p-4 border-r-4 ${
                  rule.enabled ? 'border-[var(--primary)]' : 'border-[var(--foreground-muted)] opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{rule.title}</h3>
                    <p className="text-sm text-[var(--foreground-muted)] whitespace-pre-line">
                      {rule.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mr-4">
                    <button
                      onClick={() => toggleRuleEnabled(category.id, rule.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        rule.enabled
                          ? 'bg-[var(--success)]/20 text-[var(--success)]'
                          : 'bg-[var(--foreground-muted)]/20 text-[var(--foreground-muted)]'
                      }`}
                      title={rule.enabled ? 'تعطيل' : 'تفعيل'}
                    >
                      {rule.enabled ? '✓' : '○'}
                    </button>
                    <button
                      onClick={() => setEditingRule({ categoryId: category.id, rule })}
                      className="p-2 rounded-lg bg-[var(--primary)]/20 text-[var(--primary)]"
                      title="تعديل"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteRule(category.id, rule.id)}
                      className="p-2 rounded-lg bg-[var(--error)]/20 text-[var(--error)]"
                      title="حذف"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {category.rules.length === 0 && (
              <p className="text-center text-[var(--foreground-muted)] py-4">
                لا توجد قوانين في هذه الفئة
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Add Rule Modal */}
      {showAddRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--background-card)] rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold gradient-text mb-6">إضافة قانون جديد</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">الفئة</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="input"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block font-semibold mb-2">العنوان</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="input"
                  placeholder="عنوان القانون"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2">المحتوى</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="input min-h-[150px] resize-none"
                  placeholder="محتوى القانون..."
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
              <button onClick={() => setShowAddRule(false)} className="btn btn-secondary flex-1">
                إلغاء
              </button>
              <button onClick={handleAddRule} className="btn btn-primary flex-1">
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--background-card)] rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold gradient-text mb-6">إضافة فئة جديدة</h2>
            
            <div>
              <label className="block font-semibold mb-2">اسم الفئة</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="input"
                placeholder="مثال: 📌 القوانين العامة"
              />
            </div>
            
            <div className="flex gap-4 mt-6">
              <button onClick={() => setShowAddCategory(false)} className="btn btn-secondary flex-1">
                إلغاء
              </button>
              <button onClick={handleAddCategory} className="btn btn-primary flex-1">
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
