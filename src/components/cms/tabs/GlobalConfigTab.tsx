import React from 'react';
import type { SiteConfig, SiteProfile } from '../../../types/profile';

interface GlobalConfigTabProps {
  profile: SiteProfile;
  onUpdateConfig: (config: SiteConfig) => void;
}

export const GlobalConfigTab: React.FC<GlobalConfigTabProps> = ({ profile, onUpdateConfig }) => {
  const c = profile.config;

  const handleChange = (key: keyof SiteConfig, val: any) => {
    onUpdateConfig({
      ...c,
      [key]: val
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Global Configuration</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Fine-tune the overarching design language, animation physics, and engine mode.
        </p>
      </div>

      <div style={{
        background: 'var(--stone-50)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Color Theme & Animation Speed */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              Color Theme
            </label>
            <select
              value={c.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.35rem', background: 'var(--bg-panel)' }}
            >
              <option value="stone">Stone Natural (Default)</option>
              <option value="dark">Midnight Dark</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              Physics Animation Speed
            </label>
            <select
              value={c.animSpeed}
              onChange={(e) => handleChange('animSpeed', e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.35rem', background: 'var(--bg-panel)' }}
            >
              <option value="0.8s">Rapid (0.8s)</option>
              <option value="1.2s">Smooth (1.2s)</option>
              <option value="2.0s">Cinematic (2.0s)</option>
            </select>
          </div>
        </div>

        {/* Heading Font & Body Font */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              Headline Font
            </label>
            <select
              value={c.fontHead}
              onChange={(e) => handleChange('fontHead', e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.35rem', background: 'var(--bg-panel)' }}
            >
              <option value="Cormorant Garamond">Cormorant Garamond (Serif)</option>
              <option value="Playfair Display">Playfair Display (Serif)</option>
              <option value="Inter">Inter (Sans)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              Body Typography
            </label>
            <select
              value={c.fontBody}
              onChange={(e) => handleChange('fontBody', e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.35rem', background: 'var(--bg-panel)' }}
            >
              <option value="Inter">Inter (Modern Sans)</option>
              <option value="Lato">Lato (Humanist Sans)</option>
              <option value="Cormorant Garamond">Cormorant Garamond (Classic)</option>
            </select>
          </div>
        </div>

        {/* LockIt Engine Mode */}
        <div>
          <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
            Interactive Engine Mode
          </label>
          <select
            value={c.lockitMode}
            onChange={(e) => handleChange('lockitMode', e.target.value)}
            style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.35rem', background: 'var(--bg-panel)' }}
          >
            <option value="astrolabe">LockIt Astrolabe (Celestial Planetary Canvas)</option>
            <option value="analog">Standard Analog Clock</option>
            <option value="none">Disabled / Clean Canvas</option>
          </select>
        </div>

        {/* Global Background Image */}
        <div>
          <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
            Global Background Image (URL)
          </label>
          <input
            type="text"
            value={c.bgImage || ''}
            placeholder="https://..."
            onChange={(e) => handleChange('bgImage', e.target.value)}
            style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.35rem', background: 'var(--bg-panel)' }}
          />
        </div>
      </div>
    </div>
  );
};
