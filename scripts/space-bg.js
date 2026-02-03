
/**
 * Space background (no external libs).
 * 3D starfield + nebula dust + subtle parallax.
 */
(() => {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let w = 0, h = 0, dpr = 1;

  const state = {
    mx: 0, my: 0, // -0.5..0.5
    t: 0
  };

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Create stars in 3D space
  const STAR_COUNT = 900;
  const stars = [];
  const depth = 1200;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: rand(-w, w),
        y: rand(-h, h),
        z: rand(1, depth),
        r: rand(0.6, 1.8),
        tw: rand(0.2, 1.0), // twinkle phase
      });
    }
  }

  // Nebula particles (soft)
  const DUST_COUNT = 80;
  const dust = [];
  function initDust() {
    dust.length = 0;
    for (let i = 0; i < DUST_COUNT; i++) {
      dust.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(120, 360),
        a: rand(0.03, 0.09),
        vx: rand(-0.05, 0.05),
        vy: rand(-0.04, 0.04),
        hue: rand(190, 285)
      });
    }
  }

  function resetStar(s) {
    s.x = rand(-w, w);
    s.y = rand(-h, h);
    s.z = depth;
    s.r = rand(0.6, 1.8);
    s.tw = rand(0.2, 1.0);
  }

  function gradientBg() {
    const g = ctx.createRadialGradient(w*0.5, h*0.35, 0, w*0.5, h*0.35, Math.max(w, h));
    g.addColorStop(0, 'rgba(40, 60, 120, 0.45)');
    g.addColorStop(0.35, 'rgba(18, 20, 55, 0.70)');
    g.addColorStop(1, 'rgba(7, 8, 22, 0.95)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function drawDust() {
    for (const p of dust) {
      p.x += p.vx + state.mx * 0.4;
      p.y += p.vy + state.my * 0.3;

      // wrap
      if (p.x < -p.r) p.x = w + p.r;
      if (p.x > w + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = h + p.r;
      if (p.y > h + p.r) p.y = -p.r;

      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${p.a})`);
      g.addColorStop(0.6, `hsla(${p.hue}, 90%, 55%, ${p.a*0.45})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStars(dt) {
    const cx = w * 0.5;
    const cy = h * 0.5;
    const speed = 260; // pixels/sec equivalent in z space

    for (const s of stars) {
      s.z -= dt * speed;
      if (s.z <= 1) resetStar(s);

      // perspective projection
      const k = 520 / s.z;
      const px = cx + (s.x + state.mx * 120) * k;
      const py = cy + (s.y + state.my * 90) * k;

      if (px < -50 || px > w + 50 || py < -50 || py > h + 50) {
        // if it flies off-screen, recycle
        resetStar(s);
        continue;
      }

      const tw = 0.55 + 0.45 * Math.sin(state.t * 0.0015 + s.tw * 10);
      const alpha = Math.min(1, (1 - s.z / depth) * 0.95 + 0.05) * tw;

      const size = s.r * k * 1.15;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(0.3, size), 0, Math.PI * 2);
      ctx.fill();

      // subtle streak for motion (gives a 3D warp feel)
      if (size > 1.0) {
        ctx.strokeStyle = `rgba(140,200,255,${alpha * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - (state.mx * 6 + 2) * k, py - (state.my * 4 + 1.2) * k);
        ctx.stroke();
      }
    }
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    state.t = now;

    // clear
    ctx.clearRect(0, 0, w, h);
    gradientBg();
    drawDust();
    drawStars(dt);

    requestAnimationFrame(frame);
  }

  // interactions
  window.addEventListener('mousemove', (e) => {
    state.mx = (e.clientX / w) - 0.5;
    state.my = (e.clientY / h) - 0.5;
  }, { passive: true });

  window.addEventListener('deviceorientation', (e) => {
    // mild mobile parallax
    const gx = (e.gamma || 0) / 45;
    const by = (e.beta || 0) / 45;
    state.mx = Math.max(-0.6, Math.min(0.6, gx));
    state.my = Math.max(-0.6, Math.min(0.6, by));
  }, true);

  window.addEventListener('resize', () => {
    resize();
    initStars();
    initDust();
  });

  resize();
  initStars();
  initDust();
  requestAnimationFrame(frame);
})();
