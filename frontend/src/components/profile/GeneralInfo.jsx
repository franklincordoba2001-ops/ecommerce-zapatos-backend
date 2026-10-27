import React from 'react'
import { Settings } from 'lucide-react'

export default function GeneralInfo({ user, displayName }) {
  if (!user) return null

  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Settings size={22} style={{ color: 'var(--primary)' }} />
        <span>Mi Información</span>
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Datos generales de registro del usuario.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 450 }}>
        <div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block' }}>Identificador de Usuario</span>
          <strong style={{ fontSize: 15, color: '#fff' }}>{user.sub ?? user.id}</strong>
        </div>

        <div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block' }}>Nombre Completo</span>
          <strong style={{ fontSize: 15, color: '#fff' }}>{displayName}</strong>
        </div>

        <div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block' }}>Correo Electrónico</span>
          <strong style={{ fontSize: 15, color: '#fff' }}>{user.email}</strong>
        </div>

        <div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block' }}>Nivel de Acceso (Rol)</span>
          <strong style={{ fontSize: 15, color: 'var(--accent)', textTransform: 'uppercase' }}>
            {user.rol || 'CLIENTE'}
          </strong>
        </div>
      </div>
    </div>
  )
}
