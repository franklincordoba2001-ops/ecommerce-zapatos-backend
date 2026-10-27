import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from './ToastContext'
import { useAuth } from './AuthProvider'
import api from '../lib/api'
import { getStockForSize } from '../lib/stock'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { showToast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const savedCart = localStorage.getItem('abbysport_cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        setCart(
          Array.isArray(parsed)
            ? parsed.map((item) => ({
                ...item,
                cartKey: item.cartKey || `${item.id}-${item.talla || 'N/A'}`,
              }))
            : []
        )
      } catch (e) {
        setCart([])
      }
    }
  }, [])

  const saveCart = (newCart) => {
    setCart(newCart)
    localStorage.setItem('abbysport_cart', JSON.stringify(newCart))
  }

  const fetchOrders = async () => {
    if (!user) {
      setOrders([])
      return
    }

    setLoadingOrders(true)
    try {
      const res = await api.get('/ordenes/mis-compras')
      setOrders(res.data || [])
    } catch (err) {
      console.error('Error al cargar historial de compras:', err)
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [user])

  const addToCart = (product, selectedSize) => {
    const availableSizes = Array.isArray(product.tallas) ? product.tallas : []
    const talla = typeof selectedSize === 'string' ? selectedSize.trim() : ''

    if (availableSizes.length === 0) {
      showToast('Este calzado no tiene tallas configuradas', 'error')
      return
    }

    if (!talla) {
      showToast('Selecciona una talla antes de agregar al carrito', 'error')
      return
    }

    if (!availableSizes.includes(talla)) {
      showToast(`La talla ${talla} no está disponible para ${product.nombre}`, 'error')
      return
    }

    if (getStockForSize(product, talla) <= 0) {
      showToast(`La talla ${talla} está agotada para ${product.nombre}`, 'error')
      return
    }

    const cartKey = `${product.id}-${talla}`
    const existing = cart.find((item) => item.cartKey === cartKey)
    const sizeStock = getStockForSize(product, talla)

    if (existing) {
      if (existing.quantity >= sizeStock) {
        showToast(`No hay suficiente stock en talla ${talla} para ${product.nombre}`, 'error')
        return
      }

      saveCart(
        cart.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1, sizeStock } : item
        )
      )
    } else {
      saveCart([...cart, { ...product, cartKey, talla, quantity: 1, sizeStock }])
    }

    showToast(`¡${product.nombre} talla ${talla} agregado al carrito!`, 'success')
  }

  const removeFromCart = (cartKey) => {
    const item = cart.find((i) => i.cartKey === cartKey)
    saveCart(cart.filter((i) => i.cartKey !== cartKey))
    if (item) {
      showToast(`${item.nombre} eliminado del carrito`, 'info')
    }
  }

  const updateQuantity = (cartKey, amount) => {
    const item = cart.find((i) => i.cartKey === cartKey)
    if (!item) return

    const newQty = item.quantity + amount
    if (newQty <= 0) {
      removeFromCart(cartKey)
      return
    }

    const maxStock = item.sizeStock ?? getStockForSize(item, item.talla)
    if (newQty > maxStock) {
      showToast(`Límite de stock alcanzado para ${item.nombre} talla ${item.talla}`, 'error')
      return
    }

    saveCart(
      cart.map((i) =>
        i.cartKey === cartKey ? { ...i, quantity: newQty } : i
      )
    )
  }

  const clearCart = () => {
    saveCart([])
  }

  const checkout = async (shippingData) => {
    if (cart.length === 0) return false

    try {
      const payload = {
        detalles: cart.map((item) => ({
          zapatoId: item.id,
          cantidad: item.quantity,
          talla: item.talla,
        })),
        direccionEnvio: shippingData?.direccionEnvio || 'No especificada',
        ciudad: shippingData?.ciudad || 'No especificada',
        telefono: shippingData?.telefono || 'No especificado',
        metodoPago: shippingData?.metodoPago || 'EFECTIVO',
      }

      await api.post('/ordenes', payload)
      await fetchOrders()

      clearCart()
      showToast('¡Compra realizada con éxito! Su pedido ha sido registrado.', 'success')
      return true
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error al procesar la compra'
      showToast(errMsg, 'error')
      console.error(err)
      return false
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        loadingOrders,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        fetchOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
