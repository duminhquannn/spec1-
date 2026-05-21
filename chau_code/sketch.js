// p5.js — Film Reel Scroll Interaction
// Scroll để "thu hồi" dải phim
// Khi đạt 99% => nổ tung

let progress = 0;
let exploded = false;
let scrollVelocity = 0;
let lastTouchY = 0;

let reelStripImage;
let reelLeftImage;
let reelRightImage;
let trashbinImage;
let reloadButtonImage;
let advicePileImages = [];

let finalFrameAnimation = [];
let trashAnimations = [];
let backgroundImages = [];

let particles = [];
let fallingStrips = [];
let caughtMessages = [];
let finalMessages = [];
let finalMode = false;
let finalStripStartFrame = 0;
let lastSpawnFrame = 0;
let pilingCards = [];
let piledCols = [];
let pileColFloors = [];
let exitingCards = [];
let pileLastSpawn = -9999;
let stageOneBgItems = [];
let adviceReloadButton = null;
let reloadButtonBounceFrame = -1;
let reelIntroStartMs = -1;

let ambientMusicStage1Audio;
let filmStripAudio;
let trashCatchAudio;
let fairyExplosionAudio;
let reloadAudio;
let filmStripeAdviceAudio;
let dropAudio;
let ambientStage3Audio;
let appearAudio;
let appearSoundPlayed = false;
let stage1FadeOutFrame = -1;
let stage3FadeInFrame = -1;
const audioFadeDuration = 90;

const maxCatch = 5;
const trashbinCursorBaseSize = 100;
const mobileTrashbinCursorMinSize = 78;
const mobileTrashbinCursorMaxSize = 128;
const trashbinFillMaxRatio = 0.9;
const trashbinFillYOffsetRatio = 0.06;
const scrollBoost = 0.002;
const scrollDamping = 0.88;
const fallingSpawnInterval = 6;
const fallingMaxOnScreen = 36;
const mobileFallingSpawnInterval = 14;
const mobileFallingMaxOnScreen = 14;
const mobileFallingWidthMin = 82;
const mobileFallingWidthMax = 128;
const fallingSpeedMin = 5;
const fallingSpeedMax = 9;
const animationFrameHold = 5;
const finalIntroHoldFrames = 18;
const finalSlideFramesPerItem = 15;
const mobileFinalSlideFramesPerItem = 10;
const finalStripScale = 0.72;
const stageOneBgOpacity = 56;
const stageOneBgScale = 0.51;
const stageOneBgBaseSpeed = 1.8;
const stageOneBgSpeedVariance = 0;
const stageOneBgItemCount = 8;
const stageOneBgMinGap = 44;
const stageOneTextColor = "#FFFFFF";
const stageOneTextFont = "forma-djr-text";
const stageOneTextWeight = 500;
const adviceTextBoxLabel = "Today, let's try";
const adviceTextBoxHeightRatio = 0.115;
const adviceTextBoxTopOffsetRatio = 0.33;
const adviceReloadButtonSizeRatio = 0.14;
const adviceMessages = [
  "Explore random places on Google Maps using Street View",
  "Switch your phone screen to grayscale",
  "Do a random sketch you observed around you",
  "Keep your phone away from your bed before sleeping",
  "Place your phone face down when sitting at a café",
  "Brush your teeth, make your bed, and exercise right after waking up",
  "Sleep before 11 PM tonight",
  "Focus on only one tab or screen at a time while working"
];
let selectedAdvice = adviceTextBoxLabel;
const reel1RatioX = 0.283;
const reel1RatioY = 0.431;
const reel2RatioX = 0.664;
const reel2RatioY = 0.428;
const reelRadiusRatio = 0.225;
const reelScale = 0.9;
const reelMobileScale = 0.34;
const reelMobileWheelScale = 1.3;
const reelMobileWheelYOffsetRatio = -0.12;
const reelMobileFooterGap = 10;
const mobileFooterBarHeight = 50;
const mobileStageTextYOffsetRatio = -0.25;
const reelRotationTurns = 1.2;
const backgroundColor = "#1840F2";
const fineBlueStrokeWeight = 0.75;
const advicePileTypes = [
  { name: 'eye',  padded: false, scale: 1.0 },
  { name: 'hand', padded: false, scale: 0.6 },
  { name: 'noti', padded: true,  scale: 1.0 },
  { name: 'tab',  padded: false, scale: 1.0 },
];
const PILE_GRAVITY = 0.6;
const PILE_BOUNCE_FACTOR = 0.4;
const PILE_SETTLE_THRESHOLD = 2.2;
const PILE_SPAWN_INTERVAL = 30;
const PILE_MAX_FILL_RATIO = 0.5;

function isMobile() {
  return width <= 600;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  initStageOneBackgroundItems();

  document.querySelectorAll(".icon-button").forEach(btn => {
    btn.addEventListener("click", () => btn.classList.toggle("is-active"));
  });
  initStage1AmbientMusic();
  initFilmStripSound();
  initTrashCatchSound();
  initFairyExplosionSound();
  reloadAudio = new Audio("reload.wav");
  reloadAudio.preload = "auto";
  reloadAudio.volume = 0.85;
  filmStripeAdviceAudio = new Audio("film_stripe_advice.wav");
  filmStripeAdviceAudio.preload = "auto";
  filmStripeAdviceAudio.volume = 0.85;
  dropAudio = new Audio("drop.wav");
  appearAudio = new Audio("appear.wav");
  appearAudio.preload = "auto";
  appearAudio.volume = 0.85;
  ambientStage3Audio = new Audio("ambient-stage3.wav");
  ambientStage3Audio.loop = true;
  ambientStage3Audio.preload = "auto";
  ambientStage3Audio.volume = 0.85;
  dropAudio.preload = "auto";
  dropAudio.volume = 0.35;
}

function initStage1AmbientMusic() {
  ambientMusicStage1Audio = document.getElementById("stage1-ambient-audio") || new Audio("ambient-music-stage1.wav");
  ambientMusicStage1Audio.loop = true;
  ambientMusicStage1Audio.preload = "auto";
  ambientMusicStage1Audio.volume = 0.72;
  ambientMusicStage1Audio.muted = false;
}

function playStage1AmbientMusic() {
  if (!ambientMusicStage1Audio) return;

  ambientMusicStage1Audio.muted = false;
  ambientMusicStage1Audio.volume = 0.72;
  ambientMusicStage1Audio.play().catch(() => {});
}

function stopStage1AmbientMusic() {
  if (!ambientMusicStage1Audio) return;

  ambientMusicStage1Audio.pause();
  ambientMusicStage1Audio.currentTime = 0;
}

function initFilmStripSound() {
  filmStripAudio = new Audio("film_strip.wav");
  filmStripAudio.loop = false;
  filmStripAudio.preload = "auto";
  filmStripAudio.volume = 0.75;
}

function initTrashCatchSound() {
  trashCatchAudio = new Audio("trash.wav");
  trashCatchAudio.loop = false;
  trashCatchAudio.preload = "auto";
  trashCatchAudio.volume = 0.85;
}

function initFairyExplosionSound() {
  fairyExplosionAudio = new Audio("fairy_explosion.wav");
  fairyExplosionAudio.loop = false;
  fairyExplosionAudio.preload = "auto";
  fairyExplosionAudio.volume = 0.9;
}

function preload() {
  reelStripImage = loadImage("reel.png");
  reelLeftImage = loadImage("film_01.png");
  reelRightImage = loadImage("film_02.png");
  trashbinImage = loadImage("trashbin.png");
  reloadButtonImage = loadImage("button_reload.svg");
  loadFinalFrameAnimation();
  loadTrashAnimations();
  loadBackgroundImages();
  loadAdvicePileImages();
}

function loadAdvicePileImages() {
  advicePileImages = advicePileTypes.map(({ name, padded }) => {
    let frames = [];
    for (let i = 0; i < 8; i++) {
      let suffix = padded ? nf(i, 2) : String(i);
      frames.push(loadImage(`advice_${name}_${suffix}.png`));
    }
    return frames;
  });
}

function pickRandomAdvice(excludeAdvice = "") {
  if (!adviceMessages.length) return adviceTextBoxLabel;
  if (adviceMessages.length === 1) return adviceMessages[0];

  let nextAdvice = random(adviceMessages);
  let guard = 0;

  while (nextAdvice === excludeAdvice && guard < 20) {
    nextAdvice = random(adviceMessages);
    guard++;
  }

  return nextAdvice;
}

function updateAudioFades() {
  if (stage1FadeOutFrame >= 0 && ambientMusicStage1Audio) {
    let t = constrain((frameCount - stage1FadeOutFrame) / audioFadeDuration, 0, 1);
    ambientMusicStage1Audio.volume = 0.72 * (1 - t);
    if (t >= 1) {
      ambientMusicStage1Audio.muted = true;
      stage1FadeOutFrame = -1;
    }
  }

  if (stage3FadeInFrame >= 0 && ambientStage3Audio) {
    let t = constrain((frameCount - stage3FadeInFrame) / audioFadeDuration, 0, 1);
    ambientStage3Audio.volume = 0.85 * t;
    if (t >= 1) stage3FadeInFrame = -1;
  }
}

function draw() {
  background(backgroundColor);

  updateAudioFades();

  translate(width / 2, height / 2);

  if (!exploded) {
    cursor();
    updateScrollProgress();
    drawStageOneBackgroundAnimations();
    drawStageOneText();
    drawReelImage();

    if (!isMobile()) {
      fill(255, 80, 80);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(36);
      textFont(stageOneTextFont);
      drawingContext.font = `${stageOneTextWeight} 36px "${stageOneTextFont}"`;
      text(floor(progress) + "%", 0, 0);
    }

  } else {
    if (finalMode) {
      noCursor();
      updatePile();
      drawPile();
      drawFinalStrip();
    } else {
      noCursor();
      updateExplosion();
      updateFallingStrips();
      drawTrashCursor();
    }
  }
}

function loadTrashAnimations() {
  const animationNames = ["tab", "scroll", "eye", "noti", "clock"];

  trashAnimations = animationNames.map(name => {
    let frames = [];

    for (let i = 0; i < 8; i++) {
      frames.push(loadImage(`trash_${name}_${nf(i, 2)}.png`));
    }

    return {
      name,
      frames
    };
  });
}

function loadBackgroundImages() {
  const imageNames = ["tab", "scroll", "eye", "noti", "clock"];

  backgroundImages = [];

  for (let name of imageNames) {
    for (let i = 0; i < 8; i++) {
      backgroundImages.push(loadImage(`bg_${name}_${nf(i, 2)}.png`));
    }
  }
}

function loadFinalFrameAnimation() {
  finalFrameAnimation = [];

  for (let i = 0; i < 8; i++) {
    finalFrameAnimation.push(loadImage(`advice_frame_${nf(i, 2)}.png`));
  }
}

function drawStageOneBackgroundAnimations() {
  if (!backgroundImages.length) return;
  if (stageOneBgItems.length !== stageOneBgItemCount) {
    initStageOneBackgroundItems();
  }

  push();
  imageMode(CENTER);
  tint(255, stageOneBgOpacity);

  for (let i = 0; i < stageOneBgItems.length; i++) {
    let item = stageOneBgItems[i];
    let frame = backgroundImages[item.imageIndex];
    if (!frame) continue;

    let itemW = getStageOneBackgroundWidth(item.scale);
    let itemH = itemW * (frame.height / frame.width);
    let x = item.xRatio * width;
    let yStart = height / 2 + itemH * item.startOffset;
    let yEnd = -height / 2 - itemH * item.endOffset;
    let travelDistance = yStart - yEnd;
    let drift = ((frameCount * item.speed / travelDistance + item.phaseRatio) % 1) * travelDistance;
    let y = yStart - drift;

    image(frame, x, y, itemW, itemH);
  }

  noTint();
  pop();
}

function drawStageOneText() {
  if (isMobile()) {
    drawStageOneMobileText();
    return;
  }

  let t = constrain(progress / 100, 0, 1);
  let textTrackX = lerp(0, -width * 0.7, t);
  let sideMargin = min(width * 0.075, 96);
  let leftTextX = -width / 2 + sideMargin + textTrackX;
  let rightTextProgress = map(progress, 55, 100, 0, 1, true);
  let rightTextShift = min(width * 0.025, 40);
  let rightTextAlpha = map(progress, 48, 55, 0, 255, true);
  let leftTextMaxWidth = min(width * 0.38, 620);
  let rightTextMaxWidth = min(width * 0.31, 390);
  let textMaxWidth = rightTextMaxWidth;
  let rightTextX = width / 2 - sideMargin - textMaxWidth - rightTextShift + rightTextShift * rightTextProgress;
  let titleSize = constrain(width * 0.047, 38, 72);
  let textY = -height * 0.35;

  push();
  noStroke();
  fill(stageOneTextColor);
  textFont(stageOneTextFont);
  textSize(titleSize);
  textLeading(titleSize * 1.08);
  drawingContext.font = `${stageOneTextWeight} ${titleSize}px "${stageOneTextFont}"`;

  textAlign(LEFT, TOP);
  text("Every step away\nfrom internet\naddiction...", leftTextX, textY, leftTextMaxWidth);

  fill(255, rightTextAlpha);
  textAlign(RIGHT, TOP);
  text("turns into a real-world connection.", rightTextX, textY, rightTextMaxWidth);
  pop();
}

function drawStageOneMobileText() {
  let firstTextAlpha = map(progress, 8, 38, 255, 0, true);
  let secondTextAlpha = map(progress, 32, 58, 0, 255, true);
  let titleSize = constrain(width * 0.085, 26, 36);
  let textY = height * mobileStageTextYOffsetRatio;

  push();
  noStroke();
  textFont(stageOneTextFont);
  textSize(titleSize);
  textLeading(titleSize * 1.08);
  drawingContext.font = `${stageOneTextWeight} ${titleSize}px "${stageOneTextFont}"`;
  textAlign(CENTER, CENTER);

  fill(255, firstTextAlpha);
  text("Every step away\nfrom internet\naddiction...", 0, textY);

  fill(255, secondTextAlpha);
  text("turns into a real-world\nconnection.", 0, textY);
  pop();
}

function initStageOneBackgroundItems() {
  let itemCount = stageOneBgItemCount;

  stageOneBgItems = [];

  for (let i = 0; i < itemCount; i++) {
    stageOneBgItems.push(createStageOneBackgroundItem(stageOneBgItems));
  }
}

function createStageOneBackgroundItem(existingItems) {
  let fallbackItem;

  for (let attempt = 0; attempt < 90; attempt++) {
    let item = buildStageOneBackgroundCandidate();
    fallbackItem = item;

    if (!existingItems.some(existingItem => stageOneBackgroundItemsOverlap(item, existingItem))) {
      return item;
    }
  }

  return fallbackItem;
}

function buildStageOneBackgroundCandidate() {
  let imageIndex = floor(random(backgroundImages.length));
  let image = backgroundImages[imageIndex];
  let scale = random(0.2, 1);
  let itemW = getStageOneBackgroundWidth(scale);
  let itemH = image ? itemW * (image.height / image.width) : itemW * 0.6;

  return {
    imageIndex,
    itemW,
    itemH,
    xRatio: random(-0.43, 0.43),
    scale,
    speed: stageOneBgBaseSpeed * random(1 - stageOneBgSpeedVariance, 1 + stageOneBgSpeedVariance),
    phaseRatio: random(0, 1),
    startOffset: random(1.3, 2.0),
    endOffset: random(0.55, 1.05)
  };
}

function stageOneBackgroundItemsOverlap(a, b) {
  let dx = abs(a.xRatio - b.xRatio) * width;
  let phaseDistance = abs(a.phaseRatio - b.phaseRatio);
  let wrappedPhaseDistance = min(phaseDistance, 1 - phaseDistance);
  let averageTravelDistance = height + (a.itemH + b.itemH) * 0.95;
  let dy = wrappedPhaseDistance * averageTravelDistance;

  return dx < (a.itemW + b.itemW) / 2 + stageOneBgMinGap &&
    dy < (a.itemH + b.itemH) / 2 + stageOneBgMinGap;
}

function getStageOneBackgroundWidth(scale) {
  return min(width * stageOneBgScale * scale, width * 0.225);
}

function drawReelImage() {
  if (!reelStripImage || !reelLeftImage || !reelRightImage) return;

  imageMode(CENTER);

  let mobile = isMobile();
  let imgH = height * (mobile ? reelMobileScale : reelScale);
  let scaleFactor = imgH / reelStripImage.height;
  let imgW = reelStripImage.width * scaleFactor;
  let y = mobile
    ? height / 2 - mobileFooterBarHeight - reelMobileFooterGap - imgH / 2
    : 0;

  let t = constrain(progress / 100, 0, 1);
  let x1 = imgW * (0.5 - reel1RatioX);
  let x2 = imgW * (0.5 - reel2RatioX);
  let x = lerp(x1, x2, t);

  image(reelStripImage, x, y, imgW, imgH);
  drawReelTransfer(x, y, imgW, imgH, t);
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

  if (isMobile()) {
    let mobileWheelYOffset = imgH * reelMobileWheelYOffsetRatio;
    reel1.y += mobileWheelYOffset;
    reel2.y += mobileWheelYOffset;
  }

  let reelRadius = imgH * reelRadiusRatio;
  let reel1Scale = lerp(1, 0.4, t);
  let reel2Scale = lerp(0.4, 1, t);
  let reelRotation = t * TWO_PI * reelRotationTurns;
  let reelSizeLeft = reelRadius * 2 * reel1Scale;
  let reelSizeRight = reelRadius * 2 * reel2Scale;
  let reelFrameSize = reelRadius * 3.2 * (isMobile() ? reelMobileWheelScale : 1);
  let ropeWeight = max(6, reelRadius * 0.21);

  drawStripedReelRope(
    reel1.x + reelRadius * reel1Scale,
    reel1.y,
    reel2.x - reelRadius * reel2Scale,
    reel2.y,
    ropeWeight,
    t
  );

  drawStripedReelCoil(reel1.x, reel1.y, reelSizeLeft / 2, ropeWeight, t, -1);
  drawStripedReelCoil(reel2.x, reel2.y, reelSizeRight / 2, ropeWeight, t, 1);

  const INTRO_DUR = 900;
  const elapsed = reelIntroStartMs >= 0 ? max(0, millis() - reelIntroStartMs) : -1;
  const tp1 = elapsed >= 0 ? constrain(elapsed / INTRO_DUR, 0, 1) : 0;
  const tp2 = elapsed >= 0 ? constrain((elapsed - 170) / INTRO_DUR, 0, 1) : 0;

  const s1 = elapsed >= 0 ? easeOutBack(tp1) : 0;
  const s2 = elapsed >= 0 ? easeOutBack(max(0, tp2)) : 0;

  const spinAmount = TWO_PI * 1.5;
  const introRot1 = spinAmount * (1 - easeOutCubic(tp1));
  const introRot2 = spinAmount * (1 - easeOutCubic(max(0, tp2)));

  push();
  translate(reel1.x, reel1.y);
  rotate(reelRotation + introRot1);
  scale(s1);
  image(reelLeftImage, 0, 0, reelFrameSize, reelFrameSize);
  pop();

  push();
  translate(reel2.x, reel2.y);
  rotate(-reelRotation - introRot2);
  scale(s2);
  image(reelRightImage, 0, 0, reelFrameSize, reelFrameSize);
  pop();
}

function drawStripedReelRope(x1, y1, x2, y2, ropeWeight, t) {
  const ropeColors = [
    color(255),
    color(225, 236, 255)
  ];
  const ropeLength = dist(x1, y1, x2, y2);
  const stripeLength = max(ropeWeight * 2.2, ropeLength / 18);
  const stripeCycle = stripeLength * 2;
  const overlap = max(1, ropeWeight * 0.06);
  const reverseScrollPhase = (t * stripeLength * 8) % stripeCycle;
  const angle = atan2(y2 - y1, x2 - x1);

  push();
  translate(x1, y1);
  rotate(angle);
  rectMode(CORNER);
  noStroke();

  fill(ropeColors[0]);
  rect(0, -ropeWeight / 2, ropeLength, ropeWeight);

  fill(ropeColors[1]);
  for (let x = -stripeCycle + reverseScrollPhase; x < ropeLength; x += stripeCycle) {
    let stripeX = max(0, x);
    let stripeEnd = min(ropeLength, x + stripeLength + overlap);

    if (stripeEnd <= 0 || stripeX >= ropeLength) continue;

    rect(stripeX, -ropeWeight / 2, stripeEnd - stripeX, ropeWeight);
  }

  noFill();
  stroke(backgroundColor);
  strokeWeight(fineBlueStrokeWeight);
  rect(0, -ropeWeight / 2, ropeLength, ropeWeight);

  pop();
}

function drawStripedReelCoil(x, y, radius, ropeWeight, t, direction) {
  const ropeColors = [
    color(255),
    color(225, 236, 255)
  ];
  const ringWeight = ropeWeight;
  const ringStep = ropeWeight;
  const minRadius = ringWeight * 0.7;

  push();
  translate(x, y);
  noStroke();
  fill(ropeColors[0]);
  circle(0, 0, radius * 2);

  noFill();
  strokeCap(SQUARE);

  for (let r = radius - ringWeight / 2; r >= minRadius; r -= ringStep) {
    const circumference = TWO_PI * r;
    const stripeLength = max(ropeWeight * 2.2, circumference / 22);
    const stripeAngle = stripeLength / r;
    const stripeCycle = stripeAngle * 2;
    const overlapAngle = max(0.01, (ropeWeight * 0.04) / r);
    const scrollPhase = direction * ((t * stripeAngle * 9) % stripeCycle);

    strokeWeight(ringWeight);
    stroke(ropeColors[0]);
    circle(0, 0, r * 2);

    stroke(ropeColors[1]);
    for (let a = -stripeCycle + scrollPhase; a < TWO_PI; a += stripeCycle) {
      let startAngle = max(0, a);
      let endAngle = min(TWO_PI, a + stripeAngle + overlapAngle);

      if (endAngle <= 0 || startAngle >= TWO_PI) continue;

      arc(0, 0, r * 2, r * 2, startAngle, endAngle);
    }

    stroke(backgroundColor);
    strokeWeight(fineBlueStrokeWeight);
    circle(0, 0, r * 2);
  }

  noStroke();
  fill(ropeColors[0]);
  circle(0, 0, minRadius);

  noFill();
  stroke(backgroundColor);
  strokeWeight(fineBlueStrokeWeight);
  circle(0, 0, radius * 2);

  strokeCap(ROUND);
  pop();
}

function mouseWheel(event) {
  if (exploded) return false;

  playFilmStripSound();
  scrollVelocity += event.delta * scrollBoost;

  return false;
}

function playFilmStripSound() {
  if (!filmStripAudio) return;

  filmStripAudio.currentTime = 0;
  filmStripAudio.play().catch(() => {});
}

function stopFilmStripSound() {
  if (!filmStripAudio) return;

  filmStripAudio.pause();
  filmStripAudio.currentTime = 0;
}

function playTrashCatchSound() {
  if (!trashCatchAudio) return;

  trashCatchAudio.currentTime = 0;
  trashCatchAudio.play().catch(() => {});
}

function playFairyExplosionSound() {
  if (!fairyExplosionAudio) return;

  fairyExplosionAudio.currentTime = 0;
  fairyExplosionAudio.play().catch(() => {});
}

function updateScrollProgress() {
  if (abs(scrollVelocity) < 0.01) return;

  progress += scrollVelocity;
  scrollVelocity *= scrollDamping;

  progress = constrain(progress, 0, 100);

  let appearThreshold = isMobile() ? 32 : 48;
  if (!appearSoundPlayed && progress >= appearThreshold) {
    appearSoundPlayed = true;
    if (appearAudio) appearAudio.play().catch(() => {});
  }

  if (progress >= 100) {
    triggerExplosion();
  }
}

function triggerExplosion() {

  exploded = true;
  stopFilmStripSound();
  playFairyExplosionSound();

  document.querySelectorAll(".footer-marquee__inner span").forEach(el => {
    el.textContent = "Move the mouse to Collect";
  });

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
  textFont(stageOneTextFont);
  textSize(isMobile() ? 22 : 42);
  text("ADDICTION REMOVED", 0, 0);
}

function initFallingStrips() {
  fallingStrips = [];
  caughtMessages = [];
  finalMessages = [];
  finalMode = false;
  lastSpawnFrame = frameCount;
}

function spawnFallingStrip() {
  let animation = random(trashAnimations);
  let displayWidth = isMobile()
    ? random(mobileFallingWidthMin, mobileFallingWidthMax)
    : random(130, 200);
  let firstFrame = animation.frames[0];
  let displayHeight = firstFrame ? displayWidth * (firstFrame.height / firstFrame.width) : displayWidth * 0.6;

  if (dropAudio && dropAudio.paused) {
    dropAudio.play().catch(() => {});
  }

  fallingStrips.push({
    x: random(-width / 2 + displayWidth / 2, width / 2 - displayWidth / 2),
    y: random(-height / 2 - 220, -height / 2 - displayHeight),
    width: displayWidth,
    height: displayHeight,
    speed: random(fallingSpeedMin, fallingSpeedMax),
    animation,
    frameOffset: floor(random(animation.frames.length))
  });
}

function updateFallingStrips() {
  let basketX = mouseX - width / 2;
  let basketY = mouseY - height / 2;
  let cursorSize = getTrashbinCursorSize();

  if (caughtMessages.length < maxCatch) {
    let spawnInterval = isMobile() ? mobileFallingSpawnInterval : fallingSpawnInterval;
    let maxOnScreen = isMobile() ? mobileFallingMaxOnScreen : fallingMaxOnScreen;
    let shouldSpawn = frameCount - lastSpawnFrame >= spawnInterval;
    let canSpawn = fallingStrips.length < maxOnScreen;

    if (shouldSpawn && canSpawn) {
      spawnFallingStrip();
      lastSpawnFrame = frameCount;
    }
  }

  for (let s of fallingStrips) {
    s.y += s.speed;

    drawTrashAnimation(s);

    if (caughtMessages.length < maxCatch) {
      let hitX = abs(s.x - basketX) < (s.width + cursorSize * 0.62) / 2;
      let hitY = abs(s.y - basketY) < (s.height + cursorSize * 0.72) / 2;

      if (hitX && hitY) {
        caughtMessages.push(s.animation);
        s.caught = true;
        playTrashCatchSound();
      }
    }
  }

  fallingStrips = fallingStrips.filter(s => !s.caught && s.y < height / 2 + s.height + 120);

  if (caughtMessages.length >= maxCatch) {
    enterFinalMode();
  }
}

function drawTrashAnimation(item, targetX = item.x, targetY = item.y, targetW = item.width, targetH = item.height) {
  let frames = item.animation ? item.animation.frames : [];
  if (!frames.length) return;

  let frameIndex = (floor(frameCount / animationFrameHold) + item.frameOffset) % frames.length;

  push();
  imageMode(CENTER);
  image(frames[frameIndex], targetX, targetY, targetW, targetH);
  pop();
}

function drawTrashCursor() {
  let x = mouseX - width / 2;
  let y = mouseY - height / 2;
  let cursorWidth = getTrashbinCursorSize();
  let cursorHeight = trashbinImage ? cursorWidth * (trashbinImage.height / trashbinImage.width) : cursorWidth;
  let fillProgress = constrain(caughtMessages.length / maxCatch, 0, 1);

  push();
  imageMode(CENTER);
  translate(x, y);
  drawTrashbinFill(cursorWidth, cursorHeight, fillProgress);
  if (trashbinImage) {
    image(trashbinImage, 0, 0, cursorWidth, cursorHeight);
  }
  pop();
}

function getTrashbinCursorSize() {
  if (isMobile()) {
    return constrain(min(width, height) * 0.11, mobileTrashbinCursorMinSize, mobileTrashbinCursorMaxSize);
  }

  return constrain(min(width, height) * 0.13, trashbinCursorBaseSize, 168);
}

function drawTrashbinFill(cursorWidth, cursorHeight, fillProgress) {
  if (fillProgress <= 0) return;

  let maxFillHeight = cursorHeight * trashbinFillMaxRatio;
  let fillHeight = maxFillHeight * fillProgress;
  let yOffset = cursorHeight * trashbinFillYOffsetRatio;
  let bottomY = cursorHeight * 0.43 + yOffset;
  let topY = bottomY - fillHeight;
  let bottomHalfWidth = cursorWidth * 0.24;
  let topHalfWidth = lerp(cursorWidth * 0.32, cursorWidth * 0.44, fillProgress);

  noStroke();
  fill(255);
  quad(
    -topHalfWidth, topY,
    topHalfWidth, topY,
    bottomHalfWidth, bottomY,
    -bottomHalfWidth, bottomY
  );
}

function enterFinalMode() {
  finalMode = true;
  finalStripStartFrame = frameCount;
  initPile();
  fallingStrips = [];
  particles = [];

  stage1FadeOutFrame = frameCount;

  document.querySelectorAll(".footer-marquee__inner span").forEach(el => {
    el.textContent = "Click the reload button to read more messages";
  });

  if (filmStripeAdviceAudio) {
    filmStripeAdviceAudio.currentTime = 0;
    filmStripeAdviceAudio.play().catch(() => {});
  }

  if (ambientStage3Audio) {
    ambientStage3Audio.volume = 0;
    ambientStage3Audio.muted = true;
    ambientStage3Audio.play().then(() => {
      ambientStage3Audio.muted = false;
      stage3FadeInFrame = frameCount;
    }).catch(() => {});
  }

  // pick a random advice each time final mode starts
  if (adviceMessages && adviceMessages.length) {
    selectedAdvice = pickRandomAdvice(selectedAdvice);
  }

  let pool = [
    "01", "02", "03", "04", "05",
    "06", "07", "08", "09", "10"
  ];

  finalMessages = caughtMessages.length ? caughtMessages.slice(0, maxCatch) : shuffle(pool, true).slice(0, maxCatch);
}

function getPileCols() {
  return isMobile() ? 4 : 7;
}

function initPile() {
  let cols = getPileCols();
  pilingCards = [];
  piledCols = Array.from({ length: cols }, () => []);
  pileColFloors = new Array(cols).fill(height);
  exitingCards = [];
  pileLastSpawn = frameCount - PILE_SPAWN_INTERVAL;
}

function pileCardDims(typeIdx) {
  let ti = (typeIdx !== undefined) ? typeIdx : 0;
  let typeScale = (advicePileTypes[ti] && advicePileTypes[ti].scale !== undefined) ? advicePileTypes[ti].scale : 1.0;
  let w = constrain(width * 0.135, 75, 190) * typeScale;
  if (advicePileImages.length > ti && advicePileImages[ti].length > 0) {
    let img = advicePileImages[ti][0];
    return { w, h: w * (img.height / img.width) };
  }
  return { w, h: w };
}

function spawnPileCard() {
  if (!advicePileImages.length) return;
  let cols = getPileCols();
  let typeIdx = floor(random(advicePileImages.length));
  let scale = random(0.7, 1.3);
  let { w, h } = pileCardDims(typeIdx);
  w *= scale;
  h *= scale;
  let x = random(w / 2, width - w / 2);
  let col = constrain(floor(x / (width / cols)), 0, cols - 1);
  pilingCards.push({
    x, y: -h / 2,
    vy: random(1.5, 3.5),
    col, w, h,
    typeIdx,
    frameIdx: floor(random(8))
  });
}

function updatePile() {
  if (frameCount - pileLastSpawn >= PILE_SPAWN_INTERVAL) {
    spawnPileCard();
    pileLastSpawn = frameCount;
  }

  // Slide settled cards toward targetY smoothly
  for (let col of piledCols) {
    for (let card of col) {
      if (card.targetY !== undefined) {
        card.y = lerp(card.y, card.targetY, 0.14);
        if (abs(card.y - card.targetY) < 0.5) {
          card.y = card.targetY;
          card.targetY = undefined;
        }
      }
    }
  }

  // Slide exiting cards off the bottom
  for (let i = exitingCards.length - 1; i >= 0; i--) {
    let c = exitingCards[i];
    c.vy += 0.5;
    c.y += c.vy;
    if (c.y - c.h / 2 > height) exitingCards.splice(i, 1);
  }

  for (let i = pilingCards.length - 1; i >= 0; i--) {
    let c = pilingCards[i];
    c.vy += PILE_GRAVITY;
    c.y += c.vy;

    let col = constrain(c.col, 0, pileColFloors.length - 1);
    let fl = pileColFloors[col];
    if (c.y + c.h / 2 >= fl) {
      c.y = fl - c.h / 2;
      c.vy = -abs(c.vy) * PILE_BOUNCE_FACTOR;

      if (abs(c.vy) < PILE_SETTLE_THRESHOLD) {
        c.vy = 0;
        c.y = fl - c.h / 2;
        piledCols[col].push({ x: c.x, y: c.y, w: c.w, h: c.h, typeIdx: c.typeIdx, frameIdx: c.frameIdx });
        pileColFloors[col] -= c.h;
        pilingCards.splice(i, 1);
        trimPileCol(col);
      }
    }
  }
}

function trimPileCol(col) {
  let threshold = height * (1 - PILE_MAX_FILL_RATIO);
  while (pileColFloors[col] < threshold && piledCols[col].length > 0) {
    let removed = piledCols[col].shift();
    exitingCards.push({ ...removed, vy: 6 });
    for (let card of piledCols[col]) {
      card.targetY = (card.targetY !== undefined ? card.targetY : card.y) + removed.h;
    }
    pileColFloors[col] += removed.h;
  }
}

function drawPile() {
  if (!advicePileImages.length) return;
  push();
  translate(-width / 2, -height / 2);
  imageMode(CENTER);
  noTint();

  for (let col = 0; col < piledCols.length; col++) {
    for (let card of piledCols[col]) {
      let frames = advicePileImages[card.typeIdx];
      if (!frames) continue;
      let img = frames[card.frameIdx % frames.length];
      if (img) image(img, card.x, card.y, card.w, card.h);
    }
  }

  for (let c of pilingCards) {
    let frames = advicePileImages[c.typeIdx];
    if (!frames) continue;
    let img = frames[c.frameIdx % frames.length];
    if (img) image(img, c.x, c.y, c.w, c.h);
  }

  for (let c of exitingCards) {
    let frames = advicePileImages[c.typeIdx];
    if (!frames) continue;
    let img = frames[c.frameIdx % frames.length];
    if (img) image(img, c.x, c.y, c.w, c.h);
  }

  pop();
}

function drawFinalStrip() {
  if (isMobile()) {
    drawFinalStripMobile();
    return;
  }

  adviceReloadButton = null;

  let visibleMessages = finalMessages.filter(item => item && item.frames && item.frames.length);
  let finalSequence = visibleMessages.concat(visibleMessages);
  let hasFinalFrameAnimation = finalFrameAnimation.length > 0;
  let itemCount = finalSequence.length + (hasFinalFrameAnimation ? 1 : 0);
  if (!itemCount) return;

  let referenceImage = finalSequence.length ? finalSequence[0].frames[0] : finalFrameAnimation[0];
  let itemSize = getContainSize(referenceImage.width, referenceImage.height, width * finalStripScale, height * finalStripScale);
  let itemStep = itemSize.w;
  let slideTarget = itemCount - 1;
  let elapsedFrames = max(0, frameCount - finalStripStartFrame - finalIntroHoldFrames);
  let slideProgress = constrain(elapsedFrames / max(1, slideTarget * finalSlideFramesPerItem), 0, 1);
  let focusedIndex = easeInOutCubic(slideProgress) * slideTarget;

  for (let i = 0; i < finalSequence.length; i++) {
    let x = (i - focusedIndex) * itemStep;
    let preview = {
      animation: finalSequence[i],
      frameOffset: i * 2
    };

    drawTrashAnimation(preview, x, 0, itemSize.w, itemSize.h);
  }

  if (hasFinalFrameAnimation) {
    let x = (finalSequence.length - focusedIndex) * itemStep;
    let frameIndex = floor(frameCount / animationFrameHold) % finalFrameAnimation.length;

    push();
    imageMode(CENTER);
    image(finalFrameAnimation[frameIndex], x, 0, itemSize.w, itemSize.h);
    drawAdviceTextBox(x, 0, itemSize.w, itemSize.h);
    pop();
  }
}

function drawFinalStripMobile() {
  adviceReloadButton = null;

  let visibleMessages = finalMessages.filter(item => item && item.frames && item.frames.length);
  let finalSequence = visibleMessages.concat(visibleMessages);
  let hasFinalFrameAnimation = finalFrameAnimation.length > 0;
  let itemCount = finalSequence.length + (hasFinalFrameAnimation ? 1 : 0);
  if (!itemCount) return;

  let referenceImage = finalSequence.length ? finalSequence[0].frames[0] : finalFrameAnimation[0];
  let itemSize = getContainSize(referenceImage.width, referenceImage.height, width * 0.84, height * 0.4);
  let itemStep = itemSize.h * 0.92;
  let slideTarget = itemCount - 1;
  let elapsedFrames = max(0, frameCount - finalStripStartFrame - finalIntroHoldFrames);
  let slideProgress = constrain(elapsedFrames / max(1, slideTarget * mobileFinalSlideFramesPerItem), 0, 1);
  let focusedIndex = easeInOutCubic(slideProgress) * slideTarget;

  for (let i = 0; i < finalSequence.length; i++) {
    let y = (i - focusedIndex) * itemStep;
    let preview = {
      animation: finalSequence[i],
      frameOffset: i * 2
    };

    drawTrashAnimation(preview, 0, y, itemSize.w, itemSize.h);
  }

  if (hasFinalFrameAnimation) {
    let y = (finalSequence.length - focusedIndex) * itemStep;
    let frameIndex = floor(frameCount / animationFrameHold) % finalFrameAnimation.length;

    push();
    imageMode(CENTER);
    image(finalFrameAnimation[frameIndex], 0, y, itemSize.w, itemSize.h);
    drawAdviceTextBox(0, y, itemSize.w, itemSize.h);
    pop();
  }
}

function drawAdviceTextBox(frameCenterX, frameCenterY, frameWidth, frameHeight) {
  let boxHeight = frameHeight * adviceTextBoxHeightRatio;
  let centerY = frameCenterY - frameHeight * adviceTextBoxTopOffsetRatio;
  let cornerRadius = boxHeight * 0.52;
  let textSizeValue = constrain(boxHeight * 0.5, 14, 42);
  let horizontalPadding = boxHeight * 0.65;
  let framePadX = frameWidth * 0.06;
  let framePadY = frameHeight * 0.06;

  textFont(stageOneTextFont);
  textSize(textSizeValue);
  // textStyle(BOLD);

  // Draw the label box
  let textW = textWidth(adviceTextBoxLabel);
  let boxWidth = min(textW + horizontalPadding * 2, frameWidth - framePadX * 2);
  centerY = constrain(
    centerY,
    frameCenterY - frameHeight / 2 + boxHeight / 2 + framePadY,
    frameCenterY + frameHeight / 2 - boxHeight / 2 - framePadY
  );

  noStroke();
  fill(10, 51, 255);
  rectMode(CENTER);
  rect(frameCenterX, centerY, boxWidth, boxHeight, cornerRadius);

  fill(255);
  textAlign(CENTER, CENTER);
  text(adviceTextBoxLabel, frameCenterX, centerY + boxHeight * 0.02);
  textStyle(NORMAL);

  // Draw the selected advice text in the center of the advice frame
  let advice = selectedAdvice || "";
  if (advice) {
    let adviceTextSize = isMobile()
      ? constrain(frameHeight * 0.072, 18, 34)
      : constrain(frameHeight * 0.1, 26, 78);
    textSize(adviceTextSize);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    textLeading(adviceTextSize * 1.14);
    fill("#1840F2");
    let adviceY = frameCenterY;
    let adviceMaxW = frameWidth * 0.58;
    text(advice, frameCenterX, adviceY, adviceMaxW, frameHeight * 0.62);
  }

  // Reload button below advice text (inside advice frame)
  let buttonSize = isMobile()
    ? constrain(frameHeight * adviceReloadButtonSizeRatio * 0.72, 28, 54)
    : constrain(frameHeight * adviceReloadButtonSizeRatio, 42, 90);
  let buttonX = frameCenterX;
  let buttonY = frameCenterY + frameHeight * 0.35;
  let buttonMinY = frameCenterY - frameHeight / 2 + buttonSize / 2 + framePadY;
  let buttonMaxY = frameCenterY + frameHeight / 2 - buttonSize / 2 - framePadY;
  buttonY = constrain(buttonY, buttonMinY, buttonMaxY);

  let bounceDuration = 11;
  let bounceT = reloadButtonBounceFrame >= 0
    ? constrain((frameCount - reloadButtonBounceFrame) / bounceDuration, 0, 1)
    : 1;
  let bounceScale = bounceT < 1
    ? 1 - 0.28 * sin(bounceT * PI)
    : 1;

  push();
  translate(buttonX, buttonY);
  scale(bounceScale);
  noStroke();
  fill("#1840F2");
  circle(0, 0, buttonSize);

  if (reloadButtonImage) {
    imageMode(CENTER);
    tint(255);
    image(reloadButtonImage, 0, 0, buttonSize * 0.52, buttonSize * 0.52);
    noTint();
  }
  pop();

  adviceReloadButton = {
    x: buttonX,
    y: buttonY,
    r: buttonSize / 2
  };
}

function mousePressed() {
  if (!finalMode || !adviceReloadButton) return;

  let localX = mouseX - width / 2;
  let localY = mouseY - height / 2;
  let isInsideButton = dist(localX, localY, adviceReloadButton.x, adviceReloadButton.y) <= adviceReloadButton.r;

  if (isInsideButton) {
    selectedAdvice = pickRandomAdvice(selectedAdvice);
    reloadButtonBounceFrame = frameCount;
    if (reloadAudio) {
      reloadAudio.currentTime = 0;
      reloadAudio.play().catch(() => {});
    }
  }
}


function getContainSize(sourceWidth, sourceHeight, targetWidth, targetHeight) {
  let scaleFactor = min(targetWidth / sourceWidth, targetHeight / sourceHeight);

  return {
    w: sourceWidth * scaleFactor,
    h: sourceHeight * scaleFactor
  };
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t) {
  return 1 - pow(1 - t, 3);
}

function easeOutBack(t) {
  const c1 = 2.2;
  const c3 = c1 + 1;
  return 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initStageOneBackgroundItems();
  if (finalMode) initPile();
}

let _chauAudioPending = false;
let _chauScrollDelta = 0;
let _chauLastScrollTime = 0;

window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'pageVisibility') return;
  if (data.isActive) {
    if (reelIntroStartMs < 0) reelIntroStartMs = millis() + 850;
    if (ambientMusicStage1Audio) {
      ambientMusicStage1Audio.play().then(() => {
        _chauAudioPending = false;
      }).catch(() => {
        _chauAudioPending = true;
      });
    }
  } else {
    stopStage1AmbientMusic();
    _chauAudioPending = false;
  }
});

window.addEventListener('wheel', (e) => {
  if (_chauAudioPending) {
    _chauAudioPending = false;
    playStage1AmbientMusic();
  }

  if (finalMode) {
    let now = Date.now();
    if (now - _chauLastScrollTime > 1500) _chauScrollDelta = 0;
    _chauScrollDelta += abs(e.deltaY);
    _chauLastScrollTime = now;
    if (_chauScrollDelta > 120) {
      _chauScrollDelta = 0;
      window.parent.postMessage('scrollDown', '*');
    }
  }
}, { passive: true });

window.addEventListener('pointerdown', () => {
  if (_chauAudioPending) {
    _chauAudioPending = false;
    playStage1AmbientMusic();
  }
});
