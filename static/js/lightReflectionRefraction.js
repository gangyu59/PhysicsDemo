function startLightReflectionRefraction(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 20;
    const prismW = 220;
    const prismH = 200;

    // Prism vertices (equilateral-ish triangle)
    const pA = { x: cx, y: cy - prismH / 2 };          // apex
    const pBL = { x: cx - prismW / 2, y: cy + prismH / 2 }; // bottom-left
    const pBR = { x: cx + prismW / 2, y: cy + prismH / 2 }; // bottom-right

    const colors = [
        { c: '#ff4444', angle: 8,  label: 'Red' },
        { c: '#ff8800', angle: 10, label: 'Orange' },
        { c: '#ffee00', angle: 12, label: 'Yellow' },
        { c: '#44dd44', angle: 14, label: 'Green' },
        { c: '#4488ff', angle: 17, label: 'Blue' },
        { c: '#8844ff', angle: 20, label: 'Violet' }
    ];

    // Animated incident beam (moving dot)
    let beamX = 60;
    const beamY = cy;
    const beamSpeed = 2;

    // Entry point on left prism face
    const entryX = cx - prismW / 4;
    const entryY = cy;

    // Exit point on right prism face
    const exitX = cx + prismW / 4;
    const exitY = cy + 20;

    function drawBackground() {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawPrism() {
        // Glass fill
        ctx.fillStyle = 'rgba(100, 160, 220, 0.12)';
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pBL.x, pBL.y);
        ctx.lineTo(pBR.x, pBR.y);
        ctx.closePath();
        ctx.fill();

        // Glass edges
        ctx.strokeStyle = 'rgba(140, 200, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pBL.x, pBL.y);
        ctx.lineTo(pBR.x, pBR.y);
        ctx.closePath();
        ctx.stroke();

        // Label
        ctx.font = '12px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(140, 180, 220, 0.6)';
        ctx.textAlign = 'center';
        ctx.fillText('Glass Prism', cx, pBL.y + 22);
        ctx.textAlign = 'left';
    }

    function drawIncidentBeam() {
        // White beam from left to prism entry point
        const progress = Math.min(1, beamX / entryX);
        const endX = beamX;

        ctx.setLineDash([8, 6]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(30, beamY);
        ctx.lineTo(endX, beamY);
        ctx.stroke();

        // Beam dot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(beamX, beamY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.setLineDash([]);
    }

    function drawSpectrumBeams() {
        // Only draw spectrum if beam has reached the prism entry
        if (beamX < entryX) return;

        // Internal path (white → entry → exit)
        ctx.strokeStyle = 'rgba(220, 240, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(entryX, entryY);
        ctx.lineTo(exitX, exitY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Spectrum beams
        colors.forEach((col, i) => {
            const rad = col.angle * Math.PI / 180;
            const len = 280;
            const endX = exitX + len * Math.cos(rad);
            const endY = exitY + len * Math.sin(rad);

            ctx.strokeStyle = col.c;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.85;
            ctx.beginPath();
            ctx.moveTo(exitX, exitY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.globalAlpha = 1;

            // Color label
            if (i === 0 || i === colors.length - 1) {
                ctx.font = '11px "Space Grotesk", sans-serif';
                ctx.fillStyle = col.c;
                ctx.fillText(col.label, endX + 4, endY + 4);
            }
        });
    }

    function drawNormalLine() {
        // Normal to prism surface at entry point
        ctx.strokeStyle = 'rgba(140, 140, 180, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(entryX - 30, entryY - 50);
        ctx.lineTo(entryX + 30, entryY + 50);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function drawLabels() {
        ctx.font = '600 15px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(52, 211, 153, 0.9)';
        ctx.fillText('Light Reflection & Refraction', 18, 32);

        ctx.font = '13px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(160, 210, 190, 0.65)';
        ctx.fillText('White light disperses into spectrum as it refracts through glass', 18, 56);

        ctx.fillStyle = 'rgba(140, 190, 170, 0.7)';
        ctx.fillText('n(violet) > n(red)  →  violet bends most (Snell\'s Law)', 18, 80);
    }

    function animate() {
        drawBackground();
        drawNormalLine();
        drawPrism();
        drawIncidentBeam();
        drawSpectrumBeams();
        drawLabels();

        beamX += beamSpeed;
        if (beamX > entryX + 20) beamX = 30;

        requestAnimationFrame(animate);
    }

    animate();
}

window.startLightReflectionRefraction = startLightReflectionRefraction;
