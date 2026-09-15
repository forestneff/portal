/**
 * Deep CMS Toolkit Component
 * Handles the administrative CMS toolkit modal, tabs (Personas, Repository, Asset Pools,
 * Global Config, Bio, System Logs), project & persona editors, and data mutations.
 */
const CmsToolkitComponent = {
    openToolkit: function (appInstance) {
        const app = appInstance || window.app;
        const modal = document.getElementById('toolkit-modal');
        if (modal) modal.classList.remove('hidden');
        this.switchToolkitTab('persona', app);
    },

    closeToolkit: function () {
        const modal = document.getElementById('toolkit-modal');
        const loginForm = document.getElementById('login-form');
        if (modal) modal.classList.add('hidden');
        if (loginForm) loginForm.classList.add('hidden');
    },

    toggleToolkitNav: function () {
        const nav = document.getElementById('tk-nav');
        if (nav) {
            nav.classList.toggle('hidden');
            nav.classList.toggle('flex');
        }
    },

    switchToolkitTab: function (tab, appInstance) {
        const app = appInstance || window.app;
        const nav = document.getElementById('tk-nav');
        if (nav) {
            nav.innerHTML = `
                <button onclick="app.switchToolkitTab('persona')" class="tk-tab-btn w-full text-left transition-all ${tab === 'persona' ? 'bg-stone-100 text-stone-900 border-l-4 border-emerald-700' : 'text-stone-500 hover:bg-stone-50'}">
                    <i class="fa-solid fa-user-gear text-lg w-6 text-center"></i>
                    <span class="text-[11px] font-bold uppercase tracking-widest tk-label-text">Personas</span>
                </button>
                <button onclick="app.switchToolkitTab('repository')" class="tk-tab-btn w-full text-left transition-all ${tab === 'repository' ? 'bg-stone-100 text-stone-900 border-l-4 border-emerald-700' : 'text-stone-500 hover:bg-stone-50'}">
                    <i class="fa-solid fa-folder-tree text-lg w-6 text-center"></i>
                    <span class="text-[11px] font-bold uppercase tracking-widest tk-label-text">Repository</span>
                </button>
                <button onclick="app.switchToolkitTab('galleries')" class="tk-tab-btn w-full text-left transition-all ${tab === 'galleries' ? 'bg-stone-100 text-stone-900 border-l-4 border-emerald-700' : 'text-stone-500 hover:bg-stone-50'}">
                    <i class="fa-solid fa-images text-lg w-6 text-center"></i>
                    <span class="text-[11px] font-bold uppercase tracking-widest tk-label-text">Asset Pools</span>
                </button>
                <button onclick="app.switchToolkitTab('settings')" class="tk-tab-btn w-full text-left transition-all ${tab === 'settings' ? 'bg-stone-100 text-stone-900 border-l-4 border-emerald-700' : 'text-stone-500 hover:bg-stone-50'}">
                    <i class="fa-solid fa-sliders text-lg w-6 text-center"></i>
                    <span class="text-[11px] font-bold uppercase tracking-widest tk-label-text">Global Config</span>
                </button>
                <button onclick="app.switchToolkitTab('profile')" class="tk-tab-btn w-full text-left transition-all ${tab === 'profile' ? 'bg-stone-100 text-stone-900 border-l-4 border-emerald-700' : 'text-stone-500 hover:bg-stone-50'}">
                    <i class="fa-solid fa-id-card text-lg w-6 text-center"></i>
                    <span class="text-[11px] font-bold uppercase tracking-widest tk-label-text">Bio</span>
                </button>
                <div class="h-px bg-stone-200 my-2 mx-6"></div>
                <button onclick="app.switchToolkitTab('versions')" class="tk-tab-btn w-full text-left transition-all ${tab === 'versions' ? 'bg-stone-100 text-stone-900 border-l-4 border-emerald-700' : 'text-stone-500 hover:bg-stone-50'}">
                    <i class="fa-solid fa-code-branch text-lg w-6 text-center"></i>
                    <span class="text-[11px] font-bold uppercase tracking-widest tk-label-text">System Logs</span>
                </button>
            `;
        }

        const view = document.getElementById('toolkit-viewport');
        if (!view) return;
        view.innerHTML = '';
        if (tab === 'persona') this.renderPersonaManager(view, app);
        if (tab === 'profile') this.renderProfileManager(view, app);
        if (tab === 'repository') this.renderRepositoryManager(view, app);
        if (tab === 'galleries') this.renderGalleryManager(view, app);
        if (tab === 'settings') this.renderSettingsManager(view, app);
        if (tab === 'versions') this.renderVersionManager(view, app);
    },

    markDirty: function (appInstance) {
        const app = appInstance || window.app;
        app.isDirty = true;
    },

    renderSettingsManager: function (el, appInstance) {
        const app = appInstance || window.app;
        const c = app.state.config;
        el.innerHTML = `<h3 class="text-3xl font-bold mb-10 italic tracking-tight text-stone-900 leading-tight">Global Configuration</h3><div class="bg-stone-50 p-12 rounded-[3.5rem] border border-stone-200 space-y-12 font-sans"><div class="grid grid-cols-2 gap-12"><div><label class="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 block mb-3">Color Theme</label><select onchange="app.updateConfig('theme', this.value)" class="w-full p-4 rounded-2xl border border-stone-200 bg-white text-sm font-bold"><option value="stone" ${c.theme === 'stone' ? 'selected' : ''}>Stone (Default)</option><option value="dark" ${c.theme === 'dark' ? 'selected' : ''}>Midnight (Dark)</option></select></div><div><label class="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 block mb-3">Animation Speed</label><select onchange="app.updateConfig('animSpeed', this.value)" class="w-full p-4 rounded-2xl border border-stone-200 bg-white text-sm font-bold"><option value="0.8s" ${c.animSpeed === '0.8s' ? 'selected' : ''}>Rapid (0.8s)</option><option value="1.2s" ${c.animSpeed === '1.2s' ? 'selected' : ''}>Smooth (1.2s)</option><option value="2.0s" ${c.animSpeed === '2.0s' ? 'selected' : ''}>Cinematic (2.0s)</option></select></div></div><div class="grid grid-cols-2 gap-12"><div><label class="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 block mb-3">Heading Font</label><select onchange="app.updateConfig('fontHead', this.value)" class="w-full p-4 rounded-2xl border border-stone-200 bg-white text-sm font-bold"><option value="Cormorant Garamond" ${c.fontHead === 'Cormorant Garamond' ? 'selected' : ''}>Cormorant Garamond (Serif)</option><option value="Playfair Display" ${c.fontHead === 'Playfair Display' ? 'selected' : ''}>Playfair Display (Serif)</option><option value="Inter" ${c.fontHead === 'Inter' ? 'selected' : ''}>Inter (Sans)</option></select></div><div><label class="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 block mb-3">Body Font</label><select onchange="app.updateConfig('fontBody', this.value)" class="w-full p-4 rounded-2xl border border-stone-200 bg-white text-sm font-bold"><option value="Inter" ${c.fontBody === 'Inter' ? 'selected' : ''}>Inter (Modern)</option><option value="Lato" ${c.fontBody === 'Lato' ? 'selected' : ''}>Lato (Humanist)</option><option value="Cormorant Garamond" ${c.fontBody === 'Cormorant Garamond' ? 'selected' : ''}>Cormorant (Classic)</option></select></div></div><div><label class="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 block mb-3">LockIt Engine Mode</label><select onchange="app.updateConfig('lockitMode', this.value)" class="w-full p-4 rounded-2xl border border-stone-200 bg-white text-sm font-bold"><option value="analog" ${c.lockitMode === 'analog' ? 'selected' : ''}>Standard Analog</option><option value="astrolabe" ${c.lockitMode === 'astrolabe' ? 'selected' : ''}>Astrolabe (Planetary)</option></select></div><div><label class="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 block mb-3">Global Background Image (URL)</label><input type="text" value="${c.bgImage || ''}" onchange="app.updateConfig('bgImage', this.value)" class="w-full p-4 rounded-2xl border border-stone-200 bg-white text-sm" placeholder="https://..."></div></div>`;
    },

    renderRepositoryManager: function (el, appInstance) {
        const app = appInstance || window.app;
        let html = `<div class="flex justify-between items-center mb-10"><h3 class="text-3xl font-bold italic text-stone-900 leading-tight tracking-tight font-sans">Ecosystem Mapping</h3><button onclick="app.addNode()" class="px-8 py-3 bg-stone-900 text-stone-50 rounded-full text-xs font-bold uppercase shadow-lg hover:bg-emerald-800 transition-all font-sans font-bold uppercase tracking-widest">+ Add Portal</button></div><div class="space-y-4 font-sans">`;
        (app.state.portfolio || []).forEach((p, idx) => {
            html += `<div class="flex items-center gap-8 p-10 bg-stone-50 border border-stone-200 rounded-[3rem] shadow-sm transition-all hover:bg-white font-sans"><div class="w-1/4"><h4 class="font-bold text-sm text-stone-900">${p.title}</h4><span class="text-[9px] uppercase tracking-widest text-stone-400">${p.type}</span></div><div class="flex-grow flex flex-wrap gap-2">${Object.keys(app.state.personas).map(pk => `<label class="text-[8px] flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border shadow-sm cursor-pointer hover:border-emerald-400 font-bold uppercase font-sans"><input type="checkbox" ${p.cats.includes(pk) ? 'checked' : ''} onchange="app.toggleCat(${idx}, '${pk}')" class="accent-emerald-700"> ${pk}</label>`).join('')}</div><button onclick="app.openProjectEditor(${idx})" class="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 border px-3 py-1 rounded-lg">Edit Details</button><button onclick="app.removeNode(${idx})" class="text-stone-300 hover:text-red-500 transition-all uppercase font-bold font-sans"><i class="fa-solid fa-trash-can text-lg"></i></button></div>`;
        });
        el.innerHTML = html + `</div>`;
    },

    renderPersonaManager: function (el, appInstance) {
        const app = appInstance || window.app;
        let html = `<div class="flex justify-between items-center mb-10"><h3 class="text-3xl font-bold italic font-sans tracking-tight">Persona Strategy Core</h3><button onclick="app.createPersona()" class="px-8 py-3 bg-stone-900 text-stone-50 rounded-full text-xs font-bold uppercase shadow-lg hover:bg-emerald-800 transition-all font-sans font-bold">+ Add Pillar</button></div><div class="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">`;
        Object.keys(app.state.personas).forEach(key => {
            const p = app.state.personas[key];
            html += `<div class="bg-stone-50 p-10 rounded-[3rem] border border-stone-200 flex flex-col justify-between ar-ready-border shadow-sm"><div class="flex items-start justify-between mb-8"><div class="flex items-center gap-6"><div class="w-14 h-14 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 shadow-sm"><i class="fa-solid ${p.icon} text-xl"></i></div><div><h4 class="font-serif text-2xl font-bold tracking-tight text-stone-900 text-left">${p.label}</h4><span class="text-[9px] font-bold uppercase tracking-widest text-stone-400 font-sans">${p.template} template</span></div></div></div><button onclick="app.openPersonaEditor('${key}')" class="w-full py-5 bg-white border border-stone-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:border-stone-900 transition-all shadow-sm font-bold uppercase">Edit Narrative</button></div>`;
        });
        el.innerHTML = html + `</div>`;
    },

    renderGalleryManager: function (el, appInstance) {
        const app = appInstance || window.app;
        let html = `<h3 class="text-3xl font-bold mb-10 italic tracking-tight text-stone-900 leading-tight">Image Asset Pools</h3>`;
        Object.keys(app.state.galleries).forEach(key => {
            const gal = app.state.galleries[key];
            html += `<div class="bg-stone-50 p-12 rounded-[4rem] border border-stone-200 mb-16 shadow-sm font-sans"><div class="flex justify-between items-center mb-10"><h4 class="font-serif text-4xl font-bold capitalize tracking-tight font-sans">${key} Pool</h4><button onclick="app.addAsset('${key}')" class="px-8 py-3 bg-stone-900 text-stone-50 rounded-full text-[10px] font-bold uppercase shadow-md font-bold uppercase tracking-widest">+ Add Image</button></div><div class="grid grid-cols-1 md:grid-cols-2 gap-10">${gal.map((a, idx) => `<div class="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm group"><div class="flex items-center gap-8 mb-8"><div class="w-32 h-32 rounded-3xl overflow-hidden bg-stone-100 shadow-inner"><img src="${a.image}" class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt="${a.title}"></div><div class="flex-grow space-y-4 font-sans"><input type="text" value="${a.title}" onchange="app.state.galleries['${key}'][${idx}].title = this.value" class="w-full p-3 text-sm border rounded-xl font-bold bg-stone-50/50"><input type="text" value="${a.image}" onchange="app.state.galleries['${key}'][${idx}].image = this.value" class="w-full p-2.5 text-[10px] border rounded-xl text-stone-400 font-mono shadow-inner"></div></div><div class="flex justify-between items-center px-4 pt-6 border-t border-stone-50"><label class="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 cursor-pointer hover:text-emerald-700"><input type="checkbox" ${a.featured ? 'checked' : ''} onchange="app.state.galleries['${key}'][${idx}].featured = this.checked" class="accent-emerald-700 w-4 h-4 rounded"> Spotlight</label><button onclick="app.removeAsset('${key}', ${idx})" class="text-xs font-bold text-red-300 hover:text-red-500 transition-all font-bold uppercase">Remove</button></div></div>`).join('')}</div></div>`;
        });
        el.innerHTML = html;
    },

    renderProfileManager: function (el, appInstance) {
        const app = appInstance || window.app;
        const p = app.state.profile;
        el.innerHTML = `<h3 class="text-3xl font-bold mb-10 italic tracking-tight text-stone-900 leading-tight">Identity Information</h3><div class="bg-white p-16 rounded-[4.5rem] border border-stone-200 shadow-sm space-y-12 font-sans"><div class="grid grid-cols-2 gap-12 font-sans"><div><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 tracking-[0.3em] font-bold uppercase">Display Name</label><input type="text" value="${p.name}" onchange="app.state.profile.name = this.value" class="w-full p-5 bg-stone-50 border rounded-2xl text-base font-bold shadow-inner font-sans"></div><div><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 tracking-[0.3em] font-bold uppercase">Avatar URL</label><input type="text" value="${p.image}" onchange="app.state.profile.image = this.value" class="w-full p-5 bg-stone-50 border rounded-2xl text-sm shadow-inner font-sans"></div></div><textarea onchange="app.state.profile.bio = this.value.split('\\n')" class="w-full p-12 border rounded-[4rem] text-lg h-72 leading-relaxed font-light bg-stone-50/30 shadow-inner font-sans">${p.bio.join('\n')}</textarea></div>`;
    },

    renderVersionManager: function (el, appInstance) {
        const app = appInstance || window.app;
        el.innerHTML = `
        <div class="flex justify-between items-center mb-10">
            <h3 class="text-3xl font-bold italic font-sans tracking-tight">System Logs</h3>
            <span class="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-widest">Active: ${app.currentVersion}</span>
        </div>
        <div class="bg-stone-50 p-12 rounded-[3.5rem] border border-stone-200 font-sans space-y-8">
             <div>
                <h4 class="font-bold text-lg text-stone-900 mb-4">Version History</h4>
                <div class="space-y-4">
                    <div class="p-6 bg-white border border-stone-200 rounded-2xl border-l-4 border-l-emerald-500">
                        <div class="flex justify-between mb-2">
                            <span class="text-xs font-bold text-stone-900">v41-Gem (Current)</span>
                            <span class="text-[10px] text-stone-400 uppercase tracking-widest">Active</span>
                        </div>
                        <ul class="text-xs text-stone-500 list-disc list-inside space-y-1">
                            <li>Modular component architecture</li>
                            <li>Default Sandbox: LockIt Engine</li>
                            <li>Priority Stack: Woo Way moved to top</li>
                            <li>UX: Auto-switch sandbox on project view</li>
                        </ul>
                    </div>
                    <div class="p-6 bg-white border border-stone-200 rounded-2xl opacity-60">
                        <div class="flex justify-between mb-2">
                            <span class="text-xs font-bold text-stone-900">v40-Gem</span>
                            <span class="text-[10px] text-stone-400 uppercase tracking-widest">Previous</span>
                        </div>
                        <ul class="text-xs text-stone-500 list-disc list-inside space-y-1">
                            <li>System Key Migration (dexGem protocol)</li>
                            <li>Added Toolkit Version Manager</li>
                            <li>Incremental Update Framework Active</li>
                        </ul>
                    </div>
                    <div class="p-6 bg-white border border-stone-200 rounded-2xl opacity-60">
                        <div class="flex justify-between mb-2">
                            <span class="text-xs font-bold text-stone-900">v39-Stable</span>
                            <span class="text-[10px] text-stone-400 uppercase tracking-widest">Legacy</span>
                        </div>
                        <ul class="text-xs text-stone-500 list-disc list-inside space-y-1">
                            <li>Initial Release</li>
                            <li>LockIt Astrolabe v2.6</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>`;
    },

    /* PROJECT EDITOR */
    openProjectEditor: function (idx, appInstance) {
        const app = appInstance || window.app;
        app.editingProjectIdx = idx;
        const p = app.state.portfolio[idx];
        const personas = Object.keys(app.state.personas).filter(k => k !== 'nexus' && k !== 'identity');
        const featuredIn = p.featuredIn || [];

        const titleEl = document.getElementById('project-edit-title');
        if (titleEl) titleEl.innerText = `Edit: ${p.title}`;

        const safeAssets = p.assets || [];
        let assetListHTML = safeAssets.map((a) => `<div class="asset-row flex gap-2 mb-2"><input type="text" class="asset-label w-1/3 p-2 border rounded-lg text-xs" value="${a.label}" placeholder="Label" oninput="app.markDirty()"><input type="text" class="asset-url w-2/3 p-2 border rounded-lg text-xs" value="${a.url}" placeholder="URL" oninput="app.markDirty()"><button onclick="this.parentElement.remove(); app.markDirty();" class="text-red-400 hover:text-red-600"><i class="fa-solid fa-trash"></i></button></div>`).join('');

        const formFields = document.getElementById('project-form-fields');
        if (formFields) {
            formFields.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                <div><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 font-bold">Title</label><input type="text" id="p-title" value="${p.title}" class="w-full p-4 border rounded-2xl text-sm font-bold" oninput="app.markDirty()"></div>
                <div><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 font-bold">Icon (FA)</label><input type="text" id="p-icon" value="${p.icon}" class="w-full p-4 border rounded-2xl text-sm" oninput="app.markDirty()"></div>
                <div class="col-span-1 md:col-span-2 bg-stone-50 p-6 rounded-2xl border border-stone-100">
                    <label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-4 font-bold">Feature Visibility</label>
                    <label class="flex items-center gap-4 cursor-pointer mb-4"><input type="checkbox" id="p-featured" ${p.featured ? 'checked' : ''} onchange="app.markDirty()" class="w-5 h-5 accent-emerald-700"> <span class="text-xs font-bold text-stone-900">Nexus Core Initiative (Global Top)</span></label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        ${personas.map(k => `<label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" class="persona-feature-check w-4 h-4 accent-emerald-700" value="${k}" ${featuredIn.includes(k) ? 'checked' : ''} onchange="app.markDirty()"> <span class="text-[10px] uppercase font-bold text-stone-500">${app.state.personas[k].label}</span></label>`).join('')}
                    </div>
                </div>
                <div class="col-span-1 md:col-span-2"><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 font-bold">Description</label><textarea id="p-desc" class="w-full p-4 border rounded-2xl text-sm h-32" oninput="app.markDirty()">${p.desc || ''}</textarea></div>
                <div class="col-span-1 md:col-span-2 border-t border-stone-100 pt-6"><h4 class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 font-bold">Endpoints</h4></div>
                <div><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 font-bold">Main URL</label><input type="text" id="p-link" value="${p.link}" class="w-full p-4 border rounded-2xl text-xs" oninput="app.markDirty()"></div>
                <div><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 font-bold">Docs URL</label><input type="text" id="p-doc" value="${p.doc || ''}" class="w-full p-4 border rounded-2xl text-xs" placeholder="#" oninput="app.markDirty()"></div>
                <div><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 font-bold">Repo URL</label><input type="text" id="p-repo" value="${p.repo || ''}" class="w-full p-4 border rounded-2xl text-xs" placeholder="#" oninput="app.markDirty()"></div>
                <div class="col-span-1 md:col-span-2 border-t border-stone-100 pt-6"><div class="flex justify-between items-center mb-4"><h4 class="text-xs font-bold uppercase tracking-widest text-stone-400 font-bold">Related Assets</h4><button onclick="app.addProjectAssetRow()" class="text-[9px] font-bold uppercase bg-stone-100 px-3 py-1 rounded-full">+ Add Asset</button></div><div id="project-assets-list">${assetListHTML}</div></div></div>`;
        }

        const overlay = document.getElementById('project-editor-overlay');
        if (overlay) overlay.classList.remove('hidden');
        app.isDirty = false;
    },

    addProjectAssetRow: function (appInstance) {
        const app = appInstance || window.app;
        const div = document.createElement('div');
        div.className = "asset-row flex gap-2 mb-2";
        div.innerHTML = `<input type="text" class="asset-label w-1/3 p-2 border rounded-lg text-xs" placeholder="Label" oninput="app.markDirty()"><input type="text" class="asset-url w-2/3 p-2 border rounded-lg text-xs" placeholder="URL" oninput="app.markDirty()"><button onclick="this.parentElement.remove(); app.markDirty();" class="text-red-400 hover:text-red-600"><i class="fa-solid fa-trash"></i></button>`;
        const list = document.getElementById('project-assets-list');
        if (list) list.appendChild(div);
        app.markDirty();
    },

    saveCurrentProjectEdit: function (appInstance) {
        const app = appInstance || window.app;
        const p = app.state.portfolio[app.editingProjectIdx];
        if (!p) return;

        p.title = document.getElementById('p-title').value;
        p.icon = document.getElementById('p-icon').value;
        p.desc = document.getElementById('p-desc').value;
        p.link = document.getElementById('p-link').value;
        p.doc = document.getElementById('p-doc').value;
        p.repo = document.getElementById('p-repo').value;
        p.featured = document.getElementById('p-featured').checked;

        const checks = document.querySelectorAll('.persona-feature-check');
        p.featuredIn = Array.from(checks).filter(c => c.checked).map(c => c.value);

        const rows = document.querySelectorAll('.asset-row');
        p.assets = Array.from(rows).map(r => ({
            label: r.querySelector('.asset-label').value,
            url: r.querySelector('.asset-url').value
        })).filter(a => a.label && a.url);

        app.isDirty = false;
        const overlay = document.getElementById('project-editor-overlay');
        if (overlay) overlay.classList.add('hidden');
        this.switchToolkitTab('repository', app);
        app.renderAll();
    },

    closeProjectEditor: function (appInstance) {
        const app = appInstance || window.app;
        if (app.isDirty) {
            if (confirm("You have unsaved changes. OK to Save & Close, Cancel to Discard.")) {
                this.saveCurrentProjectEdit(app);
                return;
            }
        }
        app.isDirty = false;
        const overlay = document.getElementById('project-editor-overlay');
        if (overlay) overlay.classList.add('hidden');
    },

    /* PERSONA EDITOR */
    openPersonaEditor: function (key, appInstance) {
        const app = appInstance || window.app;
        app.editingKey = key;
        const p = app.state.personas[key];
        const titleEl = document.getElementById('persona-edit-title');
        if (titleEl) titleEl.innerText = `Configure: ${p.label}`;

        const form = document.getElementById('persona-form-fields');
        if (form) {
            form.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-10 font-sans"><div><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 tracking-[0.2em] font-bold uppercase">Nav Label</label><input type="text" id="edit-label" value="${p.label}" class="w-full p-5 bg-stone-50 border rounded-2xl text-sm font-bold shadow-inner" oninput="app.markDirty()"></div><div><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 tracking-[0.2em] font-bold uppercase">Icon Class (FA)</label><input type="text" id="edit-icon" value="${p.icon}" class="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl text-sm shadow-inner" oninput="app.markDirty()"></div><div class="col-span-1 md:col-span-2"><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 tracking-[0.2em] font-bold uppercase">Hero Title (Text Only)</label><input type="text" id="edit-title" value='${p.title}' class="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl text-lg font-serif text-stone-900 shadow-inner" oninput="app.markDirty()"></div><div class="col-span-1 md:col-span-2"><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 tracking-[0.2em] font-bold uppercase">Hero Summary Narrative</label><textarea id="edit-desc" class="w-full p-6 bg-stone-50 border border-stone-200 rounded-2xl text-sm h-32 leading-relaxed font-light shadow-inner" oninput="app.markDirty()">${p.desc}</textarea></div><div class="col-span-1 md:col-span-2 border-t border-stone-100 pt-10 mt-6"><h4 class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 italic tracking-widest font-bold uppercase">Stage Behavior</h4></div><div><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 font-bold uppercase">Display Mode</label><select id="edit-template" class="w-full p-5 bg-stone-50 border rounded-2xl text-sm shadow-inner" onchange="app.markDirty()"><option value="widgets" ${p.template === 'widgets' ? 'selected' : ''}>Widgets</option><option value="slides" ${p.template === 'slides' ? 'selected' : ''}>Project Slides</option><option value="gallery" ${p.template === 'gallery' ? 'selected' : ''}>Gallery</option><option value="text" ${p.template === 'text' ? 'selected' : ''}>Text</option></select></div><div><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 font-bold uppercase">Stage Sub-Heading</label><input type="text" id="edit-pTitle" value="${p.pTitle || ''}" class="w-full p-5 bg-stone-50 border rounded-2xl text-sm shadow-inner" oninput="app.markDirty()"></div><div class="col-span-1 md:col-span-2"><label class="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-2 font-bold uppercase">Main Stage Narrative</label><textarea id="edit-pContent" class="w-full p-8 bg-stone-50 border rounded-2xl text-sm h-64 leading-loose font-light shadow-inner" oninput="app.markDirty()">${p.pContent || ''}</textarea></div></div>`;
        }

        const overlay = document.getElementById('persona-editor-overlay');
        if (overlay) overlay.classList.remove('hidden');
        app.isDirty = false;
    },

    saveCurrentPersonaEdit: function (appInstance) {
        const app = appInstance || window.app;
        const p = app.state.personas[app.editingKey];
        if (!p) return;

        p.label = document.getElementById('edit-label').value;
        p.icon = document.getElementById('edit-icon').value;
        p.title = document.getElementById('edit-title').value;
        p.desc = document.getElementById('edit-desc').value;
        p.template = document.getElementById('edit-template').value;
        p.pTitle = document.getElementById('edit-pTitle').value;
        p.pContent = document.getElementById('edit-pContent').value;

        if (p.template === 'gallery' && !app.state.galleries[app.editingKey]) {
            app.state.galleries[app.editingKey] = [];
        }

        app.isDirty = false;
        const overlay = document.getElementById('persona-editor-overlay');
        if (overlay) overlay.classList.add('hidden');
        this.switchToolkitTab('persona', app);
        app.renderAll();
    },

    closePersonaEditor: function (appInstance) {
        const app = appInstance || window.app;
        if (app.isDirty) {
            if (confirm("You have unsaved changes. OK to Save & Close, Cancel to Discard.")) {
                this.saveCurrentPersonaEdit(app);
                return;
            }
        }
        app.isDirty = false;
        const overlay = document.getElementById('persona-editor-overlay');
        if (overlay) overlay.classList.add('hidden');
    },

    /* UTILITIES */
    toggleCat: function (i, k, appInstance) {
        const app = appInstance || window.app;
        const p = app.state.portfolio[i];
        if (!p) return;
        if (p.cats.includes(k)) p.cats = p.cats.filter(c => c !== k);
        else p.cats.push(k);
    },

    addNode: function (appInstance) {
        const app = appInstance || window.app;
        app.state.portfolio.unshift({
            id: Date.now(),
            title: "New Node",
            cats: ["nexus"],
            type: "Portal",
            link: "#",
            icon: "fa-rocket",
            hasImages: false,
            assets: [],
            featured: false
        });
        this.switchToolkitTab('repository', app);
    },

    removeNode: function (i, appInstance) {
        const app = appInstance || window.app;
        app.state.portfolio.splice(i, 1);
        this.switchToolkitTab('repository', app);
    },

    addAsset: function (k, appInstance) {
        const app = appInstance || window.app;
        if (!app.state.galleries[k]) app.state.galleries[k] = [];
        app.state.galleries[k].unshift({
            id: Date.now(),
            title: "New Visual",
            type: "Asset",
            featured: false,
            image: "https://via.placeholder.com/800x600"
        });
        this.switchToolkitTab('galleries', app);
    },

    removeAsset: function (k, idx, appInstance) {
        const app = appInstance || window.app;
        if (app.state.galleries[k]) {
            app.state.galleries[k].splice(idx, 1);
        }
        this.switchToolkitTab('galleries', app);
    },

    createPersona: function (appInstance) {
        const app = appInstance || window.app;
        const id = 'p_' + Date.now();
        app.state.personas[id] = {
            label: "New",
            tag: "Identity",
            title: "New Protocol",
            desc: "Brief.",
            icon: "fa-rocket",
            pTitle: "Stage",
            pContent: "Content.",
            focus: "None",
            metric: "None",
            template: "text"
        };
        app.renderNavigation();
        this.switchToolkitTab('persona', app);
        this.openPersonaEditor(id, app);
    }
};

window.CmsToolkitComponent = CmsToolkitComponent;
