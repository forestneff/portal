import React, { useState } from 'react';
import {
  GitBranch,
  Download,
  Upload,
  Copy,
  History,
  CheckCircle,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  GitFork
} from 'lucide-react';
import type { SiteProfile } from '../../../types/profile';

interface VersionManagerTabProps {
  profile: SiteProfile;
  availableProfiles: Array<{ id: string; title: string; version: string; status: string; updatedAt: string }>;
  onSwitchProfile: (id: string) => void;
  onCloneProfile: (newId: string, newTitle: string, newVersion: string) => void;
  onSaveSnapshot: (label: string) => void;
  onRestoreSnapshot: (version: string) => void;
  onImportProfile: (imported: SiteProfile) => void;
}

export const VersionManagerTab: React.FC<VersionManagerTabProps> = ({
  profile,
  availableProfiles,
  onSwitchProfile,
  onCloneProfile,
  onSaveSnapshot,
  onRestoreSnapshot,
  onImportProfile
}) => {
  const [viewMode, setViewMode] = useState<'developer' | 'studio'>('developer');
  const [cloneId, setCloneId] = useState('');
  const [cloneTitle, setCloneTitle] = useState('');
  const [cloneVersion, setCloneVersion] = useState('v1.0.0');
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('gh_pat_token') || '');
  const [githubRepo, setGithubRepo] = useState(() => localStorage.getItem('gh_repo') || 'forestneff/portal');
  const [commitStatus, setCommitStatus] = useState<string | null>(null);

  // Download Profile as JSON
  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${profile.id}_${profile.version}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON File
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string);
        if (imported && imported.id && imported.personas) {
          onImportProfile(imported);
        } else {
          alert('Invalid profile JSON structure');
        }
      } catch (err) {
        alert('Could not parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  // Commit directly to GitHub using REST API
  const handlePushToGithub = async () => {
    if (!githubToken) {
      alert('Please enter a GitHub Personal Access Token with repo scope');
      return;
    }
    setCommitStatus('Committing to GitHub...');
    try {
      const path = `src/profiles/${profile.id}.json`;
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(profile, null, 2))));

      // 1. Get current file sha if exists
      let sha: string | undefined;
      const getRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${path}`, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      if (getRes.ok) {
        const fileInfo = await getRes.json();
        sha = fileInfo.sha;
      }

      // 2. Put file
      const putRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `cms: publish profile ${profile.id} (${profile.version})`,
          content,
          sha
        })
      });

      if (putRes.ok) {
        localStorage.setItem('gh_pat_token', githubToken);
        localStorage.setItem('gh_repo', githubRepo);
        setCommitStatus('Successfully committed to GitHub repository!');
      } else {
        const errData = await putRes.json();
        setCommitStatus(`GitHub Error: ${errData.message || 'Check permissions'}`);
      }
    } catch (err: any) {
      setCommitStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Mode Switcher */}
      <div style={{
        display: 'flex',
        background: 'var(--stone-100)',
        padding: '0.25rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => setViewMode('developer')}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            background: viewMode === 'developer' ? 'var(--bg-panel)' : 'transparent',
            color: viewMode === 'developer' ? 'var(--emerald-700)' : 'var(--text-muted)',
            boxShadow: viewMode === 'developer' ? 'var(--shadow-sm)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <GitBranch size={14} /> Developer Tools
        </button>

        <button
          onClick={() => setViewMode('studio')}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            background: viewMode === 'studio' ? 'var(--bg-panel)' : 'transparent',
            color: viewMode === 'studio' ? 'var(--emerald-700)' : 'var(--text-muted)',
            boxShadow: viewMode === 'studio' ? 'var(--shadow-sm)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <Layers size={14} /> Visual Studio Cards
        </button>
      </div>

      {viewMode === 'developer' ? (
        /* DEVELOPER POWER TOOLS VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Profile Switcher */}
          <div style={{
            background: 'var(--stone-50)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '1.25rem',
            padding: '1.25rem'
          }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              Active Working Profile
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem' }}>
              <select
                value={profile.id}
                onChange={(e) => onSwitchProfile(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-panel)',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                {availableProfiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.id}) · {p.version}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Instant Branching / Clone New Version */}
          <div style={{
            background: 'var(--stone-50)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '1.25rem',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Copy size={16} /> Clone / Branch as New Profile
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="ID (e.g. client-alpha)"
                value={cloneId}
                onChange={(e) => setCloneId(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)' }}
              />
              <input
                type="text"
                placeholder="Version (e.g. v1.0.0)"
                value={cloneVersion}
                onChange={(e) => setCloneVersion(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)' }}
              />
            </div>
            <input
              type="text"
              placeholder="Title (e.g. Client Alpha Ecosystem)"
              value={cloneTitle}
              onChange={(e) => setCloneTitle(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)' }}
            />
            <button
              onClick={() => {
                if (!cloneId) return alert('Please enter a target ID');
                onCloneProfile(cloneId, cloneTitle || cloneId, cloneVersion);
                setCloneId('');
                setCloneTitle('');
              }}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '0.5rem',
                background: 'var(--stone-900)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
            >
              Fork & Activate New Profile
            </button>
          </div>

          {/* Snapshot History & Rollback */}
          <div style={{
            background: 'var(--stone-50)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '1.25rem',
            padding: '1.25rem'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <History size={16} /> Snapshots & Version History
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Checkpoint label (e.g. Before redesign)"
                value={snapshotLabel}
                onChange={(e) => setSnapshotLabel(e.target.value)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)' }}
              />
              <button
                onClick={() => {
                  if (!snapshotLabel) return;
                  onSaveSnapshot(snapshotLabel);
                  setSnapshotLabel('');
                }}
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: '0.5rem',
                  background: 'var(--emerald-600)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                Save Snapshot
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(profile.versionHistory || []).map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{v.version}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginLeft: '0.5rem' }}>
                      {v.label || v.date}
                    </span>
                  </div>
                  <button
                    onClick={() => onRestoreSnapshot(v.version)}
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--emerald-700)',
                      textTransform: 'uppercase'
                    }}
                  >
                    Rollback
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Import / Export Bundles */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleDownload}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-subtle)',
                background: 'var(--stone-100)',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Download size={15} /> Export JSON
            </button>

            <label
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-subtle)',
                background: 'var(--stone-100)',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <Upload size={15} /> Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* GitHub Commit Capability */}
          <div style={{
            background: 'var(--stone-50)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '1.25rem',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GitFork size={16} /> Authenticated Git Commit & Deploy
            </h4>
            <input
              type="password"
              placeholder="GitHub Personal Access Token (repo scope)"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)' }}
            />
            <input
              type="text"
              placeholder="Repo e.g. forestneff/portal"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)' }}
            />
            <button
              onClick={handlePushToGithub}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '0.5rem',
                background: 'var(--emerald-700)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
            >
              Commit Active Profile to GitHub
            </button>
            {commitStatus && (
              <span style={{ fontSize: '0.75rem', color: commitStatus.includes('Error') ? 'red' : 'var(--emerald-600)' }}>
                {commitStatus}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* VISUAL STUDIO CARDS VIEW (FOR CLIENTS & TEMPLATE USERS) */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {availableProfiles.map(p => {
            const isActive = p.id === profile.id;
            return (
              <div
                key={p.id}
                style={{
                  padding: '1.5rem',
                  borderRadius: '1.5rem',
                  border: `2px solid ${isActive ? 'var(--emerald-600)' : 'var(--border-subtle)'}`,
                  background: 'var(--bg-panel)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{p.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      ID: {p.id} · {p.version}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      background: isActive ? 'var(--emerald-100)' : 'var(--stone-100)',
                      color: isActive ? 'var(--emerald-800)' : 'var(--text-muted)'
                    }}
                  >
                    {isActive ? 'ACTIVE' : p.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {!isActive && (
                    <button
                      onClick={() => onSwitchProfile(p.id)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        background: 'var(--stone-900)',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      Switch & Open
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onCloneProfile(`${p.id}_copy`, `${p.title} (Copy)`, 'v1.0.0');
                    }}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      background: 'var(--stone-100)',
                      color: 'var(--text-main)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    Duplicate Template
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
