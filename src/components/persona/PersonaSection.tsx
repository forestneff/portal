import React, { useState } from 'react';
import { ProjectCard } from '../portfolio/ProjectCard';
import { SlideTrack } from './SlideTrack';
import { GalleryGrid } from './GalleryGrid';
import { RichTextStage } from './RichTextStage';
import { LockItSandbox } from '../engines/LockItSandbox';
import { Sparkles, Mail, Globe, ChevronDown } from 'lucide-react';
import type { Persona, PortfolioItem, GalleryItem, ProfileBio } from '../../types/profile';

interface PersonaSectionProps {
  personaKey: string;
  persona: Persona;
  profile: ProfileBio;
  portfolio: PortfolioItem[];
  galleries: Record<string, GalleryItem[]>;
  onSelectProject: (project: PortfolioItem) => void;
  onInspectElement?: (type: 'persona' | 'project' | 'bio' | 'gallery', id?: any) => void;
  isInspectable?: boolean;
  isDark?: boolean;
}

export const PersonaSection: React.FC<PersonaSectionProps> = ({
  personaKey,
  persona,
  profile,
  portfolio,
  galleries,
  onSelectProject,
  onInspectElement,
  isInspectable = false,
  isDark = false
}) => {
  const [showArchive, setShowArchive] = useState(false);

  // Filter portfolio items for this persona
  const isNexus = personaKey === 'nexus';
  const isIdentity = personaKey === 'identity';

  const catItems = isNexus
    ? portfolio
    : portfolio.filter(item => item.cats && item.cats.includes(personaKey));

  const featuredProjects = catItems.filter(i =>
    isNexus ? i.featured : (i.featured || (i.featuredIn && i.featuredIn.includes(personaKey)))
  );
  const otherProjects = catItems.filter(i => !featuredProjects.includes(i));

  const galleryItems = galleries[personaKey] || [];

  return (
    <section id={`section-${personaKey}`} className="section-container">
      <div className="persona-grid">
        {/* Left Column: Hero Narrative */}
        <div
          className={isInspectable ? 'inspectable-hover' : ''}
          onClick={() => isInspectable && onInspectElement && onInspectElement('persona', personaKey)}
          style={{ padding: isInspectable ? '1rem' : 0, borderRadius: '1.5rem' }}
        >
          {isInspectable && <span className="inspect-badge">Persona: {persona.label}</span>}
          
          <div className="persona-badge">
            <Sparkles size={13} />
            <span>{persona.tag}</span>
          </div>

          <h1 className="persona-title">
            {persona.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < persona.title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>

          <p className="persona-desc">
            {persona.desc}
          </p>
        </div>

        {/* Right Column: Featured Deck or Identity Profile */}
        <div className="featured-card-wrapper">
          <div className="featured-card-inner">
            {isIdentity ? (
              /* Identity Profile Card */
              <div
                className={`text-center ${isInspectable ? 'inspectable-hover' : ''}`}
                onClick={() => isInspectable && onInspectElement && onInspectElement('bio')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
              >
                {isInspectable && <span className="inspect-badge">Bio & Identity</span>}
                <div style={{
                  width: '10rem',
                  height: '10rem',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
                  border: '4px solid #ffffff',
                  boxShadow: 'var(--shadow-xl)',
                  background: 'var(--stone-200)'
                }}>
                  <img
                    src={profile.image}
                    alt={profile.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <h3 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{profile.name}</h3>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  maxWidth: '22rem',
                  lineHeight: 1.6
                }}>
                  {profile.bio.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
                  <a
                    href={`mailto:${profile.email}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.55rem 1.25rem',
                      borderRadius: '9999px',
                      background: 'var(--stone-900)',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}
                  >
                    <Mail size={13} /> Email
                  </a>
                  <a
                    href={profile.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.55rem 1.25rem',
                      borderRadius: '9999px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}
                  >
                    <Globe size={13} /> Hub
                  </a>
                </div>
              </div>
            ) : (
              /* Projects Card Deck */
              <div>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  color: 'var(--text-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '0.75rem',
                  marginBottom: '1.5rem'
                }}>
                  {isNexus ? 'Core Initiatives' : 'Key Projects'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {featuredProjects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      variant="compact"
                      onClick={() => onSelectProject(project)}
                      onInspect={() => onInspectElement && onInspectElement('project', project.id)}
                      isInspectable={isInspectable}
                    />
                  ))}
                </div>

                {/* Archive Collapse */}
                {otherProjects.length > 0 && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => setShowArchive(!showArchive)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <span>{isNexus ? 'System Archive' : 'Complete List'} ({otherProjects.length})</span>
                      <ChevronDown
                        size={16}
                        style={{
                          transform: showArchive ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.25s ease'
                        }}
                      />
                    </button>

                    {showArchive && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                        {otherProjects.map(project => (
                          <div
                            key={project.id}
                            onClick={() => onSelectProject(project)}
                            style={{
                              padding: '0.75rem 1rem',
                              borderRadius: '1rem',
                              background: 'var(--stone-50)',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span>{project.title}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-subtle)' }}>{project.type}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stage Layout Depending on Template */}
      {persona.template === 'slides' && (
        <SlideTrack
          title={persona.slideTitle || 'Strategic Decks'}
          items={catItems}
          onSelectProject={onSelectProject}
          onInspectItem={(item) => onInspectElement && onInspectElement('project', item.id)}
          isInspectable={isInspectable}
        />
      )}

      {persona.template === 'gallery' && (
        <GalleryGrid
          title={persona.slideTitle || 'Visual Narrative'}
          items={galleryItems}
        />
      )}

      {persona.template === 'text' && (
        <RichTextStage
          title={persona.pTitle}
          content={persona.pContent}
        />
      )}

      {/* LockIt Astrolabe Interactive Sandbox (Featured in Designer/Nexus) */}
      {(personaKey === 'designer' || (isNexus && persona.template === 'slides')) && (
        <div style={{ marginTop: '5rem' }}>
          <LockItSandbox isDark={isDark} />
        </div>
      )}
    </section>
  );
};
