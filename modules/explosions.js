const EXPLOSION_PRESETS = {
    plasma: { colors: ['#64ffda', '#d333ff', '#aaffff'], maxRadius: 60, particles: 16, particleSize: 3 },
    atomic: { colors: ['#fffb00', '#ff4100', '#fff', '#fd7e14'], maxRadius: 90, particles: 20, particleSize: 5 },
    normal: { colors: ['#64ffda', '#fff', '#11d7b8'], maxRadius: 32, particles: 10, particleSize: 2.5 }
};

export default class ExplosionManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.explosions = [];
        this.typesList = ['plasma', 'atomic', 'normal'];
        this.idxType = 0;
        this.lastFrame = 0;

        this.adjustCanvasSize();
        window.addEventListener('resize', () => this.adjustCanvasSize());
    }

    adjustCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createExplosion(x, y, tipo = 'normal') {
        const preset = EXPLOSION_PRESETS[tipo] || EXPLOSION_PRESETS.normal;
        const { particles, colors } = preset;

        const particleAngles = Array.from({ length: particles }, (_, i) => 2 * Math.PI / particles * i);
        const particleColors = Array.from({ length: particles }, (_, i) => colors[i % colors.length]);
        this.explosions.push({
            x, y, time: 0, lifespan: 0.8, ...preset, particleAngles, particleColors
        });
        if (this.explosions.length > 8) this.explosions.shift();

        if (this.explosions.length === 1) {
            this.lastFrame = performance.now();
            requestAnimationFrame((time) => this.frameStep(time));
        }
    }

    drawExplosions(delta) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const exp = this.explosions[i];
            exp.time += delta;
            if (exp.time > exp.lifespan) {
                this.explosions.splice(i, 1);
                continue;
            }
            const progress = exp.time / exp.lifespan;
            let alpha = 1 - progress;
            alpha = Math.max(0, Math.min(1, alpha));

            this.ctx.save();
            this.ctx.globalAlpha = alpha * 0.75;
            this.ctx.globalCompositeOperation = 'lighter';
            exp.particleAngles.forEach((angle, idx) => {
                const radius = exp.maxRadius * Math.pow(progress, 0.7);
                const px = exp.x + Math.cos(angle) * radius;
                const py = exp.y + Math.sin(angle) * radius;
                this.ctx.beginPath();
                this.ctx.arc(px, py, exp.particleSize * (1 - progress * 0.7), 0, Math.PI * 2);
                this.ctx.fillStyle = exp.particleColors[idx];
                this.ctx.fill();
            });
            this.ctx.restore();
        }
        if (this.explosions.length) requestAnimationFrame((time) => this.frameStep(time));
    }

    frameStep(now) {
        const delta = Math.min((now - this.lastFrame) / 1000, 0.05);
        this.lastFrame = now;
        this.drawExplosions(delta);
    }

    getNextType() {
        const type = this.typesList[this.idxType % this.typesList.length];
        this.idxType++;
        return type;
    }

    explodeAtPosition(x, y) {
        this.createExplosion(x, y, this.getNextType());
    }
}