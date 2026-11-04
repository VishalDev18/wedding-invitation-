/**
 * Royal Golden Scratch-to-Reveal Date Card
 * Groom's Edition - Ashish & Shivangi
 */

function initScratchCard() {
  const canvas = document.getElementById('scratchCanvas');
  const container = document.getElementById('scratchContainer');
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let isRevealed = false;

  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    paintGoldFoil();
  }

  function paintGoldFoil() {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#e8ca78');
    grad.addColorStop(0.25, '#d4af37');
    grad.addColorStop(0.5, '#fff6c2');
    grad.addColorStop(0.75, '#b8860b');
    grad.addColorStop(1, '#966311');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#4e3305';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    ctx.strokeStyle = '#fff0aa';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    ctx.fillStyle = '#0b1a33';
    ctx.font = 'bold 14px "Cinzel Decorative", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH WITH FINGER OR CURSOR ✨', canvas.width / 2, canvas.height / 2 - 14);

    ctx.font = 'italic 13px "Playfair Display", serif';
    ctx.fillStyle = '#22385b';
    ctx.fillText('To Reveal The Auspicious Vivah Muhurat', canvas.width / 2, canvas.height / 2 + 12);
  }

  function getTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  function scratch(e) {
    if (!isDrawing || isRevealed) return;
    e.preventDefault();

    const pos = getTouchPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  }

  function checkScratchPercentage() {
    if (isRevealed) return;
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;

      for (let i = 3; i < pixels.length; i += 32) {
        if (pixels[i] === 0) transparentCount++;
      }

      const ratio = transparentCount / (pixels.length / 32);
      if (ratio > 0.38) {
        revealFullDate();
      }
    } catch (e) {}
  }

  function revealFullDate() {
    if (isRevealed) return;
    isRevealed = true;
    canvas.style.transition = 'opacity 0.8s ease';
    canvas.style.opacity = '0';
    setTimeout(() => {
      canvas.style.display = 'none';
    }, 850);

    if (window.burstPetals) {
      window.burstPetals(35);
    }

    const badge = document.getElementById('scratchSuccessBadge');
    if (badge) {
      badge.classList.add('visible');
    }
  }

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    scratch(e);
  });
  window.addEventListener('mouseup', () => {
    isDrawing = false;
  });
  canvas.addEventListener('mousemove', scratch);

  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    scratch(e);
  }, { passive: false });
  window.addEventListener('touchend', () => {
    isDrawing = false;
  });
  canvas.addEventListener('touchmove', scratch, { passive: false });

  const autoRevealBtn = document.getElementById('autoRevealBtn');
  if (autoRevealBtn) {
    autoRevealBtn.addEventListener('click', () => {
      revealFullDate();
    });
  }

  window.addEventListener('resize', () => {
    if (!isRevealed) resizeCanvas();
  });

  resizeCanvas();
}

document.addEventListener('DOMContentLoaded', initScratchCard);

