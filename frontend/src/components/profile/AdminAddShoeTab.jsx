import React from 'react'
import { Shield, PlusCircle, Upload } from 'lucide-react'
import { parseTallasInput } from '../../lib/stock'

export default function AdminAddShoeTab({
  categories = [],
  loadingCats = false,
  newCategoryName,
  setNewCategoryName,
  creatingCat = false,
  handleCreateCategory,
  newShoe,
  setNewShoe,
  editingShoe = null,
  submitting = false,
  uploading = false,
  handleImageUpload,
  handleTallasChange,
  handleStockTallaChange,
  handleCreateShoe,
  handleCancelEdit,
}) {
  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Shield size={22} style={{ color: 'var(--primary)' }} />
        <span>Administración de Catálogo</span>
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Agrega nuevas categorías y calzados directamente a la base de datos de PostgreSQL.
      </p>

      {/* Formulario de creación de categoría */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '28px',
        }}
      >
        <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: '#fff' }}>Crear Nueva Categoría</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 16 }}>
          Agrega una línea de calzado (Ej: Deportivo, Botas, Casual) para clasificar tus productos.
        </p>
        <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: Deportivo, Botas, Casual"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
            style={{ flexGrow: 1, margin: 0 }}
          />
          <button
            className="btn-primary"
            type="submit"
            disabled={creatingCat}
            style={{ padding: '0 20px', whiteSpace: 'nowrap', margin: 0 }}
          >
            {creatingCat ? (
              <div className="spinner" style={{ width: 14, height: 14 }}></div>
            ) : (
              'Crear Categoría'
            )}
          </button>
        </form>
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#fff', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
        {editingShoe ? 'Editar Calzado' : 'Agregar Nuevo Calzado al Catálogo'}
      </h4>

      <form onSubmit={handleCreateShoe} className="admin-form">
        <div className="admin-grid">
          {/* Nombre */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Nombre del Calzado *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nike Air Max Retro"
              value={newShoe.nombre}
              onChange={(e) => setNewShoe({ ...newShoe, nombre: e.target.value })}
              required
            />
          </div>

          {/* Categoría */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Categoría *</label>
            {loadingCats ? (
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Cargando categorías...</div>
            ) : (
              <select
                className="form-input"
                value={newShoe.categoriaId}
                onChange={(e) => setNewShoe({ ...newShoe, categoriaId: e.target.value })}
                required
                style={{ cursor: 'pointer' }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} style={{ background: '#141220' }}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="admin-grid">
          {/* Precio */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Precio (COP) *</label>
            <input
              type="number"
              className="form-input"
              placeholder="299000"
              value={newShoe.precio}
              onChange={(e) => setNewShoe({ ...newShoe, precio: e.target.value })}
              required
              min="1"
            />
          </div>

          {/* Subida de Imagen */}
          <div className="form-group" style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--glass-border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Imagen del Calzado (Subir archivo o pegar URL)</label>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: '1 1 200px', position: 'relative' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                  id="admin-shoe-file"
                />
                <label
                  htmlFor="admin-shoe-file"
                  className="btn-secondary"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontSize: 13,
                    textAlign: 'center',
                  }}
                >
                  <Upload size={16} />
                  <span>{uploading ? 'Subiendo imagen...' : 'Seleccionar Archivo'}</span>
                </label>
              </div>

              <div style={{ flex: '2 1 300px' }}>
                <input
                  type="url"
                  className="form-input"
                  placeholder="O pega una URL: https://images.unsplash.com/..."
                  value={newShoe.imagenUrl}
                  onChange={(e) => setNewShoe({ ...newShoe, imagenUrl: e.target.value })}
                  style={{ fontSize: 13, padding: '10px 14px' }}
                />
              </div>
            </div>

            {/* Vista previa */}
            {newShoe.imagenUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <img
                  src={newShoe.imagenUrl}
                  alt="Vista previa del zapato"
                  style={{ width: 60, height: 60, borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--glass-border)' }}
                />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {newShoe.imagenUrl}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tallas disponibles */}
        <div className="form-group">
          <label className="form-label">Tallas Disponibles * (Separadas por comas, ej: 37, 38, 39, 40, 41)</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: 38, 39, 40, 41"
            value={newShoe.tallas}
            onChange={(e) => handleTallasChange(e.target.value)}
            required
          />
        </div>

        {/* Stock por talla */}
        {parseTallasInput(newShoe.tallas).length > 0 && (
          <div className="form-group">
            <label className="form-label">Stock por Talla *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {parseTallasInput(newShoe.tallas).map((talla) => (
                <div key={talla}>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Talla {talla}
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    value={newShoe.stockPorTalla?.[talla] ?? ''}
                    onChange={(e) => handleStockTallaChange(talla, e.target.value)}
                    required
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Descripción */}
        <div className="form-group">
          <label className="form-label">Descripción Detallada</label>
          <textarea
            className="form-input"
            placeholder="Escribe detalles del calzado, materiales, colores disponibles..."
            value={newShoe.descripcion}
            onChange={(e) => setNewShoe({ ...newShoe, descripcion: e.target.value })}
            rows="3"
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {editingShoe && (
            <button
              className="btn-secondary"
              type="button"
              onClick={handleCancelEdit}
              disabled={submitting}
              style={{ padding: '14px', borderRadius: 12, justifyContent: 'center', flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Cancelar
            </button>
          )}
          <button
            className="btn-primary"
            type="submit"
            disabled={submitting || loadingCats}
            style={{ padding: '14px', borderRadius: 12, justifyContent: 'center', flex: editingShoe ? 1 : 'auto' }}
          >
            {submitting ? (
              <div className="spinner"></div>
            ) : (
              <>
                <PlusCircle size={18} />
                <span>{editingShoe ? 'Actualizar Calzado' : 'Guardar Calzado en Catálogo'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
