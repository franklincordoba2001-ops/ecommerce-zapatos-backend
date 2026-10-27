import React, { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { useToast } from '../context/ToastContext'
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, Footprints } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  
  const auth = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()

  const redirectUrl = searchParams.get('redirect') || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await auth.login(email, password)
      showToast('¡Sesión iniciada con éxito! Bienvenido.', 'success')
      navigate(redirectUrl)
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Credenciales inválidas'
      setError(errMsg)
      showToast(errMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      {/* Decorative Neon Blobs */}
      <div className="auth-bg-blob-1"></div>
      <div className="auth-bg-blob-2"></div>

      {/* Main Glassmorphic Form Card */}
      <div className="auth-card" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
        {/* Animated Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            boxShadow: '0 0 40px var(--primary-glow)',
            marginBottom: 16,
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <Footprints size={40} style={{ color: '#fff' }} />
          </div>
          <h2 className="auth-title" style={{ fontSize: 32, marginBottom: 4 }}>AbbySport</h2>
          <p className="auth-subtitle">Ingresa tus credenciales para explorar el catálogo más exclusivo</p>
        </div>

        {/* Beautiful Error Alert Box */}
        {error && (
          <div className="form-error" style={{ animation: 'shake 0.5s ease-in-out' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email input field with floating label */}
          <div className="form-group">
            <div style={{ position: 'relative' }}>
              <input
                id="email-input"
                type="email"
                className="form-input"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                style={{ paddingLeft: 44, paddingTop: 20, paddingBottom: 8 }}
              />
              <label 
                htmlFor="email-input"
                style={{
                  position: 'absolute',
                  left: 44,
                  top: email || focusedField === 'email' ? '4px' : '50%',
                  transform: email || focusedField === 'email' ? 'translateY(0)' : 'translateY(-50%)',
                  fontSize: email || focusedField === 'email' ? '11px' : '15px',
                  color: email || focusedField === 'email' ? 'var(--primary)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  pointerEvents: 'none',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
              >
                Correo Electrónico
              </label>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: focusedField === 'email' ? 'var(--primary)' : 'var(--text-secondary)',
                  transition: 'color 0.2s ease'
                }}
              />
            </div>
          </div>

          {/* Password input field with show/hide toggle */}
          <div className="form-group" style={{ marginBottom: 28 }}>
            <div style={{ position: 'relative' }}>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                style={{ paddingLeft: 44, paddingRight: 44, paddingTop: 20, paddingBottom: 8 }}
              />
              <label 
                htmlFor="password-input"
                style={{
                  position: 'absolute',
                  left: 44,
                  top: password || focusedField === 'password' ? '4px' : '50%',
                  transform: password || focusedField === 'password' ? 'translateY(0)' : 'translateY(-50%)',
                  fontSize: password || focusedField === 'password' ? '11px' : '15px',
                  color: password || focusedField === 'password' ? 'var(--primary)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  pointerEvents: 'none',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
              >
                Contraseña
              </label>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: focusedField === 'password' ? 'var(--primary)' : 'var(--text-secondary)',
                  transition: 'color 0.2s ease'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: focusedField === 'password' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: 4,
                  transition: 'color 0.2s ease'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button with enhanced glow effect */}
          <button
            id="login-submit-btn"
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '16px', 
              borderRadius: 12, 
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
              background: loading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              boxShadow: loading ? 'none' : '0 8px 25px var(--primary-glow)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 12px 35px rgba(255, 94, 126, 0.6)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 8px 25px var(--primary-glow)'
              }
            }}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <LogIn size={20} />
                <span>Ingresar a mi Cuenta</span>
              </>
            )}
          </button>
        </form>

        {/* Footer toggler links */}
        <div className="auth-footer" style={{ marginTop: 28 }}>
          ¿No tienes una cuenta aún?{' '}
          <Link to="/register" className="auth-link" style={{ fontWeight: 700 }}>
            Crea una cuenta aquí
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 40px var(--primary-glow);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 60px var(--primary-glow);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  )
}
