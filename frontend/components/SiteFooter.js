'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchCategories } from '@/lib/api';

export default function SiteFooter() {
  const [recommendedCategories, setRecommendedCategories] = useState([]);

  useEffect(() => {
    let active = true;
    fetchCategories()
      .then((categories) => {
        if (!active) return;
        setRecommendedCategories(categories.filter((category) => category.isRecommended));
      })
      .catch(() => {
        if (!active) return;
        setRecommendedCategories([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="site-footer-shared">
      <div className="footer4-inner">
        <div className="footer4-grid">
          <div className="footer4-col">
            <Link href="/" className="footer-shared-logo">
              HBS Fasteners
            </Link>
            <p className="footer4-tagline">Precision Fastening Solutions Built on Legacy, Quality &amp; Trust</p>
            <div className="footer4-socials">
              <a href="#" className="topbar-social footer-social-icon" title="LinkedIn" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a href="#" className="topbar-social footer-social-icon" title="Facebook" aria-label="Facebook" target="_blank" rel="noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
              </a>
              <a href="#" className="topbar-social footer-social-icon" title="Instagram" aria-label="Instagram" target="_blank" rel="noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </a>
              <a href="https://wa.me/YOUR_PHONE_NUMBER" className="topbar-social footer-social-icon" title="WhatsApp" aria-label="WhatsApp" target="_blank" rel="noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 24l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118c5.466 0 9.882 4.415 9.882 9.882 0 5.466-4.416 9.882-9.882 9.882z" /></svg>
              </a>
            </div>
          </div>

          <div className="footer4-col">
            <h5>Products</h5>
            <ul>
              {recommendedCategories.map((category) => (
                <li key={category.name}>
                  <Link href={`/products?category=${encodeURIComponent(category.name)}`}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer4-col">
            <h5>Company</h5>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer4-col">
            <h5>Contact</h5>
            <ul className="footer4-contact">
              <li>HBS Fasteners, Jamnagar, Gujarat, India</li>
              <li><a href="tel:+919876543210">+91 98765 43210</a></li>
              <li><a href="mailto:sales@hbsfasteners.com">sales@hbsfasteners.com</a></li>
            </ul>
          </div>
        </div>
        <div className="footer4-bottom">
          <p>© {new Date().getFullYear()} HBS Fasteners. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
