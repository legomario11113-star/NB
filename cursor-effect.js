(function() {
  /* кастомный курсор — сердечко, следующее за мышкой (только для десктопа) */
  const cursor = document.createElement('div');
  cursor.id = 'customCursor';
  cursor.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 85 C50 85 5 55 5 28 C5 14 16 5 28 5 C36 5 44 9 50 16 C56 9 64 5 72 5 C84 5 95 14 95 28 C95 55 50 85 50 85Z" fill="#e07aa0"/>
    </svg>
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.addEventListener('mouseleave', function() {
    cursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function() {
    cursor.style.opacity = '1';
  });

  document.addEventListener('mousedown', function() {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
  });
  document.addEventListener('mouseup', function() {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  /* ====== шлейф из мелких сердечек — общая функция для мыши и пальца ====== */
  let lastTime = 0;
  function spawnTrailHeart(x, y) {
    const now = Date.now();
    if (now - lastTime < 60) return;
    lastTime = now;

    const el = document.createElement('span');
    el.textContent = '♥';
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${10 + Math.random() * 8}px;
      color: #e07aa0;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.8;
      transform: translate(-50%, -50%);
      animation: cursorTrailFade 0.8s ease-out forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  document.addEventListener('mousemove', function(e) {
    spawnTrailHeart(e.clientX, e.clientY);
  });

  /* проведение пальцем по экрану — тот же шлейф */
  document.addEventListener('touchmove', function(e) {
    const touch = e.touches[0];
    if (!touch) return;
    spawnTrailHeart(touch.clientX, touch.clientY);
  }, { passive: true });

  /* ====== разлёт сердечек при тапе (мобилка) ====== */
  const burstColors = ['#ff4757', '#2ed573', '#1e90ff', '#ffd32a', '#e07aa0'];
  const burstEmojis = ['♥', '♡', '✦'];

  function spawnTapBurst(x, y) {
    const count = 5 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.textContent = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
      el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${14 + Math.random() * 14}px;
        color: ${burstColors[Math.floor(Math.random() * burstColors.length)]};
        pointer-events: none;
        z-index: 9999;
      `;

      const angle = Math.random() * 360;
      const dist = 40 + Math.random() * 60;
      const dx = Math.cos(angle * Math.PI / 180) * dist;
      const dy = Math.sin(angle * Math.PI / 180) * dist - 30;

      el.style.setProperty('--dx', dx + 'px');
      el.style.setProperty('--dy', dy + 'px');
      el.style.animation = 'tapBurst 0.7s ease-out forwards';

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 700);
    }
  }

  document.addEventListener('touchstart', function(e) {
    const touch = e.touches[0];
    if (!touch) return;
    spawnTapBurst(touch.clientX, touch.clientY);
  }, { passive: true });
})();