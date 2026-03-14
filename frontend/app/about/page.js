'use client';

import Breadcrumb from '@/components/Breadcrumb';

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="bc-wrap">
        <Breadcrumb items={[{ label: 'About Us' }]} />
      </div>
      <section className="about-intro-wrap">
        <div className="about-intro-grid">
          <div className="fade-in">
            <p className="section-tag">About Us</p>
            <h1 className="about-main-title">Built for Precision. Trusted for Performance.</h1>
            <p className="about-main-copy">
              Aarohi Fastening Solutions is a manufacturing-driven company focused on delivering precision-engineered fasteners and
              components for demanding industrial applications. With decades of experience, strong process control, and
              a quality-first mindset, we support customers with reliable products and dependable execution.
            </p>
            <div className="about-intro-points">
              <span>Since 1986</span>
              <span>In-House Manufacturing</span>
              <span>OEM Capability</span>
            </div>
          </div>
          <div className="about-image-space fade-in">
            <span>Image Space</span>
          </div>
        </div>
      </section>

      <section className="about-vm-wrap">
        <div className="about-vm-head fade-in">
          <p className="section-tag">Vision &amp; Mission</p>
          <h2 className="section-title">Our Direction</h2>
        </div>
        <div className="about-vm-grid">
          <article className="about-vm-card about-vm-vision fade-in">
            <div className="about-vm-icon">◎</div>
            <h3>Our Vision</h3>
            <p>
              To become a globally trusted fastener manufacturing brand by delivering precision-engineered,
              high-performance fastening solutions through innovation, quality, and continuous improvement.
            </p>
          </article>
          <article className="about-vm-card about-vm-mission fade-in">
            <div className="about-vm-icon">◆</div>
            <h3>Our Mission</h3>
            <ul>
              <li>To manufacture fasteners that meet international quality standards</li>
              <li>To ensure consistent performance, reliability, and timely delivery</li>
              <li>To support customers with customized and OEM-based fastening solutions</li>
              <li>To build long-term relationships based on trust, transparency, and integrity</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="about-core-wrap">
        <div className="about-core-head fade-in">
          <p className="section-tag">Core Values</p>
          <h2 className="section-title">What Defines Us</h2>
        </div>
        <div className="about-core-grid">
          <article className="about-core-card fade-in">
            <div className="about-core-icon">⚙</div>
            <h3>Manufacturing Discipline</h3>
            <p>Controlled processes and practical engineering decisions guide every stage of production.</p>
          </article>
          <article className="about-core-card fade-in">
            <div className="about-core-icon">✓</div>
            <h3>Quality Without Compromise</h3>
            <p>Standards-driven inspections and consistency checks ensure dependable output every batch.</p>
          </article>
          <article className="about-core-card fade-in">
            <div className="about-core-icon">◉</div>
            <h3>Customer-Centric Execution</h3>
            <p>We align with customer specifications, timelines, and technical requirements from day one.</p>
          </article>
          <article className="about-core-card fade-in">
            <div className="about-core-icon">↔</div>
            <h3>Transparency &amp; Trust</h3>
            <p>Long-term partnerships are built through clear communication, realistic commitments, and integrity.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
