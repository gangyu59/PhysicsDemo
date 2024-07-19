document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    let currentAnimation = null;
    let animationFrameId = null;

    function clearCurrentAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (currentAnimation) {
            clearInterval(currentAnimation);
            currentAnimation = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    document.getElementById('showLiquidEvaporation').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startLiquidEvaporation === 'function') {
            startLiquidEvaporation(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showCrystallization').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startCrystallization === 'function') {
            startCrystallization(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showSolidMelting').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startSolidMelting === 'function') {
            startSolidMelting(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showGasLiquefaction').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startGasLiquefaction === 'function') {
            startGasLiquefaction(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showElectromagneticConversion').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startElectromagneticConversion === 'function') {
            startElectromagneticConversion(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showLightInterference').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startLightInterference === 'function') {
            startLightInterference(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showSoundDiffraction').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startSoundDiffraction === 'function') {
            startSoundDiffraction(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showWaterSiphon').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startWaterSiphon === 'function') {
            startWaterSiphon(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showSurfaceTension').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startSurfaceTension === 'function') {
            startSurfaceTension(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showLightReflectionRefraction').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startLightReflectionRefraction === 'function') {
            startLightReflectionRefraction(canvas, ctx, clearCurrentAnimation);
        }
    });
});