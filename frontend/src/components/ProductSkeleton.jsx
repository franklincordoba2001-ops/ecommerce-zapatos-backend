import React from 'react'

export default function ProductSkeleton({ count = 8 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, index) => (
        <article key={index} className="skeleton-card">
          {/* Skeleton image */}
          <div className="skeleton" style={{ width: '100%', height: 220, borderRadius: '20px 20px 0 0' }} />

          {/* Skeleton body */}
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Category tag */}
            <div className="skeleton" style={{ width: '35%', height: 14 }} />

            {/* Title */}
            <div className="skeleton" style={{ width: '75%', height: 22 }} />

            {/* Description lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '4px 0' }}>
              <div className="skeleton" style={{ width: '100%', height: 12 }} />
              <div className="skeleton" style={{ width: '65%', height: 12 }} />
            </div>

            {/* Sizes row */}
            <div style={{ display: 'flex', gap: 6 }}>
              <div className="skeleton" style={{ width: 28, height: 20, borderRadius: 6 }} />
              <div className="skeleton" style={{ width: 28, height: 20, borderRadius: 6 }} />
              <div className="skeleton" style={{ width: 28, height: 20, borderRadius: 6 }} />
              <div className="skeleton" style={{ width: 28, height: 20, borderRadius: 6 }} />
            </div>

            {/* Price & action button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="skeleton" style={{ width: '40%', height: 26 }} />
              <div style={{ display: 'flex', gap: 6 }}>
                <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 10 }} />
                <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 10 }} />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
