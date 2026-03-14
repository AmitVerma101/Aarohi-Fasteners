'use client';

import Breadcrumb from '@/components/Breadcrumb';

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="bc-wrap">
        <Breadcrumb items={[{ label: 'About Us' }]} />
      </div>
      <section className="about-intro-wrap">
        <div className="fade-in">
          <p className="section-tag">About Us</p>
          <h1 className="about-main-title">Quality You Can Count On Every Turn.</h1>
          <div className="about-body">
            <p>
              Aarohi Fastening Solutions (AFS) is a reliable supplier of industrial fasteners, dedicated to providing
              high-quality products and dependable service to our customers. We specialize in a wide range of fastening
              products including nuts, bolts, washers, screws, and customized fastening components for various industrial
              applications.
            </p>
            <p>
              Our focus is to deliver products that meet international standards of quality, strength, and durability.
              With strong vendor partnerships and efficient supply capabilities, we ensure timely delivery and competitive
              pricing for our clients.
            </p>
            <p>
              At AFS, we understand that every industry requires precision and reliability in fastening solutions.
              Therefore, we maintain strict quality checks and continuously work to improve our product range and service
              standards. Our goal is to build long-term relationships with customers by offering trusted solutions and
              professional support.
            </p>
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
