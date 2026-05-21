// p5.js — Film Reel Scroll Interaction
// Scroll để "thu hồi" dải phim
// Khi đạt 99% => nổ tung

let progress = 0;
let exploded = false;
let scrollVelocity = 0;

let reelImage;

let particles = [];
let fallingStrips = [];
let caughtMessages = [];
let finalMessages = [];
let finalMode = false;
let lastSpawnFrame = 0;

const maxCatch = 3;
const basketWidth = 140;
const basketHeight = 34;
const scrollBoost = 0.002;
const scrollDamping = 0.88;
const fallingSpawnInterval = 6;
const fallingMaxOnScreen = 26;
const reel1RatioX = 0.283;
const reel1RatioY = 0.431;
const reel2RatioX = 0.664;
const reel2RatioY = 0.428;
const reelRadiusRatio = 0.225;
const reelScale = 0.9;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function preload() {
  reelImage = loadImage("reel_05.png");
}

function draw() {
  background("#1840F2");

  translate(width / 2, height / 2);

  if (!exploded) {
    cursor();
    updateScrollProgress();
    drawReelImage();

    fill(255, 80, 80);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(32);
    textFont("Helvetica");
    text(floor(progress) + "%", 0, 0);

  } else {
    if (finalMode) {
      cursor();
      drawFinalStrip();
    } else {
      noCursor();
      updateExplosion();
      updateFallingStrips();
      drawBasket();
    }
  }
}

function drawReelImage() {
  if (!reelImage) return;

  imageMode(CENTER);

  let imgH = height * reelScale;
  let scaleFactor = imgH / reelImage.height;
  let imgW = reelImage.width * scaleFactor;

  let t = constrain(progress / 100, 0, 1);
  let x1 = imgW * (0.5 - reel1RatioX);
  let x2 = imgW * (0.5 - reel2RatioX);
  let x = lerp(x1, x2, t);

  drawReelTransfer(x, 0, imgW, imgH, t);
  image(reelImage, x, 0, imgW, imgH);
}

function drawReelTransfer(imgCenterX, imgCenterY, imgW, imgH, t) {
  let left = imgCenterX - imgW / 2;
  let top = imgCenterY - imgH / 2;

  let reel1 = {
    x: left + imgW * reel1RatioX,
    y: top + imgH * reel1RatioY
  };

  let reel2 = {
    x: left + imgW * reel2RatioX,
    y: top + imgH * reel2RatioY
  };

  let reelRadius = imgH * reelRadiusRatio;
  let reel1Scale = lerp(1, 0.4, t);
  let reel2Scale = lerp(0.4, 1, t);

  stroke(255);
  strokeWeight(max(2, reelRadius * 0.08));
  line(reel1.x + reelRadius * reel1Scale, reel1.y, reel2.x - reelRadius * reel2Scale, reel2.y);

  noStroke();
  fill(255);
  circle(reel1.x, reel1.y, reelRadius * 2 * reel1Scale);
  circle(reel2.x, reel2.y, reelRadius * 2 * reel2Scale);
}

function mouseWheel(event) {

  if (exploded) return false;

  scrollVelocity += event.delta * scrollBoost;

  return false;
}

function updateScrollProgress() {
  if (abs(scrollVelocity) < 0.01) return;

  progress += scrollVelocity;
  scrollVelocity *= scrollDamping;

  progress = constrain(progress, 0, 100);

  if (progress >= 100) {
    triggerExplosion();
  }
}

function triggerExplosion() {

  exploded = true;

  initFallingStrips();

  for (let i = 0; i < 620; i++) {

  particles.push({

    x: random(-80, 80),
    y: random(-80, 80),

    vx: random(-25, 25),
    vy: random(-18, 18),

    size: random(6, 22),

    rotation: random(TWO_PI),

    vr: random(-0.3, 0.3),

    life: 255
  });
}
}

function updateExplosion() {

  for (let p of particles) {

    p.x += p.vx;
    p.y += p.vy;

    p.rotation += p.vr;

    p.life -= 3;

    push();

    translate(p.x, p.y);

    rotate(p.rotation);

    noStroke();

    fill(255, p.life);

    rectMode(CENTER);

    rect(0, 0, p.size, p.size * 0.35);

    pop();
  }

  particles = particles.filter(p => p.life > 0);

  // text cuối
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(42);
  text("ARCHIVE COMPLETE", 0, 0);
}

function initFallingStrips() {
  fallingStrips = [];
  caughtMessages = [];
  finalMessages = [];
  finalMode = false;
  lastSpawnFrame = frameCount;
}

function spawnFallingStrip() {
  fallingStrips.push({
    x: random(-width / 2 + 40, width / 2 - 40),
    y: random(-height / 2 - 220, -height / 2 - 40),
    length: random(120, 220),
    width: random(12, 18),
    speed: random(10, 15),
    message: nf(floor(random(1, 100)), 2)
  });
}

function updateFallingStrips() {
  let basketX = mouseX - width / 2;
  let basketY = mouseY - height / 2;

  if (caughtMessages.length < maxCatch) {
    let shouldSpawn = frameCount - lastSpawnFrame >= fallingSpawnInterval;
    let canSpawn = fallingStrips.length < fallingMaxOnScreen;

    if (shouldSpawn && canSpawn) {
      spawnFallingStrip();
      lastSpawnFrame = frameCount;
    }
  }

  for (let s of fallingStrips) {
    s.y += s.speed;

    push();
    translate(s.x, s.y);
    noStroke();
    fill(255);
    rectMode(CENTER);
    rect(0, 0, s.width, s.length, 4);

    fill("#0A33FF");
    for (let y = -s.length / 2 + 10; y < s.length / 2; y += 18) {
      rect(0, y, s.width * 0.45, 6, 2);
    }
    pop();

    if (caughtMessages.length < maxCatch) {
      let hitX = abs(s.x - basketX) < basketWidth / 2;
      let hitY = s.y + s.length / 2 >= basketY - basketHeight / 2 &&
        s.y - s.length / 2 <= basketY + basketHeight / 2;

      if (hitX && hitY) {
        caughtMessages.push(s.message);
        s.caught = true;
      }
    }
  }

  fallingStrips = fallingStrips.filter(s => !s.caught && s.y < height / 2 + 260);

  if (caughtMessages.length >= maxCatch) {
    enterFinalMode();
  }
}

function drawBasket() {
  let x = mouseX - width / 2;
  let y = mouseY - height / 2;

  push();
  translate(x, y);
  stroke(255);
  strokeWeight(3);
  fill(10, 51, 255, 0);
  rectMode(CENTER);
  rect(0, 0, basketWidth, basketHeight, 6);

  noFill();
  strokeWeight(3);
  arc(0, -basketHeight / 2, basketWidth * 0.7, basketHeight * 1.2, PI, TWO_PI);
  pop();
}

function enterFinalMode() {
  finalMode = true;
  fallingStrips = [];
  particles = [];

  let pool = [
    "01", "02", "03", "04", "05",
    "06", "07", "08", "09", "10"
  ];

  finalMessages = shuffle(pool, true).slice(0, maxCatch);
}

function drawFinalStrip() {
  let isPortrait = height >= width * 1.05;
  let stripWidth = isPortrait ? min(width * 0.82, 360) : width;
  let stripHeight = isPortrait ? height : min(height * 0.5, 400);
  let frameGap = (isPortrait ? stripHeight : stripWidth) * 0.03;
  let frameWidth = isPortrait ? stripWidth * 0.7 : (stripWidth - frameGap * 4) / 3;
  let frameHeight = isPortrait ? (stripHeight - frameGap * 4) / 3 : stripHeight * 0.62;

  push();
  noStroke();
  fill(255);
  rectMode(CENTER);
  rect(0, 0, stripWidth, stripHeight, 10);

  fill("#0A33FF");
  if (isPortrait) {
    let holeCount = max(10, floor(stripHeight / 70));
    let holeSpacing = stripHeight / (holeCount + 1);

    for (let i = 1; i <= holeCount; i++) {
      let hy = -stripHeight / 2 + holeSpacing * i;
      rect(-stripWidth / 2 + 18, hy, 8, 12, 2);
      rect(stripWidth / 2 - 18, hy, 8, 12, 2);
    }
  } else {
    let holeCount = max(10, floor(stripWidth / 70));
    let holeSpacing = stripWidth / (holeCount + 1);

    for (let i = 1; i <= holeCount; i++) {
      let hx = -stripWidth / 2 + holeSpacing * i;
      rect(hx, -stripHeight / 2 + 18, 12, 8, 2);
      rect(hx, stripHeight / 2 - 18, 12, 8, 2);
    }
  }

  fill(10, 51, 255, 40);
  rect(0, 0, stripWidth - 24, stripHeight - 34, 8);

  textAlign(CENTER, CENTER);
  textSize(max(18, stripHeight * 0.14));
  textFont("Helvetica");

  for (let i = 0; i < 3; i++) {
    let x = isPortrait ? 0 : -stripWidth / 2 + frameGap * (i + 1) + frameWidth * (i + 0.5);
    let y = isPortrait ? -stripHeight / 2 + frameGap * (i + 1) + frameHeight * (i + 0.5) : 0;

    fill("#0A33FF");
    rect(x, y, frameWidth, frameHeight, 10);

    drawFrameIllustration(x, y, frameWidth, frameHeight, i);

    fill(255);
    text(finalMessages[i] || "--", x, y + frameHeight * 0.34);
  }
  pop();
}

function drawFrameIllustration(x, y, w, h, index) {
  push();
  translate(x, y);
  noStroke();

  fill(255, 200);
  rect(0, 0, w * 0.82, h * 0.64, 8);

  fill("#0A33FF");
  let pad = w * 0.1;
  let top = -h * 0.22;
  let base = h * 0.18;

  if (index === 0) {
    triangle(-w * 0.28, base, -w * 0.05, top, w * 0.18, base);
    triangle(-w * 0.05, base, w * 0.18, top * 0.9, w * 0.42, base);
    fill(255, 200);
    circle(-w * 0.28, -h * 0.12, w * 0.14);
  } else if (index === 1) {
    fill("#0A33FF");
    rect(-w * 0.32, base - h * 0.02, w * 0.22, h * 0.24, 4);
    rect(-w * 0.05, base - h * 0.08, w * 0.22, h * 0.30, 4);
    rect(w * 0.22, base - h * 0.14, w * 0.18, h * 0.36, 4);
    fill(255, 200);
    rect(-w * 0.38, base + h * 0.06, w * 0.82, h * 0.12, 6);
  } else {
    fill("#0A33FF");
    beginShape();
    vertex(-w * 0.4, base);
    bezierVertex(-w * 0.2, base - h * 0.2, w * 0.2, base + h * 0.1, w * 0.4, base - h * 0.1);
    vertex(w * 0.4, base + h * 0.12);
    vertex(-w * 0.4, base + h * 0.12);
    endShape(CLOSE);
    fill(255, 200);
    circle(w * 0.2, -h * 0.14, w * 0.18);
  }

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}