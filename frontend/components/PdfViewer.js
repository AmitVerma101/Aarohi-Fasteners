'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PdfViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareMsg, setShareMsg] = useState('');
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    setContainerWidth(containerRef.current.clientWidth);
    return () => observer.disconnect();
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    setError('Failed to load catalogue. Please try again.');
    setLoading(false);
    console.error(err);
  }, []);

  const prev = () => setPageNumber((p) => Math.max(1, p - 1));
  const next = () => setPageNumber((p) => Math.min(numPages, p + 1));

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Aarohi Fasteners Catalogue', url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMsg('Link copied!');
        setTimeout(() => setShareMsg(''), 2000);
      }
    } catch {
      // user cancelled share
    }
  };

  const pageWidth = Math.min(containerWidth, 900);

  return (
    <div className="pdf-viewer" ref={containerRef}>
      <div className="pdf-toolbar">
        <div className="pdf-nav">
          <button className="pdf-btn" onClick={prev} disabled={pageNumber <= 1} aria-label="Previous page">
            &#8592; Prev
          </button>
          <span className="pdf-page-info">
            {loading ? '—' : `${pageNumber} / ${numPages}`}
          </span>
          <button className="pdf-btn" onClick={next} disabled={!numPages || pageNumber >= numPages} aria-label="Next page">
            Next &#8594;
          </button>
        </div>

        <div className="pdf-actions">
          <button className="pdf-btn pdf-btn-ghost" onClick={handleShare} aria-label="Share catalogue">
            {shareMsg || (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </>
            )}
          </button>
          <a className="pdf-btn pdf-btn-accent" href={url} download aria-label="Download catalogue">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download
          </a>
        </div>
      </div>

      <div className="pdf-canvas-wrap">
        {error ? (
          <p className="pdf-error">{error}</p>
        ) : (
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="pdf-loading"><span className="pdf-spinner" />Loading catalogue…</div>}
          >
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderAnnotationLayer={true}
              renderTextLayer={true}
            />
          </Document>
        )}
      </div>

      {numPages > 1 && (
        <div className="pdf-bottom-nav">
          <button className="pdf-btn" onClick={prev} disabled={pageNumber <= 1}>&#8592; Prev</button>
          <span className="pdf-page-info">{pageNumber} / {numPages}</span>
          <button className="pdf-btn" onClick={next} disabled={pageNumber >= numPages}>Next &#8594;</button>
        </div>
      )}
    </div>
  );
}
