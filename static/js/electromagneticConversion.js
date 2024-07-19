function startElectromagneticConversion(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const coilX = canvas.width / 2;
    const coilY = canvas.height / 2;
    const coilWidth = 500; // 线圈宽度加倍300
    const coilHeight = 200; // 线圈高度加倍200
    const coilTurns = 10;
    const magnetWidth = 200; // 磁铁宽度加倍200
    const magnetHeight = 150; // 磁铁高度加倍120
    let magnetX = -magnetWidth;
    let magnetDirection = 2;
    let currentFlowing = false;

    // 预加载图片
    const magnetImage = new Image();
    magnetImage.src = 'image/magnet.jpeg';
    const bulbImageOn = new Image();
    bulbImageOn.src = 'image/lightbulb_on.heic';
    const bulbImageOff = new Image();
    bulbImageOff.src = 'image/lightbulb_off.heic';

    function drawCoil() {
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.8)';
        ctx.lineWidth = 2;
        const step = coilWidth / coilTurns;
        for (let i = 0; i < coilTurns; i++) {
            ctx.beginPath();
            ctx.moveTo(coilX - coilWidth / 2 + i * step, coilY - coilHeight / 2);
            ctx.lineTo(coilX - coilWidth / 2 + (i + 0.5) * step, coilY + coilHeight / 2);
            ctx.lineTo(coilX - coilWidth / 2 + (i + 1) * step, coilY - coilHeight / 2);
            ctx.stroke();
        }

        // 绘制连接线
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(coilX - coilWidth / 2, coilY + coilHeight / 2);
        ctx.lineTo(coilX - coilWidth / 2, coilY + coilHeight / 2 + 130);
        ctx.lineTo(coilX - 10, coilY + coilHeight / 2 + 130);
        ctx.moveTo(coilX + coilWidth / 2, coilY + coilHeight / 2);
        ctx.lineTo(coilX + coilWidth / 2, coilY + coilHeight / 2 + 130);
        ctx.lineTo(coilX + 10, coilY + coilHeight / 2 + 130);
        ctx.stroke();
    }

    function drawMagnet() {
        // 绘制磁铁图片
        ctx.drawImage(magnetImage, magnetX, coilY - magnetHeight / 2, magnetWidth, magnetHeight);
    }

    function drawCurrentFlow() {
        // 灯泡位置
        const bulbX = coilX - 20;
        const bulbY = coilY + coilHeight / 2 + 60;

        // 选择正确的灯泡图片
        const bulbImage = currentFlowing ? bulbImageOn : bulbImageOff;

        // 绘制灯泡图片
        ctx.drawImage(bulbImage, bulbX, bulbY, 40, 80);

        // 绘制连接线穿过灯泡
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(coilX - coilWidth / 2, coilY - coilHeight / 2);
        ctx.lineTo(coilX - coilWidth / 2, coilY + coilHeight / 2 + 100);
        ctx.moveTo(coilX + coilWidth / 2, coilY - coilHeight / 2);
        ctx.lineTo(coilX + coilWidth / 2, coilY + coilHeight / 2 + 100);
        ctx.moveTo(coilX - 10, coilY + coilHeight / 2 + 140);
        ctx.lineTo(coilX + 10, coilY + coilHeight / 2 + 140);
        ctx.stroke();
    }

    function update() {
        magnetX += magnetDirection;
        if (magnetX > canvas.width || magnetX < -magnetWidth) {
            magnetDirection *= -1;
        }
        currentFlowing = magnetX > coilX - coilWidth / 2 && magnetX < coilX + coilWidth / 2;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMagnet();  // 确保磁铁绘制在后
        drawCoil();
        drawCurrentFlow();
        update();
        requestAnimationFrame(animate);
    }

    // 确保图片加载完成后开始动画
    magnetImage.onload = () => {
        bulbImageOn.onload = () => {
            bulbImageOff.onload = () => {
                animate();
            };
        };
    };
}

window.startElectromagneticConversion = startElectromagneticConversion;