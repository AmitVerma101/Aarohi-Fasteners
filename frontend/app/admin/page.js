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

/* ─── Description helpers ────────────────────────────── */
function assembleDescription({ overview, specs, materials, applications }) {
  const lines = [];

  if (overview.trim()) {
    lines.push('Description');
    lines.push(overview.trim());
    lines.push('');
  }

  const filled = (rows) => rows.filter((r) => r.key.trim() && r.value.trim());

  if (filled(specs).length) {
    lines.push('Technical Specifications');
    filled(specs).forEach((r) => lines.push(`${r.key.trim()}: ${r.value.trim()}`));
    lines.push('');
  }
  if (filled(materials).length) {
    lines.push('Material & Quality Excellence');
    filled(materials).forEach((r) => lines.push(`${r.key.trim()}: ${r.value.trim()}`));
    lines.push('');
  }
  if (filled(applications).length) {
    lines.push('Key Application Areas');
    filled(applications).forEach((r) => lines.push(`${r.key.trim()}: ${r.value.trim()}`));
  }

  return lines.join('\n').trim();
}

function parseDetailsFromDescription(desc) {
  const empty = { overview: '', specs: [], materials: [], applications: [] };
  if (!desc) return empty;

  let section = null;
  let overview = '';
  const specs = [], materials = [], applications = [];

  for (const raw of desc.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const ci = line.indexOf(':');
    const isSpec = ci > 0 && ci <= 40 && line[ci + 1] === ' ';
    const isHeading = ci === -1 && line.length <= 50;

    if (isHeading) {
      const l = line.toLowerCase();
      if (l === 'description') { section = 'overview'; continue; }
      if (l.includes('technical') || l.includes('specification')) { section = 'specs'; continue; }
      if (l.includes('material') || l.includes('quality')) { section = 'materials'; continue; }
      if (l.includes('application') || l.includes('area')) { section = 'applications'; continue; }
    } else if (isSpec) {
      const row = { key: line.slice(0, ci).trim(), value: line.slice(ci + 2).trim() };
      if (section === 'specs') specs.push(row);
      else if (section === 'materials') materials.push(row);
      else if (section === 'applications') applications.push(row);
    } else {
      if (section === 'overview' || section === null) {
        overview += (overview ? '\n' : '') + line;
        section = 'overview';
      }
    }
  }

  return { overview, specs, materials, applications };
}

/* ─── Key-value section editor ──────────────────────── */
function KvSection({ title, rows, onChange }) {
  function addRow() { onChange([...rows, { key: '', value: '' }]); }
  function removeRow(i) { onChange(rows.filter((_, idx) => idx !== i)); }
  function update(i, field, val) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));
  }
  return (
    <div className="kv-section">
      <div className="kv-section-head">
        <span className="kv-section-title">{title}</span>
        <button type="button" className="kv-add-btn" onClick={addRow}>+ Add row</button>
      </div>
      {rows.length === 0 && (
        <p className="kv-empty">No rows yet — click "+ Add row" to add entries.</p>
      )}
      {rows.map((row, i) => (
        <div key={i} className="kv-row">
          <input
            type="text"
            placeholder="Label (e.g. Drive Type)"
            value={row.key}
            onChange={(e) => update(i, 'key', e.target.value)}
          />
          <input
            type="text"
            placeholder="Detail"
            value={row.value}
            onChange={(e) => update(i, 'value', e.target.value)}
          />
          <button type="button" className="kv-remove-btn" onClick={() => removeRow(i)} title="Remove row">×</button>
        </div>
      ))}
    </div>
  );
}

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
    isBestChoice: false,
    homeSvg: '',
    imageFile: null,
    imageSrc: '',
  });
  const [productDetails, setProductDetails] = useState({ overview: '', specs: [], materials: [], applications: [] });
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
      isBestChoice: false,
      homeSvg: '',
      imageFile: null,
      imageSrc: '',
    }));
    setProductDetails({ overview: '', specs: [], materials: [], applications: [] });
    setActiveModal('product');
  }

  function openEditProductModal(product) {
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      isBestChoice: Boolean(product.isBestChoice),
      homeSvg: product.homeSvg || '',
      imageFile: null,
      imageSrc: product.imageSrc || '',
    });
    setProductDetails(parseDetailsFromDescription(product.description || ''));
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
        description: assembleDescription(productDetails),
        isBestChoice: productForm.isBestChoice,
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

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '.6rem' }}>
                <input
                  id="prod-best-choice"
                  type="checkbox"
                  checked={productForm.isBestChoice}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, isBestChoice: e.target.checked }))}
                />
                <label htmlFor="prod-best-choice" style={{ margin: 0 }}>Mark as Best Choice (shown on home page)</label>
              </div>

              <div className="form-group">
                <label>Overview / Introduction</label>
                <textarea
                  rows="3"
                  value={productDetails.overview}
                  onChange={(e) => setProductDetails((prev) => ({ ...prev, overview: e.target.value }))}
                  placeholder="Brief description of the product and its main benefits..."
                />
              </div>

              <div className="form-group">
                <label>Product Details</label>
                <KvSection
                  title="Technical Specifications"
                  rows={productDetails.specs}
                  onChange={(rows) => setProductDetails((prev) => ({ ...prev, specs: rows }))}
                />
                <KvSection
                  title="Material &amp; Quality"
                  rows={productDetails.materials}
                  onChange={(rows) => setProductDetails((prev) => ({ ...prev, materials: rows }))}
                />
                <KvSection
                  title="Key Application Areas"
                  rows={productDetails.applications}
                  onChange={(rows) => setProductDetails((prev) => ({ ...prev, applications: rows }))}
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
