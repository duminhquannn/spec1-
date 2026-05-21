let imgAdvice, imgGreen, imgSdg3, imgChris, imgEmoji, imgEye, imgScroll, imgNoti;
let isSketchInfoActive = true;
let totalScrolled = 0;
let targetScroll = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchStartScroll = 0;

const GAP = 10;
const TOTAL_IMGS = 7;
const GREEN_TEXT = '#91e82b';

const ADVICE_FRAME_CONTENT = [
  {
    title: 'CONCEPT',
    body: [
      'This project is for people with IAD or early signs of internet addiction, driven by the need to escape stress, anxiety, or unresolved emotions through the digital world.',
      'We offer a recovery website inspired by the 12 Steps Program, guiding users through awareness, admission, and action to build healthier digital habits and improve mental well-being.'
    ]
  },
  {
    title: 'OUR GOAL',
    body: [
      'Sustainable Development Goal 3 aims to ensure healthy lives and well-being for all. In the context of Internet Addiction Disorder (IAD), this goal is relevant as excessive internet use can harm mental and physical health. Addressing anxiety, depression, sleep disturbance, stress, and screen-related issues helps promote healthier lifestyles in the digital age.'
    ]
  },
  {
    title: 'UNICEF GOAL',
    layout: 'sdg',
    body: [
      "UNICEF's mission to protect the well-being of young people connects to this project. As excessive internet use increases anxiety, sleep loss, stress, and unhealthy habits, promoting healthier digital behavior supports UNICEF's goal of helping youth grow in safe and healthy environments."
    ]
  },
  {
    title: 'QUOTE',
    layout: 'quote',
    quote: '"Technology is a useful servant but a dangerous master." - Christian Lous Lange',
    body: [
      "This quote links to SDG 3, especially Target 3.4 on mental health and well-being. For young adults aged 18-25, it shows that technology is helpful as a tool but harmful when it controls behavior, supporting the project's goal of healthier digital habits."
    ],
    caption: 'Christian Lous Lange'
  }
];

window.setSketchInfoActive = function (isActive) {
  const shouldRun = Boolean(isActive);
  if (isSketchInfoActive === shouldRun) return;
  isSketchInfoActive = shouldRun;
  if (isSketchInfoActive) loop();
  else noLoop();
};

function preload() {
  imgAdvice = loadImage('advice_frame_00.png');
  imgGreen = loadImage('frame_green.png');
  imgSdg3 = loadImage('sdg3.png');
  imgChris = loadImage('Chris.png');
  imgEmoji = loadImage('emoji.png');
  imgEye = loadImage('eye.png');
  imgScroll = loadImage('scroll.png');
  imgNoti = loadImage('noti.png');
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  const holder = document.getElementById('p5-bg');
  if (holder) canvas.parent(holder);
  pixelDensity(1);
  frameRate(60);
  if (!isSketchInfoActive) noLoop();
}

function draw() {
  background('#1840F2');

  const diff = targetScroll - totalScrolled;
  if (abs(diff) > 0.1) {
    totalScrolled += diff * 0.12;
  } else {
    totalScrolled = targetScroll;
  }

  drawStrip();
}

function drawStrip() {
  const metrics = getFrameMetrics();
  const step = metrics.w + GAP;

  for (let k = 0; k < TOTAL_IMGS; k++) {
    const x = metrics.startX + k * step - totalScrolled;
    if (x + metrics.w < 0 || x > width) continue;

    const img = (k % 2 === 0) ? imgAdvice : imgGreen;
    image(img, x, metrics.y, metrics.w, metrics.h);

    if (img === imgAdvice) {
      drawAdviceFrameContent(floor(k / 2), x, metrics.y, metrics.w, metrics.h);
    }
  }
}

function drawAdviceFrameContent(index, frameX, frameY, frameW, frameH) {
  const content = ADVICE_FRAME_CONTENT[index];
  if (!content) return;

  const isPhone = width < 700;
  const centerX = frameX + frameW * 0.5;
  const titleY = frameY + frameH * (isPhone ? 0.305 : 0.315);
  const bodyY = frameY + frameH * (isPhone ? 0.39 : 0.405);
  const bodyW = min(frameW * 0.56, width * (isPhone ? 0.82 : 0.62));
  const titleMaxW = min(frameW * 0.64, width * 0.9);
  const titleSize = constrain(min(frameH * 0.09, width * 0.09), 27, 46);
  const bodySize = constrain(min(frameH * 0.0375, width * 0.052), 15, 22);
  const blockH = frameH * (isPhone ? 0.18 : 0.14);
  const paragraphGap = bodySize * (isPhone ? 1.15 : 1.45);

  if (index === 0) {
    drawConceptVisuals(frameX, frameY, frameW, frameH, isPhone);
  } else if (content.title === 'OUR GOAL') {
    drawGoalVisuals(frameX, frameY, frameW, frameH, isPhone);
  } else if (content.title === 'UNICEF GOAL') {
    drawUnicefVisuals(frameX, frameY, frameW, frameH, isPhone);
  } else if (content.title === 'QUOTE') {
    drawQuoteVisuals(frameX, frameY, frameW, frameH, isPhone);
  }

  push();
  textAlign(CENTER, CENTER);
  textFont('Arial');
  noStroke();

  fill(GREEN_TEXT);
  textStyle(BOLD);
  drawDottedTitle(content.title, centerX, titleY, titleMaxW, titleSize);

  fill('#111111');
  textStyle(ITALIC);
  textSize(bodySize);
  textLeading(bodySize * (isPhone ? 1.12 : 1.18));

  if (content.layout === 'sdg') {
    drawSdgContent(content, centerX, bodyY, frameW, frameH, bodySize, isPhone);
    pop();
    return;
  }

  if (content.layout === 'quote') {
    drawQuoteContent(content, centerX, bodyY, frameW, frameH, bodySize, isPhone);
    pop();
    return;
  }

  if (content.body.length === 1) {
    text(content.body[0], centerX - bodyW / 2, bodyY, bodyW, frameH * 0.28);
  } else {
    text(content.body[0], centerX - bodyW / 2, bodyY, bodyW, blockH);
    text(content.body[1], centerX - bodyW / 2, bodyY + blockH + paragraphGap, bodyW, blockH);
  }

  pop();
}

function drawConceptVisuals(frameX, frameY, frameW, frameH, isPhone) {
  if (!imgEmoji || imgEmoji.width <= 0) return;

  const bottomSize = frameH * (isPhone ? 0.22 : 0.27);
  const topSize = frameH * (isPhone ? 0.17 : 0.19);

  drawRotatedImage(
    imgEmoji,
    frameX + frameW * (isPhone ? 0.15 : 0.13),
    frameY + frameH * (isPhone ? 0.83 : 0.82),
    bottomSize,
    -0.22
  );

  drawRotatedImage(
    imgEmoji,
    frameX + frameW * (isPhone ? 0.84 : 0.87),
    frameY + frameH * (isPhone ? 0.14 : 0.12),
    topSize,
    0.24
  );
}

function drawGoalVisuals(frameX, frameY, frameW, frameH, isPhone) {
  if (!imgEye || imgEye.width <= 0) return;

  const topSize = frameH * (isPhone ? 0.23 : 0.27);
  const bottomSize = frameH * (isPhone ? 0.14 : 0.16);

  drawRotatedImage(
    imgEye,
    frameX + frameW * (isPhone ? 0.84 : 0.86),
    frameY + frameH * (isPhone ? 0.12 : 0.1),
    topSize,
    0.18
  );

  drawRotatedImage(
    imgEye,
    frameX + frameW * (isPhone ? 0.13 : 0.12),
    frameY + frameH * (isPhone ? 0.86 : 0.84),
    bottomSize,
    -0.42
  );
}

function drawUnicefVisuals(frameX, frameY, frameW, frameH, isPhone) {
  if (!imgScroll || imgScroll.width <= 0) return;

  const topSize = frameH * (isPhone ? 0.15 : 0.17);
  const bottomSize = frameH * (isPhone ? 0.15 : 0.17);

  drawRotatedImage(
    imgScroll,
    frameX + frameW * (isPhone ? 0.86 : 0.88),
    frameY + frameH * (isPhone ? 0.12 : 0.1),
    topSize,
    0.25
  );

  drawRotatedImage(
    imgScroll,
    frameX + frameW * (isPhone ? 0.12 : 0.11),
    frameY + frameH * (isPhone ? 0.86 : 0.84),
    bottomSize,
    -0.24
  );
}

function drawQuoteVisuals(frameX, frameY, frameW, frameH, isPhone) {
  if (!imgNoti || imgNoti.width <= 0) return;

  const size = frameH * (isPhone ? 0.23 : 0.27);

  drawRotatedImage(
    imgNoti,
    frameX + frameW * (isPhone ? 0.85 : 0.87),
    frameY + frameH * (isPhone ? 0.13 : 0.11),
    size,
    0.18
  );
}

function drawRotatedImage(img, centerX, centerY, size, angle) {
  const drawW = size;
  const drawH = getImageHeightForWidth(img, drawW);

  push();
  translate(centerX, centerY);
  rotate(angle);
  imageMode(CENTER);
  image(img, 0, 0, drawW, drawH);
  imageMode(CORNER);
  pop();
}

function drawSdgContent(content, centerX, bodyY, frameW, frameH, bodySize, isPhone) {
  if (isPhone) {
    const iconSize = frameH * 0.19;
    const textW = min(frameW * 0.56, width * 0.78);
    const iconX = centerX - iconSize / 2;
    const iconY = bodyY - frameH * 0.005;

    if (imgSdg3 && imgSdg3.width > 0) {
      image(imgSdg3, iconX, iconY, iconSize, iconSize);
    }

    textStyle(NORMAL);
    textAlign(CENTER, TOP);
    textSize(bodySize * 0.95);
    textLeading(bodySize * 1.02);
    text(content.body[0], centerX - textW / 2, iconY + iconSize + bodySize * 0.85, textW, frameH * 0.24);
    return;
  }

  const groupW = frameW * 0.58;
  const iconSize = min(frameH * 0.285, groupW * 0.38);
  const gap = frameW * 0.04;
  const textW = groupW - iconSize - gap;
  const groupX = centerX - groupW / 2;
  const topY = bodyY - frameH * (isPhone ? 0.005 : 0.01);

  if (imgSdg3 && imgSdg3.width > 0) {
    image(imgSdg3, groupX, topY, iconSize, iconSize);
  }

  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  textSize(bodySize * 0.92);
  textLeading(bodySize * 1.04);
  text(
    content.body[0],
    groupX + iconSize + gap,
    topY + iconSize * 0.02,
    textW,
    frameH * (isPhone ? 0.26 : 0.22)
  );

  textSize(bodySize * 0.48);
  textLeading(bodySize * 0.58);
  text('SDG 3: Good health and\nwell-being', groupX + iconSize * 0.02, topY + iconSize + bodySize * 0.45);
}

function drawQuoteContent(content, centerX, bodyY, frameW, frameH, bodySize, isPhone) {
  if (isPhone) {
    const imageH = frameH * 0.23;
    const imageW = getImageWidthForHeight(imgChris, imageH);
    const textW = min(frameW * 0.58, width * 0.8);
    const imageX = centerX - imageW / 2;
    const imageY = bodyY - frameH * 0.005;

    if (imgChris && imgChris.width > 0) {
      image(imgChris, imageX, imageY, imageW, imageH);
    }

    fill('#555555');
    textAlign(CENTER, TOP);
    textStyle(NORMAL);
    textSize(bodySize * 0.45);
    text(content.caption, centerX - textW / 2, imageY + imageH + bodySize * 0.25, textW, bodySize);

    fill('#111111');
    textStyle(BOLD);
    textSize(bodySize * 0.82);
    textLeading(bodySize * 0.95);
    text(content.quote, centerX - textW / 2, imageY + imageH + bodySize * 1.15, textW, frameH * 0.07);

    textStyle(NORMAL);
    textSize(bodySize * 0.72);
    textLeading(bodySize * 0.86);
    text(content.body[0], centerX - textW / 2, imageY + imageH + bodySize * 4.45, textW, frameH * 0.17);
    return;
  }

  const groupW = frameW * 0.6;
  const imageH = min(frameH * 0.405, groupW * 0.38);
  const imageW = getImageWidthForHeight(imgChris, imageH);
  const gap = frameW * 0.035;
  const textW = groupW - imageW - gap;
  const groupX = centerX - groupW / 2;
  const topY = bodyY - frameH * 0.035;

  if (imgChris && imgChris.width > 0) {
    image(imgChris, groupX, topY, imageW, imageH);
  }

  fill('#555555');
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  textSize(bodySize * 0.34);
  text(content.caption, groupX, topY + imageH + bodySize * 0.35, imageW, bodySize);

  fill('#111111');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(bodySize * 0.78);
  textLeading(bodySize * 0.92);
  text(content.quote, groupX + imageW + gap, topY + bodySize * 0.1, textW, frameH * 0.08);

  textStyle(NORMAL);
  textSize(bodySize * 0.74);
  textLeading(bodySize * 0.88);
  text(content.body[0], groupX + imageW + gap, topY + frameH * 0.11, textW, frameH * 0.2);
}

function getImageWidthForHeight(img, targetH) {
  if (!img || img.width <= 0 || img.height <= 0) return targetH;
  return targetH * (img.width / img.height);
}

function getImageHeightForWidth(img, targetW) {
  if (!img || img.width <= 0 || img.height <= 0) return targetW;
  return targetW * (img.height / img.width);
}

function drawDottedTitle(title, centerX, centerY, maxW, size) {
  textSize(size);

  const titleW = textWidth(title);
  const dotSize = constrain(size * 0.42, 7, 13);
  const dotGap = dotSize * 1.45;
  const titleGap = size * 0.45;
  const clusterW = dotSize * 3 + dotGap * 2;
  const totalW = titleW + titleGap * 2 + clusterW * 2;
  const scaleFactor = min(1, maxW / totalW);

  push();
  translate(centerX, centerY);
  scale(scaleFactor);
  text(title, 0, 0);

  const leftStart = -titleW / 2 - titleGap - clusterW + dotSize / 2;
  const rightStart = titleW / 2 + titleGap + dotSize / 2;

  for (let i = 0; i < 3; i++) {
    circle(leftStart + i * (dotSize + dotGap), 0, dotSize);
    circle(rightStart + i * (dotSize + dotGap), 0, dotSize);
  }

  pop();
}

function getFrameMetrics() {
  const aspect = (imgAdvice && imgAdvice.width > 0) ? imgAdvice.width / imgAdvice.height : 857 / 512;
  const shortSide = min(width, height);
  const isPhone = shortSide < 600;
  const isTablet = shortSide >= 600 && shortSide < 1000;
  const heightRatio = isPhone ? 0.84 : (isTablet ? 0.8 : 0.78);
  const frameH = height * heightRatio;
  const frameW = frameH * aspect;

  return {
    w: frameW,
    h: frameH,
    y: (height - frameH) / 2,
    startX: (width - frameW) / 2
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  targetScroll = constrain(targetScroll, 0, getMaxScroll());
  totalScrolled = constrain(totalScrolled, 0, getMaxScroll());
}

let _overScrollDelta = 0;
let _lastPageScrollTime = 0;

window.addEventListener('wheel', (e) => {
  const maxScroll = getMaxScroll();
  const now = Date.now();

  if (e.deltaY > 0 && targetScroll >= maxScroll) {
    if (now - _lastPageScrollTime < 1500) { _overScrollDelta = 0; return; }
    _overScrollDelta += e.deltaY;
    if (_overScrollDelta > 150) {
      window.parent.postMessage('scrollDown', '*');
      _lastPageScrollTime = now;
      _overScrollDelta = 0;
    }
    return;
  }

  if (e.deltaY < 0 && targetScroll <= 0) {
    if (now - _lastPageScrollTime < 1500) { _overScrollDelta = 0; return; }
    _overScrollDelta += e.deltaY;
    if (_overScrollDelta < -150) {
      window.parent.postMessage('scrollUp', '*');
      _lastPageScrollTime = now;
      _overScrollDelta = 0;
    }
    return;
  }

  _overScrollDelta = 0;
  targetScroll += e.deltaY * 0.8;
  targetScroll = constrain(targetScroll, 0, maxScroll);
}, { passive: true });

window.addEventListener('touchstart', (e) => {
  if (!e.touches || e.touches.length !== 1) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchStartScroll = targetScroll;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (!e.touches || e.touches.length !== 1) return;

  const dx = touchStartX - e.touches[0].clientX;
  const dy = touchStartY - e.touches[0].clientY;
  if (abs(dx) <= abs(dy)) return;

  targetScroll = constrain(touchStartScroll + dx * 1.25, 0, getMaxScroll());
  e.preventDefault();
}, { passive: false });

window.addEventListener('touchend', (e) => {
  if (!e.changedTouches || e.changedTouches.length !== 1) return;
  const maxScroll = getMaxScroll();
  const dx = touchStartX - e.changedTouches[0].clientX;

  if (dx > 60 && targetScroll >= maxScroll) {
    window.parent.postMessage('scrollDown', '*');
  } else if (dx < -60 && targetScroll <= 0) {
    window.parent.postMessage('scrollUp', '*');
  }
}, { passive: true });

function getMaxScroll() {
  const metrics = getFrameMetrics();
  const step = metrics.w + GAP;
  return (TOTAL_IMGS - 1) * step;
}
