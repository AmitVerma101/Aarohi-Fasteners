'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08 }
    );

    const observeFadeTargets = (root = document) => {
      if (!(root instanceof Element || root instanceof Document)) return;

      if (root instanceof Element && root.classList.contains('fade-in')) {
        fadeObserver.observe(root);
      }

      root.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el));
    };

    observeFadeTargets();

    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            if (width) entry.target.style.width = `${width}%`;
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const barTargets = document.querySelectorAll('.bar-fill');
    barTargets.forEach((el) => barObserver.observe(el));

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => observeFadeTargets(node));
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      fadeObserver.disconnect();
      barObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
