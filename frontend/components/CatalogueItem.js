export default function CatalogueItem({ product, hidden }) {
  return (
    <div className={`catalogue-item fade-in${hidden ? ' hidden' : ''}`}>
      <div className="catalogue-img">
        {product.imageSrc ? (
          <img
            src={product.imageSrc}
            alt={product.name}
            className="catalogue-media"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      <div className="catalogue-body">
        <div className="catalogue-name">{product.name}</div>
        <div className="catalogue-meta">{product.category}</div>
      </div>
    </div>
  );
}
