'use client';

import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('./PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="pdf-canvas-wrap">
      <div className="pdf-loading">
        <span className="pdf-spinner" />
        Loading catalogue…
      </div>
    </div>
  ),
});

export default function PdfViewerWrapper({ url }) {
  return <PdfViewer url={url} />;
}
