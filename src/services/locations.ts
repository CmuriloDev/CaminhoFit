import { supabase } from '@/lib/supabase';
import type { Location, LocationFilters } from '@/types';

export async function getAllLocations(filters?: LocationFilters): Promise<Location[]> {
  let query = supabase
    .from('locations')
    .select('*')
    .order('name', { ascending: true });

  if (filters?.type && filters.type !== 'todos') {
    query = query.eq('type', filters.type);
  }

  if (filters?.crowd_level && filters.crowd_level !== 'todos') {
    query = query.eq('crowd_level', filters.crowd_level);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLocationById(id: string): Promise<Location | null> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}