let patternBase;
let patternLayer;
let patternSeed = 1;
let isGoalsActive = true;
let p5Ready = false;

window.setGoalsSketchActive = function setGoalsSketchActive(isActive) {
  isGoalsActive = Boolean(isActive);
  if (!p5Ready) return;
  if (isGoalsActive) loop();
  else noLoop();
};

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  const holder = document.getElementById("p5-bg");
  if (holder) canvas.parent(holder);
  pixelDensity(1);
  createPatternLayer();
  p5Ready = true;
  if (!isGoalsActive) noLoop();
}

function draw() {
  background("#1840f2");
  animatePatternDisplacement(frameCount * 0.006);
  imageMode(CORNER);
  image(patternLayer, 0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createPatternLayer();
}

function createPatternLayer() {
  patternBase = createGraphics(windowWidth, windowHeight);
  patternLayer = createGraphics(windowWidth, windowHeight);
  patternBase.pixelDensity(1);
  patternLayer.pixelDensity(1);
  regenerateBluePattern();
}

function regenerateBluePattern() {
  const g = patternBase;
  const w = g.width;
  const h = g.height;

  randomSeed(patternSeed);
  noiseSeed(patternSeed);

  g.clear();
  g.background(14, 42, 184, 245);
  drawAbstractLeftBlue(g, 0, 0, w, h);
}

function drawAbstractLeftBlue(g, x, y, w, h) {
  const cols = floor(map(noise(patternSeed * 0.13), 0, 1, 12, 20));
  const rows = floor(map(noise(patternSeed * 0.29), 0, 1, 26, 42));
  const cw = w / cols;
  const ch = h / rows;

  g.noStroke();

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const noiseVal = noise(i * 0.1 + patternSeed * 0.03, j * 0.1 + patternSeed * 0.03);

      if (noiseVal < 0.4) {
        g.fill(34, 102, 255, 130);
      } else if (noiseVal < 0.7) {
        g.fill(16, 52, 200, 140);
      } else {
        g.fill(6, 20, 88, 150);
      }

      g.rect(x + i * cw, y + j * ch, cw + 1, ch + 1);
    }
  }

  const overlayCount = floor(cols * rows * 0.35);

  for (let n = 0; n < overlayCount; n++) {
    const rx = floor(random(cols));
    const ry = floor(random(rows));
    const rw = cw * random(0.6, 1.4);
    const rh = ch * random(0.6, 1.4);
    const roll = random();

    if (roll < 0.33) g.fill(34, 102, 255, 95);
    else if (roll < 0.66) g.fill(16, 52, 200, 105);
    else g.fill(6, 20, 88, 115);

    g.rect(x + rx * cw, y + ry * ch, rw, rh);
  }
}

function animatePatternDisplacement(t) {
  const w = patternLayer.width;
  const h = patternLayer.height;

  patternLayer.clear();
  patternLayer.image(patternBase, 0, 0);

  for (let y = 0; y < h;) {
    const bandH = floor(map(noise(y * 0.009 + t * 0.75), 0, 1, 16, 64));
    const shift = map(noise(y * 0.013 + t * 0.9), 0, 1, -88, 88);

    patternLayer.copy(patternBase, 0, y, w, bandH, shift, y, w, bandH);
    y += bandH;
  }

  for (let i = 0; i < 11; i++) {
    const by = floor(map(noise(i * 0.7 + t * 0.6), 0, 1, 0, h - 40));
    const bh = floor(map(noise(i * 1.4 + t * 0.5), 0, 1, 24, 92));
    const bx = floor(map(noise(i * 2.1 + t * 0.55), 0, 1, 0, w - 140));
    const bw = floor(map(noise(i * 2.8 + t * 0.4), 0, 1, 90, 280));
    const sx = floor(map(noise(i * 3.2 + t), 0, 1, -120, 120));

    patternLayer.copy(patternBase, bx, by, bw, bh, bx + sx, by, bw, bh);
  }
}

let wheelDelta = 0;
let lastMessageTime = 0;
window.addEventListener("wheel", (event) => {
  const now = Date.now();
  if (now - lastMessageTime < 1400) {
    wheelDelta = 0;
    return;
  }

  wheelDelta += event.deltaY;
  if (wheelDelta < -120) {
    window.parent.postMessage("scrollUp", "*");
    lastMessageTime = now;
    wheelDelta = 0;
  } else if (wheelDelta > 0) {
    wheelDelta = 0;
  }
}, { passive: true });

window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "pageVisibility") return;
  window.setGoalsSketchActive(data.isActive);
});
