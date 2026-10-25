import React from 'react';
import type { ProfileBio, SiteProfile } from '../../../types/profile';

interface ProfileBioTabProps {
  profile: SiteProfile;
  onUpdateBio: (bio: ProfileBio) => void;
}

export const ProfileBioTab: React.FC<ProfileBioTabProps> = ({ profile, onUpdateBio }) => {
  const p = profile.profile;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Identity & Biography</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Update your public profile, bio paragraphs, and social handles.
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              Display Name
            </label>
            <input
              type="text"
              value={p.name}
              onChange={(e) => onUpdateBio({ ...p, name: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.35rem', background: 'var(--bg-panel)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              Avatar Image URL
            </label>
            <input
              type="text"
              value={p.image}
              onChange={(e) => onUpdateBio({ ...p, image: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.35rem', background: 'var(--bg-panel)' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              Primary Email
            </label>
            <input
              type="email"
              value={p.email}
              onChange={(e) => onUpdateBio({ ...p, email: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.35rem', background: 'var(--bg-panel)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              Hub Website URL
            </label>
            <input
              type="text"
              value={p.site}
              onChange={(e) => onUpdateBio({ ...p, site: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.35rem', background: 'var(--bg-panel)' }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
            Biography Paragraphs (Separate each paragraph by a new line)
          </label>
          <textarea
            value={p.bio.join('\n\n')}
            onChange={(e) => onUpdateBio({
              ...p,
              bio: e.target.value.split('\n\n').map(s => s.trim()).filter(Boolean)
            })}
            rows={5}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.35rem', background: 'var(--bg-panel)', lineHeight: 1.6 }}
          />
        </div>
      </div>
    </div>
  );
};
