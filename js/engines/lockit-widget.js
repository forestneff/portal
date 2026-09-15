/**
 * LockIt Widget (Interactive Sandbox Celestial Engine)
 */
const LockItWidget = {
    canvas: null,
    ctx: null,
    active: false,
    reqId: null,
    visualTime: new Date(),
    dilation: 0, // Current speed multiplier (starts paused)
    lastFrameTime: 0,

    init: function () {
        this.canvas = document.getElementById('sandbox-lockit-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        // Set initial visual time to Now if not set
        if (!this.visualTime) this.visualTime = new Date();

        // Initialize Controls
        this.resetNow();

        // Set dimensions
        this.resize();
        window.addEventListener('resize', () => {
            if (this.active) this.resize();
        });

        this.active = true;
        this.lastFrameTime = performance.now();
        this.animate(this.lastFrameTime);
    },

    stop: function () {
        this.active = false;
        if (this.reqId) cancelAnimationFrame(this.reqId);
    },

    resize: function () {
        if (!this.canvas || !this.canvas.parentElement) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    },

    // --- INPUT HANDLERS ---

    setSpeed: function (val) {
        const v = parseFloat(val);
        const displayEl = document.getElementById('lockit-speed-display');

        if (Math.abs(v) < 0.1) {
            this.dilation = 0;
            if (displayEl) {
                displayEl.innerText = "PAUSED";
                displayEl.className = "text-[9px] text-stone-500 font-mono bg-stone-900/20 px-1.5 py-0.5 rounded border border-stone-500/20 min-w-[30px] text-center";
            }
        } else {
            const power = Math.abs(v);
            this.dilation = Math.sign(v) * Math.pow(10, power);

            // Formatting display
            let label = Math.abs(this.dilation).toFixed(1) + "x";
            if (Math.abs(this.dilation) > 100) label = Math.abs(this.dilation).toFixed(0) + "x";
            if (Math.abs(this.dilation) > 1000) label = (Math.abs(this.dilation) / 1000).toFixed(1) + "kx";

            const colorClass = v > 0 ? "text-emerald-400 bg-emerald-900/20 border-emerald-500/20" : "text-amber-400 bg-amber-900/20 border-amber-500/20";

            if (displayEl) {
                displayEl.innerText = (v < 0 ? "-" : "") + label;
                displayEl.className = `text-[9px] font-mono px-1.5 py-0.5 rounded border min-w-[30px] text-center ${colorClass}`;
            }
        }
    },

    snapToZero: function (el) {
        if (Math.abs(el.value) < 0.25) {
            el.value = 0;
            this.setSpeed(0);
        }
    },

    jumpToDate: function (isoString) {
        if (!isoString) return;
        this.visualTime = new Date(isoString);
    },

    resetNow: function () {
        this.visualTime = new Date();
        this.dilation = 1; // Default to realtime

        const shuttle = document.getElementById('lockit-shuttle');
        if (shuttle) {
            shuttle.value = 0;
            this.setSpeed(0);
        }

        this.updateDateInput();
    },

    updateDateInput: function () {
        const inp = document.getElementById('lockit-date-input');
        if (!inp) return;

        const d = this.visualTime;
        const offset = d.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(d - offset)).toISOString().slice(0, 16);
        inp.value = localISOTime;
    },

    animate: function (now) {
        if (!this.active) return;

        const delta = now - this.lastFrameTime;
        this.lastFrameTime = now;

        // Apply Time Dilation
        if (this.dilation !== 0) {
            const timeShift = delta * this.dilation;
            this.visualTime = new Date(this.visualTime.getTime() + timeShift);
        }

        // Update Debug Text & HUD
        const timeEl = document.getElementById('lockit-widget-time');
        const dateEl = document.getElementById('lockit-widget-date');

        if (timeEl) timeEl.innerText = this.visualTime.toLocaleTimeString();
        if (dateEl) {
            dateEl.innerText = this.visualTime.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.35;

        this.drawHighFidelityAstrolabe(cx, cy, radius, this.visualTime);

        this.reqId = requestAnimationFrame((t) => this.animate(t));
    },

    // High Fidelity Rendering
    drawHighFidelityAstrolabe: function (cx, cy, radius, date) {
        this.ctx.save();
        this.ctx.translate(cx, cy);

        // Grid Lines
        this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
        this.ctx.lineWidth = 1;

        // Zodiac Rings
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, radius * (0.8 + (i * 0.2)), 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Sector Lines
        for (let i = 0; i < 12; i++) {
            const ang = (i / 12) * Math.PI * 2;
            this.ctx.beginPath();
            this.ctx.moveTo(Math.cos(ang) * (radius * 0.2), Math.sin(ang) * (radius * 0.2));
            this.ctx.lineTo(Math.cos(ang) * (radius * 1.4), Math.sin(ang) * (radius * 1.4));
            this.ctx.stroke();
        }

        const planets = [
            { name: 'Moon', period: 28, r: 0.35, color: '#e5e7eb', size: 8 },
            { name: 'Mercury', period: 88, r: 0.45, color: '#9ca3af', size: 6 },
            { name: 'Venus', period: 225, r: 0.55, color: '#facc15', size: 7 },
            { name: 'Sun', period: 365, r: 0.65, color: '#fbbf24', size: 14, glow: true },
            { name: 'Mars', period: 687, r: 0.75, color: '#ef4444', size: 7 },
            { name: 'Jupiter', period: 4333, r: 0.9, color: '#fb923c', size: 12 },
            { name: 'Saturn', period: 10759, r: 1.05, color: '#eab308', size: 10 }
        ];

        planets.forEach(p => {
            const orbitR = radius * p.r;
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            this.ctx.arc(0, 0, orbitR, 0, Math.PI * 2);
            this.ctx.stroke();

            const dayOfYear = (date.getTime() / (1000 * 3600 * 24));
            const ang = (dayOfYear / p.period) * 2 * Math.PI;
            const px = Math.cos(ang) * orbitR;
            const py = Math.sin(ang) * orbitR;

            this.ctx.beginPath();
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = p.glow ? 20 : 0;
            this.ctx.shadowColor = p.color;
            this.ctx.arc(px, py, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Orbit Label
            this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
            this.ctx.font = '8px monospace';
            this.ctx.fillText(p.name, px + 10, py);

            this.ctx.shadowBlur = 0;
        });

        this.ctx.restore();
    }
};

window.LockItWidget = LockItWidget;
