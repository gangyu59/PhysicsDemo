function startLiquidEvaporation(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    let particles = [];
    let liquidTop = canvas.height / 2;  // y-coordinate of liquid surface (increases = liquid shrinks)
    const numParticles = 80;

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: liquidTop - 2,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 2.5 - 0.8,
            alpha: 1,
            r: Math.random() * 3 + 2
        };
    }

    function addParticles() {
        for (let i = 0; i < numParticles; i++) {
            particles.push(createParticle());
        }
    }

    addParticles();

    function drawBackground() {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawLiquid() {
        const h = canvas.height - liquidTop;
        if (h <= 0) return;

        const grad = ctx.createLinearGradient(0, liquidTop, 0, canvas.height);
        grad.addColorStop(0, 'rgba(34, 160, 220, 0.85)');
        grad.addColorStop(1, 'rgba(10, 60, 140, 0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, liquidTop, canvas.width, h);

        // Surface shimmer
        ctx.strokeStyle = 'rgba(120, 220, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, liquidTop);
        ctx.lineTo(canvas.width, liquidTop);
        ctx.stroke();
    }

    function drawParticles() {
        particles.forEach(p => {
            ctx.beginPath();
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
            g.addColorStop(0, `rgba(160, 220, 255, ${p.alpha})`);
            g.addColorStop(1, `rgba(30, 120, 220, ${p.alpha * 0.3})`);
            ctx.fillStyle = g;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawLabels() {
        ctx.font = '600 15px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(34, 211, 238, 0.9)';
        ctx.fillText('Liquid Evaporation', 18, 32);

        ctx.font = '13px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(180, 220, 255, 0.65)';
        ctx.fillText('Particles escape from the liquid surface as vapor', 18, 56);

        const remaining = Math.max(0, Math.round(((canvas.height - liquidTop) / (canvas.height / 2)) * 100));
        ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.fillText('Liquid remaining: ' + remaining + '%', 18, 80);
    }

    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.008;
        });
        particles = particles.filter(p => p.alpha > 0 && p.y > 0);

        if (particles.length < numParticles && liquidTop < canvas.height) {
            addParticles();
        }

        // liquidTop increases → liquid surface moves down → liquid shrinks (correct evaporation)
        if (particles.length > 0 && liquidTop < canvas.height) {
            liquidTop += 0.15;
        }
    }

    function animate() {
        drawBackground();
        drawLiquid();
        updateParticles();
        drawParticles();
        drawLabels();
        requestAnimationFrame(animate);
    }

    animate();
}

window.startLiquidEvaporation = startLiquidEvaporation;
