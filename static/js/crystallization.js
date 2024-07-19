function startCrystallization(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const numParticles = 1000;
    let particles = [];
    let liquidHeight = canvas.height / 2;
    const particleSize = 3;
    let crystallizedParticles = [];

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: liquidHeight + (Math.random() * (canvas.height - liquidHeight)),
            vx: 0,
            vy: -Math.random() * 2 - 1,
            crystallized: false
        };
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle());
    }

    function drawLiquid() {
        ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
        ctx.fillRect(0, liquidHeight, canvas.width, canvas.height - liquidHeight); // Liquid surface
    }

    function drawParticles() {
        particles.forEach(p => {
            if (!p.crystallized) {
                ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        crystallizedParticles.forEach(p => {
            ctx.fillStyle = 'rgba(0, 0, 255, 1)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function updateParticles() {
        particles.forEach(p => {
            if (!p.crystallized) {
                p.x += p.vx;
                p.y += p.vy;

                // Check if the particle hits the liquid surface
                if (p.y <= liquidHeight) {
                    p.crystallized = true;
                    crystallizedParticles.push(p);
                }
            }
        });

        // Remove particles that have crystallized
        particles = particles.filter(p => !p.crystallized);

        // Decrease liquid height to simulate crystallization
        if (particles.length > 0 && liquidHeight > 0) {
            liquidHeight -= 0.1;  // Adjust this value to control the speed of crystallization
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

window.startCrystallization = startCrystallization;