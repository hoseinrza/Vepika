import React, { useState } from 'react';
import {
  MessageSquare,
  Check,
  X,
  Trash2,
  CornerDownLeft,
  Search,
  Send,
  Shield,
  Clock,
  ExternalLink,
  ThumbsUp,
} from 'lucide-react';
import { Article, Comment, CommentStatus } from '../../types';
import { formatPersianDate, toPersianDigits } from '../../utils/seoAnalyzer';

interface AdminCommentsListProps {
  comments: Comment[];
  articles: Article[];
  onUpdateStatus: (commentId: string, status: CommentStatus) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onReplyComment: (commentId: string, replyText: string) => Promise<void>;
  onViewArticle: (article: Article) => void;
}

export const AdminCommentsList: React.FC<AdminCommentsListProps> = ({
  comments,
  articles,
  onUpdateStatus,
  onDeleteComment,
  onReplyComment,
  onViewArticle,
}) => {
  const [statusFilter, setStatusFilter] = useState<CommentStatus | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const pendingCount = comments.filter((c) => c.status === 'pending').length;
  const approvedCount = comments.filter((c) => c.status === 'approved').length;
  const rejectedCount = comments.filter((c) => c.status === 'rejected').length;

  const filteredComments = comments.filter((c) => {
    const matchesStatus = statusFilter === 'all' ? true : c.status === statusFilter;
    const matchesSearch =
      c.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.authorEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const runOrAlert = async (action: () => Promise<void>, failureMessage: string) => {
    try {
      await action();
    } catch (err: any) {
      alert(err?.message || failureMessage);
    }
  };

  const handleSendReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    try {
      await onReplyComment(commentId, replyText.trim());
      setReplyText('');
      setReplyingCommentId(null);
    } catch (err: any) {
      alert(err?.message || 'ارسال پاسخ ناموفق بود.');
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="font-lalezar text-2xl text-stone-900 leading-tight">
            مدیریت و تایید دیدگاه‌های کاربران ({toPersianDigits(comments.length)})
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            بررسی نظرات، پاسخ‌دهی مستقیم با نشان مدیر و محافظت در برابر هرزنامه‌ها
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="px-3.5 py-1.5 bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>{toPersianDigits(pendingCount)} دیدگاه جدید نیازمند بازبینی است</span>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو در متن نظر یا نام کاربر..."
            className="w-full pl-3 pr-9 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            در انتظار تایید ({toPersianDigits(pendingCount)})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'approved'
                ? 'bg-white text-emerald-800 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            تایید شده ({toPersianDigits(approvedCount)})
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'rejected'
                ? 'bg-white text-red-800 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            رد شده ({toPersianDigits(rejectedCount)})
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-stone-900 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            همه
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400 space-y-2">
            <MessageSquare className="w-10 h-10 mx-auto text-stone-300 stroke-1" />
            <p className="text-sm">دیدگاهی در این بخش یافت نشد.</p>
          </div>
        ) : (
          filteredComments.map((comment) => {
            const article = articles.find((a) => a.id === comment.postId);
            const isReplying = replyingCommentId === comment.id;

            return (
              <div
                key={comment.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3.5 transition-all"
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={comment.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                      alt={comment.authorName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">
                          {comment.authorName}
                        </span>
                        {comment.authorEmail && (
                          <span className="text-xs text-stone-400 font-mono dir-ltr">
                            ({comment.authorEmail})
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        ثبت‌شده در: {formatPersianDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        comment.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : comment.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {comment.status === 'approved'
                        ? 'منتشر شده'
                        : comment.status === 'pending'
                        ? 'در انتظار تایید'
                        : 'رد شده'}
                    </span>
                  </div>
                </div>

                {/* Article link */}
                {article && (
                  <div className="text-xs text-stone-500 flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg w-fit">
                    <span>در رابطه با مقاله:</span>
                    <button
                      onClick={() => onViewArticle(article)}
                      className="font-bold text-stone-800 hover:text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{article.title}</span>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </button>
                  </div>
                )}

                {/* Comment Body */}
                <p className="text-sm text-stone-800 leading-relaxed text-justify bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                  {comment.content}
                </p>

                {/* Replies list if any */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="space-y-2 mr-4 border-r-2 border-amber-400 pr-3 pt-1">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 text-xs space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5 text-amber-600" />
                          <span className="font-bold text-stone-900">{reply.authorName}</span>
                          <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-1.5 py-0.5 rounded">
                            {reply.authorRole || 'مدیر'}
                          </span>
                          <span className="text-[10px] text-stone-400 mr-auto">
                            {formatPersianDate(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-stone-700 pr-5">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Moderation Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-1.5">
                    {/* Approve button */}
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => runOrAlert(() => onUpdateStatus(comment.id, 'approved'), 'تایید دیدگاه ناموفق بود.')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>تایید و انتشار</span>
                      </button>
                    )}

                    {/* Reject button */}
                    {comment.status !== 'rejected' && (
                      <button
                        onClick={() => runOrAlert(() => onUpdateStatus(comment.id, 'rejected'), 'رد دیدگاه ناموفق بود.')}
                        className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>رد دیدگاه</span>
                      </button>
                    )}

                    {/* Reply button */}
                    <button
                      onClick={() => setReplyingCommentId(isReplying ? null : comment.id)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-200"
                    >
                      <CornerDownLeft className="w-3.5 h-3.5 text-amber-700" />
                      <span>{isReplying ? 'بستن پاسخ' : 'پاسخ به عنوان مدیر'}</span>
                    </button>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => runOrAlert(() => onDeleteComment(comment.id), 'حذف دیدگاه ناموفق بود.')}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="حذف دیدگاه"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Inline Reply Form */}
                {isReplying && (
                  <div className="mt-3 p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-3 animate-in fade-in">
                    <label className="block text-xs font-bold text-stone-800">
                      پاسخ رسمی تحریریه به دیدگاه {comment.authorName}:
                    </label>
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="متن پاسخ خود را بنویسید..."
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs focus:border-amber-500 focus:outline-hidden"
                    ></textarea>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setReplyingCommentId(null)}
                        className="px-3 py-1.5 bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        انصراف
                      </button>
                      <button
                        onClick={() => handleSendReply(comment.id)}
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>ارسال پاسخ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
