import React from 'react'
import { Package, Edit2, Trash2 } from 'lucide-react'
import { getTotalStock } from '../../lib/stock'

export default function AdminManageShoesTab({
  shoes = [],
  loadingShoes = false,
  handleEditShoe,
  handleDeleteShoe,
}) {
  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Package size={22} style={{ color: 'var(--primary)' }} />
        <span>Gestionar Catálogo de Calzado</span>
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Edita o elimina calzados existentes en el catálogo.
      </p>

      {loadingShoes ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
          <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 16px' }}></div>
          <p>Cargando calzados...</p>
        </div>
      ) : shoes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
          <Package size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
          <p style={{ fontWeight: 500, color: '#fff' }}>No hay calzados en el catálogo</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>
            Agrega tu primer calzado usando la pestaña "Agregar Calzado"
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {shoes.map((shoe) => (
            <div
              key={shoe.id}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Shoe image */}
              {shoe.imagenUrl ? (
                <img
                  src={shoe.imagenUrl}
                  alt={shoe.nombre}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Package size={32} style={{ opacity: 0.3 }} />
                </div>
              )}

              {/* Shoe details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>
                  {shoe.nombre}
                </h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 8px' }}>
                  {shoe.descripcion || 'Sin descripción'}
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Categoría: </span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{shoe.categoria?.nombre || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Precio: </span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                      ${shoe.precio.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Stock total: </span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{getTotalStock(shoe)}</span>
                  </div>
                  {shoe.stockPorTalla && Object.keys(shoe.stockPorTalla).length > 0 && (
                    <div style={{ width: '100%', marginTop: 4 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Por talla: </span>
                      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                        {Object.entries(shoe.stockPorTalla).map(([talla, qty]) => `${talla}: ${qty}`).join(' · ')}
                      </span>
                    </div>
                  )}
                  {shoe.tallas && shoe.tallas.length > 0 && (
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Tallas: </span>
                      <span style={{ color: '#fff', fontWeight: 500 }}>{shoe.tallas.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleEditShoe(shoe)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    background: 'rgba(0, 242, 254, 0.1)',
                    color: 'var(--accent)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(0, 242, 254, 0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(0, 242, 254, 0.1)'}
                >
                  <Edit2 size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteShoe(shoe.id)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 71, 87, 0.3)',
                    background: 'rgba(255, 71, 87, 0.1)',
                    color: '#ff4757',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 71, 87, 0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255, 71, 87, 0.1)'}
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
