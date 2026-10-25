import React, { useState } from 'react';
import {
  X,
  Users,
  FolderTree,
  Images,
  Sliders,
  User,
  FileText,
  GitBranch,
  Crosshair,
  Check,
  Save
} from 'lucide-react';
import { PersonaEditorTab } from './tabs/PersonaEditorTab';
import { RepositoryEditorTab } from './tabs/RepositoryEditorTab';
import { AssetPoolsTab } from './tabs/AssetPoolsTab';
import { GlobalConfigTab } from './tabs/GlobalConfigTab';
import { ProfileBioTab } from './tabs/ProfileBioTab';
import { CustomPagesTab } from './tabs/CustomPagesTab';
import { VersionManagerTab } from './tabs/VersionManagerTab';
import type { SiteProfile, Persona, PortfolioItem, GalleryItem, SiteConfig, ProfileBio, CustomPage } from '../../types/profile';

type CmsTab = 'personas' | 'repository' | 'galleries' | 'config' | 'bio' | 'pages' | 'versions';

interface CmsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SiteProfile;
  availableProfiles: Array<{ id: string; title: string; version: string; status: string; updatedAt: string }>;
  onUpdateProfile: (updated: SiteProfile) => void;
  onSwitchProfile: (id: string) => void;
  onCloneProfile: (newId: string, newTitle: string, newVersion: string) => void;
  onSaveSnapshot: (label: string) => void;
  onRestoreSnapshot: (version: string) => void;
  onImportProfile: (imported: SiteProfile) => void;
  isInspectMode: boolean;
  onToggleInspectMode: () => void;
  inspectedElement: { type: string; id?: any } | null;
  saveStatus: string | null;
  onForceSave: () => void;
}

export const CmsDrawer: React.FC<CmsDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  availableProfiles,
  onUpdateProfile,
  onSwitchProfile,
  onCloneProfile,
  onSaveSnapshot,
  onRestoreSnapshot,
  onImportProfile,
  isInspectMode,
  onToggleInspectMode,
  inspectedElement,
  saveStatus,
  onForceSave
}) => {
  const [activeTab, setActiveTab] = useState<CmsTab>(() => {
    if (inspectedElement) {
      if (inspectedElement.type === 'persona') return 'personas';
      if (inspectedElement.type === 'project') return 'repository';
      if (inspectedElement.type === 'bio') return 'bio';
      if (inspectedElement.type === 'gallery') return 'galleries';
    }
    return 'personas';
  });

  // Keep active tab in sync when user clicks an inspectable element on canvas
  React.useEffect(() => {
    if (inspectedElement) {
      if (inspectedElement.type === 'persona') setActiveTab('personas');
      if (inspectedElement.type === 'project') setActiveTab('repository');
      if (inspectedElement.type === 'bio') setActiveTab('bio');
      if (inspectedElement.type === 'gallery') setActiveTab('galleries');
    }
  }, [inspectedElement]);

  // Tab mutators
  const handleUpdatePersona = (key: string, persona: Persona) => {
    onUpdateProfile({
      ...profile,
      personas: { ...profile.personas, [key]: persona }
    });
  };

  const handleAddPersona = (key: string, persona: Persona) => {
    onUpdateProfile({
      ...profile,
      personas: { ...profile.personas, [key]: persona }
    });
  };

  const handleRemovePersona = (key: string) => {
    const updated = { ...profile.personas };
    delete updated[key];
    onUpdateProfile({ ...profile, personas: updated });
  };

  const handleUpdateProject = (index: number, project: PortfolioItem) => {
    const updated = [...profile.portfolio];
    updated[index] = project;
    onUpdateProfile({ ...profile, portfolio: updated });
  };

  const handleAddProject = (project: PortfolioItem) => {
    onUpdateProfile({
      ...profile,
      portfolio: [project, ...profile.portfolio]
    });
  };

  const handleRemoveProject = (index: number) => {
    onUpdateProfile({
      ...profile,
      portfolio: profile.portfolio.filter((_, i) => i !== index)
    });
  };

  const handleUpdateGalleries = (galleries: Record<string, GalleryItem[]>) => {
    onUpdateProfile({ ...profile, galleries });
  };

  const handleUpdateConfig = (config: SiteConfig) => {
    onUpdateProfile({ ...profile, config });
  };

  const handleUpdateBio = (bio: ProfileBio) => {
    onUpdateProfile({ ...profile, profile: bio });
  };

  const handleUpdatePages = (pages: CustomPage[]) => {
    onUpdateProfile({ ...profile, customPages: pages });
  };

  return (
    <aside className={`cms-drawer ${isOpen ? '' : 'collapsed'}`}>
      {/* Header */}
      <div className="cms-drawer-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--emerald-600)' }}>
              Studio CMS Engine
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-subtle)' }}>
              ({profile.version})
            </span>
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>
            {profile.title}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* In-Context Click to Inspect Toggle */}
          <button
            onClick={onToggleInspectMode}
            style={{
              padding: '0.4rem 0.65rem',
              borderRadius: '0.5rem',
              background: isInspectMode ? 'var(--emerald-600)' : 'var(--stone-100)',
              color: isInspectMode ? '#ffffff' : 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.7rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
            title="Inspect elements on canvas"
          >
            <Crosshair size={13} />
            <span>{isInspectMode ? 'Inspecting' : 'Inspect'}</span>
          </button>

          {/* Save Button */}
          <button
            onClick={onForceSave}
            style={{
              padding: '0.4rem 0.65rem',
              borderRadius: '0.5rem',
              background: 'var(--stone-900)',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
            title="Save changes to disk"
          >
            <Save size={13} />
            <span>Save</span>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              padding: '0.4rem',
              borderRadius: '0.5rem',
              color: 'var(--text-muted)'
            }}
            title="Close builder"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <nav className="cms-tabs-bar">
        <button
          onClick={() => setActiveTab('personas')}
          className={`cms-tab-item ${activeTab === 'personas' ? 'active' : ''}`}
        >
          <Users size={14} style={{ display: 'inline', marginRight: '4px' }} /> Personas
        </button>

        <button
          onClick={() => setActiveTab('repository')}
          className={`cms-tab-item ${activeTab === 'repository' ? 'active' : ''}`}
        >
          <FolderTree size={14} style={{ display: 'inline', marginRight: '4px' }} /> Repository
        </button>

        <button
          onClick={() => setActiveTab('galleries')}
          className={`cms-tab-item ${activeTab === 'galleries' ? 'active' : ''}`}
        >
          <Images size={14} style={{ display: 'inline', marginRight: '4px' }} /> Galleries
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`cms-tab-item ${activeTab === 'config' ? 'active' : ''}`}
        >
          <Sliders size={14} style={{ display: 'inline', marginRight: '4px' }} /> Config
        </button>

        <button
          onClick={() => setActiveTab('bio')}
          className={`cms-tab-item ${activeTab === 'bio' ? 'active' : ''}`}
        >
          <User size={14} style={{ display: 'inline', marginRight: '4px' }} /> Bio
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`cms-tab-item ${activeTab === 'pages' ? 'active' : ''}`}
        >
          <FileText size={14} style={{ display: 'inline', marginRight: '4px' }} /> Pages
        </button>

        <button
          onClick={() => setActiveTab('versions')}
          className={`cms-tab-item ${activeTab === 'versions' ? 'active' : ''}`}
        >
          <GitBranch size={14} style={{ display: 'inline', marginRight: '4px' }} /> Versions
        </button>
      </nav>

      {/* Save Status Notification Banner */}
      {saveStatus && (
        <div style={{
          padding: '0.4rem 1.25rem',
          fontSize: '0.75rem',
          background: 'var(--emerald-50)',
          color: 'var(--emerald-800)',
          borderBottom: '1px solid var(--emerald-200)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <Check size={14} />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Tab Viewport */}
      <div className="cms-drawer-content">
        {activeTab === 'personas' && (
          <PersonaEditorTab
            profile={profile}
            onUpdatePersona={handleUpdatePersona}
            onAddPersona={handleAddPersona}
            onRemovePersona={handleRemovePersona}
            initialSelectedKey={inspectedElement?.type === 'persona' ? inspectedElement.id : null}
          />
        )}

        {activeTab === 'repository' && (
          <RepositoryEditorTab
            profile={profile}
            onUpdateProject={handleUpdateProject}
            onAddProject={handleAddProject}
            onRemoveProject={handleRemoveProject}
            initialSelectedId={inspectedElement?.type === 'project' ? inspectedElement.id : null}
          />
        )}

        {activeTab === 'galleries' && (
          <AssetPoolsTab
            profile={profile}
            onUpdateGalleries={handleUpdateGalleries}
          />
        )}

        {activeTab === 'config' && (
          <GlobalConfigTab
            profile={profile}
            onUpdateConfig={handleUpdateConfig}
          />
        )}

        {activeTab === 'bio' && (
          <ProfileBioTab
            profile={profile}
            onUpdateBio={handleUpdateBio}
          />
        )}

        {activeTab === 'pages' && (
          <CustomPagesTab
            profile={profile}
            onUpdatePages={handleUpdatePages}
          />
        )}

        {activeTab === 'versions' && (
          <VersionManagerTab
            profile={profile}
            availableProfiles={availableProfiles}
            onSwitchProfile={onSwitchProfile}
            onCloneProfile={onCloneProfile}
            onSaveSnapshot={onSaveSnapshot}
            onRestoreSnapshot={onRestoreSnapshot}
            onImportProfile={onImportProfile}
          />
        )}
      </div>
    </aside>
  );
};
