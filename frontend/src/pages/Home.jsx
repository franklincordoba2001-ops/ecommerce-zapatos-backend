import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import CartDrawer from '../components/CartDrawer'
import api from '../lib/api'
import { useCart } from '../context/CartContext'
import { getStockForSize, getTotalStock } from '../lib/stock'
import { Search, SlidersHorizontal, ArrowUpDown, X, Star, ShieldCheck, Truck, ShoppingCart, Check } from 'lucide-react'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sortBy, setSortBy] = useState('newest') // newest, price-asc, price-desc, name-asc
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState(null) // For the detailed modal
  const [selectedSize, setSelectedSize] = useState('')
  const [addedJustNow, setAddedJustNow] = useState(false)
  const { addToCart, setCartOpen } = useCart()

  const LIMIT = 12

  // Cargar categorías una sola vez al montar
  useEffect(() => {
    let mounted = true
    async function loadCategories() {
      try {
        const res = await api.get('/categorias')
        if (mounted) setCategories(res.data || [])
      } catch (err) {
        console.error('Error al cargar categorías', err)
      }
    }
    loadCategories()
    return () => {
      mounted = false
    }
  }, [])

  // Cargar productos cada vez que cambien los filtros, ordenamiento o página
  useEffect(() => {
    let mounted = true
    async function loadProducts() {
      setLoading(true)
      try {
        const params = {
          page,
          limit: LIMIT,
          sortBy
        }
        if (selectedCategory) {
          params.categoriaId = selectedCategory
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim()
        }

        const res = await api.get('/zapatos', { params })
        if (!mounted) return

        // El backend devuelve { data, total, page, limit, totalPages } si está paginado
        const { data, total, totalPages: pages } = res.data || {}
        setProducts(data || [])
        setTotalProducts(total || 0)
        setTotalPages(pages || 1)
      } catch (err) {
        console.error('Error al cargar calzados del catálogo', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProducts()
    return () => {
      mounted = false
    }
  }, [page, selectedCategory, searchQuery, sortBy])

  // Reiniciar página a 1 cuando cambien filtros
  useEffect(() => {
    setPage(1)
  }, [selectedCategory, searchQuery])

  // Los productos vienen ordenados y filtrados desde el backend
  const filteredProducts = products

  const selectedProductSizes = Array.isArray(selectedProduct?.tallas) ? selectedProduct.tallas : []
  const selectedSizeStock = selectedProduct && selectedSize ? getStockForSize(selectedProduct, selectedSize) : 0
  const selectedProductTotalStock = selectedProduct ? getTotalStock(selectedProduct) : 0
  const openProductDetails = (product) => {
    setSelectedProduct(product)
    setSelectedSize('')
    setAddedJustNow(false)
  }
  const closeProductDetails = () => {
    setSelectedProduct(null)
    setSelectedSize('')
    setAddedJustNow(false)
  }

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedProduct) {
        closeProductDetails()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedProduct])

  const handleAddToCartModal = () => {
    if (!selectedProduct || !selectedSize || selectedSizeStock <= 0) return
    addToCart(selectedProduct, selectedSize)
    setAddedJustNow(true)
    setTimeout(() => {
      setAddedJustNow(false)
      closeProductDetails()
      setCartOpen(true)
    }, 450)
  }

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Premium Sticky Navigation */}
      <Header />

      <main className="container" style={{ flexGrow: 1 }}>
        {/* Stunning Welcome Hero Banner */}
        <section className="hero">
          <div className="hero-glow"></div>
          <h1 className="title">Encuentra Tu Estilo Único</h1>
          <p className="subtitle">
            Calzados AbbySport diseñados con onda, confort y materiales de calidad premium para destacar a cada paso.
          </p>

          {/* Quick trust metrics row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <Truck size={16} style={{ color: 'var(--accent)' }} />
              <span>Envíos Nacionales Rápidos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <ShieldCheck size={16} style={{ color: 'var(--accent)' }} />
              <span>Garantía de Originalidad</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <Star size={16} style={{ color: 'var(--accent)' }} />
              <span>Calidad 5 Estrellas</span>
            </div>
          </div>
        </section>

        {/* Dynamic Controls: Search, Sort and Filters */}
        <section className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            {/* Search Wrapper */}
            <div className="search-wrapper" style={{ margin: 0, flexGrow: 1 }}>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar zapatos por nombre o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="search-icon" size={18} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sorting Wrapper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ArrowUpDown size={16} style={{ color: 'var(--text-secondary)' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="newest" style={{ background: '#141220' }}>Novedades primero</option>
                <option value="price-asc" style={{ background: '#141220' }}>Precio: Bajo a Alto</option>
                <option value="price-desc" style={{ background: '#141220' }}>Precio: Alto a Bajo</option>
                <option value="name-asc" style={{ background: '#141220' }}>Nombre: A - Z</option>
              </select>
            </div>
          </div>

          {/* Categories Horizontal Filters */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
              <SlidersHorizontal size={14} />
              <span>Categorías</span>
            </div>
            <div className="categories-container" style={{ margin: 0 }}>
              <button
                className={`category-chip ${selectedCategory === null ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                Todos los Modelos
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`category-chip ${selectedCategory === c.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(c.id)}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Catalog / Products Section */}
        <section>
          <h2 className="section-title">Nuestra Colección</h2>

          {loading ? (
            <ProductSkeleton count={LIMIT} />
          ) : filteredProducts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 8, color: '#fff' }}>No encontramos resultados</p>
              <p style={{ fontSize: 14 }}>Intenta cambiar los términos de búsqueda o seleccionar otra categoría.</p>
              <button
                className="btn-secondary"
                onClick={() => {
                  setSelectedCategory(null)
                  setSearchQuery('')
                }}
                style={{ marginTop: 16 }}
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <>
              <div className="grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={openProductDetails}
                  />
                ))}
              </div>

              {/* Premium Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 40, marginBottom: 20 }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    style={{ padding: '10px 16px', borderRadius: 10, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
                  >
                    Anterior
                  </button>
                  
                  <div style={{ display: 'flex', gap: 6 }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          border: page === pageNum ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                          background: page === pageNum ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255,255,255,0.03)',
                          color: page === pageNum ? 'var(--accent)' : 'var(--text-primary)',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn-secondary"
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    style={{ padding: '10px 16px', borderRadius: 10, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Floating Shopping Cart Sidebar Drawer */}
      <CartDrawer />

      {/* Premium Product Details Modal */}
      {selectedProduct && (
        <div className={`modal-overlay ${selectedProduct ? 'open' : ''}`} onClick={closeProductDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 0 }}>
            {/* Split layout inside the modal */}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {/* Product Large Image display */}
              <div style={{ flex: '1 1 300px', height: '380px', background: 'rgba(0,0,0,0.2)', position: 'relative' }}>
                <img
                  src={selectedProduct.imagenUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop'}
                  alt={selectedProduct.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop'
                  }}
                />
                <button
                  className="cart-close"
                  onClick={closeProductDetails}
                  style={{ position: 'absolute', top: 16, right: 16 }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Product information fields */}
              <div style={{ flex: '1 1 300px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                    {selectedProduct.categoria?.nombre || 'General'}
                  </div>
                  <h3 style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', marginBottom: 12, lineHeight: 1.2 }}>
                    {selectedProduct.nombre}
                  </h3>

                  {/* Stock tag */}
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        background: selectedProductTotalStock > 0 ? 'rgba(46, 213, 115, 0.15)' : 'rgba(255, 71, 87, 0.15)',
                        color: selectedProductTotalStock > 0 ? '#2ed573' : '#ff4757',
                        padding: '4px 10px',
                        borderRadius: 30,
                        fontSize: 12,
                        fontWeight: 600
                      }}
                    >
                      {selectedProductTotalStock > 0 ? `Stock total: ${selectedProductTotalStock} uds` : 'Agotado'}
                    </span>
                    {selectedSize && (
                      <span
                        style={{
                          background: selectedSizeStock > 0 ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 71, 87, 0.15)',
                          color: selectedSizeStock > 0 ? 'var(--accent)' : '#ff4757',
                          padding: '4px 10px',
                          borderRadius: 30,
                          fontSize: 12,
                          fontWeight: 600
                        }}
                      >
                        Talla {selectedSize}: {selectedSizeStock > 0 ? `${selectedSizeStock} uds` : 'Agotada'}
                      </span>
                    )}
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>ID del calzado: #{selectedProduct.id}</span>
                  </div>

                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                    {selectedProduct.descripcion || 'Un calzado chebre diseñado para ofrecer la máxima comodidad y estilo urbano en tu día a día.'}
                  </p>

                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>
                      Selecciona tu talla
                    </div>
                    {selectedProductSizes.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {selectedProductSizes.map((size) => {
                          const sizeStock = getStockForSize(selectedProduct, size)
                          const isOut = sizeStock <= 0
                          return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => !isOut && setSelectedSize(size)}
                            disabled={isOut}
                            style={{
                              minWidth: 42,
                              height: 38,
                              borderRadius: 10,
                              border: selectedSize === size ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                              background: isOut
                                ? 'rgba(255, 71, 87, 0.08)'
                                : selectedSize === size
                                  ? 'rgba(0, 242, 254, 0.16)'
                                  : 'rgba(255,255,255,0.04)',
                              color: isOut
                                ? '#ff4757'
                                : selectedSize === size
                                  ? 'var(--accent)'
                                  : 'var(--text-primary)',
                              fontWeight: 700,
                              cursor: isOut ? 'not-allowed' : 'pointer',
                              opacity: isOut ? 0.6 : 1,
                              position: 'relative'
                            }}
                            title={isOut ? 'Talla agotada' : `${sizeStock} unidades disponibles`}
                          >
                            {size}
                            {!isOut && sizeStock <= 3 && (
                              <span style={{ fontSize: 9, marginLeft: 4, color: 'var(--secondary)' }}>({sizeStock})</span>
                            )}
                          </button>
                          )
                        })}
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, color: '#ff4757' }}>
                        Este calzado aún no tiene tallas configuradas.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20, marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Precio Final</div>
                      <div style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>
                        ${(selectedProduct.precio || 0).toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={16} fill="var(--secondary)" style={{ color: 'var(--secondary)' }} />
                      <Star size={16} fill="var(--secondary)" style={{ color: 'var(--secondary)' }} />
                      <Star size={16} fill="var(--secondary)" style={{ color: 'var(--secondary)' }} />
                      <Star size={16} fill="var(--secondary)" style={{ color: 'var(--secondary)' }} />
                      <Star size={16} fill="rgba(255,255,255,0.1)" style={{ color: 'rgba(255,255,255,0.2)' }} />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 4, fontWeight: 500 }}>4.2</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      className="btn-primary"
                      onClick={handleAddToCartModal}
                      disabled={selectedSizeStock <= 0 || !selectedSize || addedJustNow}
                      style={{
                        flexGrow: 1,
                        padding: '14px',
                        borderRadius: 12,
                        justifyContent: 'center',
                        background: addedJustNow
                          ? 'linear-gradient(135deg, #2ed573 0%, #26af5f 100%)'
                          : undefined,
                        cursor: !selectedSize || selectedSizeStock <= 0 ? 'not-allowed' : 'pointer',
                        opacity: !selectedSize || selectedSizeStock <= 0 ? 0.65 : 1,
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {addedJustNow ? (
                        <>
                          <Check size={18} />
                          <span>¡Agregado al Carrito!</span>
                        </>
                      ) : !selectedSize ? (
                        <>
                          <ShoppingCart size={18} />
                          <span>Elige una Talla</span>
                        </>
                      ) : selectedSizeStock <= 0 ? (
                        <span>Talla {selectedSize} Agotada</span>
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          <span>Agregar al Carrito</span>
                        </>
                      )}
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={closeProductDetails}
                      style={{ padding: '14px 20px', borderRadius: 12 }}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styled Footer */}
      <footer style={{ background: 'rgba(13, 11, 22, 0.9)', borderTop: '1px solid var(--glass-border)', padding: '24px 0', marginTop: '48px', color: 'var(--text-secondary)', fontSize: 13 }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
          <div>© {new Date().getFullYear()} AbbySport Inc. Todos los derechos reservados.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Términos</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacidad</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
