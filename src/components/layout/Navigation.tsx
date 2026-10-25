import React, { useState } from 'react';
import { Sun, Moon, Wrench, Menu, X, BookOpen } from 'lucide-react';
import type { SiteProfile } from '../../types/profile';

interface NavigationProps {
  profile: SiteProfile;
  activePersona: string;
  onSelectPersona: (key: string) => void;
  onToggleTheme: () => void;
  onToggleCms: () => void;
  isCmsOpen: boolean;
  onOpenBlog?: () => void;
  isBlogView?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  profile,
  activePersona,
  onSelectPersona,
  onToggleTheme,
  onToggleCms,
  isCmsOpen,
  onOpenBlog,
  isBlogView = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const personas = Object.entries(profile.personas);
  const hasCustomPages = profile.customPages && profile.customPages.length > 0;

  return (
    <header className="nav-header">
      <div className="nav-inner">
        {/* Brand */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="nav-brand"
        >
          {profile.profile.image ? (
            <img
              src={profile.profile.image}
              alt={profile.profile.name}
              style={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '9999px',
                objectFit: 'cover',
                border: '2px solid var(--border-subtle)'
              }}
            />
          ) : null}
          <span>{profile.profile.name}</span>
        </a>

        {/* Desktop Links */}
        <nav className="nav-links" style={{ display: 'none' }} id="desktop-nav">
          {personas.map(([key, p]) => (
            <button
              key={key}
              onClick={() => onSelectPersona(key)}
              className={`nav-link-btn ${activePersona === key && !isBlogView ? 'active' : ''}`}
            >
              {p.label}
            </button>
          ))}

          {hasCustomPages && onOpenBlog && (
            <button
              onClick={onOpenBlog}
              className={`nav-link-btn ${isBlogView ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <BookOpen size={14} /> Blog
            </button>
          )}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            style={{
              padding: '0.5rem',
              borderRadius: '9999px',
              color: 'var(--text-muted)',
              background: 'var(--stone-100)',
              border: '1px solid var(--border-subtle)'
            }}
            title="Toggle theme"
          >
            {profile.config.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Builder CMS Toggle */}
          <button
            onClick={onToggleCms}
            className="cms-toggle-btn"
            title="Open Builder & Version Toolkit"
          >
            <Wrench size={15} />
            <span style={{ display: 'none' }} className="cms-label-text">
              {isCmsOpen ? 'Close Builder' : 'Studio'}
            </span>
            <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>
              {profile.version}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '0.5rem',
              borderRadius: '0.75rem',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-panel)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          {personas.map(([key, p]) => (
            <button
              key={key}
              onClick={() => {
                onSelectPersona(key);
                setMobileMenuOpen(false);
              }}
              style={{
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: activePersona === key ? 'var(--emerald-700)' : 'var(--text-main)',
                background: activePersona === key ? 'var(--stone-100)' : 'transparent'
              }}
            >
              {p.label} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({p.tag})</span>
            </button>
          ))}

          {hasCustomPages && onOpenBlog && (
            <button
              onClick={() => {
                onOpenBlog();
                setMobileMenuOpen(false);
              }}
              style={{
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isBlogView ? 'var(--emerald-700)' : 'var(--text-main)',
                background: isBlogView ? 'var(--stone-100)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <BookOpen size={16} /> Blog & Articles
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          #desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .cms-label-text {
            display: inline !important;
          }
        }
      `}</style>
    </header>
  );
};
