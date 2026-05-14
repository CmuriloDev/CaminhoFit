'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getReviewsByLocation,
  getRatingByLocation,
  upsertReview,
  deleteReview,
  getUserReview,
} from '@/services/reviews';
import type { Review, LocationRating } from '@/types';

export function useReviews(locationId: string, userId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<LocationRating | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

 const fetchAll = useCallback(async () => {
  if (!locationId) {
    setReviews([]);
    setRating(null);
    setUserReview(null);
    setLoading(false);
    return;
  }

  setLoading(true);

  try {
    const [r, rt] = await Promise.all([
      getReviewsByLocation(locationId),
      getRatingByLocation(locationId),
    ]);

    setReviews(r);
    setRating(rt);

    if (userId) {
      const ur = await getUserReview(locationId, userId);
      setUserReview(ur);
    } else {
      setUserReview(null);
    }
  } finally {
    setLoading(false);
  }
}, [locationId, userId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const submitReview = async (stars: number, comment: string) => {
    if (!userId) return;
    setSubmitting(true);
    const err = await upsertReview(locationId, userId, stars, comment);
    setSubmitting(false);
    if (!err) await fetchAll();
    return err;
  };

  const removeReview = async () => {
    if (!userId) return;
    await deleteReview(locationId, userId);
    await fetchAll();
  };

  return { reviews, rating, userReview, loading, submitting, submitReview, removeReview };
}