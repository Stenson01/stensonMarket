import type { Product } from '../../models/Product'

type CartScreenProps = {
  products: Product[]
  cart: Record<string, number>
  onBack: () => void
  onIncrease: (product: Product) => void
  onDecrease: (product: Product) => void
  onRemove: (product: Product) => void
  onCheckout: () => void
  showAuthPrompt: boolean
  onLogin: () => void
  onSignup: () => void
  onCloseAuthPrompt: () => void
}

export default function CartScreen({ products, cart, onBack, onIncrease, onDecrease, onRemove, onCheckout, showAuthPrompt, onLogin, onSignup, onCloseAuthPrompt }: CartScreenProps) {
  const items = products.filter((product) => cart[product.name])
  const total = items.reduce((sum, product) => sum + Number.parseFloat(product.price.slice(1)) * cart[product.name], 0)
  const itemCount = items.reduce((sum, product) => sum + cart[product.name], 0)

  return (
    <section className="cart-screen" aria-labelledby="cart-title">
      <button className="back-button" type="button" onClick={onBack}><span aria-hidden="true">&#8592;</span> Continue shopping</button>
      <div className="cart-heading"><div><p className="eyebrow">Your selection</p><h1 id="cart-title">Shopping cart</h1></div><span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span></div>
      {items.length === 0 ? (
        <div className="empty-cart"><span className="empty-cart-icon" aria-hidden="true">&#128722;</span><h2>Your cart is empty</h2><p>Add something fresh from the market to get started.</p><button className="add-to-cart" type="button" onClick={onBack}>Browse products</button></div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((product) => (
              <article className="cart-item" key={product.name}>
                <div className={`cart-item-image ${product.color}`}>
                  {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <span aria-hidden="true">{product.icon}</span>}
                </div>
                <div className="cart-item-info"><span className="product-category">{product.category}</span><h2>{product.name}</h2><span>{product.price} / {product.unit}</span></div>
                <div className="cart-item-actions"><div className="quantity-control"><button type="button" onClick={() => onDecrease(product)} aria-label={`Decrease ${product.name}`}>-</button><span>{cart[product.name]}</span><button type="button" onClick={() => onIncrease(product)} aria-label={`Increase ${product.name}`}>+</button></div><button className="remove-button" type="button" onClick={() => onRemove(product)}>Remove</button></div>
              </article>
            ))}
          </div>
          <aside className="cart-summary"><p className="eyebrow">Order summary</p><h2>Ready when you are</h2><div><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><div><span>Delivery</span><span>Calculated at checkout</span></div><hr /><div className="cart-total"><strong>Total</strong><strong>${total.toFixed(2)}</strong></div><button className="checkout-button" type="button" onClick={onCheckout}>Proceed to checkout</button></aside>
        </div>
      )}
      {showAuthPrompt && (
        <div className="auth-sheet-backdrop" role="presentation" onClick={onCloseAuthPrompt}>
          <section className="auth-sheet" role="dialog" aria-modal="true" aria-labelledby="auth-sheet-title" onClick={(event) => event.stopPropagation()}>
            <button className="auth-sheet-close" type="button" aria-label="Close sign-in prompt" onClick={onCloseAuthPrompt}>&times;</button>
            <p className="eyebrow">One more step</p>
            <h2 id="auth-sheet-title">Sign in to continue</h2>
            <p>Please log in or create an account before proceeding to checkout.</p>
            <div className="auth-sheet-actions">
              <button className="checkout-button" type="button" onClick={onLogin}>Log in</button>
              <button className="add-to-cart" type="button" onClick={onSignup}>Sign up</button>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
