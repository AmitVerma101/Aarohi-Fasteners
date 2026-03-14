'use client';

import { useCallback, useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import Loader from '@/components/Loader';
import ApiError from '@/components/ApiError';
import { fetchProducts } from '@/lib/api';

export default function HomeBestChoiceSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError('');

    fetchProducts({ bestChoice: true })
      .then((products) => {
        if (!active) return;
        setItems(products);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to load products');
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

  if (!loading && !error && !items.length) return null;

  return (
    <section>
      <div className="products-header fade-in">
        <div>
          <p className="section-tag">Best Choice</p>
          <h2 className="section-title">Recommended products</h2>
        </div>
      </div>

      {loading ? <Loader message="Loading products…" /> : null}
      {error ? <ApiError message={error} onRetry={load} /> : null}

      <div className="product-grid">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
