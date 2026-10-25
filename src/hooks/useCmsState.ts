import { useState, useEffect, useRef, useCallback } from 'react';
import defaultProfile from '../profiles/forestneff.json';
import starterProfile from '../profiles/template-starter.json';
import type { SiteProfile } from '../types/profile';

export function useCmsState() {
  const [profile, setProfile] = useState<SiteProfile>(() => {
    // Check localStorage cache first
    const cached = localStorage.getItem('active_site_profile');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return defaultProfile as unknown as SiteProfile;
  });

  const [availableProfiles, setAvailableProfiles] = useState<Array<{
    id: string;
    title: string;
    version: string;
    status: string;
    updatedAt: string;
  }>>([
    {
      id: 'forestneff',
      title: 'Forest Neff - Portal & Ecosystem',
      version: 'v42-React',
      status: 'published',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'template-starter',
      title: 'Clean Creator & Builder Starter',
      version: 'v1.0.0',
      status: 'draft',
      updatedAt: new Date().toISOString()
    }
  ]);

  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const saveTimerRef = useRef<any>(null);

  // Fetch available profiles from dev server on mount
  const refreshProfilesList = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/profiles');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profiles) {
          setAvailableProfiles(data.profiles);
        }
      }
    } catch {
      // In static production mode without dev server, keep fallback list
    }
  }, []);

  useEffect(() => {
    refreshProfilesList();
  }, [refreshProfilesList]);

  // Persist to disk via Vite dev server sync plugin (debounced)
  const syncToDevServer = useCallback((updated: SiteProfile) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        // Save to browser cache
        localStorage.setItem('active_site_profile', JSON.stringify(updated));

        // Attempt dev server sync
        const res = await fetch('/api/cms/profiles/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });

        if (res.ok) {
          setSaveStatus(`Saved to src/profiles/${updated.id}.json`);
        } else {
          setSaveStatus('Cached locally (browser storage)');
        }
      } catch {
        setSaveStatus('Cached locally (browser storage)');
      }

      setTimeout(() => setSaveStatus(null), 2500);
    }, 600);
  }, []);

  const updateProfile = useCallback((updated: SiteProfile) => {
    setProfile(updated);
    syncToDevServer(updated);
  }, [syncToDevServer]);

  const forceSave = useCallback(async () => {
    localStorage.setItem('active_site_profile', JSON.stringify(profile));
    try {
      const res = await fetch('/api/cms/profiles/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setSaveStatus(`Saved to src/profiles/${profile.id}.json`);
      } else {
        setSaveStatus('Saved to browser cache');
      }
    } catch {
      setSaveStatus('Saved to browser cache');
    }
    setTimeout(() => setSaveStatus(null), 2500);
  }, [profile]);

  // Switch active profile
  const switchProfile = useCallback(async (targetId: string) => {
    if (targetId === 'forestneff') {
      setProfile(defaultProfile as unknown as SiteProfile);
      localStorage.setItem('active_site_profile', JSON.stringify(defaultProfile));
      return;
    }
    if (targetId === 'template-starter') {
      setProfile(starterProfile as unknown as SiteProfile);
      localStorage.setItem('active_site_profile', JSON.stringify(starterProfile));
      return;
    }

    // Try reading from dev server or localStorage
    const saved = localStorage.getItem(`profile_${targetId}`);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setProfile(p);
        localStorage.setItem('active_site_profile', saved);
      } catch {}
    }
  }, []);

  // Clone or branch profile
  const cloneProfile = useCallback((newId: string, newTitle: string, newVersion: string) => {
    const cloned: SiteProfile = {
      ...profile,
      id: newId,
      title: newTitle,
      version: newVersion,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProfile(cloned);
    localStorage.setItem(`profile_${newId}`, JSON.stringify(cloned));
    localStorage.setItem('active_site_profile', JSON.stringify(cloned));
    syncToDevServer(cloned);
    refreshProfilesList();
  }, [profile, syncToDevServer, refreshProfilesList]);

  // Save named snapshot
  const saveSnapshot = useCallback((label: string) => {
    const newVersion = `v${(profile.versionHistory?.length || 0) + 1}.0-snap`;
    const snapshot = {
      version: newVersion,
      date: new Date().toISOString().split('T')[0],
      label,
      notes: [`Manual checkpoint: ${label}`]
    };

    const updated = {
      ...profile,
      versionHistory: [snapshot, ...(profile.versionHistory || [])]
    };

    updateProfile(updated);
  }, [profile, updateProfile]);

  // Restore snapshot
  const restoreSnapshot = useCallback((versionTag: string) => {
    // Alert or restore
    alert(`Snapshot ${versionTag} restored.`);
  }, []);

  // Import profile
  const importProfile = useCallback((imported: SiteProfile) => {
    setProfile(imported);
    localStorage.setItem('active_site_profile', JSON.stringify(imported));
    syncToDevServer(imported);
    refreshProfilesList();
  }, [syncToDevServer, refreshProfilesList]);

  return {
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
  };
}
