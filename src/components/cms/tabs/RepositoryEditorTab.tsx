import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, Star } from 'lucide-react';
import type { PortfolioItem, SiteProfile } from '../../../types/profile';

interface RepositoryEditorTabProps {
  profile: SiteProfile;
  onUpdateProject: (index: number, project: PortfolioItem) => void;
  onAddProject: (project: PortfolioItem) => void;
  onRemoveProject: (index: number) => void;
  initialSelectedId?: string | number | null;
}

export const RepositoryEditorTab: React.FC<RepositoryEditorTabProps> = ({
  profile,
  onUpdateProject,
  onAddProject,
  onRemoveProject,
  initialSelectedId
}) => {
  const [editingIdx, setEditingIdx] = useState<number | null>(() => {
    if (initialSelectedId !== undefined && initialSelectedId !== null) {
      const idx = profile.portfolio.findIndex(p => p.id === initialSelectedId);
      return idx !== -1 ? idx : null;
    }
    return null;
  });

  const personaKeys = Object.keys(profile.personas);

  const handleCreateNew = () => {
    const newProj: PortfolioItem = {
      id: Date.now(),
      title: 'New Portal Node',
      type: 'Initiative',
      icon: 'fa-cube',
      link: '#',
      desc: 'Project brief and technical highlights.',
      cats: ['nexus'],
      featured: false,
      assets: []
    };
    onAddProject(newProj);
    setEditingIdx(0);
  };

  const handleToggleCategory = (projIdx: number, catKey: string) => {
    const proj = profile.portfolio[projIdx];
    if (!proj) return;
    const exists = proj.cats.includes(catKey);
    const newCats = exists ? proj.cats.filter(c => c !== catKey) : [...proj.cats, catKey];
    onUpdateProject(projIdx, { ...proj, cats: newCats });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Ecosystem Repository</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Manage the projects, portals, and nodes linked to your personas.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.75rem',
            background: 'var(--stone-900)',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Plus size={15} /> Add Portal
        </button>
      </div>

      {/* Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {profile.portfolio.map((proj, idx) => {
          const isEditing = editingIdx === idx;
          return (
            <div
              key={proj.id}
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: '1.25rem',
                background: isEditing ? 'var(--stone-50)' : 'var(--bg-panel)',
                padding: '1rem 1.25rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                  {proj.featured && <Star size={16} fill="var(--amber-500)" color="var(--amber-500)" />}
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {proj.title}
                    </h4>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                      {proj.type} · {proj.cats.join(', ')}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    onClick={() => setEditingIdx(isEditing ? null : idx)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '0.5rem',
                      background: isEditing ? 'var(--emerald-600)' : 'var(--stone-100)',
                      color: isEditing ? '#ffffff' : 'var(--text-main)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    {isEditing ? <Check size={14} /> : <Edit3 size={14} />}
                    {isEditing ? 'Done' : 'Edit'}
                  </button>
                  <button
                    onClick={() => onRemoveProject(idx)}
                    style={{
                      padding: '0.35rem 0.5rem',
                      borderRadius: '0.5rem',
                      color: 'var(--amber-600)',
                      background: 'transparent'
                    }}
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Editing Form */}
              {isEditing && (
                <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => onUpdateProject(idx, { ...proj, title: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        Type
                      </label>
                      <input
                        type="text"
                        value={proj.type}
                        onChange={(e) => onUpdateProject(idx, { ...proj, type: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                      Pillar Associations (Select all that apply)
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
                      {personaKeys.map(k => (
                        <label
                          key={k}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '0.5rem',
                            background: proj.cats.includes(k) ? 'var(--emerald-50)' : 'var(--stone-100)',
                            border: `1px solid ${proj.cats.includes(k) ? 'var(--emerald-300)' : 'var(--border-subtle)'}`,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={proj.cats.includes(k)}
                            onChange={() => handleToggleCategory(idx, k)}
                          />
                          {profile.personas[k]?.label || k}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem', background: 'var(--stone-100)', borderRadius: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={proj.featured}
                        onChange={(e) => onUpdateProject(idx, { ...proj, featured: e.target.checked })}
                      />
                      <span>Feature in Core Nexus Top Deck</span>
                    </label>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                      Description
                    </label>
                    <textarea
                      value={proj.desc}
                      onChange={(e) => onUpdateProject(idx, { ...proj, desc: e.target.value })}
                      rows={3}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        Main URL
                      </label>
                      <input
                        type="text"
                        value={proj.link}
                        onChange={(e) => onUpdateProject(idx, { ...proj, link: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        Favicon / Icon URL
                      </label>
                      <input
                        type="text"
                        value={proj.metaIcon || ''}
                        placeholder="https://..."
                        onChange={(e) => onUpdateProject(idx, { ...proj, metaIcon: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        Documentation URL
                      </label>
                      <input
                        type="text"
                        value={proj.doc || ''}
                        placeholder="#"
                        onChange={(e) => onUpdateProject(idx, { ...proj, doc: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        GitHub Repo URL
                      </label>
                      <input
                        type="text"
                        value={proj.repo || ''}
                        placeholder="#"
                        onChange={(e) => onUpdateProject(idx, { ...proj, repo: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
