/**
 * Main Application Orchestrator
 * Coordinates state, storage migration, configuration, and components into window.app.
 */
const app = {
    state: null,
    editingKey: null,
    editingProjectIdx: null,
    isDirty: false,
    observer: null,
    saveTimeout: null,
    currentVersion: 'dexGem_v41',

    init: function () {
        // --- MIGRATION LOGIC ---
        let stored = localStorage.getItem(this.currentVersion);

        if (!stored) {
            console.log("System: Gem Storage not found. Checking legacy...");
            const legacy = localStorage.getItem('fn_systems_v39');
            if (legacy) {
                console.log("System: Legacy data found. Migrating to Gem...");
                stored = legacy;
                localStorage.setItem(this.currentVersion, legacy);
            }
        }

        const initialDefaults = window.defaults || defaults;
        this.state = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(initialDefaults));

        if (!this.state.config) this.state.config = JSON.parse(JSON.stringify(initialDefaults.config));
        if (!this.state.portfolio) this.state.portfolio = [];

        this.state.portfolio.forEach((p) => {
            if (!p.assets) p.assets = [];
            const def = initialDefaults.portfolio.find(d => d.id === p.id);
            if (def) {
                p.featured = def.featured;
                p.featuredIn = def.featuredIn;
                p.title = def.title;
                p.desc = def.desc;
                p.link = def.link;
                p.cats = def.cats;
                p.icon = def.icon;
            }
            if (p.featuredIn === undefined) p.featuredIn = [];
        });

        // Default Icon Preferences
        const fnFavicon = 'https://www.google.com/s2/favicons?domain=forestneff.com&sz=128';
        const gpFavicon = 'https://www.gstatic.com/images/branding/product/2x/photos_96dp.png';

        const setIcon = (id, iconUrl) => {
            const idx = this.state.portfolio.findIndex(p => p.id === id);
            if (idx !== -1) {
                if (!this.state.portfolio[idx].metaIcon) {
                    this.state.portfolio[idx].metaIcon = iconUrl;
                }
            }
        };

        setIcon(9, gpFavicon);
        setIcon(10, gpFavicon);

        this.state.portfolio.forEach(p => {
            if (![5, 6, 9, 10].includes(p.id) && !p.metaIcon) {
                p.metaIcon = fnFavicon;
            }
        });

        if (window.LockItEngine) {
            LockItEngine.init();
        }

        this.applyTheme();
        this.renderAll();
        this.hydratePortfolio();

        setTimeout(() => {
            this.initSandbox();
        }, 1500);

        this.setupGlobalEvents();
    },

    /* CORE UTILITIES */
    applyTheme: function () {
        const c = this.state.config;
        const r = document.documentElement.style;
        document.body.className = c.theme === 'dark' ? 'theme-dark overflow-x-hidden' : 'overflow-x-hidden';
        r.setProperty('--anim-speed', c.animSpeed);
        r.setProperty('--font-head', c.fontHead);
        r.setProperty('--font-body', c.fontBody);

        const globalBg = document.getElementById('global-bg');
        if (globalBg) {
            globalBg.style.backgroundImage = c.bgImage ? `url('${c.bgImage}')` : 'none';
        }

        if (c.lockitMode && window.LockItEngine) {
            LockItEngine.config.mode = c.lockitMode;
        }
    },

    updateConfig: function (key, val) {
        this.state.config[key] = val;
        this.applyTheme();
        if (key === 'lockitMode' && window.LockItEngine) {
            LockItEngine.config.mode = val;
        }
    },

    isValidLink: function (url) {
        if (!url) return false;
        const clean = url.trim();
        return clean.length > 0 && clean !== '#' && !clean.toUpperCase().includes('STUB');
    },

    hasContent: function (key) {
        if (key === 'nexus' || key === 'identity') return true;
        const p = this.state.personas[key];
        if (!p) return false;
        const catItems = (this.state.portfolio || []).filter(i => i.cats && i.cats.includes(key));
        if (p.template === 'gallery') {
            const gal = this.state.galleries[key] || [];
            return gal.length > 0 || catItems.length > 0;
        }
        if (p.template === 'slides') return catItems.length > 0;
        return true;
    },

    renderAll: function () {
        this.renderNavigation();
        this.renderPersonaSections();
        this.renderProfile();
        this.setupScrollObserver();
    },

    hydratePortfolio: function () {
        if (window.HydrationService) {
            HydrationService.hydratePortfolio(this.state.portfolio, () => this.commitState());
        }
    },

    forceSave: function () {
        localStorage.setItem(this.currentVersion, JSON.stringify(this.state));
        location.reload();
    },

    commitState: function () {
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            localStorage.setItem(this.currentVersion, JSON.stringify(this.state));
        }, 500);
    },

    markDirty: function () {
        this.isDirty = true;
    },

    /* NAVIGATION DELEGATES */
    renderNavigation: function () {
        NavigationComponent.renderNavigation(this);
    },
    toggleMobileMenu: function () {
        NavigationComponent.toggleMobileMenu();
    },
    scrollToPersona: function (key) {
        NavigationComponent.scrollToPersona(key);
    },
    setupScrollObserver: function () {
        NavigationComponent.setupScrollObserver(this);
    },

    /* PERSONA & SECTIONS DELEGATES */
    renderPersonaSections: function () {
        PersonaSectionsComponent.renderPersonaSections(this);
    },
    getStageMarkup: function (key, p, expanded) {
        return PersonaSectionsComponent.getStageMarkup(key, p, expanded, this);
    },
    refreshDecks: function (key) {
        PersonaSectionsComponent.refreshDecks(key, this);
    },
    formatTitle: function (text) {
        return PersonaSectionsComponent.formatTitle(text);
    },
    renderProfile: function () {
        PersonaSectionsComponent.renderProfile(this);
    },
    jumpToFeatured: function (idx) {
        PersonaSectionsComponent.jumpToFeatured(idx, this);
    },

    /* SANDBOX DELEGATES */
    initSandbox: function () {
        SandboxComponent.initSandbox(this);
    },
    switchSandbox: function (val) {
        SandboxComponent.switchSandbox(val, this);
    },
    updateSandbox: function (url, title) {
        SandboxComponent.updateSandbox(url, title, this);
    },

    /* MODALS & AUTH DELEGATES */
    openProjectModal: function (idx) {
        ModalsComponent.openProjectModal(idx, this);
    },
    closeProjectModal: function () {
        ModalsComponent.closeProjectModal();
    },
    openAssetSelector: function (idx) {
        ModalsComponent.openAssetSelector(idx, this);
    },
    closeAssetSelector: function () {
        ModalsComponent.closeAssetSelector();
    },
    toggleLogin: function () {
        ModalsComponent.toggleLogin();
    },
    checkLogin: function () {
        ModalsComponent.checkLogin(this);
    },
    setupGlobalEvents: function () {
        ModalsComponent.setupGlobalEvents(this);
    },

    /* CMS TOOLKIT DELEGATES */
    openToolkit: function () {
        CmsToolkitComponent.openToolkit(this);
    },
    closeToolkit: function () {
        CmsToolkitComponent.closeToolkit();
    },
    toggleToolkitNav: function () {
        CmsToolkitComponent.toggleToolkitNav();
    },
    switchToolkitTab: function (tab) {
        CmsToolkitComponent.switchToolkitTab(tab, this);
    },
    renderSettingsManager: function (el) {
        CmsToolkitComponent.renderSettingsManager(el, this);
    },
    renderRepositoryManager: function (el) {
        CmsToolkitComponent.renderRepositoryManager(el, this);
    },
    renderPersonaManager: function (el) {
        CmsToolkitComponent.renderPersonaManager(el, this);
    },
    renderGalleryManager: function (el) {
        CmsToolkitComponent.renderGalleryManager(el, this);
    },
    renderProfileManager: function (el) {
        CmsToolkitComponent.renderProfileManager(el, this);
    },
    renderVersionManager: function (el) {
        CmsToolkitComponent.renderVersionManager(el, this);
    },
    openProjectEditor: function (idx) {
        CmsToolkitComponent.openProjectEditor(idx, this);
    },
    addProjectAssetRow: function () {
        CmsToolkitComponent.addProjectAssetRow(this);
    },
    saveCurrentProjectEdit: function () {
        CmsToolkitComponent.saveCurrentProjectEdit(this);
    },
    closeProjectEditor: function () {
        CmsToolkitComponent.closeProjectEditor(this);
    },
    openPersonaEditor: function (key) {
        CmsToolkitComponent.openPersonaEditor(key, this);
    },
    saveCurrentPersonaEdit: function () {
        CmsToolkitComponent.saveCurrentPersonaEdit(this);
    },
    closePersonaEditor: function () {
        CmsToolkitComponent.closePersonaEditor(this);
    },
    toggleCat: function (i, k) {
        CmsToolkitComponent.toggleCat(i, k, this);
    },
    addNode: function () {
        CmsToolkitComponent.addNode(this);
    },
    removeNode: function (i) {
        CmsToolkitComponent.removeNode(i, this);
    },
    addAsset: function (k) {
        CmsToolkitComponent.addAsset(k, this);
    },
    removeAsset: function (k, idx) {
        CmsToolkitComponent.removeAsset(k, idx, this);
    },
    createPersona: function () {
        CmsToolkitComponent.createPersona(this);
    }
};

window.app = app;
window.onload = () => app.init();
