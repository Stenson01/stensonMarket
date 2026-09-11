
import './App.css'
import MyTopAppBar from './components/homescreenComponents/MyTopAppBar'
import ProductList from './components/homescreenComponents/ProductList'
import MyBotoomAppBar from './components/homescreenComponents/MyBotoomAppBar'
import ProductDetail from './components/homescreenComponents/ProductDetail'
import CartScreen from './components/screens/CartScreen'
import CheckoutScreen from './components/screens/CheckoutScreen'
import OrderConfirmationScreen from './components/screens/OrderConfirmationScreen'
import LoginScreen from './components/screens/LoginScreen'
import SignupScreen from './components/screens/SignupScreen'
import GeneralInfoScreen from './components/screens/GeneralInfoScreen'
import { supabaseService } from './supabase/SupabaseService'
import { products, type Product } from './data/products'
import { useEffect, useState } from 'react'

type Screen = 'products' | 'cart' | 'checkout' | 'order-confirmation' | 'login' | 'signup' | 'orders' | 'policy' | 'help'
type NavigationState = { screen: Screen; productId?: string }

export default function App() {
  const [screen, setScreen] = useState<Screen>('products')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<Record<string, number>>({})
  const [userName, setUserName] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  useEffect(() => {
    window.history.replaceState({ screen: 'products' } satisfies NavigationState, '')

    const restoreSession = async () => {
      const { user } = await supabaseService.getCurrentUser()
      if (!user) return

      setIsAuthenticated(true)
      setUserName(user.user_metadata?.name ?? user.email?.split('@')[0] ?? '')
    }

    void restoreSession()

    const handlePopState = (event: PopStateEvent) => {
      const nextState = event.state as NavigationState | null
      if (!nextState) {
        setSelectedProduct(null)
        setScreen('products')
        return
      }

      setScreen(nextState.screen)
      setSelectedProduct(nextState.productId ? products.find((product) => product.id === nextState.productId) ?? null : null)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const addToCart = (product: Product, quantity = 1) => {
    setCart((currentCart) => ({ ...currentCart, [product.name]: (currentCart[product.name] ?? 0) + quantity }))
  }
  const updateCartQuantity = (product: Product, change: number) => {
    setCart((currentCart) => {
      const nextQuantity = (currentCart[product.name] ?? 0) + change
      if (nextQuantity <= 0) {
        const nextCart = { ...currentCart }
        delete nextCart[product.name]
        return nextCart
      }
      return { ...currentCart, [product.name]: nextQuantity }
    })
  }
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  const openScreen = (nextScreen: Screen) => {
    setSelectedProduct(null)
    setScreen(nextScreen)
    window.history.pushState({ screen: nextScreen } satisfies NavigationState, '')
  }
  const openProduct = (product: Product) => {
    setSelectedProduct(product)
    if (product.id) {
      window.history.pushState({ screen: 'products', productId: product.id } satisfies NavigationState, '')
    }
  }
  const goBack = () => {
    window.history.back()
  }
  const handleCheckout = async () => {
    const { user } = await supabaseService.getCurrentUser()
    if (!user) {
      setShowAuthPrompt(true)
      return
    }
    openScreen('checkout')
  }

  return (
    <div className="market-app">
      {screen === 'products' && !selectedProduct && <MyTopAppBar cartCount={cartCount} userName={userName} isAuthenticated={isAuthenticated} onOpenCart={() => openScreen('cart')} onOpenProfile={() => openScreen('login')} onLogout={async () => { await supabaseService.signOut(); setIsAuthenticated(false); setUserName('') }} onOpenOrders={() => openScreen('orders')} onOpenPolicy={() => openScreen('policy')} onOpenHelp={() => openScreen('help')} />}
      <main className="market-content">
        {screen === 'cart' ? (
          <CartScreen cart={cart} onBack={goBack} onCheckout={handleCheckout} showAuthPrompt={showAuthPrompt} onLogin={() => { setShowAuthPrompt(false); openScreen('login') }} onSignup={() => { setShowAuthPrompt(false); openScreen('signup') }} onCloseAuthPrompt={() => setShowAuthPrompt(false)} onIncrease={(product) => updateCartQuantity(product, 1)} onDecrease={(product) => updateCartQuantity(product, -1)} onRemove={(product) => setCart((currentCart) => { const nextCart = { ...currentCart }; delete nextCart[product.name]; return nextCart })} />
        ) : screen === 'checkout' ? (
          <CheckoutScreen cart={cart} onBack={goBack} onPlaceOrder={() => openScreen('order-confirmation')} />
        ) : screen === 'order-confirmation' ? (
          <OrderConfirmationScreen onContinueShopping={() => openScreen('products')} />
        ) : screen === 'orders' ? (
          <GeneralInfoScreen title="Your orders" eyebrow="Order history" description="Your completed and current orders will appear here." onBack={goBack} />
        ) : screen === 'policy' ? (
          <GeneralInfoScreen title="Delivery policy" eyebrow="Good to know" description="We carefully pack every order and deliver it during your selected delivery window." onBack={goBack} />
        ) : screen === 'help' ? (
          <GeneralInfoScreen title="Help & support" eyebrow="We are here to help" description="For help with an order, contact our team at support@stensonmarket.com." onBack={goBack} />
        ) : screen === 'login' ? (
          <LoginScreen onBack={goBack} onSignup={() => openScreen('signup')} onLogin={(name) => { setUserName(name); setIsAuthenticated(true); openScreen('products') }} />
        ) : screen === 'signup' ? (
          <SignupScreen onBack={goBack} onLogin={() => openScreen('login')} onSignup={(name) => { setUserName(name); setIsAuthenticated(true); openScreen('products') }} />
        ) : selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={goBack}
            onSelectProduct={openProduct}
            onAddToCart={addToCart}
            onOpenCart={() => openScreen('cart')}
          />
        ) : (
          <ProductList onSelectProduct={openProduct} onAddToCart={addToCart} />
        )}
      </main>
      {screen !== 'login' && screen !== 'signup' && <MyBotoomAppBar />}
    </div>
  );
}
