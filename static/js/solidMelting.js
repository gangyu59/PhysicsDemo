function startSolidMelting(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const numParticles = 20000; // 增加粒子数量
    let particles = [];
    const groundLevel = canvas.height - 150;
    const iceSize = 400;
    let iceHeight = iceSize;

    function createParticle() {
        return {
            x: Math.random() * iceSize + (canvas.width - iceSize) / 2,
            y: groundLevel - iceHeight + Math.random() * iceHeight,
            vy: Math.random() * 0.1 + 0.05,
            melted: false
        };
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle());
    }

    function drawParticles() {
        particles.forEach(p => {
            if (!p.melted) {
                ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    function updateParticles() {
        particles.forEach(p => {
            if (!p.melted) {
                p.y += p.vy;
                if (p.y >= groundLevel) {
                    p.melted = true;
                }
            }
        });

        if (particles.every(p => p.melted)) {
            iceHeight -= 0.01;  // 放慢融化速度
            if (iceHeight <= 0) {
                iceHeight = 0;
                particles = particles.filter(p => !p.melted);
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawParticles();
        updateParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

window.startSolidMelting = startSolidMelting;