import React, { useState } from 'react';
import { ArrowLeft, Calendar, BookOpen } from 'lucide-react';
import type { CustomPage } from '../../types/profile';

interface BlogViewProps {
  pages: CustomPage[];
  onBack: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ pages, onBack }) => {
  const [selectedPost, setSelectedPost] = useState<CustomPage | null>(pages[0] || null);

  return (
    <div className="section-container" style={{ minHeight: '80vh', paddingTop: '4rem' }}>
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--emerald-700)',
          marginBottom: '3rem',
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          background: 'var(--stone-100)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <ArrowLeft size={16} /> Back to Portal
      </button>

      {pages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>No articles published yet</h3>
          <p>Create your first dispatch or article in the CMS Studio.</p>
        </div>
      ) : selectedPost ? (
        <article style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: 'var(--text-subtle)',
            marginBottom: '1rem'
          }}>
            <Calendar size={14} />
            <span>{selectedPost.date}</span>
          </div>

          <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            {selectedPost.title}
          </h1>

          {selectedPost.subtitle && (
            <p style={{
              fontSize: '1.35rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-head)',
              fontStyle: 'italic',
              marginBottom: '2.5rem',
              lineHeight: 1.5
            }}>
              {selectedPost.subtitle}
            </p>
          )}

          <div
            style={{
              fontSize: '1.15rem',
              lineHeight: 1.85,
              color: 'var(--text-main)',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '2.5rem',
              whiteSpace: 'pre-line'
            }}
          >
            {selectedPost.content}
          </div>
        </article>
      ) : null}
    </div>
  );
};
