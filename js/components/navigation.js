/**
 * Navigation Component
 * Controls desktop and mobile navigation rendering, mobile drawer toggling,
 * smooth scrolling, and scroll-spy intersection observers.
 */
const NavigationComponent = {
    renderNavigation: function (appInstance) {
        const app = appInstance || window.app;
        const nav = document.getElementById('nav-container');
        const mob = document.getElementById('mobile-nav');
        if (!nav || !mob) return;
        nav.innerHTML = '';
        mob.innerHTML = '';

        Object.keys(app.state.personas).forEach(key => {
            if (!app.hasContent(key)) return;
            const p = app.state.personas[key];

            const b = document.createElement('button');
            b.className = `nav-link relative text-[10px] uppercase tracking-[0.25em] font-bold text-stone-400 hover:text-stone-900 transition-all pb-1 px-1 font-sans`;
            b.id = `nav-link-${key}`;
            b.innerText = p.label;
            b.onclick = () => app.scrollToPersona(key);
            nav.appendChild(b);

            const mbtn = document.createElement('button');
            mbtn.className = "text-left py-4 font-bold uppercase tracking-widest text-stone-500 border-b border-stone-100 font-sans";
            mbtn.innerText = p.label;
            mbtn.onclick = () => {
                app.scrollToPersona(key);
                app.toggleMobileMenu();
            };
            mob.appendChild(mbtn);
        });
    },

    toggleMobileMenu: function () {
        const mob = document.getElementById('mobile-nav');
        if (mob) mob.classList.toggle('hidden');
    },

    scrollToPersona: function (key) {
        const el = document.getElementById(`section-${key}`);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    },

    setupScrollObserver: function (appInstance) {
        const app = appInstance || window.app;
        if (app.observer) app.observer.disconnect();

        const options = { threshold: 0.25 };
        app.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const target = entry.target;
                if (entry.isIntersecting) {
                    target.classList.add('visible');
                    target.classList.remove('exit');
                    const id = target.id.split('-')[1];
                    if (id && app.state.personas[id]) {
                        document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
                        const btn = document.getElementById(`nav-link-${id}`);
                        if (btn) btn.classList.add('active');
                    }
                } else {
                    if (entry.boundingClientRect.top < 0) target.classList.add('exit');
                    target.classList.remove('visible', 'active');
                }
                const children = target.querySelectorAll('.roll-item');
                children.forEach((c, i) => {
                    if (entry.isIntersecting) setTimeout(() => c.classList.add('revealed'), i * 80);
                });
            });
        }, options);

        document.querySelectorAll('.reveal-node').forEach(el => app.observer.observe(el));
    }
};

window.NavigationComponent = NavigationComponent;
