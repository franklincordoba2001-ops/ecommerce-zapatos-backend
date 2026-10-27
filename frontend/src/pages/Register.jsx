import React, { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import api from '../lib/api'
import { useToast } from '../context/ToastContext'
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()

  const redirectUrl = searchParams.get('redirect')

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.nombre.trim()) {
      setError('El nombre completo es obligatorio')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email.trim())) {
      setError('Por favor ingresa un correo electrónico válido')
      return
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      await api.post('/usuarios', form)
      showToast('¡Registro completado! Ya puedes iniciar sesión.', 'success')
      navigate('/login')
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error al crear la cuenta'
      setError(errMsg)
      showToast(errMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      {/* Decorative background blobs */}
      <div className="auth-bg-blob-1" style={{ background: 'radial-gradient(circle, rgba(0, 242, 254, 0.2) 0%, transparent 70%)' }}></div>
      <div className="auth-bg-blob-2" style={{ background: 'radial-gradient(circle, rgba(255, 159, 67, 0.15) 0%, transparent 70%)' }}></div>

      <div className="auth-card">
        <h2 className="auth-title">Crear Cuenta</h2>
        <p className="auth-subtitle">Regístrate en pocos segundos y comienza a calzar con onda</p>

        {error && (
          <div className="form-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name field */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">
              Nombre Completo
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-name"
                type="text"
                className="form-input"
                placeholder="Juan Pérez"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                style={{ paddingLeft: 44 }}
              />
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)',
                }}
              />
            </div>
          </div>

          {/* Email field */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Correo Electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-email"
                type="email"
                className="form-input"
                placeholder="ejemplo@correo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{ paddingLeft: 44 }}
              />
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)',
                }}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="form-group" style={{ marginBottom: 28 }}>
            <label className="form-label" htmlFor="register-password">
              Contraseña Segura
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-password"
                type="password"
                className="form-input"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={{ paddingLeft: 44 }}
              />
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)',
                }}
              />
            </div>
          </div>

          {/* Register Submit Button */}
          <button
            id="register-submit-btn"
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', borderRadius: 12, justifyContent: 'center' }}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Registrarme Gratis</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya eres miembro?{' '}
          <Link to={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'} className="auth-link">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  )
}
