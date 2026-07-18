import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://eigenv.ai',
      lastModified: new Date('2026-07-18'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
