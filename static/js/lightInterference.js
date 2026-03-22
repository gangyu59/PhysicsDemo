function startLightInterference(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const slitX = canvas.width / 3;
    const numSlits = 2;
    const slitSpacing = 60;
    const waveSpeed = 0.5;
    const waveLen = 22;
    const numRings = 28;
    let offset = 0;

    function drawBackground() {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawBarrier() {
        ctx.fillStyle = 'rgba(80, 80, 120, 0.9)';
        ctx.fillRect(slitX - 4, 0, 8, canvas.height);

        // Slits (gaps in barrier)
        const slitCenterY = canvas.height / 2;
        const slitH = 24;
        for (let j = 0; j < numSlits; j++) {
            const sy = slitCenterY + (j - (numSlits - 1) / 2) * slitSpacing;
            ctx.clearRect(slitX - 5, sy - slitH / 2, 10, slitH);
            ctx.fillStyle = '#050510';
            ctx.fillRect(slitX - 5, sy - slitH / 2, 10, slitH);
        }
    }

    function drawWaves() {
        const slitCenterY = canvas.height / 2;

        for (let j = 0; j < numSlits; j++) {
            const sy = slitCenterY + (j - (numSlits - 1) / 2) * slitSpacing;

            for (let i = 0; i < numRings; i++) {
                const r = i * waveLen + offset;
                if (r <= 0) continue;

                // Only draw waves to the right of the slit
                const alpha = Math.max(0, 0.25 - i * 0.007);
                ctx.strokeStyle = `rgba(100, 160, 255, ${alpha})`;
                ctx.lineWidth = 1.5;

                ctx.beginPath();
                ctx.arc(slitX, sy, r, -Math.PI / 2, Math.PI / 2);
                ctx.stroke();
            }
        }
    }

    function drawInterferencePattern() {
        // Bright fringe overlay on screen
        const screenX = canvas.width - 40;
        for (let y = 0; y < canvas.height; y += 2) {
            const slitCenterY = canvas.height / 2;
            let amplitude = 0;
            for (let j = 0; j < numSlits; j++) {
                const sy = slitCenterY + (j - (numSlits - 1) / 2) * slitSpacing;
                const dist = Math.sqrt((screenX - slitX) ** 2 + (y - sy) ** 2);
                amplitude += Math.cos((dist / waveLen) * 2 * Math.PI - (offset / waveLen) * 2 * Math.PI);
            }
            amplitude /= numSlits;
            const intensity = Math.max(0, amplitude);
            ctx.fillStyle = `rgba(80, 140, 255, ${intensity * 0.6})`;
            ctx.fillRect(screenX, y, 12, 2);
        }

        // Screen edge
        ctx.strokeStyle = 'rgba(80, 80, 140, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(screenX + 12, 0);
        ctx.lineTo(screenX + 12, canvas.height);
        ctx.stroke();
    }

    function drawLabels() {
        ctx.font = '600 15px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
        ctx.fillText('Light Interference (Double Slit)', 18, 32);

        ctx.font = '13px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(190, 170, 220, 0.65)';
        ctx.fillText('Two coherent wave sources produce constructive & destructive interference', 18, 56);

        ctx.fillStyle = 'rgba(140, 140, 200, 0.7)';
        ctx.fillText('← Barrier   Waves →   Screen', slitX - 60, canvas.height - 20);
    }

    function animate() {
        drawBackground();
        drawInterferencePattern();
        drawWaves();
        drawBarrier();
        drawLabels();

        offset += waveSpeed;
        if (offset >= waveLen) offset = 0;

        requestAnimationFrame(animate);
    }

    animate();
}

window.startLightInterference = startLightInterference;
