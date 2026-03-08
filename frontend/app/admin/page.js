'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  updateCategory,
  updateProduct,
} from '@/lib/api';

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [activeModal, setActiveModal] = useState(null);

  const [categoryForm, setCategoryForm] = useState({ id: null, name: '', isRecommended: false, homeSvg: '' });
  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    category: '',
    description: '',
    homeSvg: '',
    imageFile: null,
    imageSrc: '',
  });
  const [productPreview, setProductPreview] = useState('');

  const categoryOptions = useMemo(() => categories.map((category) => category.name), [categories]);

  function showError(message) {
    const text = message || 'Something went wrong.';
    setStatus({ type: 'error', text });
    window.alert(text);
  }

  function showSuccess(message) {
    const text = message || 'Done.';
    setStatus({ type: 'success', text });
    window.alert(text);
  }

  async function refreshData() {
    const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
    setCategories(cats);
    setProducts(prods);
    setProductForm((prev) => ({
      ...prev,
      category: prev.category || cats[0]?.name || '',
    }));
  }

  useEffect(() => {
    if (!productForm.imageFile) {
      setProductPreview('');
      return;
    }

    const nextPreview = URL.createObjectURL(productForm.imageFile);
    setProductPreview(nextPreview);
    return () => URL.revokeObjectURL(nextPreview);
  }, [productForm.imageFile]);

  useEffect(() => {
    refreshData().catch((err) => setStatus({ type: 'error', text: err.message || 'Failed to load admin data' }));
  }, []);

  function openCreateCategoryModal() {
    setCategoryForm({ id: null, name: '', isRecommended: false, homeSvg: '' });
    setActiveModal('category');
  }

  function openEditCategoryModal(category, index) {
    setCategoryForm({
      id: index + 1,
      name: category.name,
      isRecommended: Boolean(category.isRecommended),
      homeSvg: category.homeSvg || '',
    });
    setActiveModal('category');
  }

  function openCreateProductModal() {
    setProductForm((prev) => ({
      id: null,
      name: '',
      category: prev.category || categories[0]?.name || '',
      description: '',
      homeSvg: '',
      imageFile: null,
      imageSrc: '',
    }));
    setActiveModal('product');
  }

  function openEditProductModal(product) {
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description || '',
      homeSvg: product.homeSvg || '',
      imageFile: null,
      imageSrc: product.imageSrc || '',
    });
    setActiveModal('product');
  }

  function closeModal() {
    setActiveModal(null);
  }

  async function onSubmitCategory(e) {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    if (!adminToken.trim()) {
      showError('Admin token is required.');
      return;
    }

    try {
      if (categoryForm.id) {
        await updateCategory(categoryForm.id, {
          name: categoryForm.name,
          isRecommended: categoryForm.isRecommended,
          homeSvg: categoryForm.homeSvg,
        }, adminToken);
        setStatus({ type: 'success', text: 'Category updated.' });
      } else {
        await createCategory({
          name: categoryForm.name,
          isRecommended: categoryForm.isRecommended,
          homeSvg: categoryForm.homeSvg,
        }, adminToken);
        setStatus({ type: 'success', text: 'Category added.' });
      }

      await refreshData();
      closeModal();
    } catch (err) {
      showError(err.message || 'Failed to save category');
    }
  }

  async function onSubmitProduct(e) {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    if (!adminToken.trim()) {
      showError('Admin token is required.');
      return;
    }

    try {
      const payload = {
        name: productForm.name,
        category: productForm.category,
        description: productForm.description,
        homeSvg: productForm.homeSvg,
      };

      if (productForm.imageFile) {
        payload.imageName = productForm.imageFile.name;
        payload.imageData = await fileToDataUrl(productForm.imageFile);
      }

      if (productForm.id) {
        await updateProduct(productForm.id, payload, adminToken);
        setStatus({ type: 'success', text: 'Product updated.' });
      } else {
        await createProduct(payload, adminToken);
        setStatus({ type: 'success', text: 'Product added.' });
      }

      await refreshData();
      closeModal();
    } catch (err) {
      showError(err.message || 'Failed to save product');
    }
  }

  async function onDeleteCategory(index, name) {
    const ok = window.confirm(`Delete category "${name}"? This will also delete products in this category.`);
    if (!ok) return;

    setStatus({ type: '', text: '' });
    if (!adminToken.trim()) {
      showError('Admin token is required.');
      return;
    }
    try {
      await deleteCategory(index + 1, adminToken);
      showSuccess('Category deleted.');
      await refreshData();
    } catch (err) {
      showError(err.message || 'Failed to delete category');
    }
  }

  async function onDeleteProduct(id, name) {
    const ok = window.confirm(`Delete product "${name}"?`);
    if (!ok) return;

    setStatus({ type: '', text: '' });
    if (!adminToken.trim()) {
      showError('Admin token is required.');
      return;
    }
    try {
      await deleteProduct(id, adminToken);
      showSuccess('Product deleted.');
      await refreshData();
    } catch (err) {
      showError(err.message || 'Failed to delete product');
    }
  }

  return (
    <section>
      <p className="section-tag">Admin</p>
      <h2 className="section-title">Product Management</h2>

      <div className="contact-form" style={{ maxWidth: 920 }}>
        <div className="form-group admin-token-sticky">
          <label>Admin Token</label>
          <input
            type="password"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="Set ADMIN_TOKEN in backend, then paste it here"
          />
        </div>

        <div className="admin-actions-row">
          <button type="button" className="btn-submit" onClick={openCreateCategoryModal}>
            Add Category
          </button>
          <button type="button" className="btn-submit" onClick={openCreateProductModal}>
            Add Product
          </button>
        </div>

        {status.text ? (
          <p className={`admin-status ${status.type === 'error' ? 'error' : 'success'}`}>{status.text}</p>
        ) : null}

        <div>
          <h3 style={{ marginTop: '1rem' }}>Categories ({categories.length})</h3>
          <div className="catalogue-grid">
            {categories.map((cat, index) => (
              <div className="catalogue-item" key={cat.name}>
                <div className="catalogue-body">
                  <div className="catalogue-name">{cat.name}</div>
                  <div className="catalogue-meta">
                    {cat.isRecommended ? 'Recommended' : 'Not recommended'}
                  </div>
                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="admin-edit-btn"
                      onClick={() => openEditCategoryModal(cat, index)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-delete-btn"
                      onClick={() => onDeleteCategory(index, cat.name)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3 style={{ marginTop: '1.5rem' }}>Current Products ({products.length})</h3>
        <div className="catalogue-grid">
          {products.map((p) => (
            <div className="catalogue-item" key={p.id}>
              <div className="catalogue-img">
                {p.imageSrc ? <img src={p.imageSrc} alt={p.name} className="catalogue-media" /> : null}
              </div>
              <div className="catalogue-body">
                <div className="catalogue-name">{p.name}</div>
                <div className="catalogue-meta">
                  {p.category}
                </div>
                <div className="admin-row-actions">
                  <button type="button" className="admin-edit-btn" onClick={() => openEditProductModal(p)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-delete-btn"
                    onClick={() => onDeleteProduct(p.id, p.name)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeModal === 'category' ? (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>{categoryForm.id ? 'Edit Category' : 'Add Category'}</h3>
              <button type="button" className="admin-close-btn" onClick={closeModal}>Close</button>
            </div>
            <form className="contact-form" onSubmit={onSubmitCategory}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Washers"
                />
              </div>
              <div className="form-group">
                <label>Category SVG</label>
                <textarea
                  rows="4"
                  value={categoryForm.homeSvg}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, homeSvg: e.target.value }))}
                  placeholder='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /></svg>'
                />
              </div>
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '.5rem' }}>
                <input
                  id="category-recommended"
                  type="checkbox"
                  checked={categoryForm.isRecommended}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, isRecommended: e.target.checked }))}
                />
                <label htmlFor="category-recommended" style={{ margin: 0 }}>Recommended on home page</label>
              </div>
              <button type="submit" className="btn-submit">
                {categoryForm.id ? 'Update Category' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {activeModal === 'product' ? (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>{productForm.id ? 'Edit Product' : 'Add Product'}</h3>
              <button type="button" className="admin-close-btn" onClick={closeModal}>Close</button>
            </div>

            <form className="contact-form" onSubmit={onSubmitProduct}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Will default to image file name if left empty"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      imageFile: e.target.files && e.target.files[0] ? e.target.files[0] : null,
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="4"
                  value={productForm.description}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description..."
                />
              </div>

              <div className="form-group">
                <label>Home Page SVG (optional)</label>
                <textarea
                  rows="5"
                  value={productForm.homeSvg}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, homeSvg: e.target.value }))}
                  placeholder='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /></svg>'
                />
              </div>

              {productPreview || productForm.imageSrc ? (
                <div className="form-group">
                  <label>Image Preview</label>
                  <div className="admin-image-preview">
                    <img src={productPreview || productForm.imageSrc} alt="Preview" className="admin-image-preview-img" />
                  </div>
                </div>
              ) : null}

              <button type="submit" className="btn-submit">
                {productForm.id ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
