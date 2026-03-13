import PdfViewerWrapper from '@/components/PdfViewerWrapper';

const PDF_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aarohi-fasteners-production.up.railway.app'}/assets/catalogue/HBS%20Fastner%20new%20design%20Final_compressed.pdf`;

export const metadata = {
  title: 'Catalogue — Aarohi Fasteners',
  description: 'Browse and download our full product catalogue.',
};

export default function CataloguePage() {
  return (
    <main className="catalogue-page">
      <div className="catalogue-hero">
        <h1 className="catalogue-title">Product Catalogue</h1>
        <p className="catalogue-subtitle">Browse our complete range of precision fastening solutions</p>
      </div>
      <div className="catalogue-viewer-wrap">
        <PdfViewerWrapper url={PDF_URL} />
      </div>
    </main>
  );
}
