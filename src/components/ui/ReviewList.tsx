import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StarRating from './StarRating';
import type { Review } from '@/types';

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-zinc-400 text-center py-4">
        Nenhuma avaliação ainda. Seja o primeiro!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="bg-zinc-50 rounded-2xl p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700">
                {(review.profiles?.username ?? 'U')[0].toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-zinc-800">
                {review.profiles?.username ?? 'Usuário'}
              </span>
            </div>
            <span className="text-xs text-zinc-400 shrink-0">
              {formatDistanceToNow(new Date(review.created_at), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </div>

          <StarRating value={review.rating} readonly size={14} />

          {review.comment && (
            <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}