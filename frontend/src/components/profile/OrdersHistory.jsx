import React from 'react'
import { ClipboardList, Package } from 'lucide-react'

export default function OrdersHistory({ orders = [] }) {
  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <ClipboardList size={22} style={{ color: 'var(--primary)' }} />
        <span>Mi Historial de Compras</span>
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Revisa el estado de tus compras anteriores y detalles de facturación.
      </p>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
          <Package size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
          <p style={{ fontWeight: 500, color: '#fff' }}>No has realizado ninguna compra todavía</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>
            ¡Explora nuestro catálogo y realiza tu primer pedido!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '20px',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Header de la orden */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Pedido ID</div>
                  <span style={{ fontWeight: 700, color: '#fff' }}>#CH-{order.id}</span>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Fecha</div>
                  <span style={{ fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString('es-CO')}</span>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Total</div>
                  <span style={{ fontWeight: 800, color: 'var(--accent)' }}>
                    ${order.total.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Estado</div>
                  <span
                    style={{
                      background:
                        order.estado === 'PENDIENTE' ? 'rgba(255, 159, 67, 0.15)' :
                        order.estado === 'PAGADO' ? 'rgba(46, 213, 115, 0.15)' :
                        order.estado === 'ENVIADO' ? 'rgba(52, 152, 219, 0.15)' :
                        order.estado === 'ENTREGADO' ? 'rgba(39, 174, 96, 0.15)' :
                        'rgba(255, 71, 87, 0.15)',
                      color:
                        order.estado === 'PENDIENTE' ? 'var(--secondary)' :
                        order.estado === 'PAGADO' ? '#2ed573' :
                        order.estado === 'ENVIADO' ? '#3498db' :
                        order.estado === 'ENTREGADO' ? '#27ae60' :
                        '#ff4757',
                      padding: '2px 8px',
                      borderRadius: 30,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {order.estado}
                  </span>
                </div>
              </div>

              {/* Detalle de calzados */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                  Artículos
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {order.detalles?.map((det, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, alignItems: 'center' }}>
                      <div style={{ color: '#fff', fontWeight: 500 }}>
                        {det.zapato?.nombre} <span style={{ color: 'var(--text-secondary)' }}>Talla {det.talla} · x{det.cantidad}</span>
                      </div>
                      <div style={{ fontWeight: 600 }}>
                        ${(det.precio * det.cantidad).toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información de entrega */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 12 }}>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', marginBottom: 2 }}>Dirección</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{order.direccionEnvio || 'No especificada'} ({order.ciudad || 'No especificada'})</span>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', marginBottom: 2 }}>Teléfono</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{order.telefono || 'No especificado'}</span>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', marginBottom: 2 }}>Método de Pago</span>
                  <span style={{ color: '#fff', fontWeight: 500, textTransform: 'uppercase' }}>{order.metodoPago || 'EFECTIVO'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
