import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import type { PortfolioItem } from '../../types/profile';

interface ProjectCardProps {
  project: PortfolioItem;
  onClick: () => void;
  variant?: 'featured' | 'slide' | 'compact';
  onInspect?: () => void;
  isInspectable?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  variant = 'featured',
  onInspect,
  isInspectable = false
}) => {
  const haloClass = project.featured ? 'halo-gold' : 'halo-green';

  if (variant === 'slide') {
    return (
      <div
        className={`slide-card-item halo-base ${haloClass} ${isInspectable ? 'inspectable-hover' : ''}`}
        onClick={(e) => {
          if (isInspectable && onInspect) {
            e.stopPropagation();
            onInspect();
          } else {
            onClick();
          }
        }}
      >
        {isInspectable && <span className="inspect-badge">Project</span>}
        <div>
          <div className="card-icon-box">
            {project.metaIcon ? (
              <img
                src={project.metaIcon}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Globe size={24} />
            )}
          </div>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--text-subtle)'
          }}>
            {project.type}
          </span>
          <h4 style={{ fontSize: '1.75rem', marginTop: '0.4rem', marginBottom: '0.85rem', lineHeight: 1.2 }}>
            {project.title}
          </h4>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {project.desc}
          </p>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          <span style={{ color: 'var(--text-subtle)' }}>Portal Deck</span>
          <span style={{ color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            View Details <ArrowRight size={14} />
          </span>
        </div>
      </div>
    );
  }

  // Compact or Featured Card
  return (
    <div
      className={`halo-base ${haloClass} ${isInspectable ? 'inspectable-hover' : ''}`}
      onClick={(e) => {
        if (isInspectable && onInspect) {
          e.stopPropagation();
          onInspect();
        } else {
          onClick();
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 1.5rem',
        borderRadius: '1.75rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {isInspectable && <span className="inspect-badge">Project</span>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
        <div
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '1rem',
            background: 'var(--stone-100)',
            color: 'var(--emerald-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden'
          }}
        >
          {project.metaIcon ? (
            <img
              src={project.metaIcon}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Globe size={20} />
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {project.title}
          </h4>
          <span style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--text-subtle)'
          }}>
            {project.type}
          </span>
        </div>
      </div>

      <ArrowRight size={18} style={{ color: 'var(--emerald-600)', flexShrink: 0, marginLeft: '1rem' }} />
    </div>
  );
};
