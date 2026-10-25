/**
 * LockIt Dynamic Engine v2.6 (Background Astrolabe / Analog Clock Canvas)
 */
const LockItEngine = {
    canvas: null,
    ctx: null,
    lastTime: 0,
    clockTime: new Date(),
    visualTime: new Date(),
    lastScrollY: 0,
    isScrubbing: false,
    scrubTimeout: null,
    config: {
        dilation: 1.0,
        mode: 'astrolabe',
        scrollImpact: 500000,
        smoothFactor: 0.08
    },

    init: function () {
        this.canvas = document.getElementById('lockit-bg');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        window.addEventListener('scroll', () => {
            this.isScrubbing = true;
            const currentY = window.scrollY;

            if (currentY === 0) {
                this.clockTime = new Date();
            } else {
                const delta = currentY - this.lastScrollY;
                const timeShift = delta * -this.config.scrollImpact;
                this.clockTime = new Date(this.clockTime.getTime() + timeShift);
            }
            this.lastScrollY = currentY;
            clearTimeout(this.scrubTimeout);
            this.scrubTimeout = setTimeout(() => { this.isScrubbing = false; }, 150);
        });
        this.animate();
    },

    resize: function () {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    animate: function (now) {
        const delta = now - this.lastTime || 0;
        this.lastTime = now;

        if (this.config.mode === 'astrolabe') {
            this.config.scrollImpact = 500000;
        } else {
            this.config.scrollImpact = 1000;
        }

        if (!this.isScrubbing) {
            this.clockTime = new Date(this.clockTime.getTime() + delta * this.config.dilation);
        }

        const diff = this.clockTime.getTime() - this.visualTime.getTime();
        if (Math.abs(diff) > 10) {
            this.visualTime = new Date(this.visualTime.getTime() + (diff * this.config.smoothFactor));
        } else {
            this.visualTime = new Date(this.clockTime);
        }

        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.28;

        this.ctx.save();
        this.ctx.translate(cx, cy);
        if (this.config.mode === 'astrolabe') this.drawAstrolabe(radius, this.visualTime);
        else this.drawAnalog(radius, this.visualTime);
        this.ctx.restore();
        requestAnimationFrame((n) => this.animate(n));
    },

    drawAnalog: function (radius, date) {
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--clock-accent').trim();
        const textCol = document.body.classList.contains('theme-dark') ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
        this.ctx.strokeStyle = textCol;
        for (let i = 0; i < 60; i++) {
            const ang = (i / 60) * Math.PI * 2;
            const len = i % 5 === 0 ? 25 : 10;
            this.ctx.beginPath();
            this.ctx.moveTo(Math.cos(ang) * (radius - len), Math.sin(ang) * (radius - len));
            this.ctx.lineTo(Math.cos(ang) * radius, Math.sin(ang) * radius);
            this.ctx.stroke();
        }
        const h = (date.getHours() % 12) + date.getMinutes() / 60;
        const m = date.getMinutes();
        const s = date.getSeconds() + date.getMilliseconds() / 1000;
        this.drawHand((h / 12) * Math.PI * 2, radius * 0.55, 5, textCol);
        this.drawHand((m / 60) * Math.PI * 2, radius * 0.78, 3, textCol);
        this.drawHand((s / 60) * Math.PI * 2, radius * 0.88, 1.5, accent);
    },

    drawAstrolabe: function (radius, date) {
        const themeColor = document.body.classList.contains('theme-dark') ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

        this.ctx.strokeStyle = themeColor;
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 12; i++) {
            const ang = (i / 12) * Math.PI * 2;
            this.ctx.beginPath();
            this.ctx.moveTo(Math.cos(ang) * (radius * 0.3), Math.sin(ang) * (radius * 0.3));
            this.ctx.lineTo(Math.cos(ang) * (radius * 1.2), Math.sin(ang) * (radius * 1.2));
            this.ctx.stroke();
        }

        const planets = [
            { name: 'Moon', period: 28, r: 0.35, color: '#e5e7eb', size: 6 },
            { name: 'Mercury', period: 88, r: 0.45, color: '#9ca3af', size: 4 },
            { name: 'Venus', period: 225, r: 0.55, color: '#facc15', size: 5 },
            { name: 'Sun', period: 365, r: 0.65, color: '#fbbf24', size: 10, glow: true },
            { name: 'Mars', period: 687, r: 0.75, color: '#ef4444', size: 5 },
            { name: 'Jupiter', period: 4333, r: 0.9, color: '#fb923c', size: 8 },
            { name: 'Saturn', period: 10759, r: 1.05, color: '#eab308', size: 7 }
        ];

        planets.forEach(p => {
            const orbitR = radius * p.r;
            this.ctx.beginPath();
            this.ctx.strokeStyle = themeColor;
            this.ctx.arc(0, 0, orbitR, 0, Math.PI * 2);
            this.ctx.stroke();

            const dayOfYear = (date.getTime() / (1000 * 3600 * 24));
            const ang = (dayOfYear / p.period) * 2 * Math.PI;
            const px = Math.cos(ang) * orbitR;
            const py = Math.sin(ang) * orbitR;

            this.ctx.beginPath();
            this.ctx.fillStyle = p.color;
            if (p.glow) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = p.color;
            } else {
                this.ctx.shadowBlur = 0;
            }
            this.ctx.arc(px, py, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        const textCol = document.body.classList.contains('theme-dark') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
        const h = (date.getHours() % 12) + date.getMinutes() / 60;
        const m = date.getMinutes();
        this.drawHand((h / 12) * Math.PI * 2, radius * 0.4, 4, textCol);
        this.drawHand((m / 60) * Math.PI * 2, radius * 0.6, 2, textCol);
    },

    drawHand: function (ang, len, width, color) {
        this.ctx.beginPath();
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;
        this.ctx.lineCap = 'round';
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(Math.cos(ang - Math.PI / 2) * len, Math.sin(ang - Math.PI / 2) * len);
        this.ctx.stroke();
    }
};

window.LockItEngine = LockItEngine;
