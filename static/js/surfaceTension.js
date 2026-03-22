function startSurfaceTension(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const waterLevel = canvas.height * 0.55;
    const numDroplets = 6;
    const droplets = [];
    // Surface wave animation
    let waveOffset = 0;
    // Floating objects (insects)
    const floaters = [];

    // Create water droplets falling from above
    function createDroplet() {
        return {
            x: Math.random() * (canvas.width - 80) + 40,
            y: -20,
            vy: 1.5 + Math.random() * 1.5,
            r: 8 + Math.random() * 6,
            landed: false,
            landTime: 0,
            rippleR: 0,
            rippleAlpha: 0
        };
    }

    for (let i = 0; i < numDroplets; i++) {
        const d = createDroplet();
        d.y = -20 - i * 120;  // Stagger initial positions
        droplets.push(d);
    }

    // Floating objects (e.g., water-strider "insects")
    for (let i = 0; i < 4; i++) {
        floaters.push({
            x: 80 + Math.random() * (canvas.width - 160),
            y: waterLevel,
            vx: (Math.random() - 0.5) * 0.8,
            indent: 3 + Math.random() * 3,  // Surface depression depth
            legSpan: 20 + Math.random() * 10
        });
    }

    function drawBackground() {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawWater() {
        // Animated wavy surface
        ctx.fillStyle = 'rgba(15, 80, 180, 0.85)';
        ctx.beginPath();
        ctx.moveTo(0, waterLevel);
        for (let x = 0; x <= canvas.width; x += 4) {
            const waveY = waterLevel + Math.sin((x / 80) + waveOffset) * 4
                        + Math.sin((x / 40) + waveOffset * 1.5) * 1.5;
            ctx.lineTo(x, waveY);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, waterLevel, 0, canvas.height);
        grad.addColorStop(0, 'rgba(30, 130, 220, 0.85)');
        grad.addColorStop(1, 'rgba(5, 40, 120, 0.95)');
        ctx.fillStyle = grad;
        ctx.fill();

        // Surface highlight line
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, waterLevel);
        for (let x = 0; x <= canvas.width; x += 4) {
            const waveY = waterLevel + Math.sin((x / 80) + waveOffset) * 4
                        + Math.sin((x / 40) + waveOffset * 1.5) * 1.5;
            ctx.lineTo(x, waveY);
        }
        ctx.stroke();
    }

    function drawDroplets() {
        droplets.forEach(d => {
            if (!d.landed) {
                // Falling droplet
                const grad = ctx.createRadialGradient(d.x - d.r * 0.3, d.y - d.r * 0.3, 0, d.x, d.y, d.r);
                grad.addColorStop(0, 'rgba(180, 230, 255, 0.9)');
                grad.addColorStop(1, 'rgba(30, 120, 220, 0.7)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Ripple after landing
                if (d.rippleAlpha > 0) {
                    ctx.strokeStyle = `rgba(100, 200, 255, ${d.rippleAlpha})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(d.x, waterLevel, d.rippleR, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.strokeStyle = `rgba(60, 160, 230, ${d.rippleAlpha * 0.5})`;
                    ctx.beginPath();
                    ctx.arc(d.x, waterLevel, d.rippleR * 1.8, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        });
    }

    function drawFloaters() {
        floaters.forEach(f => {
            // Surface depression under floater
            ctx.strokeStyle = 'rgba(80, 180, 240, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(f.x, waterLevel + f.indent * 0.5, f.legSpan + 8, f.indent, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Body
            ctx.fillStyle = 'rgba(80, 140, 60, 0.85)';
            ctx.beginPath();
            ctx.ellipse(f.x, waterLevel - 2, 12, 5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Legs (touching surface)
            ctx.strokeStyle = 'rgba(60, 110, 50, 0.8)';
            ctx.lineWidth = 1.5;
            [-f.legSpan, -f.legSpan * 0.4, f.legSpan * 0.4, f.legSpan].forEach(lx => {
                ctx.beginPath();
                ctx.moveTo(f.x, waterLevel - 2);
                ctx.lineTo(f.x + lx, waterLevel + f.indent * 0.3);
                ctx.stroke();
            });
        });
    }

    function drawLabels() {
        ctx.font = '600 15px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
        ctx.fillText('Surface Tension', 18, 32);

        ctx.font = '13px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(160, 190, 230, 0.65)';
        ctx.fillText('Cohesive forces form a surface "film" — insects float on water', 18, 56);
    }

    function update() {
        waveOffset += 0.025;

        // Update droplets
        droplets.forEach((d, idx) => {
            if (!d.landed) {
                d.y += d.vy;
                d.vy += 0.05;  // gravity
                if (d.y >= waterLevel) {
                    d.landed = true;
                    d.landTime = 0;
                    d.rippleR = d.r;
                    d.rippleAlpha = 0.8;
                    // Reset for continuous rain
                    setTimeout(() => {
                        droplets[idx] = createDroplet();
                        droplets[idx].y = -20 - Math.random() * 80;
                    }, 2000);
                }
            } else {
                d.landTime++;
                d.rippleR += 2.5;
                d.rippleAlpha = Math.max(0, d.rippleAlpha - 0.012);
            }
        });

        // Move floaters
        floaters.forEach(f => {
            f.x += f.vx;
            if (f.x < 30 || f.x > canvas.width - 30) f.vx *= -1;
            f.y = waterLevel + Math.sin(waveOffset * 0.8 + f.x / 100) * 2;
        });
    }

    function animate() {
        drawBackground();
        drawWater();
        drawDroplets();
        drawFloaters();
        drawLabels();
        update();
        requestAnimationFrame(animate);
    }

    animate();
}

window.startSurfaceTension = startSurfaceTension;
