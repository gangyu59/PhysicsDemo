function startLiquidEvaporation(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    let particles = [];
    let liquidHeight = canvas.height / 2;
    const numParticles = 100;

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: liquidHeight - 5,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2 - 1,
            alpha: 1
        };
    }

    function addParticles() {
        for (let i = 0; i < numParticles; i++) {
            particles.push(createParticle());
        }
    }

    addParticles();

    function drawLiquid() {
        ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
        ctx.fillRect(0, liquidHeight, canvas.width, canvas.height - liquidHeight);
    }

    function drawParticles() {
        particles.forEach(p => {
            ctx.fillStyle = `rgba(0, 0, 255, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.01;
        });
        particles = particles.filter(p => p.alpha > 0);

        if (particles.length < numParticles) {
            addParticles();
        }

        if (particles.length > 0) {
            liquidHeight += 0.2;  // 更明显的液体高度下降
        }

        if (liquidHeight < 0) {
            liquidHeight = 0;
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLiquid();
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

window.startLiquidEvaporation = startLiquidEvaporation;