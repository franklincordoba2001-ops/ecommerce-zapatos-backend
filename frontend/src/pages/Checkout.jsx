import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import CartDrawer from '../components/CartDrawer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthProvider'
import { useToast } from '../context/ToastContext'
import { ArrowLeft, ShoppingBag, Truck, CreditCard, MapPin, Phone, Building, ShieldCheck } from 'lucide-react'

export default function Checkout() {
  const { cart, checkout } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    direccionEnvio: '',
    ciudad: '',
    telefono: '',
    metodoPago: 'EFECTIVO'
  })
  const [loading, setLoading] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0)
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (cart.length === 0) {
    return (
      <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main className="container" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', maxWidth: 500, width: '100%' }}>
            <ShoppingBag size={64} style={{ opacity: 0.15, marginBottom: 16, color: 'var(--primary)' }} />
            <h2 style={{ fontSize: 24, marginBottom: 12, color: '#fff' }}>Tu carrito está vacío</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15 }}>
              No hay calzado en tu carrito para finalizar la compra. Por favor, selecciona tus estilos favoritos primero.
            </p>
            <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              Volver al Catálogo
            </Link>
          </div>
        </main>
        <CartDrawer />
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.direccionEnvio || !form.ciudad || !form.telefono) {
      showToast('Por favor completa todos los campos de entrega', 'error')
      return
    }

    setLoading(true)
    try {
      const success = await checkout(form)
      if (success) {
        navigate('/profile')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flexGrow: 1, padding: '32px 16px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: 24 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
            <ArrowLeft size={16} />
            <span>Volver al Catálogo</span>
          </Link>
        </div>

        <h1 className="title" style={{ fontSize: 36, marginBottom: 8, textAlign: 'left' }}>Finalizar Compra</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Completa tus datos de entrega para procesar tu pedido de calzado AbbySport.</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
          {/* Form Column */}
          <div style={{ flex: '2 1 550px' }}>
            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Truck size={22} style={{ color: 'var(--primary)' }} />
                <span>Datos de Envío</span>
              </h2>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                  <label className="form-label" htmlFor="checkout-city">Ciudad de Destino</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="checkout-city"
                      type="text"
                      className="form-input"
                      placeholder="Bogotá, Medellín, Cali..."
                      value={form.ciudad}
                      onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                      required
                      style={{ paddingLeft: 44 }}
                    />
                    <Building size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  </div>
                </div>

                <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                  <label className="form-label" htmlFor="checkout-phone">Teléfono de Contacto</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="checkout-phone"
                      type="tel"
                      className="form-input"
                      placeholder="Ej. 3123456789"
                      value={form.telefono}
                      onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      required
                      style={{ paddingLeft: 44 }}
                    />
                    <Phone size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="checkout-address">Dirección Completa de Entrega</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="checkout-address"
                    type="text"
                    className="form-input"
                    placeholder="Calle, Carrera, Transversal, Nro Apto/Casa, Barrio..."
                    value={form.direccionEnvio}
                    onChange={(e) => setForm({ ...form, direccionEnvio: e.target.value })}
                    required
                    style={{ paddingLeft: 44 }}
                  />
                  <MapPin size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12, marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <CreditCard size={22} style={{ color: 'var(--secondary)' }} />
                <span>Método de Pago</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                {[
                  { id: 'EFECTIVO', name: 'Contra Entrega', desc: 'Paga en efectivo al recibir' },
                  { id: 'TRANSFERENCIA', name: 'Nequi / Daviplata', desc: 'Transferencia directa' },
                  { id: 'TARJETA', name: 'Tarjeta (Simulado)', desc: 'Paga de forma simulada' }
                ].map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setForm({ ...form, metodoPago: option.id })}
                    style={{
                      background: form.metodoPago === option.id ? 'rgba(255, 94, 126, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: form.metodoPago === option.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{option.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{option.desc}</span>
                  </div>
                ))}
              </div>

              <button
                id="checkout-confirm-btn"
                className="btn-primary"
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '16px', borderRadius: 12, marginTop: 16, fontSize: 16, fontWeight: 700 }}
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    <span>Confirmar y Realizar Pedido (${total.toLocaleString('es-CO')})</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Summary Column */}
          <div style={{ flex: '1 1 300px' }}>
            <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingBag size={22} style={{ color: 'var(--accent)' }} />
                <span>Resumen de Pedido</span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
                {cart.map((item) => (
                  <div key={`${item.id}-${item.talla || 'N/A'}`} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img
                      src={item.imagenUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop'}
                      alt={item.nombre}
                      style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--glass-border)' }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#fff', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.nombre}
                      </h4>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                        Talla: {item.talla || 'N/A'} · Cantidad: {item.quantity}
                      </span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      ${(item.precio * item.quantity).toLocaleString('es-CO')}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>Cantidad de Artículos</span>
                  <span>{totalQty}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>Costo de Envío</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>GRATIS</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--accent)' }}>${total.toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CartDrawer />
    </div>
  )
}
