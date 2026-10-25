/**
 * Modals Component
 * Controls public modals (Project details, related assets selector),
 * admin authentication login, and global keyboard shortcuts (Escape, Enter).
 */
const ModalsComponent = {
    openProjectModal: function (idx, appInstance) {
        const app = appInstance || window.app;
        const p = app.state.portfolio[idx];
        if (!p) return;

        // Auto-switch Sandbox if valid
        if (app.isValidLink(p.link) && p.link !== '#' && !p.link.includes('medium.com')) {
            const targetUrl = p.sandboxLink || p.link;
            app.updateSandbox(targetUrl, p.title);
        }

        const content = document.getElementById('project-modal-content');
        let buttons = '';

        if (app.isValidLink(p.link)) {
            buttons += `<a href="${p.link}" target="_blank" class="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200 hover:border-stone-900 transition-all group w-full md:w-auto"><span class="text-xs font-bold uppercase tracking-widest text-stone-500 group-hover:text-stone-900">Visit</span><i class="fa-solid fa-arrow-up-right-from-square text-stone-300 group-hover:text-emerald-800"></i></a>`;
        }

        if (app.isValidLink(p.link) && p.link !== '#') {
            const targetUrl = p.sandboxLink || p.link;
            buttons += `<button onclick="app.updateSandbox('${targetUrl}', '${p.title}'); document.getElementById('project-modal').classList.add('hidden'); document.getElementById('sandbox-widget').scrollIntoView({behavior: 'smooth'});" class="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200 hover:bg-emerald-100 transition-all group w-full md:w-auto"><span class="text-xs font-bold uppercase tracking-widest text-emerald-800 group-hover:text-emerald-900">Launch in Sandbox</span><i class="fa-solid fa-rocket text-emerald-600 group-hover:text-emerald-800"></i></button>`;
        }

        if (app.isValidLink(p.doc)) {
            buttons += `<a href="${p.doc}" target="_blank" class="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200 hover:border-stone-900 transition-all group w-full md:w-auto"><span class="text-xs font-bold uppercase tracking-widest text-stone-500 group-hover:text-stone-900">Documentation</span><i class="fa-solid fa-file-lines text-stone-300 group-hover:text-emerald-800"></i></a>`;
        }

        if (app.isValidLink(p.repo)) {
            buttons += `<a href="${p.repo}" target="_blank" class="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200 hover:border-stone-900 transition-all group w-full md:w-auto"><span class="text-xs font-bold uppercase tracking-widest text-stone-500 group-hover:text-stone-900">Source Code</span><i class="fa-brands fa-github text-stone-300 group-hover:text-emerald-800"></i></a>`;
        }

        const validAssets = (p.assets || []).filter(a => app.isValidLink(a.url));
        if (validAssets.length > 0) {
            buttons += `<button onclick="app.openAssetSelector(${idx})" class="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-all group w-full col-span-1 sm:col-span-2"><span class="text-xs font-bold uppercase tracking-widest text-emerald-800 group-hover:text-emerald-900">Related Assets</span><i class="fa-solid fa-layer-group text-emerald-600 group-hover:text-emerald-800"></i></button>`;
        }

        if (content) {
            content.innerHTML = `<div class="flex flex-col md:flex-row gap-8 md:gap-16"><div class="md:w-1/3 flex flex-col items-center text-center"><div class="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] md:rounded-[2.5rem] bg-stone-100 flex items-center justify-center text-stone-400 mb-6 md:mb-8 shadow-inner"><i class="fa-solid ${p.icon} text-4xl md:text-5xl"></i></div><span class="text-[10px] font-bold uppercase tracking-widest text-emerald-800 mb-3 font-sans">${p.type} Node</span><h2 class="font-serif text-3xl md:text-5xl font-bold text-stone-900 leading-tight">${p.title}</h2></div><div class="md:w-2/3 space-y-8 md:space-y-10"><p class="text-lg md:text-xl text-stone-600 font-light leading-relaxed font-serif">${p.desc}</p><div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10 border-t border-stone-100 font-sans w-full">${buttons}</div></div></div>`;
        }

        const modal = document.getElementById('project-modal');
        if (modal) modal.classList.remove('hidden');
    },

    closeProjectModal: function () {
        const modal = document.getElementById('project-modal');
        if (modal) modal.classList.add('hidden');
    },

    openAssetSelector: function (idx, appInstance) {
        const app = appInstance || window.app;
        const p = app.state.portfolio[idx];
        if (!p) return;
        const validAssets = (p.assets || []).filter(a => app.isValidLink(a.url));
        const content = document.getElementById('asset-selector-content');
        if (content) {
            content.innerHTML = validAssets.map(a =>
                `<a href="${a.url}" target="_blank" class="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200 hover:border-stone-900 transition-all group w-full"><span class="text-xs font-bold text-stone-900">${a.label}</span><i class="fa-solid fa-arrow-up-right-from-square text-stone-400 group-hover:text-emerald-800"></i></a>`
            ).join('');
        }
        const modal = document.getElementById('asset-selector-modal');
        if (modal) modal.classList.remove('hidden');
    },

    closeAssetSelector: function () {
        const modal = document.getElementById('asset-selector-modal');
        if (modal) modal.classList.add('hidden');
    },

    toggleLogin: function () {
        const form = document.getElementById('login-form');
        if (!form) return;
        form.classList.toggle('hidden');
        const passField = document.getElementById('admin-pass');
        if (passField && !form.classList.contains('hidden')) {
            passField.focus();
        }
    },

    checkLogin: function (appInstance) {
        const app = appInstance || window.app;
        const passField = document.getElementById('admin-pass');
        if (!passField) return;
        const p = passField.value;
        if (p === 'admin' || p === 'frsh') {
            app.openToolkit();
            passField.value = '';
        }
    },

    setupGlobalEvents: function (appInstance) {
        const app = appInstance || window.app;
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const projEdit = document.getElementById('project-editor-overlay');
                const personaEdit = document.getElementById('persona-editor-overlay');

                if (projEdit && !projEdit.classList.contains('hidden')) {
                    app.closeProjectEditor();
                } else if (personaEdit && !personaEdit.classList.contains('hidden')) {
                    app.closePersonaEditor();
                } else {
                    const assetModal = document.getElementById('asset-selector-modal');
                    const projModal = document.getElementById('project-modal');
                    const tkModal = document.getElementById('toolkit-modal');
                    const loginForm = document.getElementById('login-form');

                    if (assetModal) assetModal.classList.add('hidden');
                    if (projModal) projModal.classList.add('hidden');
                    if (tkModal) tkModal.classList.add('hidden');
                    if (loginForm) loginForm.classList.add('hidden');
                }
            }
            if (e.key === 'Enter') {
                const loginForm = document.getElementById('login-form');
                if (loginForm && !loginForm.classList.contains('hidden')) {
                    app.checkLogin();
                }
            }
        });
    }
};

window.ModalsComponent = ModalsComponent;
