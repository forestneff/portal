import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check } from 'lucide-react';
import type { Persona, SiteProfile } from '../../../types/profile';

interface PersonaEditorTabProps {
  profile: SiteProfile;
  onUpdatePersona: (key: string, persona: Persona) => void;
  onAddPersona: (key: string, persona: Persona) => void;
  onRemovePersona: (key: string) => void;
  initialSelectedKey?: string | null;
}

export const PersonaEditorTab: React.FC<PersonaEditorTabProps> = ({
  profile,
  onUpdatePersona,
  onAddPersona,
  onRemovePersona,
  initialSelectedKey
}) => {
  const [editingKey, setEditingKey] = useState<string | null>(initialSelectedKey || null);
  const [newKey, setNewKey] = useState('');

  const personas = Object.entries(profile.personas);

  const handleCreate = () => {
    const cleanKey = (newKey || `p_${Date.now()}`).toLowerCase().replace(/[^a-z0-9_]/g, '');
    const newPersona: Persona = {
      label: newKey || 'New Pillar',
      tag: 'Creative Practice',
      title: 'New Strategic Direction.',
      desc: 'Narrative description of this area of practice or focus.',
      icon: 'fa-sparkles',
      template: 'slides',
      slideTitle: 'Project Decks',
      pTitle: 'Core Stage',
      pContent: 'Detailed narrative context.'
    };
    onAddPersona(cleanKey, newPersona);
    setEditingKey(cleanKey);
    setNewKey('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Pillars & Personas</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Configure the narrative pillars displayed across your ecosystem.
          </p>
        </div>
      </div>

      {/* Persona List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {personas.map(([key, p]) => {
          const isEditing = editingKey === key;
          return (
            <div
              key={key}
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: '1.25rem',
                background: isEditing ? 'var(--stone-50)' : 'var(--bg-panel)',
                padding: '1rem 1.25rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{p.label}</h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                    {key} · {p.template} template
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setEditingKey(isEditing ? null : key)}
                    style={{
                      padding: '0.4rem 0.75rem',
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
                  {key !== 'nexus' && key !== 'identity' && (
                    <button
                      onClick={() => onRemovePersona(key)}
                      style={{
                        padding: '0.4rem 0.6rem',
                        borderRadius: '0.5rem',
                        color: 'var(--amber-600)',
                        background: 'transparent'
                      }}
                      title="Remove persona"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Editing Form */}
              {isEditing && (
                <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        Label
                      </label>
                      <input
                        type="text"
                        value={p.label}
                        onChange={(e) => onUpdatePersona(key, { ...p, label: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        Tagline Badge
                      </label>
                      <input
                        type="text"
                        value={p.tag}
                        onChange={(e) => onUpdatePersona(key, { ...p, tag: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                      Hero Headline Title
                    </label>
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => onUpdatePersona(key, { ...p, title: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                      Narrative Description
                    </label>
                    <textarea
                      value={p.desc}
                      onChange={(e) => onUpdatePersona(key, { ...p, desc: e.target.value })}
                      rows={3}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        Layout Template
                      </label>
                      <select
                        value={p.template}
                        onChange={(e) => onUpdatePersona(key, { ...p, template: e.target.value as any })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem', background: 'var(--bg-panel)' }}
                      >
                        <option value="slides">Slides (Horizontal Project Deck)</option>
                        <option value="gallery">Gallery (Image Assets Pool)</option>
                        <option value="text">Text (Philosophy / Narrative Article)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        Slide / Stage Title
                      </label>
                      <input
                        type="text"
                        value={p.slideTitle || ''}
                        placeholder="e.g. Strategic Decks"
                        onChange={(e) => onUpdatePersona(key, { ...p, slideTitle: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                      />
                    </div>
                  </div>

                  {p.template === 'text' && (
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        Stage Narrative Text
                      </label>
                      <textarea
                        value={p.pContent || ''}
                        onChange={(e) => onUpdatePersona(key, { ...p, pContent: e.target.value })}
                        rows={4}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', marginTop: '0.25rem' }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Pillar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <input
          type="text"
          placeholder="New Pillar Name (e.g. Researcher)"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-subtle)'
          }}
        />
        <button
          onClick={handleCreate}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '0.75rem',
            background: 'var(--stone-900)',
            color: '#ffffff',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Plus size={16} /> Add Pillar
        </button>
      </div>
    </div>
  );
};
