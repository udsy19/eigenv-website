import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://eigenv.ai',
      lastModified: new Date('2026-07-18'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    { url: 'https://eigenv.ai/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://eigenv.ai/terms', changeFrequency: 'yearly', priority: 0.3 },
  ];
}
