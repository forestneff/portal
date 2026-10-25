import React, { useState } from 'react';
import { Plus, Trash2, Upload, Star } from 'lucide-react';
import type { GalleryItem, SiteProfile } from '../../../types/profile';

interface AssetPoolsTabProps {
  profile: SiteProfile;
  onUpdateGalleries: (galleries: Record<string, GalleryItem[]>) => void;
}

export const AssetPoolsTab: React.FC<AssetPoolsTabProps> = ({ profile, onUpdateGalleries }) => {
  const [selectedPool, setSelectedPool] = useState<string>(() => {
    const keys = Object.keys(profile.galleries);
    return keys[0] || 'builder';
  });

  const pools = Object.keys(profile.galleries);
  const currentItems = profile.galleries[selectedPool] || [];

  const handleAddImage = () => {
    const newItem: GalleryItem = {
      id: Date.now(),
      title: 'New Visual Asset',
      type: 'Photograph',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      featured: false
    };
    const updated = {
      ...profile.galleries,
      [selectedPool]: [newItem, ...currentItems]
    };
    onUpdateGalleries(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/cms/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, base64 })
        });
        const data = await res.json();
        const url = data.success ? data.url : base64;

        const newItem: GalleryItem = {
          id: Date.now(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          type: 'Upload',
          image: url,
          featured: false
        };
        onUpdateGalleries({
          ...profile.galleries,
          [selectedPool]: [newItem, ...currentItems]
        });
      } catch {
        // Fallback to direct base64 data URI
        const newItem: GalleryItem = {
          id: Date.now(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          type: 'Upload',
          image: base64,
          featured: false
        };
        onUpdateGalleries({
          ...profile.galleries,
          [selectedPool]: [newItem, ...currentItems]
        });
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = (id: number | string) => {
    const updated = {
      ...profile.galleries,
      [selectedPool]: currentItems.filter(item => item.id !== id)
    };
    onUpdateGalleries(updated);
  };

  const handleToggleSpotlight = (id: number | string) => {
    const updated = {
      ...profile.galleries,
      [selectedPool]: currentItems.map(item =>
        item.id === id ? { ...item, featured: !item.featured } : item
      )
    };
    onUpdateGalleries(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Asset Pools & Galleries</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Manage image galleries and upload new visual assets for your persona stages.
        </p>
      </div>

      {/* Pool Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {pools.map(pool => (
          <button
            key={pool}
            onClick={() => setSelectedPool(pool)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              background: selectedPool === pool ? 'var(--emerald-700)' : 'var(--stone-100)',
              color: selectedPool === pool ? '#ffffff' : 'var(--text-main)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {pool} Pool ({profile.galleries[pool]?.length || 0})
          </button>
        ))}
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handleAddImage}
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            borderRadius: '0.75rem',
            background: 'var(--stone-900)',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <Plus size={16} /> Add Image Link
        </button>

        <label
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            borderRadius: '0.75rem',
            background: 'var(--emerald-600)',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            cursor: 'pointer'
          }}
        >
          <Upload size={16} /> Upload Image File
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Grid of Assets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {currentItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '1.25rem',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-panel)',
              alignItems: 'center'
            }}
          >
            <div style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              flexShrink: 0,
              background: 'var(--stone-200)'
            }}>
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <input
                type="text"
                value={item.title}
                onChange={(e) => {
                  const updated = currentItems.map(x => x.id === item.id ? { ...x, title: e.target.value } : x);
                  onUpdateGalleries({ ...profile.galleries, [selectedPool]: updated });
                }}
                style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '0.4rem', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}
              />
              <input
                type="text"
                value={item.image}
                onChange={(e) => {
                  const updated = currentItems.map(x => x.id === item.id ? { ...x, image: e.target.value } : x);
                  onUpdateGalleries({ ...profile.galleries, [selectedPool]: updated });
                }}
                style={{ width: '100%', padding: '0.25rem 0.5rem', borderRadius: '0.4rem', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', color: 'var(--text-subtle)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <button
                onClick={() => handleToggleSpotlight(item.id)}
                style={{
                  padding: '0.35rem',
                  borderRadius: '0.4rem',
                  background: item.featured ? 'var(--amber-400)' : 'var(--stone-100)',
                  color: item.featured ? '#ffffff' : 'var(--text-muted)'
                }}
                title="Toggle spotlight"
              >
                <Star size={14} fill={item.featured ? '#ffffff' : 'none'} />
              </button>
              <button
                onClick={() => handleRemove(item.id)}
                style={{
                  padding: '0.35rem',
                  borderRadius: '0.4rem',
                  background: 'var(--stone-100)',
                  color: 'var(--amber-600)'
                }}
                title="Delete asset"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
