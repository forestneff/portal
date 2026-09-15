/**
 * Persona Sections Component
 * Renders the interactive persona nodes, featured cards, stage tracks (slides, gallery, text),
 * and handles deck expansion and navigation jump-to-featured logic.
 */
const PersonaSectionsComponent = {
    renderPersonaSections: function (appInstance) {
        const app = appInstance || window.app;
        const canvas = document.getElementById('portal-canvas');
        if (!canvas) return;
        canvas.innerHTML = '';

        Object.keys(app.state.personas).forEach(key => {
            if (!app.hasContent(key)) return;
            const p = app.state.personas[key];
            const section = document.createElement('section');
            section.id = `section-${key}`;
            section.className = "reveal-node";

            const catItems = (key === 'nexus') ? app.state.portfolio : (app.state.portfolio || []).filter(item => item.cats && item.cats.includes(key));
            const isIdentity = key === 'identity';

            let cardMarkup = '';
            if (isIdentity) {
                const pr = app.state.profile;
                cardMarkup = `<div class="flex flex-col items-center text-center roll-item"><div class="w-48 h-48 rounded-full overflow-hidden mb-8 border-4 border-white shadow-2xl bg-stone-200"><img src="${pr.image}" class="w-full h-full object-cover" alt="${pr.name}"></div><h3 class="font-serif text-4xl font-bold mb-4 text-stone-900 tracking-tight">${pr.name}</h3><div class="space-y-4 text-stone-500 font-light text-xs max-w-sm font-sans">${pr.bio.map(b => `<p>${b}</p>`).join('')}</div><div class="mt-10 flex gap-4"><a href="mailto:${pr.email}" class="px-6 py-2.5 bg-stone-900 text-stone-50 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-xl font-sans text-stone-50">Email</a><a href="${pr.site}" target="_blank" class="px-6 py-2.5 border border-stone-300 rounded-full text-[9px] font-bold uppercase tracking-widest hover:border-stone-900 transition-all font-sans">Hub</a></div></div>`;
            } else {
                const isNexus = key === 'nexus';
                const featured = catItems.filter(i => isNexus ? i.featured : (i.featured || (i.featuredIn && i.featuredIn.includes(key))));
                const others = catItems.filter(i => !featured.includes(i));
                featured.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

                cardMarkup = `<h3 class="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-8 border-b border-stone-100 pb-4 font-sans font-bold uppercase">${isNexus ? 'Core Initiatives' : 'Key Projects'}</h3>
                <div class="space-y-4 mb-8">
                    ${featured.map((item) => {
                    const originalIdx = app.state.portfolio.findIndex(x => x.id === item.id);
                    const haloClass = item.featured ? 'halo-gold' : 'halo-green';
                    const pulseDelay = Math.random() * 5;
                    const entryDelay = Math.random() * 1.5;

                    let iconHTML = `<i class="fa-solid ${item.icon} text-lg"></i>`;
                    if (item.metaIcon) {
                        iconHTML = `<img src="${item.metaIcon}" class="w-full h-full object-cover rounded-xl" alt="icon">`;
                    }

                    let bgStyle = '';
                    let textClass = 'text-emerald-900';
                    let subTextClass = 'text-emerald-700';

                    let visibleClass = '';
                    if (item.metaImage) {
                        bgStyle = `background-image: url('${item.metaImage}'); background-size: cover; background-position: center;`;
                        textClass = 'hydrated-text';
                        subTextClass = 'hydrated-text opacity-80';
                        visibleClass = 'visible-layer';
                    }

                    return `<div onclick="app.jumpToFeatured(${originalIdx})" data-pid="${item.id}" style="--pulse-delay: ${pulseDelay}s; animation-delay: ${entryDelay}s;" class="group bg-stone-50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-stone-100 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-between roll-item shadow-xl halo-base ${haloClass} w-full relative">
                            <div class="bg-layer ${visibleClass}" style="${bgStyle}"></div>
                            <div class="card-bg-overlay ${item.metaImage ? 'visible-overlay' : ''}"></div>
                            <div class="flex items-center gap-3 md:gap-4 w-full relative z-10">
                                <div class="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-800 group-hover:text-emerald-900 transition-colors shrink-0 overflow-hidden shadow-sm">
                                    ${iconHTML}
                                </div>
                                <div class="min-w-0 flex-1 pr-2">
                                    <h4 class="text-sm font-bold leading-tight text-left font-sans truncate ${textClass}">${item.title}</h4>
                                    <span class="text-[9px] uppercase tracking-widest truncate block ${subTextClass}">${item.type}</span>
                                </div>
                            </div>
                            <i class="fa-solid fa-arrow-right text-emerald-400 group-hover:text-emerald-700 transition-all shrink-0 relative z-10"></i>
                        </div>`;
                }).join('')}
                </div>
                
                ${others.length > 0 ? `
                <div class="border-t border-stone-100 pt-6">
                     <button onclick="app.refreshDecks('${key}'); document.getElementById('archive-${key}').classList.toggle('hidden');" class="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 flex justify-between items-center group">
                        <span>${isNexus ? 'System Archive' : 'Complete List'}</span>
                        <i class="fa-solid fa-chevron-down group-hover:translate-y-1 transition-transform"></i>
                    </button>
                    <div id="archive-${key}" class="hidden space-y-2 mt-4 overflow-y-auto max-h-[300px] pr-2">
                        ${others.map((item) => {
                    const originalIdx = app.state.portfolio.findIndex(x => x.id === item.id);
                    const haloClass = item.featured ? 'halo-gold' : 'halo-green';
                    const pulseDelay = Math.random() * 5;

                    let iconHTML = `<i class="fa-solid ${item.icon}"></i>`;
                    if (item.metaIcon) iconHTML = `<img src="${item.metaIcon}" class="w-full h-full object-cover rounded-lg" alt="icon">`;

                    return `<div onclick="app.openProjectModal(${originalIdx})" data-pid="${item.id}" style="--pulse-delay: ${pulseDelay}s; animation-delay: ${Math.random() * 2}s" class="group p-3 md:p-4 rounded-2xl hover:bg-stone-50 transition-all cursor-pointer flex items-center justify-between border border-transparent hover:border-stone-100 halo-base ${haloClass} w-full">
                                <div class="flex items-center gap-3 w-full">
                                    <div class="w-8 h-8 bg-stone-50 rounded-lg flex items-center justify-center text-stone-400 group-hover:text-emerald-700 text-xs shrink-0 overflow-hidden">${iconHTML}</div>
                                    <h4 class="text-xs font-bold text-stone-600 group-hover:text-stone-900 font-sans truncate">${item.title}</h4>
                                </div>
                            </div>`;
                }).join('')}
                    </div>
                </div>` : ''}`;
            }

            section.innerHTML = `<div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"><div class="lg:col-span-7"><div class="inline-flex items-center gap-3 px-5 py-2 mb-10 border border-emerald-200 bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-[0.25em] rounded-full shadow-sm roll-item font-sans"><i class="fa-solid ${p.icon}"></i> <span>${p.tag}</span></div><h1 class="font-serif text-5xl md:text-8xl leading-[1.05] text-stone-900 mb-10 tracking-tight roll-item">${this.formatTitle(p.title)}</h1><p class="text-xl text-stone-600 font-light max-w-2xl leading-relaxed mb-10 roll-item font-sans">${p.desc}</p></div><div class="lg:col-span-5"><div class="bg-stone-100 rounded-[3rem] md:rounded-[4rem] p-1 border border-stone-200 shadow-inner overflow-hidden min-h-[300px] md:min-h-[550px] flex items-stretch roll-item"><div class="bg-stone-50 rounded-[2.8rem] md:rounded-[3.8rem] p-6 md:p-12 w-full flex flex-col justify-center transition-all duration-700 shadow-xl relative overflow-hidden">${cardMarkup}</div></div></div></div><div class="max-w-7xl mx-auto px-6 mt-40 reveal-node" id="stage-${key}">${this.getStageMarkup(key, p, false, app)}</div>`;
            canvas.appendChild(section);
        });
    },

    getStageMarkup: function (key, p, expanded, appInstance) {
        const app = appInstance || window.app;
        let displayTitle = p.slideTitle || p.pTitle;
        if (!displayTitle) displayTitle = (p.template === 'gallery') ? "Featured Spotlight" : "Strategic Decks";
        const catItems = (key === 'nexus') ? app.state.portfolio : (app.state.portfolio || []).filter(item => item.cats && item.cats.includes(key));

        const isNexus = key === 'nexus';
        const featured = catItems.filter(i => isNexus ? i.featured : (i.featured || (i.featuredIn && i.featuredIn.includes(key))));

        let deckItems = [];
        if (expanded) {
            deckItems = catItems;
        } else {
            deckItems = featured.length > 0 ? featured : catItems.slice(0, 4);
        }

        if (p.template === 'gallery') {
            const gal = app.state.galleries[key] || [];
            const feat = gal.filter(a => a.featured);
            const others = gal.filter(a => !a.featured);
            let slidesHTML = '';
            if (deckItems.length > 0) {
                slidesHTML = `<div class="mb-24"><h2 class="font-serif text-4xl md:text-5xl font-bold mb-8 md:mb-12 italic text-stone-900 tracking-tight roll-item">More <span class="text-emerald-700">Info</span></h2><div class="slide-track py-4">${deckItems.map((item) => {
                    const idx = app.state.portfolio.findIndex(x => x.id === item.id);
                    const haloClass = item.featured ? 'halo-gold' : 'halo-green';
                    const pulseDelay = Math.random() * 5;

                    let iconHTML = `<i class="fa-solid ${item.icon} text-xl md:text-2xl"></i>`;
                    if (item.metaIcon) iconHTML = `<img src="${item.metaIcon}" class="w-full h-full object-cover rounded-xl" alt="icon">`;

                    let bgStyle = '';
                    let textClass = 'text-stone-900';
                    let descClass = 'text-stone-500';

                    if (item.metaImage) {
                        bgStyle = `background-image: url('${item.metaImage}'); background-size: cover; background-position: center;`;
                        textClass = 'hydrated-text';
                        descClass = 'hydrated-text opacity-90';
                    }

                    return `<div onclick="app.openProjectModal(${idx})" data-pid="${item.id}" style="--pulse-delay: ${pulseDelay}s; animation-delay: ${Math.random() * 2}s;" class="slide-card bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-stone-200 shadow-lg roll-item flex flex-col justify-between cursor-pointer hover:shadow-xl transition-all h-[350px] md:h-[400px] halo-base ${haloClass} relative">
                        <div class="bg-layer" style="${bgStyle}"></div>
                        ${item.metaImage ? '<div class="card-bg-overlay"></div>' : ''}
                        <div class="relative z-10">
                            <div class="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 mb-6 shadow-inner overflow-hidden">${iconHTML}</div>
                            <h4 class="font-serif text-2xl md:text-3xl font-bold mb-4 leading-tight ${textClass}">${item.title}</h4>
                            <p class="text-xs font-sans leading-relaxed line-clamp-4 ${descClass}">${item.desc}</p>
                        </div>
                        <div class="pt-6 border-t border-stone-100 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest font-sans relative z-10"><span class="text-stone-400">${item.type}</span><span class="text-emerald-700 font-bold">View Details</span></div>
                    </div>`;
                }).join('')}</div></div>`;
            }
            if (gal.length > 0) {
                return `${slidesHTML}<div class="mb-32"><h2 class="font-serif text-4xl md:text-5xl font-bold mb-8 md:mb-12 italic text-stone-900 tracking-tight roll-item">${displayTitle}</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">${feat.map(a => `<div class="group relative rounded-[2rem] md:rounded-[3.5rem] overflow-hidden aspect-video shadow-2xl bg-stone-200 roll-item"><img src="${a.image}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="${a.title}"><div class="absolute inset-0 bg-emerald-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 md:p-12"><span class="text-emerald-200 font-bold uppercase text-[9px] tracking-widest mb-1 font-sans font-bold">${a.type} View</span><h4 class="text-white font-serif text-3xl md:text-4xl font-bold text-left tracking-tight">${a.title}</h4></div></div>`).join('')}</div></div><div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">${others.map(a => `<div style="animation-delay: ${Math.random() * 2}s" class="asset-card group relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden aspect-square border border-stone-200 shadow-sm bg-stone-100 roll-item halo-base halo-green"><img src="${a.image}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="${a.title}"><div class="asset-overlay absolute inset-0 bg-stone-50/95 flex flex-col items-center justify-center p-4 text-center"><span class="text-[8px] font-bold uppercase text-stone-400 mb-2 font-sans font-bold">${a.type}</span><h5 class="font-serif text-base md:text-xl font-bold leading-tight text-stone-800">${a.title}</h5></div></div>`).join('')}</div>`;
            } else return slidesHTML;
        } else if (p.template === 'slides') {
            return `<div class="mb-32"><h2 class="font-serif text-4xl md:text-5xl font-bold mb-8 md:mb-12 italic text-stone-900 tracking-tight roll-item">${displayTitle}</h2><div class="slide-track py-4">${deckItems.map((item) => {
                const idx = app.state.portfolio.findIndex(x => x.id === item.id);
                const haloClass = item.featured ? 'halo-gold' : 'halo-green';
                const pulseDelay = Math.random() * 5;

                let iconHTML = `<i class="fa-solid ${item.icon} text-xl md:text-2xl"></i>`;
                if (item.metaIcon) iconHTML = `<img src="${item.metaIcon}" class="w-full h-full object-cover rounded-xl" alt="icon">`;

                let bgStyle = '';
                let textClass = 'text-stone-900';
                let descClass = 'text-stone-500';
                if (item.metaImage) {
                    bgStyle = `background-image: url('${item.metaImage}'); background-size: cover; background-position: center;`;
                    textClass = 'hydrated-text';
                    descClass = 'hydrated-text opacity-90';
                }

                return `<div onclick="app.openProjectModal(${idx})" data-pid="${item.id}" style="--pulse-delay: ${pulseDelay}s; animation-delay: ${Math.random() * 2}s; ${bgStyle}" class="slide-card bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-stone-200 shadow-lg roll-item flex flex-col justify-between cursor-pointer hover:shadow-xl transition-all h-[350px] md:h-[400px] halo-base ${haloClass} relative">
                    <div class="bg-layer" style="${bgStyle}"></div>
                    ${item.metaImage ? '<div class="card-bg-overlay"></div>' : ''}
                    <div class="relative z-10">
                        <div class="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 mb-6 shadow-inner overflow-hidden">${iconHTML}</div>
                        <h4 class="font-serif text-2xl md:text-3xl font-bold mb-4 leading-tight ${textClass}">${item.title}</h4>
                        <p class="text-xs font-sans leading-relaxed line-clamp-4 ${descClass}">${item.desc}</p>
                    </div>
                    <div class="pt-6 border-t border-stone-100 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest font-sans relative z-10"><span class="text-stone-400">${item.type}</span><span class="text-emerald-700 font-bold">View Details</span></div>
                </div>`;
            }).join('')}</div></div>`;
        } else {
            return `<div class="max-w-4xl mx-auto py-12 px-6 roll-item"><h3 class="font-serif text-5xl md:text-7xl font-bold mb-8 md:mb-12 text-stone-900 italic underline underline-offset-[16px] decoration-emerald-100 tracking-tight">${p.pTitle}</h3><div class="prose prose-stone prose-lg text-stone-600 font-light leading-loose font-serif">${p.pContent}</div></div>`;
        }
    },

    refreshDecks: function (key, appInstance) {
        const app = appInstance || window.app;
        const p = app.state.personas[key];
        const archive = document.getElementById(`archive-${key}`);
        const isHidden = archive.classList.contains('hidden');
        const expanded = isHidden;

        const container = document.getElementById(`stage-${key}`);
        container.innerHTML = this.getStageMarkup(key, p, expanded, app);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const children = entry.target.querySelectorAll('.roll-item');
                    children.forEach((c, i) => setTimeout(() => c.classList.add('revealed'), i * 50));
                }
            });
        }, { threshold: 0.1 });
        observer.observe(container);
    },

    formatTitle: function (text) {
        return text
            .replace(/Harmony/g, '<span class="italic text-emerald-800">Harmony</span>')
            .replace(/Connectivity/g, '<span class="italic">Connectivity</span>')
            .replace(/Efficiency/g, '<span class="italic text-emerald-800">Efficiency</span>')
            .replace(/Identity/g, '<span class="italic text-emerald-800">Identity</span>')
            .replace(/Planetary/g, '<span class="italic text-emerald-800">Planetary</span>')
            .replace(/Musings/g, '<span class="italic text-emerald-800">Musings</span>');
    },

    renderProfile: function (appInstance) {
        const app = appInstance || window.app;
        const soc = document.getElementById('footer-socials');
        if (soc && app.state && app.state.profile) {
            soc.innerHTML = app.state.profile.socials.map(s =>
                `<a href="${s.link}" target="_blank" class="hover:text-emerald-800 transition-colors"><i class="fa-brands fa-${s.name}"></i></a>`
            ).join('');
        }
    },

    jumpToFeatured: function (idx, appInstance) {
        const app = appInstance || window.app;
        const item = app.state.portfolio[idx];
        const targetCat = item.cats.find(c => c !== 'nexus' && c !== 'identity') || 'nexus';
        app.scrollToPersona(targetCat);
        app.openProjectModal(idx);
    }
};

window.PersonaSectionsComponent = PersonaSectionsComponent;
