function startWaterSiphon(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const c1 = { x: canvas.width / 4 - 65, y: canvas.height / 2 - 30, w: 130, h: 200, water: 150 };
    const c2 = { x: (canvas.width * 3) / 4 - 65, y: canvas.height / 2 - 30, w: 130, h: 200, water: 20 };
    const tubeW = 10;
    const siphonH = 70;
    const speed = 0.6;
    let flowing = true;
    let flowParticles = [];
    let flowTimer = 0;

    function drawBackground() {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawContainer(c, label) {
        // Walls
        ctx.strokeStyle = 'rgba(140, 140, 200, 0.8)';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(c.x, c.y, c.w, c.h);

        // Water fill
        const wy = c.y + c.h - c.water;
        const wh = c.water;
        if (wh > 0) {
            const grad = ctx.createLinearGradient(0, wy, 0, c.y + c.h);
            grad.addColorStop(0, 'rgba(30, 130, 220, 0.8)');
            grad.addColorStop(1, 'rgba(8, 50, 150, 0.95)');
            ctx.fillStyle = grad;
            ctx.fillRect(c.x + 1, wy, c.w - 2, wh);

            // Surface shimmer
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(c.x + 1, wy);
            ctx.lineTo(c.x + c.w - 1, wy);
            ctx.stroke();
        }

        // Label
        ctx.font = '600 13px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(140, 180, 230, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(label, c.x + c.w / 2, c.y + c.h + 22);
        ctx.textAlign = 'left';
    }

    function drawTube() {
        const x1 = c1.x + c1.w;
        const y1 = c1.y + c1.h - c1.water;
        const x2 = c2.x;
        const y2 = c2.y + c2.h - c2.water;
        const topY = Math.min(y1, y2) - siphonH;

        ctx.strokeStyle = flowing ? 'rgba(60, 160, 240, 0.85)' : 'rgba(80, 80, 130, 0.6)';
        ctx.lineWidth = tubeW;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, topY);
        ctx.lineTo(x2, topY);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.lineCap = 'butt';
    }

    function spawnFlowParticle() {
        const x1 = c1.x + c1.w;
        const y1 = c1.y + c1.h - c1.water;
        flowParticles.push({ x: x1, y: y1, phase: 0 });
    }

    function updateFlowParticles() {
        const x1 = c1.x + c1.w;
        const x2 = c2.x;
        const topY = c1.y - siphonH + 10;

        flowParticles.forEach(p => {
            p.phase += 0.02;
        });

        // Simple path: up left side → across top → down right side
        flowParticles.forEach((p, idx) => {
            const t = p.phase;
            // Total path segments: up (0-0.33), across (0.33-0.66), down (0.66-1)
            const y1 = c1.y + c1.h - c1.water;
            const y2 = c2.y + c2.h - c2.water;

            if (t < 0.33) {
                const tt = t / 0.33;
                p.x = x1;
                p.y = y1 + (topY - y1) * tt;
            } else if (t < 0.66) {
                const tt = (t - 0.33) / 0.33;
                p.x = x1 + (x2 - x1) * tt;
                p.y = topY;
            } else if (t < 1) {
                const tt = (t - 0.66) / 0.34;
                p.x = x2;
                p.y = topY + (y2 - topY) * tt;
            } else {
                flowParticles.splice(idx, 1);
            }
        });
    }

    function drawFlowParticles() {
        flowParticles.forEach(p => {
            ctx.fillStyle = 'rgba(100, 200, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawLabels() {
        ctx.font = '600 15px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
        ctx.fillText('Water Siphon', 18, 32);

        ctx.font = '13px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(160, 190, 230, 0.65)';
        ctx.fillText('Pressure difference drives water uphill through a tube', 18, 56);

        ctx.fillStyle = flowing ? 'rgba(59, 130, 246, 0.8)' : 'rgba(140, 140, 180, 0.6)';
        ctx.fillText(flowing ? '💧 Siphon flowing' : '✓ Equalized', 18, 80);
    }

    function animate() {
        drawBackground();
        drawTube();
        drawContainer(c1, 'Container A');
        drawContainer(c2, 'Container B');

        if (flowing) {
            flowTimer++;
            if (flowTimer % 8 === 0) spawnFlowParticle();
            updateFlowParticles();
            drawFlowParticles();

            if (c1.water > 0 && c2.water < c2.h) {
                c1.water -= speed;
                c2.water += speed;
                if (c1.water < 0) { c2.water += c1.water; c1.water = 0; }
            } else {
                flowing = false;
            }
        }

        drawLabels();
        requestAnimationFrame(animate);
    }

    animate();
}

window.startWaterSiphon = startWaterSiphon;
