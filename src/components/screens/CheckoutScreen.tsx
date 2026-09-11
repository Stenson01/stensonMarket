import { products, type Product } from '../../data/products'
import { useState } from 'react'

type CheckoutScreenProps = {
  cart: Record<string, number>
  onBack: () => void
  onPlaceOrder: () => void
}

export default function CheckoutScreen({ cart, onBack, onPlaceOrder }: CheckoutScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'moncash'>('card')
  const items = products.filter((product) => cart[product.name])
  const subtotal = items.reduce((sum, product) => sum + Number.parseFloat(product.price.slice(1)) * cart[product.name], 0)
  const handling = 2.5
  const shipping = 5
  const total = subtotal + handling + shipping

  return (
    <section className="checkout-screen" aria-labelledby="checkout-title">
      <button className="back-button" type="button" onClick={onBack}><span aria-hidden="true">&#8592;</span> Back to cart</button>
      <div className="checkout-layout">
        <div className="checkout-panel">
          <p className="eyebrow">Almost there</p>
          <h1 id="checkout-title">Checkout</h1>
          <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); onPlaceOrder() }}>
            <h2>Delivery details</h2>
            <label>Full name<input type="text" placeholder="Your name" required /></label>
            <label>Address<input type="text" placeholder="Street address" required /></label>
            <div className="checkout-fields">
              <label>City<input type="text" placeholder="City" required /></label>
              <label>Postal code<input type="text" placeholder="Postal code" required /></label>
            </div>
            <h2>Payment</h2>
            <div className="payment-options" role="group" aria-label="Payment method">
              <label className={`payment-option${paymentMethod === 'card' ? ' selected' : ''}`}>
                <input type="radio" name="payment-method" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <span>Card</span>
              </label>
              <label className={`payment-option${paymentMethod === 'moncash' ? ' selected' : ''}`}>
                <input type="radio" name="payment-method" value="moncash" checked={paymentMethod === 'moncash'} onChange={() => setPaymentMethod('moncash')} />
                <span>MonCash</span>
              </label>
            </div>
            {paymentMethod === 'card' ? (
              <>
                <label>Card number<input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456" required /></label>
                <div className="checkout-fields">
                  <label>Expiry date<input type="text" placeholder="MM / YY" required /></label>
                  <label>CVV<input type="text" inputMode="numeric" placeholder="123" required /></label>
                </div>
              </>
            ) : (
              <label>MonCash phone number<input type="tel" placeholder="509 0000 0000" required /></label>
            )}
            <button className="checkout-button" type="submit">Place order</button>
          </form>
        </div>
        <aside className="checkout-order">
          <p className="eyebrow">Your order</p>
          <h2>Order summary</h2>
          {items.map((product: Product) => (
            <div className="checkout-order-item" key={product.name}>
              <span>{product.name} x {cart[product.name]}</span>
              <strong>${(Number.parseFloat(product.price.slice(1)) * cart[product.name]).toFixed(2)}</strong>
            </div>
          ))}
          <hr />
          <div className="checkout-order-item"><span>Handling</span><strong>${handling.toFixed(2)}</strong></div>
          <div className="checkout-order-item"><span>Shipping</span><strong>${shipping.toFixed(2)}</strong></div>
          <hr />
          <div className="checkout-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
        </aside>
      </div>
    </section>
  )
}
