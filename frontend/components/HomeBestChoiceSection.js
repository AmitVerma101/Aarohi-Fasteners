'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';

export default function HomeBestChoiceSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchProducts({ bestChoice: true })
      .then((products) => {
        if (!active) return;
        setItems(products);
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!loading && !items.length) return null;

  return (
    <section>
      <div className="products-header fade-in">
        <div>
          <p className="section-tag">Best Choice</p>
          <h2 className="section-title">Recommended products</h2>
        </div>
      </div>

      {loading ? <p>Loading best choices...</p> : null}

      <div className="product-grid">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
