import React, { useState, useEffect } from 'react';
import { useCmsState } from './hooks/useCmsState';
import { Navigation } from './components/layout/Navigation';
import { PersonaSection } from './components/persona/PersonaSection';
import { LockItAstrolabe } from './components/engines/LockItAstrolabe';
import { ProjectModal } from './components/portfolio/ProjectModal';
import { BlogView } from './components/pages/BlogView';
import { CmsDrawer } from './components/cms/CmsDrawer';
import type { PortfolioItem } from './types/profile';

export function App() {
  const {
    profile,
    availableProfiles,
    saveStatus,
    updateProfile,
    forceSave,
    switchProfile,
    cloneProfile,
    saveSnapshot,
    restoreSnapshot,
    importProfile
  } = useCmsState();

  const [activePersona, setActivePersona] = useState<string>('nexus');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [inspectedElement, setInspectedElement] = useState<{ type: string; id?: any } | null>(null);
  const [isBlogView, setIsBlogView] = useState(false);

  // Apply theme tokens to root document style
  useEffect(() => {
    const root = document.documentElement;
    const isDark = profile.config.theme === 'dark';

    if (isDark) {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }

    root.style.setProperty('--font-head', profile.config.fontHead);
    root.style.setProperty('--font-body', profile.config.fontBody);
    root.style.setProperty('--anim-speed', profile.config.animSpeed);

    if (profile.config.bgImage) {
      document.body.style.backgroundImage = `url('${profile.config.bgImage}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = 'none';
    }
  }, [profile.config]);

  const handleToggleTheme = () => {
    updateProfile({
      ...profile,
      config: {
        ...profile.config,
        theme: profile.config.theme === 'dark' ? 'stone' : 'dark'
      }
    });
  };

  const handleScrollToPersona = (key: string) => {
    setIsBlogView(false);
    setActivePersona(key);
    const element = document.getElementById(`section-${key}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInspectElement = (type: 'persona' | 'project' | 'bio' | 'gallery', id?: any) => {
    setInspectedElement({ type, id });
    setIsCmsOpen(true);
  };

  return (
    <div className="page-wrapper">
      {/* Background Interactive Canvas (Astrolabe / Analog) */}
      <LockItAstrolabe
        mode={profile.config.lockitMode}
        isDark={profile.config.theme === 'dark'}
      />

      {/* Top Glass Navigation */}
      <Navigation
        profile={profile}
        activePersona={activePersona}
        onSelectPersona={handleScrollToPersona}
        onToggleTheme={handleToggleTheme}
        onToggleCms={() => setIsCmsOpen(!isCmsOpen)}
        isCmsOpen={isCmsOpen}
        onOpenBlog={() => setIsBlogView(true)}
        isBlogView={isBlogView}
      />

      {/* Main Viewport: Blog or Persona Sections */}
      <main>
        {isBlogView ? (
          <BlogView
            pages={profile.customPages || []}
            onBack={() => setIsBlogView(false)}
          />
        ) : (
          <div>
            {Object.entries(profile.personas).map(([key, persona]) => (
              <PersonaSection
                key={key}
                personaKey={key}
                persona={persona}
                profile={profile.profile}
                portfolio={profile.portfolio}
                galleries={profile.galleries}
                onSelectProject={(proj) => setSelectedProject(proj)}
                onInspectElement={handleInspectElement}
                isInspectable={isInspectMode}
                isDark={profile.config.theme === 'dark'}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '5rem 1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '6rem',
        color: 'var(--text-subtle)',
        fontSize: '0.8rem'
      }}>
        <p style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          {profile.profile.name} · {profile.profile.title || 'Systems Architecture'}
        </p>
        <p>© {new Date().getFullYear()} · All rights reserved. Powered by React CMS Engine {profile.version}</p>
      </footer>

      {/* Full Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Dockable CMS Builder Drawer */}
      <CmsDrawer
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        profile={profile}
        availableProfiles={availableProfiles}
        onUpdateProfile={updateProfile}
        onSwitchProfile={switchProfile}
        onCloneProfile={cloneProfile}
        onSaveSnapshot={saveSnapshot}
        onRestoreSnapshot={restoreSnapshot}
        onImportProfile={importProfile}
        isInspectMode={isInspectMode}
        onToggleInspectMode={() => setIsInspectMode(!isInspectMode)}
        inspectedElement={inspectedElement}
        saveStatus={saveStatus}
        onForceSave={forceSave}
      />
    </div>
  );
}
