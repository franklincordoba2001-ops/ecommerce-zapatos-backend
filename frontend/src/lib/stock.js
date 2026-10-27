export function getStockForSize(product, talla) {
  if (product?.stockPorTalla && talla) {
    return product.stockPorTalla[talla] ?? 0
  }
  return product?.stock ?? 0
}

export function getTotalStock(product) {
  if (product?.stockPorTalla) {
    return Object.values(product.stockPorTalla).reduce((sum, qty) => sum + (qty || 0), 0)
  }
  return product?.stock ?? 0
}

export function parseTallasInput(value) {
  return [...new Set(
    String(value || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  )]
}
