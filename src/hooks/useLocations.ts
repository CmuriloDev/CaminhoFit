'use client';

import { useEffect, useState, useCallback } from 'react';
import { getAllLocations } from '@/services/locations';
import type { Location, LocationFilters } from '@/types';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filtered, setFiltered] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LocationFilters>({});
  const [search, setSearch] = useState('');

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllLocations(filters);
      setLocations(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // Filtragem por texto no cliente (sem nova requisição)
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(locations);
      return;
    }
    const q = search.toLowerCase().trim();
    setFiltered(
      locations.filter((loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.description?.toLowerCase().includes(q) ||
        loc.tags?.some((t) => t.toLowerCase().includes(q))
      )
    );
  }, [search, locations]);

  return {
    locations: filtered,
    totalLocations: locations.length,
    loading,
    error,
    filters,
    setFilters,
    search,
    setSearch,
  };
}