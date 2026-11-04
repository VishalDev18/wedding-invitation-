/**
 * Rose & Golden Marigold Petal Particle System
 * Groom's Edition - Ashish & Shivangi
 */

(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'petalCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let isPetalsEnabled = true;
  const petals = [];
  const MAX_PETALS = window.innerWidth < 768 ? 16 : 36;

  // Royal Celebration Petal Colors (Gold, Marigold, Scarlet & White Jasmine)
  const colors = [
    { fill: '#ffb703', shadow: '#d48b00' }, // Auspicious Genda (Yellow Marigold)
    { fill: '#f4a261', shadow: '#e76f51' }, // Saffron Marigold
    { fill: '#e63946', shadow: '#9d1823' }, // Scarlet Rose
    { fill: '#d4af37', shadow: '#966311' }, // Royal Gold Shimmer
    { fill: '#fff3b8', shadow: '#d4af37' }, // Fragrant White Jasmine
  ];

  class Petal {
    constructor(x, y, isBurst = false) {
      this.reset(x, y, isBurst);
    }

    reset(x, y, isBurst = false) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : (isBurst ? height * 0.45 : -20 - Math.random() * 40);
      this.size = 9 + Math.random() * 11;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      if (isBurst) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 6;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed - 2;
      } else {
        this.speedX = -0.8 + Math.random() * 1.6;
        this.speedY = 1.0 + Math.random() * 1.8;
      }

      this.rotation = Math.random() * 360;
      this.rotationSpeed = -1.5 + Math.random() * 3;
      this.oscillation = Math.random() * Math.PI * 2;
      this.oscillationSpeed = 0.015 + Math.random() * 0.025;
      this.opacity = 0.55 + Math.random() * 0.35;
      this.shape = Math.random() > 0.4 ? 'rose' : 'marigold';
    }

    update() {
      this.oscillation += this.oscillationSpeed;
      this.x += this.speedX + Math.sin(this.oscillation) * 0.9;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20 || this.x < -25 || this.x > width + 25) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      ctx.fillStyle = this.color.fill;
      ctx.beginPath();

      if (this.shape === 'rose') {
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size * 0.75, -this.size * 0.55, this.size * 1.0, this.size * 0.75, 0, this.size * 1.25);
        ctx.bezierCurveTo(-this.size * 1.0, this.size * 0.75, -this.size * 0.75, -this.size * 0.55, 0, 0);
      } else {
        ctx.ellipse(0, 0, this.size * 0.55, this.size * 1.0, Math.PI / 4, 0, Math.PI * 2);
      }

      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < MAX_PETALS; i++) {
    petals.push(new Petal(Math.random() * width, Math.random() * height));
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    if (isPetalsEnabled) {
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw();
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.burstPetals = function (count = 35) {
    for (let i = 0; i < count; i++) {
      const p = new Petal(width * 0.5 + (Math.random() * 160 - 80), height * 0.4 + (Math.random() * 80 - 40), true);
      petals.push(p);
      setTimeout(() => {
        const idx = petals.indexOf(p);
        if (idx > -1 && petals.length > MAX_PETALS) petals.splice(idx, 1);
      }, 3500);
    }
  };

  window.togglePetals = function () {
    isPetalsEnabled = !isPetalsEnabled;
    const btn = document.getElementById('petalToggleBtn');
    if (btn) {
      btn.classList.toggle('active', isPetalsEnabled);
    }
    return isPetalsEnabled;
  };

  animate();
})();

