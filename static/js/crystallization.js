function startCrystallization(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const numParticles = 600;
    let particles = [];
    // liquidTop is the y-coordinate where liquid begins (increases = liquid shrinks from top)
    let liquidTop = canvas.height / 2;
    const particleSize = 3;
    let crystallizedParticles = [];

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: liquidTop + Math.random() * (canvas.height - liquidTop),
            vx: (Math.random() - 0.5) * 0.5,
            vy: -Math.random() * 1.5 - 0.5,
            crystallized: false
        };
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle());
    }

    function drawBackground() {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawLiquid() {
        const h = canvas.height - liquidTop;
        if (h <= 0) return;
        const grad = ctx.createLinearGradient(0, liquidTop, 0, canvas.height);
        grad.addColorStop(0, 'rgba(20, 100, 200, 0.7)');
        grad.addColorStop(1, 'rgba(8, 40, 120, 0.9)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, liquidTop, canvas.width, h);

        ctx.strokeStyle = 'rgba(100, 180, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, liquidTop);
        ctx.lineTo(canvas.width, liquidTop);
        ctx.stroke();
    }

    function drawCrystalLayer() {
        if (liquidTop <= canvas.height / 2) return;
        // Draw ice/crystal layer above liquid
        const crystalH = liquidTop - canvas.height / 2;
        const iceGrad = ctx.createLinearGradient(0, canvas.height / 2, 0, liquidTop);
        iceGrad.addColorStop(0, 'rgba(180, 230, 255, 0.15)');
        iceGrad.addColorStop(1, 'rgba(140, 200, 255, 0.35)');
        ctx.fillStyle = iceGrad;
        ctx.fillRect(0, canvas.height / 2, canvas.width, crystalH);
    }

    function drawParticles() {
        // Moving particles in liquid
        ctx.fillStyle = 'rgba(80, 160, 255, 0.6)';
        particles.forEach(p => {
            if (!p.crystallized) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Crystallized particles — bright ice crystals
        crystallizedParticles.forEach(p => {
            ctx.fillStyle = 'rgba(200, 235, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, particleSize + 1, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawLabels() {
        ctx.font = '600 15px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(34, 211, 238, 0.9)';
        ctx.fillText('Crystallization', 18, 32);

        ctx.font = '13px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(180, 220, 255, 0.65)';
        ctx.fillText('Particles rise and freeze at the liquid surface', 18, 56);

        const pct = Math.min(100, Math.round(((liquidTop - canvas.height / 2) / (canvas.height / 2)) * 100));
        ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.fillText('Crystallized: ' + pct + '%', 18, 80);
    }

    function updateParticles() {
        particles.forEach(p => {
            if (!p.crystallized) {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap horizontally
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;

                // Crystallize when reaching the liquid surface
                if (p.y <= liquidTop) {
                    p.y = liquidTop + Math.random() * 5;
                    p.crystallized = true;
                    crystallizedParticles.push(p);
                }
            }
        });

        particles = particles.filter(p => !p.crystallized);

        // FIX: liquidTop increases → liquid surface moves DOWN → liquid SHRINKS (correct)
        if (crystallizedParticles.length > 0 && liquidTop < canvas.height) {
            liquidTop += 0.08;
        }
    }

    function animate() {
        drawBackground();
        drawLiquid();
        drawCrystalLayer();
        updateParticles();
        drawParticles();
        drawLabels();
        requestAnimationFrame(animate);
    }

    animate();
}

window.startCrystallization = startCrystallization;
