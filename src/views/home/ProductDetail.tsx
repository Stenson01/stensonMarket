import { products, type Product } from '../../models/Product'

type ProductDetailProps = {
  product: Product
  onBack: () => void
  onSelectProduct: (product: Product) => void
  onAddToCart: (product: Product, quantity?: number) => void
  quantity: number
  onUpdateQuantity: (product: Product, change: number) => void
  onOpenCart: () => void
}

export default function ProductDetail({ product, onBack, onSelectProduct, onAddToCart, quantity, onUpdateQuantity, onOpenCart }: ProductDetailProps) {
  const relatedProducts = products.filter(
    (relatedProduct) => relatedProduct.category === product.category && relatedProduct.name !== product.name,
  )

  return (
    <section className="detail-screen" data-product-id={product.id} aria-labelledby="detail-title">
      <button className="back-button" type="button" onClick={onBack}>
        <span aria-hidden="true">&#8592;</span> Back to products
      </button>

      <div className="detail-hero">
        <div className={`detail-image ${product.color}`} aria-label={`${product.name} product image`} role="img">
          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : product.icon}
        </div>
        <div className="detail-summary">
          <span className="product-category">{product.category}</span>
          <h1 id="detail-title">{product.name}</h1>
          <div className="detail-rating" aria-label={`${product.rating} out of 5 stars`}>
            <span className="stars">★★★★★</span> <strong>{product.rating}</strong> <span>({product.reviewCount} reviews)</span>
          </div>
          <p className="detail-description">{product.description}</p>
          <p className="detail-origin">{product.origin}</p>
          <div className="detail-purchase">
            <div><strong>{product.price}</strong><span> / {product.unit}</span></div>
              <div className="quantity-control" aria-label="Quantity"><button type="button" aria-label={`Decrease ${product.name}`} onClick={() => onUpdateQuantity(product, -1)} disabled={quantity === 0}>-</button><span>{quantity}</span><button type="button" aria-label={`Increase ${product.name}`} onClick={() => onAddToCart(product)}>+</button></div>
            <div className="detail-actions">
              <button className="add-to-cart" type="button" onClick={() => onAddToCart(product)}>Add to cart</button>
              <button className="add-to-cart" type="button" onClick={onOpenCart}>Go to cart</button>
            </div>
          </div>
        </div>
      </div>

      <section className="testimonials" aria-labelledby="testimonials-title">
        <div className="detail-section-heading"><div><p className="eyebrow">From our customers</p><h2 id="testimonials-title">What people say</h2></div><span className="review-summary">{product.rating} average rating</span></div>
        <div className="testimonial-list">
          {product.testimonials.map((testimonial) => (
            <blockquote className="testimonial" key={testimonial.name}>
              <div className="stars" aria-hidden="true">★★★★★</div>
              <p>“{testimonial.quote}”</p>
              <footer><strong>{testimonial.name}</strong><span>{testimonial.date}</span></footer>
            </blockquote>
          ))}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-products" aria-labelledby="related-title">
          <div className="detail-section-heading"><div><p className="eyebrow">More to explore</p><h2 id="related-title">More from {product.category}</h2></div></div>
          <div className="related-list">
            {relatedProducts.map((relatedProduct) => (
              <button className="related-card" type="button" key={relatedProduct.name} onClick={() => onSelectProduct(relatedProduct)}>
                <span className={`related-image ${relatedProduct.color}`} aria-hidden="true">{relatedProduct.icon}</span>
                <span><strong>{relatedProduct.name}</strong><small>{relatedProduct.price} / {relatedProduct.unit}</small></span>
                <span aria-hidden="true">&#8594;</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}
