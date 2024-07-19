function startSoundDiffraction(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const forkX = canvas.width / 2;
    const forkY = canvas.height / 2;
    const forkWidth = 60; // 音叉宽度增加
    const forkHeight = 300; // 音叉高度增加
    const particleCount = 2000; // 粒子数量增加
    const particles = [];
    let time = 0;
    let vibrating = false;

    const forkImage = new Image();
    forkImage.src = 'image/fork.heic';

    // 初始化粒子
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        // 确保音叉周围没有粒子，减少周围空白区域
        if ((x < forkX - forkWidth * 0.5 || x > forkX + forkWidth * 0.5) || (y < forkY - forkHeight * 0.5 || y > forkY + forkHeight * 0.5)) {
            particles.push({
                x: x,
                y: y,
                originalX: x,
                originalY: y,
            });
        }
    }

    function drawFork() {
        ctx.drawImage(forkImage, forkX - forkWidth / 2, forkY - forkHeight / 2, forkWidth, forkHeight);
    }

    function drawParticles() {
        particles.forEach(particle => {
            const distanceX = particle.x - forkX;
            const distanceY = particle.y - forkY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            const angle = Math.atan2(distanceY, distanceX);

            if (vibrating && distance < canvas.width / 2) {
                const offset = Math.sin((distance / 20) - (time / 5)) * 5;
                particle.x = particle.originalX + offset * Math.cos(angle);
                particle.y = particle.originalY + offset * Math.sin(angle);
            } else {
                particle.x = particle.originalX;
                particle.y = particle.originalY;
            }

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawParticles();
        drawFork();
        time++;
        requestAnimationFrame(animate);
    }

    canvas.addEventListener('touchstart', function (e) {
        const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
        const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;

        if (touchX > forkX - forkWidth / 2 && touchX < forkX + forkWidth / 2 &&
            touchY > forkY - forkHeight / 2 && touchY < forkY + forkHeight / 2) {
            vibrating = true;
            setTimeout(() => vibrating = false, 4000); // 振动持续4秒
        }
    });

    forkImage.onload = function() {
        animate();
    };
}

window.startSoundDiffraction = startSoundDiffraction;