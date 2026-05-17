import { readDb } from '@/lib/db';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.afsind.com';

export default async function sitemap() {
  const staticRoutes = [
    { url: SITE_URL, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/products`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/about`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/contact`, priority: 0.7, changeFrequency: 'monthly' },
  ];

  let productRoutes = [];
  try {
    const db = await readDb();
    productRoutes = db.products.map((p) => ({
      url: `${SITE_URL}/products/${p.id}`,
      priority: 0.8,
      changeFrequency: 'monthly',
    }));
  } catch {
    // silently skip product routes if data is unavailable at build time
  }

  return [...staticRoutes, ...productRoutes];
}
