/**
 * Surgical Metadata Hydration Service
 * Extracts OpenGraph images and favicons asynchronously via CORS proxy.
 */
const HydrationService = {
    CORS_PROXY: "https://api.allorigins.win/get?url=",

    hydratePortfolio: async function (portfolio, onCommit) {
        if (!portfolio || !Array.isArray(portfolio)) return;

        for (let i = 0; i < portfolio.length; i++) {
            const item = portfolio[i];
            if (!item.link || item.link === '#' || item.hydrated) continue;

            const proxyUrl = this.CORS_PROXY + encodeURIComponent(item.link) + "&timestamp=" + new Date().getTime();

            try {
                const res = await fetch(proxyUrl);
                if (!res.ok) throw new Error("Proxy failed");

                const data = await res.json();
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.contents, "text/html");

                // Extract Metadata
                const ogImage = doc.querySelector('meta[property="og:image"]')?.content ||
                    doc.querySelector('meta[name="twitter:image"]')?.content ||
                    doc.querySelector('link[rel="image_src"]')?.href;

                // Only overwrite icon if not hardcoded (1, 7, 8, 9)
                let cleanIcon = null;
                if (![5, 6, 9, 10].includes(item.id)) {
                    let iconLink = doc.querySelector('link[rel="icon"]')?.href ||
                        doc.querySelector('link[rel="shortcut icon"]')?.href ||
                        doc.querySelector('link[rel="apple-touch-icon"]')?.href;
                    if (iconLink) {
                        try {
                            const urlObj = new URL(item.link);
                            if (iconLink.startsWith('http')) cleanIcon = iconLink;
                            else if (iconLink.startsWith('//')) cleanIcon = 'https:' + iconLink;
                            else cleanIcon = urlObj.origin + (iconLink.startsWith('/') ? '' : '/') + iconLink;
                        } catch (e) { }
                    }
                }

                // DOM UPDATE (Surgical)
                requestAnimationFrame(() => {
                    const cards = document.querySelectorAll(`div[data-pid="${item.id}"]`);
                    cards.forEach(card => {
                        const bgLayer = card.querySelector('.bg-layer');
                        if (ogImage && bgLayer) {
                            const tempImg = new Image();
                            tempImg.onload = () => {
                                item.metaImage = ogImage;
                                bgLayer.style.backgroundImage = `url('${ogImage}')`;
                                bgLayer.style.backgroundSize = 'cover';
                                bgLayer.style.backgroundPosition = 'center';
                                bgLayer.classList.add('visible-layer');

                                if (!card.querySelector('.card-bg-overlay')) {
                                    const ov = document.createElement('div');
                                    ov.className = 'card-bg-overlay';
                                    card.prepend(ov);
                                    setTimeout(() => ov.classList.add('visible-overlay'), 50);
                                } else {
                                    card.querySelector('.card-bg-overlay').classList.add('visible-overlay');
                                }

                                const title = card.querySelector('h4');
                                if (title) title.classList.add('hydrated-text');
                                const desc = card.querySelector('p') || card.querySelector('span');
                                if (desc) desc.classList.add('hydrated-text');
                            };
                            tempImg.src = ogImage;
                        }

                        if (cleanIcon) {
                            item.metaIcon = cleanIcon;
                            const iconContainer = card.querySelector('.w-10, .w-14');
                            if (iconContainer) {
                                iconContainer.innerHTML = `<img src="${cleanIcon}" class="w-full h-full object-cover">`;
                            }
                        }
                    });
                });

                item.hydrated = true;
                if (typeof onCommit === 'function') onCommit();

            } catch (e) {
                // Fallback for Medium / Google Photos if proxy blocked
                if (item.link.includes('medium.com') || item.link.includes('photos.app.goo.gl')) {
                    try {
                        const urlObj = new URL(item.link);
                        const s2Icon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;

                        if (![5, 6, 9, 10].includes(item.id)) {
                            item.metaIcon = s2Icon;
                        }

                        item.hydrated = true;
                        if (typeof onCommit === 'function') onCommit();

                        requestAnimationFrame(() => {
                            const cards = document.querySelectorAll(`div[data-pid="${item.id}"]`);
                            cards.forEach(card => {
                                const iconContainer = card.querySelector('.w-10, .w-14');
                                if (iconContainer && item.metaIcon) {
                                    iconContainer.innerHTML = `<img src="${item.metaIcon}" class="w-full h-full object-cover">`;
                                }
                            });
                        });
                    } catch (err) { }
                }
            }
        }
    }
};

window.HydrationService = HydrationService;
