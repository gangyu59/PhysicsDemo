function startSoundDiffraction(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const forkX = canvas.width / 2;
    const forkY = canvas.height / 2;
    const forkW = 50;
    const forkH = 240;
    const particleCount = 1200;
    const particles = [];
    let time = 0;
    let vibrating = true;  // Auto-start vibrating

    // Initialize particles avoiding the fork area
    for (let i = 0; i < particleCount; i++) {
        let x, y;
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (
            x > forkX - forkW * 0.8 && x < forkX + forkW * 0.8 &&
            y > forkY - forkH * 0.6 && y < forkY + forkH * 0.6
        );
        particles.push({ x, y, ox: x, oy: y });
    }

    function drawBackground() {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawFork() {
        const bx = forkX;
        const ty = forkY - forkH / 2;
        const by = forkY + forkH / 2;

        // Stem
        ctx.strokeStyle = 'rgba(180, 180, 210, 0.9)';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx, ty + forkH * 0.4);
        ctx.stroke();

        // Handle ball
        ctx.fillStyle = 'rgba(160, 160, 200, 0.9)';
        ctx.beginPath();
        ctx.arc(bx, by + 10, 14, 0, Math.PI * 2);
        ctx.fill();

        // Two tines
        const vib = vibrating ? Math.sin(time * 0.3) * 8 : 0;
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';

        // Left tine
        ctx.strokeStyle = 'rgba(160, 180, 240, 0.9)';
        ctx.beginPath();
        ctx.moveTo(bx, ty + forkH * 0.4);
        ctx.lineTo(bx - 18 + vib, ty);
        ctx.stroke();

        // Right tine
        ctx.beginPath();
        ctx.moveTo(bx, ty + forkH * 0.4);
        ctx.lineTo(bx + 18 - vib, ty);
        ctx.stroke();

        // Vibration glow
        if (vibrating) {
            const glow = ctx.createRadialGradient(bx, forkY, 0, bx, forkY, 60);
            const a = Math.abs(Math.sin(time * 0.3)) * 0.3;
            glow.addColorStop(0, `rgba(168, 85, 247, ${a})`);
            glow.addColorStop(1, 'rgba(168, 85, 247, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(bx, forkY, 60, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.lineCap = 'butt';
    }

    function drawParticles() {
        particles.forEach(p => {
            const dx = p.x - forkX;
            const dy = p.y - forkY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            if (vibrating && dist < canvas.width * 0.65) {
                const wave = Math.sin((dist / 22) - (time / 5)) * 5 * Math.max(0, 1 - dist / 320);
                p.x = p.ox + wave * Math.cos(angle);
                p.y = p.oy + wave * Math.sin(angle);
            } else {
                p.x += (p.ox - p.x) * 0.08;
                p.y += (p.oy - p.y) * 0.08;
            }

            // Color by displacement magnitude
            const disp = Math.sqrt((p.x - p.ox) ** 2 + (p.y - p.oy) ** 2);
            const intensity = Math.min(1, disp / 4);
            ctx.fillStyle = `rgba(${Math.round(100 + 155 * intensity)}, ${Math.round(120 + 50 * intensity)}, 255, 0.75)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawLabels() {
        ctx.font = '600 15px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
        ctx.fillText('Sound Diffraction', 18, 32);

        ctx.font = '13px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(190, 170, 220, 0.65)';
        ctx.fillText('Vibrating tuning fork creates longitudinal pressure waves', 18, 56);

        ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
        ctx.fillText(vibrating ? '🔔 Vibrating — tap/click fork to toggle' : '🔕 Stopped — tap/click fork to vibrate', 18, 80);
    }

    function animate() {
        drawBackground();
        drawParticles();
        drawFork();
        drawLabels();
        time++;
        requestAnimationFrame(animate);
    }

    // Click/touch on fork to toggle vibration
    function handleInteraction(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const cx = (clientX - rect.left) * scaleX;
        const cy = (clientY - rect.top) * scaleY;

        if (cx > forkX - forkW && cx < forkX + forkW &&
            cy > forkY - forkH / 2 && cy < forkY + forkH / 2) {
            vibrating = !vibrating;
        }
    }

    canvas.addEventListener('click', e => handleInteraction(e.clientX, e.clientY));
    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    animate();
}

window.startSoundDiffraction = startSoundDiffraction;
