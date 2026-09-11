type OrderConfirmationScreenProps = {
  onContinueShopping: () => void
}

export default function OrderConfirmationScreen({ onContinueShopping }: OrderConfirmationScreenProps) {
  return (
    <section className="confirmation-screen" aria-labelledby="confirmation-title">
      <div className="confirmation-mark" aria-hidden="true">&#10003;</div>
      <p className="eyebrow">Order confirmed</p>
      <h1 id="confirmation-title">Thank you for your order</h1>
      <p>Your order has been received and is being prepared. We will keep you updated on its progress.</p>
      <button className="add-to-cart" type="button" onClick={onContinueShopping}>Continue shopping</button>
    </section>
  )
}
