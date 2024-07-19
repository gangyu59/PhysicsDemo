function startCrystallization(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const numParticles = 1000;
    let particles = [];
    let liquidHeight = canvas.height / 2;
    const particleSize = 3;
    let crystallizedParticles = [];

    const fishIcons = ['🐟', '🐠'];
    const numFish = 8;
    let fish = [];

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: liquidHeight + (Math.random() * (canvas.height - liquidHeight)),
            vx: 0,
            vy: -Math.random() * 2 - 1,
            crystallized: false
        };
    }

    function createFish() {
        return {
            x: Math.random() * canvas.width,
            y: liquidHeight + (Math.random() * (canvas.height - liquidHeight)),
            vx: (Math.random() * 2 - 1) * 0.5,
            vy: (Math.random() * 2 - 1) * 0.5,
            icon: fishIcons[Math.floor(Math.random() * fishIcons.length)]
        };
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle());
    }

    for (let i = 0; i < numFish; i++) {
        fish.push(createFish());
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
            ctx.fillStyle = 'rgba(0, 0, 150, 1)'; // Deeper color for crystallized particles
            ctx.beginPath();
            ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawFish() {
        fish.forEach(f => {
            ctx.font = '20px Arial';
            ctx.fillText(f.icon, f.x, f.y);
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

    function updateFish() {
        fish.forEach(f => {
            f.x += f.vx;
            f.y += f.vy;

            // Check for collisions with the canvas boundaries
            if (f.x < 0 || f.x > canvas.width) {
                f.vx *= -1;
            }
            if (f.y < liquidHeight || f.y > canvas.height) {
                f.vy *= -1;
            }

            // Prevent fish from moving into the crystallized area
            if (f.y < liquidHeight + 50) {
                f.y = liquidHeight + 51;
                f.vy *= -1;
            }
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLiquid();
        updateParticles();
        updateFish();
        drawParticles();
        drawFish();
        requestAnimationFrame(animate);
    }

    animate();
}

window.startCrystallization = startCrystallization;