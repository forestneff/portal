/**
 * Forest Neff Portal - Default Data & Schema
 */
const defaults = {
    config: {
        theme: 'stone',
        animSpeed: '1.2s',
        bgImage: '',
        fontHead: 'Cormorant Garamond',
        fontBody: 'Inter',
        lockitMode: 'astrolabe'
    },
    profile: {
        name: "Forest Neff",
        image: "https://www.forestneff.com/wooway/ProfilePicture.png",
        email: "forestneff@gmail.com",
        site: "https://forestneff.com",
        bio: [
            "A systems-driven professional with broad, multidisciplinary expertise across building, design, and philosophy.",
            "Author of 'Woo Way', exploring the fractal patterns of nature through science and spirituality.",
            "Expert at analyzing, modeling, and implementing efficient strategies for complex interdependent systems."
        ],
        socials: [
            { name: 'instagram', link: 'https://instagram.com/woowaybook' },
            { name: 'medium', link: 'https://medium.com/@forestneff' },
            { name: 'patreon', link: 'https://www.patreon.com/ForestNeff' }
        ]
    },
    personas: {
        nexus: {
            label: "Nexus",
            tag: "Integrated Intelligence",
            title: "Architecting Harmony through Connectivity.",
            desc: "Bridging technical strategy with the unique needs of creators and organizations.",
            icon: "fa-atom",
            pTitle: "Noteworthy Projects",
            template: "slides",
            pContent: "Aggregating years of inquiry into psychological systems."
        },
        author: {
            label: "Author",
            tag: "Literature & Philosophy",
            title: "Woo Way & Other Written Works",
            desc: "Forest Neff is a lifelong learner and a modern mystic with a deep love and reverence for nature, art, philosophy, science, people, and the many theories of the mind. He is a student of psychology, design, and computer science, and an avid reader of works ranging from classical antiquity to modern research.",
            icon: "fa-book-open",
            slideTitle: "Literature Deck",
            template: "slides",
            pContent: "'Woo Way' traces time from prehistory to the present."
        },
        consultant: {
            label: "Consultant",
            tag: "Strategic Operations",
            title: "Models = Efficiency \nin Complex Systems.",
            desc: "Strategic operational modeling for digital transformations and system integration.",
            icon: "fa-brain-circuit",
            slideTitle: "Operational Models",
            template: "slides",
            pContent: "Specialized in revenue optimization and logistical management."
        },
        designer: {
            label: "Design",
            tag: "Digital Architecture",
            title: "Clean UI/UX for Technical Literacy.",
            desc: "Facilitating accessibility through high-performance web environments.",
            icon: "fa-code",
            slideTitle: "Interface Assets",
            template: "slides",
            pContent: "Building solution-oriented portals like 'Lockit' and 'MM'."
        },
        artist: {
            label: "Art",
            tag: "Aesthetic Resonance",
            title: "Fine Art.",
            desc: "A collection of art, my own, other's, old, and new.",
            icon: "fa-palette",
            slideTitle: "Visual Narrative",
            template: "gallery",
            pContent: "Exploring the layers of light, time, life, and consciousness."
        },
        builder: {
            label: "Builder",
            tag: "Structural Foundations",
            title: "Architectural Design & Artisan Crafting.",
            desc: "Extensive construction management and CAD-assisted structural drafting.",
            icon: "fa-hammer",
            slideTitle: "Structural Logic",
            template: "gallery",
            pContent: "Architectural drafting, construction management, and sustainable aesthetics."
        },
        visionary: {
            label: "Visionary",
            tag: "Planetary Strategy",
            title: "Engineering the Now.",
            desc: "Developing high-leverage frameworks for climate risk management and resilience.",
            icon: "fa-eye",
            slideTitle: "Future Systems",
            template: "slides",
            pContent: "Leveraging deep structural causal modeling and advanced AI."
        },
        identity: {
            label: "Identity",
            tag: "The Core Self",
            title: "Identity and Integrated Values.",
            desc: "The biographic intersection of career, philosophy, and personal growth.",
            icon: "fa-fingerprint",
            slideTitle: "Woo",
            template: "text",
            pContent: "Striving for mutuality, clear communication, and excellence."
        }
    },
    portfolio: [
        {
            id: 1,
            title: "Woo Way - Manuscript",
            cats: ["author", "identity", "nexus"],
            type: "Literature",
            icon: "fa-book",
            featured: true,
            featuredIn: ["author", "visionary"],
            link: "https://www.forestneff.com/wooway/",
            doc: "https://www.forestneff.com/wooway/epk.pdf",
            desc: "“Woo Way” is a book about interconnectivity - a modern mystic’s musings on the nature of life, consciousness, and the cosmos. It travels through time, from prehistory into the present moment, and across the intricate landscapes of our inner and outer worlds, following the patterns and flow of the natural world along the way.",
            assets: [
                { label: "BookFunnel Download", url: "https://dl.bookfunnel.com/e3sflxevp0" },
                { label: "Amazon Link", url: "#" },
                { label: "Goodreads Profile", url: "#" }
            ]
        },
        {
            id: 2,
            title: "Multi-Map",
            cats: ["designer", "nexus", "visionary"],
            type: "Metaverse Architecture",
            icon: "fa-network-wired",
            featured: true,
            featuredIn: ["visionary", "designer"],
            link: "https://mm.forestneff.com",
            repo: "https://github.com/forestneff/meta-mind-core",
            doc: "https://mm.forestneff.com/wiki.html",
            desc: "An AI-Native Federated Mapstate Metaverse. A groundbreaking platform uniting mind-mapping, real-time AI, persistent mapstate technology, and immersive, modular canvas experiences. Anchored by a persistent, federated meta-database, it ensures every node, connection, and agentic contribution is versioned, auditable, and ready for global-scale interaction.",
            assets: [
                { label: "AI Thread", url: "https://gemini.google.com/share/d1cbb1c94f6e" },
                { label: "Tech Stack Overview", url: "#" }
            ]
        },
        {
            id: 3,
            title: "Aethon",
            cats: ["visionary", "nexus"],
            type: "Strategic Initiative",
            icon: "fa-bolt",
            featured: false,
            featuredIn: ["visionary"],
            link: "https://www.forestneff.com/aethon/",
            desc: "Project Aethon is the conceptual framework for a revolutionary explorer vessel designed to achieve unprecedented operational independence and geographical access. The core mission is to replace multiple single-mode vehicles (yachts, helicopters, submersibles) with a single, highly adaptable platform, dramatically reducing logistical complexity and environmental footprint.",
            assets: [
                { label: "AI Thread", url: "https://gemini.google.com/share/fa10a5ec3186" },
                { label: "Whitepaper", url: "#" },
                { label: "System Diagram", url: "#" }
            ]
        },
        {
            id: 4,
            title: "Medium Insights",
            cats: ["author"],
            type: "Essays",
            icon: "fa-medium",
            featured: false,
            featuredIn: ["author"],
            link: "https://medium.com/@forestneff",
            desc: "A curated collection of philosophical inquiries and modern mystic musings. These essays dissect the intersection of personal development and systems theory, offering actionable frameworks for navigating the 'Pattern Language' of daily existence.",
            assets: [
                { label: "Top Article PDF", url: "#" },
                { label: "Substack Mirror", url: "#" }
            ]
        },
        {
            id: 5,
            title: "Righteous Connections",
            cats: ["visionary", "consultant", "designer", "nexus"],
            type: "Strategic Lab",
            icon: "fa-moon",
            featuredIn: ["visionary", "consultant"],
            link: "https://rc.forestneff.com",
            repo: "https://github.com/forestneff/RC",
            desc: "Righteous Connections drives economic, educational, emotional, & social growth to our community and beyond. Forest Neff works as a web designer and AI consultant for the launch of Righteous Connections (RC). The RC webportal integrates their mission, timeline, sponsors, member organizations, and offerings.",
            assets: [
                { label: "Client Onboarding Doc", url: "#" },
                { label: "API Documentation", url: "#" }
            ]
        },
        {
            id: 6,
            title: "FrshPaint Portal",
            cats: ["consultant", "designer", "artist", "nexus"],
            type: "Case Study",
            icon: "fa-moon",
            featuredIn: ["consultant"],
            link: "https://frshpaint.com",
            repo: "https://github.com/forestneff/art-portfolio-template",
            doc: "https://docs.google.com/document/d/134ozLheN4T6qec5OBJJO_9ftqpNHS8WkuPVCNTyOOmw/edit?usp=sharing",
            desc: "A digital gallery implementing 'Visual Semantic Search'. FrshPaint is not just an archive but a taxonomic engine, using metadata to map the aesthetic relationships between traditional texture and digital precision.",
            assets: [
                { label: "Brand Guidelines (PDF)", url: "#" },
                { label: "Case Study Video", url: "#" }
            ]
        },
        {
            id: 7,
            title: "Climate Management: The Albedo-Aerosol-BTU Tango",
            cats: ["visionary", "author", "nexus"],
            type: "Research Paper",
            icon: "fa-file-contract",
            featured: true,
            featuredIn: ["visionary"],
            link: "https://www.forestneff.com/climate/",
            desc: "A meta-analysis introducing the Risk Management-Enabled Climate Adjustment System (RMCAS). Validates the technical feasibility of co-opting industrial infrastructure for atmospheric intervention, quantifying localized AHF (>3.0 W/m²) as a high-leverage adjustment mechanism.",
            assets: [
                { label: "Full Article (GDocs)", url: "https://docs.google.com/document/d/1AChu5FXAPYVgxYCMbO1Ezr-xvYkDpuU6KuqUDMauJQQ/edit?usp=sharing" },
                { label: "AI Thread", url: "https://gemini.google.com/share/d798f67c23aa" },
                { label: "Full PDF Download", url: "#" },
                { label: "Citation Reference", url: "#" }
            ]
        },
        {
            id: 8,
            title: "LockIt Astrolabe",
            cats: ["designer", "nexus"],
            type: "Engine",
            icon: "fa-compact-disc",
            featured: true,
            featuredIn: ["designer"],
            link: "https://forestneff.com/lockit",
            doc: "https://docs.google.com/document/d/1kk4RUqxLIVyKbPEi23aL5eiaft6OceoX3OxUGqMxul8/edit?usp=sharing",
            desc: "A high-fidelity, web-based visualization engine redefining the astrolabe for the digital age. Merging real-time audio analysis with heliocentric planetary motion, LockIt features a proprietary time-scaling engine (up to 1,000,000x dilation) and sound-reactive radial visualization.",
            assets: [
                { label: "AI Thread", url: "https://gemini.google.com/share/ec535cb6b700" },
                { label: "Tech Specs", url: "#" }
            ]
        },
        {
            id: 9,
            title: "Building Portfolio",
            cats: ["builder"],
            type: "Google Gallery",
            icon: "fa-hammer",
            featuredIn: ["builder"],
            link: "https://photos.app.goo.gl/tAprbdCmW3BWDoKG9",
            desc: "A retrospective of structural and architectural projects. From timber-frame craftsmanship to modern CAD-assisted drafting, this portfolio documents the physical manifestation of systems thinking in the built environment.",
            assets: [
                { label: "Timber Frame Specs (PDF)", url: "#" },
                { label: "CAD Overlay Example", url: "#" }
            ]
        },
        {
            id: 10,
            title: "Fine Art Portfolio",
            cats: ["artist"],
            type: "Gallery",
            icon: "fa-palette",
            featured: true,
            featuredIn: ["artist"],
            link: "https://photos.app.goo.gl/yofWFC6KkZcLC6Ls7",
            desc: "A collection of some of my paintings, mixed-media color studies, digital, and woodcrafted art.",
            assets: [
                { label: "Gallery Catalog (PDF)", url: "#" },
                { label: "High-Res Texture Pack", url: "#" }
            ]
        }
    ],
    galleries: {
        builder: [],
        artist: []
    }
};

window.defaults = defaults;
