let TimeOfDayClickCount = 0;
const quanP5Instances = [];
let isSketchQuanActive = true;

window.setSketchQuanActive = function (isActive) {
	const shouldRun = Boolean(isActive);
	isSketchQuanActive = shouldRun;

	quanP5Instances.forEach(function (instance) {
		if (!instance) return;
		if (shouldRun && typeof instance.loop === "function") {
			instance.loop();
		} else if (!shouldRun && typeof instance.noLoop === "function") {
			instance.noLoop();
		}
	});
};

function registerQuanP5Instance(instance) {
	quanP5Instances.push(instance);

	if (!isSketchQuanActive && instance && typeof instance.noLoop === "function") {
		instance.noLoop();
	}

	return instance;
}

window.addEventListener("message", function (event) {
	const data = event.data;
	if (!data || data.type !== "pageVisibility") return;
	window.setSketchQuanActive(data.isActive);
});

window.TimeOfDayClickCount = TimeOfDayClickCount;
window.SelectedTimeOfDayIndex = 0;
let TimeOfDayAssetAnimationCount = 1;
window.TimeOfDayAssetAnimationCount = TimeOfDayAssetAnimationCount;
let ContentsClickCount = 0;
window.ContentsClickCount = ContentsClickCount;
let ContentPanelState = "Excitement";
window.ContentPanelState = ContentPanelState;
let DurationClickCount = 0;
window.DurationClickCount = DurationClickCount;

(function () {
	const sketch = function (p) {
		let asset13;
		let asset14;
		let asset1;
		let asset1Frames = [];
		let asset2;
		let durationAsset2;
		let contentsAsset1;
		let contentsAsset2;
		let underlyingAsset1;
		let underlyingAsset2;
		let underlyingAsset24;
		let underlyingAsset4;
		let underlyingAsset5;
		let underlyingAsset6;
		let underlyingAsset7;
		let underlyingAsset8;
		let underlyingAsset9;
		let timeOfDayButton;
		let contentsButton;
		let durationButton;
		let timeOfDayTextElement;
		let contentsTextElement;
		let durationQuestionElement;
		let durationValueElement;
		let wrappedReadyTextElement;
		let wrappedReadyFadeStartTime = 0;
		let panelSpinSounds = [];
		let panelSpinSoundIndex = 0;
		let activePanelName = "TimeOfDay";
		let redDisplacementBase;
		let redDisplacementSourceLayer;
		let redDisplacementLayer;
		let redDisplacementSeed = 1;
		let redDisplacementSections = [];
		const siteFontFamily = '"forma-djr-text", "Forma DJR Text", sans-serif';
		const timeOptions = ["Morning", "Afternoon", "Night"];
		const contentOptions = ["Excitement", "Stress Relief", "Inspiration"];
		const contentStateOptions = ["Excitement", "StressRelief", "Inspiration"];
		const durationOptions = ["under 1 hour", "2-3 hours", "4-5 hours", "5+ hours"];
		const showControlPanelControls = false;
		const showControlPanelSubmit = false;
		const redDisplacementSectionCount = 7;
		const redDisplacementSectionDelayMin = 400;
		const redDisplacementSectionDelayMax = 2000;
		const redDisplacementSectionMoveDuration = 720;
		const redSectionBackgroundColor = "#f23653";
		const panelSpinSoundPoolSize = 4;

		const baseVectorComponent = {
			x: 0,
			y: 0
		};

		const controlPanel = createControlPanel();
		const underlyingArtworkLayout = createUnderlyingArtworkLayout();

		// move vector groups
		const underlyingAssetGroup12 = createUnderlyingVectorGroup("assetGroup12", 0.5, 0.46, 0.25);
		const underlyingAssetGroup456 = createUnderlyingVectorGroup("assetGroup456", 0.764, 0.34, 0.3);
		const underlyingAssetGroup789 = createUnderlyingVectorGroup("assetGroup789", 0.6, 0.28, 0.35);
		const underlyingVectorGroups = [underlyingAssetGroup12, underlyingAssetGroup456, underlyingAssetGroup789];

		const TimeOfDay = createPanel("TimeOfDay", "left", "#adf218");
		const Contents = createPanel("Contents", "right", "#0026b2");
		const Duration = createPanel("Duration", "center", "#ffffff");

		function createUnderlyingVectorGroup(name, xFactor, yFactor, sizeFactor) {
			return {
				name: name,
				x: 0,
				y: 0,
				xFactor: xFactor,
				yFactor: yFactor,
				sizeFactor: sizeFactor
			};
		}

		function createControlBounds() {
			return {
				centerX: 0,
				centerY: 0,
				width: 0,
				height: 0
			};
		}

		function createControlPanel() {
			return {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				color: "#1840f2",
				accentColor: "#0026b2",
				buttonsBounds: createControlBounds(),
				sliderBounds: createControlBounds(),
				submitBounds: createControlBounds(),
				buttonCenters: [],
				buttonRadius: 0,
				hoveredButtonIndex: -1,
				activeButtonIndex: -1,
				isSliderHovered: false,
				isSliderDragging: false,
				sliderValue: 0.23,
				isSubmitHovered: false,
				isSubmitPressed: false,
				offsetX: 0,
				startOffsetX: 0,
				targetOffsetX: 0,
				retreatStartTime: 0,
				retreatDuration: 900,
				isRetreating: false,
				isRetreated: false
			};
		}

		function createUnderlyingArtworkLayout() {
			return {
				progress: 0,
				startProgress: 0,
				targetProgress: 0,
				moveStartTime: 0,
				moveDuration: 900,
				targetScale: 0.7,
				isMoving: false,
				isMoved: false
			};
		}

		function createPanel(name, assetSide, backgroundColor) {
			return {
				name: name,
				assetSide: assetSide,
				backgroundColor: backgroundColor,
				x: 0,
				targetX: 0,
				isOpen: name === "TimeOfDay",
				isMinimized: false,
				asset1Rotation: 0,
				asset1RotationStart: 0,
				asset1RotationTarget: 0,
				asset1RotationStartTime: 0,
				asset1RotationDuration: 700,
				isAsset1Rotating: false,
				asset2Rotation: 0,
				asset2RotationStart: 0,
				asset2RotationTarget: 0,
				asset2RotationStartTime: 0,
				asset2RotationDuration: 1000,
				isAsset2Rotating: false,
				assetGroupScale: 1,
				assetGroupScaleStart: 1,
				assetGroupScaleTarget: 1,
				assetGroupScaleStartTime: 0,
				assetGroupScaleDuration: 280,
				isAssetGroupScaling: false,
				isAssetGroupHovered: false,
				isAssetGroupPressed: false,
				assetGroupClickShrinkUntil: 0,
				assetGroupBounds: {
					centerX: 0,
					centerY: 0,
					width: 0,
					height: 0
				},
				asset1Bounds: {
					centerX: 0,
					centerY: 0,
					width: 0,
					height: 0,
					rotation: 0
				}
			};
		}

		function createRedDisplacementBackground() {
			redDisplacementBase = p.createGraphics(p.width, p.height);
			redDisplacementSourceLayer = p.createGraphics(p.width, p.height);
			redDisplacementLayer = p.createGraphics(p.width, p.height);
			redDisplacementBase.pixelDensity(1);
			redDisplacementSourceLayer.pixelDensity(1);
			redDisplacementLayer.pixelDensity(1);
			regenerateRedDisplacementBase();
			resetRedDisplacementSections();
		}

		function getRedDisplacementSectionTravel() {
			return p.constrain(p.height * 0.16, 48, 160);
		}

		function getRandomRedDisplacementSectionDelay() {
			return p.random(redDisplacementSectionDelayMin, redDisplacementSectionDelayMax);
		}

		function resetRedDisplacementSections() {
			redDisplacementSections = Array.from({ length: redDisplacementSectionCount }, function (_, index) {
				return {
					offset: 0,
					startOffset: 0,
					targetOffset: 0,
					direction: index % 2 === 0 ? -1 : 1,
					startTime: 0,
					nextMoveAt: p.millis() + getRandomRedDisplacementSectionDelay(),
					isMoving: false
				};
			});
		}

		function updateRedDisplacementSections() {
			const now = p.millis();
			const travel = getRedDisplacementSectionTravel();

			redDisplacementSections.forEach(function (section) {
				if (!section.isMoving && now >= section.nextMoveAt) {
					section.startOffset = section.offset;
					section.targetOffset = section.direction * travel;
					section.startTime = now;
					section.isMoving = true;
				}

				if (!section.isMoving) {
					return;
				}

				const progress = p.constrain((now - section.startTime) / redDisplacementSectionMoveDuration, 0, 1);
				const easedProgress = cubicBezierSlide(progress);
				section.offset = p.lerp(section.startOffset, section.targetOffset, easedProgress);

				if (progress >= 1) {
					section.offset = section.targetOffset;
					section.direction *= -1;
					section.nextMoveAt = now + getRandomRedDisplacementSectionDelay();
					section.isMoving = false;
				}
			});
		}

		function composeRedDisplacementSections() {
			const layerWidth = redDisplacementLayer.width;
			const layerHeight = redDisplacementLayer.height;

			redDisplacementLayer.clear();

			redDisplacementSections.forEach(function (section, index) {
				const sx = Math.floor(index * layerWidth / redDisplacementSectionCount);
				const nextX = index === redDisplacementSectionCount - 1
					? layerWidth
					: Math.floor((index + 1) * layerWidth / redDisplacementSectionCount);
				const sectionWidth = nextX - sx;
				const wrappedOffset = ((section.offset % layerHeight) + layerHeight) % layerHeight;
				const dy = Math.round(wrappedOffset);

				redDisplacementLayer.copy(redDisplacementSourceLayer, sx, 0, sectionWidth, layerHeight, sx, dy, sectionWidth, layerHeight);
				redDisplacementLayer.copy(redDisplacementSourceLayer, sx, 0, sectionWidth, layerHeight, sx, dy - layerHeight, sectionWidth, layerHeight);
			});
		}

		function regenerateRedDisplacementBase() {
			const graphics = redDisplacementBase;
			const graphicsWidth = graphics.width;
			const graphicsHeight = graphics.height;

			p.randomSeed(redDisplacementSeed);
			p.noiseSeed(redDisplacementSeed);

			graphics.clear();
			graphics.background(242, 54, 83, 245);
			graphics.noStroke();

			const columns = p.floor(p.map(p.noise(redDisplacementSeed * 0.11), 0, 1, 14, 22));
			const rows = p.floor(p.map(p.noise(redDisplacementSeed * 0.23), 0, 1, 28, 46));
			const cellWidth = graphicsWidth / columns;
			const cellHeight = graphicsHeight / rows;

			for (let x = 0; x < columns; x = x + 1) {
				for (let y = 0; y < rows; y = y + 1) {
					const noiseValue = p.noise(x * 0.12 + redDisplacementSeed * 0.03, y * 0.12 + redDisplacementSeed * 0.03);

					if (noiseValue < 0.36) {
						graphics.fill(242, 54, 83, 140);
					} else if (noiseValue < 0.68) {
						graphics.fill(229, 29, 66, 150);
					} else {
						graphics.fill(186, 13, 53, 165);
					}

					graphics.rect(x * cellWidth, y * cellHeight, cellWidth + 1, cellHeight + 1);
				}
			}

			const overlayCount = p.floor(columns * rows * 0.34);

			for (let i = 0; i < overlayCount; i = i + 1) {
				const randomColumn = p.floor(p.random(columns));
				const randomRow = p.floor(p.random(rows));
				const roll = p.random();

				if (roll < 0.33) {
					graphics.fill(242, 54, 83, 90);
				} else if (roll < 0.66) {
					graphics.fill(229, 29, 66, 105);
				} else {
					graphics.fill(186, 13, 53, 120);
				}

				graphics.rect(
					randomColumn * cellWidth,
					randomRow * cellHeight,
					cellWidth * p.random(0.65, 1.45),
					cellHeight * p.random(0.65, 1.45)
				);
			}
		}

		function updateRedDisplacementBackground() {
			if (!redDisplacementBase || !redDisplacementSourceLayer || !redDisplacementLayer) {
				return;
			}

			const layerWidth = redDisplacementSourceLayer.width;
			const layerHeight = redDisplacementSourceLayer.height;
			const time = p.frameCount * 0.006;
			let y = 0;

			redDisplacementSourceLayer.clear();
			redDisplacementSourceLayer.image(redDisplacementBase, 0, 0);

			while (y < layerHeight) {
				const bandHeight = p.floor(p.map(p.noise(y * 0.008 + time * 0.7), 0, 1, 16, 62));
				const shift = p.map(p.noise(y * 0.013 + time * 0.9), 0, 1, -76, 76);

				redDisplacementSourceLayer.copy(redDisplacementBase, 0, y, layerWidth, bandHeight, shift, y, layerWidth, bandHeight);
				y = y + bandHeight;
			}

			for (let i = 0; i < 10; i = i + 1) {
				const blockY = p.floor(p.map(p.noise(i * 0.72 + time * 0.6), 0, 1, 0, layerHeight - 40));
				const blockHeight = p.floor(p.map(p.noise(i * 1.36 + time * 0.55), 0, 1, 22, 88));
				const blockX = p.floor(p.map(p.noise(i * 2.15 + time * 0.45), 0, 1, 0, layerWidth - 140));
				const blockWidth = p.floor(p.map(p.noise(i * 2.9 + time * 0.4), 0, 1, 90, 240));
				const shiftX = p.floor(p.map(p.noise(i * 3.1 + time), 0, 1, -96, 96));

				redDisplacementSourceLayer.copy(
					redDisplacementBase,
					blockX,
					blockY,
					blockWidth,
					blockHeight,
					blockX + shiftX,
					blockY,
					blockWidth,
					blockHeight
				);
			}

			updateRedDisplacementSections();
			composeRedDisplacementSections();
		}

		function drawRedDisplacementFill(x, y, fillWidth, fillHeight, fallbackColor) {
			p.push();

			if (!redDisplacementLayer) {
				p.noStroke();
				p.fill(fallbackColor);
				p.rect(x, y, fillWidth, fillHeight);
				p.pop();
				return;
			}

			p.imageMode(p.CORNER);
			p.drawingContext.save();
			p.drawingContext.beginPath();
			p.drawingContext.rect(x, y, fillWidth, fillHeight);
			p.drawingContext.clip();
			p.image(redDisplacementLayer, 0, 0, p.width, p.height);
			p.drawingContext.restore();
			p.pop();
		}

		function syncTimeOfDayClickCount() {
			window.TimeOfDayClickCount = TimeOfDayClickCount;
			window.SelectedTimeOfDayIndex = TimeOfDayClickCount % timeOptions.length;
			window.TimeOfDayAssetAnimationCount = TimeOfDayAssetAnimationCount;
		}

		function syncContentsClickCount() {
			window.ContentsClickCount = ContentsClickCount;
			ContentPanelState = getCurrentContentState();
			window.ContentPanelState = ContentPanelState;
		}

		function syncDurationClickCount() {
			window.DurationClickCount = DurationClickCount;
		}

		function cubicBezierCoordinate(t, point1, point2) {
			const oneMinusT = 1 - t;

			return 3 * oneMinusT * oneMinusT * t * point1 + 3 * oneMinusT * t * t * point2 + t * t * t;
		}

		function cubicBezierEase(progress, x1, y1, x2, y2) {
			let low = 0;
			let high = 1;
			let t = progress;
			let i = 0;

			while (i < 10) {
				const x = cubicBezierCoordinate(t, x1, x2);

				if (x < progress) {
					low = t;
				} else {
					high = t;
				}

				t = (low + high) / 2;
				i = i + 1;
			}

			return cubicBezierCoordinate(t, y1, y2);
		}

		function cubicBezierBounceEnd(progress) {
			return cubicBezierEase(progress, 0.34, 1.56, 0.64, 1);
		}

		function cubicBezierSlide(progress) {
			return cubicBezierEase(progress, 0.76, 0, 0.24, 1);
		}

		function updatePanelRotation(panel, assetNumber) {
			const rotationKey = "asset" + assetNumber + "Rotation";
			const startKey = "asset" + assetNumber + "RotationStart";
			const targetKey = "asset" + assetNumber + "RotationTarget";
			const startTimeKey = "asset" + assetNumber + "RotationStartTime";
			const durationKey = "asset" + assetNumber + "RotationDuration";
			const rotatingKey = "isAsset" + assetNumber + "Rotating";

			if (!panel[rotatingKey]) {
				return;
			}

			const elapsed = p.millis() - panel[startTimeKey];
			const progress = p.constrain(elapsed / panel[durationKey], 0, 1);
			const easedProgress = cubicBezierBounceEnd(progress);

			panel[rotationKey] = p.lerp(panel[startKey], panel[targetKey], easedProgress);

			if (progress >= 1) {
				panel[rotationKey] = panel[targetKey];
				panel[rotatingKey] = false;
			}
		}

		function rotatePanelAssetBy(panel, assetNumber, degrees) {
			const rotationKey = "asset" + assetNumber + "Rotation";
			const startKey = "asset" + assetNumber + "RotationStart";
			const targetKey = "asset" + assetNumber + "RotationTarget";
			const startTimeKey = "asset" + assetNumber + "RotationStartTime";
			const rotatingKey = "isAsset" + assetNumber + "Rotating";

			updatePanelRotation(panel, assetNumber);
			panel[startKey] = panel[rotationKey];
			panel[targetKey] = panel[targetKey] + degrees;
			panel[startTimeKey] = p.millis();
			panel[rotatingKey] = true;
		}

		function setupPanelSpinSounds() {
			panelSpinSounds = Array.from({ length: panelSpinSoundPoolSize }, function () {
				const sound = new Audio("media/spin.wav");
				sound.preload = "auto";
				return sound;
			});
		}

		function playPanelSpinSound() {
			if (!panelSpinSounds.length) {
				return;
			}

			const sound = panelSpinSounds[panelSpinSoundIndex];
			panelSpinSoundIndex = (panelSpinSoundIndex + 1) % panelSpinSounds.length;
			sound.pause();
			sound.currentTime = 0;

			const playAttempt = sound.play();
			if (playAttempt && typeof playAttempt.catch === "function") {
				playAttempt.catch(function () {});
			}
		}

		function setPanelScaleTarget(panel, targetScale) {
			if (panel.assetGroupScaleTarget === targetScale && panel.isAssetGroupScaling) {
				return;
			}

			if (panel.assetGroupScaleTarget === targetScale && !panel.isAssetGroupScaling) {
				return;
			}

			updatePanelGroupScale(panel);
			panel.assetGroupScaleStart = panel.assetGroupScale;
			panel.assetGroupScaleTarget = targetScale;
			panel.assetGroupScaleStartTime = p.millis();
			panel.isAssetGroupScaling = true;
		}

		function updatePanelGroupScale(panel) {
			if (!panel.isAssetGroupScaling) {
				return;
			}

			const elapsed = p.millis() - panel.assetGroupScaleStartTime;
			const progress = p.constrain(elapsed / panel.assetGroupScaleDuration, 0, 1);
			const easedProgress = cubicBezierBounceEnd(progress);

			panel.assetGroupScale = p.lerp(panel.assetGroupScaleStart, panel.assetGroupScaleTarget, easedProgress);

			if (progress >= 1) {
				panel.assetGroupScale = panel.assetGroupScaleTarget;
				panel.isAssetGroupScaling = false;
			}
		}

		function updatePanelGroupScaleTarget(panel) {
			if (panel.isAssetGroupPressed || p.millis() < panel.assetGroupClickShrinkUntil) {
				setPanelScaleTarget(panel, 0.9);
			} else if (panel.isAssetGroupHovered) {
				setPanelScaleTarget(panel, 1.1);
			} else {
				setPanelScaleTarget(panel, 1);
			}
		}

		function updateAllRotations() {
			updatePanelRotation(TimeOfDay, 1);
			updatePanelRotation(TimeOfDay, 2);
			updatePanelRotation(Contents, 1);
			updatePanelRotation(Contents, 2);
			updatePanelRotation(Duration, 1);
			updatePanelRotation(Duration, 2);
		}

		function updateAllScales() {
			updatePanelGroupScaleTarget(TimeOfDay);
			updatePanelGroupScaleTarget(Contents);
			updatePanelGroupScaleTarget(Duration);
			updatePanelGroupScale(TimeOfDay);
			updatePanelGroupScale(Contents);
			updatePanelGroupScale(Duration);
		}

		function getContainSize(image, maxWidth, maxHeight) {
			const scale = Math.min(maxWidth / image.width, maxHeight / image.height);

			return {
				width: image.width * scale,
				height: image.height * scale
			};
		}

		function drawContain(image, centerX, centerY, maxWidth, maxHeight) {
			const size = getContainSize(image, maxWidth, maxHeight);

			p.image(image, centerX, centerY, size.width, size.height);
			return size;
		}

		function drawContainWithOverlay(image, centerX, centerY, maxWidth, maxHeight, overlayColor, overlayAlpha) {
			const size = drawContain(image, centerX, centerY, maxWidth, maxHeight);

			if (overlayColor) {
				const overlay = p.color(overlayColor);
				overlay.setAlpha(overlayAlpha || 255);
				p.push();
				p.tint(overlay);
				p.image(image, centerX, centerY, size.width, size.height);
				p.pop();
			}

			return size;
		}

		function setControlBounds(bounds, centerX, centerY, width, height) {
			bounds.centerX = centerX;
			bounds.centerY = centerY;
			bounds.width = width;
			bounds.height = height;
		}

		function updateControlPanelLayout() {
			const panelWidth = p.width / 3;
			const centerX = controlPanel.offsetX + panelWidth / 2;
			const maxControlWidth = panelWidth * 0.76;
			const topY = p.height * 0.26;
			const submitY = p.height - Math.max(48, p.height * 0.08) - p.height * 0.1;
			const sliderY = (topY + submitY) / 2;
			const buttonsWidth = Math.min(maxControlWidth, p.height * 0.16 * 388 / 85);
			const buttonsHeight = buttonsWidth * 85 / 388;
			const sliderWidth = Math.min(maxControlWidth * 0.78, p.height * 0.08 * 272 / 39);
			const sliderHeight = sliderWidth * 39 / 272;
			const submitWidth = Math.min(maxControlWidth, 148);
			const submitHeight = 44;

			controlPanel.x = controlPanel.offsetX;
			controlPanel.y = 0;
			controlPanel.width = panelWidth;
			controlPanel.height = p.height;

			setControlBounds(controlPanel.buttonsBounds, centerX, topY, buttonsWidth, buttonsHeight);
			setControlBounds(controlPanel.sliderBounds, centerX, sliderY, sliderWidth, sliderHeight);
			setControlBounds(controlPanel.submitBounds, centerX, submitY, submitWidth, submitHeight);
			updateControlPanelButtonHitAreas();
		}

		function updateControlPanelButtonHitAreas() {
			const bounds = controlPanel.buttonsBounds;
			const scale = bounds.width / 388;
			const left = bounds.centerX - bounds.width / 2;
			const top = bounds.centerY - bounds.height / 2;
			const buttonXPositions = [23, 85, 147, 209, 271];
			let i = 0;

			controlPanel.buttonCenters = [];
			controlPanel.buttonRadius = 23 * scale;

			while (i < buttonXPositions.length) {
				controlPanel.buttonCenters.push({
					x: left + buttonXPositions[i] * scale,
					y: top + 24 * scale
				});
				i = i + 1;
			}
		}

		function isMouseInBounds(bounds) {
			const dx = p.mouseX - bounds.centerX;
			const dy = p.mouseY - bounds.centerY;

			return p.abs(dx) <= bounds.width / 2 && p.abs(dy) <= bounds.height / 2;
		}

		function getHoveredControlButtonIndex() {
			let i = 0;

			while (i < controlPanel.buttonCenters.length) {
				const center = controlPanel.buttonCenters[i];

				if (p.dist(p.mouseX, p.mouseY, center.x, center.y) <= controlPanel.buttonRadius) {
					return i;
				}

				i = i + 1;
			}

			return -1;
		}

		function isControlPanelInteractive() {
			return !controlPanel.isRetreating && !controlPanel.isRetreated && TimeOfDay.isMinimized && Contents.isMinimized && Duration.isMinimized;
		}

		function updateControlPanelHoverState() {
			if (!showControlPanelControls && !showControlPanelSubmit) {
				controlPanel.hoveredButtonIndex = -1;
				controlPanel.isSliderHovered = false;
				controlPanel.isSubmitHovered = false;
				controlPanel.isSliderDragging = false;
				return;
			}

			const canHover = isControlPanelInteractive();

			updateControlPanelLayout();
			controlPanel.hoveredButtonIndex = showControlPanelControls && canHover ? getHoveredControlButtonIndex() : -1;
			controlPanel.isSliderHovered = showControlPanelControls && canHover && isMouseInBounds(controlPanel.sliderBounds);
			controlPanel.isSubmitHovered = showControlPanelSubmit && canHover && isMouseInBounds(controlPanel.submitBounds);
		}

		function updateControlPanelSliderValue(mouseX) {
			const bounds = controlPanel.sliderBounds;
			const left = bounds.centerX - bounds.width / 2;

			controlPanel.sliderValue = p.constrain((mouseX - left) / bounds.width, 0, 1);
		}

		function startUnderlyingArtworkMove() {
			if (underlyingArtworkLayout.isMoving || underlyingArtworkLayout.isMoved) {
				return;
			}

			underlyingArtworkLayout.startProgress = underlyingArtworkLayout.progress;
			underlyingArtworkLayout.targetProgress = 1;
			underlyingArtworkLayout.moveStartTime = p.millis();
			underlyingArtworkLayout.isMoving = true;
		}

		function dispatchUnderlyingSubmit() {
			window.dispatchEvent(new CustomEvent("untangle:underlying-submit", {
				detail: {
					timeOfDayAssetAnimationCount: TimeOfDayAssetAnimationCount,
					timeOfDayAssetAnimationIndex: TimeOfDayAssetAnimationCount % 3
				}
			}));
		}

		function startAutomaticUnderlyingLayer() {
			if (
				controlPanel.isRetreating ||
				controlPanel.isRetreated ||
				underlyingArtworkLayout.isMoving ||
				underlyingArtworkLayout.isMoved
			) {
				return;
			}

			controlPanel.offsetX = -p.width / 3;
			controlPanel.targetOffsetX = controlPanel.offsetX;
			controlPanel.isRetreating = false;
			controlPanel.isRetreated = true;
			controlPanel.isSliderDragging = false;
			controlPanel.isSubmitPressed = false;
			controlPanel.hoveredButtonIndex = -1;
			controlPanel.isSliderHovered = false;
			controlPanel.isSubmitHovered = false;
			dispatchUnderlyingSubmit();
			startUnderlyingArtworkMove();
		}

		function startControlPanelRetreat() {
			if (controlPanel.isRetreating || controlPanel.isRetreated) {
				return;
			}

			controlPanel.startOffsetX = controlPanel.offsetX;
			controlPanel.targetOffsetX = -p.width / 3;
			controlPanel.retreatStartTime = p.millis();
			controlPanel.isRetreating = true;
			controlPanel.isSliderDragging = false;
			controlPanel.isSubmitPressed = true;
			dispatchUnderlyingSubmit();
		}

		function updateLayoutTransitions() {
			if (controlPanel.isRetreating) {
				const elapsed = p.millis() - controlPanel.retreatStartTime;
				const progress = p.constrain(elapsed / controlPanel.retreatDuration, 0, 1);
				const easedProgress = cubicBezierSlide(progress);

				controlPanel.offsetX = p.lerp(controlPanel.startOffsetX, controlPanel.targetOffsetX, easedProgress);

				if (progress >= 1) {
					controlPanel.offsetX = controlPanel.targetOffsetX;
					controlPanel.isRetreating = false;
					controlPanel.isRetreated = true;
					controlPanel.isSubmitPressed = false;
					controlPanel.hoveredButtonIndex = -1;
					controlPanel.isSliderHovered = false;
					controlPanel.isSubmitHovered = false;
					startUnderlyingArtworkMove();
				}
			}

			if (underlyingArtworkLayout.isMoving) {
				const elapsed = p.millis() - underlyingArtworkLayout.moveStartTime;
				const progress = p.constrain(elapsed / underlyingArtworkLayout.moveDuration, 0, 1);
				const easedProgress = cubicBezierSlide(progress);

				underlyingArtworkLayout.progress = p.lerp(
					underlyingArtworkLayout.startProgress,
					underlyingArtworkLayout.targetProgress,
					easedProgress
				);

				if (progress >= 1) {
					underlyingArtworkLayout.progress = underlyingArtworkLayout.targetProgress;
					underlyingArtworkLayout.isMoving = false;
					underlyingArtworkLayout.isMoved = true;
				}
			}
		}

		function syncControlPanelAfterResize() {
			if (controlPanel.isRetreated) {
				controlPanel.offsetX = -p.width / 3;
				controlPanel.targetOffsetX = controlPanel.offsetX;
			} else if (!controlPanel.isRetreating) {
				controlPanel.offsetX = 0;
			} else {
				controlPanel.targetOffsetX = -p.width / 3;
			}
		}

		function getUnderlyingArtworkOffsetX() {
			return p.lerp(0, -p.width / 2, underlyingArtworkLayout.progress);
		}

		function getUnderlyingArtworkScale() {
			return p.lerp(1, underlyingArtworkLayout.targetScale, underlyingArtworkLayout.progress);
		}

		function drawControlPanelButtons() {
			const bounds = controlPanel.buttonsBounds;
			const scale = bounds.width / 388;
			const left = bounds.centerX - bounds.width / 2;
			const top = bounds.centerY - bounds.height / 2;
			let i = 0;

			p.push();
			p.noStroke();
			p.fill(controlPanel.color);

			while (i < controlPanel.buttonCenters.length) {
				const center = controlPanel.buttonCenters[i];
				const isHovered = i === controlPanel.hoveredButtonIndex;
				const isActive = i === controlPanel.activeButtonIndex;

				if (isHovered || isActive) {
					p.fill(isActive ? controlPanel.accentColor : "#adf218");
				} else {
					p.fill(controlPanel.color);
				}

				p.stroke(controlPanel.accentColor);
				p.strokeWeight(Math.max(1, 1.5 * scale));
				p.circle(center.x, center.y, controlPanel.buttonRadius * 2);
				p.noStroke();
				i = i + 1;
			}

			p.fill(controlPanel.color);
			p.rect(left + 318 * scale, top, 62 * scale, 58 * scale);
			p.fill(controlPanel.accentColor);
			p.rect(left + 314 * scale, top, 8 * scale, 60 * scale);
			p.rect(left + 314 * scale, top + 52 * scale, 36 * scale, 8 * scale);
			p.rect(left + 342 * scale, top + 52 * scale, 8 * scale, 28 * scale);
			p.pop();
		}

		function drawControlPanelSlider() {
			const bounds = controlPanel.sliderBounds;
			const left = bounds.centerX - bounds.width / 2;
			const top = bounds.centerY - bounds.height / 2;
			const knobX = left + bounds.width * controlPanel.sliderValue;
			const knobWidth = Math.max(5, bounds.width * 0.022);
			const trackHeight = bounds.height * 0.82;

			p.push();

			if (controlPanel.isSliderHovered || controlPanel.isSliderDragging) {
				p.noFill();
				p.stroke("#adf218");
				p.strokeWeight(2);
				p.rect(left - 8, top - 8, bounds.width + 16, bounds.height + 16, 7);
			}

			p.noStroke();
			p.fill(controlPanel.color);
			p.rect(left, bounds.centerY - trackHeight / 2, bounds.width, trackHeight);
			p.fill(controlPanel.accentColor);
			p.rect(left, bounds.centerY - trackHeight / 2, knobX - left, trackHeight);
			p.rect(knobX - knobWidth / 2, top, knobWidth, bounds.height);
			p.pop();
		}

		function drawControlPanelSubmitButton() {
			const bounds = controlPanel.submitBounds;
			const isActive = controlPanel.isSubmitHovered || controlPanel.isSubmitPressed;

			p.push();
			p.rectMode(p.CENTER);
			p.noStroke();
			p.fill(controlPanel.isSubmitPressed ? controlPanel.accentColor : "#1840f2");
			p.rect(bounds.centerX, bounds.centerY, bounds.width, bounds.height, 999);
			p.fill("#ffffff");
			p.textAlign(p.CENTER, p.CENTER);
			p.textFont(siteFontFamily);
			p.textSize(14);
			p.text("Submit", bounds.centerX, bounds.centerY + 1);
			p.pop();
		}

		function drawControlPanel() {
			if (!showControlPanelControls && !showControlPanelSubmit) {
				return;
			}

			if (controlPanel.isRetreated && !controlPanel.isRetreating) {
				return;
			}

			if (!isControlPanelInteractive() && !controlPanel.isRetreating) {
				return;
			}

			updateControlPanelLayout();
			drawRedDisplacementFill(controlPanel.x, controlPanel.y, controlPanel.width, controlPanel.height, controlPanel.color);

			if (showControlPanelControls) {
				drawControlPanelButtons();
				drawControlPanelSlider();
			}

			if (showControlPanelSubmit) {
				drawControlPanelSubmitButton();
			}
		}

		function handleControlPanelMousePressed() {
			if (!showControlPanelControls && !showControlPanelSubmit) {
				return false;
			}

			if (!isControlPanelInteractive()) {
				return false;
			}

			if (showControlPanelControls && controlPanel.hoveredButtonIndex !== -1) {
				controlPanel.activeButtonIndex = controlPanel.hoveredButtonIndex;
				return true;
			}

			if (showControlPanelControls && controlPanel.isSliderHovered) {
				controlPanel.isSliderDragging = true;
				updateControlPanelSliderValue(p.mouseX);
				return true;
			}

			if (showControlPanelSubmit && controlPanel.isSubmitHovered) {
				startControlPanelRetreat();
				return true;
			}

			return false;
		}

		function updateUnderlyingVectorGroups() {
			const artworkOffsetX = getUnderlyingArtworkOffsetX();
			let i = 0;

			while (i < underlyingVectorGroups.length) {
				const group = underlyingVectorGroups[i];

				group.x = p.width * group.xFactor + artworkOffsetX;
				group.y = p.height * group.yFactor;
				i = i + 1;
			}
		}

		function updateBaseVectorComponent() {
			baseVectorComponent.x = 2 * p.width / 3 + getUnderlyingArtworkOffsetX();
			baseVectorComponent.y = 1 * p.height / 2;
			updateControlPanelLayout();
			updateUnderlyingVectorGroups();
		}

		function drawUnderlyingVectorGroup(group, images) {
			const maxSize = Math.min(p.width, p.height) * group.sizeFactor;
			let i = 0;

			p.push();
			p.translate(group.x, group.y);

			while (i < images.length) {
				const layer = images[i];
				const image = layer.image || layer;
				const scale = layer.scale || 1;
				const rotation = layer.rotationSpeed ? p.millis() * layer.rotationSpeed / 1000 : 0;
				const overlayColor = layer.overlayColor || "";
				const overlayAlpha = layer.overlayAlpha || 255;

				p.push();
				p.rotate(rotation);
				drawContainWithOverlay(image, 0, 0, maxSize * scale, maxSize * scale, overlayColor, overlayAlpha);
				p.pop();
				i = i + 1;
			}

			p.pop();
		}

		function drawBaseVectorComponent() {
			drawRedDisplacementFill(0, 0, p.width, p.height, "#1840f2");

			if (isMobilePanelLayout()) {
				return;
			}

			p.push();
			p.translate(p.width / 6, p.height / 2);
			p.scale(getUnderlyingArtworkScale());
			p.translate(-p.width / 6, -p.height / 2);

			p.push();
			p.translate(baseVectorComponent.x, baseVectorComponent.y);

			drawContain(asset14, 0, p.height * 0.16, p.width * 0.72, p.height * 0.46);

			p.pop();

			drawUnderlyingVectorGroup(underlyingAssetGroup12, [{ image: underlyingAsset2, rotationSpeed: -90 }, { image: underlyingAsset1, rotationSpeed: 180 }]);
			drawUnderlyingVectorGroup(underlyingAssetGroup789, [underlyingAsset24]);
			drawUnderlyingVectorGroup(underlyingAssetGroup456, [
				{ image: underlyingAsset6, rotationSpeed: 180 },
				{ image: underlyingAsset5, rotationSpeed: 180, scale: 1.1 },
				{ image: underlyingAsset4, rotationSpeed: 180 }
			]);
			drawUnderlyingVectorGroup(underlyingAssetGroup789, [underlyingAsset9, { image: underlyingAsset8, scale: 0.5 }, { image: underlyingAsset7, rotationSpeed: -180 }]);

			p.push();
			p.translate(baseVectorComponent.x, baseVectorComponent.y);

			drawContain(asset13, p.width * 0.07, p.height * 0.045, p.width * 0.72, p.height * 0.28);

			p.pop();

			p.pop();
		}

		function updatePanelTarget(panel) {
			if (!panel.isOpen) {
				panel.targetX = p.width;
			} else if (panel.isMinimized) {
				panel.targetX = -p.width;
			} else {
				panel.targetX = 0;
			}
		}

		function isMobilePanelLayout() {
			return p.width <= 900;
		}

		function getPanelButtonLayout(panel) {
			const buttonWidth = 192;
			const buttonHeight = 68;
			const buttonY = p.height - Math.max(170, p.height * 0.18);
			let buttonX = panel.x + p.width - buttonWidth - Math.max(48, p.width * 0.04);

			if (isMobilePanelLayout()) {
				buttonX = panel.x + (p.width - buttonWidth) / 2;
			}

			return {
				x: buttonX,
				y: buttonY,
				width: buttonWidth,
				height: buttonHeight
			};
		}

		function updatePanelButton(panel, button) {
			if (!button) {
				return;
			}

			const shouldShow = panel.isOpen && !panel.isMinimized && activePanelName === panel.name;
			const buttonLayout = getPanelButtonLayout(panel);

			button.html("Submit");
			button.size(buttonLayout.width, buttonLayout.height);
			button.position(buttonLayout.x, buttonLayout.y);
			button.style("display", shouldShow ? "block" : "none");
			button.style("writing-mode", "horizontal-tb");
			button.style("text-orientation", "initial");
			button.style("z-index", "11");
		}

		function updateAllPanelButtons() {
			updatePanelButton(TimeOfDay, timeOfDayButton);
			updatePanelButton(Contents, contentsButton);
			updatePanelButton(Duration, durationButton);
		}

		function submitTimeOfDay() {
			TimeOfDay.isMinimized = true;
			Contents.isOpen = true;
			Contents.isMinimized = false;
			Contents.x = p.width;
			activePanelName = "Contents";

			updatePanelTarget(TimeOfDay);
			updatePanelTarget(Contents);
			updateAllPanelButtons();
		}

		function submitContents() {
			Contents.isMinimized = true;
			Duration.isOpen = true;
			Duration.isMinimized = false;
			Duration.x = p.width;
			activePanelName = "Duration";

			updatePanelTarget(Contents);
			updatePanelTarget(Duration);
			updateAllPanelButtons();
		}

		function submitDuration() {
			Duration.isMinimized = true;
			updatePanelTarget(Duration);
			updateAllPanelButtons();
			startAutomaticUnderlyingLayer();
		}

		function handleTimeOfDayButton() {
			submitTimeOfDay();
		}

		function handleContentsButton() {
			submitContents();
		}

		function handleDurationButton() {
			submitDuration();
		}

		function drawPanelAsset(image, panel, assetNumber, centerX, centerY, maxSize) {
			const size = getContainSize(image, maxSize, maxSize);
			let rotation = panel["asset" + assetNumber + "Rotation"];

			if (panel.name === "Contents" && asset1Frames.includes(image)) {
				rotation -= 10;
			}

			if (panel.name === "Duration" && assetNumber === 2) {
				rotation -= 112;
			}

			p.push();
			p.translate(centerX, centerY);
			p.rotate(rotation);
			p.image(image, 0, 0, size.width, size.height);
			p.pop();

			return size;
		}

		function getPanelAssetImages(panel) {
			if (panel.name === "Contents") {
				return {
					asset1: contentsAsset1,
					asset2: getAnimatedAsset1()
				};
			}

			if (panel.name === "Duration") {
				return {
					asset1: getAnimatedAsset1(),
					asset2: durationAsset2
				};
			}

			return {
				asset1: getAnimatedAsset1(),
				asset2: asset2
			};
		}

		function getAnimatedAsset1() {
			if (!asset1Frames.length) {
				return asset1;
			}

			const frameIndex = p.floor(p.millis() / 100) % asset1Frames.length;
			return asset1Frames[frameIndex] || asset1;
		}

		function getCurrentTimeOfDayLabel() {
			return timeOptions[TimeOfDayClickCount % timeOptions.length];
		}

		function getCurrentContentLabel() {
			return contentOptions[getCurrentContentIndex()];
		}

		function getCurrentContentState() {
			return contentStateOptions[getCurrentContentIndex()];
		}

		function getCurrentContentIndex() {
			return ContentsClickCount % contentOptions.length;
		}

		function getCurrentDurationLabel() {
			return durationOptions[DurationClickCount % durationOptions.length];
		}

		function setTextEffectHtml(element, html) {
			const node = element && element.elt;

			if (!node) {
				return;
			}

			if (node.dataset.kineticSourceHtml !== html) {
				element.html(html);
				node.dataset.kineticSourceHtml = html;
			}

			if (window.UntangleTextFx) {
				window.UntangleTextFx.prepare(node, { sourceHtml: html });
			}
		}

		function prepareTextEffectElement(element) {
			if (window.UntangleTextFx && element && element.elt) {
				window.UntangleTextFx.prepare(element.elt);
			}
		}

		function makeTimeOfDayTextElement() {
			const element = p.createDiv("");

			element.parent("sketch-canvas");
			element.addClass("time-of-day-panel-text");
			element.style("display", "none");

			return element;
		}

		function updateTimeOfDayTextElement() {
			if (!timeOfDayTextElement) {
				return;
			}

			const shouldShow = TimeOfDay.isOpen && !TimeOfDay.isMinimized && activePanelName === "TimeOfDay";

			if (!shouldShow) {
				timeOfDayTextElement.style("display", "none");
				return;
			}

			setTextEffectHtml(
				timeOfDayTextElement,
				'<span class="time-of-day-question">What time do you usually enjoy scrolling on your mobile phone?</span>' +
				'<span class="time-of-day-prefix">Is it</span>' +
				'<span class="time-of-day-value">' + getCurrentTimeOfDayLabel() + '?</span>'
			);
			timeOfDayTextElement.style("display", "block");
			if (isMobilePanelLayout()) {
				timeOfDayTextElement.position(TimeOfDay.x + p.width * 0.08, p.height * 0.1);
				timeOfDayTextElement.size(p.width * 0.84, p.height * 0.34);
			} else {
				timeOfDayTextElement.position(TimeOfDay.x + p.width * 0.42, p.height * 0.12);
				timeOfDayTextElement.size(p.width * 0.53, p.height * 0.8);
			}
		}

		function makeContentsTextElement() {
			const element = p.createDiv("");

			element.parent("sketch-canvas");
			element.addClass("contents-panel-text");
			element.style("display", "none");

			return element;
		}

		function updateContentsTextElement() {
			if (!contentsTextElement) {
				return;
			}

			const shouldShow = Contents.isOpen && !Contents.isMinimized && activePanelName === "Contents";

			if (!shouldShow) {
				contentsTextElement.style("display", "none");
				return;
			}

			setTextEffectHtml(
				contentsTextElement,
				'<span class="contents-question">What do you seek within scrolling?</span>' +
				'<span class="contents-prefix">Is it</span>' +
				'<span class="contents-value">' + getCurrentContentLabel() + '?</span>'
			);
			contentsTextElement.style("display", "block");
			if (isMobilePanelLayout()) {
				contentsTextElement.position(Contents.x + p.width * 0.04, p.height * 0.1);
				contentsTextElement.size(p.width * 0.84, p.height * 0.34);
			} else {
				contentsTextElement.position(Contents.x + p.width * 0.02, p.height * 0.12);
				contentsTextElement.size(p.width * 0.48, p.height * 0.8);
			}
		}

		function makeDurationTextElement(className) {
			const element = p.createDiv("");

			element.parent("sketch-canvas");
			element.addClass(className);
			element.style("display", "none");

			return element;
		}

		function updateDurationTextElements() {
			if (!durationQuestionElement || !durationValueElement) {
				return;
			}

			const shouldShow = Duration.isOpen && !Duration.isMinimized && activePanelName === "Duration";

			if (!shouldShow) {
				durationQuestionElement.style("display", "none");
				durationValueElement.style("display", "none");
				return;
			}

			setTextEffectHtml(durationQuestionElement, "Your daily scrolling duration?");
			durationQuestionElement.style("display", "block");
			if (isMobilePanelLayout()) {
				durationQuestionElement.position(Duration.x + p.width * 0.04, p.height * 0.12);
				durationQuestionElement.size(p.width * 0.42, p.height * 0.28);
			} else {
				durationQuestionElement.position(Duration.x + p.width * 0.03, p.height * 0.16);
				durationQuestionElement.size(p.width * 0.36, p.height * 0.36);
			}

			setTextEffectHtml(durationValueElement, getCurrentDurationLabel());
			durationValueElement.style("display", "block");
			if (isMobilePanelLayout()) {
				durationValueElement.position(Duration.x + p.width * 0.54, p.height * 0.12);
				durationValueElement.size(p.width * 0.42, p.height * 0.28);
			} else {
				durationValueElement.position(Duration.x + p.width * 0.6, p.height * 0.2);
				durationValueElement.size(p.width * 0.36, p.height * 0.5);
			}
		}

		function makeWrappedReadyTextElement() {
			const element = p.createDiv("YOUR WRAPPED IS HERE");

			element.parent("sketch-canvas");
			element.addClass("wrapped-ready-text");
			element.style("display", "none");
			prepareTextEffectElement(element);

			return element;
		}

		function updateWrappedReadyTextElement() {
			if (!wrappedReadyTextElement) {
				return;
			}

			if (!underlyingArtworkLayout.isMoved) {
				wrappedReadyTextElement.style("display", "none");
				wrappedReadyTextElement.style("opacity", "0");
				wrappedReadyFadeStartTime = 0;
				return;
			}

			if (wrappedReadyFadeStartTime === 0) {
				wrappedReadyFadeStartTime = p.millis();
			}

			const fadeProgress = p.constrain((p.millis() - wrappedReadyFadeStartTime) / 1000, 0, 1);

			wrappedReadyTextElement.style("display", "block");
			prepareTextEffectElement(wrappedReadyTextElement);
			wrappedReadyTextElement.style("opacity", String(fadeProgress));
			if (isMobilePanelLayout()) {
				wrappedReadyTextElement.position(p.width * 0.06, p.height * 0.28);
				wrappedReadyTextElement.size(p.width * 0.88, p.height * 0.44);
			} else {
				wrappedReadyTextElement.position(p.width * 0.38, p.height * 0.3);
				wrappedReadyTextElement.size(p.width * 0.57, p.height * 0.6);
			}
		}

		function drawPanel(panel) {
			if (!panel.isOpen && panel.x >= p.width - 0.5) {
				return;
			}

			panel.x = p.lerp(panel.x, panel.targetX, 0.16);

			if (p.abs(panel.x - panel.targetX) < 0.5) {
				panel.x = panel.targetX;
			}

			if (panel.isMinimized && panel.x === -p.width) {
				return;
			}

			const mobilePanelLayout = isMobilePanelLayout();
			const buttonLayout = getPanelButtonLayout(panel);
			const vectorAreaWidth = p.width / 2;
			let vectorCenterX = vectorAreaWidth / 2;
			let vectorCenterY = p.height / 2;
			let vectorMaxSize = Math.min(vectorAreaWidth * 0.76, p.height * 0.72);

			if (mobilePanelLayout) {
				const topSafeArea = Math.max(72, p.height * 0.12);
				const buttonGap = Math.max(18, p.height * 0.025);
				const availableHeight = Math.max(180, buttonLayout.y - topSafeArea - buttonGap);

				vectorCenterX = p.width / 2;
				vectorMaxSize = Math.min(p.width * 0.9, availableHeight);
			} else if (panel.assetSide === "right") {
				vectorCenterX = p.width * 0.65;
			} else if (panel.assetSide === "center") {
				vectorCenterX = p.width / 2;
			}
			const panelAssets = getPanelAssetImages(panel);
			const asset1Size = getContainSize(panelAssets.asset1, vectorMaxSize, vectorMaxSize);
			const asset2Size = getContainSize(panelAssets.asset2, vectorMaxSize, vectorMaxSize);
			const groupWidth = Math.max(asset1Size.width, asset2Size.width) * panel.assetGroupScale;
			const groupHeight = Math.max(asset1Size.height, asset2Size.height) * panel.assetGroupScale;

			if (mobilePanelLayout) {
				const topSafeArea = Math.max(72, p.height * 0.12);
				const buttonGap = Math.max(18, p.height * 0.025);
				vectorCenterY = buttonLayout.y - buttonGap - groupHeight / 2;
				vectorCenterY = Math.max(topSafeArea + groupHeight / 2, vectorCenterY);
			}

			panel.assetGroupBounds.centerX = panel.x + vectorCenterX;
			panel.assetGroupBounds.centerY = vectorCenterY;
			panel.assetGroupBounds.width = groupWidth;
			panel.assetGroupBounds.height = groupHeight;
			panel.asset1Bounds.centerX = panel.x + vectorCenterX;
			panel.asset1Bounds.centerY = vectorCenterY;
			panel.asset1Bounds.width = asset1Size.width * panel.assetGroupScale;
			panel.asset1Bounds.height = asset1Size.height * panel.assetGroupScale;
			panel.asset1Bounds.rotation = panel.asset1Rotation;

			p.push();
			p.translate(panel.x, 0);
			drawRedDisplacementFill(0, 0, p.width, p.height, panel.backgroundColor);

			p.push();
			p.translate(vectorCenterX, vectorCenterY);
			p.scale(panel.assetGroupScale);
			if (panel.name === "Contents") {
				drawPanelAsset(panelAssets.asset1, panel, 1, 0, 0, vectorMaxSize);
				drawPanelAsset(panelAssets.asset2, panel, 2, 0, 0, vectorMaxSize);
			} else {
				drawPanelAsset(panelAssets.asset2, panel, 2, 0, 0, vectorMaxSize);
				drawPanelAsset(panelAssets.asset1, panel, 1, 0, 0, vectorMaxSize);
			}
			p.pop();

			p.pop();
		}

		function drawPanels() {
			if (activePanelName === "TimeOfDay") {
				drawPanel(Duration);
				drawPanel(Contents);
				drawPanel(TimeOfDay);
			} else if (activePanelName === "Contents") {
				drawPanel(TimeOfDay);
				drawPanel(Duration);
				drawPanel(Contents);
			} else {
				drawPanel(TimeOfDay);
				drawPanel(Contents);
				drawPanel(Duration);
			}

			updateAllPanelButtons();
		}

		function isMouseOnPanelAssetGroup(panel) {
			if (panel.isMinimized || activePanelName !== panel.name) {
				return false;
			}

			const bounds = panel.assetGroupBounds;
			const dx = p.mouseX - bounds.centerX;
			const dy = p.mouseY - bounds.centerY;

			return p.abs(dx) <= bounds.width / 2 && p.abs(dy) <= bounds.height / 2;
		}

		function updateAllHoverStates() {
			TimeOfDay.isAssetGroupHovered = isMouseOnPanelAssetGroup(TimeOfDay);
			Contents.isAssetGroupHovered = isMouseOnPanelAssetGroup(Contents);
			Duration.isAssetGroupHovered = isMouseOnPanelAssetGroup(Duration);
			updateControlPanelHoverState();

			if (
				TimeOfDay.isAssetGroupHovered ||
				Contents.isAssetGroupHovered ||
				Duration.isAssetGroupHovered ||
				controlPanel.hoveredButtonIndex !== -1 ||
				controlPanel.isSliderHovered ||
				controlPanel.isSubmitHovered ||
				controlPanel.isSliderDragging
			) {
				p.cursor(p.HAND);
			} else {
				p.cursor(p.ARROW);
			}
		}

		function makePanelButton(label, handler) {
			const button = p.createButton(label);

			button.parent("sketch-canvas");
			button.mousePressed(handler);
			button.style("position", "absolute");
			button.style("border", "0");
			button.style("border-radius", "8px");
			button.style("background", "#1840f2");
			button.style("color", "#ffffff");
			button.style("font-family", siteFontFamily);
			button.style("font-size", "24px");
			button.style("font-weight", "900");
			button.style("letter-spacing", "0");
			button.style("cursor", "pointer");
			button.style("box-shadow", "0 6px 18px rgba(0, 0, 0, 0.18)");

			return button;
		}

		p.preload = function () {
			asset13 = p.loadImage("media/4x/Asset 36@4x.png");
			asset14 = p.loadImage("media/4x/Asset 34@4x.png");
			asset1Frames = [1, 2, 3, 4, 5, 6].map((index) => p.loadImage(`media/4x/Artboard ${index}.png`));
			asset1 = asset1Frames[0];
			asset2 = p.loadImage("media/4x/Asset 31@4x.png");
			durationAsset2 = p.loadImage("media/4x/Asset 37@4x.png");
			contentsAsset1 = p.loadImage("media/4x/Asset 29@4x.png");
			contentsAsset2 = p.loadImage("media/4x/Asset 30@4x.png");
			underlyingAsset1 = p.loadImage("media/4x/Asset 1@4x.png");
			underlyingAsset2 = p.loadImage("media/4x/Asset 31@4x.png");
			underlyingAsset24 = p.loadImage("media/4x/Asset 24@4x.png");
			underlyingAsset4 = p.loadImage("media/4x/Asset 39@4x.png");
			underlyingAsset5 = p.loadImage("media/4x/Asset 5@4x.png");
			underlyingAsset6 = p.loadImage("media/4x/Asset 6@4x.png");
			underlyingAsset7 = p.loadImage("media/4x/Asset 7@4x.png");
			underlyingAsset8 = p.loadImage("media/4x/Asset 38@4x.png");
			underlyingAsset9 = p.loadImage("media/4x/Asset 9@4x.png");
		};

		p.setup = function () {
			const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
			canvas.parent("sketch-canvas");

			p.pixelDensity(1);
			p.angleMode(p.DEGREES);
			p.imageMode(p.CENTER);
			p.textFont(siteFontFamily);
			setupPanelSpinSounds();
			createRedDisplacementBackground();

			Contents.x = p.width;
			Contents.targetX = p.width;
			Duration.x = p.width;
			Duration.targetX = p.width;
			timeOfDayButton = makePanelButton("Submit", handleTimeOfDayButton);
			contentsButton = makePanelButton("Submit", handleContentsButton);
			durationButton = makePanelButton("Submit", handleDurationButton);
			timeOfDayTextElement = makeTimeOfDayTextElement();
			contentsTextElement = makeContentsTextElement();
			durationQuestionElement = makeDurationTextElement("duration-question-text");
			durationValueElement = makeDurationTextElement("duration-value-text");
			wrappedReadyTextElement = makeWrappedReadyTextElement();

			updateBaseVectorComponent();
			updatePanelTarget(TimeOfDay);
			updatePanelTarget(Contents);
			updatePanelTarget(Duration);
			updateAllPanelButtons();
			syncTimeOfDayClickCount();
			syncContentsClickCount();
			syncDurationClickCount();
		};

		p.draw = function () {
			p.clear();
			updateRedDisplacementBackground();
			updateLayoutTransitions();
			updateBaseVectorComponent();
			updateAllRotations();
			updateAllHoverStates();
			updateAllScales();
			drawBaseVectorComponent();
			drawPanels();
			drawControlPanel();
			updateTimeOfDayTextElement();
			updateContentsTextElement();
			updateDurationTextElements();
			updateWrappedReadyTextElement();
		};

		p.mousePressed = function () {
			if (handleControlPanelMousePressed()) {
				return;
			}

			if (isMouseOnPanelAssetGroup(TimeOfDay)) {
				playPanelSpinSound();
				TimeOfDay.isAssetGroupPressed = true;
				TimeOfDay.assetGroupClickShrinkUntil = p.millis() + 140;
				setPanelScaleTarget(TimeOfDay, 0.9);
				rotatePanelAssetBy(TimeOfDay, 1, 120);
				rotatePanelAssetBy(TimeOfDay, 2, -360);
				TimeOfDayClickCount = TimeOfDayClickCount + 1;
				TimeOfDayAssetAnimationCount = TimeOfDayAssetAnimationCount + 1;
				syncTimeOfDayClickCount();
				return;
			}

			if (isMouseOnPanelAssetGroup(Contents)) {
				playPanelSpinSound();
				Contents.isAssetGroupPressed = true;
				Contents.assetGroupClickShrinkUntil = p.millis() + 140;
				setPanelScaleTarget(Contents, 0.9);
				rotatePanelAssetBy(Contents, 1, 120);
				rotatePanelAssetBy(Contents, 2, -360);
				ContentsClickCount = ContentsClickCount + 1;
				syncContentsClickCount();
				return;
			}

			if (isMouseOnPanelAssetGroup(Duration)) {
				playPanelSpinSound();
				Duration.isAssetGroupPressed = true;
				Duration.assetGroupClickShrinkUntil = p.millis() + 140;
				setPanelScaleTarget(Duration, 0.9);
				rotatePanelAssetBy(Duration, 1, 120);
				rotatePanelAssetBy(Duration, 2, -360);
				DurationClickCount = DurationClickCount + 1;
				syncDurationClickCount();
			}
		};

		p.mouseDragged = function () {
			if (controlPanel.isSliderDragging && isControlPanelInteractive()) {
				updateControlPanelSliderValue(p.mouseX);
			}
		};

		p.mouseReleased = function () {
			controlPanel.isSliderDragging = false;
			controlPanel.isSubmitPressed = false;
			TimeOfDay.isAssetGroupPressed = false;
			Contents.isAssetGroupPressed = false;
			Duration.isAssetGroupPressed = false;
		};

		p.windowResized = function () {
			p.resizeCanvas(p.windowWidth, p.windowHeight);
			createRedDisplacementBackground();
			syncControlPanelAfterResize();
			updateBaseVectorComponent();
			updatePanelTarget(TimeOfDay);
			updatePanelTarget(Contents);
			updatePanelTarget(Duration);
			updateAllPanelButtons();
		};
	};

	registerQuanP5Instance(new p5(sketch));
})();

// ---- Combined from sketch2.js ----
(function () {
  const sketch = function (p) {
      const numFrames = 8;
      const wheelScale = 0.8;
      const mobileBreakpointPx = 768;
      const transitionPhases = { expandEnd: 0.42, slideEnd: 0.8 };
      
      let imgFrames = [];
      let patternLayer;
      let patternBase;
      let patternSeed = 1;
      let diskMotion = { ox: 0, oy: 0, spin: 1, scale: 1 };
      let introState = { diskIn: 0 };
      
      let hoverState = { main: false, left: false, right: false };
      let isIndexPageActive = false;
      let isSketch2Active = false;
      let sketch2Version = "version2";
      
      let scrollScene = {
        started: false,
        active: false,
        completed: false,
        direction: 1,
        durationMs: 1200,
        progress: 0,
        completedAtMs: 0
      };
      
      let scrollInput = {
        delta: 0,
        threshold: 120,
        cooldownMs: 1500,
        lastNavMs: 0
      };

      function isSketch2SectionInView() {
        const section = document.getElementById('sketch2-section');

        if (!section) return false;
        const bounds = section.getBoundingClientRect();
        return bounds.top <= window.innerHeight * 0.55 && bounds.bottom >= window.innerHeight * 0.45;
      }
      
      function preload() {
        for (let i = 0; i < numFrames; i++) {
          imgFrames[i] = p.loadImage(`media/wrapped1_${i}.png`);
        }
      }
      
      function setup() {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(document.getElementById('sketch2-canvas') || document.getElementById('p5-bg') || document.body);
        p.angleMode(p.DEGREES);
        p.imageMode(p.CENTER);
        p.noStroke();
        createPatternLayer();
        setupScrollTransitionControl();
        initIntroAnimations();
        window.dispatchEvent(new CustomEvent('sketch2:started'));
      }
      
      function draw() {
        p.clear();
        animatePatternDisplacement(p.frameCount * 0.006);
        p.imageMode(p.CORNER);
        p.image(patternLayer, 0, 0);
        p.imageMode(p.CENTER);
      
        const isMobileLayout = p.width <= 900;
        const targetCircleX = isMobileLayout ? p.width * 0.5 : p.width * 0.28;
        const circleY = isMobileLayout ? p.height * 0.58 : p.height * 0.8;
        const mobileWheelScale = isMobileLayout ? 0.78 : 1;
        const baseR = ((p.min(p.width, p.height) * 0.96) / 1.5) * wheelScale * mobileWheelScale;
        const circleX = p.lerp(-baseR * 1.5, targetCircleX, introState.diskIn);
      
        updateDiskInteraction(diskMotion, circleX, circleY, baseR);
      
        if (scrollScene.active || scrollScene.completed) {
          updateScrollSceneProgress();
          drawScrollTransitionScene(circleX, circleY, baseR);
          updateCircleHoverState(circleX, circleY, baseR);
          return;
        }
      
        updateTransitionCenterText(0);
        drawMainDisk(circleX + diskMotion.ox, circleY + diskMotion.oy, baseR * diskMotion.scale);
        updateCircleHoverState(circleX, circleY, baseR);
      }
      
      function handleIndexPageVisibility(event) {
        const data = event.data;
        if (!data || data.type !== 'pageVisibility') return;
      
        const shouldBeActive = Boolean(data.isActive);
        if (shouldBeActive === isIndexPageActive) return;
      
        isIndexPageActive = shouldBeActive;
      }
      
      function isPointInsideCircle(px, py, cx, cy, radius) {
        const dx = px - cx;
        const dy = py - cy;
        return dx * dx + dy * dy <= radius * radius;
      }
      
      function updateCircleHoverState(circleX, circleY, baseR) {
        const nextHoverState = { main: false, left: false, right: false };
      
        if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
          hoverState = nextHoverState;
          return;
        }
      
        if (!scrollScene.active && !scrollScene.completed) {
          nextHoverState.main = isPointInsideCircle(
            p.mouseX,
            p.mouseY,
            circleX + diskMotion.ox,
            circleY + diskMotion.oy,
            baseR * diskMotion.scale
          );
        } else {
          const progress = scrollScene.progress;
          const { expandEnd, slideEnd } = transitionPhases;
      
          if (progress < expandEnd) {
            const k = p.constrain(progress / expandEnd, 0, 1);
            const growR = p.lerp(baseR * diskMotion.scale, p.max(p.width, p.height) * 1.35, k);
            nextHoverState.main = isPointInsideCircle(
              p.mouseX,
              p.mouseY,
              circleX + diskMotion.ox,
              circleY + diskMotion.oy,
              growR
            );
          }
      
          const slideK = p.constrain((progress - expandEnd) / (slideEnd - expandEnd), 0, 1);
          if (slideK > 0) {
            const sideDiskLayout = getSideDiskLayout(slideK, baseR * diskMotion.scale);
            const { r, left, right } = sideDiskLayout;
      
            nextHoverState.left =
              p.mouseX <= p.width * 0.5 && isPointInsideCircle(p.mouseX, p.mouseY, left.cx, left.cy, r);
            nextHoverState.right =
              p.mouseX >= p.width * 0.5 && isPointInsideCircle(p.mouseX, p.mouseY, right.cx, right.cy, r);
          }
        }
      
        hoverState = nextHoverState;
      }
      
      function startScrollTransition(direction) {
        scrollScene.started = true;
        scrollScene.active = true;
        scrollScene.direction = direction;
        if (direction > 0 && scrollScene.progress <= 0) scrollScene.progress = 0;
        if (direction < 0) scrollScene.completed = false;
        scrollScene.completedAtMs = 0;
        setSketch2CopyHidden(direction > 0);
        if (direction < 0) setSketch2Frame2TextVisible(false);
        scrollInput.delta = 0;
      }

      function setSketch2CopyHidden(isHidden) {
        const textElements = document.querySelectorAll('.sketch2-copy');

        textElements.forEach((element) => {
          element.classList.toggle('is-hidden', isHidden);
        });
      }

      function setSketch2Frame2TextVisible(isVisible) {
        const frame2Text = document.querySelector('.sketch2-frame2-text');

        if (!frame2Text) return;
        frame2Text.classList.toggle('is-visible', isVisible);
      }
      
      function tryScrollBoundary(now, deltaY, message) {
        if (now - scrollInput.lastNavMs < scrollInput.cooldownMs) return true;
      
        scrollInput.delta += deltaY;
        const crossedThreshold =
          deltaY > 0
            ? scrollInput.delta > scrollInput.threshold
            : scrollInput.delta < -scrollInput.threshold;
      
        if (crossedThreshold) {
          window.parent.postMessage(message, '*');
          scrollInput.lastNavMs = now;
          scrollInput.delta = 0;
        }
      
        return true;
      }
      
      function setupScrollTransitionControl() {
        window.addEventListener('wheel', (event) => {
          if (!isSketch2Active || !isSketch2SectionInView()) {
            return;
          }

          const now = Date.now();
      
          if (event.deltaY > 0 && !scrollScene.active && !scrollScene.completed) {
            event.preventDefault();
            startScrollTransition(1);
            return;
          }
      
          if (event.deltaY < 0 && (scrollScene.completed || (scrollScene.active && scrollScene.progress > 0))) {
            event.preventDefault();
            startScrollTransition(-1);
            return;
          }
      
          if (event.deltaY > 0 && scrollScene.completed && !scrollScene.active) {
            event.preventDefault();
            if (now - scrollScene.completedAtMs < 300) {
              scrollInput.delta = 0;
              return;
            }
            tryScrollBoundary(now, event.deltaY, 'scrollDown');
            return;
          }
      
          if (event.deltaY < 0 && !scrollScene.started && !scrollScene.active && !scrollScene.completed) {
            event.preventDefault();
            tryScrollBoundary(now, event.deltaY, 'scrollUp');
            return;
          }
      
          if ((event.deltaY > 0 && scrollInput.delta < 0) || (event.deltaY < 0 && scrollInput.delta > 0)) {
            scrollInput.delta = 0;
          }
      
          if (scrollScene.active) event.preventDefault();
        }, { passive: false });
      }
      
      window.addEventListener('message', handleIndexPageVisibility);
      window.addEventListener('untangle:sketch2-activate', (event) => {
        if (event.detail && event.detail.version) {
          sketch2Version = event.detail.version;
        }

        isSketch2Active = true;
        isIndexPageActive = true;
      });
      
      function updateScrollSceneProgress() {
        if (!scrollScene.active) return;
      
        const step = (p.deltaTime / scrollScene.durationMs) * scrollScene.direction;
        scrollScene.progress = p.constrain(scrollScene.progress + step, 0, 1);
      
        if (scrollScene.progress >= 1 && scrollScene.direction > 0) {
          scrollScene.active = false;
          scrollScene.completed = true;
          scrollScene.completedAtMs = Date.now();
          scrollInput.delta = 0;
          setSketch2Frame2TextVisible(true);
        }
      
        if (scrollScene.progress <= 0 && scrollScene.direction < 0) {
          scrollScene.active = false;
          scrollScene.completed = false;
          scrollScene.started = false;
          scrollScene.completedAtMs = 0;
          scrollInput.delta = 0;
          setSketch2Frame2TextVisible(false);
        }
      }
      
      function drawScrollTransitionScene(circleX, circleY, baseR) {
        const progress = scrollScene.progress;
        const { expandEnd, slideEnd } = transitionPhases;
      
        updateHeroTextTransition(progress, expandEnd);
      
        if (progress < expandEnd) {
          const k = p.constrain(progress / expandEnd, 0, 1);
          const growR = p.lerp(baseR * diskMotion.scale, p.max(p.width, p.height) * 1.35, k);
          drawMainDisk(
            circleX + diskMotion.ox,
            circleY + diskMotion.oy,
            growR,
            1.15,
            1 - smoothstep01(k)
          );
        }
      
        const slideK = p.constrain((progress - expandEnd) / (slideEnd - expandEnd), 0, 1);
        drawSideHalfCircles(slideK, smoothstep01(slideK), baseR * diskMotion.scale);
      
        const textK = p.constrain((progress - slideEnd) / (1 - slideEnd), 0, 1);
        updateTransitionCenterText(smoothstep01(textK));
      }
      
      function drawSideHalfCircles(k, alphaK = 1, diskRadius) {
        const { r, left, right } = getSideDiskLayout(k, diskRadius);
      
        drawClippedMainDisk(left.cx, left.cy, r, left.clipX, left.clipY, left.clipW, left.clipH, alphaK);
        drawClippedMainDisk(
          right.cx,
          right.cy,
          r,
          right.clipX,
          right.clipY,
          right.clipW,
          right.clipH,
          alphaK
        );
      }

      function getSideDiskLayout(k, diskRadius) {
        const r = diskRadius * (p.width <= mobileBreakpointPx ? 0.98 : 0.9);
        const slideK = p.constrain(k, 0, 1);
        const clipOverlap = p.width <= mobileBreakpointPx ? p.width * 0.2 : p.width * 0.12;
        const leftClip = { clipX: 0, clipY: 0, clipW: p.width * 0.5 + clipOverlap, clipH: p.height };
        const rightClip = { clipX: p.width * 0.5 - clipOverlap, clipY: 0, clipW: p.width * 0.5 + clipOverlap, clipH: p.height };

        if (p.width <= mobileBreakpointPx) {
          return {
            r,
            left: {
              cx: p.lerp(-2 * r, p.width * 0.02, slideK),
              cy: p.lerp(p.height + 2 * r, p.height * 0.76, slideK),
              ...leftClip
            },
            right: {
              cx: p.lerp(p.width + 2 * r, p.width * 0.98, slideK),
              cy: p.lerp(-2 * r, p.height * 0.24, slideK),
              ...rightClip
            }
          };
        }

        const cy = p.height * 0.5;
        return {
          r,
          left: {
            cx: p.lerp(-2 * r, p.width * 0.02, slideK),
            cy,
            ...leftClip
          },
          right: {
            cx: p.lerp(p.width + 2 * r, p.width * 0.98, slideK),
            cy,
            ...rightClip
          }
        };
      }
      
      function drawClippedMainDisk(cx, cy, radius, clipX, clipY, clipW, clipH, alphaK = 1) {
        const ctx = p.drawingContext;
        ctx.save();
        ctx.beginPath();
        ctx.rect(clipX, clipY, clipW, clipH);
        ctx.clip();
        drawMainDisk(cx, cy, radius, 1, alphaK);
        ctx.restore();
      }
      
      function setOpacity(targets, alpha) {
        const opacity = p.constrain(alpha, 0, 1).toFixed(3);
        if (!targets) return;
      
        if (typeof targets.forEach === 'function') {
          targets.forEach((el) => {
            el.style.opacity = opacity;
          });
          return;
        }
      
        targets.style.opacity = opacity;
      }
      
      function updateTransitionCenterText(alphaK) {
        setOpacity(document.getElementById('transition-center-text'), alphaK);
      }
      
      function updateHeroTextTransition(progress, phaseExpandEnd) {
        const heroText = document.querySelectorAll('.hero-text h1, .hero-text h2');
        if (heroText.length === 0) return;
      
        setOpacity(heroText, 1 - smoothstep01(p.constrain(progress / phaseExpandEnd, 0, 1)));
      }
      
      function smoothstep01(t) {
        const x = p.constrain(t, 0, 1);
        return x * x * (3 - 2 * x);
      }
      
      function drawMainDisk(cx, cy, radius, spinMultiplier = 1, opacity = 1) {
        p.push();
        p.drawingContext.globalAlpha = p.constrain(opacity, 0, 1);
        p.translate(cx, cy);
      
        drawDiskBase(radius);
      
        const rot1 = p.frameCount * 1.2 * diskMotion.spin * spinMultiplier;
        const rot2 = -p.frameCount * 1.8 * diskMotion.spin * spinMultiplier;
        const rot3 = p.frameCount * 2.4 * diskMotion.spin * spinMultiplier;
      
        p.push();
        p.rotate(rot1);
        drawRingGrid(12, radius * 0.75, radius * 0.28, '#F0374D', '#F3868D', false, true);
        drawRingInSlices(12, radius * 0.75, radius * 0.28, 0.18, 0.72, 0);
        p.pop();
      
        p.push();
        p.rotate(rot2);
        drawRingGrid(10, radius * 0.48, radius * 0.22, '#F3868D', '#F0374D', false, false);
        drawRingInSlices(10, radius * 0.48, radius * 0.22, -0.12, 0.58, 0, -18);
        p.pop();
      
        p.push();
        p.rotate(rot3);
        drawRingGrid(8, radius * 0.22, radius * 0.16, '#F0374D', '#F3868D', true, true);
        drawRingInSlices(8, radius * 0.22, radius * 0.16, 0.22, 0.58, 0);
        p.pop();
      
        drawDynamicCenter(radius);
        p.pop();
      }
      
      function initIntroAnimations() {
        if (!window.gsap) { introState.diskIn = 1; return; }
      
        const tl = gsap.timeline();
        tl.to(introState, {
          diskIn: 1,
          duration: 1.5,
          ease: 'power3.out'
        });
      
        const heroText = document.querySelectorAll('.hero-text h1, .hero-text h2');
        if (heroText.length > 0) {
          gsap.set(heroText, { opacity: 0, y: 50 });
          tl.to(heroText, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.15
          }, '-=1.0');
        }
      }
      
      function createPatternLayer() {
        patternBase = p.createGraphics(p.windowWidth, p.windowHeight);
        patternLayer = p.createGraphics(p.windowWidth, p.windowHeight);
        patternBase.pixelDensity(1);
        patternLayer.pixelDensity(1);
        regenerateBluePattern();
      }
      
      function regenerateBluePattern() {
        const g = patternBase;
        const w = g.width;
        const h = g.height;
      
        p.randomSeed(patternSeed);
        p.noiseSeed(patternSeed);
        g.clear();
        g.background(173, 242, 24, 242);
        drawAbstractLeftBlue(g, 0, 0, w, h);
      }
      
      function drawAbstractLeftBlue(g, x, y, w, h) {
        const cols = p.floor(p.map(p.noise(patternSeed * 0.13), 0, 1, 12, 20));
        const rows = p.floor(p.map(p.noise(patternSeed * 0.29), 0, 1, 26, 42));
        const cw = w / cols;
        const ch = h / rows;
      
        g.noStroke();
      
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const noiseVal = p.noise(i * 0.1 + patternSeed * 0.03, j * 0.1 + patternSeed * 0.03);
      
            if (noiseVal < 0.4) g.fill(245, 255, 120, 140);
            else if (noiseVal < 0.7) g.fill(200, 255, 30, 150);
            else g.fill(140, 250, 0, 150);
      
            g.rect(x + i * cw, y + j * ch, cw + 1, ch + 1);
          }
        }
      
        const overlayCount = p.floor(cols * rows * 0.24);
        for (let n = 0; n < overlayCount; n++) {
          const rx = p.floor(p.random(cols));
          const ry = p.floor(p.random(rows));
          const rw = cw * p.random(0.6, 1.4);
          const rh = ch * p.random(0.6, 1.4);
          const r = p.random();
      
          if (r < 0.33) g.fill(255, 255, 150, 90);
          else if (r < 0.66) g.fill(180, 255, 40, 100);
          else g.fill(130, 240, 10, 110);
      
          g.rect(x + rx * cw, y + ry * ch, rw, rh);
        }
      }
      
      function animatePatternDisplacement(t) {
        const w = patternLayer.width;
        const h = patternLayer.height;
      
        patternLayer.clear();
        patternLayer.image(patternBase, 0, 0);
      
        for (let y = 0; y < h;) {
          const bandH = p.floor(p.map(p.noise(y * 0.009 + t * 0.75), 0, 1, 18, 60));
          const shift = p.map(p.noise(y * 0.013 + t * 0.9), 0, 1, -44, 44);
          patternLayer.copy(patternBase, 0, y, w, bandH, shift, y, w, bandH);
          y += bandH;
        }
      
        for (let i = 0; i < 7; i++) {
          const by = p.floor(p.map(p.noise(i * 0.7 + t * 0.6), 0, 1, 0, h - 40));
          const bh = p.floor(p.map(p.noise(i * 1.4 + t * 0.5), 0, 1, 24, 92));
          const bx = p.floor(p.map(p.noise(i * 2.1 + t * 0.55), 0, 1, 0, w - 140));
          const bw = p.floor(p.map(p.noise(i * 2.8 + t * 0.4), 0, 1, 100, 240));
          const sx = p.floor(p.map(p.noise(i * 3.2 + t), 0, 1, -58, 58));
          patternLayer.copy(patternBase, bx, by, bw, bh, bx + sx, by, bw, bh);
        }
      }
      
      function easeDiskMotionToRest(state) {
        state.ox = p.lerp(state.ox, 0, 0.08);
        state.oy = p.lerp(state.oy, 0, 0.08);
        state.spin = p.lerp(state.spin, 1, 0.05);
        state.scale = p.lerp(state.scale, 1, 0.08);
      }
      
      function updateDiskInteraction(state, cx, cy, r) {
        if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
          easeDiskMotionToRest(state);
          return;
        }
      
        const dx = cx - p.mouseX;
        const dy = cy - p.mouseY;
        const d = p.sqrt(dx * dx + dy * dy);
        const near = p.constrain(1 - d / (r * 1.45), 0, 1);
      
        if (near <= 0) {
          easeDiskMotionToRest(state);
          return;
        }
      
        const ang = p.atan2(dy, dx);
        const push = near * near * p.min(42, r * 0.12);
        state.ox = p.lerp(state.ox, p.cos(ang) * push, 0.14);
        state.oy = p.lerp(state.oy, p.sin(ang) * push, 0.14);
        state.spin = p.lerp(state.spin, 0.94 + near * 0.12, 0.06);
        state.scale = p.lerp(state.scale, 1 + near * 0.035, 0.12);
      }
      
      function drawRingInSlices(
        count,
        radius,
        thickness,
        speed,
        scaleFactor,
        radialOffset = 0,
        angleOffset = 0
      ) {
        const angleStep = 360 / count;
        const imgH = thickness * scaleFactor;
        const slotCenterRadius = radius + radialOffset;
        const t = p.millis() * 0.06 * p.abs(speed);
      
        for (let i = 0; i < count; i++) {
          p.push();
          p.rotate(i * angleStep + angleStep / 2 + angleOffset);
          p.translate(0, -slotCenterRadius);
      
          let frameIndex = p.floor(t + i) % numFrames;
          if (speed < 0) frameIndex = numFrames - 1 - frameIndex;
      
          const currentImg = imgFrames[frameIndex];
          if (currentImg) {
            const finalH = imgH * (1 + p.sin(p.frameCount * 3 + i * 20) * 0.035);
            p.image(currentImg, 0, 0, finalH * (currentImg.width / currentImg.height), finalH);
          } else {
            p.fill('red');
            p.circle(0, 0, imgH);
          }
      
          p.pop();
        }
      }
      
      function drawRingGrid(
        count,
        radius,
        thickness,
        colorA,
        colorB,
        isInnerMono = false,
        showDividers = true
      ) {
        p.push();
      
        const angleStep = 360 / count;
        const outerD = radius * 2 + thickness;
        const innerD = radius * 2 - thickness;
        const fillA = isInnerMono ? '#F0374D' : colorA;
        const fillB = isInnerMono ? '#F3868D' : colorB;
      
        p.noStroke();
      
        for (let i = 0; i < count; i++) {
          p.fill(i % 2 === 0 ? fillA : fillB);
          p.arc(0, 0, outerD, outerD, i * angleStep, (i + 1) * angleStep + 0.5, p.PIE);
        }
      
        if (showDividers) {
          p.stroke('#F0374D');
          p.strokeWeight(isInnerMono ? 1.2 : 1);
          for (let i = 0; i < count; i++) {
            p.push();
            p.rotate(i * angleStep);
            p.line(0, -radius - thickness * 0.5, 0, -radius + thickness * 0.5);
            p.pop();
          }
        }
      
        if (isInnerMono) {
          p.noFill();
          p.stroke('#F0374D');
          p.strokeWeight(1.5);
          p.circle(0, 0, outerD - 2);
          p.circle(0, 0, innerD + 2);
        }
      
        p.noStroke();
        p.pop();
      }
      
      function drawDiskBase(radius) {
        p.push();
      
        const numStripes = 64;
        const angleStep = 360 / numStripes;
        p.rotate(-p.frameCount * 0.6);
      
        for (let i = 0; i < numStripes; i++) {
          p.fill(i % 2 === 0 ? '#FAFAFA' : '#F0374D');
          p.arc(0, 0, radius * 2, radius * 2, i * angleStep, (i + 1) * angleStep + 0.5, p.PIE);
        }
      
        p.pop();
      
        p.fill('#FAFAFA');
        p.circle(0, 0, radius * 1.8);
      
        p.push();
        p.noFill();
        p.stroke('#FAFAFA');
        p.strokeWeight(2);
        for (let i = 0; i < 5; i++) {
          const rr = p.map(i, 0, 4, radius * 0.28, radius * 0.82);
          p.circle(0, 0, rr * 2 + p.sin(p.frameCount * 1.2 + i * 30) * 3);
        }
        p.noStroke();
        p.pop();
      }
      
      function drawDynamicCenter(radius) {
        p.push();
      
        const t = p.frameCount;
      
        p.push();
        p.rotate(-t * 1.2);
        for (let i = 0; i < 18; i++) {
          p.push();
          p.rotate(i * 20);
          p.stroke(i % 2 === 0 ? '#FFFFFF' : '#FAFAFA');
          p.strokeWeight(2);
          p.line(0, -radius * 0.04, 0, -(radius * 0.09 + p.sin(t * 4 + i * 15) * radius * 0.01));
          p.pop();
        }
        p.pop();
      
        p.push();
        p.rotate(t * 1.8);
        for (let i = 0; i < 6; i++) {
          p.push();
          p.rotate(i * 60);
          p.translate(0, -radius * 0.11 + p.sin(t * 3 + i * 40) * 3);
          p.fill('#FAFAFA');
          p.circle(0, 0, radius * 0.018);
          p.pop();
        }
        p.pop();
      
        p.fill('#FFFFFF');
        p.circle(0, 0, radius * 0.11 * (1 + p.sin(t * 3.5) * 0.08));
      
        p.fill('#FAFAFA');
        p.circle(0, 0, radius * 0.05 * (1 + p.sin(t * 2.2 + 40) * 0.06));
        p.circle(0, 0, radius * 0.018);
        p.pop();
      }
      
      function windowResized() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        createPatternLayer();
      }
      
      function mousePressed() {
        if (isSketch2Active && p.mouseY >= 0 && p.mouseY <= p.height) {
          patternSeed++;
          regenerateBluePattern();
        }
      }
      

      p.preload = preload;
      p.setup = setup;
      p.draw = draw;
      p.windowResized = windowResized;
      p.mousePressed = mousePressed;
  };

  registerQuanP5Instance(new p5(sketch));
})();

// ---- Combined from sketch3.js ----
(() => {
  const sketch = (p) => {
    const frameCountTotal = 8;
    const imgs = [];
    const rings = [
      { r: 0.55, n: 12, rr: 0.75, th: 0.28, a: "#0038FF", b: "#0031DF", mono: false, div: true, s: 0.18, sf: 0.72, off: 0 },
      { r: -0.75, n: 10, rr: 0.48, th: 0.22, a: "#0031DF", b: "#0038FF", mono: false, div: false, s: -0.12, sf: 0.58, off: -18 },
      { r: 1.05, n: 8, rr: 0.22, th: 0.16, a: "#0038FF", b: "#0031DF", mono: true, div: true, s: 0.22, sf: 0.58, off: 0 }
    ];

    let patternBase;
    let patternLayer;
    let slots = [];
    let seed = 1;
    let scene = { target: 0, current: 0 };
    let wheelDelta = 0;
    let lastWheelMs = 0;
    let scrollBound = { name: null, reachedAt: 0 };
    let section;

    p.preload = () => {
      for (let i = 0; i < frameCountTotal; i += 1) {
        imgs[i] = p.loadImage(
          `media/wrapped5_${i}.png`,
          () => {},
          () => console.warn(`Missing media/wrapped5_${i}.png`)
        );
      }
    };

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      const target = document.getElementById("sketch3-canvas");

      if (target) {
        canvas.parent(target);
      }

      canvas.elt.style.position = "absolute";
      canvas.elt.style.inset = "0";
      canvas.elt.style.width = "100%";
      canvas.elt.style.height = "100%";
      canvas.elt.style.zIndex = "0";

      section = document.getElementById("sketch3-section");
      p.pixelDensity(1);
      p.angleMode(p.DEGREES);
      p.imageMode(p.CENTER);
      p.noStroke();
      makePattern();
      buildSlots();
      initWheelControl();
    };

    p.draw = () => {
      p.clear();
      scene.current = p.lerp(scene.current, scene.target, 0.12);

      if (section) {
        section.classList.toggle("grid-mode", scene.current > 0.4);
      }

      movePattern(p.frameCount * 0.006);
      p.imageMode(p.CORNER);
      p.image(patternLayer, 0, 0, p.width, p.height);
      p.imageMode(p.CENTER);

      if (scene.current > 0.01) {
        p.fill(242, 54, 83, 230 * scene.current);
        p.rect(0, 0, p.width, p.height);
      }

      drawMainDisk(scene.current);
      if (scene.current > 0.02) {
        drawGrid(scene.current);
      }
    };

    p.mouseMoved = () => {
    };

    p.mousePressed = () => {
      if (!isSectionActive()) return true;
      shuffleBackground();
      return false;
    };

    p.touchStarted = () => {
      if (!isSectionActive()) return true;
      shuffleBackground();
      return false;
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      makePattern();
      buildSlots();
    };

    function initWheelControl() {
      window.addEventListener(
        "wheel",
        (event) => {
          if (!isSectionActive()) return;
          handleWheel(event);
        },
        { passive: false }
      );
    }

    function handleWheel(event) {
      const now = Date.now();
      const deltaY = event.deltaY;
      const absDelta = Math.abs(deltaY);

      event.preventDefault();

      if (now - lastWheelMs < 1300) {
        wheelDelta = 0;
        return;
      }

      if (absDelta < 6) return;

      const previousTarget = scene.target;
      scene.target = p.constrain(scene.target + deltaY * 0.0015, 0, 1);

      const atBottom = scene.target === 1 && scene.current > 0.985;
      const atTop = scene.target === 0 && scene.current < 0.015;
      const safeDelta = p.constrain(deltaY, -80, 80);
      const boundName = atBottom ? "bottom" : atTop ? "top" : null;

      if (boundName !== scrollBound.name) {
        scrollBound = { name: boundName, reachedAt: boundName ? now : 0 };
        wheelDelta = 0;
      }

      const boundReady = boundName && now - scrollBound.reachedAt >= 300;

      if (atBottom && deltaY > 0) {
        if (!boundReady) return;
        wheelDelta += safeDelta;
      } else if (atTop && deltaY < 0) {
        if (!boundReady) return;
        wheelDelta += safeDelta;
      } else {
        wheelDelta = 0;
      }

      if (previousTarget === 1 && atBottom && wheelDelta > 250) {
        window.parent.postMessage("scrollDown", "*");
        lastWheelMs = now;
        wheelDelta = 0;
      } else if (previousTarget === 0 && atTop && wheelDelta < -250) {
        window.parent.postMessage("scrollUp", "*");
        lastWheelMs = now;
        wheelDelta = 0;
      }
    }

    function isSectionActive() {
      if (!section) return false;
      const bounds = section.getBoundingClientRect();
      return bounds.top <= window.innerHeight * 0.55 && bounds.bottom >= window.innerHeight * 0.45;
    }

    function drawMainDisk(mix) {
      const mobile = p.width <= 900;
      const mobileRadius = p.min(p.width * 0.48, p.height * 0.25);
      const cx = p.lerp(mobile ? p.width * 0.5 : p.width * 0.285, -p.width * 0.5, mix);
      const cy = p.lerp(mobile ? p.height * 0.75 : p.height * 0.5, -p.height * 0.15, mix);
      const radius = mobile ? mobileRadius : p.min(p.width, p.height) * 0.5 * 0.78;

      p.push();
      p.translate(cx, cy);
      drawBase(radius);

      for (const ring of rings) {
        p.push();
        p.rotate(p.frameCount * ring.r);
        drawRing(ring.n, radius * ring.rr, radius * ring.th, ring.a, ring.b, ring.mono, ring.div);
        drawSlices(ring.n, radius * ring.rr, radius * ring.th, ring.s, ring.sf, 0, ring.off);
        p.pop();
      }

      drawCenter(radius);
      p.pop();
    }

    function drawGrid(mix) {
      const alpha = p.constrain(p.map(mix, 0.08, 1, 0, 1), 0, 1);
      const time = p.frameCount * 0.013;

      if (p.width <= 900) {
        drawMobileGridAsset(alpha, time);
        return;
      }

      for (const slot of slots) {
        const x = slot.x + p.map(p.noise(slot.na + time * slot.fs), 0, 1, -slot.ox, slot.ox);
        const y = slot.y + p.map(p.noise(slot.nb + time * slot.fs), 0, 1, -slot.oy, slot.oy);
        const diameter = slot.d * (1 + p.sin(p.frameCount * slot.pr + slot.ph) * slot.pa);
        drawGridSlot(slot, x, y, diameter, alpha, time);
      }
    }

    function drawMobileGridAsset(alpha, time) {
      const slot = slots[0];
      if (!slot) return;

      const x = p.width * 0.5 + p.map(p.noise(slot.na + time * slot.fs), 0, 1, -slot.ox * 0.5, slot.ox * 0.5);
      const y = p.height * 0.52 + p.map(p.noise(slot.nb + time * slot.fs), 0, 1, -slot.oy * 0.5, slot.oy * 0.5);
      const baseDiameter = p.min(p.width * 0.72, p.height * 0.42);
      const diameter = baseDiameter * (1 + p.sin(p.frameCount * slot.pr + slot.ph) * slot.pa);

      drawGridSlot(slot, x, y, diameter, alpha, time);
    }

    function drawGridSlot(slot, x, y, diameter, alpha, time) {
      const glowDiameter = diameter * (1.03 + slot.ga * 0.4);
      const glowAlpha = 120 + p.sin(p.frameCount * slot.gr + slot.ph * 2) * 55;

      p.fill(34, 70, 239, glowAlpha * alpha * 0.45);
      p.circle(x, y, glowDiameter);
      p.fill(34, 70, 239, 255 * alpha);
      p.circle(x, y, diameter);

      const img = imgs[slotFrame(slot, p.frameCount, time)];
      if (!img || img.width <= 0) return;

      const imgHeight = diameter * (0.68 + slot.ij);
      const imgWidth = imgHeight * (img.width / img.height);
      const rotation = p.sin(p.frameCount * slot.rr + slot.ph) * slot.ra;

      p.drawingContext.save();
      p.drawingContext.beginPath();
      p.drawingContext.arc(x, y, diameter * 0.5, 0, Math.PI * 2);
      p.drawingContext.closePath();
      p.drawingContext.clip();
      p.tint(255, 255 * alpha);
      p.push();
      p.translate(x, y);
      p.rotate(rotation);
      p.image(img, 0, 0, imgWidth, imgHeight);
      p.pop();
      p.noTint();
      p.drawingContext.restore();
    }

    function slotFrame(slot, frame, time) {
      const delay = p.sin(frame * slot.dr + slot.ph) * slot.da;
      const drift = p.map(p.noise(slot.nb * 0.51 + time * slot.dnr), 0, 1, -slot.dna, slot.dna);
      const step = p.floor((frame * slot.sp * slot.dir + slot.fo + delay + drift) / slot.fh);
      let index = step + (p.noise(slot.na * 0.67 + time * 1.8) > slot.jt ? slot.ja : 0);

      if (slot.pp) {
        const span = (frameCountTotal - 1) * 2;
        let value = index % span;
        if (value < 0) value += span;
        return value < frameCountTotal ? value : span - value;
      }

      index %= frameCountTotal;
      return index < 0 ? index + frameCountTotal : index;
    }

    function gridPoints() {
      const diameter = p.min(p.width, p.height) * (p.width <= 900 ? 0.2 : 0.22);

      if (p.width <= 900) {
        return [
          [0.26, 0.28],
          [0.74, 0.28],
          [0.18, 0.5],
          [0.5, 0.5],
          [0.82, 0.5],
          [0.26, 0.73],
          [0.74, 0.73]
        ].map(([x, y]) => [x, y, diameter]);
      }

      const columns = [0.09, 0.25, 0.41, 0.58, 0.75, 0.92];
      const rows = [0.2, 0.47, 0.76];
      const rowMap = [[2, 3, 4, 5], [0, 1, 2, 3, 4, 5], [0, 1, 2, 5]];
      return rowMap.flatMap((row, rowIndex) => row.map((columnIndex) => [columns[columnIndex], rows[rowIndex], diameter]));
    }

    function buildSlots() {
      const randRange = (minValue, maxValue) => p.random(minValue, maxValue);

      p.randomSeed(seed * 97 + p.width * 0.13 + p.height * 0.19);
      p.noiseSeed(seed * 131 + p.width * 0.07 + p.height * 0.11);

      slots = gridPoints().map(([rx, ry, baseDiameter], index) => ({
        x: p.width * rx,
        y: p.height * ry,
        d: baseDiameter * randRange(0.9, 1.07),
        ph: randRange(360),
        fs: randRange(0.72, 1.35),
        pr: randRange(1.7, 3.4),
        pa: randRange(0.018, 0.05),
        ox: randRange(3, 16),
        oy: randRange(3, 13),
        na: randRange(1000),
        nb: randRange(1000),
        fo: index % frameCountTotal,
        sp: randRange(0.14, 0.36),
        fh: p.floor(randRange(1.2, 4.8)),
        dr: randRange(0.35, 1.35),
        da: randRange(1.8, 8.5),
        dnr: randRange(0.4, 1.6),
        dna: randRange(0.5, 3.6),
        dir: p.random() > 0.27 ? 1 : -1,
        pp: p.random() > 0.62,
        jt: randRange(0.82, 0.93),
        ja: p.floor(randRange(1, 3.8)),
        ga: randRange(0.35, 0.95),
        gr: randRange(1.8, 4.4),
        ij: randRange(-0.03, 0.06),
        ra: randRange(1.4, 5.5),
        rr: randRange(0.48, 1.2)
      }));
    }

    function drawSlices(count, radius, thickness, speed, scale, radial = 0, angleOffset = 0) {
      const step = 360 / count;
      const slotRadius = radius + radial;
      const baseHeight = thickness * scale;

      for (let i = 0; i < count; i += 1) {
        p.push();
        p.rotate(i * step + step * 0.5 + angleOffset);
        p.translate(0, -slotRadius);

        let index = p.floor(p.frameCount * speed + i) % frameCountTotal;
        if (index < 0) index += frameCountTotal;

        const img = imgs[index];
        if (img) {
          const imgHeight = baseHeight * (1 + p.sin(p.frameCount * 3 + i * 20) * 0.035) * 1.4;
          p.image(img, 0, 0, imgHeight * (img.width / img.height), imgHeight);
        } else {
          p.fill("red");
          p.circle(0, 0, baseHeight);
        }

        p.pop();
      }
    }

    function drawRing(count, radius, thickness, colorA, colorB, mono = false, dividers = true) {
      const step = 360 / count;
      const outerDiameter = radius * 2 + thickness;
      const innerDiameter = radius * 2 - thickness;

      p.push();
      p.noStroke();

      for (let i = 0; i < count; i += 1) {
        p.fill(mono ? (i % 2 ? "#0038FF" : "#0031DF") : i % 2 ? colorB : colorA);
        p.arc(0, 0, outerDiameter, outerDiameter, i * step, (i + 1) * step + 0.5, p.PIE);
      }

      if (dividers) {
        p.stroke("#0038FF");
        p.strokeWeight(mono ? 1.2 : 1);

        for (let i = 0; i < count; i += 1) {
          p.push();
          p.rotate(i * step);
          p.line(0, -radius - thickness * 0.5, 0, -radius + thickness * 0.5);
          p.pop();
        }
      }

      if (mono) {
        p.noFill();
        p.stroke("#0038FF");
        p.strokeWeight(1.5);
        p.circle(0, 0, outerDiameter - 2);
        p.circle(0, 0, innerDiameter + 2);
      }

      p.pop();
    }

    function drawBase(radius) {
      p.push();
      p.rotate(-p.frameCount * 0.12);

      const count = 24;
      const step = 360 / count;
      const rim = radius * 0.12;

      p.fill("#FAFAFA");
      p.circle(0, 0, radius * 2);
      p.fill("#F0374D");

      for (let i = 0; i < count; i += 1) {
        p.arc(0, 0, radius * 2, radius * 2, i * step, (i + 0.5) * step + 0.2, p.PIE);
      }

      p.fill("#1840F2");
      p.circle(0, 0, (radius - rim) * 2);
      p.noFill();
      p.stroke("#FAFAFA");
      p.strokeWeight(3);
      p.circle(0, 0, (radius - rim) * 2);
      p.pop();
    }

    function drawCenter(radius) {
      const time = p.frameCount;

      p.push();
      p.rotate(-time * 1.2);
      for (let i = 0; i < 18; i += 1) {
        p.push();
        p.rotate(i * 20);
        p.stroke(i % 2 ? "#CC263A" : "#F0374D");
        p.strokeWeight(2);
        p.line(0, -radius * 0.04, 0, -(radius * 0.09 + p.sin(time * 4 + i * 15) * radius * 0.01));
        p.pop();
      }
      p.pop();

      p.push();
      p.rotate(time * 1.8);
      for (let i = 0; i < 6; i += 1) {
        p.push();
        p.rotate(i * 60);
        p.translate(0, -radius * 0.11 + p.sin(time * 3 + i * 40) * 3);
        p.fill("#F0374D");
        p.circle(0, 0, radius * 0.018);
        p.pop();
      }
      p.pop();

      p.fill("#F0374D");
      p.circle(0, 0, radius * 0.11 * (1 + p.sin(time * 3.5) * 0.08));
      p.circle(0, 0, radius * 0.05 * (1 + p.sin(time * 2.2 + 40) * 0.06));
      p.fill("#FAFAFA");
      p.circle(0, 0, radius * 0.018);
    }

    function makePattern() {
      patternBase = p.createGraphics(p.width, p.height);
      patternLayer = p.createGraphics(p.width, p.height);
      patternBase.pixelDensity(1);
      patternLayer.pixelDensity(1);
      regenPattern();
    }

    function regenPattern() {
      const graphics = patternBase;
      const graphicsWidth = graphics.width;
      const graphicsHeight = graphics.height;

      p.randomSeed(seed);
      p.noiseSeed(seed);
      graphics.clear();
      graphics.background(242, 54, 83, 245);
      graphics.noStroke();

      const columns = p.floor(p.map(p.noise(seed * 0.11), 0, 1, 14, 22));
      const rows = p.floor(p.map(p.noise(seed * 0.23), 0, 1, 28, 46));
      const cellWidth = graphicsWidth / columns;
      const cellHeight = graphicsHeight / rows;

      for (let x = 0; x < columns; x += 1) {
        for (let y = 0; y < rows; y += 1) {
          const noiseValue = p.noise(x * 0.12 + seed * 0.03, y * 0.12 + seed * 0.03);

          if (noiseValue < 0.36) {
            graphics.fill(242, 54, 83, 140);
          } else if (noiseValue < 0.68) {
            graphics.fill(229, 29, 66, 150);
          } else {
            graphics.fill(186, 13, 53, 165);
          }

          graphics.rect(x * cellWidth, y * cellHeight, cellWidth + 1, cellHeight + 1);
        }
      }

      const overlayCount = p.floor(columns * rows * 0.34);

      for (let i = 0; i < overlayCount; i += 1) {
        const randomColumn = p.floor(p.random(columns));
        const randomRow = p.floor(p.random(rows));
        const roll = p.random();

        if (roll < 0.33) {
          graphics.fill(242, 54, 83, 90);
        } else if (roll < 0.66) {
          graphics.fill(229, 29, 66, 105);
        } else {
          graphics.fill(186, 13, 53, 120);
        }

        graphics.rect(
          randomColumn * cellWidth,
          randomRow * cellHeight,
          cellWidth * p.random(0.65, 1.45),
          cellHeight * p.random(0.65, 1.45)
        );
      }
    }

    function movePattern(time) {
      const layerWidth = patternLayer.width;
      const layerHeight = patternLayer.height;

      patternLayer.clear();
      patternLayer.image(patternBase, 0, 0);

      for (let y = 0; y < layerHeight;) {
        const bandHeight = p.floor(p.map(p.noise(y * 0.008 + time * 0.7), 0, 1, 16, 62));
        const shift = p.map(p.noise(y * 0.013 + time * 0.9), 0, 1, -76, 76);
        patternLayer.copy(patternBase, 0, y, layerWidth, bandHeight, shift, y, layerWidth, bandHeight);
        y += bandHeight;
      }

      for (let i = 0; i < 10; i += 1) {
        const blockY = p.floor(p.map(p.noise(i * 0.72 + time * 0.6), 0, 1, 0, layerHeight - 40));
        const blockHeight = p.floor(p.map(p.noise(i * 1.36 + time * 0.55), 0, 1, 22, 88));
        const blockX = p.floor(p.map(p.noise(i * 2.15 + time * 0.45), 0, 1, 0, layerWidth - 140));
        const blockWidth = p.floor(p.map(p.noise(i * 2.9 + time * 0.4), 0, 1, 90, 240));
        const shiftX = p.floor(p.map(p.noise(i * 3.1 + time), 0, 1, -96, 96));
        patternLayer.copy(patternBase, blockX, blockY, blockWidth, blockHeight, blockX + shiftX, blockY, blockWidth, blockHeight);
      }
    }

    function shuffleBackground() {
      seed += 1;
      regenPattern();
    }
  };

  registerQuanP5Instance(new p5(sketch));
})();

// ---- Combined from sketch4.js ----
(() => {
  const sketch = (p) => {
    // Step 1: Core constants/state shared across setup and draw.
    const numFrames = 8;
    const sketch4CopyByContent = {
      Excitement: {
        openingRightHtml: "<span>A large proportion of heavy internet users scroll to escape.</span>",
        openingLeftHtml: "<span>You scroll for the thrill of it.</span>",
        statement:
          "You're chasing something. But the excitement fades faster each time - and you need more of it to feel the same buzz. That's not enjoyment. That's a cycle.",
        additional:
          "Each scroll feels like a small reward. But rewards that come this easy and this fast train your brain to need constant stimulation. Real excitement takes longer to find. You're making it harder to feel it.",
      },
      Inspiration: {
        openingRightHtml: "<span>A large proportion of heavy internet users scroll to escape.</span>",
        openingLeftHtml: "<span>You scroll to feel inspired.</span>",
        statement:
          "You're looking for something. But consuming ideas isn't the same as having them. The more you scroll for inspiration, the less time you spend creating anything with it.",
        additional:
          "Each scroll feels like fuel. But it's borrowed energy - it belongs to someone else's idea, someone else's work. Real inspiration comes from stillness. You keep filling the space it needs to grow.",
      },
      StressRelief: {
        openingRightHtml:
          "<span>A large proportion of heavy internet users scroll to escape stress and negative emotions.</span>",
        openingLeftHtml: "<span>So do you.</span>",
        statement:
          "You're hurting yourself. Opening your phone doesn't clear your head - it delays it. Whatever you're avoiding is still waiting, and now you have less energy to face it.",
        additional:
          "Each scroll feels like a small relief. But you're not solving anything - you're postponing it. The stress compounds. The scroll gets longer. The problem stays.",
      },
    };
    let appliedContentState = null;
    let imgFrames = [];
    let patternLayer;
    let patternBase;
    let patternSeed = 1;
    let introState = {
      left: 0,
      right: 0,
      sceneMix: 0,
    };
    let sceneScroll = {
      target: 0,
      current: 0,
    };
    let scrollControl = {
      acc: 0,
      lastMsgMs: 0,
      boundName: null,
      boundReachedAt: 0,
    };
    let section = null;
    let diskMotion = {
      left: { ox: 0, oy: 0, spin: 1, scale: 1 },
      right: { ox: 0, oy: 0, spin: 1, scale: 1 },
    };
    let sceneElements = {
      leftBlock: null,
      rightBlock: null,
      centerMessage: null,
    };

    // Step 2: Create and attach the p5 canvas to a host element.
    function mountCanvas(canvasId) {
      const target = document.getElementById(canvasId);
      const renderer = p.createCanvas(p.windowWidth, p.windowHeight, p.P2D);

      if (target) {
        target.style.position = "absolute";
        target.style.inset = "0";
        target.style.width = "100%";
        target.style.height = "100%";
        target.style.overflow = "hidden";
        target.appendChild(renderer.elt);
      }

      renderer.elt.style.position = "absolute";
      renderer.elt.style.inset = "0";
      renderer.elt.style.zIndex = "0";
    }

    // Step 3: Load optional image frames used inside the rotating ring slices.
    function loadOptionalFrames() {
      imgFrames = new Array(numFrames).fill(null);
      for (let i = 0; i < numFrames; i++) {
        const framePath = `media/a_${i}.png`;
        p.loadImage(framePath, (img) => (imgFrames[i] = img), () => (imgFrames[i] = null));
      }
    }

    p.setup = () => {
      // Step 4: Initialize canvas, assets, rendering mode, and interaction hooks.
      mountCanvas("sketch4-canvas");
      loadOptionalFrames();
      section = document.getElementById("sketch4-section");

      p.angleMode(p.DEGREES);
      p.imageMode(p.CENTER);
      p.noStroke();

      createPatternLayer();
      initScrollSceneControl();
      cacheSceneElements();
      initIntroAnimations();
    };

    p.draw = () => {
      // Step 5: Draw animated background and update scene transition state.
      p.background(10, 16, 54);
      const visualBoost = 0;
      if (!patternLayer || !patternBase) {
        return;
      }
      animatePatternDisplacement(p.frameCount * 0.006, visualBoost);

      p.imageMode(p.CORNER);
      p.image(patternLayer, 0, 0);
      p.imageMode(p.CENTER);
      sceneScroll.current = p.lerp(sceneScroll.current, sceneScroll.target, 0.11);
      introState.sceneMix = sceneScroll.current;
      applySelectedContentCopy();
      updateSceneTextState(introState.sceneMix);

      // Step 6: Compute disk target positions for intro and scene transition.
      const layout = getDiskLayout(p.width, p.height);

      if (p.width <= 768) {
        drawMobileSingleDisk(visualBoost);
        return;
      }

      const leftBaseX = p.lerp(layout.left.x - p.width * 0.45, layout.left.x, introState.left);
      const leftBaseY = p.lerp(layout.left.y - p.height * 0.35, layout.left.y, introState.left);
      const rightBaseX = p.lerp(layout.right.x + p.width * 0.5, layout.right.x, introState.right);
      const rightBaseY = p.lerp(layout.right.y + p.height * 0.4, layout.right.y, introState.right);

      const leftScale = p.lerp(0.62, 1, introState.left);
      const rightScale = p.lerp(0.62, 1, introState.right);
      const startLeftRadius = layout.left.r * leftScale;
      const startRightRadius = layout.right.r * rightScale;
      const finalEqualRadius = p.min(p.width, p.height) * 0.52;

      const leftTargetX = -layout.left.r * 0.1;
      const leftTargetY = p.height * 0.52;
      const rightTargetX = p.width + layout.right.r * 0.1;
      const rightTargetY = p.height * 0.52;

      const sceneLeftX = p.lerp(leftBaseX, leftTargetX, introState.sceneMix);
      const sceneLeftY = p.lerp(leftBaseY, leftTargetY, introState.sceneMix);
      const sceneRightX = p.lerp(rightBaseX, rightTargetX, introState.sceneMix);
      const sceneRightY = p.lerp(rightBaseY, rightTargetY, introState.sceneMix);
      const sceneLeftRadius = p.lerp(startLeftRadius, finalEqualRadius, introState.sceneMix);
      const sceneRightRadius = p.lerp(startRightRadius, finalEqualRadius, introState.sceneMix);

      // Step 7: Apply mouse interaction and draw both animated disks.
      updateDiskInteraction(diskMotion.left, sceneLeftX, sceneLeftY, sceneLeftRadius);
      updateDiskInteraction(diskMotion.right, sceneRightX, sceneRightY, sceneRightRadius);

      drawAnimatedDisk(
        sceneLeftX + diskMotion.left.ox,
        sceneLeftY + diskMotion.left.oy,
        sceneLeftRadius * diskMotion.left.scale,
        p.frameCount,
        0,
        diskMotion.left.spin * (1 + visualBoost * 0.22)
      );
      drawAnimatedDisk(
        sceneRightX + diskMotion.right.ox,
        sceneRightY + diskMotion.right.oy,
        sceneRightRadius * diskMotion.right.scale,
        p.frameCount,
        140,
        diskMotion.right.spin * (1 + visualBoost * 0.22)
      );

    };

    function drawMobileSingleDisk(visualBoost) {
      const startRadius = p.min(p.width * 0.48, p.height * 0.25);
      const endRadius = startRadius * 1.08;
      const radius = p.lerp(startRadius, endRadius, introState.sceneMix);
      const x = p.lerp(p.width * 0.5, -endRadius * 1.3, introState.sceneMix);
      const y = p.height * 0.5;

      updateDiskInteraction(diskMotion.left, x, y, radius);
      drawAnimatedDisk(
        x + diskMotion.left.ox,
        y + diskMotion.left.oy,
        radius * diskMotion.left.scale,
        p.frameCount,
        0,
        diskMotion.left.spin * (1 + visualBoost * 0.22)
      );
    }

    // Step 9: Create off-screen layers used by the glitch background.
    function createPatternLayer() {
      patternBase = p.createGraphics(p.windowWidth, p.windowHeight);
      patternLayer = p.createGraphics(p.windowWidth, p.windowHeight);
      patternBase.pixelDensity(1);
      patternLayer.pixelDensity(1);
      regenerateBluePattern();
    }

    // Step 10: Build one static blue pattern frame used as displacement source.
    function regenerateBluePattern() {
      const g = patternBase;
      const w = g.width;
      const h = g.height;
      p.randomSeed(patternSeed);
      p.noiseSeed(patternSeed);

      g.clear();
      g.background(14, 42, 184, 245);
      drawAbstractLeftBlue(g, 0, 0, w, h);
    }

    // Step 11: Paint blocky color fields that form the base glitch texture.
    function drawAbstractLeftBlue(g, x, y, w, h) {
      const cols = p.floor(p.map(p.noise(patternSeed * 0.13), 0, 1, 12, 20));
      const rows = p.floor(p.map(p.noise(patternSeed * 0.29), 0, 1, 26, 42));
      const cw = w / cols;
      const ch = h / rows;

      g.noStroke();
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const noiseVal = p.noise(i * 0.1 + patternSeed * 0.03, j * 0.1 + patternSeed * 0.03);

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

      const overlayCount = p.floor(cols * rows * 0.35);
      for (let n = 0; n < overlayCount; n++) {
        const rx = p.floor(p.random(cols));
        const ry = p.floor(p.random(rows));
        const rw = cw * p.random(0.6, 1.4);
        const rh = ch * p.random(0.6, 1.4);
        const r = p.random();

        if (r < 0.33) g.fill(34, 102, 255, 95);
        else if (r < 0.66) g.fill(16, 52, 200, 105);
        else g.fill(6, 20, 88, 115);

        g.rect(x + rx * cw, y + ry * ch, rw, rh);
      }
    }

    // Step 12: Animate horizontal band and block displacement each frame.
    function animatePatternDisplacement(t, visualBoost = 0) {
      const w = patternLayer.width;
      const h = patternLayer.height;
      patternLayer.clear();
      patternLayer.image(patternBase, 0, 0);
      const shiftBoost = 1 + visualBoost * 1.35;

      for (let y = 0; y < h;) {
        const bandH = p.floor(p.map(p.noise(y * 0.009 + t * 0.75), 0, 1, 16, 64));
        const shift = p.map(p.noise(y * 0.013 + t * 0.9), 0, 1, -88 * shiftBoost, 88 * shiftBoost);
        patternLayer.copy(patternBase, 0, y, w, bandH, shift, y, w, bandH);
        y += bandH;
      }

      for (let i = 0; i < 11; i++) {
        const by = p.floor(p.map(p.noise(i * 0.7 + t * 0.6), 0, 1, 0, h - 40));
        const bh = p.floor(p.map(p.noise(i * 1.4 + t * 0.5), 0, 1, 24, 92));
        const bx = p.floor(p.map(p.noise(i * 2.1 + t * 0.55), 0, 1, 0, w - 140));
        const bw = p.floor(p.map(p.noise(i * 2.8 + t * 0.4), 0, 1, 90, 280));
        const sx = p.floor(p.map(p.noise(i * 3.2 + t), 0, 1, -120 * shiftBoost, 120 * shiftBoost));
        patternLayer.copy(patternBase, bx, by, bw, bh, bx + sx, by, bw, bh);
      }
    }

    // Step 13: Start the intro timeline for circles.
    function initIntroAnimations() {
      if (!window.gsap) {
        introState.left = 1;
        introState.right = 1;
        return;
      }

      const tl = window.gsap.timeline();
      tl.to(introState, {
        left: 1,
        duration: 1.25,
        ease: "power3.out",
      }).to(
        introState,
        {
          right: 1,
          duration: 1.25,
          ease: "power3.out",
        },
        "-=0.75"
      );
    }

    // Step 14: Create or cache DOM scene elements used outside the canvas.
    function cacheSceneElements() {
      const root = getSectionRoot();
      sceneElements.leftBlock = root.querySelector(".block-left");
      sceneElements.rightBlock = root.querySelector(".block-right");
      sceneElements.centerMessage = root.querySelector(".center-message");

      if (!sceneElements.centerMessage) {
        sceneElements.centerMessage = createCenterMessageElement();
      }

      applySelectedContentCopy(true);
    }

    function normalizeContentState(state) {
      if (state === "Stress Relief") return "StressRelief";
      return sketch4CopyByContent[state] ? state : "StressRelief";
    }

    function getSelectedContentState() {
      return normalizeContentState(window.ContentPanelState || "StressRelief");
    }

    function getSelectedContentCopy() {
      return sketch4CopyByContent[getSelectedContentState()] || sketch4CopyByContent.StressRelief;
    }

    function applySelectedContentCopy(force = false) {
      const selectedState = getSelectedContentState();
      if (!force && selectedState === appliedContentState) return;

      const copy = getSelectedContentCopy();

      if (sceneElements.rightBlock) {
        sceneElements.rightBlock.innerHTML = copy.openingRightHtml;
      }

      if (sceneElements.leftBlock) {
        sceneElements.leftBlock.innerHTML = copy.openingLeftHtml;
      }

      if (sceneElements.centerMessage) {
        applyCenterMessageContentAndStyle(sceneElements.centerMessage, copy);
      }

      appliedContentState = selectedState;
    }

    function getSectionRoot() {
      return section || document;
    }

    function isSketch4SectionInView() {
      if (!section) return false;
      const bounds = section.getBoundingClientRect();
      return bounds.top <= window.innerHeight * 0.55 && bounds.bottom >= window.innerHeight * 0.45;
    }

    // Step 15: Build the center-message element when it does not exist in HTML.
    function createCenterMessageElement() {
      const host = document.getElementById("sketch4-canvas");
      if (!host) {
        return null;
      }

      if (getComputedStyle(host).position === "static") {
        host.style.position = "relative";
      }

      const centerMessage = document.createElement("div");
      centerMessage.className = "center-message";
      host.appendChild(centerMessage);
      return centerMessage;
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    // Step 16: Apply text and visual style for the center overlay message.
    function applyCenterMessageContentAndStyle(centerMessage, copy) {
      centerMessage.innerHTML = `<h2>${escapeHtml(copy.statement)}</h2><p>${escapeHtml(copy.additional)}</p>`;
      Object.assign(centerMessage.style, {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: window.innerWidth <= 768 ? "min(88vw, 560px)" : "min(68vw, 760px)",
        textAlign: "center",
        lineHeight: "1.35",
        fontSize: "clamp(18px, 1.6vw, 44px)",
        fontFamily: '"forma-djr-text", "forma-djr-display", "Forma DJR", sans-serif',
        fontWeight: "400",
        color: "#ffffff",
        zIndex: "5",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        opacity: "1",
      });
    }

    // Step 17: Track wheel movement and convert it to a normalized scene progress.
    function initScrollSceneControl() {
      window.addEventListener(
        "wheel",
        (event) => {
          if (!isSketch4SectionInView()) return;

          event.preventDefault();

          const now = Date.now();
          const previousTarget = sceneScroll.target;
          const deltaY = event.deltaY;
          const absDelta = Math.abs(deltaY);

          if (now - scrollControl.lastMsgMs < 1000) {
            scrollControl.acc = 0;
            return;
          }

          if (absDelta < 6) return;

          sceneScroll.target = p.constrain(sceneScroll.target + deltaY * 0.0018, 0, 1);

          const atBottom = sceneScroll.target === 1 && sceneScroll.current > 0.985;
          const atTop = sceneScroll.target === 0 && sceneScroll.current < 0.015;
          const safeDelta = p.constrain(deltaY, -80, 80);
          const boundName = atBottom ? "bottom" : atTop ? "top" : null;

          if (boundName !== scrollControl.boundName) {
            scrollControl.boundName = boundName;
            scrollControl.boundReachedAt = boundName ? now : 0;
            scrollControl.acc = 0;
          }

          const boundReady = boundName && now - scrollControl.boundReachedAt >= 300;

          if (atBottom && deltaY > 0) {
            if (!boundReady) return;
            scrollControl.acc += safeDelta;
          } else if (atTop && deltaY < 0) {
            if (!boundReady) return;
            scrollControl.acc += safeDelta;
          } else {
            scrollControl.acc = 0;
          }

          if (previousTarget === 1 && atBottom && scrollControl.acc > 250) {
            window.parent.postMessage("scrollDown", "*");
            scrollControl.lastMsgMs = now;
            scrollControl.acc = 0;
          } else if (previousTarget === 0 && atTop && scrollControl.acc < -250) {
            window.parent.postMessage("scrollUp", "*");
            scrollControl.lastMsgMs = now;
            scrollControl.acc = 0;
          }
        },
        { passive: false }
      );
    }

    // Step 22: Drive side text fade and keep center message centered/visible.
    function updateSceneTextState(mix) {
      const sideOpacity = p.constrain(1 - mix * 1.35, 0, 1);
      const centerOpacity = p.constrain((mix - 0.28) / 0.62, 0, 1);

      if (sceneElements.leftBlock) {
        sceneElements.leftBlock.style.opacity = sideOpacity.toFixed(3);
      }

      if (sceneElements.rightBlock) {
        sceneElements.rightBlock.style.opacity = sideOpacity.toFixed(3);
      }

      if (sceneElements.centerMessage) {
        sceneElements.centerMessage.style.opacity = centerOpacity.toFixed(3);
        sceneElements.centerMessage.style.transform = "translate(-50%, -50%)";
      }
    }

    // Step 26: Smooth disk motion back to neutral values.
    function settleDiskMotion(state, motionLerp, spinLerp, scaleLerp) {
      state.ox = p.lerp(state.ox, 0, motionLerp);
      state.oy = p.lerp(state.oy, 0, motionLerp);
      state.spin = p.lerp(state.spin, 1, spinLerp);
      state.scale = p.lerp(state.scale, 1, scaleLerp);
    }

    // Step 27: Apply mouse-based offset, spin, and scale interaction to a disk.
    function updateDiskInteraction(state, cx, cy, r) {
      if (introState.sceneMix > 0.98) {
        settleDiskMotion(state, 0.12, 0.08, 0.08);
        return;
      }

      if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
        settleDiskMotion(state, 0.08, 0.05, 0.08);
        return;
      }

      const dx = cx - p.mouseX;
      const dy = cy - p.mouseY;
      const d = p.sqrt(dx * dx + dy * dy);
      const reach = r * 1.45;
      const near = p.constrain(1 - d / reach, 0, 1);

      if (near <= 0) {
        settleDiskMotion(state, 0.08, 0.05, 0.08);
        return;
      }

      const ang = p.atan2(dy, dx);
      const push = near * near * p.min(42, r * 0.12);
      const tx = p.cos(ang) * push;
      const ty = p.sin(ang) * push;

      state.ox = p.lerp(state.ox, tx, 0.14);
      state.oy = p.lerp(state.oy, ty, 0.14);
      state.spin = p.lerp(state.spin, 0.94 + near * 0.12, 0.06);
      state.scale = p.lerp(state.scale, 1 + near * 0.035, 0.12);
    }

    // Step 30: Compute circle layout for desktop and mobile breakpoints.
    function getDiskLayout(w, h) {
      if (w <= 768) {
        const d1 = Math.max(w * 0.6, 260);
        const d2 = Math.max(w * 0.8, 360);

        return {
          left: {
            x: -100 + d1 / 2,
            y: -100 + d1 / 2,
            r: d1 / 2,
          },
          right: {
            x: w + 150 - d2 / 2,
            y: h + 220 - d2 / 2,
            r: d2 / 2,
          },
        };
      }

      const vw = w / 100;
      const d1 = Math.max(50 * vw, 400);
      const d2 = Math.max(65 * vw, 500);

      return {
        left: {
          x: -10 * vw + d1 / 2,
          y: -15 * vw + d1 / 2,
          r: d1 / 2,
        },
        right: {
          x: w + 15 * vw - d2 / 2,
          y: h + 32 * vw - d2 / 2,
          r: d2 / 2,
        },
      };
    }

    // Step 31: Draw one full disk with base, rings, and center details.
    function drawAnimatedDisk(x, y, radius, t, phase = 0, spinMult = 1) {
      p.push();
      p.translate(x, y);

      drawDiskBase(radius, t, phase);

      const rot1 = (t + phase) * 0.55 * spinMult;
      const rot2 = -(t + phase) * 0.75 * spinMult;
      const rot3 = (t + phase) * 1.05 * spinMult;

      p.push();
      p.rotate(rot1);
      drawRingGrid(12, radius * 0.75, radius * 0.28, "#ADF218", "#D9FF7A", false, true);
      drawRingInSlices(12, radius * 0.75, radius * 0.28, 0.18, 0.72, t, phase);
      p.pop();

      p.push();
      p.rotate(rot2);
      drawRingGrid(10, radius * 0.48, radius * 0.22, "#D9FF7A", "#ADF218", false, false);
      drawRingInSlices(10, radius * 0.48, radius * 0.22, -0.12, 0.58, t, phase, -18);
      p.pop();

      p.push();
      p.rotate(rot3);
      drawRingGrid(8, radius * 0.22, radius * 0.16, "#ADF218", "#D9FF7A", true, true);
      drawRingInSlices(8, radius * 0.22, radius * 0.16, 0.22, 0.58, t, phase);
      p.pop();

      drawDynamicCenter(radius, t, phase);
      p.pop();
    }

    // Step 32: Draw image-based segments inside one ring.
    function drawRingInSlices(count, radius, thickness, speed, scaleFactor, t, phase, angleOffset = 0) {
      const angleStep = 360 / count;
      const slotCenterRadius = radius;
      const imgH = thickness * scaleFactor;

      for (let i = 0; i < count; i++) {
        p.push();
        p.rotate(i * angleStep + angleStep / 2 + angleOffset);
        p.translate(0, -slotCenterRadius);

        let frameIndex = p.floor((t + phase) * speed + i) % numFrames;
        if (frameIndex < 0) frameIndex += numFrames;

        const currentImg = imgFrames[frameIndex];

        if (currentImg && currentImg.width > 0) {
          const ratio = currentImg.width / currentImg.height;
          const pulse = 1 + p.sin((t + phase) * 3 + i * 20) * 0.035;

          const finalH = imgH * pulse;
          const imgW = finalH * ratio;

          p.image(currentImg, 0, 0, imgW, finalH);
        } else {
          p.fill("#0729C2");
          p.circle(0, 0, imgH * 0.75);
        }

        p.pop();
      }
    }

    // Step 33: Draw alternating ring wedges plus optional dividers.
    function drawRingGrid(count, radius, thickness, colorA, colorB, isInnerMono = false, showDividers = true) {
      p.push();

      const angleStep = 360 / count;
      const outerD = radius * 2 + thickness;
      const innerD = radius * 2 - thickness;

      p.noStroke();

      for (let i = 0; i < count; i++) {
        if (isInnerMono) {
          p.fill(i % 2 === 0 ? "#ADF218" : "#D9FF7A");
        } else {
          p.fill(i % 2 === 0 ? colorA : colorB);
        }

        p.arc(0, 0, outerD, outerD, i * angleStep, (i + 1) * angleStep + 0.5, p.PIE);
      }

      if (showDividers) {
        p.stroke("#ADF218");
        p.strokeWeight(isInnerMono ? 1.2 : 1);

        for (let i = 0; i < count; i++) {
          p.push();
          p.rotate(i * angleStep);
          p.line(0, -radius - thickness * 0.5, 0, -radius + thickness * 0.5);
          p.pop();
        }
      }

      if (isInnerMono) {
        p.noFill();
        p.stroke("#ADF218");
        p.strokeWeight(1.5);
        p.circle(0, 0, outerD - 2);
        p.circle(0, 0, innerD + 2);
      }

      p.noStroke();
      p.pop();
    }

    // Step 34: Draw the striped base and pulse circles behind ring layers.
    function drawDiskBase(radius, t, phase) {
      p.push();

      const numStripes = 64;
      const angleStep = 360 / numStripes;

      p.rotate(-(t + phase) * 0.12);

      for (let i = 0; i < numStripes; i++) {
        p.fill(i % 2 === 0 ? "#1A1A1A" : "#ADF218");
        p.arc(0, 0, radius * 2, radius * 2, i * angleStep, (i + 1) * angleStep + 0.5, p.PIE);
      }

      p.pop();

      p.fill("#FAFAFA");
      p.circle(0, 0, radius * 1.9);

      p.push();
      p.noFill();
      p.stroke("#0729C2");
      p.strokeWeight(2);

      for (let i = 0; i < 5; i++) {
        const rr = p.map(i, 0, 4, radius * 0.28, radius * 0.82);
        p.circle(0, 0, rr * 2 + p.sin((t + phase) * 1.2 + i * 30) * 3);
      }

      p.noStroke();
      p.pop();
    }

    // Step 35: Draw animated center spokes and pulse dots.
    function drawDynamicCenter(radius, t, phase) {
      p.push();

      p.push();
      p.rotate(-(t + phase) * 1.2);
      for (let i = 0; i < 18; i++) {
        p.push();
        p.rotate(i * 20);
        const len = radius * 0.09 + p.sin((t + phase) * 4 + i * 15) * radius * 0.01;
        p.stroke("#0729C2");
        p.strokeWeight(2);
        p.line(0, -radius * 0.04, 0, -len);
        p.pop();
      }
      p.pop();

      p.push();
      p.rotate((t + phase) * 1.8);
      for (let i = 0; i < 6; i++) {
        p.push();
        p.rotate(i * 60);
        p.translate(0, -radius * 0.11 + p.sin((t + phase) * 3 + i * 40) * 3);
        p.fill("#ADF218");
        p.circle(0, 0, radius * 0.018);
        p.pop();
      }
      p.pop();

      const pulse1 = 1 + p.sin((t + phase) * 3.5) * 0.08;
      const pulse2 = 1 + p.sin((t + phase) * 2.2 + 40) * 0.06;

      p.fill("#0729C2");
      p.circle(0, 0, radius * 0.11 * pulse1);

      p.fill("#ADF218");
      p.circle(0, 0, radius * 0.05 * pulse2);

      p.fill("#FAFAFA");
      p.circle(0, 0, radius * 0.018);

      p.pop();
    }

    // Step 36: Rebuild render targets on resize.
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      createPatternLayer();
    };

    // Step 37: Regenerate pattern seed on click for quick variation.
    p.mousePressed = () => {
      if (!isSketch4SectionInView()) return true;

      if (p.mouseY >= 0 && p.mouseY <= p.height) {
        patternSeed += 1;
        regenerateBluePattern();
      }

      return false;
    };
  };

  registerQuanP5Instance(new p5(sketch));
})();
