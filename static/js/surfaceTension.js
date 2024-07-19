function startSurfaceTension(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const particles = [];
    const particleCount = 300; // 粒子数量
    const waterLevel = canvas.height / 2;
    const dropletRadius = 10;
    const dropletCount = 5;

    // 初始化粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height - waterLevel) + waterLevel,
            vx: 0,
            vy: 0,
            radius: 3,
            color: 'blue'
        });
    }

    // 初始化水滴
    const droplets = [];
    for (let i = 0; i < dropletCount; i++) {
        droplets.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height - waterLevel) + waterLevel - dropletRadius * 2,
            radius: dropletRadius,
            color: 'blue'
        });
    }

    // 绘制水面
    function drawWaterSurface() {
        ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
        ctx.fillRect(0, waterLevel, canvas.width, canvas.height - waterLevel);
    }

    // 绘制粒子
    function drawParticles() {
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
    }

    // 绘制水滴
    function drawDroplets() {
        droplets.forEach(droplet => {
            ctx.beginPath();
            ctx.arc(droplet.x, droplet.y, droplet.radius, 0, Math.PI * 2);
            ctx.fillStyle = droplet.color;
            ctx.fill();
        });
    }

    // 更新粒子位置
    function updateParticles() {
        particles.forEach(particle => {
            // 计算粒子间的相互作用力（模拟表面张力）
            particles.forEach(other => {
                if (particle !== other) {
                    const dx = other.x - particle.x;
                    const dy = other.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 50) { // 相互作用范围
                        const force = (50 - distance) / 5000; // 减小吸引力
                        particle.vx += force * dx / distance;
                        particle.vy += force * dy / distance;
                    }
                }
            });

            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 边界处理
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < waterLevel) particle.y = waterLevel;
            if (particle.y > canvas.height) particle.y = canvas.height;

            // 增加摩擦力
            particle.vx *= 0.95; 
            particle.vy *= 0.95;
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWaterSurface();
        drawParticles();
        drawDroplets();
        updateParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

window.startSurfaceTension = startSurfaceTension;