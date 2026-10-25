import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, FileText } from 'lucide-react';
import type { CustomPage, SiteProfile } from '../../../types/profile';

interface CustomPagesTabProps {
  profile: SiteProfile;
  onUpdatePages: (pages: CustomPage[]) => void;
}

export const CustomPagesTab: React.FC<CustomPagesTabProps> = ({ profile, onUpdatePages }) => {
  const pages = profile.customPages || [];
  const [editingIdx, setEditingIdx] = useState<number | null>(pages.length > 0 ? 0 : null);

  const handleAddPage = () => {
    const newPage: CustomPage = {
      slug: `article-${Date.now()}`,
      title: 'New Article / Dispatch',
      subtitle: 'Brief thematic subtitle.',
      date: new Date().toISOString().split('T')[0],
      excerpt: 'Introductory summary of the article.',
      content: '# Article Heading\n\nWrite your thoughts, essays, or project notes here.'
    };
    onUpdatePages([...pages, newPage]);
    setEditingIdx(pages.length);
  };

  const handleUpdate = (idx: number, updated: CustomPage) => {
    const next = [...pages];
    next[idx] = updated;
    onUpdatePages(next);
  };

  const handleRemove = (idx: number) => {
    onUpdatePages(pages.filter((_, i) => i !== idx));
    setEditingIdx(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Custom Pages & Blog</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Publish standalone articles, deep dives, or standalone essays.
          </p>
        </div>
        <button
          onClick={handleAddPage}
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
          <Plus size={15} /> New Article
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {pages.map((p, idx) => {
          const isEditing = editingIdx === idx;
          return (
            <div
              key={p.slug}
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: '1.25rem',
                background: isEditing ? 'var(--stone-50)' : 'var(--bg-panel)',
                padding: '1rem 1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={18} color="var(--emerald-600)" />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{p.title}</h4>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-subtle)' }}>
                      /{p.slug} · {p.date}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                    onClick={() => handleRemove(idx)}
                    style={{
                      padding: '0.35rem 0.5rem',
                      borderRadius: '0.5rem',
                      color: 'var(--amber-600)'
                    }}
                    title="Delete article"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {isEditing && (
                <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        Title
                      </label>
                      <input
                        type="text"
                        value={p.title}
                        onChange={(e) => handleUpdate(idx, { ...p, title: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={p.slug}
                        onChange={(e) => handleUpdate(idx, { ...p, slug: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={p.subtitle || ''}
                      onChange={(e) => handleUpdate(idx, { ...p, subtitle: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                      Markdown Content
                    </label>
                    <textarea
                      value={p.content}
                      onChange={(e) => handleUpdate(idx, { ...p, content: e.target.value })}
                      rows={8}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem', fontFamily: 'monospace', fontSize: '0.85rem' }}
                    />
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
