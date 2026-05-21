let ribbons = [];
let numRibbons = 18;

// Off-screen buffers for the glitch background overlay.
let patternLayer;
let patternBase;
let patternSeed = 1;
let isSketchOpeningActive = true;
let swooshSoundPool = [];
let swooshSoundsUnlocked = false;
let swooshSoundUnlockHandlers = [];
let swooshSoundPoolIndex = 0;
const swooshSoundPoolSize = 4;
const swooshSoundVolume = Math.pow(10, -6 / 20);
let disappearSoundPool = [];
let disappearSoundPoolIndex = 0;
const disappearSoundPoolSize = 4;
const disappearSoundVolume = Math.pow(10, -6 / 20);
const disappearSoundSrc = 'disappear.mp3';
const disappearFallbackSoundSrc = 'swoosh.mp3';
let textHoverSound;
let lastTextHoverSoundPlayMs = -Infinity;
const textHoverSoundCooldownMs = 140;

window.setSketchOpeningActive = function setSketchOpeningActive(isActive) {
  const shouldRun = Boolean(isActive);
  if (isSketchOpeningActive === shouldRun) return;

  isSketchOpeningActive = shouldRun;
  if (isSketchOpeningActive) {
    loop();
  } else {
    stopAllSwooshSounds();
    stopAllDisappearSounds();
    stopTextHoverSound();
    noLoop();
  }
};

// ====================
// FIXED COLOR SET
// ====================

let palette = {
  bg: "#1840F2"
};

// ribbon 2 màu cố định
let ribbonColors = [
  "#ADF218",
  "#81D200"
];

// ====================
// SETUP
// ====================

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  const holder = document.getElementById("p5-bg");
  if (holder) {
    canvas.parent(holder);
  }

  pixelDensity(1);
  frameRate(30);
  noStroke();

  createPatternLayer();
  setupSwooshSounds();
  setupDisappearSounds();
  setupTextHoverSound();
  setupOpeningTitleHoverSound();

  for (let i = 0; i < numRibbons; i++) {
    ribbons.push(createRibbon(i));
  }

  if (!isSketchOpeningActive) {
    noLoop();
  }
}

// ====================
// CREATE RIBBON
// ====================

function createRibbon(index) {
  const side = random() < 0.5 ? -1 : 1;

  const laneMin = width * 0.05;
  const laneMax = width * 0.25;

  return {
    color: color(ribbonColors[index % 2]),

    side,
    xOffset: side * random(laneMin, laneMax),

    startTime: frameCount + index * 18,

    length: random(1080, 1800),
    width: random(42, 90),

    ampX: random(90, 180),
    ampZ: random(80, 220),

    freqX: random(0.003, 0.007),
    freqZ: random(0.003, 0.007),

    speed: random(0.015, 0.03),

    rot: createVector(
      random(TWO_PI),
      random(TWO_PI),
      random(TWO_PI)
    ),

    rotSpeed: createVector(
      random(-0.003, 0.003),
      random(0.004, 0.009),
      random(-0.003, 0.003)
    ),

    durGrow: 80,
    durStay: 130,
    durBreak: 28,

    progress: 0,
    shatter: 0,
    hasPlayedSpawnSound: false
  };
}

// ====================
// DRAW
// ====================

function draw() {
  background(palette.bg);

  animatePatternDisplacement(frameCount * 0.006);

  push();
  resetMatrix();
  imageMode(CORNER);
  image(patternLayer, -width * 0.5, -height * 0.5);
  imageMode(CENTER);
  pop();

  rotateX(-0.12);

  for (let i = ribbons.length - 1; i >= 0; i--) {
    let r = ribbons[i];
    let age = frameCount - r.startTime;

    if (age < 0) continue;

    if (!r.hasPlayedSpawnSound) {
      playSwooshSound();
      r.hasPlayedSpawnSound = true;
    }

    if (age < r.durGrow) {
      r.progress = easeOutCubic(age / r.durGrow);

    } else if (age < r.durGrow + r.durStay) {
      r.progress = 1;
      r.rot.add(r.rotSpeed);

    } else if (age < r.durGrow + r.durStay + r.durBreak) {
      r.shatter =
        (age - r.durGrow - r.durStay) / r.durBreak;

    } else {
      playDisappearSound();
      ribbons[i] = createRibbon(i);
      continue;
    }

    push();

    rotateX(r.rot.x);
    rotateY(r.rot.y);
    rotateZ(r.rot.z);

    drawRibbon(r);

    pop();
  }
}

// ====================
// GLITCH BG
// ====================

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

      const noiseVal = noise(
        i * 0.1 + patternSeed * 0.03,
        j * 0.1 + patternSeed * 0.03
      );

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
    const r = random();

    if (r < 0.33) g.fill(34, 102, 255, 95);
    else if (r < 0.66) g.fill(16, 52, 200, 105);
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

    const bandH = floor(
      map(noise(y * 0.009 + t * 0.75), 0, 1, 16, 64)
    );

    const shift = map(
      noise(y * 0.013 + t * 0.9),
      0, 1,
      -88, 88
    );

    patternLayer.copy(
      patternBase,
      0, y, w, bandH,
      shift, y, w, bandH
    );

    y += bandH;
  }

  for (let i = 0; i < 11; i++) {

    const by = floor(map(noise(i * 0.7 + t * 0.6), 0, 1, 0, h - 40));
    const bh = floor(map(noise(i * 1.4 + t * 0.5), 0, 1, 24, 92));
    const bx = floor(map(noise(i * 2.1 + t * 0.55), 0, 1, 0, w - 140));
    const bw = floor(map(noise(i * 2.8 + t * 0.4), 0, 1, 90, 280));
    const sx = floor(map(noise(i * 3.2 + t), 0, 1, -120, 120));

    patternLayer.copy(
      patternBase,
      bx, by, bw, bh,
      bx + sx, by, bw, bh
    );
  }
}

// ====================
// DRAW RIBBON
// ====================

function drawRibbon(r) {
  let steps = 60;
  let visible = floor(steps * r.progress);

  let explode = r.shatter;

  let alpha = pow(1 - explode, 2.2) * 255;
  let liveWidth = r.width * (1 - explode * 0.55);

  for (let i = 0; i < visible; i++) {

    let d1 = map(i, 0, steps, 0, r.length);
    let d2 = map(i + 1, 0, steps, 0, r.length);

    let c1 = getRibbonPos(r, d1);
    let c2 = getRibbonPos(r, d2);

    let next1 = getRibbonPos(r, d1 + 5);
    let next2 = getRibbonPos(r, d2 + 5);

    let dir1 = p5.Vector.sub(next1, c1).normalize();
    let dir2 = p5.Vector.sub(next2, c2).normalize();

    let side1 = createVector(-dir1.y, dir1.x, 0).normalize();
    let side2 = createVector(-dir2.y, dir2.x, 0).normalize();

    let noise1 = noise(i * 0.18, frameCount * 0.02);
    let noise2 = noise((i + 1) * 0.18, frameCount * 0.02);

    let w1 = liveWidth * map(noise1, 0, 1, 0.3, 1.3);
    let w2 = liveWidth * map(noise2, 0, 1, 0.3, 1.3);

    side1.mult(w1 * 0.5);
    side2.mult(w2 * 0.5);

    // explode
    if (explode > 0) {
      c1.x += sin(i * 1.8) * explode * 240;
      c1.y += cos(i * 1.1) * explode * 90;
      c1.z += sin(i * 2.3) * explode * 180;

      c2.x += sin((i + 1) * 1.8) * explode * 240;
      c2.y += cos((i + 1) * 1.1) * explode * 90;
      c2.z += sin((i + 1) * 2.3) * explode * 180;
    }

    // ====================
    // STRIPE FIX
    // ====================

    let stripe = floor(i / 3) % 2;
    let c;

    if (stripe === 0) {
      c = color("#ADF218");
    } else {
      c = color("#8CE200");
    }

    fill(
      red(c),
      green(c),
      blue(c),
      alpha
    );

    beginShape();

    vertex(c1.x + side1.x, c1.y + side1.y, c1.z);
    vertex(c1.x - side1.x, c1.y - side1.y, c1.z);
    vertex(c2.x - side2.x, c2.y - side2.y, c2.z);
    vertex(c2.x + side2.x, c2.y + side2.y, c2.z);

    endShape(CLOSE);
  }
}

// ====================
// PATH
// ====================

function getRibbonPos(r, d) {
  let t = frameCount * r.speed;

  let x =
    sin(d * r.freqX + t * 2.2) * r.ampX +
    sin(d * r.freqX * 2.4 + t * 1.4) * r.ampX * 0.35 +
    r.xOffset;

  const centerGap = width * 0.24;

  if (abs(x) < centerGap) {
    x = centerGap * r.side;
  }

  let y = -d + 500;

  let z =
    cos(d * r.freqZ + t * 2.0) * r.ampZ +
    sin(d * r.freqZ * 1.7 + t * 1.8) * r.ampZ * 0.4;

  return createVector(x, y, z);
}

// ====================

function easeOutCubic(t) {
  return 1 - pow(1 - t, 3);
}

function setupSwooshSounds() {
  swooshSoundPool = [];

  for (let i = 0; i < swooshSoundPoolSize; i++) {
    const sound = new Audio('swoosh.mp3');
    sound.preload = 'auto';
    sound.volume = swooshSoundVolume;
    swooshSoundPool.push(sound);
  }

  const events = ['pointerdown', 'touchstart', 'keydown', 'wheel'];
  swooshSoundUnlockHandlers = events.map((eventName) => {
    const handler = () => unlockSwooshSounds();
    window.addEventListener(eventName, handler, { passive: true });
    return { eventName, handler };
  });
}

function setupDisappearSounds() {
  disappearSoundPool = [];
  disappearSoundPoolIndex = 0;

  for (let i = 0; i < disappearSoundPoolSize; i++) {
    const sound = new Audio(disappearSoundSrc);
    sound.preload = 'auto';
    sound.volume = disappearSoundVolume;
    sound.addEventListener('error', () => {
      sound.src = disappearFallbackSoundSrc;
      sound.load();
    }, { once: true });
    disappearSoundPool.push(sound);
  }
}

function setupTextHoverSound() {
  textHoverSound = new Audio('text-hover.mp3');
  textHoverSound.preload = 'auto';
  textHoverSound.volume = swooshSoundVolume;
  textHoverSound.addEventListener('error', () => {
    textHoverSound.src = 'swoosh.mp3';
    textHoverSound.load();
  }, { once: true });
}

function setupOpeningTitleHoverSound() {
  const openingTitle = document.querySelector('.opening-title');
  if (!openingTitle) return;

  openingTitle.addEventListener('pointerenter', playTextHoverSound);
}

function unlockSwooshSounds() {
  if (swooshSoundsUnlocked) return;

  const allRibbonSounds = [...swooshSoundPool, ...disappearSoundPool, textHoverSound];
  Promise.all(allRibbonSounds.map(primeAudioForPlayback)).then(() => {
    swooshSoundsUnlocked = true;
    teardownSwooshSoundUnlockHandlers();
  }).catch(() => {});
}

function primeAudioForPlayback(audio) {
  if (!audio) return Promise.resolve();

  const originalVolume = audio.volume;
  audio.volume = 0;

  const playAttempt = audio.play();
  if (playAttempt && typeof playAttempt.then === 'function') {
    return playAttempt.then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = originalVolume;
    }).catch(() => {
      audio.volume = originalVolume;
      throw new Error('Ribbon audio unlock failed');
    });
  }

  audio.pause();
  audio.currentTime = 0;
  audio.volume = originalVolume;
  return Promise.resolve();
}

function teardownSwooshSoundUnlockHandlers() {
  swooshSoundUnlockHandlers.forEach(({ eventName, handler }) => {
    window.removeEventListener(eventName, handler, { passive: true });
  });
  swooshSoundUnlockHandlers = [];
}

function playSwooshSound() {
  if (!swooshSoundsUnlocked || swooshSoundPool.length === 0) return;

  const sound = swooshSoundPool[swooshSoundPoolIndex];
  swooshSoundPoolIndex = (swooshSoundPoolIndex + 1) % swooshSoundPool.length;

  sound.pause();
  sound.currentTime = 0;

  const playAttempt = sound.play();
  if (playAttempt && typeof playAttempt.catch === 'function') {
    playAttempt.catch(() => {});
  }
}

function playDisappearSound() {
  if (!swooshSoundsUnlocked || disappearSoundPool.length === 0) return;

  const sound = disappearSoundPool[disappearSoundPoolIndex];
  disappearSoundPoolIndex = (disappearSoundPoolIndex + 1) % disappearSoundPool.length;

  sound.pause();
  sound.currentTime = 0;

  const playAttempt = sound.play();
  if (playAttempt && typeof playAttempt.catch === 'function') {
    playAttempt.catch(() => {});
  }
}

function playTextHoverSound() {
  if (!swooshSoundsUnlocked || !textHoverSound) return;

  const now = performance.now();
  if (now - lastTextHoverSoundPlayMs < textHoverSoundCooldownMs) return;
  lastTextHoverSoundPlayMs = now;

  textHoverSound.pause();
  textHoverSound.currentTime = 0;

  const playAttempt = textHoverSound.play();
  if (playAttempt && typeof playAttempt.catch === 'function') {
    playAttempt.catch(() => {});
  }
}

function stopAllSwooshSounds() {
  swooshSoundPool.forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
  });
}

function stopAllDisappearSounds() {
  disappearSoundPool.forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
  });
}

function stopTextHoverSound() {
  if (!textHoverSound) return;
  textHoverSound.pause();
  textHoverSound.currentTime = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createPatternLayer();
}

function mousePressed() {
  patternSeed++;
  regenerateBluePattern();
}
