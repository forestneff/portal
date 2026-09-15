/**
 * Sandbox Component
 * Manages the interactive prototype sandbox environment, supporting:
 * 1. LockIt Engine v2 interactive astrolabe canvas
 * 2. Woo Way & external project iframe embeds
 * 3. Google Photos gallery masonry fallback
 */
const SandboxComponent = {
    initSandbox: function (appInstance) {
        const app = appInstance || window.app;
        const sel = document.getElementById('sandbox-selector');
        if (!sel) return;

        sel.innerHTML = '';

        // 1. ADD LOCKIT (Default)
        const lockitOpt = document.createElement('option');
        lockitOpt.value = "lockit_local";
        lockitOpt.text = "LockIt Engine v2 (Dev)";
        sel.add(lockitOpt);

        // 2. ADD WOO WAY (Top of Connected Stack)
        const wooWay = app.state.portfolio.find(p => p.id === 1);
        if (wooWay) {
            const opt = document.createElement('option');
            opt.value = JSON.stringify({ url: wooWay.sandboxLink || wooWay.link, id: wooWay.id });
            opt.text = wooWay.title;
            sel.add(opt);
        }

        // 3. ADD OTHERS
        app.state.portfolio.forEach(p => {
            if (p.id !== 1 && p.link && p.link !== '#' && !p.link.includes('medium.com')) {
                const opt = document.createElement('option');
                opt.value = JSON.stringify({ url: p.sandboxLink || p.link, id: p.id });
                opt.text = p.title;
                sel.add(opt);
            }
        });

        // Set Default to LockIt
        sel.value = "lockit_local";
        this.switchSandbox("lockit_local", app);

        // Reveal The Widget
        const widget = document.getElementById('sandbox-widget');
        if (widget) {
            widget.classList.remove('opacity-0');
            if (app.observer) app.observer.observe(widget);
        }
    },

    switchSandbox: function (val, appInstance) {
        const app = appInstance || window.app;
        const frameContainer = document.getElementById('sandbox-iframe-container');
        const frame = document.getElementById('sandbox-frame');
        const galleryContainer = document.getElementById('sandbox-gallery-container');
        const galleryGrid = document.getElementById('sandbox-gallery-grid');
        const lockitContainer = document.getElementById('sandbox-lockit-container');

        if (window.LockItWidget) {
            window.LockItWidget.stop();
        }
        if (lockitContainer) lockitContainer.classList.add('hidden');

        if (val === 'default') {
            if (frameContainer) frameContainer.classList.remove('hidden');
            if (galleryContainer) galleryContainer.classList.add('hidden');
            if (frame) frame.src = 'https://www.forestneff.com/wooway/';
            return;
        }

        if (val === 'lockit_local') {
            if (frameContainer) frameContainer.classList.add('hidden');
            if (galleryContainer) galleryContainer.classList.add('hidden');
            if (lockitContainer) lockitContainer.classList.remove('hidden');
            if (window.LockItWidget) window.LockItWidget.init();
            return;
        }

        const data = JSON.parse(val);
        const project = app.state.portfolio.find(p => p.id === data.id);
        if (!project) return;

        const isGooglePhotos = project.link.includes('photos.app.goo.gl') || project.link.includes('googleusercontent');

        if (isGooglePhotos) {
            if (frameContainer) frameContainer.classList.add('hidden');
            if (galleryContainer) galleryContainer.classList.remove('hidden');

            let imagesHTML = '';

            if (project.metaImage) {
                imagesHTML += `<div class="mb-4 break-inside-avoid rounded-2xl overflow-hidden shadow-lg"><img src="${project.metaImage}" class="w-full h-auto" alt="Preview"></div>`;
            }

            project.cats.forEach(cat => {
                if (app.state.galleries[cat]) {
                    app.state.galleries[cat].forEach(img => {
                        imagesHTML += `<div class="mb-4 break-inside-avoid rounded-2xl overflow-hidden shadow-lg"><img src="${img.image}" class="w-full h-auto" alt="${img.title || 'Image'}"></div>`;
                    });
                }
            });

            if (!imagesHTML) {
                imagesHTML = `<div class="text-center py-20"><p class="text-stone-400 mb-4">Gallery preview unavailable.</p><a href="${project.link}" target="_blank" class="px-6 py-3 bg-stone-900 text-white rounded-full text-xs uppercase font-bold tracking-widest">Open in Google Photos</a></div>`;
            } else {
                imagesHTML += `<div class="w-full text-center pt-12 pb-8 break-inside-avoid"><a href="${project.link}" target="_blank" class="px-8 py-4 bg-stone-900 text-white rounded-full text-xs uppercase font-bold tracking-widest shadow-xl hover:bg-emerald-800 transition-all">View Full Album <i class="fa-solid fa-arrow-up-right-from-square ml-2"></i></a></div>`;
            }

            if (galleryGrid) galleryGrid.innerHTML = imagesHTML;

        } else {
            if (galleryContainer) galleryContainer.classList.add('hidden');
            if (frameContainer) frameContainer.classList.remove('hidden');
            if (frame) frame.src = data.url;
        }
    },

    updateSandbox: function (url, title, appInstance) {
        const app = appInstance || window.app;
        const p = app.state.portfolio.find(item => item.link === url || item.sandboxLink === url);
        const selector = document.getElementById('sandbox-selector');

        if (p) {
            const val = JSON.stringify({ url: url, id: p.id });
            if (selector) selector.value = val;
            this.switchSandbox(val, app);
        } else {
            const frameContainer = document.getElementById('sandbox-iframe-container');
            const galleryContainer = document.getElementById('sandbox-gallery-container');
            const frame = document.getElementById('sandbox-frame');
            if (frameContainer) frameContainer.classList.remove('hidden');
            if (galleryContainer) galleryContainer.classList.add('hidden');
            if (frame) frame.src = url;
        }
    }
};

window.SandboxComponent = SandboxComponent;
