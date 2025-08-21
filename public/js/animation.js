export function initAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const numParticles = 20;

    const fogParticleCanvas = document.createElement('canvas');
    const fogParticleCtx = fogParticleCanvas.getContext('2d');
    const fogRadius = 400;
    fogParticleCanvas.width = fogRadius * 2;
    fogParticleCanvas.height = fogRadius * 2;

    const gradient = fogParticleCtx.createRadialGradient(fogRadius, fogRadius, fogRadius * 0.5, fogRadius, fogRadius, fogRadius);
    gradient.addColorStop(0, 'rgba(100, 120, 150, 0.15)');
    gradient.addColorStop(1, 'rgba(100, 120, 150, 0)');
    fogParticleCtx.fillStyle = gradient;
    fogParticleCtx.beginPath();
    fogParticleCtx.arc(fogRadius, fogRadius, fogRadius, 0, Math.PI * 2);
    fogParticleCtx.fill();

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);

    class FogParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 1.0;
            this.vy = (Math.random() - 0.5) * 1.0;
            this.scale = (Math.random() * 0.5 + 0.75);
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            const radius = fogRadius * this.scale;
            if (this.x + radius < 0) this.x = canvas.width + radius;
            if (this.x - radius > canvas.width) this.x = -radius;
            if (this.y + radius < 0) this.y = canvas.height + radius;
            if (this.y - radius > canvas.height) this.y = -radius;
        }

        draw() {
            const radius = fogRadius * this.scale;
            ctx.drawImage(fogParticleCanvas, this.x - radius, this.y - radius, radius * 2, radius * 2);
        }
    }

    function init() {
        resizeCanvas();
        particles = [];
        for (let i = 0; i < numParticles; i++) {
            particles.push(new FogParticle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    init();
    animate();
}