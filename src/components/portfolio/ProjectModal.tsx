import React from 'react';
import { X, ExternalLink, GitFork, FileText, Globe } from 'lucide-react';
import type { PortfolioItem } from '../../types/profile';

interface ProjectModalProps {
  project: PortfolioItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-content"
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '2.5rem',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '9999px',
            background: 'var(--stone-100)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-subtle)',
            transition: 'all 0.2s ease'
          }}
          title="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '1.25rem',
              background: 'var(--emerald-50)',
              color: 'var(--emerald-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {project.metaIcon ? (
              <img
                src={project.metaIcon}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Globe size={28} />
            )}
          </div>

          <div>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--text-subtle)'
              }}
            >
              {project.type}
            </span>
            <h3 style={{ fontSize: '2rem', margin: '0.2rem 0 0', lineHeight: 1.15 }}>
              {project.title}
            </h3>
          </div>
        </div>

        {/* Categories / Persona Tags */}
        {project.cats && project.cats.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {project.cats.map(c => (
              <span
                key={c}
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '0.5rem',
                  background: 'var(--stone-100)',
                  color: 'var(--text-muted)'
                }}
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <div style={{ marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>
          <p>{project.desc}</p>
        </div>

        {/* Links & Endpoints */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem'
        }}>
          {project.link && project.link !== '#' && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '9999px',
                background: 'var(--stone-900)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              <ExternalLink size={14} /> Open Portal
            </a>
          )}

          {project.doc && project.doc !== '#' && (
            <a
              href={project.doc}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '9999px',
                background: 'var(--stone-100)',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <FileText size={14} /> Documentation
            </a>
          )}

          {project.repo && project.repo !== '#' && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '9999px',
                background: 'var(--stone-100)',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <GitFork size={14} /> Repository
            </a>
          )}
        </div>

        {/* Related Assets */}
        {project.assets && project.assets.length > 0 && (
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--text-subtle)',
                marginBottom: '0.85rem'
              }}
            >
              Related Assets & Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {project.assets.map((asset, i) => (
                <a
                  key={i}
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '1rem',
                    background: 'var(--stone-50)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <span>{asset.label}</span>
                  <ExternalLink size={14} style={{ opacity: 0.6 }} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
