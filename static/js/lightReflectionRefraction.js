function startLightReflectionRefraction(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const prismWidth = 200;
    const prismHeight = 200;

    let whiteLightX = 50;
    const whiteLightSpeed = 2;

    function drawPrism() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // 半透明白色
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - prismWidth / 2, centerY + prismHeight / 2);
        ctx.lineTo(centerX + prismWidth / 2, centerY + prismHeight / 2);
        ctx.lineTo(centerX, centerY - prismHeight / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawWhiteLight() {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(whiteLightX, centerY);
        ctx.lineTo(centerX - prismWidth / 4, centerY);
        ctx.stroke();
    }

    function drawSpectrum() {
        const refractionPointX = centerX - prismWidth / 4;
        const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
        const angles = [-15, -10, -5, 0, 5, 10, 15]; // 分光后的角度

        colors.forEach((color, index) => {
            const angle = angles[index] * (Math.PI / 180); // 转换为弧度
            const endX = refractionPointX + 500 * Math.cos(angle); // 出射光线延长到屏幕外
            const endY = centerY + 500 * Math.sin(angle);

            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(refractionPointX, centerY);
            ctx.lineTo(centerX + prismWidth / 4, centerY + (index - 3) * 10); // 光线在棱镜内部的路径
            ctx.lineTo(endX, endY);
            ctx.stroke();
        });
    }

    function animate() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawPrism();
        if (whiteLightX < centerX - prismWidth / 4) {
            drawWhiteLight();
            whiteLightX += whiteLightSpeed; // 光源移动
        } else {
            drawWhiteLight();
            drawSpectrum(); // 光源到达棱镜后显示分光
        }
        requestAnimationFrame(animate);
    }

    animate();
}

window.startLightReflectionRefraction = startLightReflectionRefraction;