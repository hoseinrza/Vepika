import React, { useState } from 'react';
import {
  Code,
  ListChecks,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { ToolkitChecklistItem, ToolkitSnippet, ToolkitSnippetCategory, ToolkitTargetFile } from '../../types';
import { toPersianDigits } from '../../utils/seoAnalyzer';

interface AdminToolkitProps {
  snippets: ToolkitSnippet[];
  checklistItems: ToolkitChecklistItem[];
  onSaveSnippet: (snippet: ToolkitSnippet) => Promise<void>;
  onDeleteSnippet: (id: string) => Promise<void>;
  onSaveChecklistItem: (item: ToolkitChecklistItem) => Promise<void>;
  onDeleteChecklistItem: (id: string) => Promise<void>;
}

const SNIPPET_CATEGORY_LABELS: Record<ToolkitSnippetCategory, string> = {
  security: 'امنیت',
  speed: 'سرعت',
  admin: 'پیشخوان',
  woocommerce: 'ووکامرس',
};

const TARGET_FILE_OPTIONS: ToolkitTargetFile[] = ['functions.php', '.htaccess', 'wp-config.php'];
const SNIPPET_CATEGORY_OPTIONS: ToolkitSnippetCategory[] = ['security', 'speed', 'admin', 'woocommerce'];

export const AdminToolkit: React.FC<AdminToolkitProps> = ({
  snippets,
  checklistItems,
  onSaveSnippet,
  onDeleteSnippet,
  onSaveChecklistItem,
  onDeleteChecklistItem,
}) => {
  const [activeTab, setActiveTab] = useState<'snippets' | 'checklist'>('snippets');

  // --- Snippet form state ---
  const [editingSnippetId, setEditingSnippetId] = useState<string | null>(null);
  const [isCreatingSnippet, setIsCreatingSnippet] = useState(false);
  const [isSavingSnippet, setIsSavingSnippet] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetCategory, setSnippetCategory] = useState<ToolkitSnippetCategory>('security');
  const [snippetTargetFile, setSnippetTargetFile] = useState<ToolkitTargetFile>('functions.php');
  const [snippetDescription, setSnippetDescription] = useState('');
  const [snippetCode, setSnippetCode] = useState('');
  const [snippetExplanation, setSnippetExplanation] = useState('');

  // --- Checklist form state ---
  const [editingChecklistId, setEditingChecklistId] = useState<string | null>(null);
  const [isCreatingChecklist, setIsCreatingChecklist] = useState(false);
  const [isSavingChecklist, setIsSavingChecklist] = useState(false);
  const [checklistCategory, setChecklistCategory] = useState('');
  const [checklistTitle, setChecklistTitle] = useState('');
  const [checklistDescription, setChecklistDescription] = useState('');

  const startCreateSnippet = () => {
    setSnippetTitle('');
    setSnippetCategory('security');
    setSnippetTargetFile('functions.php');
    setSnippetDescription('');
    setSnippetCode('');
    setSnippetExplanation('');
    setIsCreatingSnippet(true);
    setEditingSnippetId(null);
  };

  const startEditSnippet = (snippet: ToolkitSnippet) => {
    setSnippetTitle(snippet.title);
    setSnippetCategory(snippet.category);
    setSnippetTargetFile(snippet.targetFile);
    setSnippetDescription(snippet.description);
    setSnippetCode(snippet.code);
    setSnippetExplanation(snippet.explanation);
    setEditingSnippetId(snippet.id);
    setIsCreatingSnippet(false);
  };

  const closeSnippetForm = () => {
    setIsCreatingSnippet(false);
    setEditingSnippetId(null);
  };

  const handleSaveSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snippetTitle.trim() || !snippetCode.trim()) return;

    const existing = editingSnippetId ? snippets.find((s) => s.id === editingSnippetId) : undefined;
    const snippetToSave: ToolkitSnippet = {
      id: isCreatingSnippet ? `snip-${Date.now()}` : editingSnippetId!,
      title: snippetTitle.trim(),
      category: snippetCategory,
      targetFile: snippetTargetFile,
      description: snippetDescription.trim(),
      code: snippetCode,
      explanation: snippetExplanation.trim(),
      sortOrder: existing?.sortOrder ?? snippets.length,
    };

    setIsSavingSnippet(true);
    try {
      await onSaveSnippet(snippetToSave);
      closeSnippetForm();
    } catch (err: any) {
      alert(err?.message || 'ذخیره اسنیپت ناموفق بود.');
    } finally {
      setIsSavingSnippet(false);
    }
  };

  const startCreateChecklist = () => {
    setChecklistCategory('');
    setChecklistTitle('');
    setChecklistDescription('');
    setIsCreatingChecklist(true);
    setEditingChecklistId(null);
  };

  const startEditChecklist = (item: ToolkitChecklistItem) => {
    setChecklistCategory(item.category);
    setChecklistTitle(item.title);
    setChecklistDescription(item.description);
    setEditingChecklistId(item.id);
    setIsCreatingChecklist(false);
  };

  const closeChecklistForm = () => {
    setIsCreatingChecklist(false);
    setEditingChecklistId(null);
  };

  const handleSaveChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checklistTitle.trim()) return;

    const existing = editingChecklistId ? checklistItems.find((c) => c.id === editingChecklistId) : undefined;
    const itemToSave: ToolkitChecklistItem = {
      id: isCreatingChecklist ? `chk-${Date.now()}` : editingChecklistId!,
      category: checklistCategory.trim() || 'عمومی',
      title: checklistTitle.trim(),
      description: checklistDescription.trim(),
      sortOrder: existing?.sortOrder ?? checklistItems.length,
    };

    setIsSavingChecklist(true);
    try {
      await onSaveChecklistItem(itemToSave);
      closeChecklistForm();
    } catch (err: any) {
      alert(err?.message || 'ذخیره گام چک‌لیست ناموفق بود.');
    } finally {
      setIsSavingChecklist(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <h2 className="font-lalezar text-2xl text-stone-900 leading-tight">جعبه ابزار و اسنیپت‌های وردپرس</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          مدیریت اسنیپت‌های کد و چک‌لیست راه‌اندازی سایت که در صفحه عمومی «جعبه ابزار» نمایش داده می‌شوند.
        </p>
      </div>

      {/* Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
        <button
          onClick={() => setActiveTab('snippets')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'snippets'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>اسنیپت‌های کد ({toPersianDigits(snippets.length)})</span>
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'checklist'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>چک‌لیست راه‌اندازی ({toPersianDigits(checklistItems.length)})</span>
        </button>
      </div>

      {/* SNIPPETS TAB */}
      {activeTab === 'snippets' && (
        <div className="space-y-4">
          {!isCreatingSnippet && !editingSnippetId && (
            <button
              onClick={startCreateSnippet}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-lalezar text-base flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>افزودن اسنیپت جدید</span>
            </button>
          )}

          {(isCreatingSnippet || editingSnippetId) && (
            <form
              onSubmit={handleSaveSnippet}
              className="bg-white p-6 rounded-2xl border-2 border-amber-400 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-lalezar text-xl text-stone-900 flex items-center gap-2">
                  <Code className="w-5 h-5 text-amber-600" />
                  <span>{isCreatingSnippet ? 'ایجاد اسنیپت جدید' : 'ویرایش اسنیپت'}</span>
                </h3>
                <button
                  type="button"
                  onClick={closeSnippetForm}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  عنوان اسنیپت <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={snippetTitle}
                  onChange={(e) => setSnippetTitle(e.target.value)}
                  placeholder="مثال: پنهان‌سازی شماره نسخه وردپرس"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">دسته‌بندی</label>
                  <select
                    value={snippetCategory}
                    onChange={(e) => setSnippetCategory(e.target.value as ToolkitSnippetCategory)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden cursor-pointer"
                  >
                    {SNIPPET_CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {SNIPPET_CATEGORY_LABELS[cat]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">محل قرارگیری فایل</label>
                  <select
                    value={snippetTargetFile}
                    onChange={(e) => setSnippetTargetFile(e.target.value as ToolkitTargetFile)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden cursor-pointer dir-ltr text-left"
                  >
                    {TARGET_FILE_OPTIONS.map((file) => (
                      <option key={file} value={file}>
                        {file}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">توضیح کوتاه</label>
                <textarea
                  rows={2}
                  value={snippetDescription}
                  onChange={(e) => setSnippetDescription(e.target.value)}
                  placeholder="این اسنیپت چه مشکلی را حل می‌کند..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  کد اسنیپت <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={snippetCode}
                  onChange={(e) => setSnippetCode(e.target.value)}
                  placeholder="// کد PHP یا Apache اینجا..."
                  className="w-full px-3.5 py-2.5 bg-stone-950 text-stone-100 border border-stone-700 rounded-xl text-xs font-mono focus:border-amber-500 focus:outline-hidden dir-ltr text-left"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">راهنمای نصب</label>
                <textarea
                  rows={2}
                  value={snippetExplanation}
                  onChange={(e) => setSnippetExplanation(e.target.value)}
                  placeholder="این کد را کجا و چگونه قرار دهد..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeSnippetForm}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSavingSnippet}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-stone-950 rounded-xl font-lalezar text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSavingSnippet ? 'در حال ذخیره...' : 'ذخیره اسنیپت'}</span>
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 gap-4">
            {snippets.map((snippet) => (
              <div
                key={snippet.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:border-amber-300 transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md dir-ltr">
                      {snippet.targetFile}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {SNIPPET_CATEGORY_LABELS[snippet.category]}
                    </span>
                  </div>
                  <h3 className="font-lalezar text-lg text-stone-900">{snippet.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2">{snippet.description || 'بدون توضیحات'}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEditSnippet(snippet)}
                    className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    title="ویرایش"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`آیا از حذف اسنیپت «${snippet.title}» مطمئن هستید؟`)) {
                        try {
                          await onDeleteSnippet(snippet.id);
                        } catch (err: any) {
                          alert(err?.message || 'حذف اسنیپت ناموفق بود.');
                        }
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {snippets.length === 0 && (
              <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                هنوز هیچ اسنیپتی ثبت نشده است.
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKLIST TAB */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          {!isCreatingChecklist && !editingChecklistId && (
            <button
              onClick={startCreateChecklist}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-lalezar text-base flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>افزودن گام چک‌لیست</span>
            </button>
          )}

          {(isCreatingChecklist || editingChecklistId) && (
            <form
              onSubmit={handleSaveChecklist}
              className="bg-white p-6 rounded-2xl border-2 border-amber-400 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-lalezar text-xl text-stone-900 flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-amber-600" />
                  <span>{isCreatingChecklist ? 'ایجاد گام جدید' : 'ویرایش گام چک‌لیست'}</span>
                </h3>
                <button
                  type="button"
                  onClick={closeChecklistForm}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">دسته‌بندی</label>
                  <input
                    type="text"
                    value={checklistCategory}
                    onChange={(e) => setChecklistCategory(e.target.value)}
                    placeholder="مثال: سئو و پیکربندی"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  عنوان گام <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={checklistTitle}
                  onChange={(e) => setChecklistTitle(e.target.value)}
                  placeholder="مثال: تنظیم ساختار پیوندهای یکتا"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">توضیحات</label>
                <textarea
                  rows={2}
                  value={checklistDescription}
                  onChange={(e) => setChecklistDescription(e.target.value)}
                  placeholder="توضیح تکمیلی این گام..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeChecklistForm}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSavingChecklist}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-stone-950 rounded-xl font-lalezar text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSavingChecklist ? 'در حال ذخیره...' : 'ذخیره گام'}</span>
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between gap-3 hover:border-amber-300 transition-colors"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 inline-block">
                    {item.category}
                  </span>
                  <h3 className="font-lalezar text-lg text-stone-900">{item.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2">{item.description || 'بدون توضیحات'}</p>
                </div>

                <div className="flex items-center justify-end gap-1 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => startEditChecklist(item)}
                    className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    title="ویرایش"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`آیا از حذف گام «${item.title}» مطمئن هستید؟`)) {
                        try {
                          await onDeleteChecklistItem(item.id);
                        } catch (err: any) {
                          alert(err?.message || 'حذف گام ناموفق بود.');
                        }
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {checklistItems.length === 0 && (
              <div className="sm:col-span-2 bg-white p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                هنوز هیچ گامی در چک‌لیست ثبت نشده است.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
