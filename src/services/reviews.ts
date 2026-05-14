import { supabase } from '@/lib/supabase';
import type { Review, LocationRating } from '@/types';

export async function getReviewsByLocation(locationId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(username)')
    .eq('location_id', locationId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getRatingByLocation(locationId: string): Promise<LocationRating | null> {
  const { data, error } = await supabase
    .from('location_ratings')
    .select('*')
    .eq('location_id', locationId)
    .single();

  if (error) return null;
  return data;
}

export async function upsertReview(
  locationId: string,
  userId: string,
  rating: number,
  comment: string
): Promise<string | null> {
  const { error } = await supabase
    .from('reviews')
    .upsert(
      { location_id: locationId, user_id: userId, rating, comment },
      { onConflict: 'user_id,location_id' }
    );

  return error?.message ?? null;
}

export async function deleteReview(locationId: string, userId: string): Promise<void> {
  await supabase
    .from('reviews')
    .delete()
    .eq('location_id', locationId)
    .eq('user_id', userId);
}

export async function getUserReview(
  locationId: string,
  userId: string
): Promise<Review | null> {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('location_id', locationId)
    .eq('user_id', userId)
    .single();

  return data ?? null;
}