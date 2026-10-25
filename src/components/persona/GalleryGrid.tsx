import React from 'react';
import type { GalleryItem } from '../../types/profile';

interface GalleryGridProps {
  title?: string;
  items: GalleryItem[];
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  const featured = items.filter(i => i.featured);
  const others = items.filter(i => !i.featured);

  return (
    <div style={{ marginTop: '5rem', marginBottom: '5rem' }}>
      {title && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '3rem', fontStyle: 'italic', color: 'var(--text-main)' }}>
            {title}
          </h2>
        </div>
      )}

      {/* Featured Images */}
      {featured.length > 0 && (
        <div className="gallery-grid-featured">
          {featured.map(item => (
            <div key={item.id} className="gallery-card">
              <img src={item.image} alt={item.title} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2rem',
                background: 'linear-gradient(to top, rgba(6, 78, 59, 0.85) 0%, transparent 100%)',
                color: '#ffffff'
              }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--emerald-300)'
                }}>
                  {item.type}
                </span>
                <h4 style={{ fontSize: '2rem', margin: '0.3rem 0 0' }}>{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regular Grid */}
      {others.length > 0 && (
        <div className="gallery-grid-items">
          {others.map(item => (
            <div key={item.id} className="gallery-card" style={{ aspectRatio: '1 / 1' }}>
              <img src={item.image} alt={item.title} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                color: '#ffffff'
              }}>
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--stone-300)' }}>
                  {item.type}
                </span>
                <h5 style={{ fontSize: '1rem', margin: '0.2rem 0 0' }}>{item.title}</h5>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
