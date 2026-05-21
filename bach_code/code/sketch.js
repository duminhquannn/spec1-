let balls = [], films = [], boxes = [], seqImages = [], ctaBgImage = null, draggedBox = null, placementBursts = [], scopeSwallowSpin = 0, dragSound = null, synthSound = null, putSound = null;

let boxBgImages = [], adviceFrameImages = [];
let synthDownSound = null, phenakistoscopeSound = null, explosionSound = null, phenakistoscopeLoopStartTime = 0, phenakistoscopeLoopStopTimeout = null, phenakistoscopeLoopActive = !1, explosionSoundPlayed = !1;
let ambienceSound = null, tunnelSound = null, tunnelSoundStarted = !1, ambienceSoundStarted = !1, ambienceSoundFadingOut = !1;
let boxSound = null, lastBoxSoundFrame = -999;
let soundMuted = !1, audioUnlocked = !1;
let sceneStarted = false;

function preload() {
    ctaBgImage = loadImage("../edited-media/backgroundcta.svg"), ctaSound = loadSound("../designed-sounds/CTAsong.wav"), ambienceSound = loadSound("../designed-sounds/AmbienceSound.wav"), tunnelSound = loadSound("../designed-sounds/COMM2754-2026-S3992383-A1w04-sound1.wav"), dragSound = loadSound("../designed-sounds/COMM2754-2026-S3992383-A1w04-sound2.wav"), synthSound = loadSound("../designed-sounds/COMM2754-2026-S3992383-A1w04-synth.wav"), putSound = loadSound("../designed-sounds/COMM2754-2026-S3992383-A1w04-Putting.wav"), boxSound = loadSound("../designed-sounds/COMM2754-2026-S3992383-A3w012-boxsound.wav"), synthDownSound = loadSound("../designed-sounds/COMM2754-2026-S3992383-A3w012-synthdownsound.wav"), phenakistoscopeSound = loadSound("../designed-sounds/COMM2754-2026-S3992383-A3w012-phenakistoscopesound.wav"), explosionSound = loadSound("../designed-sounds/COMM2754-2026-S3992383-A3w012-explosion.wav");
    const t = [ "emoji", "hand", "noti", "scroll", "wrapped" ];
    for (let e = 0; e < t.length; e++) {
        let o = [];
        for (let i = 1; i <= 8; i++) o.push(loadImage(`../edited-media/${t[e]}${i}.png`));
        seqImages.push(o);
    }
    for (let t = 1; t <= 8; t++) adviceFrameImages.push(loadImage(`../edited-media/advice${t}.png`));
    for (let t = 0; t < 8; t++) boxBgImages.push(loadImage(`../edited-media/bach_frame_${t}.png`));
}

const TOTAL_FILMS = 5, GREEN = "#F0374D", BLUE = [ 173, 242, 24 ], BOX_BG = "#A9F037", BOX_BORDER = "#F0374D", BOX_BORDER_DOT = "#FF596D", CTA_BG = "#F0374D", CTA_BORDER = "#CC273B", PHENAKISTOSCOPE_COPY_SCALE = .625, BOX_HOVER_SCALE = 1.1, BOX_GAP = 28, BOX_CLEAR_GAP = 58, BAR_BOX_MARGIN = 54, SCOPE_BOX_MARGIN = 76, CTA_BALL_MARGIN = 80, CTA_COLLISION_RADIUS = 140, SPIRAL_COPY_SPEED = 1.5, SPIRAL_COPY_COUNT = 7, LOOP_RING_COUNT = 8, LOOP_ANIMATION_SPEED = .07, SPIRAL_RING_RADIUS = .56, SPIRAL_INNER_COPY_SCALE = .5, CTA_TEXT = "ADMIT THE ADDICTION\nFORGE THE DISCIPLINE";

let layoutProfile = null;

let cx, cy, circleR, emptyRadius, baseBoxSize = 0, safeMarginX = 0, safeMarginY = 0, safeW = 0, safeH = 0, footerTop = 0, headerBottom = 0, allDone = !1, ballPhaseStarted = !1, introNoticeDismissed = !1, ctaAlpha = 0, ctaBounds = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
}, ctaSound = null, ctaSoundStarted = !1, ctaSoundPending = !1, ctaSoundStartTime = 0, ctaAmplitudeAnalyzer = null, introProgress = 0, introDone = !1, loopFade = 1, circleSpin = 0, circleVanish = 0, explosionPhase = !1, explosionRadius = 0, explosionAlpha = 255, explosionDone = !1, tunnelScrollProgress = 0, tunnelScrollTarget = 0, footerPromptState = "", footerMarqueeDefaultHTML = "";

function setup() {
    createCanvas(windowWidth, windowHeight), pixelDensity(1), smooth(), ctaAmplitudeAnalyzer = new p5.Amplitude,
    setupHeaderButtons(), resetScene(), balls.push(new Ball), startAmbienceSound();
}

function setupHeaderButtons() {
    const t = Array.from(document.querySelectorAll(".header-actions .icon-button:not(.sound-button)")), e = document.querySelector(".sound-button");
    e && (e.addEventListener("pointerdown", t => {
        t.preventDefault(), t.stopPropagation(), unlockAudio(), toggleSound();
    }), updateSoundButton());
    document.addEventListener("pointerdown", () => {
        unlockAudio(), startAmbienceSound();
    }, {
        once: !0,
        capture: !0
    });
    document.addEventListener("click", e => {
        const o = e.target.closest(".header-actions .icon-button:not(.sound-button)");
        t.forEach(t => t.classList.toggle("is-active", t === o && !t.classList.contains("is-active")));
    });
}

function unlockAudio() {
    if (audioUnlocked) return;
    "function" == typeof userStartAudio && userStartAudio();
    const t = "function" == typeof getAudioContext ? getAudioContext() : null;
    t && "suspended" === t.state && t.resume && t.resume(), audioUnlocked = !0;
}

function toggleSound() {
    setSoundMuted(!soundMuted);
}

function setSoundMuted(t) {
    soundMuted = t, "function" == typeof masterVolume && masterVolume(soundMuted ? 0 : 1), 
    soundMuted ? stopAllSounds() : resumeCurrentSounds(), 
    updateSoundButton();
}

function updateSoundButton() {
    const t = document.querySelector(".sound-button");
    t && (t.classList.toggle("is-active", !soundMuted), t.setAttribute("aria-pressed", String(!soundMuted)), 
    t.setAttribute("aria-label", soundMuted ? "Sound off" : "Sound on"));
}

function getProjectSounds() {
    return [ ctaSound, ambienceSound, tunnelSound, dragSound, synthSound, putSound, boxSound, synthDownSound, phenakistoscopeSound, explosionSound ].filter(Boolean);
}

function stopAllSounds() {
    getProjectSounds().forEach(t => {
        t && t.isPlaying && t.isPlaying() && t.stop();
    });
}

function resumeLoopSound(t, e, o = .6) {
    t && t.isLoaded && t.isLoaded() && (t.setLoop(!0), t.setVolume(0), t.loop(), t.fade(e, o));
}

function resumeCurrentSounds() {
    ambienceSoundStarted && !ambienceSoundFadingOut && resumeLoopSound(ambienceSound, .28, 1.5), 
    tunnelSoundStarted && resumeLoopSound(tunnelSound, .32, .65), 
    phenakistoscopeLoopActive && resumeLoopSound(phenakistoscopeSound, .16, .45), 
    ctaSoundStarted && (resumeLoopSound(ctaSound, .38, 2), ctaAmplitudeAnalyzer && (ctaAmplitudeAnalyzer.setInput(ctaSound), 
    ctaAmplitudeAnalyzer.smooth(.75))), ambienceSoundStarted || explosionDone || allDone || startAmbienceSound();
}

function draw() {
    background(...BLUE), sceneStarted && (introDone || (introProgress = min(introProgress + .02, 1),
    introProgress >= 1 && (introDone = !0))), updateScopeSwallowSpin(), films.forEach(t => {
        sceneStarted && t.update(), t.display();
    }), updateCircle(), circleVanish >= 1 && !explosionPhase && !explosionDone && (explosionPhase = !0), 
    explosionPhase || explosionDone || drawCenterCircle(), circleVanish >= 1 && loopFade > 0 && !explosionPhase && !explosionDone && (push(), 
    translate(cx, cy), drawOuterLoopAnimationRing(circleR, loopFade), pop()), boxes.forEach(t => {
        t.update(), t.display();
    }), drawIntroNotice(), explosionPhase || explosionDone || drawTunnelTransitionOverlay(), circleVanish < 1 || (explosionPhase || explosionDone || (explosionPhase = !0), 
    explosionPhase && runExplosion(), explosionDone && (drawCTA(), balls.forEach(t => {
        t.update(), t.display();
    }))), updateFooterPrompt();
}

function triggerScene() {
    if (sceneStarted) return;
    sceneStarted = true;
    introProgress = 0;
    introDone = false;
    for (const box of boxes) {
        box.introStartFrame = frameCount + 30 + 10 * box.index;
    }
    for (const film of films) {
        film.spawnProgress = 0.1 * -film.index;
    }
}

function resetScene() {
    calculateSafeZone(), generateScene(), placementBursts = [], scopeSwallowSpin = 0, 
    draggedBox = null, allDone = !1, introNoticeDismissed = !1, introProgress = 0, introDone = !1, loopFade = 1, 
    circleSpin = 0, circleVanish = 0, explosionPhase = !1, explosionRadius = 0, explosionAlpha = 255, 
    explosionDone = !1, explosionSoundPlayed = !1, tunnelScrollProgress = 0, tunnelScrollTarget = 0, stopPhenakistoscopeLoop(), 
    stopTunnelSound(), stopCTASound(), 
    ctaSoundStarted = !1, ctaSoundPending = !1, ctaSoundStartTime = 0, ctaAlpha = 0, footerPromptState = "", 
    updateFooterPrompt();
}

function updateFooterPrompt() {
    const t = document.querySelector(".footer-marquee"), e = t && t.querySelector(".footer-marquee__inner");
    if (!t || !e) return;
    footerMarqueeDefaultHTML || (footerMarqueeDefaultHTML = e.innerHTML);
    const o = explosionPhase && !explosionDone ? "scroll" : allDone || explosionDone ? "hidden" : "drag";
    if (footerPromptState === o) return;
    footerPromptState = o, t.classList.toggle("is-hidden", "hidden" === o), 
    t.classList.toggle("is-scroll-prompt", "scroll" === o), e.innerHTML = "scroll" === o ? Array.from({
        length: 8
    }, () => "<span>scroll to continue</span>").join("") : footerMarqueeDefaultHTML;
}

function getResponsiveLayoutProfile() {
    const t = min(windowWidth, windowHeight), e = max(windowWidth, windowHeight);
    if (t <= 480 || windowWidth <= 640) return {
        name: "phone",
        filmCount: TOTAL_FILMS,
        safeMarginX: .07,
        safeMarginY: .1,
        circleScale: .47,
        minBoxSize: 38,
        maxBoxSize: 84,
        edgePad: 18,
        boxPadY: 28,
        boxGap: 24,
        circleClearance: 30,
        ribbonWidthMin: 13,
        ribbonWidthMax: 19,
        pointCount: 240,
        tangleScale: .44,
        loopCount: 2,
        ballCount: 150,
        ballMin: 18,
        ballMax: 48,
        ctaBlocksBalls: !0,
        ctaScale: .068,
        ctaPadX: 34,
        ctaPadY: 32,
        ctaCollisionPad: 4
    };
    if (t <= 820 || e <= 1180) return {
        name: "tablet",
        filmCount: TOTAL_FILMS,
        safeMarginX: .09,
        safeMarginY: .12,
        circleScale: .51,
        minBoxSize: 42,
        maxBoxSize: 112,
        edgePad: 24,
        boxPadY: 38,
        boxGap: 36,
        circleClearance: 46,
        ribbonWidthMin: 17,
        ribbonWidthMax: 25,
        pointCount: 320,
        tangleScale: .68,
        loopCount: 3,
        ballCount: 165,
        ballMin: 24,
        ballMax: 64,
        ctaBlocksBalls: !0,
        ctaScale: .076,
        ctaPadX: 52,
        ctaPadY: 44,
        ctaCollisionPad: 28
    };
    return {
        name: "desktop",
        filmCount: TOTAL_FILMS,
        safeMarginX: .12,
        safeMarginY: .18,
        circleScale: .58,
        minBoxSize: 32,
        maxBoxSize: 145,
        edgePad: 28,
        boxPadY: 54,
        boxGap: 58,
        circleClearance: 76,
        ribbonWidthMin: 24,
        ribbonWidthMax: 34,
        pointCount: 420,
        tangleScale: 1,
        loopCount: 5,
        ballCount: 185,
        ballMin: 30,
        ballMax: 80,
        ctaBlocksBalls: !0,
        ctaScale: .085,
        ctaPadX: 72,
        ctaPadY: 58,
        ctaCollisionPad: 80
    };
}

function calculateSafeZone() {
    layoutProfile = getResponsiveLayoutProfile(), safeMarginX = layoutProfile.safeMarginX * windowWidth, 
    safeMarginY = layoutProfile.safeMarginY * windowHeight, safeW = width - 2 * safeMarginX, 
    safeH = height - 2 * safeMarginY, cx = width / 2, cy = height / 2;
    const t = document.querySelector(".header-bg-bar"), e = document.querySelector(".footer-bg-bar");
    headerBottom = t ? t.getBoundingClientRect().bottom : 0, footerTop = e ? e.getBoundingClientRect().top : height, 
    circleR = layoutProfile.circleScale * min(safeW, safeH), emptyRadius = .62 * circleR;
    const o = (max(120, footerTop - headerBottom - 2 * layoutProfile.boxPadY) - 84) / (3 * 1.1), i = (width - 6 * layoutProfile.edgePad) / 2.64;
    baseBoxSize = constrain(min(.25 * min(safeW, safeH), o, i), layoutProfile.minBoxSize, layoutProfile.maxBoxSize);
}

function generateScene() {
    films = [], boxes = [], randomSeed(260);
    for (let t = 0; t < layoutProfile.filmCount; t++) {
        const e = new RollFilm(t);
        films.push(e), boxes.push(new DragBox(t, e));
    }
    resolveBoxHomePositions();
}

function resolveBoxHomePositions() {
    for (let t = 0; t < 18; t++) {
        let t = !1;
        for (let e = 0; e < boxes.length; e++) {
            const o = boxes[e];
            if (o.homePos) for (let i = e + 1; i < boxes.length; i++) {
                const e = boxes[i];
                if (!e.homePos) continue;
                const s = 1.1 * (o.w + e.w) / 2 + layoutProfile.boxGap, n = 1.1 * (o.h + e.h) / 2 + layoutProfile.boxGap, r = e.homePos.x - o.homePos.x, a = e.homePos.y - o.homePos.y;
                if (abs(r) >= s || abs(a) >= n) continue;
                const c = s - abs(r), l = n - abs(a);
                if (c < l) {
                    const t = r < 0 ? -1 : 1;
                    o.homePos.x -= t * c * .5, e.homePos.x += t * c * .5;
                } else {
                    const t = a < 0 ? -1 : 1;
                    o.homePos.y -= t * l * .5, e.homePos.y += t * l * .5;
                }
                o.homePos = o.keepInsideBoxArea(o.homePos), e.homePos = e.keepInsideBoxArea(e.homePos), 
                t = !0;
            }
        }
        if (!t) break;
    }
    for (const t of boxes) t.startPos = t.getIntroStartPosition(), t.placedOnCircle || t.dragging || (t.x = t.startPos.x, 
    t.y = t.startPos.y);
}

function updateCircle() {
    boxes.filter(t => t.placedOnCircle).length >= layoutProfile.filmCount && (allDone = !0), allDone && (circleSpin += map(circleVanish, 0, 1, .035, .11), 
    circleVanish >= .84 && fadeOutAmbienceSound(), 
    circleVanish = constrain(circleVanish + .0048, 0, 1), circleVanish >= 1 && (stopPhenakistoscopeLoop(), 
    loopFade = max(0, loopFade - .01)));
}

function playOneShot(t, e = 1) {
    if (soundMuted) return;
    t && t.isLoaded && t.isLoaded() && (t.isPlaying && t.isPlaying() && t.stop(), 
    t.setVolume(e), t.play());
}

function playFadedOneShot(t, e = 1, o = .06, i = .18) {
    if (soundMuted || !t || !t.isLoaded || !t.isLoaded()) return;
    t.isPlaying && t.isPlaying() && t.stop(), t.setVolume(0), t.play(), t.fade(e, o);
    const s = t.duration && t.duration() ? max(0, t.duration() - i) : .55;
    setTimeout(() => {
        t && t.isPlaying && t.isPlaying() && t.fade(0, i);
    }, 1e3 * s);
}

function playBoxSound(t = .24) {
    if (soundMuted || !boxSound || !boxSound.isLoaded || !boxSound.isLoaded() || frameCount - lastBoxSoundFrame < 4) return;
    lastBoxSoundFrame = frameCount, boxSound.play(0, random(.96, 1.05), t);
}

function startAmbienceSound() {
    if (soundMuted || !ambienceSound || !ambienceSound.isLoaded || !ambienceSound.isLoaded() || ambienceSoundStarted) return;
    ambienceSound.setLoop(!0), ambienceSound.setVolume(0), ambienceSound.loop(), ambienceSound.fade(.28, 1.5), 
    ambienceSoundStarted = !0, ambienceSoundFadingOut = !1;
}

function startTunnelSound() {
    if (soundMuted || !tunnelSound || !tunnelSound.isLoaded || !tunnelSound.isLoaded() || tunnelSoundStarted) return;
    tunnelSound.setLoop(!0), tunnelSound.setVolume(0), tunnelSound.loop(), tunnelSound.fade(.32, .65), 
    tunnelSoundStarted = !0;
}

function stopTunnelSound() {
    if (!tunnelSoundStarted) return;
    tunnelSoundStarted = !1, tunnelSound && tunnelSound.isPlaying && tunnelSound.isPlaying() && (tunnelSound.fade(0, .35), 
    setTimeout(() => {
        tunnelSound && tunnelSound.isPlaying && tunnelSound.isPlaying() && tunnelSound.stop();
    }, 380));
}

function fadeOutAmbienceSound() {
    if (!ambienceSound || !ambienceSoundStarted || ambienceSoundFadingOut) return;
    ambienceSoundFadingOut = !0, ambienceSound.fade(0, 2), setTimeout(() => {
        ambienceSound && ambienceSound.isPlaying && ambienceSound.isPlaying() && ambienceSound.stop();
        ambienceSoundStarted = !1;
    }, 2100);
}

function schedulePhenakistoscopeLoop() {
    phenakistoscopeLoopActive || (phenakistoscopeLoopStartTime = millis() + 260);
}

function updatePhenakistoscopeLoop(t, e = !0) {
    if (!t) return void stopPhenakistoscopeLoop();
    if (!e) return void (phenakistoscopeLoopActive && stopPhenakistoscopeLoop());
    phenakistoscopeLoopStartTime && millis() >= phenakistoscopeLoopStartTime && startPhenakistoscopeLoop();
}

function startPhenakistoscopeLoop() {
    if (soundMuted || !phenakistoscopeSound || !phenakistoscopeSound.isLoaded || !phenakistoscopeSound.isLoaded()) return;
    phenakistoscopeLoopStopTimeout && clearTimeout(phenakistoscopeLoopStopTimeout), phenakistoscopeLoopStopTimeout = null;
    phenakistoscopeLoopStartTime = 0, phenakistoscopeLoopActive = !0, phenakistoscopeSound.isPlaying && phenakistoscopeSound.isPlaying() || (phenakistoscopeSound.setLoop(!0), 
    phenakistoscopeSound.setVolume(0), phenakistoscopeSound.loop(), phenakistoscopeSound.fade(.16, .45));
}

function stopPhenakistoscopeLoop() {
    phenakistoscopeLoopStartTime = 0;
    if (!phenakistoscopeSound || !phenakistoscopeSound.isPlaying || !phenakistoscopeSound.isPlaying()) return void (phenakistoscopeLoopActive = !1);
    phenakistoscopeLoopActive = !1, phenakistoscopeSound.fade(0, .22), phenakistoscopeLoopStopTimeout = setTimeout(() => {
        phenakistoscopeSound && phenakistoscopeSound.isPlaying && phenakistoscopeSound.isPlaying() && phenakistoscopeSound.stop();
        phenakistoscopeLoopStopTimeout = null;
    }, 240);
}

function updateScopeSwallowSpin() {
    let t = 0;
    for (const e of placementBursts) {
        const o = 1.5 * (frameCount - e.start - 34), i = constrain(o / 95, 0, 1), s = constrain((o - 95) / 560, 0, 1);
        if (o <= 0 || s >= 1) continue;
        const n = easeOutCubic(i), r = 1 - easeInOutCubic(constrain((s - .72) / .28, 0, 1));
        t = max(t, n * r);
    }
    circleVanish < 1 && (scopeSwallowSpin += .024 * t);
}

function drawCenterCircle() {
    if (circleVanish >= 1) return;
    boxes.filter(t => t.placedOnCircle).length;
    const t = easeInOutCubic(circleVanish), e = 1 + .015 * sin(.05 * frameCount) * t, o = lerp(1, 5.8, t) * e, i = introDone ? 1 : easeOutCubic(introProgress), s = circleR;
    push(), translate(cx, cy), rotate(circleSpin + scopeSwallowSpin), scale(o * i), 
    drawSpiralPhenakistoscope(s), drawPlacementBursts(s), pop();
}

function drawIntroNotice() {
    const t = document.querySelector(".intro-notice");
    if (!t) return;
    const e = !introNoticeDismissed && !allDone && circleVanish <= 0 && !boxes.some(t => t.placedOnCircle), o = e ? easeOutCubic(constrain((introProgress - .25) / .75, 0, 1)) : 0;
    t.style.setProperty("--notice-opacity", o), t.classList.toggle("is-active", o > 0);
}

function drawTunnelTransitionOverlay() {
    if (!allDone) return;
    const t = easeInOutCubic(constrain((circleVanish - .84) / .16, 0, 1));
    if (t <= 0) return;
    const e = 1.55 * max(width, height), o = 1.4 * t + 8e-4 * frameCount, i = color("#F0374D"), s = color("#C91F37");
    push(), translate(cx, cy), drawingContext.save(), drawingContext.globalAlpha = t, 
    rotate(8e-4 * frameCount + .035 * o), scale(lerp(.72, 1, t)), drawExplosionTunnelScene(e, 0, o, i, s), 
    drawingContext.restore(), pop();
}

function drawSpiralPhenakistoscope(t) {
    const e = [ "#F0374D", "#F3868D", "#C91F37" ], o = .56 * t;
    noStroke(), drawPhenakistoscopeBorder(t), drawMonochromeRingBackground(t), drawOuterLoopAnimationRing(t), 
    push();
    for (let t = 0; t < 30; t++) {
        const i = map(t, 0, 30, 0, o), s = map(t + 1, 0, 30, 0, o), n = .5 * (i + s) / o;
        for (let t = 0; t < 72; t++) {
            const o = t * TWO_PI / 72, r = (t + 1) * TWO_PI / 72 + .002, a = 1.05 * o + pow(n, .72) * TWO_PI * 3.15;
            fill(e[floor((a % TWO_PI + TWO_PI) % TWO_PI / TWO_PI * e.length)]), beginShape(), 
            vertex(cos(o) * i, sin(o) * i), vertex(cos(r) * i, sin(r) * i), vertex(cos(r) * s, sin(r) * s), 
            vertex(cos(o) * s, sin(o) * s), endShape(CLOSE);
        }
    }
    pop(), drawRingSeparator(t), noStroke(), fill("#7A0012"), circle(0, 0, .035 * t);
}

function drawOuterLoopAnimationRing(t, e = 1) {
    const o = getCurrentLoopBurst(), i = .73 * t, s = .3 * t;
    push(), drawingContext.save(), drawingContext.globalAlpha = e, rotate(.004 * -frameCount), 
    drawRingGrid(8, i, s, "#F0374D", "#C91F37", !1, !0), noStroke(), fill("#F0374D"), 
    circle(0, 0, 2 * i - s), o && (drawingContext.save(), drawingContext.globalAlpha *= o.loopAlpha, 
    drawRingInSlices(o.label - 1, 8, i, s, 1, o.swallow), drawingContext.restore()), 
    drawingContext.restore(), pop();
}

function getCurrentLoopBurst() {
    for (let t = placementBursts.length - 1; t >= 0; t--) {
        const e = placementBursts[t], o = 1.5 * (frameCount - e.start - 34);
        if (o < 0) continue;
        const s = constrain(o / 95, 0, 1), i = constrain((o - 95) / 560, 0, 1), n = easeOutCubic(s) * (1 - easeInOutCubic(constrain((i - .72) / .28, 0, 1)));
        if (i < 1) return {
            ...e,
            swallow: i,
            loopAlpha: n
        };
    }
    return null;
}

function drawRingSeparator(t) {
    const e = .56 * t, o = .045 * t, i = e + .5 * o, s = e - .5 * o;
    noStroke();
    for (let t = 0; t < 56; t++) {
        const e = t * TWO_PI / 56, o = (t + 1) * TWO_PI / 56 + .006;
        fill(t % 2 == 0 ? "#F0374D" : "#C91F37"), beginShape(), vertex(cos(e) * s, sin(e) * s), 
        vertex(cos(e) * i, sin(e) * i), vertex(cos(o) * i, sin(o) * i), vertex(cos(o) * s, sin(o) * s), 
        endShape(CLOSE);
    }
}

function drawMonochromeRingBackground(t) {
    push(), rotate(.003 * -frameCount), noStroke();
    for (let e = 0; e < 64; e++) fill(e % 2 == 0 ? "#F0374D" : "#C91F37"), arc(0, 0, 1.78 * t, 1.78 * t, e * TWO_PI / 64, (e + 1) * TWO_PI / 64 + .01, PIE);
    fill("#F0374D"), circle(0, 0, 1.62 * t), noFill(), stroke("#C91F37"), strokeWeight(2);
    for (let e = 0; e < 5; e++) {
        const o = map(e, 0, 4, .28 * t, .82 * t);
        circle(0, 0, 2 * o + 3 * sin(.021 * frameCount + .52 * e));
    }
    pop(), noStroke();
}

function drawPhenakistoscopeBorder(t) {
    const e = .98 * t;
    noStroke();
    for (let t = 0; t < 56; t++) fill(t % 2 == 0 ? "#F0374D" : "#F3868D"), arc(0, 0, 2 * e, 2 * e, t * TWO_PI / 56, (t + 1) * TWO_PI / 56 + .006, PIE);
}

function drawDiskBase(t) {
    push(), rotate(.002 * -frameCount);
    for (let e = 0; e < 64; e++) fill(e % 2 == 0 ? "#F0374D" : "#F3868D"), arc(0, 0, 2 * t, 2 * t, e * TWO_PI / 64, (e + 1) * TWO_PI / 64 + .01, PIE);
    pop(), fill("#FAFAFA"), circle(0, 0, 1.9 * t), noFill(), stroke("#C91F37"), strokeWeight(2);
    for (let e = 0; e < 5; e++) {
        const o = map(e, 0, 4, .28 * t, .82 * t);
        circle(0, 0, 2 * o + 3 * sin(.021 * frameCount + .52 * e));
    }
    noStroke();
}

function drawRingGrid(t, e, o, i, s, n = !1, r = !0) {
    const a = TWO_PI / t, c = 2 * e + o, l = 2 * e - o;
    noStroke();
    for (let e = 0; e < t; e++) fill(n ? e % 2 == 0 ? "#F0374D" : "#F3868D" : e % 2 == 0 ? i : s), 
    arc(0, 0, c, c, e * a, (e + 1) * a + .01, PIE);
    if (fill("#FAFAFA"), circle(0, 0, l), r) {
        stroke("#F0374D"), strokeWeight(n ? 1.2 : 1);
        for (let i = 0; i < t; i++) push(), rotate(i * a), line(0, -e - .5 * o, 0, .5 * o - e), 
        pop();
    }
    n && (noFill(), stroke("#F0374D"), strokeWeight(1.5), circle(0, 0, c - 2), circle(0, 0, l + 2)), 
    noStroke();
}

function drawRingMotifs(t, e, o, i, s, n = 0) {
    const r = TWO_PI / t, a = o * s;
    for (let o = 0; o < t; o++) push(), rotate(o * r + r / 2 + n), translate(0, -e), 
    rotate(frameCount * i * .03 + .3 * o), fill(o % 2 == 0 ? "#F3868D" : "#C91F37"), 
    ellipse(0, 0, .7 * a, .38 * a), fill("#F0374D"), circle(.12 * a, 0, .18 * a), pop();
}

function drawDynamicCenter(t) {
    push(), rotate(.021 * -frameCount);
    for (let e = 0; e < 18; e++) {
        push(), rotate(e * TWO_PI / 18);
        const o = .09 * t + sin(.07 * frameCount + .26 * e) * t * .01;
        stroke(e % 2 == 0 ? "#F3868D" : "#C91F37"), strokeWeight(2), line(0, .04 * -t, 0, -o), 
        pop();
    }
    noStroke(), rotate(.031 * frameCount);
    for (let e = 0; e < 6; e++) push(), rotate(e * TWO_PI / 6), translate(0, .11 * -t + 3 * sin(.052 * frameCount + .7 * e)), 
    fill("#F3868D"), circle(0, 0, .018 * t), pop();
    const e = 1 + .08 * sin(.061 * frameCount), o = 1 + .06 * sin(.038 * frameCount + .7);
    fill("#C91F37"), circle(0, 0, .11 * t * e), fill("#F3868D"), circle(0, 0, .05 * t * o), 
    fill("#FAFAFA"), circle(0, 0, .018 * t), pop();
}

function triggerPlacementBurst(t) {
    schedulePhenakistoscopeLoop();
    placementBursts.push({
        start: frameCount,
        baseAngle: -HALF_PI + t * TWO_PI / layoutProfile.filmCount,
        label: t + 1,
        soundPlayed: !1
    });
}

function drawPlacementBursts(t) {
    const e = [];
    let o = !1;
    for (const i of placementBursts) {
        const s = 1.5 * (frameCount - i.start - 34), n = constrain(s / 95, 0, 1), r = constrain((s - 95) / 560, 0, 1), a = easeInOutCubic(r), c = easeOutCubic(n) * (1 - easeInOutCubic(constrain((r - .72) / .28, 0, 1)));
        o = o || c > .05 && r < .72, r >= .18 && !i.soundPlayed && (playFadedOneShot(synthDownSound, .32, .08, .22), i.soundPlayed = !0);
        for (let e = 0; e < 7; e++) {
            const o = constrain(7 * n - e, 0, 1);
            if (o <= 0) continue;
            const s = 255 * pow(1 - r, .18) * easeOutCubic(o) * c, l = lerp(1.2 * baseBoxSize, .3 * baseBoxSize, a) * easeOutCubic(o) * .625 * .5, h = .92 * e + .018 * frameCount * 1.5, u = sin(.04 * frameCount + .75 * e) * t * .008 * (1 - r), d = lerp(.48 * t - e * t * .052 + u, .08 * t, a), p = i.baseAngle + h + a * TWO_PI * 2.4 * 1.5;
            if (push(), translate(cos(p) * d, sin(p) * d), rotate(p + .024 * frameCount + a * TWO_PI * 1.45 * 1.5), 
            tint(255, s), imageMode(CENTER), seqImages && seqImages[i.label - 1]) {
                const t = (floor(.12 * frameCount * 1.5 + e) % 8 + 8) % 8;
                let o = seqImages[i.label - 1][t], s = o.width / o.height, n = l, r = l;
                s > 1 ? r = l / s : n = l * s, image(o, 0, 0, n, r);
            }
            pop();
        }
        r < 1 && e.push(i);
    }
    placementBursts = e, updatePhenakistoscopeLoop(placementBursts.length > 0, o);
}

function drawRingInSlices(t, e, o, i, s, n) {
    const r = seqImages && seqImages[t] ? seqImages[t] : [], a = TWO_PI / e, c = .72 * i * (1 - .35 * n);
    for (let t = 0; t < e; t++) {
        const i = constrain(s * e - t, 0, 1);
        if (i <= 0) continue;
        const n = r[(floor(.07 * frameCount + t) % e + e) % e];
        if (push(), rotate(t * a + a / 2), translate(0, -o), rotate(-t * a - a / 2), n) {
            const e = n.width / n.height, o = 1.18 * c * (1 + .035 * sin(.09 * frameCount + .35 * t)) * easeOutCubic(i);
            imageMode(CENTER), image(n, 0, 0, o * e, o);
        }
        pop();
    }
}

function mousePressed() {
    unlockAudio(), startAmbienceSound();
    for (let t = boxes.length - 1; t >= 0; t--) if (!boxes[t].placedOnCircle && boxes[t].isMouseInside()) {
        introNoticeDismissed = !0, draggedBox = boxes[t], draggedBox.startDrag();
        break;
    }
}

function mouseDragged() {
    draggedBox && draggedBox.dragTo(mouseX, mouseY);
}

function mouseReleased() {
    draggedBox && (dist(draggedBox.x, draggedBox.y, cx, cy) < circleR ? (draggedBox.placeOnCircle(), 
    draggedBox.film.startPulling(), playFadedOneShot(putSound, .32, .04, .16), triggerPlacementBurst(draggedBox.index)) : (draggedBox.cancelDrag(), playFadedOneShot(synthSound, .65, .04, .16)), 
    draggedBox = null);
}

function mouseWheel(t) {
    if (!explosionPhase || explosionDone) return !0;
    const e = t.delta || 0;
    return tunnelScrollTarget = constrain(tunnelScrollTarget + 42e-5 * e, 0, 1), !1;
}

class DragBox {
    constructor(t, e) {
        this.index = t, this.film = e, this.w = baseBoxSize, this.h = baseBoxSize, this.homePos = this.getSpreadHomePosition(t), 
        this.startPos = this.getIntroStartPosition(), this.x = this.startPos.x, this.y = this.startPos.y, 
        this.dragging = !1, this.placedOnCircle = !1, this.offsetX = 0, this.offsetY = 0, 
        this.attachRatio = this.findVisibleAnchorRatio(), this.introStartFrame = frameCount + 30 + 10 * t;
    }
    getSpreadHomePosition(t) {
        return this.findResponsiveHomePosition(this.getTargetHomePosition(t));
    }
    getTargetHomePosition(t) {
        const e = this.getBoxBounds(), o = lerp(e.top, e.bottom, .24), i = lerp(e.top, e.bottom, .76), s = lerp(e.left, max(e.left, cx - circleR - layoutProfile.circleClearance - this.getBoxRadius(1.1)), .45), n = lerp(e.right, min(e.right, cx + circleR + layoutProfile.circleClearance + this.getBoxRadius(1.1)), .45);
        return [ createVector(s, o), createVector(n, o), createVector(n, i), createVector(s, i), createVector(cx, e.top) ][t];
    }
    findResponsiveHomePosition(t) {
        const e = this.getBoxBounds(), o = [ t.copy() ], i = constrain(floor(width / max(this.w + layoutProfile.boxGap, 96)), layoutProfile.filmCount, 12), s = constrain(floor((e.bottom - e.top) / max(this.h + layoutProfile.boxGap, 86)), 3, 9);
        for (let t = 0; t < s; t++) {
            const n = 1 === s ? (e.top + e.bottom) / 2 : lerp(e.top, e.bottom, t / (s - 1));
            for (let t = 0; t < i; t++) {
                const s = 1 === i ? (e.left + e.right) / 2 : lerp(e.left, e.right, t / (i - 1));
                o.push(createVector(s, n));
            }
        }
        let n = null, r = 1 / 0;
        for (const i of o) {
            const o = this.keepInsideBoxArea(i.copy());
            if (!this.isValidHomePosition(o)) continue;
            const s = dist(o.x, o.y, cx, cy) - (circleR + this.getBoxRadius(1.1) + layoutProfile.circleClearance), a = min(o.y - e.top, e.bottom - o.y), c = this.getNearestBoxGap(o), l = abs(o.x - cx) < circleR + layoutProfile.circleClearance ? 180 : 0, h = dist(o.x, o.y, t.x, t.y) + l - .45 * min(s, 180) - .25 * min(a, 120) - .55 * min(c, 160);
            h < r && (n = o, r = h);
        }
        return n || this.findLeastCrowdedHomePosition(o, t);
    }
    findClosestFilmPoint(t) {
        return this.findBestPoint(t, 4, t => t.x > safeMarginX + 20 && t.x < width - safeMarginX - 20 && t.y > headerBottom + layoutProfile.boxPadY + this.h / 2 && t.y < footerTop - layoutProfile.boxPadY - this.h / 2 && dist(t.x, t.y, cx, cy) > circleR + this.getBoxRadius() + layoutProfile.circleClearance).copy();
    }
    findVisibleAnchorRatio() {
        return this.findBestPoint(this.homePos, 3).id / (this.film.points.length - 1);
    }
    findBestPoint(t, e, o = () => !0) {
        let i = this.film.points[0], s = 0, n = 1 / 0;
        for (let r = 0; r < this.film.points.length; r += e) {
            const e = this.film.points[r], a = dist(t.x, t.y, e.x, e.y);
            o(e) && a < n && (i = e, s = r, n = a);
        }
        return i.id = s, i;
    }
    update() {
        if (this.dragging) return;
        if (this.placedOnCircle) return this.updatePlacedPosition();
        const t = easeOutCubic(constrain((frameCount - this.introStartFrame) / 24, 0, 1));
        this.x = lerp(this.startPos.x, this.homePos.x, t), this.y = lerp(this.startPos.y, this.homePos.y, t);
    }
    keepOffCircle(t) {
        const e = circleR + this.getBoxRadius(1.1) + layoutProfile.circleClearance, o = dist(t.x, t.y, cx, cy);
        if (o >= e || 0 === o) return t;
        const i = atan2(t.y - cy, t.x - cx);
        return createVector(cx + cos(i) * e, cy + sin(i) * e);
    }
    getBoxRadius(t = 1) {
        return sqrt(this.w * this.w + this.h * this.h) * t / 2;
    }
    getBoxBounds(t = 1.1) {
        const e = this.w * t / 2, o = this.h * t / 2, i = e + layoutProfile.edgePad, s = max(i, width - e - layoutProfile.edgePad), n = headerBottom + layoutProfile.boxPadY + o;
        return {
            left: i,
            right: s,
            top: n,
            bottom: max(n, footerTop - layoutProfile.boxPadY - o)
        };
    }
    keepInsideBoxArea(t) {
        const e = this.getBoxBounds();
        return t.x = constrain(t.x, e.left, e.right), t.y = constrain(t.y, e.top, e.bottom), 
        (t = this.keepOffCircle(t)).x = constrain(t.x, e.left, e.right), t.y = constrain(t.y, e.top, e.bottom), 
        t;
    }
    keepInsideDragArea(t) {
        const e = this.getBoxBounds();
        return t.x = constrain(t.x, e.left, e.right), t.y = constrain(t.y, e.top, e.bottom), 
        t;
    }
    isValidHomePosition(t) {
        if (dist(t.x, t.y, cx, cy) < circleR + this.getBoxRadius(1.1) + layoutProfile.circleClearance) return !1;
        for (const e of boxes) {
            if (!e.homePos) continue;
            const o = 1.1 * (this.w + e.w) / 2 + layoutProfile.boxGap, i = 1.1 * (this.h + e.h) / 2 + layoutProfile.boxGap;
            if (abs(t.x - e.homePos.x) < o && abs(t.y - e.homePos.y) < i) return !1;
        }
        return !0;
    }
    getNearestBoxGap(t) {
        let e = 1 / 0;
        for (const o of boxes) {
            if (!o.homePos) continue;
            const i = 1.1 * (this.w + o.w) / 2 + layoutProfile.boxGap, s = 1.1 * (this.h + o.h) / 2 + layoutProfile.boxGap, n = abs(t.x - o.homePos.x) - i, r = abs(t.y - o.homePos.y) - s;
            e = min(e, min(n, r));
        }
        return e === 1 / 0 ? 240 : e;
    }
    findLeastCrowdedHomePosition(t, e) {
        let o = this.keepInsideBoxArea(e.copy()), i = -1 / 0;
        for (const s of t) {
            const t = this.keepAwayFromOtherBoxes(this.keepInsideBoxArea(s.copy())), n = 1.4 * (dist(t.x, t.y, cx, cy) - (circleR + this.getBoxRadius(1.1) + layoutProfile.circleClearance)) + this.getNearestBoxGap(t) - .25 * dist(t.x, t.y, e.x, e.y);
            n > i && (o = t, i = n);
        }
        return this.keepInsideBoxArea(o);
    }
    keepAwayFromOtherBoxes(t) {
        let e = t.copy();
        for (let t = 0; t < 8; t++) {
            let t = !1;
            for (const o of boxes) {
                if (!o.homePos) continue;
                const i = 1.1 * (this.w + o.w) / 2 + layoutProfile.boxGap, s = 1.1 * (this.h + o.h) / 2 + layoutProfile.boxGap, n = e.x - o.homePos.x, r = e.y - o.homePos.y;
                abs(n) >= i || abs(r) >= s || (i - abs(n) < s - abs(r) ? e.x = o.homePos.x + (n < 0 ? -i : i) : e.y = o.homePos.y + (r < 0 ? -s : s), 
                e = this.keepInsideBoxArea(e), t = !0);
            }
            if (!t) break;
        }
        return e;
    }
    updatePlacedPosition() {
        const t = -HALF_PI + this.index * TWO_PI / layoutProfile.filmCount + circleSpin + scopeSwallowSpin, e = lerp(.78 * circleR, 0, easeInOutCubic(circleVanish));
        this.x = cx + cos(t) * e, this.y = cy + sin(t) * e;
    }
    startDrag() {
        this.dragging = !0, this.offsetX = this.x - mouseX, this.offsetY = this.y - mouseY, dragSound && dragSound.play();
    }
    dragTo(t, e) {
        this.x = t + this.offsetX, this.y = e + this.offsetY;
        const o = this.keepInsideDragArea(createVector(this.x, this.y));
        this.x = o.x, this.y = o.y;
    }
    getIntroStartPosition() {
        const t = p5.Vector.sub(this.homePos, createVector(cx, cy)).normalize(), e = .85 * max(width, height);
        return createVector(cx, cy).add(t.mult(e));
    }
    cancelDrag() {
        this.dragging = !1;
    }
    placeOnCircle() {
        this.dragging = !1, this.placedOnCircle = !0, this.updatePlacedPosition();
    }
    display() {
        if (this.placedOnCircle) return;
        const t = easeOutCubic(constrain((frameCount - this.introStartFrame) / 24, 0, 1)), e = lerp(.4, 1, t);
        push(), translate(this.x, this.y), scale(e), noStroke(), fill(20, 120), circle(0, 0, 6), 
        imageMode(CENTER);
        let o = floor(frameCount / 14) % 8, i = seqImages && seqImages[this.index] && seqImages[this.index][o] ? seqImages[this.index][o] : null, h = boxBgImages && boxBgImages[o] ? boxBgImages[o] : null;
        const s = this.w, n = this.h;
        let r = .714 * s, a = 1.36 * n;
        if (i) {
            let t = i.width / i.height;
            t > 1 ? a = r / t : r = a * t;
            const e = [ .58, .58, 1, 1, .58 ][this.index] || 1;
            r *= e, a *= e;
        }
        this.isMouseInside() || this.dragging ? (push(), scale(1.1), this.drawBoxFrame(0, 0, s, n, h), 
        i && image(i, 0, 0, r, a), pop()) : (this.drawBoxFrame(0, 0, s, n, h), i && image(i, 0, 0, r, a)), 
        pop();
    }
    drawBoxFrame(t, e, o, i, h = null) {
        rectMode(CENTER), noStroke();
        if (h) {
            const s = h.width / h.height;
            let n = 1.42 * o, r = n / s;
            r > .9 * i && (r = .9 * i, n = r * s), image(h, t, e, n, r);
        } else fill(BOX_BG), rect(t, e, o, i, min(22, .14 * o));
    }
    isMouseInside() {
        return abs(mouseX - this.x) <= this.w / 2 && abs(mouseY - this.y) <= this.h / 2;
    }
}

class RollFilm {
    constructor(t) {
        this.index = t, this.points = [], this.relaxedPoints = [], this.currentPoints = [], 
        this.pullProgress = .1, this.spawnProgress = .1 * -t, this.isPulling = !1, this.isGone = !1, 
        this.ribbonWidth = random(layoutProfile.ribbonWidthMin, layoutProfile.ribbonWidthMax), this.pointCount = layoutProfile.pointCount, this.margin = 8 + 18 * t, 
        this.startT = [ .02, .18, .35, .56, .75 ][t], this.spanT = [ .82, .78, .8, .76, .82 ][t], 
        this.phaseA = random(TWO_PI), this.phaseB = random(TWO_PI), this.phaseC = random(TWO_PI), 
        this.phaseD = random(TWO_PI), this.pullDir = [ createVector(0, -1), createVector(1, 0), createVector(0, 1), createVector(-1, 0), createVector(1, -.45).normalize() ][t], 
        this.loopCenters = [ random(.06, .16), random(.21, .32), random(.37, .5), random(.55, .68), random(.73, .9) ].slice(0, layoutProfile.loopCount), 
        this.buildPath(), this.currentPoints = this.points.map(t => t.copy());
    }
    startPulling() {
        this.isPulling = !0;
    }
    update() {
        this.isGone || (this.spawnProgress < 1 && (this.spawnProgress += .0055), this.isPulling && (this.pullProgress += .014), 
        this.pullProgress >= 1.45 && (this.isGone = !0));
    }
    display() {
        this.isGone || (this.currentPoints = this.getCurrentPoints(), this.drawFilmBand(this.currentPoints));
    }
    getCurrentPoints() {
        const t = [], e = easeInOutCubic(constrain(this.pullProgress, 0, 1)), o = p5.Vector.mult(this.pullDir, 2.8 * max(width, height) * max(0, this.pullProgress - 1)), i = this.points[0].copy(), s = p5.Vector.add(i, p5.Vector.mult(this.pullDir, 2.2 * max(width, height))), n = p5.Vector.lerp(i, s, e);
        for (let i = 0; i < this.pointCount; i++) {
            const s = i / (this.pointCount - 1), r = this.points[i], a = this.relaxedPoints[i], c = this.getStraightPointBehindHead(s, n, e), l = easeInOutCubic(constrain((e - .78 * s) / .22, 0, 1));
            t.push(p5.Vector.add(p5.Vector.lerp(p5.Vector.lerp(r, a, .45 * e), c, l), o));
        }
        return t;
    }
    getPointAt(t) {
        const e = this.currentPoints.length ? this.currentPoints : this.points;
        return e[floor(constrain(t, 0, 1) * (e.length - 1))].copy();
    }
    getStraightPointBehindHead(t, e, o) {
        const i = lerp(4.5, 11.5, o);
        return p5.Vector.add(e, p5.Vector.mult(this.pullDir, -t * this.pointCount * i));
    }
    buildPath() {
        for (let t = 0; t < this.pointCount; t++) {
            const e = t / (this.pointCount - 1), o = this.getCleanPathPoint(e);
            this.points.push(this.getTangledPoint(o, e)), this.relaxedPoints.push(o);
        }
    }
    getCleanPathPoint(t) {
        return this.getPerimeterPoint((this.startT + t * this.spanT) % 1, this.margin);
    }
    getPerimeterPoint(t, e) {
        const o = t % 1 * TWO_PI - HALF_PI, i = width / 2 - e, s = height / 2 - e, n = cos(o) < 0 ? -1 : 1, r = sin(o) < 0 ? -1 : 1;
        return createVector(width / 2 + n * pow(abs(cos(o)), 2 / 3.4) * i, height / 2 + r * pow(abs(sin(o)), 2 / 3.4) * s);
    }
    getPerimeterTangent(t, e) {
        const o = this.getPerimeterPoint(t - .002, e), i = this.getPerimeterPoint(t + .002, e);
        return p5.Vector.sub(i, o).normalize();
    }
    getBurst(t) {
        return constrain(this.loopCenters.reduce((e, o) => {
            const i = min(abs(t - o), 1 - abs(t - o));
            return e + exp(-pow(22 * i, 2));
        }, 0), 0, 2.7);
    }
    getTangledPoint(t, e) {
        const o = (this.startT + e * this.spanT) % 1, i = this.getPerimeterTangent(o, this.margin), s = createVector(-i.y, i.x), n = createVector(cx, cy), r = p5.Vector.sub(n, t).normalize(), a = this.getBurst(e);
        let c = t.copy();
        const f = layoutProfile.tangleScale, l = f * (sin(e * TWO_PI * (2.2 + .12 * this.index) + this.phaseA) * (145 + 12 * this.index) + 78 * sin(e * TWO_PI * (4.8 + .2 * this.index) + this.phaseB) + 42 * cos(e * TWO_PI * (7.2 + .15 * this.index) + this.phaseC)), h = f * (sin(e * TWO_PI * (12.5 + .45 * this.index) + this.phaseB) * (54 + 78 * a) + cos(e * TWO_PI * (18 + .35 * this.index) + this.phaseD) * (34 + 54 * a)), u = f * (34 + 44 * a) * (.55 + .45 * sin(e * TWO_PI * 7.5 + this.phaseC)), d = f * (3 * sin(e * TWO_PI * 28 + this.phaseA) + 2 * cos(e * TWO_PI * 33 + this.phaseD)), p = f * (3 * cos(e * TWO_PI * 26 + this.phaseB) + 2 * sin(e * TWO_PI * 30 + this.phaseC)), g = pow(abs(sin(o * TWO_PI * 2)), 7);
        return c.add(s.copy().mult(l + p)), c.add(i.copy().mult(h + d)), c.add(r.copy().mult(u)), 
        c.add(i.copy().mult(12 * sin(e * TWO_PI * 35 + this.phaseA) * g)), c.add(s.copy().mult(10 * cos(e * TWO_PI * 31 + this.phaseB) * g)), 
        this.keepFilmOutOfProtectedAreas(c);
    }
    keepFilmOutOfProtectedAreas(t) {
        t = this.pushOutOfCircle(t, createVector(cx, cy), circleR + .75 * this.ribbonWidth + 10);
        for (const e of boxes) t = this.pushOutOfBox(t, e.homePos || createVector(e.x, e.y), .75 * e.w + this.ribbonWidth, .75 * e.h + this.ribbonWidth);
        return t.x = constrain(t.x, 6, width - 6), t.y = constrain(t.y, 6, height - 6), 
        t;
    }
    pushOutOfCircle(t, e, o) {
        const i = p5.Vector.dist(t, e);
        return i >= o || 0 === i ? t : p5.Vector.add(e, p5.Vector.sub(t, e).normalize().mult(o));
    }
    pushOutOfBox(t, e, o, i) {
        const s = t.x - e.x, n = t.y - e.y;
        return abs(s) > o || abs(n) > i || (o - abs(s) < i - abs(n) ? t.x = e.x + (s < 0 ? -o : o) : t.y = e.y + (n < 0 ? -i : i)), 
        t;
    }
    drawFilmBand(t) {
        t = (t = this.getSmoothRibbonPoints(t)).map(t => this.keepFilmOutOfProtectedAreas(t)), 
        t = this.getSmoothRibbonPoints(t).map(t => this.keepFilmOutOfProtectedAreas(t)), 
        t = this.getSmoothRibbonPoints(t).map(t => this.keepFilmOutOfProtectedAreas(t)), 
        t = this.getWiggledRibbonPoints(t), t = this.getSmoothRibbonPoints(t);
        const e = easeOutCubic(constrain(this.spawnProgress, 0, 1)), o = (t.length - 1) * e;
        noStroke();
        for (let e = 0; e < t.length - 1; e++) {
            const i = constrain(o - e, 0, 14) / 14;
            if (i <= 0) break;
            const s = t[e], n = t[e + 1], r = this.getSmoothAngle(t, e) + HALF_PI, a = this.getSmoothAngle(t, e + 1) + HALF_PI, c = noise(7 * this.index + .18 * e, .02 * frameCount), l = noise(7 * this.index + .18 * (e + 1), .02 * frameCount), h = this.ribbonWidth * map(c, 0, 1, .55, 1.25) * .5 * easeOutCubic(i), u = this.ribbonWidth * map(l, 0, 1, .55, 1.25) * .5 * easeOutCubic(i), d = color(floor(e / 6) % 2 == 0 ? "#F0374D" : "#C91F37");
            fill(red(d), green(d), blue(d), 255 * i), beginShape(), vertex(s.x + cos(r) * h, s.y + sin(r) * h), 
            vertex(s.x - cos(r) * h, s.y - sin(r) * h), vertex(n.x - cos(a) * u, n.y - sin(a) * u), 
            vertex(n.x + cos(a) * u, n.y + sin(a) * u), endShape(CLOSE);
        }
    }
    getSmoothRibbonPoints(t) {
        let e = t.map(t => t.copy());
        for (let t = 0; t < 3; t++) e = e.map((t, o) => {
            if (0 === o || o === e.length - 1) return t.copy();
            const i = e[o - 1], s = e[o + 1];
            return createVector(.25 * i.x + .5 * t.x + .25 * s.x, .25 * i.y + .5 * t.y + .25 * s.y);
        });
        return e;
    }
    getWiggledRibbonPoints(t) {
        return t.map((e, o) => {
            const i = this.getAngle(t, o) + HALF_PI, s = sin(.035 * frameCount + .12 * o + this.phaseD) * (2.2 + .25 * this.index);
            return this.keepFilmOutOfProtectedAreas(createVector(e.x + cos(i) * s, e.y + sin(i) * s));
        });
    }
    getAngle(t, e) {
        const o = t[max(0, e - 1)], i = t[min(t.length - 1, e + 1)];
        return atan2(i.y - o.y, i.x - o.x);
    }
    getSmoothAngle(t, e) {
        const o = t[max(0, e - 5)], i = t[min(t.length - 1, e + 5)];
        return atan2(i.y - o.y, i.x - o.x);
    }
}

class Ball {
    constructor() {
        this.r = map(pow(random(1), 2.5), 0, 1, layoutProfile.ballMin, layoutProfile.ballMax), this.img = this.getRandomImage(), 
        this.x = random(this.r, width - this.r), this.y = random(1.5 * -height, -100), this.vx = random(-.85, .85), 
        this.vy = random(1.2, 3.4), this.ay = .28, this.damping = .988, this.bounce = .72, this.beatScale = 1, 
        this.musicEnergy = 0, this.adviceActive = !1, this.adviceFrameProgress = random(8);
    }
    getRandomImage() {
        const t = seqImages.slice(0, layoutProfile.filmCount).flat().filter(Boolean);
        return t.length ? random(t) : null;
    }
    collide() {
        for (const t of balls) {
            const e = this.x - t.x, o = this.y - t.y, i = sqrt(e * e + o * o), s = this.r + t.r;
            if (t === this || i >= s || i <= 0) continue;
            const r = abs(this.vx - t.vx) + abs(this.vy - t.vy);
            const n = s - i;
            this.x += e / i * n * .5, this.y += o / i * n * .5, this.vx *= .9, this.vy *= .9;
        }
    }
    update() {
        if (this.collide(), layoutProfile.ctaBlocksBalls && this.collideRect(ctaBounds, layoutProfile.ctaCollisionPad), this.applyMousePush(), this.vy += this.ay, 
        this.x += this.vx, this.y += this.vy, this.vx *= this.damping, this.vy *= this.damping, 
        this.keepInsideBounds(), ctaSoundStarted && ctaAmplitudeAnalyzer) {
            const t = ctaAmplitudeAnalyzer.getLevel(), e = pow(constrain(t / .22, 0, 1), .75), o = constrain(1 + .35 * e, 1, 1.42);
            this.musicEnergy = lerp(this.musicEnergy, e, .18), this.beatScale = lerp(this.beatScale, o, .14);
        } else this.musicEnergy = lerp(this.musicEnergy, 0, .12), this.beatScale = lerp(this.beatScale, 1, .12);
        this.adviceActive && adviceFrameImages.length && (this.adviceFrameProgress = (this.adviceFrameProgress + lerp(.025, .14, this.musicEnergy)) % adviceFrameImages.length);
    }
    collideRect(t, e = 80) {
        if (t.w <= 0) return;
        const o = t.w / 2 + e, i = t.h / 2 + e, s = min(140, o - 1, i - 1), n = this.x - t.x, r = this.y - t.y, a = n < 0 ? -1 : 1, c = r < 0 ? -1 : 1, l = abs(n) - (o - s), h = abs(r) - (i - s), u = max(l, 0), d = max(h, 0), p = sqrt(u * u + d * d), g = p + min(max(l, h), 0) - s;
        return g > this.r ? void 0 : p > .001 ? this.bounceOff(a * u / p, c * d / p, this.r - g) : l > h ? this.bounceOff(a, 0, this.r - g) : void this.bounceOff(0, c, this.r - g);
    }
    bounceOff(t, e, o) {
        this.x += t * o, this.y += e * o;
        const i = this.vx * t + this.vy * e;
        i < 0 && (this.vx -= (1 + this.bounce) * i * t, this.vy -= (1 + this.bounce) * i * e);
    }
    applyMousePush() {
        const t = dist(mouseX, mouseY, this.x, this.y);
        if (t >= 90) return;
        const e = atan2(this.y - mouseY, this.x - mouseX), o = map(t, 0, 90, 2.8, 0);
        this.vx += cos(e) * o, this.vy += sin(e) * o;
    }
    keepInsideBounds() {
        this.x < this.r && (this.x = this.r, this.vx *= -this.bounce), this.x > width - this.r && (this.x = width - this.r, 
        this.vx *= -this.bounce), this.y > footerTop - this.r && (this.y = footerTop - this.r, 
        this.vy *= -this.bounce, this.vx *= .96);
    }
    display() {
        push();
        const t = this.beatScale;
        dist(mouseX, mouseY, this.x, this.y) <= this.r * t && !this.adviceActive && (this.adviceActive = !0, 
        playBoxSound(.24));
        const e = this.adviceActive && adviceFrameImages.length ? adviceFrameImages[floor(this.adviceFrameProgress) % adviceFrameImages.length] : this.img;
        if (e) {
            imageMode(CENTER);
            const o = 2 * this.r * t, i = e.width / e.height;
            let s = o, n = o;
            i > 1 ? n = o / i : s = o * i, image(e, this.x, this.y, s, n);
        } else noStroke(), fill(240, 55, 77, 150), circle(this.x, this.y, 2 * this.r * t);
        pop();
    }
}

function startBallPhase() {
    ballPhaseStarted || (ballPhaseStarted = !0, balls = Array.from({
        length: layoutProfile.ballCount
    }, () => new Ball));
}

function drawCTA() {
    ctaAlpha = min(ctaAlpha + 4, 255), ctaSoundStarted || !explosionDone || ctaSoundPending || (ctaSoundPending = !0, 
    ctaSoundStartTime = millis() + 2e3), !ctaSoundStarted && ctaSoundPending && millis() >= ctaSoundStartTime && startCTASound();
    let t = constrain(layoutProfile.ctaScale * min(safeW, safeH), 26, 88);
    const e = CTA_TEXT.split("\n");
    push(), textStyle(BOLD), textSize(t), textLeading(1.15 * t);
    const o = max(textWidth(e[0]), textWidth(e[1]));
    o + 2 * layoutProfile.ctaPadX > .88 * width && (t *= (.88 * width - 2 * layoutProfile.ctaPadX) / o, textSize(t), textLeading(1.15 * t)), ctaBounds = {
        x: width / 2,
        y: height / 2,
        w: min(width - 36, max(textWidth(e[0]), textWidth(e[1])) + 2 * layoutProfile.ctaPadX),
        h: 2.5 * t + layoutProfile.ctaPadY
    }, imageMode(CENTER), tint(255, ctaAlpha), ctaBgImage && image(ctaBgImage, ctaBounds.x, ctaBounds.y, ctaBounds.w, ctaBounds.h), 
    noTint(), textAlign(CENTER, CENTER), fill(255, ctaAlpha), noStroke(), text(CTA_TEXT, width / 2, height / 2), 
    pop();
}

function runExplosion() {
    startTunnelSound(), drawExplosion(), tunnelScrollProgress >= .995 && (stopTunnelSound(), explosionPhase = !1, explosionDone = !0, 
    startBallPhase());
}

function startCTASound() {
    !soundMuted && ctaSound && !ctaSoundStarted && ctaSound.isLoaded() && (ctaSound.setLoop(!0), ctaSound.setVolume(0), 
    ctaSound.loop(), ctaAmplitudeAnalyzer && (ctaAmplitudeAnalyzer.setInput(ctaSound), 
    ctaAmplitudeAnalyzer.smooth(.75)), ctaSoundStarted = !0, ctaSoundPending = !1, ctaSoundStartTime = 0, 
    ctaSound.fade(.38, 2));
}

function stopCTASound() {
    ctaSoundPending = !1, ctaSoundStartTime = 0, ctaSound && ctaSound.isPlaying() && (ctaSound.fade(0, 2), 
    setTimeout(() => {
        ctaSound && ctaSound.isPlaying() && ctaSound.stop();
    }, 2100));
}

function drawExplosion() {
    tunnelScrollProgress = lerp(tunnelScrollProgress, tunnelScrollTarget, .12);
    const t = constrain(tunnelScrollProgress, 0, 1), e = 1.55 * max(width, height), o = 8.4 * t + 8e-4 * frameCount, i = color("#F0374D"), s = color("#C91F37");
    t >= .86 && !explosionSoundPlayed && (playOneShot(explosionSound, .28), explosionSoundPlayed = !0);
    push(), translate(cx, cy), noStroke(), drawingContext.save(), drawingContext.globalCompositeOperation = "source-over", 
    rotate(8e-4 * frameCount + .035 * o), drawExplosionTunnelScene(e, t, o, i, s), drawingContext.restore(), 
    pop();
}

function drawExplosionTunnelScene(t, e, o, i, s) {
    noStroke(), fill(240, 55, 77, 255), rectMode(CENTER), rect(0, 0, 2.2 * width, 2.2 * height), 
    drawExplosionSpiralTunnel(t, e, o, i, s);
}

function drawExplosionSpiralTunnel(t, e, o, i, s) {
    const n = easeInOutCubic(constrain((e - .64) / .36, 0, 1)), r = min(width, height) * lerp(.035, .16, n), a = 245 * pow(1 - e, .12), c = color("#A3162B"), l = color("#FF7B89");
    noStroke(), fill(240, 55, 77, a), rectMode(CENTER), rect(0, 0, 2.2 * width, 2.2 * height);
    for (let e = 24; e >= 0; e--) {
        const h = e / 24, u = (e + 1) / 24, d = lerp(r, t, pow(h, 1.85)), p = lerp(r, t, pow(u, 1.85)), g = o * TWO_PI * .38 + h * TWO_PI * 3.65, m = o * TWO_PI * .38 + u * TWO_PI * 3.65;
        for (let t = 0; t < 30; t++) {
            const r = t * TWO_PI / 30, u = (t + 1.08) * TWO_PI / 30, f = sin(.62 * t + .78 * e + 2.4 * o), x = noise(.18 * t, .22 * e) > .3 ? 1 : .42, P = lerpColor(f > .18 ? l : f < -.38 ? c : s, i, .18 + .22 * h);
            fill(red(P), green(P), blue(P), a * x * lerp(1.15, .28, h) * lerp(1, 1.35, n)), 
            beginShape(), vertex(cos(r + g) * d, sin(r + g) * d), vertex(cos(u + g) * d, sin(u + g) * d), 
            vertex(cos(u + m) * p, sin(u + m) * p), vertex(cos(r + m) * p, sin(r + m) * p), 
            endShape(CLOSE);
        }
    }
    drawTunnelPhenakistoscopeRings(t, e, o, r);
    fill(122, 0, 18, 180 * pow(1 - e, .2)), circle(0, 0, .85 * r), n > 0 && (fill(255, 123, 137, 95 * n), 
    rectMode(CENTER), rect(0, 0, 2.2 * width, 2.2 * height), fill(255, 210, 214, 180 * n), 
    circle(0, 0, lerp(2.6 * r, 2.2 * t, n)));
}

function drawTunnelPhenakistoscopeRings(t, e, o, i) {
    const s = [ 2, 4, 3, 1, 0, 2, 4, 3, 1, 0 ], n = min(width, height), r = max(width, height);
    const a = s.map((t, a) => {
        const c = (a / s.length + .72 * e + .035 * o) % 1, l = pow(c, 1.72), h = pow(l, 1.25), u = lerp(max(1.15 * i, .075 * n), .82 * r, l), d = lerp(.01 * n, .26 * n, h), p = lerp(.032 * n, .34 * n, h), m = o + a * .68 + c * TWO_PI * 1.65;
        return {
            imageSet: t,
            radius: u,
            thickness: d,
            imageSize: p,
            spin: m,
            ringAlpha: 255,
            imageAlpha: 255,
            depth: l
        };
    }).sort((t, e) => t.depth - e.depth);
    for (const t of a) drawTunnelSequenceRing(t.imageSet, t.radius, t.thickness, t.imageSize, t.spin, t.ringAlpha, t.depth, t.imageAlpha);
}

function drawTunnelSequenceRing(t, e, o, i, s, n, r = 0, a = n) {
    const l = seqImages[t] || [];
    if (!l.length) return;
    const h = r > .55 ? 6 : 8, u = max(10, e - o), d = e + o;
    push(), rotate(s + .0035 * frameCount), imageMode(CENTER), noStroke();
    for (let t = 0; t < 72; t++) {
        const e = t * TWO_PI / 72, o = (t + 1) * TWO_PI / 72 + .006;
        fill(t % 2 == 0 ? "#F0374D" : "#C91F37"), beginShape(), vertex(cos(e) * u, sin(e) * u), 
        vertex(cos(o) * u, sin(o) * u), vertex(cos(o) * d, sin(o) * d), vertex(cos(e) * d, sin(e) * d), 
        endShape(CLOSE);
    }
    noFill(), stroke("#F3868D"), strokeWeight(max(1, .012 * o)), circle(0, 0, 2 * u), 
    stroke("#7A0012"), strokeWeight(max(1, .008 * o)), circle(0, 0, 2 * d);
    for (let t = 0; t < h; t++) {
        const n = (t + .5 * (r > .55 ? 1 : 0)) * TWO_PI / h, c = l[(floor(.09 * frameCount + t + 2 * r) % l.length + l.length) % l.length];
        push(), rotate(n), translate(0, -e), rotate(-n - s);
        if (c) {
            const e = c.width / c.height, o = i * (1 + .03 * sin(.08 * frameCount + t));
            image(c, 0, 0, o * e, o);
        }
        pop();
    }
    pop();
}

function drawExplosionGridTunnel(t, e, o, i, s) {
    const n = 245 * pow(1 - e, .12), r = easeInOutCubic(constrain((e - .58) / .42, 0, 1)), a = .16 * min(width, height), c = t, l = .025 * sin(.035 * frameCount + o * TWO_PI), h = (24 + 8 * sin(.04 * frameCount)) * r;
    drawingContext.shadowBlur = h, drawingContext.shadowColor = `rgba(240, 55, 77, ${.85 * r})`, 
    noFill(), strokeCap(SQUARE), strokeJoin(MITER);
    for (let t = 0; t < 2; t++) {
        const e = 0 === t;
        if (!(e && r <= .01)) {
            strokeWeight(e ? lerp(0, 11, r) : lerp(2.2, 4.2, r));
            for (let t = 18; t >= 0; t--) {
                const h = (t / 18 + .28 * o) % 1, u = pow(h, 1.95), d = lerp(a * (1 + l), c, u), p = n * lerp(1, .15, h) * (e ? .55 * r : lerp(.92, 1.45, r)), g = t % 5 == 0 ? s : i;
                stroke(red(g), green(g), blue(g), p), rect(0, 0, 2 * d, 2 * d);
            }
            for (let t = 0; t < 4; t++) for (let o = -8; o <= 8; o++) {
                const h = o / 8, u = 8 === abs(o) || 0 === o ? s : i;
                stroke(red(u), green(u), blue(u), n * (e ? .48 * r : lerp(.86, 1.35, r))), drawTunnelDepthLine(t, h, a * (1 + l), c);
            }
        }
    }
    drawingContext.shadowBlur = 0, fill(0, 0, 0, 220 * pow(1 - e, .2)), noStroke(), 
    rect(0, 0, 2.02 * a, 2.02 * a), noFill(), drawingContext.shadowBlur = 28 * r, drawingContext.shadowColor = `rgba(169, 240, 55, ${.9 * r})`, 
    stroke(red(s), green(s), blue(s), n * lerp(.95, 1.55, r)), strokeWeight(lerp(2.4, 5.5, r)), 
    rect(0, 0, 2.08 * a, 2.08 * a), drawingContext.shadowBlur = 0, r > 0 && (noStroke(), 
    fill(169, 240, 55, 55 * r), rect(0, 0, 2.2 * width, 2.2 * height), fill(240, 55, 77, 95 * r), 
    rect(0, 0, 2.45 * a, 2.45 * a));
}

function drawTunnelDepthLine(t, e, o, i) {
    const s = createTunnelPoint(t, e, o), n = createTunnelPoint(t, e, i);
    line(s.x, s.y, n.x, n.y);
}

function createTunnelPoint(t, e, o) {
    return 0 === t ? createVector(e * o, -o) : 1 === t ? createVector(o, e * o) : 2 === t ? createVector(e * o, o) : createVector(-o, e * o);
}

function drawExplosionGridSparks(t, e, o, i, s) {
    noStroke();
    for (let n = 0; n < 110; n++) {
        const r = 31.7 * n, a = floor(4 * noise(r, 1.4)), c = 2 * noise(r, 2.1) - 1, l = (noise(r, 3.2) + .4 * o) % 1, h = createTunnelPoint(a, c, lerp(.16 * min(width, height), t, pow(l, 1.9))), u = n % 4 == 0 ? s : i, d = lerp(2, 9, l) * pow(1 - e, .24);
        fill(red(u), green(u), blue(u), 185 * pow(1 - e, .35)), circle(h.x, h.y, d);
    }
}

function easeInOutCubic(t) {
    return t < .5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t) {
    return 1 - pow(1 - t, 3);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight), resetScene();
}

window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || data.type !== 'pageVisibility') return;
    if (data.isActive) {
        unlockAudio();
        ambienceSoundStarted = false;
        startAmbienceSound();
        triggerScene();
    } else {
        stopAllSounds();
        ambienceSoundStarted = false;
    }
});

let _scrollDelta = 0;
let _lastScrollTime = 0;

window.addEventListener('wheel', (e) => {
    if (!audioUnlocked) {
        unlockAudio();
        if (ambienceSound && ambienceSound.isLoaded && ambienceSound.isLoaded() &&
            (!ambienceSound.isPlaying || !ambienceSound.isPlaying())) {
            ambienceSoundStarted = false;
            startAmbienceSound();
        }
    }
    if (!explosionDone) return;
    const now = Date.now();
    if (now - _lastScrollTime < 1500) {
        _scrollDelta = 0;
        return;
    }
    _scrollDelta += e.deltaY;
    if (_scrollDelta > 120) {
        window.parent.postMessage('scrollDown', '*');
        _lastScrollTime = now;
        _scrollDelta = 0;
    } else if (_scrollDelta < 0) {
        _scrollDelta = 0;
    }
}, { passive: true });
