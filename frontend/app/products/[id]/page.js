'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchProduct } from '@/lib/api';
import Breadcrumb from '@/components/Breadcrumb';
import Loader from '@/components/Loader';
import ApiError from '@/components/ApiError';

const WHATSAPP_NUM = '917494929226';
const PHONE_NUM = '+917494929226';

/* ─── Image Zoom ─────────────────────────────────── */
function ImageZoom({ src, alt }) {
  const [active, setActive] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const r = ref.current.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }, []);

  return (
    <div className="pz-wrap">
      <div
        ref={ref}
        className="pz-stage"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => { setActive(false); setOrigin({ x: 50, y: 50 }); }}
        onMouseMove={onMove}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="pz-img"
            draggable={false}
            style={{
              transform: active ? 'scale(2.2)' : 'scale(1)',
              transformOrigin: `${origin.x}% ${origin.y}%`,
              transition: 'transform 0.3s ease',
              cursor: active ? 'crosshair' : 'zoom-in',
            }}
          />
        ) : (
          <div className="pz-no-img">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="48" height="48">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>No image available</span>
          </div>
        )}
      </div>
      <p className="pz-hint-below">Hover to zoom · move to explore</p>
    </div>
  );
}

/* ─── Description Parser ─────────────────────────── */
function parseDescription(text) {
  const blocks = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && colonIdx <= 40 && line[colonIdx + 1] === ' ') {
      blocks.push({ type: 'spec', key: line.slice(0, colonIdx), value: line.slice(colonIdx + 2) });
    } else if (colonIdx === -1 && line.length <= 50) {
      blocks.push({ type: 'heading', text: line });
    } else {
      blocks.push({ type: 'paragraph', text: line });
    }
  }
  return blocks;
}

/* ─── Page ───────────────────────────────────────── */
export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError('');

    fetchProduct(id)
      .then((p) => { if (active) setProduct(p); })
      .catch((err) => { if (active) setError(err.message || 'Failed to load product'); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [id]);

  useEffect(() => { const c = load(); return c; }, [load]);

  if (loading) return <section><Loader message="Loading product…" /></section>;
  if (error) return <section><ApiError message={error} onRetry={load} /></section>;
  if (!product) return null;

  const waText = encodeURIComponent(`Hi, I'd like to enquire about *${product.name}* (${product.category}). Could you please share more details?`);

  const descBlocks = parseDescription(product.description || '');

  return (
    <>
      <div className="bc-wrap">
        <Breadcrumb items={[
          { label: 'Products', href: '/products' },
          { label: product.category, href: `/products?category=${encodeURIComponent(product.category)}` },
          { label: product.name },
        ]} />
      </div>
      <section className="pd-section">

      {/* Main layout */}
      <div className="pd-main">

        {/* Left: Image */}
        <div className="pd-gallery fade-in">
          <ImageZoom src={product.imageSrc} alt={product.name} />
          {product.isBestChoice && (
            <div className="pd-badge">
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              Best Choice
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="pd-info fade-in">
          <span className="pd-category-tag">{product.category}</span>
          <h1 className="pd-name">{product.name}</h1>

          <div className="pd-divider" />

          <div className="pd-description">
            {descBlocks.map((block, i) => {
              if (block.type === 'heading') return <h3 key={i} className="pd-desc-heading">{block.text}</h3>;
              if (block.type === 'spec') return (
                <div key={i} className="pd-desc-spec">
                  <span className="pd-desc-spec-key">{block.key}:</span> {block.value}
                </div>
              );
              return <p key={i} className="pd-desc-para">{block.text}</p>;
            })}
          </div>

          <div className="pd-divider" />

          {/* Contact actions */}
          <p className="pd-contact-label">Enquire about this product</p>
          <div className="pd-actions">
            <a
              href={`https://wa.me/${WHATSAPP_NUM}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="pd-btn pd-btn-whatsapp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 24l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118c5.466 0 9.882 4.415 9.882 9.882 0 5.466-4.416 9.882-9.882 9.882z" />
              </svg>
              WhatsApp Enquiry
            </a>
            <a href={`tel:${PHONE_NUM}`} className="pd-btn pd-btn-call">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
              </svg>
              Call Us
            </a>
          </div>

          <Link href="/contact" className="pd-quote-link">
            Request a formal quote →
          </Link>
        </div>
      </div>

    </section>
    </>
  );
}
