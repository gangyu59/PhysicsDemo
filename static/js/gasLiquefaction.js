function startGasLiquefaction(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const numParticles = 2000;
    const particles = [];
    let liquidHeight = 100;
    let liquidY = canvas.height - liquidHeight;

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height - liquidHeight),
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 2,
            liquid: false
        };
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle());
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            ctx.fillStyle = p.liquid ? 'rgba(0, 0, 255, 0.8)' : 'rgba(0, 0, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
        ctx.fillRect(0, liquidY, canvas.width, liquidHeight);
    }

    function updateParticles() {
        particles.forEach(p => {
            if (!p.liquid) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
                if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;

                // If the particle is within the liquid region
                if (p.y >= liquidY) {
                    p.liquid = true;
                    p.vx = 0;
                    p.vy = 0;
                    p.y = liquidY + Math.random() * liquidHeight;
                    liquidHeight += 0.11; // Increase the liquid height
                    liquidY = canvas.height - liquidHeight;
                }
            }
        });
    }

    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

window.startGasLiquefaction = startGasLiquefaction;