function startWaterSiphon(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const container1 = {
        x: canvas.width / 4,
        y: canvas.height / 2,
        width: 130, // 放大30%
        height: 195, // 放大30%
        waterHeight: 130 // 放大30%
    };

    const container2 = {
        x: (canvas.width * 3) / 4 - 130, // 放大30%
        y: canvas.height / 2,
        width: 130, // 放大30%
        height: 195, // 放大30%
        waterHeight: 26 // 放大30%
    };

    const pipe = {
        x1: container1.x + container1.width,
        y1: container1.y + container1.height - container1.waterHeight,
        x2: container2.x,
        y2: container2.y + container2.height - container2.waterHeight,
        width: 10
    };

    const siphonHeight = 65; // 放大30%
    const siphonSpeed = 1; // 虹吸速度

    function drawContainer(container) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(container.x, container.y, container.width, container.height);
        ctx.fillStyle = 'blue';
        ctx.fillRect(container.x, container.y + container.height - container.waterHeight, container.width, container.waterHeight);
    }

    function drawPipe() {
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = pipe.width;
        ctx.beginPath();
        ctx.moveTo(pipe.x1, pipe.y1);
        ctx.lineTo(pipe.x1, pipe.y1 - siphonHeight);
        ctx.lineTo(pipe.x2, pipe.y2 - siphonHeight);
        ctx.lineTo(pipe.x2, pipe.y2);
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawContainer(container1);
        drawContainer(container2);
        drawPipe();

        if (container1.waterHeight > 0 && container2.waterHeight < container2.height) {
            container1.waterHeight -= siphonSpeed;
            container2.waterHeight += siphonSpeed;
            pipe.y1 = container1.y + container1.height - container1.waterHeight;
            pipe.y2 = container2.y + container2.height - container2.waterHeight;
        }

        requestAnimationFrame(animate);
    }

    animate();
}

window.startWaterSiphon = startWaterSiphon;