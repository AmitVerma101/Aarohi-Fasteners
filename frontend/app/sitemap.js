const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.afsind.com';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.afsind.com';

export default async function sitemap() {
  const staticRoutes = [
    { url: SITE_URL, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/products`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/about`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/contact`, priority: 0.7, changeFrequency: 'monthly' },
  ];

  let productRoutes = [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, { next: { revalidate: 3600 } });
    const data = await res.json();
    productRoutes = (data.products || []).map((p) => ({
      url: `${SITE_URL}/products/${p.id}`,
      priority: 0.8,
      changeFrequency: 'monthly',
    }));
  } catch {
    // silently skip product routes if API is unavailable at build time
  }

  return [...staticRoutes, ...productRoutes];
}
