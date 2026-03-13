'use client';

import { useState, useEffect, useRef } from 'react';

let pdfjsLib = null;

async function getPdfjsLib() {
  if (pdfjsLib) return pdfjsLib;
  pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  return pdfjsLib;
}

export default function PdfViewer({ url }) {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const renderTask   = useRef(null);

  const [pdf,          setPdf]          = useState(null);
  const [pageNumber,   setPageNumber]   = useState(1);
  const [numPages,     setNumPages]     = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [rendering,    setRendering]    = useState(false);
  const [error,        setError]        = useState(null);
  const [shareMsg,     setShareMsg]     = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [renderKey,    setRenderKey]    = useState(0);

  /* ── Load document ── */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getPdfjsLib().then(async (lib) => {
      try {
        const doc = await lib.getDocument({ url, withCredentials: false }).promise;
        if (!cancelled) {
          setPdf(doc);
          setNumPages(doc.numPages);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load catalogue. Please try again.');
          setLoading(false);
          console.error(err);
        }
      }
    });

    return () => { cancelled = true; };
  }, [url]);

  /* ── Fullscreen change listener ── */
  useEffect(() => {
    const onChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      setRenderKey(k => k + 1);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  /* ── Render current page ── */
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    let cancelled = false;

    async function render() {
      setRendering(true);

      if (renderTask.current) {
        try { renderTask.current.cancel(); } catch {}
      }

      try {
        const page         = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const container    = containerRef.current;
        const fs           = !!document.fullscreenElement;
        const availableW   = Math.min((container?.clientWidth ?? 800) - 32, fs ? 99999 : 900);
        const availableH   = Math.max(400, window.innerHeight - (fs ? 110 : 380));
        const baseViewport = page.getViewport({ scale: 1 });
        const scale        = Math.min(availableW / baseViewport.width, availableH / baseViewport.height);
        const viewport     = page.getViewport({ scale });
        const canvas       = canvasRef.current;

        canvas.width  = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const ctx = canvas.getContext('2d');
        const task = page.render({ canvasContext: ctx, viewport });
        renderTask.current = task;
        await task.promise;
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') console.error(err);
      } finally {
        if (!cancelled) setRendering(false);
      }
    }

    render();
    return () => { cancelled = true; };
  }, [pdf, pageNumber, renderKey]);

  const prev = () => setPageNumber(p => Math.max(1, p - 1));
  const next = () => setPageNumber(p => Math.min(numPages, p + 1));

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Aarohi Fasteners Catalogue', url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMsg('Link copied!');
        setTimeout(() => setShareMsg(''), 2000);
      }
    } catch {}
  };

  return (
    <div className={`pdf-viewer${isFullscreen ? ' pdf-viewer--fs' : ''}`} ref={containerRef}>

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
          <button className="pdf-btn pdf-btn-ghost" onClick={handleShare} aria-label="Share">
            {shareMsg || (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </>
            )}
          </button>
          <button className="pdf-btn pdf-btn-ghost" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {isFullscreen ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 01-2 2H3"/><path d="M21 8h-3a2 2 0 01-2-2V3"/><path d="M3 16h3a2 2 0 012 2v3"/><path d="M16 21v-3a2 2 0 012-2h3"/></svg>
                Exit
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3"/><path d="M21 8V5a2 2 0 00-2-2h-3"/><path d="M3 16v3a2 2 0 002 2h3"/><path d="M16 21h3a2 2 0 002-2v-3"/></svg>
                Expand
              </>
            )}
          </button>
          <a className="pdf-btn pdf-btn-accent" href={url} download aria-label="Download">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download
          </a>
        </div>
      </div>

      <div className="pdf-canvas-wrap">
        {loading && (
          <div className="pdf-loading">
            <span className="pdf-spinner" />
            Loading catalogue…
          </div>
        )}
        {error && <p className="pdf-error">{error}</p>}
        <canvas
          ref={canvasRef}
          style={{
            display:    loading || error ? 'none' : 'block',
            opacity:    rendering ? 0.5 : 1,
            transition: 'opacity 0.15s',
            boxShadow:  '0 4px 24px rgba(0,0,0,.2)',
          }}
        />
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
