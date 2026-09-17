import { useEffect, useState } from 'react'
import { products, type Product } from '../models/Product'
import { supabaseService } from '../services/SupabaseService'

export type Screen = 'products' | 'cart' | 'checkout' | 'order-confirmation' | 'login' | 'signup' | 'orders' | 'policy' | 'help'
type NavigationState = { screen: Screen; productId?: string }

type Cart = Record<string, number>

export function useMarketViewModel() {
  const [screen, setScreen] = useState<Screen>('products')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [availableProducts, setAvailableProducts] = useState<Product[]>(products)
  const [cart, setCart] = useState<Cart>({})
  const [isCartLoaded, setIsCartLoaded] = useState(false)
  const [userName, setUserName] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  const loadCart = async (userId: string) => {
    setIsCartLoaded(false)
    const { data } = await supabaseService.getCart(userId)
    setCart(data ? Object.fromEntries(data.map((item) => [item.product_name, item.quantity])) : {})
    setIsCartLoaded(true)
  }

  const refreshCart = async () => {
    const { user } = await supabaseService.getCurrentUser()
    if (user) await loadCart(user.id)
  }

  useEffect(() => {
    window.history.replaceState({ screen: 'products' } satisfies NavigationState, '')

    const restoreSession = async () => {
      const { user } = await supabaseService.getCurrentUser()
      if (!user) return

      setIsAuthenticated(true)
      setUserName(user.user_metadata?.name ?? user.email?.split('@')[0] ?? '')
      await loadCart(user.id)
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
      if (nextState.screen === 'cart') void refreshCart()
      setSelectedProduct(nextState.productId ? products.find((product) => product.id === nextState.productId) ?? null : null)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const openScreen = (nextScreen: Screen) => {
    setSelectedProduct(null)
    setScreen(nextScreen)
    if (nextScreen === 'cart') void refreshCart()
    window.history.pushState({ screen: nextScreen } satisfies NavigationState, '')
  }

  const openProduct = (product: Product) => {
    setSelectedProduct(product)
    if (product.id) {
      window.history.pushState({ screen: 'products', productId: product.id } satisfies NavigationState, '')
    }
  }

  const addToCart = async (product: Product, quantity = 1) => {
    const { user } = await supabaseService.getCurrentUser()
    const cartQuantity = cart[product.name] ?? 0
    const quantityToSave = cartQuantity > 0 ? cartQuantity : quantity

    if (!user) {
      setCart((currentCart) => ({ ...currentCart, [product.name]: currentCart[product.name] ?? quantityToSave }))
      setIsCartLoaded(true)
      return
    }

    await supabaseService.saveCartItem(user.id, product.name, quantityToSave)
    await loadCart(user.id)
  }

  const updateCartQuantity = async (product: Product, change: number) => {
    const nextQuantity = (cart[product.name] ?? 0) + change
    if (nextQuantity < 0) return

    const { user } = await supabaseService.getCurrentUser()
    if (!user) {
      setCart((currentCart) => {
        if (nextQuantity === 0) {
          const nextCart = { ...currentCart }
          delete nextCart[product.name]
          return nextCart
        }
        return { ...currentCart, [product.name]: nextQuantity }
      })
      setIsCartLoaded(true)
      return
    }

    if (nextQuantity > 0) {
      await supabaseService.saveCartItem(user.id, product.name, nextQuantity)
    } else {
      await supabaseService.removeCartItem(user.id, product.name)
    }
    await loadCart(user.id)
  }

  const logout = async () => {
    await supabaseService.signOut()
    setIsAuthenticated(false)
    setUserName('')
    setCart({})
    setIsCartLoaded(false)
  }

  const completeLogin = (name: string) => {
    setUserName(name)
    setIsAuthenticated(true)
    void supabaseService.getCurrentUser().then(({ user }) => user && loadCart(user.id))
    openScreen('products')
  }

  const goBack = () => window.history.back()
  const cartCount = isCartLoaded ? Object.values(cart).reduce((total, quantity) => total + quantity, 0) : 0

  const handleCheckout = async () => {
    const { user } = await supabaseService.getCurrentUser()
    if (!user) {
      setShowAuthPrompt(true)
      return
    }
    openScreen('checkout')
  }

  const handlePlaceOrder = async () => {
    openScreen('order-confirmation')
    await refreshCart()
  }

  return {
    screen,
    selectedProduct,
    availableProducts,
    cart,
    userName,
    isAuthenticated,
    showAuthPrompt,
    cartCount,
    setAvailableProducts,
    setShowAuthPrompt,
    openScreen,
    openProduct,
    goBack,
    addToCart,
    updateCartQuantity,
    logout,
    completeLogin,
    handleCheckout,
    handlePlaceOrder,
  }
}
