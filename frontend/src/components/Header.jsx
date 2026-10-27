import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { useCart } from '../context/CartContext'
import { ShoppingBag, User, LogOut, Footprints } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const { cart, cartOpen, setCartOpen } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  const displayName = user?.nombre || user?.email?.split('@')[0] || 'Usuario'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Glowing Brand Logo */}
        <Link to="/" className="logo-container">
          <Footprints size={28} className="logo-icon" style={{ color: 'var(--primary)' }} />
          <span className="logo-text">AbbySport</span>
        </Link>

        {/* Dynamic Navigation Menu */}
        <nav className="nav-menu">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Catálogo
          </Link>
          {user && (
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
              Mi Perfil
            </Link>
          )}
        </nav>

        {/* User Session & Shopping Cart Actions */}
        <div className="user-actions">
          {/* Shopping Cart Trigger */}
          <button 
            className="cart-trigger" 
            onClick={() => setCartOpen(!cartOpen)}
            title="Ver Carrito de Compras"
          >
            <ShoppingBag size={20} />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </button>

          {/* User Profile Info / Logout or Login Actions */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <div className="profile-avatar" style={{ width: 38, height: 38, fontSize: 14 }}>
                  {displayName.substring(0, 2).toUpperCase()}
                </div>
              </Link>
              <button 
                className="btn-secondary" 
                onClick={handleLogout} 
                style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
                title="Cerrar Sesión"
              >
                <LogOut size={16} />
                <span style={{ fontSize: 13, fontWeight: 600 }} className="hide-mobile">Salir</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: 13 }}>
                Ingresar
              </Link>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: 13 }}>
                Registro
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
