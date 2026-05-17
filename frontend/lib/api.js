async function request(path, options = {}) {
  const response = await fetch(path, {
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
  return data.products || [];
}

export async function fetchProduct(id) {
  const products = await fetchProducts();
  const product = products.find((p) => Number(p.id) === Number(id));
  if (!product) throw new Error('Product not found');
  return product;
}

export async function fetchCategories() {
  const data = await request('/api/categories');
  return (data.categories || [])
    .map((category) => {
      if (typeof category === 'string') {
        return { name: category, isRecommended: false, homeSvg: '' };
      }
      return {
        name: typeof category?.name === 'string' ? category.name : '',
        isRecommended: Boolean(category?.isRecommended),
        homeSvg: typeof category?.homeSvg === 'string' ? category.homeSvg : '',
      };
    })
    .filter((category) => category.name);
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
