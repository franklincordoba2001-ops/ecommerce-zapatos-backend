import React from 'react'
import { ShoppingCart, Eye } from 'lucide-react'
import { getTotalStock } from '../lib/stock'
import { getImageUrl } from '../lib/api'

export default function ProductCard({ product, onViewDetails }) {
  const price = product.precio || 0
  const totalStock = getTotalStock(product)
  const isOutOfStock = totalStock <= 0
  const isLowStock = totalStock > 0 && totalStock <= 4
  const fallbackImageGradient = 'linear-gradient(135deg, rgba(255, 94, 126, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)'

  return (
    <article className="card">
      {isOutOfStock ? (
        <span className="card-badge out">Agotado</span>
      ) : isLowStock ? (
        <span className="card-badge" style={{ color: 'var(--secondary)', borderColor: 'rgba(255, 159, 67, 0.3)' }}>
          ¡Últimas {totalStock}!
        </span>
      ) : (
        <span className="card-badge">Original</span>
      )}

      <div className="card-img-container" style={{ background: fallbackImageGradient }}>
        <img
          src={getImageUrl(product.imagenUrl)}
          alt={product.nombre}
          className="card-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop'
          }}
        />
      </div>

      <div className="card-body">
        <span className="card-category">{product.categoria?.nombre || 'General'}</span>
        <h3 className="card-title">{product.nombre}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 38 }}>
          {product.descripcion || 'Un calzado chebre diseñado para ofrecer la máxima comodidad y estilo urbano en tu día a día.'}
        </p>

        {/* Vista previa de tallas disponibles */}
        {product.tallas && product.tallas.length > 0 && (
          <div className="card-sizes-row">
            {product.tallas.slice(0, 5).map((talla) => (
              <span key={talla} className="card-size-tag available">
                {talla}
              </span>
            ))}
            {product.tallas.length > 5 && (
              <span className="card-size-tag">+{product.tallas.length - 5}</span>
            )}
          </div>
        )}

        <div className="card-price-row">
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Precio</div>
            <span className="card-price">${price.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="btn-secondary"
              onClick={() => onViewDetails(product)}
              style={{ width: 38, height: 38, padding: 0 }}
              title="Ver detalles del calzado"
            >
              <Eye size={16} />
            </button>

            <button
              className="btn-primary"
              onClick={() => onViewDetails(product)}
              disabled={isOutOfStock}
              style={{ width: 38, height: 38, padding: 0 }}
              title={isOutOfStock ? 'Producto agotado' : 'Elegir talla'}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
