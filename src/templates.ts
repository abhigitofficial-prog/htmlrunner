import { PresetTemplate } from './types';

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'cyber-card',
    name: '3D Interactive Glass Card',
    category: 'UI Component',
    description: 'Dynamic perspective 3D tilt card with specular highlights and ambient glow on mouse move.',
    html: `<div class="scene">
  <div class="card" id="card">
    <div class="glow" id="glow"></div>
    <div class="card-content">
      <div class="chip"></div>
      <div class="badge">PROTOTYPE 01</div>
      <h2>Kinetic Surface</h2>
      <p>Interactive 3D card physics built with vanilla JavaScript, dynamic CSS custom properties, and perspective transforms.</p>
      
      <div class="stats">
        <div class="stat-item">
          <span class="label">Response</span>
          <span class="value">0.02ms</span>
        </div>
        <div class="stat-item">
          <span class="label">FPS</span>
          <span class="value" id="fps-counter">60</span>
        </div>
        <div class="stat-item">
          <span class="label">State</span>
          <span class="value" style="color: #4ade80;">Active</span>
        </div>
      </div>

      <div class="actions">
        <button id="trigger-pulse" class="btn primary">Pulse Field</button>
        <button id="reset-card" class="btn secondary">Reset Axis</button>
      </div>
    </div>
  </div>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 50%, #18181b 0%, #09090b 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #fafafa;
  overflow: hidden;
}

.scene {
  perspective: 1000px;
  padding: 20px;
}

.card {
  position: relative;
  width: 380px;
  padding: 32px;
  border-radius: 20px;
  background: rgba(24, 24, 27, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transform-style: preserve-3d;
  transition: transform 0.15s ease-out, box-shadow 0.2s ease;
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6),
              0 0 0 1px rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.card:hover {
  border-color: rgba(255, 255, 255, 0.25);
}

.glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(255, 255, 255, 0.18) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.card:hover .glow {
  opacity: 1;
}

.card-content {
  transform: translateZ(40px);
}

.chip {
  width: 44px;
  height: 32px;
  background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
  border-radius: 6px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
}

.badge {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #a1a1aa;
  margin-bottom: 8px;
  font-weight: 600;
}

h2 {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  color: #ffffff;
}

p {
  font-size: 14px;
  line-height: 1.6;
  color: #a1a1aa;
  margin-bottom: 24px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 11px;
  color: #71717a;
}

.value {
  font-size: 15px;
  font-weight: 600;
  font-family: monospace;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn.primary {
  background: #ffffff;
  color: #09090b;
}

.btn.primary:hover {
  background: #e4e4e7;
  transform: translateY(-1px);
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #fafafa;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.14);
}`,
    js: `const card = document.getElementById('card');
const glow = document.getElementById('glow');
const triggerBtn = document.getElementById('trigger-pulse');
const resetBtn = document.getElementById('reset-card');
const fpsCounter = document.getElementById('fps-counter');

console.log('Card studio loaded successfully.');

let bounds;
function refreshBounds() {
  bounds = card.getBoundingClientRect();
}

window.addEventListener('resize', refreshBounds);
refreshBounds();

card.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX - bounds.left;
  const mouseY = e.clientY - bounds.top;
  
  const leftX = mouseX - bounds.width / 2;
  const topY = mouseY - bounds.height / 2;
  
  const rotateX = -topY / 12;
  const rotateY = leftX / 12;
  
  card.style.transform = \`rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale3d(1.02, 1.02, 1.02)\`;
  
  card.style.setProperty('--mouse-x', \`\${mouseX}px\`);
  card.style.setProperty('--mouse-y', \`\${mouseY}px\`);
});

card.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  console.log('Cursor exited card envelope');
});

triggerBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('Pulse triggered!');
  card.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.06)' },
    { transform: 'scale(1)' }
  ], {
    duration: 350,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  });
});

resetBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  console.info('Card orientation reset to default matrix.');
});

// Dynamic frame rate indicator
let lastLoop = performance.now();
function updateFPS() {
  const thisLoop = performance.now();
  const fps = Math.round(1000 / (thisLoop - lastLoop));
  lastLoop = thisLoop;
  if (fpsCounter) fpsCounter.innerText = Math.min(fps, 60);
  requestAnimationFrame(updateFPS);
}
requestAnimationFrame(updateFPS);`
  },
  {
    id: 'particle-canvas',
    name: 'Interactive Particle Vortex',
    category: 'Canvas & Animation',
    description: 'Hardware-accelerated HTML5 Canvas particle system connecting nodes within dynamic proximity.',
    html: `<div class="container">
  <canvas id="canvas"></canvas>
  <div class="hud">
    <div class="badge">INTERACTIVE SIMULATION</div>
    <h1>Particle Field</h1>
    <p>Move mouse to attract nodes. Click canvas to spawn kinetic bursts.</p>
    <div class="controls">
      <button id="clear-btn">Clear Field</button>
      <button id="add-btn">Add 40 Nodes</button>
    </div>
  </div>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #000000;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
  height: 100vh;
}

.container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hud {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 10;
  background: rgba(10, 10, 12, 0.7);
  backdrop-filter: blur(12px);
  padding: 20px 24px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 320px;
  pointer-events: auto;
}

.badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #38bdf8;
  margin-bottom: 6px;
}

h1 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

p {
  font-size: 13px;
  color: #a1a1aa;
  line-height: 1.5;
  margin-bottom: 16px;
}

.controls {
  display: flex;
  gap: 8px;
}

button {
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background: #38bdf8;
  color: #000;
  border-color: #38bdf8;
}`,
    js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const particles = [];
const mouse = { x: null, y: null, radius: 140 };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor(x, y) {
    this.x = x ?? Math.random() * width;
    this.y = y ?? Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.size = Math.random() * 2 + 1;
    this.hue = 190 + Math.random() * 40;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 3;
        this.y -= (dy / dist) * force * 3;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = \`hsl(\${this.hue}, 80%, 65%)\`;
    ctx.fill();
  }
}

function init(count = 75) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
init(80);
console.log('Initialized particle canvas with 80 nodes');

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    p1.update();
    p1.draw();

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 110) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = \`rgba(56, 189, 248, \${1 - dist / 110 * 0.9})\`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') return;
  for (let i = 0; i < 15; i++) {
    particles.push(new Particle(e.clientX, e.clientY));
  }
  console.log(\`Burst! Active nodes: \${particles.length}\`);
});

document.getElementById('clear-btn').addEventListener('click', () => {
  particles.length = 0;
  console.warn('Particle field cleared.');
});

document.getElementById('add-btn').addEventListener('click', () => {
  init(40);
  console.log(\`Added 40 nodes. Total: \${particles.length}\`);
});`
  },
  {
    id: 'pomodoro-timer',
    name: 'Precision Stopwatch & Timer',
    category: 'Application',
    description: 'Ultra-clean dark stopwatch and lap recorder with millisecond accuracy and audio chime.',
    html: `<div class="app-wrap">
  <div class="device">
    <div class="header">
      <span class="brand">CHRONO·X</span>
      <span class="mode-tag" id="status-tag">READY</span>
    </div>

    <div class="display-ring">
      <div class="time-readout">
        <span id="time-display" class="main-time">00:00.00</span>
        <span class="msec-label">MINUTES : SECONDS . CENTISECONDS</span>
      </div>
    </div>

    <div class="controls">
      <button id="start-btn" class="btn primary">Start</button>
      <button id="lap-btn" class="btn secondary" disabled>Lap</button>
      <button id="reset-btn" class="btn danger" disabled>Reset</button>
    </div>

    <div class="laps-container">
      <div class="laps-header">
        <span>LAP #</span>
        <span>SPLIT</span>
        <span>TOTAL</span>
      </div>
      <ul id="laps-list" class="laps-list">
        <li class="empty-state">No recorded intervals yet.</li>
      </ul>
    </div>
  </div>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #f4f4f5;
  padding: 16px;
}

.device {
  width: 100%;
  max-width: 420px;
  background: #09090b;
  border: 1px solid #27272a;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.brand {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #a1a1aa;
}

.mode-tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  background: #18181b;
  color: #a1a1aa;
  font-family: monospace;
}

.display-ring {
  padding: 36px 16px;
  background: radial-gradient(circle, #18181b 0%, #09090b 100%);
  border-radius: 18px;
  border: 1px solid #27272a;
  text-align: center;
  margin-bottom: 24px;
}

.main-time {
  display: block;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #ffffff;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.msec-label {
  display: block;
  font-size: 9px;
  color: #71717a;
  letter-spacing: 0.15em;
  margin-top: 8px;
}

.controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}

.btn {
  padding: 14px 0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn.primary {
  background: #ffffff;
  color: #000000;
}

.btn.primary:not(:disabled):hover {
  background: #e4e4e7;
}

.btn.primary.running {
  background: #eab308;
  color: #000;
}

.btn.secondary {
  background: #18181b;
  color: #f4f4f5;
  border-color: #27272a;
}

.btn.secondary:not(:disabled):hover {
  background: #27272a;
}

.btn.danger {
  background: #18181b;
  color: #ef4444;
  border-color: #27272a;
}

.btn.danger:not(:disabled):hover {
  background: rgba(239, 68, 68, 0.15);
}

.laps-container {
  background: #121215;
  border-radius: 12px;
  border: 1px solid #27272a;
  overflow: hidden;
}

.laps-header {
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
  font-size: 10px;
  color: #71717a;
  font-weight: 600;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #27272a;
}

.laps-list {
  list-style: none;
  max-height: 160px;
  overflow-y: auto;
}

.laps-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
  font-size: 13px;
  font-family: monospace;
  border-bottom: 1px solid #1c1c20;
}

.laps-list li:last-child {
  border-bottom: none;
}

.empty-state {
  color: #52525b;
  font-style: italic;
  justify-content: center !important;
  padding: 24px !important;
}`,
    js: `let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let laps = [];
let lastLapTime = 0;

const display = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const lapBtn = document.getElementById('lap-btn');
const resetBtn = document.getElementById('reset-btn');
const statusTag = document.getElementById('status-tag');
const lapsList = document.getElementById('laps-list');

function formatTime(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return \`\${String(m).padStart(2, '0')}:\${String(s).padStart(2, '0')}.\${String(cs).padStart(2, '0')}\`;
}

function updateDisplay() {
  const current = Date.now() - startTime + elapsedTime;
  display.innerText = formatTime(current);
}

startBtn.addEventListener('click', () => {
  if (timerInterval) {
    // Pause
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime += Date.now() - startTime;
    startBtn.innerText = 'Resume';
    startBtn.classList.remove('running');
    statusTag.innerText = 'PAUSED';
    console.log('Timer paused at:', display.innerText);
  } else {
    // Start
    startTime = Date.now();
    timerInterval = setInterval(updateDisplay, 10);
    startBtn.innerText = 'Stop';
    startBtn.classList.add('running');
    lapBtn.disabled = false;
    resetBtn.disabled = false;
    statusTag.innerText = 'RUNNING';
    console.log('Timer started');
  }
});

lapBtn.addEventListener('click', () => {
  const current = Date.now() - startTime + elapsedTime;
  const split = current - lastLapTime;
  lastLapTime = current;
  laps.unshift({ num: laps.length + 1, split, total: current });
  renderLaps();
  console.info(\`Lap \${laps.length} recorded: \${formatTime(split)}\`);
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  elapsedTime = 0;
  startTime = 0;
  lastLapTime = 0;
  laps = [];
  display.innerText = '00:00.00';
  startBtn.innerText = 'Start';
  startBtn.classList.remove('running');
  lapBtn.disabled = true;
  resetBtn.disabled = true;
  statusTag.innerText = 'READY';
  renderLaps();
  console.log('Timer reset');
});

function renderLaps() {
  if (laps.length === 0) {
    lapsList.innerHTML = '<li class="empty-state">No recorded intervals yet.</li>';
    return;
  }
  lapsList.innerHTML = laps
    .map(
      (l) =>
        \`<li>
          <span style="color:#a1a1aa">#\${String(l.num).padStart(2, '0')}</span>
          <span style="color:#38bdf8">+\${formatTime(l.split)}</span>
          <span>\${formatTime(l.total)}</span>
        </li>\`
    )
    .join('');
}`
  },
  {
    id: 'starter',
    name: 'Minimal Blank Starter',
    category: 'Boilerplate',
    description: 'Clean HTML5, CSS and JavaScript starter boilerplate for your own custom ideas.',
    html: `<div class="wrapper">
  <div class="card">
    <h1>Hello, World!</h1>
    <p>Start writing your code in the HTML, CSS, and JS tabs.</p>
    <button id="counter-btn">Clicks: 0</button>
  </div>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  color: #fff;
  font-family: system-ui, -apple-system, sans-serif;
}

.wrapper {
  text-align: center;
}

.card {
  padding: 40px;
  background: #111;
  border: 1px solid #222;
  border-radius: 16px;
  max-width: 400px;
}

h1 {
  font-size: 28px;
  margin-bottom: 12px;
}

p {
  color: #888;
  margin-bottom: 24px;
  font-size: 14px;
}

button {
  padding: 10px 24px;
  background: #fff;
  color: #000;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.85;
}`,
    js: `let count = 0;
const btn = document.getElementById('counter-btn');

btn.addEventListener('click', () => {
  count++;
  btn.innerText = \`Clicks: \${count}\`;
  console.log(\`Button clicked. Count is now: \${count}\`);
});

console.log('Minimal starter active.');`
  }
];
