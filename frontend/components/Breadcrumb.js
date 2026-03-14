import { Fragment } from 'react';
import Link from 'next/link';

function ChevronSep() {
  return (
    <svg
      className="pd-bc-sep"
      viewBox="0 0 6 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="6"
      height="10"
      aria-hidden="true"
    >
      <polyline points="1 1 5 5 1 9" />
    </svg>
  );
}

/**
 * items: Array<{ label: string, href?: string }>
 * Last item should have no href — it becomes the current page crumb.
 */
export default function Breadcrumb({ items }) {
  return (
    <nav className="pd-breadcrumb" aria-label="Breadcrumb">
      <Link href="/">
        <svg
          className="pd-bc-home"
          viewBox="0 0 20 20"
          fill="currentColor"
          width="13"
          height="13"
          aria-hidden="true"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7A1 1 0 003 11h1v6a1 1 0 001 1h4v-4h2v4h4a1 1 0 001-1v-6h1a1 1 0 00.707-1.707l-7-7z" />
        </svg>
        Home
      </Link>
      {items.map((item) => (
        <Fragment key={item.label}>
          <ChevronSep />
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className="pd-breadcrumb-current" aria-current="page">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
