import type { MetadataRoute } from 'next';
import { getAllLocations } from '@/services/locations';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locations = await getAllLocations();

  const locationUrls = locations.map((loc) => ({
    url: `https://caminhofit.com.br/locations/${loc.id}`,
    lastModified: new Date(loc.last_updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://caminhofit.com.br',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...locationUrls,
  ];
}