import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthProvider'
import { X, ShoppingBag, Plus, Minus, Trash2, CreditCard, Truck } from 'lucide-react'
import { getImageUrl } from '../lib/api'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const isOpen = cartOpen
  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0)
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)
  const getCartKey = (item) => item.cartKey || `${item.id}-${item.talla || 'N/A'}`

  const FREE_SHIPPING_THRESHOLD = 250000
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total)
  const shippingProgress = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100))

  const handleCheckout = () => {
    if (cart.length === 0) return
    setCartOpen(false)
    if (user) {
      navigate('/checkout')
    } else {
      navigate('/login?redirect=checkout')
    }
  }

  return (
    <>
      <div
        className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setCartOpen(false)}
      ></div>

      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={22} style={{ color: 'var(--primary)' }} />
            <span>Mi Carrito</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
              ({totalQty} {totalQty === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            className="cart-close"
            onClick={() => setCartOpen(false)}
            title="Cerrar carrito"
          >
            <X size={18} />
          </button>
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '16px 20px 0' }}>
            <div className="shipping-tracker">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, gap: 8 }}>
                <span style={{ fontWeight: 600, color: remainingForFreeShipping === 0 ? '#2ed573' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Truck size={14} style={{ color: remainingForFreeShipping === 0 ? '#2ed573' : 'var(--accent)' }} />
                  {remainingForFreeShipping === 0
                    ? '🎉 ¡Tienes Envío Gratis asegurado!'
                    : `Faltan $${remainingForFreeShipping.toLocaleString('es-CO')} para envío gratis`}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 700 }}>
                  {shippingProgress}%
                </span>
              </div>
              <div className="shipping-bar-bg">
                <div className="shipping-bar-fill" style={{ width: `${shippingProgress}%` }}></div>
              </div>
            </div>
          </div>
        )}

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={48} style={{ opacity: 0.15, marginBottom: 8, color: 'var(--primary)' }} />
              <h3 style={{ fontSize: 18, color: '#ffffff' }}>Tu carrito está vacío</h3>
              <p className="cart-empty-text">
                Parece que aún no has agregado ningún zapato. ¡Explora el catálogo y encuentra tu estilo!
              </p>
              <button
                className="btn-primary"
                onClick={() => setCartOpen(false)}
                style={{ marginTop: 12, padding: '8px 20px', fontSize: 13 }}
              >
                Volver al Catálogo
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={getCartKey(item)}>
                <img
                  src={getImageUrl(item.imagenUrl)}
                  alt={item.nombre}
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop'
                  }}
                />

                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.nombre}</h4>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Talla: <strong style={{ color: '#fff' }}>{item.talla || 'N/A'}</strong>
                  </div>
                  <div className="cart-item-price">
                    ${(item.precio || 0).toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                  </div>

                  <div className="cart-item-qty-row">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(getCartKey(item), -1)}
                      title="Reducir cantidad"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(getCartKey(item), 1)}
                      title="Aumentar cantidad"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(getCartKey(item))}
                  title="Eliminar del carrito"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal-row">
              <span className="cart-subtotal-label">Subtotal</span>
              <span className="cart-subtotal-val">
                ${total.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
              </span>
            </div>

            <button
              className="btn-primary"
              onClick={handleCheckout}
              style={{ width: '100%', padding: '14px', borderRadius: 12, justifyContent: 'center' }}
            >
              <CreditCard size={18} />
              <span>Finalizar Compra</span>
            </button>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-secondary)', marginTop: 10 }}>
              Garantía de cambio y envíos rápidos en toda Colombia.
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
