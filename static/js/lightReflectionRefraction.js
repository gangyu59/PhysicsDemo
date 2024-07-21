function startLightReflectionRefraction(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const prismWidth = 200;
    const prismHeight = 200;

    let whiteLightX = 0;
    const whiteLightSpeed = 2;
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    const angles = [10, 12, 14.5, 17.5, 21, 25, 29.5]; // 向下折射的角度

    let spectrumStartX = null;
    const spectrumSpeed = 2;
    let spectrumPositions = [];

    function drawPrism() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // 半透明白色
        ctx.beginPath();
        ctx.moveTo(centerX - prismWidth / 2, centerY + prismHeight / 2);
        ctx.lineTo(centerX + prismWidth / 2, centerY + prismHeight / 2);
        ctx.lineTo(centerX, centerY - prismHeight / 2);
        ctx.closePath();
        ctx.fill();
    }

    function drawWhiteLight() {
        ctx.setLineDash([10, 5]);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(whiteLightX, centerY);
        ctx.lineTo(centerX - prismWidth / 4, centerY);
        ctx.stroke();
    }

    function drawSpectrum() {
        const refractionPointX = centerX - prismWidth / 4;
        const exitPointX = centerX + prismWidth / 4;

        colors.forEach((color, index) => {
            const angle = angles[index] * (Math.PI / 180); // 转换为弧度
            const startX = exitPointX;
            const startY = centerY + index * 10;
            const endX = startX + 500 * Math.cos(angle);
            const endY = startY + 500 * Math.sin(angle);

            if (!spectrumPositions[index]) {
                spectrumPositions[index] = { x: startX, y: startY };
            }

            const pos = spectrumPositions[index];
            pos.x += spectrumSpeed * Math.cos(angle);
            pos.y += spectrumSpeed * Math.sin(angle);

            if (pos.x > endX) {
                pos.x = startX;
                pos.y = startY;
            }

            ctx.setLineDash([10, 5]);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(refractionPointX, centerY);
            ctx.lineTo(exitPointX, startY); // 光线在棱镜内部的路径
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        });
    }

    function animate() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawPrism();

        // 让白光流动
        whiteLightX += whiteLightSpeed;
        if (whiteLightX > centerX - prismWidth / 4) {
            whiteLightX = 0;
        }

        drawWhiteLight();
        drawSpectrum();

        requestAnimationFrame(animate);
    }

    animate();
}

window.startLightReflectionRefraction = startLightReflectionRefraction;