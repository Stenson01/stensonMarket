
import './App.css'
import MyTopAppBar from './views/home/MyTopAppBar'
import ProductList from './views/home/ProductList'
import MyBotoomAppBar from './views/home/MyBotoomAppBar'
import ProductDetail from './views/home/ProductDetail'
import CartScreen from './views/screens/CartScreen'
import CheckoutScreen from './views/screens/CheckoutScreen'
import OrderConfirmationScreen from './views/screens/OrderConfirmationScreen'
import LoginScreen from './views/screens/LoginScreen'
import SignupScreen from './views/screens/SignupScreen'
import GeneralInfoScreen from './views/screens/GeneralInfoScreen'
import { useMarketViewModel } from './viewmodels/useMarketViewModel'

export default function App() {
  const {
    screen, selectedProduct, availableProducts, cart, userName, isAuthenticated, showAuthPrompt,
    cartCount, setAvailableProducts, setShowAuthPrompt, openScreen, openProduct, goBack,
    addToCart, updateCartQuantity, logout, completeLogin, handleCheckout, handlePlaceOrder,
  } = useMarketViewModel()

  return (
    <div className="market-app">
      {screen === 'products' && !selectedProduct && <MyTopAppBar cartCount={isAuthenticated ? cartCount : 0} userName={userName} isAuthenticated={isAuthenticated} onOpenCart={() => openScreen('cart')} onOpenProfile={() => openScreen('login')} onLogout={() => { void logout() }} onOpenOrders={() => openScreen('orders')} onOpenPolicy={() => openScreen('policy')} onOpenHelp={() => openScreen('help')} />}
      <main className="market-content">
        {screen === 'cart' ? (
          <CartScreen products={availableProducts} cart={cart} onBack={goBack} onCheckout={handleCheckout} showAuthPrompt={showAuthPrompt} onLogin={() => { setShowAuthPrompt(false); openScreen('login') }} onSignup={() => { setShowAuthPrompt(false); openScreen('signup') }} onCloseAuthPrompt={() => setShowAuthPrompt(false)} onIncrease={(product) => updateCartQuantity(product, 1)} onDecrease={(product) => updateCartQuantity(product, -1)} onRemove={(product) => updateCartQuantity(product, -cart[product.name])} />
        ) : screen === 'checkout' ? (
          <CheckoutScreen products={availableProducts} cart={cart} onBack={goBack} onPlaceOrder={() => { void handlePlaceOrder() }} />
        ) : screen === 'order-confirmation' ? (
          <OrderConfirmationScreen onContinueShopping={() => openScreen('products')} />
        ) : screen === 'orders' ? (
          <GeneralInfoScreen title="Your orders" eyebrow="Order history" description="Your completed and current orders will appear here." onBack={goBack} />
        ) : screen === 'policy' ? (
          <GeneralInfoScreen title="Delivery policy" eyebrow="Good to know" description="We carefully pack every order and deliver it during your selected delivery window." onBack={goBack} />
        ) : screen === 'help' ? (
          <GeneralInfoScreen title="Help & support" eyebrow="We are here to help" description="For help with an order, contact our team at support@stensonmarket.com." onBack={goBack} />
        ) : screen === 'login' ? (
          <LoginScreen onBack={goBack} onSignup={() => openScreen('signup')} onLogin={completeLogin} />
        ) : screen === 'signup' ? (
          <SignupScreen onBack={goBack} onLogin={() => openScreen('login')} onSignup={completeLogin} />
        ) : selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={goBack}
            onSelectProduct={openProduct}
            onAddToCart={addToCart}
            quantity={cart[selectedProduct.name] ?? 0}
            onUpdateQuantity={updateCartQuantity}
            onOpenCart={() => openScreen('cart')}
          />
        ) : (
          <ProductList onSelectProduct={openProduct} onAddToCart={addToCart} onProductsLoaded={setAvailableProducts} />
        )}
      </main>
      {screen !== 'login' && screen !== 'signup' && <MyBotoomAppBar />}
    </div>
  );
}
