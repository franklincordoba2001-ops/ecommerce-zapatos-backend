import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import CartDrawer from '../components/CartDrawer'
import { useAuth } from '../context/AuthProvider'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import api from '../lib/api'
import { parseTallasInput } from '../lib/stock'
import { User, ShoppingBag, PlusCircle, Package, ClipboardList, LogOut } from 'lucide-react'

// Subcomponentes modulares del perfil
import OrdersHistory from '../components/profile/OrdersHistory'
import GeneralInfo from '../components/profile/GeneralInfo'
import AdminOrdersTab from '../components/profile/AdminOrdersTab'
import AdminManageShoesTab from '../components/profile/AdminManageShoesTab'
import AdminAddShoeTab from '../components/profile/AdminAddShoeTab'

export default function Profile() {
  const { user, logout } = useAuth()
  const { orders } = useCart()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState('orders')
  const [categories, setCategories] = useState([])
  const [loadingCats, setLoadingCats] = useState(false)

  // Estados de Calzados
  const [shoes, setShoes] = useState([])
  const [loadingShoes, setLoadingShoes] = useState(false)

  // Estados de Formulario de Calzado
  const [newShoe, setNewShoe] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaId: '',
    imagenUrl: '',
    tallas: '',
    stockPorTalla: {},
  })
  const [submitting, setSubmitting] = useState(false)
  const [editingShoe, setEditingShoe] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Estados de Categoría
  const [newCategoryName, setNewCategoryName] = useState('')
  const [creatingCat, setCreatingCat] = useState(false)

  // Estados de Pedidos Globales (Admin)
  const [allOrders, setAllOrders] = useState([])
  const [loadingAllOrders, setLoadingAllOrders] = useState(false)
  const [updatingOrderStatusId, setUpdatingOrderStatusId] = useState(null)

  if (!user) return null

  const isAdmin = user.rol === 'ADMIN'
  const displayName = user.nombre || user.email?.split('@')[0] || 'Usuario AbbySport'

  // Cargar pedidos globales (Admin)
  const fetchAllOrders = async () => {
    setLoadingAllOrders(true)
    try {
      const res = await api.get('/ordenes')
      setAllOrders(res.data || [])
    } catch (err) {
      console.error('Error al cargar pedidos globales', err)
    } finally {
      setLoadingAllOrders(false)
    }
  }

  // Actualizar estado del pedido (Admin)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderStatusId(orderId)
    try {
      await api.patch(`/ordenes/${orderId}/estado`, { estado: newStatus })
      showToast('¡Estado del pedido actualizado!', 'success')
      await fetchAllOrders()
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error al actualizar el estado del pedido'
      showToast(errMsg, 'error')
    } finally {
      setUpdatingOrderStatusId(null)
    }
  }

  // Cargar categorías
  const fetchCategories = async () => {
    setLoadingCats(true)
    try {
      const res = await api.get('/categorias')
      const catList = res.data || []
      setCategories(catList)
      if (catList.length > 0) {
        setNewShoe((prev) => ({
          ...prev,
          categoriaId: prev.categoriaId || catList[0].id.toString(),
        }))
      }
    } catch (err) {
      console.error('Error al cargar categorías', err)
    } finally {
      setLoadingCats(false)
    }
  }

  // Cargar calzados
  const fetchShoes = async () => {
    setLoadingShoes(true)
    try {
      const res = await api.get('/zapatos')
      setShoes(res.data || [])
    } catch (err) {
      console.error('Error al cargar calzados', err)
    } finally {
      setLoadingShoes(false)
    }
  }

  // Subir imagen al backend
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      showToast('Por favor selecciona una imagen válida (JPG, PNG, WEBP, GIF)', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen es demasiado grande. El tamaño máximo permitido es 5 MB.', 'error')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const res = await api.post('/zapatos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setNewShoe((prev) => ({ ...prev, imagenUrl: res.data.imageUrl }))
      showToast('¡Imagen subida exitosamente!', 'success')
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error al subir la imagen'
      showToast(errMsg, 'error')
    } finally {
      setUploading(false)
    }
  }

  // Cargar datos administrativos al montar si es Admin
  useEffect(() => {
    if (isAdmin) {
      fetchCategories()
      fetchShoes()
      fetchAllOrders()
    }
  }, [isAdmin])

  const handleTallasChange = (value) => {
    const tallasList = parseTallasInput(value)
    setNewShoe((prev) => {
      const stockPorTalla = {}
      tallasList.forEach((talla) => {
        stockPorTalla[talla] = prev.stockPorTalla?.[talla] ?? ''
      })
      return { ...prev, tallas: value, stockPorTalla }
    })
  }

  const handleStockTallaChange = (talla, value) => {
    setNewShoe((prev) => ({
      ...prev,
      stockPorTalla: { ...prev.stockPorTalla, [talla]: value },
    }))
  }

  const resetShoeForm = () => ({
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaId: categories[0]?.id?.toString() || '',
    imagenUrl: '',
    tallas: '',
    stockPorTalla: {},
  })

  // Crear o editar calzado
  const handleCreateShoe = async (e) => {
    e.preventDefault()
    const tallasList = parseTallasInput(newShoe.tallas)

    if (!newShoe.nombre || !newShoe.precio || !newShoe.categoriaId || tallasList.length === 0) {
      showToast('Por favor completa todos los campos requeridos y al menos una talla', 'error')
      return
    }

    const stockPorTalla = {}
    for (const talla of tallasList) {
      const raw = newShoe.stockPorTalla?.[talla]
      if (raw === '' || raw === undefined || raw === null) {
        showToast(`Indica el stock para la talla ${talla}`, 'error')
        return
      }
      const stock = parseInt(raw, 10)
      if (Number.isNaN(stock) || stock < 0) {
        showToast(`Stock inválido para la talla ${talla}`, 'error')
        return
      }
      stockPorTalla[talla] = stock
    }

    setSubmitting(true)
    try {
      const payload = {
        nombre: newShoe.nombre,
        descripcion: newShoe.descripcion || 'Calzado original',
        precio: parseFloat(newShoe.precio),
        categoriaId: parseInt(newShoe.categoriaId),
        imagenUrl: newShoe.imagenUrl || null,
        tallas: tallasList,
        stockPorTalla,
      }

      if (editingShoe) {
        await api.put(`/zapatos/${editingShoe.id}`, payload)
        showToast('¡Calzado actualizado exitosamente!', 'success')
        setEditingShoe(null)
      } else {
        await api.post('/zapatos', payload)
        showToast('¡Calzado agregado al catálogo exitosamente!', 'success')
      }

      await fetchShoes()
      setNewShoe(resetShoeForm())
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error al guardar calzado'
      showToast(errMsg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Eliminar calzado
  const handleDeleteShoe = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este calzado?')) return

    try {
      await api.delete(`/zapatos/${id}`)
      showToast('¡Calzado eliminado exitosamente!', 'success')
      await fetchShoes()
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error al eliminar calzado'
      showToast(errMsg, 'error')
    }
  }

  // Editar calzado
  const handleEditShoe = (shoe) => {
    setEditingShoe(shoe)
    const stockPorTalla = {}
    if (shoe.stockPorTalla) {
      Object.entries(shoe.stockPorTalla).forEach(([talla, qty]) => {
        stockPorTalla[talla] = String(qty)
      })
    }
    setNewShoe({
      nombre: shoe.nombre,
      descripcion: shoe.descripcion || '',
      precio: shoe.precio.toString(),
      categoriaId: shoe.categoriaId.toString(),
      imagenUrl: shoe.imagenUrl || '',
      tallas: shoe.tallas ? shoe.tallas.join(', ') : '',
      stockPorTalla,
    })
    setActiveTab('admin')
  }

  const handleCancelEdit = () => {
    setEditingShoe(null)
    setNewShoe(resetShoeForm())
  }

  // Crear categoría
  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) {
      showToast('Por favor escribe un nombre para la categoría', 'error')
      return
    }

    setCreatingCat(true)
    try {
      await api.post('/categorias', { nombre: newCategoryName.trim() })
      showToast('¡Categoría creada exitosamente!', 'success')
      setNewCategoryName('')
      await fetchCategories()
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error al crear categoría'
      showToast(errMsg, 'error')
    } finally {
      setCreatingCat(false)
    }
  }

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flexGrow: 1, paddingTop: 32 }}>
        {/* Cabecera del Usuario */}
        <section className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
          <div className="profile-header" style={{ margin: 0, border: 'none', padding: 0 }}>
            <div className="profile-avatar">
              {displayName.substring(0, 2).toUpperCase()}
            </div>
            <div className="profile-meta">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ margin: 0 }}>{displayName}</h3>
                {isAdmin && (
                  <span
                    style={{
                      background: 'rgba(0, 242, 254, 0.15)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(0, 242, 254, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '30px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Administrador
                  </span>
                )}
              </div>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>{user.email}</p>
            </div>
          </div>
        </section>

        {/* Layout en columnas: Menú lateral + Contenido */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {/* Navegación lateral */}
          <div style={{ flex: '1 1 250px' }}>
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button
                className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <ShoppingBag size={18} />
                <span>Mis Compras</span>
              </button>

              <button
                className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <User size={18} />
                <span>Información General</span>
              </button>

              {isAdmin && (
                <>
                  <button
                    className={`profile-tab ${activeTab === 'admin' ? 'active' : ''}`}
                    onClick={() => setActiveTab('admin')}
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <PlusCircle size={18} />
                    <span>Agregar Calzado</span>
                  </button>

                  <button
                    className={`profile-tab ${activeTab === 'manage' ? 'active' : ''}`}
                    onClick={() => setActiveTab('manage')}
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <Package size={18} />
                    <span>Gestionar Calzado</span>
                  </button>

                  <button
                    className={`profile-tab ${activeTab === 'orders-admin' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders-admin')}
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <ClipboardList size={18} />
                    <span>Gestionar Pedidos</span>
                  </button>
                </>
              )}

              <button
                className="profile-tab"
                onClick={logout}
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, color: '#ff4757', marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>

          {/* Panel de Contenido Activo */}
          <div style={{ flex: '3 1 600px' }}>
            <div className="glass-panel" style={{ padding: '32px', minHeight: 350 }}>
              {activeTab === 'orders' && <OrdersHistory orders={orders} />}

              {activeTab === 'info' && <GeneralInfo user={user} displayName={displayName} />}

              {activeTab === 'admin' && isAdmin && (
                <AdminAddShoeTab
                  categories={categories}
                  loadingCats={loadingCats}
                  newCategoryName={newCategoryName}
                  setNewCategoryName={setNewCategoryName}
                  creatingCat={creatingCat}
                  handleCreateCategory={handleCreateCategory}
                  newShoe={newShoe}
                  setNewShoe={setNewShoe}
                  editingShoe={editingShoe}
                  submitting={submitting}
                  uploading={uploading}
                  handleImageUpload={handleImageUpload}
                  handleTallasChange={handleTallasChange}
                  handleStockTallaChange={handleStockTallaChange}
                  handleCreateShoe={handleCreateShoe}
                  handleCancelEdit={handleCancelEdit}
                />
              )}

              {activeTab === 'manage' && isAdmin && (
                <AdminManageShoesTab
                  shoes={shoes}
                  loadingShoes={loadingShoes}
                  handleEditShoe={handleEditShoe}
                  handleDeleteShoe={handleDeleteShoe}
                />
              )}

              {activeTab === 'orders-admin' && isAdmin && (
                <AdminOrdersTab
                  allOrders={allOrders}
                  loadingAllOrders={loadingAllOrders}
                  updatingOrderStatusId={updatingOrderStatusId}
                  handleUpdateOrderStatus={handleUpdateOrderStatus}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <CartDrawer />
    </div>
  )
}
