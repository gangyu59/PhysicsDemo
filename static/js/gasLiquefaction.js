function startGasLiquefaction(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const numParticles = 1200;
    const particles = [];
    let liquidHeight = 60;
    let liquidY = canvas.height - liquidHeight;

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height - liquidHeight - 20),
            vx: (Math.random() - 0.5) * 2.5,
            vy: (Math.random() - 0.5) * 2.5,
            size: Math.random() * 2 + 1.5,
            liquid: false
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
        const grad = ctx.createLinearGradient(0, liquidY, 0, canvas.height);
        grad.addColorStop(0, 'rgba(30, 140, 230, 0.9)');
        grad.addColorStop(1, 'rgba(8, 50, 140, 0.98)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, liquidY, canvas.width, liquidHeight);

        ctx.strokeStyle = 'rgba(100, 200, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, liquidY);
        ctx.lineTo(canvas.width, liquidY);
        ctx.stroke();
    }

    function drawParticles() {
        particles.forEach(p => {
            if (!p.liquid) {
                // Gas particle — small, semi-transparent
                ctx.fillStyle = `rgba(140, 200, 255, 0.5)`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    function drawLabels() {
        ctx.font = '600 15px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(34, 211, 238, 0.9)';
        ctx.fillText('Gas Liquefaction', 18, 32);

        ctx.font = '13px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(180, 220, 255, 0.65)';
        ctx.fillText('Gas molecules slow down and condense into liquid', 18, 56);

        const liquidPct = Math.round((particles.filter(p => p.liquid).length / numParticles) * 100);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.fillText('Liquefied: ' + liquidPct + '%', 18, 80);
    }

    function updateParticles() {
        particles.forEach(p => {
            if (!p.liquid) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
                if (p.y <= 0) p.vy *= -1;

                if (p.y >= liquidY) {
                    p.liquid = true;
                    liquidHeight += 0.08;
                    liquidY = canvas.height - liquidHeight;
                }
            }
        });
    }

    function animate() {
        drawBackground();
        updateParticles();
        drawLiquid();
        drawParticles();
        drawLabels();
        requestAnimationFrame(animate);
    }

    animate();
}

window.startGasLiquefaction = startGasLiquefaction;
