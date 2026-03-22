function startElectromagneticConversion(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const coilCX = canvas.width / 2;
    const coilCY = canvas.height / 2 - 30;
    const coilW = 480;
    const coilH = 180;
    const coilTurns = 10;
    const magnetW = 180;
    const magnetH = 130;
    let magnetX = -magnetW;
    let magnetDir = 2.5;
    let currentFlowing = false;
    let currentStrength = 0;  // 0..1 smoothed

    function drawBackground() {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawCoil() {
        const step = coilW / coilTurns;
        const x0 = coilCX - coilW / 2;
        const y0 = coilCY - coilH / 2;
        const y1 = coilCY + coilH / 2;

        ctx.strokeStyle = currentFlowing
            ? `rgba(255, 200, 50, ${0.5 + currentStrength * 0.5})`
            : 'rgba(80, 140, 220, 0.8)';
        ctx.lineWidth = 3;

        for (let i = 0; i < coilTurns; i++) {
            ctx.beginPath();
            ctx.moveTo(x0 + i * step, y0);
            ctx.lineTo(x0 + (i + 0.5) * step, y1);
            ctx.lineTo(x0 + (i + 1) * step, y0);
            ctx.stroke();
        }

        // Left and right coil end connectors
        ctx.strokeStyle = 'rgba(160, 160, 180, 0.7)';
        ctx.lineWidth = 2;
        const wireY = y1 + 130;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0, wireY);
        ctx.moveTo(coilCX + coilW / 2, y0);
        ctx.lineTo(coilCX + coilW / 2, wireY);
        ctx.moveTo(x0, wireY);
        ctx.lineTo(coilCX - 18, wireY);
        ctx.moveTo(coilCX + coilW / 2, wireY);
        ctx.lineTo(coilCX + 18, wireY);
        ctx.stroke();
    }

    function drawMagnet() {
        const mx = magnetX;
        const my = coilCY - magnetH / 2;

        // Magnet body
        const halfH = magnetH / 2;
        // North (red)
        ctx.fillStyle = '#e53e3e';
        ctx.fillRect(mx, my, magnetW, halfH);
        // South (blue)
        ctx.fillStyle = '#3182ce';
        ctx.fillRect(mx, my + halfH, magnetW, halfH);

        // Labels
        ctx.font = 'bold 22px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.fillText('N', mx + magnetW / 2, my + halfH / 2 + 8);
        ctx.fillText('S', mx + magnetW / 2, my + halfH + halfH / 2 + 8);
        ctx.textAlign = 'left';

        // Border
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(mx, my, magnetW, magnetH);

        // Magnetic field lines (simple arcs on right side of magnet)
        if (currentFlowing) {
            ctx.strokeStyle = `rgba(255, 180, 50, ${currentStrength * 0.5})`;
            ctx.lineWidth = 1;
            for (let i = 1; i <= 3; i++) {
                ctx.beginPath();
                ctx.arc(mx + magnetW, my + magnetH / 2, i * 25, -Math.PI / 2, Math.PI / 2);
                ctx.stroke();
            }
        }
    }

    function drawBulb() {
        const bx = coilCX;
        const by = coilCY + coilH / 2 + 90;
        const br = 22;

        // Glow when current flows
        if (currentFlowing && currentStrength > 0.1) {
            const glow = ctx.createRadialGradient(bx, by, 0, bx, by, br * 3);
            glow.addColorStop(0, `rgba(255, 230, 80, ${currentStrength * 0.4})`);
            glow.addColorStop(1, 'rgba(255, 180, 0, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(bx, by, br * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Bulb glass
        ctx.fillStyle = currentFlowing
            ? `rgba(255, 240, 100, ${0.5 + currentStrength * 0.5})`
            : 'rgba(60, 60, 90, 0.8)';
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = currentFlowing ? 'rgba(255, 200, 50, 0.8)' : 'rgba(100, 100, 140, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Filament
        ctx.strokeStyle = currentFlowing ? `rgba(255, 160, 30, ${currentStrength})` : 'rgba(120, 120, 140, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bx - 8, by + 5);
        ctx.lineTo(bx - 3, by - 5);
        ctx.lineTo(bx + 3, by + 5);
        ctx.lineTo(bx + 8, by - 5);
        ctx.stroke();

        // Base
        ctx.fillStyle = 'rgba(100, 100, 120, 0.8)';
        ctx.fillRect(bx - 10, by + br - 2, 20, 12);
    }

    function drawLabels() {
        ctx.font = '600 15px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
        ctx.fillText('Electromagnetic Induction', 18, 32);

        ctx.font = '13px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(200, 180, 140, 0.65)';
        ctx.fillText('Moving magnet induces current in the coil (Faraday\'s Law)', 18, 56);

        ctx.fillStyle = currentFlowing ? 'rgba(255, 200, 50, 0.9)' : 'rgba(140, 140, 180, 0.7)';
        ctx.fillText(currentFlowing ? '⚡ Current flowing!' : 'No current  (magnet outside coil)', 18, 80);
    }

    function update() {
        magnetX += magnetDir;
        if (magnetX > canvas.width) magnetDir = -Math.abs(magnetDir);
        if (magnetX < -magnetW) magnetDir = Math.abs(magnetDir);

        const inCoil = magnetX > coilCX - coilW / 2 - magnetW && magnetX < coilCX + coilW / 2;
        currentFlowing = inCoil;
        const target = inCoil ? 1 : 0;
        currentStrength += (target - currentStrength) * 0.15;
    }

    function animate() {
        drawBackground();
        drawMagnet();
        drawCoil();
        drawBulb();
        drawLabels();
        update();
        requestAnimationFrame(animate);
    }

    animate();
}

window.startElectromagneticConversion = startElectromagneticConversion;
