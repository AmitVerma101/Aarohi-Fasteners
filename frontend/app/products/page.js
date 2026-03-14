'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import CatalogueItem from '@/components/CatalogueItem';
import Loader from '@/components/Loader';
import ApiError from '@/components/ApiError';
import { fetchProducts } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    if (window.innerWidth <= 768) setViewMode('list');
  }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError('');

    fetchProducts()
      .then((items) => {
        if (!active) return;
        setProducts(items);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to load catalogue');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category))],
    [products]
  );
  const filteredProducts = useMemo(
    () => products.filter((p) => activeCategory === 'All' || activeCategory === p.category),
    [products, activeCategory]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const categoryFromQuery = new URLSearchParams(window.location.search).get('category');
    if (!categoryFromQuery) return;
    if (categories.includes(categoryFromQuery)) {
      setActiveCategory(categoryFromQuery);
    }
  }, [categories]);

  return (
    <>
      <div className="bc-wrap">
        <Breadcrumb items={[{ label: 'Products' }]} />
      </div>
      <section className="bc-below">
      <p className="section-tag fade-in">Full Catalogue</p>
      <h2 className="section-title fade-in">Everything we make</h2>

      <div className="products-toolbar fade-in">
        <div className="catalogue-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="products-view-switch">
          <button
            className={`view-toggle-btn${viewMode === 'grid' ? ' active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            title="Grid view"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="8" height="8" />
              <rect x="13" y="3" width="8" height="8" />
              <rect x="3" y="13" width="8" height="8" />
              <rect x="13" y="13" width="8" height="8" />
            </svg>
          </button>
          <button
            className={`view-toggle-btn${viewMode === 'list' ? ' active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="Line view"
            title="Line view"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <line x1="5" y1="7" x2="21" y2="7" />
              <line x1="5" y1="12" x2="21" y2="12" />
              <line x1="5" y1="17" x2="21" y2="17" />
              <circle cx="3" cy="7" r="1.2" />
              <circle cx="3" cy="12" r="1.2" />
              <circle cx="3" cy="17" r="1.2" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? <Loader message="Loading catalogue…" /> : null}
      {error ? <ApiError message={error} onRetry={load} /> : null}

      {viewMode === 'grid' ? (
        <div className="catalogue-grid">
          {filteredProducts.map((product) => (
            <CatalogueItem key={product.id} product={product} hidden={false} />
          ))}
        </div>
      ) : (
        <div className="products-line-list">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="products-line-item fade-in">
              <div className="products-line-thumb">
                {product.imageSrc ? (
                  <img
                    src={product.imageSrc}
                    alt={product.name}
                    className="products-line-thumb-img"
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </div>
              <div className="products-line-main">
                <h3>{product.name}</h3>
                <p>{product.category}</p>
              </div>
              <div className="products-line-desc">{product.description}</div>
            </Link>
          ))}
        </div>
      )}
    </section>
    </>
  );
}
