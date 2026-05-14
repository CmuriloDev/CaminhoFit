'use client';

import { useState } from 'react';
import { Loader2, Send, Trash2 } from 'lucide-react';
import StarRating from './StarRating';
import type { Review } from '@/types';

interface ReviewFormProps {
  existingReview: Review | null;
  submitting: boolean;
  onSubmit: (stars: number, comment: string) => Promise<string | null | undefined>;
  onDelete: () => Promise<void>;
}

export default function ReviewForm({
  existingReview,
  submitting,
  onSubmit,
  onDelete,
}: ReviewFormProps) {
  const [stars, setStars] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? '');
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async () => {
    if (stars === 0) {
      setError('Selecione uma avaliação.');
      return;
    }
    setError(null);
    const err = await onSubmit(stars, comment);
    if (err) setError(err);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete();
    setDeleting(false);
    setStars(0);
    setComment('');
  };

  return (
    <div className="bg-zinc-50 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-800">
          {existingReview ? 'Sua avaliação' : 'Avaliar este local'}
        </p>
        {existingReview && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            {deleting
              ? <Loader2 size={11} className="animate-spin" />
              : <Trash2 size={11} />
            }
            Remover
          </button>
        )}
      </div>

      <StarRating value={stars} onChange={setStars} size={24} />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Conte como foi treinar aqui... (opcional)"
        rows={3}
        className="
          w-full px-3 py-2.5 bg-white border border-zinc-200
          rounded-xl text-sm text-zinc-800 placeholder:text-zinc-400
          focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
          resize-none transition-all
        "
      />

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting || stars === 0}
        className="
          w-full flex items-center justify-center gap-2
          py-2.5 bg-green-500 hover:bg-green-600
          disabled:opacity-50 disabled:cursor-not-allowed
          text-white rounded-xl font-semibold text-sm
          transition-all active:scale-95
        "
      >
        {submitting
          ? <Loader2 size={14} className="animate-spin" />
          : <Send size={14} />
        }
        {existingReview ? 'Atualizar avaliação' : 'Enviar avaliação'}
      </button>
    </div>
  );
}