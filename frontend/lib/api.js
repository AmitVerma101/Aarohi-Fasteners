const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aarohi-fasteners-backend.onrender.com';

function resolveImageSrc(src) {
  if (!src || typeof src !== 'string') return '';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  if (src.startsWith('/assets/')) return `${API_BASE_URL}${src}`;
  return src;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.featured) query.set('featured', 'true');
  if (params.bestChoice) query.set('bestChoice', 'true');
  if (params.category) query.set('category', params.category);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  const data = await request(`/api/products${suffix}`);
  return (data.products || []).map((product) => ({
    ...product,
    imageSrc: resolveImageSrc(product.imageSrc),
  }));
}

export async function fetchCategories() {
  const data = await request('/api/categories');
  return (data.categories || []).map((category) => {
    if (typeof category === 'string') {
      return {
        name: category,
        isRecommended: false,
        homeSvg: '',
      };
    }
    return {
      name: typeof category?.name === 'string' ? category.name : '',
      isRecommended: Boolean(category?.isRecommended),
      homeSvg: typeof category?.homeSvg === 'string' ? category.homeSvg : '',
    };
  }).filter((category) => category.name);
}

export async function createCategory(category, adminToken) {
  return request('/api/categories', {
    method: 'POST',
    headers: { 'x-admin-token': adminToken },
    body: JSON.stringify(category),
  });
}

export async function updateCategory(id, category, adminToken) {
  return request(`/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'x-admin-token': adminToken },
    body: JSON.stringify(category),
  });
}

export async function deleteCategory(id, adminToken) {
  return request(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-token': adminToken },
  });
}

export async function createProduct(product, adminToken) {
  return request('/api/products', {
    method: 'POST',
    headers: { 'x-admin-token': adminToken },
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id, product, adminToken) {
  return request(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'x-admin-token': adminToken },
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id, adminToken) {
  return request(`/api/products/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-token': adminToken },
  });
}

export async function sendContactMessage(payload) {
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
