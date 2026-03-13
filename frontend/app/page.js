'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchCategories } from '@/lib/api';

const FALLBACK_HOME_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,3 21,8 21,16 12,21 3,16 3,8" /><circle cx="12" cy="12" r="3" /></svg>';
const WHY_CHOOSE_POINTS = [
  {
    icon: 'legacy',
    title: 'Legacy of Manufacturing Excellence',
    detail: 'Backed by an industrial legacy that began in 1986 under the leadership of Mr. Sushil Bansal Ji, we bring decades of expertise, innovation, and trust into every product we manufacture.',
  },
  {
    icon: 'control',
    title: 'Complete In-House Manufacturing Control',
    detail: 'From wire drawing to final fastener production, all critical processes are managed in-house. This end-to-end control ensures consistent quality, faster execution, and dependable supply.',
  },
  {
    icon: 'material',
    title: 'Superior Raw Material Quality',
    detail: 'We use only premium-grade stainless steel (all grades), mild steel, brass, copper, and aluminium. Our in-house wire drawing facility ensures better strength, finish, and long-term performance.',
  },
  {
    icon: 'custom',
    title: 'Customization & OEM Expertise',
    detail: 'We specialize in developing customized fasteners and precision components as per customer drawings, samples, and specifications, supported by strong technical and prototype development capabilities.',
  },
  {
    icon: 'quality',
    title: 'Strict Quality Assurance',
    detail: 'Quality is embedded at every stage of manufacturing. In-process and final inspections, dimensional checks, and thread testing ensure every fastener meets international quality and performance standards.',
  },
  {
    icon: 'delivery',
    title: 'Short Lead Time & Reliable Delivery',
    detail: 'Thanks to efficient processes and easy raw material availability, we offer very short lead times, enabling us to handle urgent, bulk, and project-based requirements with confidence.',
  },
];

function WhyIcon({ type }) {
  if (type === 'legacy') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h16" />
        <path d="M6 20V9h12v11" />
        <path d="M9 9V5h6v4" />
        <circle cx="12" cy="14" r="2.2" />
      </svg>
    );
  }
  if (type === 'control') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="8" width="16" height="11" rx="1.8" />
        <path d="M9 8V5h6v3" />
        <path d="M8 13h8" />
        <path d="M8 16h5" />
      </svg>
    );
  }
  if (type === 'material') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 8l8-4 8 4-8 4-8-4z" />
        <path d="M4 12l8 4 8-4" />
        <path d="M4 16l8 4 8-4" />
      </svg>
    );
  }
  if (type === 'custom') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 8h8" />
        <path d="M8 12h5" />
        <path d="M8 16h3" />
        <circle cx="16.5" cy="15.5" r="2.5" />
      </svg>
    );
  }
  if (type === 'quality') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l7 3v5c0 4.2-2.5 7-7 10-4.5-3-7-5.8-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="8" width="12" height="8" rx="1.5" />
      <path d="M15 11h3l2-2h1" />
      <path d="M7 16h8" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="13" cy="17.5" r="1.5" />
    </svg>
  );
}

export default function HomePage() {
  const [recommendedCategories, setRecommendedCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchCategories()
      .then((items) => {
        if (!active) return;
        setRecommendedCategories(items.filter((category) => category.isRecommended));
      })
      .catch(() => {
        if (!active) return;
        setRecommendedCategories([]);
      })
      .finally(() => {
        if (!active) return;
        setCategoriesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section id="hero">
        <div className="hero-bg" />
        <div className="hero-text">
          <p className="hero-eyebrow">Precision Fastening Solutions</p>
          <h1 className="hero-title">
            Built on <em>Legacy,</em>
            <br />
            Quality &amp; Trust
          </h1>
          <p className="hero-subtitle">
            Welcome to HBS Fasteners - your trusted partner for industrial-grade bolts, screws, nuts and precision fastening components. Serving engineers, manufacturers and tradespeople for over two decades.
          </p>
          <div className="hero-actions">
            <Link href="/catalogue" className="btn-primary">Browse Catalogue</Link>
            <Link href="/contact" className="btn-ghost">Request a Quote →</Link>
          </div>
        </div>
        <div className="hero-image-side">
          <Image
            src="/images/home-page/front-image.webp"
            alt="HBS Fasteners products"
            width={1200}
            height={900}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            priority
          />
        </div>
      </section>

      <section id="about-strip">
        <div className="about-strip-media fade-in">
          <Image
            src="/images/vision_mission.webp"
            alt="HBS Fasteners products"
            width={600}
            height={600}
            className="about-strip-image"
            priority
          />
        </div>
        <div className="about-text fade-in">
          <p className="section-tag">Vision &amp; Mission</p>
          <h2 className="section-title">Our Vision &amp; Mission</h2>
          <div className="about-body">
            <p><strong>Our Vision</strong></p>
            <p>To become a globally trusted fastener manufacturing brand by delivering precision-engineered, high-performance fastening solutions through innovation, quality, and continuous improvement.</p>
            <p><strong>Our Mission</strong></p>
            <ul>
              <li>To manufacture fasteners that meet international quality standards</li>
              <li>To ensure consistent performance, reliability, and timely delivery</li>
              <li>To support customers with customized and OEM-based fastening solutions</li>
              <li>To build long-term relationships based on trust, transparency, and integrity</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="categories">
        <div className="section-header fade-in">
          <p className="section-tag">What We Supply</p>
          <h2 className="section-title">Our Product Range</h2>
          <p className="section-subtitle">Our recommended categories, managed from the admin panel.</p>
        </div>
        {categoriesLoading ? <p>Loading categories...</p> : null}
        <div className="categories-grid">
          {recommendedCategories.map((category) => (
            <Link href="/products" className="cat-card fade-in" key={category.name}>
              <div
                className="cat-icon"
                dangerouslySetInnerHTML={{ __html: category.homeSvg || FALLBACK_HOME_SVG }}
              />
              <div>
                <div className="cat-name">{category.name}</div>
                <div className="cat-desc">Recommended category</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="values">
        <div className="section-header fade-in">
          <p className="section-tag">What Drives Us</p>
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-subtitle-full-width" style={{maxWidth: 'w-full'}}>We don’t just manufacture fasteners; we provide solutions. Our team continuously innovates to create custom-engineered products—like Special WSP Bolts and Triangle Screws—tailored to meet your specific engineering challenges.

Quality is the foundation of everything we do. From in-house wire drawing to the final precision finishing, we adhere to strict international standards (ISO/DIN) to ensure our fasteners provide maximum strength and durability.</p>
        </div>
        <div className="values-grid">
          <div className="val-card fade-in"><div className="val-icon">🔩</div><h3>Uncompromising Quality</h3><p>Every product in our range meets or exceeds industry standards. We don&apos;t cut corners - because our customers can&apos;t afford to either.</p></div>
          <div className="val-card fade-in"><div className="val-icon">🤝</div><h3>Trusted Partnerships</h3><p>We build relationships, not just transactions. Our team works with you to find the right solution every time - even when that means sourcing something new.</p></div>
          <div className="val-card fade-in"><div className="val-icon">⚡</div><h3>Speed &amp; Reliability</h3><p>Large stock holdings and an efficient dispatch operation mean you get what you need, when you need it. No delays, no excuses.</p></div>
          <div className="val-card fade-in"><div className="val-icon">🔍</div><h3>Technical Expertise</h3><p>Decades of experience means we know fasteners inside out. Our team can advise on grade selection, coatings, tolerances and more.</p></div>
        </div>
      </section>

      <section id="why">
        <div className="section-header fade-in">
          <h2 className="section-title">Why Choose HBS Fasteners</h2>
          <p className="section-subtitle-full-width">At HBS Fasteners, we combine decades of manufacturing experience with advanced technology to deliver fastening solutions that industries can rely on. Here&apos;s why customers across India and overseas choose us as their trusted manufacturing partner:</p>
        </div>
        <div className="why-cards">
          {WHY_CHOOSE_POINTS.map((point) => (
            <article className="why-flip-card fade-in" key={point.title}>
              <div className="why-flip-inner">
                <div className="why-flip-front">
                  <div className="why-icon">
                    <WhyIcon type={point.icon} />
                  </div>
                  <h3>{point.title}</h3>
                </div>
                <div className="why-flip-back">
                  <p>{point.detail}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
