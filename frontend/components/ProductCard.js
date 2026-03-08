export default function ProductCard({ product }) {
  return (
    <div className="product-card fade-in">
      <div className="product-img">
        <div className="product-img-inner">
          {product.imageSrc ? (
            <img
              src={product.imageSrc}
              alt={product.name}
              className="product-media"
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </div>
        {product.isBestChoice ? <span className="product-badge">Best Choice</span> : null}
      </div>
      <div className="product-info">
        <div>
          <div className="product-name">{product.name}</div>
          <div className="product-category">{product.category}</div>
        </div>
      </div>
    </div>
  );
}
