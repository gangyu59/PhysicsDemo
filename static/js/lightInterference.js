function startLightInterference(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const numSlits = 5; // 多缝数量
    const slitDistance = 40; // 每个缝之间的距离
    const waveLength = 20; // 波长
    const numWaves = 30; // 波浪数目
    const speed = 0.5; // 动画速度
    let offset = 0; // 波浪偏移

    function drawSlits() {
        ctx.fillStyle = 'black';
        for (let i = 0; i < numSlits; i++) {
            const x = centerX + (i - (numSlits - 1) / 2) * slitDistance;
            ctx.fillRect(x - 1, centerY - 10, 2, 20); // 用黑色线条表示缝
        }
    }

    function drawWaves() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
        ctx.lineWidth = 2;

        for (let j = 0; j < numSlits; j++) {
            for (let i = 0; i < numWaves; i++) {
                const radius = i * waveLength + offset;
                const x = centerX + (j - (numSlits - 1) / 2) * slitDistance;
                drawCircle(x, centerY, radius);
            }
        }

        offset += speed;
        if (offset > waveLength) {
            offset = 0;
        }
    }

    function drawCircle(x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    function animate() {
        drawSlits();
        drawWaves();
        requestAnimationFrame(animate);
    }

    animate();
}

window.startLightInterference = startLightInterference;