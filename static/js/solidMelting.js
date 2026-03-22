function startSolidMelting(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const numParticles = 8000;
    let particles = [];
    const groundLevel = canvas.height - 100;
    const iceW = 360;
    const iceH = 260;
    const iceLeft = (canvas.width - iceW) / 2;
    const iceTop = groundLevel - iceH;
    let meltedPool = 0;  // pixel height of melt water pool

    function createParticle() {
        return {
            x: iceLeft + Math.random() * iceW,
            y: iceTop + Math.random() * iceH,
            vy: Math.random() * 0.12 + 0.04,
            melted: false,
            r: Math.random() * 1.5 + 0.5
        };
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle());
    }

    function drawBackground() {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ground line
        ctx.strokeStyle = 'rgba(100, 100, 160, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, groundLevel);
        ctx.lineTo(canvas.width, groundLevel);
        ctx.stroke();
    }

    function drawMeltedPool() {
        if (meltedPool <= 0) return;
        const poolGrad = ctx.createLinearGradient(0, groundLevel - meltedPool, 0, groundLevel);
        poolGrad.addColorStop(0, 'rgba(30, 120, 220, 0.5)');
        poolGrad.addColorStop(1, 'rgba(10, 60, 160, 0.8)');
        ctx.fillStyle = poolGrad;
        ctx.fillRect(iceLeft - 10, groundLevel - meltedPool, iceW + 20, meltedPool);
    }

    function drawParticles() {
        particles.forEach(p => {
            if (!p.melted) {
                // Ice particle — light blue/white
                const alpha = 0.6 + Math.random() * 0.3;
                ctx.fillStyle = `rgba(180, 220, 255, ${alpha})`;
            } else {
                // Water particle — transparent blue
                ctx.fillStyle = 'rgba(50, 130, 220, 0.15)';
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawLabels() {
        ctx.font = '600 15px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(34, 211, 238, 0.9)';
        ctx.fillText('Solid Melting', 18, 32);

        ctx.font = '13px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(180, 220, 255, 0.65)';
        ctx.fillText('Ice particles absorb heat and transition to liquid water', 18, 56);

        const meltedCount = particles.filter(p => p.melted).length;
        const pct = Math.round((meltedCount / numParticles) * 100);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.fillText('Melted: ' + pct + '%', 18, 80);
    }

    function updateParticles() {
        let newlyMelted = 0;
        particles.forEach(p => {
            if (!p.melted) {
                p.y += p.vy;
                if (p.y >= groundLevel) {
                    p.melted = true;
                    newlyMelted++;
                }
            }
        });
        // Pool grows as particles melt
        meltedPool = Math.min(80, meltedPool + newlyMelted * 0.01);
    }

    function animate() {
        drawBackground();
        drawMeltedPool();
        drawParticles();
        drawLabels();
        updateParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

window.startSolidMelting = startSolidMelting;
