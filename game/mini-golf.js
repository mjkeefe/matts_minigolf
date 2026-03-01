import { playSound } from '../utils/audio.js';
import { showGameOver } from '../utils/leaderboard.js';
import {
    resolveMeadowTheme,
    drawBackdrop,
    drawSurfaceBase,
    drawSurfaceEdge,
    drawDecorLayer,
    drawWallSkin,
    drawAngledWallSkin
} from './courses/meadows/theme.js';

// =============================================================
//  Mini Golf — Main Game Module
//  Exports: init(container), cleanup()
// =============================================================

// ---- Constants ----
const FRICTION = 0.985;
const MIN_SPEED = 0.3;
const MAX_POWER = 200;
const SPEED_SCALE = 0.052;
const BALL_RADIUS = 7;
const HOLE_RADIUS = 15;     // slightly larger = more forgiving
const HOLE_SINK_DIST = 16;     // sink threshold
const MAX_STROKES = 10;
const WALL_THICKNESS = 16;
const BOUNCER_RADIUS = 28;
const BOUNCER_COLORS = ['#FF5722', '#FF9800', '#E91E63', '#9C27B0', '#2196F3', '#00BCD4'];
const RAMP_FORCE = 0.15;
const MAX_BALL_SPEED = 24; // prevent tunneling and "disappearing" ball

import { customHoles } from './courses/meadows/index.js';


// Fade-in state
let canvasAlpha = 1.0;
let fadingIn = false;

// Custom ball color selected by player
let ballColor = '#FFFFFF';


// Canvas dimensions — must fit on screen under the back button
const CANVAS_W = 680;
const CANVAS_H = 520;

// ---- Module-level State ----
let containerEl = null;
let canvas = null;
let ctx = null;
let animationId = null;
let isPaused = false;

// Game flow state
let holeCount = 0;   // 3, 9, or 18
let currentHole = 0;   // 1-based
let strokesPerHole = [];  // array of stroke counts per completed hole
let holeStrokes = 0;   // strokes on the current hole
let totalStrokes = 0;  // running total

// Course
let course = null;     // { tee, hole, outerWalls, obstacleWalls, ramps }

// Ball
let ball = null;       // { x, y, vx, vy, moving, angle }

// Aiming State
let kbAimAngle = 0;      // radians
let kbPowerValue = 0;    // 0 to MAX_POWER
let kbPowerActive = false;
let kbPowerDir = 1;      // 1 for up, -1 for down
let keys = {};           // keep track of pressed keys

// Phase flags
let gameActive = false; // true while playing a hole
let holeComplete = false; // true while "Hole Complete" overlay is shown

// Timeout handles
let animTimeout = null;

// =====================================================
//  Exported: init
// =====================================================
export function init() {
    containerEl = document.getElementById('game-container');
    resetState();
    const reviewHole = getReviewHoleFromQuery();
    if (reviewHole) {
        loadCustomHole(reviewHole);
        return;
    }
    showTitleScreen();
}

// =====================================================
//  Exported: cleanup
// =====================================================
export function cleanup() {
    stopLoop();
    clearTimeout(animTimeout);
    removeCanvasListeners();
    if (containerEl) containerEl.innerHTML = '';
    containerEl = null;
    canvas = null;
    ctx = null;
    course = null;
    ball = null;
    gameActive = false;
    holeComplete = false;
}

// =====================================================
//  State Reset
// =====================================================
function resetState() {
    holeCount = 0;
    currentHole = 0;
    strokesPerHole = [];
    holeStrokes = 0;
    totalStrokes = 0;
    course = null;
    ball = null;
    kbAimAngle = 0;
    kbPowerValue = 0;
    kbPowerActive = false;
    kbPowerDir = 1;
    keys = {};
    gameActive = false;
    holeComplete = false;
    isPaused = false;
    stopLoop();
    clearTimeout(animTimeout);
    removeCanvasListeners();
}

function getReviewHoleFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const reviewHole = Number.parseInt(params.get('reviewHole') || '', 10);
    if (!Number.isInteger(reviewHole)) return null;
    return customHoles[reviewHole] ? reviewHole : null;
}

function cloneCourseData(source) {
    if (typeof structuredClone === 'function') {
        return structuredClone(source);
    }
    return JSON.parse(JSON.stringify(source));
}

// =====================================================
//  Animation Loop Control
// =====================================================
function startLoop() {
    stopLoop();
    animationId = requestAnimationFrame(gameLoop);
}

function stopLoop() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

let lastTimestamp = 0;
function gameLoop(timestamp) {
    animationId = requestAnimationFrame(gameLoop);
    const dt = Math.min((timestamp - lastTimestamp) / 16.67, 3);
    lastTimestamp = timestamp;

    if (isPaused) {
        render();
        return;
    }

    // Fade-in effect on new hole
    if (fadingIn) {
        canvasAlpha = Math.min(canvasAlpha + 0.08, 1.0);
        if (canvasAlpha >= 1.0) fadingIn = false;
    }

    // Always animate moving walls and rotating obstacles even when ball isn't moving
    if (course && course.movingWalls) {
        updateMovingWalls(dt);
    }
    if (course && course.rotatingObstacles) {
        for (const ro of course.rotatingObstacles) {
            ro.angle = (ro.angle || 0) + (ro.speed || 0.02) * dt;
        }
    }

    if (!gameActive || holeComplete) {
        render();
        return;
    }

    handleInput(dt);
    update(dt);
    render();
}

function handleInput(dt) {
    if (!ball || ball.moving || isPaused) return;

    // Rotation
    const rotationSpeed = 0.05 * dt;
    if (keys['ArrowLeft']) {
        kbAimAngle -= rotationSpeed;
    }
    if (keys['ArrowRight']) {
        kbAimAngle += rotationSpeed;
    }

    // Power
    if (kbPowerActive) {
        kbPowerValue += kbPowerDir * 5 * dt;
        if (kbPowerValue >= MAX_POWER) {
            kbPowerValue = MAX_POWER;
            kbPowerDir = -1;
        } else if (kbPowerValue <= 0) {
            kbPowerValue = 0;
            kbPowerDir = 1;
        }
    }
}

// =====================================================
//  Title Screen
// =====================================================
function showTitleScreen() {
    stopLoop();
    removeCanvasListeners();
    containerEl.innerHTML = `
        <div id="mg-game">
            <div id="mg-title-screen" class="mg-screen">
                <div class="mg-logo-wrap">
                    <img src="game/logo.png" alt="Matt's Minigolf" class="mg-main-logo">
                </div>
                <button class="mg-play-btn" id="mg-start-btn">PLAY</button>
            </div>
        </div>
    `;

    document.getElementById('mg-start-btn').addEventListener('click', () => {
        playSound('bounce');
        showSelectionScreen();
    });
}

// =====================================================
//  Course Selection Screen
// =====================================================
function showSelectionScreen() {
    stopLoop();
    removeCanvasListeners();

    containerEl.innerHTML = `
        <div id="mg-game">
            <div id="mg-selection">
                <h1>⛳ Select Your Course</h1>
                <p class="mg-subtitle">Choose a course to begin your 18-hole journey</p>
                
                <div class="mg-course-grid">
                    <div class="mg-course-card" id="mg-course-meadows">
                        <div class="mg-course-image" style="background-image: url('game/meadows.png')"></div>
                        <div class="mg-course-info">
                            <span class="mg-course-tag">EASY</span>
                            <h3>Minigolf Meadows</h3>
                            <p>18 Holes • Par 54</p>
                            <button class="mg-course-btn">PLAY COURSE</button>
                        </div>
                    </div>
                    
                    <div class="mg-course-card locked">
                        <div class="mg-course-image" style="background-image: linear-gradient(45deg, #333, #111)">
                            <div class="mg-lock-icon">🔒</div>
                        </div>
                        <div class="mg-course-info">
                            <span class="mg-course-tag">COMING SOON</span>
                            <h3>Lava Lakes</h3>
                            <p>Coming Soon</p>
                        </div>
                    </div>
                </div>

                <div class="mg-color-picker-wrap">
                    <p>Customize Ball Color</p>
                    <div class="mg-color-picker">
                        <button class="mg-color-btn" data-color="#FFFFFF" style="background:#FFFFFF;"></button>
                        <button class="mg-color-btn" data-color="#FF4136" style="background:#FF4136;"></button>
                        <button class="mg-color-btn" data-color="#FF851B" style="background:#FF851B;"></button>
                        <button class="mg-color-btn" data-color="#FFDC00" style="background:#FFDC00;"></button>
                        <button class="mg-color-btn" data-color="#2ECC40" style="background:#2ECC40;"></button>
                        <button class="mg-color-btn" data-color="#0074D9" style="background:#0074D9;"></button>
                        <button class="mg-color-btn" data-color="#B10DC9" style="background:#B10DC9;"></button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll('.mg-color-btn').forEach(btn => {
        if (btn.dataset.color === ballColor) btn.classList.add('active');
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mg-color-btn').forEach(b => b.classList.remove('active'));
            const target = e.target.closest('.mg-color-btn');
            target.classList.add('active');
            ballColor = target.dataset.color;
            playSound('bounce');
        });
    });

    document.getElementById('mg-course-meadows').addEventListener('click', () => {
        startGame(18); // Start full 18 holes
    });
}

function loadCustomHole(holeNumber) {
    const holeData = customHoles[holeNumber];
    if (!holeData) {
        playSound('boing');
        const msgEl = document.getElementById('mg-selection-msg');
        if (msgEl) {
            msgEl.textContent = "Hole " + holeNumber + " not yet designed";
            setTimeout(() => { msgEl.textContent = ""; }, 3000);
        }
        return;
    }

    // Set game state for testing specific hole
    holeCount = 18;
    currentHole = holeNumber;
    strokesPerHole = []; // reset strokes since we're testing individually
    holeStrokes = 0;
    totalStrokes = 0;

    buildGameDOM();
    loadCourse(holeData);
    startLoop();
}

// =====================================================
//  Game Start
// =====================================================
function startGame(holes) {
    holeCount = holes;
    currentHole = 1;
    strokesPerHole = [];
    holeStrokes = 0;
    totalStrokes = 0;

    buildGameDOM();
    const holeData = customHoles[currentHole];
    if (holeData) {
        loadCourse(holeData);
        startLoop();
    }
}

// =====================================================
//  DOM Construction (HUD + Canvas)
// =====================================================
function buildGameDOM() {
    containerEl.innerHTML = `
        <div id="mg-game">
            <div id="mg-hud">
                <div class="mg-hud-item" id="mg-hole-counter">Hole <span id="mg-current-hole">1</span> of <span id="mg-total-holes">${holeCount}</span></div>
                <div class="mg-hud-item">Strokes: <span id="mg-strokes">0</span></div>
                <div class="mg-hud-item">Total: <span id="mg-total">0</span></div>
            </div>
            <div id="mg-canvas-wrap">
                <canvas id="mg-canvas" width="${CANVAS_W}" height="${CANVAS_H}"></canvas>
                <div id="mg-overlay" style="display:none;"></div>
            </div>
        </div>
    `;
    containerEl = document.getElementById('game-container'); // ensure ref

    canvas = document.getElementById('mg-canvas');
    ctx = canvas.getContext('2d');
    attachListeners();
    updateHUD();
}

// =====================================================
//  HUD Update
// =====================================================
function updateHUD() {
    const elHole = document.getElementById('mg-current-hole');
    const elTotal = document.getElementById('mg-total-holes');
    const elStrokes = document.getElementById('mg-strokes');
    const elTotalS = document.getElementById('mg-total');

    if (elHole) elHole.textContent = currentHole;
    if (elTotal) elTotal.textContent = holeCount;
    if (elStrokes) elStrokes.textContent = holeStrokes;
    if (elTotalS) elTotalS.textContent = totalStrokes;
}

// =====================================================
//  Ball Management
// =====================================================
function resetBall() {
    if (!course || !ball || holeComplete) return;

    ball.x = course.tee.x;
    ball.y = course.tee.y;
    ball.vx = 0;
    ball.vy = 0;
    ball.moving = false;
    ball.angle = 0;

    playSound('bounce');
    updateHUD();
    if (isPaused) resumeGame();
}

function checkBoundaries() {
    if (!ball || !ball.moving) return;

    // Radius buffer
    const margin = BALL_RADIUS * 4;

    // Check if way off canvas
    if (ball.x < -margin || ball.x > CANVAS_W + margin ||
        ball.y < -margin || ball.y > CANVAS_H + margin) {
        resetBall();
        return;
    }

    // Check if ball is on any floor
    let onFloor = false;

    // 1. Regular floors
    if (course.floors) {
        for (const f of course.floors) {
            if (ball.x >= f.x && ball.x <= f.x + f.w &&
                ball.y >= f.y && ball.y <= f.y + f.h) {
                onFloor = true;
                break;
            }
        }
    }

    // 2. Circular floors
    if (!onFloor && course.floorCircles) {
        for (const fc of course.floorCircles) {
            const dist = Math.hypot(ball.x - fc.x, ball.y - fc.y);
            // If it's a 'dark' circle (hole in floor), it's NOT floor
            if (dist <= fc.r) {
                if (fc.dark) {
                    onFloor = false;
                } else {
                    onFloor = true;
                }
            }
        }
    }

    // 3. Polygon floors
    if (!onFloor && course.floorPolygons) {
        // Simple point-in-polygon check or assumption it is on floor if not out of bounds
        // For now, if we have polygons, we trust the wall collisions more or canvas bounds
        onFloor = true;
    }

    // If we have floors defined but ball isn't on any of them, reset
    const hasDefinedFloors = (course.floors && course.floors.length > 0) ||
        (course.floorCircles && course.floorCircles.length > 0);

    if (hasDefinedFloors && !onFloor) {
        // Add a small delay/grace period if needed, or just reset
        resetBall();
    }
}

// =====================================================
//  Escape Menu & Pause Logic
// =====================================================
function toggleEscapeMenu() {
    if (holeComplete) return;
    if (isPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

function pauseGame() {
    isPaused = true;
    showEscapeMenu();
}

function resumeGame() {
    isPaused = false;
    const overlay = document.getElementById('mg-overlay');
    if (overlay) overlay.style.display = 'none';
}

function showEscapeMenu() {
    showOverlay(`
        <div id="mg-escape-menu">
            <h2>⏸️ Paused</h2>
            <div class="mg-menu-options">
                <button class="mg-menu-btn" id="mg-resume-btn">Resume</button>
                <button class="mg-menu-btn" id="mg-reset-ball-btn">Reset Ball</button>
                <button class="mg-menu-btn" id="mg-title-btn">Title Screen</button>
            </div>
        </div>
    `);

    document.getElementById('mg-resume-btn').addEventListener('click', resumeGame);
    document.getElementById('mg-reset-ball-btn').addEventListener('click', resetBall);
    document.getElementById('mg-title-btn').addEventListener('click', () => {
        cleanup();
        init();
    });
}

// =====================================================
//  Course Loading
// =====================================================
function loadCourse(c) {
    course = cloneCourseData(c);
    course.theme = resolveMeadowTheme(course.theme);
    holeStrokes = 0;
    holeComplete = false;

    // Fade-in transition for each new hole
    canvasAlpha = 0.0;
    fadingIn = true;

    // Place ball on tee
    ball = {
        x: course.tee.x,
        y: course.tee.y,
        vx: 0,
        vy: 0,
        moving: false,
        angle: 0
    };

    gameActive = true;

    const overlay = document.getElementById('mg-overlay');
    if (overlay) overlay.style.display = 'none';

    updateHUD();
}

// =====================================================
//  Update (Physics)
// =====================================================
function update(dt) {
    if (isPaused) return;
    if (!ball || !ball.moving) return;

    // Apply velocity
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // Spin based on speed
    const speed = Math.hypot(ball.vx, ball.vy);
    ball.angle += speed * dt * 0.1;

    // Apply friction
    ball.vx *= Math.pow(FRICTION, dt);
    ball.vy *= Math.pow(FRICTION, dt);

    // Stop check
    const newSpeed = Math.hypot(ball.vx, ball.vy);
    if (newSpeed < MIN_SPEED) {
        ball.vx = 0;
        ball.vy = 0;
        ball.moving = false;
    }

    // Clamp speed to prevent tunneling
    const spd = Math.hypot(ball.vx, ball.vy);
    if (spd > MAX_BALL_SPEED) {
        ball.vx = (ball.vx / spd) * MAX_BALL_SPEED;
        ball.vy = (ball.vy / spd) * MAX_BALL_SPEED;
    }

    // Rotating obstacle collision — CHECK FIRST so wall collision can catch accidental tunneling push
    if (course.rotatingObstacles) {
        for (const ro of course.rotatingObstacles) {
            const arms = ro.arms || 4;
            const speed = ro.speed || 0.02;
            for (let i = 0; i < arms; i++) {
                const a = (ro.angle || 0) + (i * Math.PI * 2 / arms);
                const x2 = ro.cx + Math.cos(a) * ro.length;
                const y2 = ro.cy + Math.sin(a) * ro.length;

                const dx = ball.x - ro.cx;
                const dy = ball.y - ro.cy;
                const dist = Math.hypot(dx, dy);

                const pushMag = speed * dist * 1.5;
                const pushX = -Math.sin(a) * pushMag;
                const pushY = Math.cos(a) * pushMag;

                const line = {
                    x1: ro.cx,
                    y1: ro.cy,
                    x2: x2,
                    y2: y2,
                    thickness: ro.width || 14
                };
                resolveCircleLine(ball, line, pushX, pushY);
            }
        }
    }

    // Wall collision
    handleWallCollisions();

    // Moving wall collision
    if (course.movingWalls) {
        for (const mw of course.movingWalls) {
            resolveCircleRect(ball, mw);
        }
    }

    // Bouncer collision
    handleBouncerCollisions();

    // Ramp boost
    if (course.ramps) {
        for (const r of course.ramps) {
            if (ball.x >= r.x && ball.x <= r.x + r.w &&
                ball.y >= r.y && ball.y <= r.y + r.h) {
                ball.vx += (r.forceX || 0) * RAMP_FORCE * dt;
                ball.vy += (r.forceY || 0) * RAMP_FORCE * dt;
            }
        }
    }

    // Hole detection
    handleHoleDetection();

    // Boundary/Fly-off check
    checkBoundaries();
}

// =====================================================
//  Moving Walls
// =====================================================
function updateMovingWalls(dt) {
    if (!course || !course.movingWalls) return;
    for (const mw of course.movingWalls) {
        if (mw.axis === 'x') {
            mw.x += mw.speed * mw.dir * dt;
            if (mw.x <= mw.min) { mw.x = mw.min; mw.dir = 1; }
            if (mw.x + mw.w >= mw.max + mw.w) { mw.x = mw.max; mw.dir = -1; }
        } else if (mw.axis === 'y') {
            mw.y += mw.speed * mw.dir * dt;
            if (mw.y <= mw.min) { mw.y = mw.min; mw.dir = 1; }
            if (mw.y + mw.h >= mw.max + mw.h) { mw.y = mw.max; mw.dir = -1; }
        }
    }
}

// =====================================================
//  Collision: Walls
// =====================================================
function handleWallCollisions() {
    if (!ball || !course) return;

    const allWalls = [...course.outerWalls, ...course.obstacleWalls];
    for (const wall of allWalls) {
        resolveCircleRect(ball, wall);
    }

    if (course.angledWalls) {
        for (const wall of course.angledWalls) {
            resolveCircleLine(ball, wall);
        }
    }
}

function resolveCircleLine(b, line, vPushX = 0, vPushY = 0) {
    const dx = line.x2 - line.x1;
    const dy = line.y2 - line.y1;
    const len = Math.hypot(dx, dy);

    if (len === 0) return;

    const toBallX = b.x - line.x1;
    const toBallY = b.y - line.y1;

    let nx = -dy / len;
    let ny = dx / len;

    if (toBallX * nx + toBallY * ny < 0) {
        nx = -nx;
        ny = -ny;
    }

    const dotLine = toBallX * (dx / len) + toBallY * (dy / len);
    const proj = Math.max(0, Math.min(len, dotLine));

    const nearX = line.x1 + proj * (dx / len);
    const nearY = line.y1 + proj * (dy / len);

    const distSq = (b.x - nearX) * (b.x - nearX) + (b.y - nearY) * (b.y - nearY);
    const halfThick = (line.thickness || WALL_THICKNESS) / 2;
    const minD = BALL_RADIUS + halfThick;

    if (distSq < minD * minD && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const overlap = minD - dist;

        const pushX = (b.x - nearX) / dist;
        const pushY = (b.y - nearY) / dist;

        b.x += pushX * (overlap + 1.2);
        b.y += pushY * (overlap + 1.2);

        const dot = b.vx * pushX + b.vy * pushY;
        if (dot < 0) {
            b.vx -= 2 * dot * pushX;
            b.vy -= 2 * dot * pushY;

            // Apply extra sweep push from rotation
            b.vx += vPushX;
            b.vy += vPushY;

            b.vx *= 0.88;
            b.vy *= 0.88;
            playSound('bounce');
        } else {
            // Even if already moving away, the sweep can still catch it
            b.vx += vPushX * 0.5;
            b.vy += vPushY * 0.5;
        }
    }
}

function resolveCircleRect(b, wall) {
    const { x: wx, y: wy, w: ww, h: wh } = wall;

    // Find nearest point on rect to ball center
    const nearX = Math.max(wx, Math.min(b.x, wx + ww));
    const nearY = Math.max(wy, Math.min(b.y, wy + wh));

    const dx = b.x - nearX;
    const dy = b.y - nearY;
    const dist = Math.hypot(dx, dy);

    if (dist >= BALL_RADIUS) return; // no collision

    if (dist === 0) {
        // Ball center is inside the rect (tunneled through at high speed).
        // Push out toward the nearest edge and reflect on that axis.
        const dLeft = b.x - wx;
        const dRight = (wx + ww) - b.x;
        const dTop = b.y - wy;
        const dBottom = (wy + wh) - b.y;
        const minD = Math.min(dLeft, dRight, dTop, dBottom);

        if (minD === dLeft) { b.x = wx - BALL_RADIUS - 0.5; b.vx = -Math.abs(b.vx); }
        else if (minD === dRight) { b.x = wx + ww + BALL_RADIUS + 0.5; b.vx = Math.abs(b.vx); }
        else if (minD === dTop) { b.y = wy - BALL_RADIUS - 0.5; b.vy = -Math.abs(b.vy); }
        else { b.y = wy + wh + BALL_RADIUS + 0.5; b.vy = Math.abs(b.vy); }

        b.vx *= 0.82;
        b.vy *= 0.82;
        playSound('bounce');
        return;
    }

    // Normal collision: push ball out along normal
    const overlap = BALL_RADIUS - dist;
    const nx = dx / dist;
    const ny = dy / dist;

    b.x += nx * (overlap + 1.2);
    b.y += ny * (overlap + 1.2);

    // Reflect velocity
    const dot = b.vx * nx + b.vy * ny;
    if (dot < 0) {
        b.vx -= 2 * dot * nx;
        b.vy -= 2 * dot * ny;
        b.vx *= 0.88;
        b.vy *= 0.88;
        playSound('bounce');
    }
}

// =====================================================
//  Collision: Circle Bouncers
// =====================================================
function handleBouncerCollisions() {
    if (!ball || !course) return;

    for (const bouncer of course.bouncers) {
        const dx = ball.x - bouncer.x;
        const dy = ball.y - bouncer.y;
        const dist = Math.hypot(dx, dy);
        const minDist = BALL_RADIUS + bouncer.r;

        if (dist < minDist && dist > 0) {
            // Push ball out of bouncer
            const nx = dx / dist;
            const ny = dy / dist;
            ball.x = bouncer.x + nx * (minDist + 1);
            ball.y = bouncer.y + ny * (minDist + 1);

            // Reflect velocity away from bouncer center
            const dot = ball.vx * nx + ball.vy * ny;
            ball.vx -= 2 * dot * nx;
            ball.vy -= 2 * dot * ny;

            // Extra snappy PINBALL bounce
            const spd = Math.hypot(ball.vx, ball.vy);
            const boost = Math.max(spd * 2.5, 12); // Send the ball flying fast
            if (spd > 0) {
                ball.vx = (ball.vx / spd) * boost;
                ball.vy = (ball.vy / spd) * boost;
            } else {
                ball.vx = nx * boost;
                ball.vy = ny * boost;
            }

            // Cap impulse to prevent tunneling
            const finalSpd = Math.hypot(ball.vx, ball.vy);
            if (finalSpd > MAX_BALL_SPEED * 1.5) {
                ball.vx = (ball.vx / finalSpd) * MAX_BALL_SPEED * 1.5;
                ball.vy = (ball.vy / finalSpd) * MAX_BALL_SPEED * 1.5;
            }

            playSound('boing');
        }
    }
}

// =====================================================
//  Hole Detection
// =====================================================
function handleHoleDetection() {
    if (!ball || !course || holeComplete) return;

    const dx = ball.x - course.hole.x;
    const dy = ball.y - course.hole.y;
    const dist = Math.hypot(dx, dy);

    if (dist < HOLE_SINK_DIST) {
        sinkBall();
    }
}

function sinkBall() {
    holeComplete = true;
    ball.moving = false;
    ball = null; // remove from rendering

    playSound('sink');
    setTimeout(() => playSound('collect'), 300);

    const isLastHole = (currentHole >= holeCount);

    strokesPerHole.push(holeStrokes);
    totalStrokes = strokesPerHole.reduce((a, b) => a + b, 0);

    if (isLastHole) {
        playSound('levelUp');
        setTimeout(() => playSound('gameOver'), 800);
        setTimeout(() => showScorecard(), 600);
    } else {
        showHoleCompleteOverlay();
    }
}

// =====================================================
//  Aiming & Shooting
// =====================================================
function attachListeners() {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
}

function removeCanvasListeners() {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
}

function onKeyDown(e) {
    keys[e.key] = true;
    if (e.key === 'Escape') {
        toggleEscapeMenu();
    }
    // Allow Spacebar to advance to next hole
    if (e.key === ' ' && holeComplete) {
        advanceToNextHole();
        return;
    }
    if (e.key === ' ' && gameActive && !holeComplete && ball && !ball.moving && !kbPowerActive) {
        kbPowerActive = true;
        kbPowerValue = 0;
        kbPowerDir = 1;
    }
}

function onKeyUp(e) {
    if (e.key === ' ' && kbPowerActive) {
        shoot();
        kbPowerActive = false;
        kbPowerValue = 0;
    }
    keys[e.key] = false;
}

function shoot() {
    if (!ball || kbPowerValue < 5) return;

    const speed = kbPowerValue * SPEED_SCALE;

    ball.vx = Math.cos(kbAimAngle) * speed;
    ball.vy = Math.sin(kbAimAngle) * speed;
    ball.moving = true;

    holeStrokes++;
    totalStrokes = strokesPerHole.reduce((a, b) => a + b, 0) + holeStrokes;
    updateHUD();
    playSound('shoot');

    // Hard stroke limit
    if (holeStrokes >= MAX_STROKES) {
        forceAdvanceHole();
    }
}

// =====================================================
//  Force Advance (max strokes)
// =====================================================
function forceAdvanceHole() {
    animTimeout = setTimeout(() => {
        if (!gameActive) return;
        playSound('hit');

        strokesPerHole.push(holeStrokes);
        totalStrokes = strokesPerHole.reduce((a, b) => a + b, 0);

        const isLastHole = (currentHole >= holeCount);
        if (isLastHole) {
            setTimeout(() => showScorecard(), 400);
        } else {
            showForceAdvanceMessage();
        }
    }, 1500); // wait for ball to move a bit first
}

function showForceAdvanceMessage() {
    showOverlay(`
        <h2 style="color:#ffdd00;">Moving On! 🏃</h2>
        <p>Max ${MAX_STROKES} strokes reached</p>
        <button class="mg-next-btn" id="mg-next-btn">Next Hole →</button>
    `);
    document.getElementById('mg-next-btn').addEventListener('click', advanceToNextHole);
}

// =====================================================
//  Hole Complete Overlay
// =====================================================
function showHoleCompleteOverlay() {
    showOverlay(`
        <h2>⛳ Hole Complete!</h2>
        <p>Strokes: <strong>${holeStrokes}</strong></p>
        <button class="mg-next-btn" id="mg-next-btn">Next Hole →</button>
    `);
    document.getElementById('mg-next-btn').addEventListener('click', advanceToNextHole);
}

function advanceToNextHole() {
    currentHole++;
    const holeData = customHoles[currentHole];
    if (holeData) {
        loadCourse(holeData);
    } else {
        showScorecard();
    }
    updateHUD();
}

// =====================================================
//  Scorecard & Game Over
// =====================================================
function showScorecard() {
    gameActive = false;
    stopLoop();

    let rows = strokesPerHole.map((s, i) => `
        <tr>
            <td style="color:#aaa;">Hole ${i + 1}</td>
            <td style="color:#fff; font-weight:bold;">${s}</td>
        </tr>
    `).join('');

    showOverlay(`
        <div id="mg-scorecard">
            <h2>📋 Scorecard</h2>
            <table>
                <thead>
                    <tr>
                        <th>Hole</th>
                        <th>Strokes</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
                <tfoot>
                    <tr class="mg-total-row">
                        <td>Total</td>
                        <td>${totalStrokes}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `);

    // After reading time, show the game over / leaderboard screen
    animTimeout = setTimeout(() => {
        const leaderboardKey = `mini-golf-${holeCount}`;
        showGameOver(leaderboardKey, totalStrokes, containerEl, () => {
            // Play Again → reset and show selection
            cleanup();
            init(containerEl);
        });
    }, 4000);
}

// =====================================================
//  Overlay Helper
// =====================================================
function showOverlay(html) {
    const overlay = document.getElementById('mg-overlay');
    if (!overlay) return;
    overlay.innerHTML = html;
    overlay.style.display = 'flex';
}

// =====================================================
//  Course Generation (Stage 2: Placeholder returning a simple test course)
// =====================================================
//  Rendering
// =====================================================
function render() {
    if (!ctx || !canvas) return;

    ctx.save();
    ctx.globalAlpha = canvasAlpha;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    if (!course) { ctx.restore(); return; }
    const courseTheme = course.theme || resolveMeadowTheme();
    drawBackdrop(ctx, courseTheme, CANVAS_W, CANVAS_H);

    ctx.fillStyle = courseTheme.palette.rough;
    ctx.fillRect(0, courseTheme.backdrop.horizonY - 6, CANVAS_W, CANVAS_H - courseTheme.backdrop.horizonY + 6);

    drawSurfaceBase(ctx, { course, courseTheme, canvasW: CANVAS_W, canvasH: CANVAS_H });
    drawSurfaceEdge(ctx, { course, courseTheme, canvasW: CANVAS_W, canvasH: CANVAS_H });
    drawDecorLayer(ctx, courseTheme.decor, courseTheme);

    drawRamps();
    drawRotatingObstacles();
    drawBouncers();
    drawHole();
    drawTee();
    drawWalls();
    drawBall();
    drawAimLine();
    drawPowerMeter();

    ctx.restore();
}

function drawWalls() {
    const allWalls = [...course.outerWalls, ...course.obstacleWalls];
    const wallStyle = course.theme?.wallStyle || {};
    const palette = course.theme?.palette || resolveMeadowTheme().palette;

    for (const w of allWalls) {
        drawWallSkin(ctx, w, wallStyle, palette);
    }

    if (course.angledWalls) {
        for (const w of course.angledWalls) {
            drawAngledWallSkin(ctx, w, wallStyle, palette, WALL_THICKNESS);
        }
    }

    // Moving walls — draw with a distinct red/orange "pong paddle" look
    if (course.movingWalls) {
        for (const w of course.movingWalls) {
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            ctx.fillRect(w.x + 3, w.y + 3, w.w, w.h);

            // Red-orange gradient body
            const grad = ctx.createLinearGradient(w.x, w.y, w.x, w.y + w.h);
            grad.addColorStop(0, '#FF5722');
            grad.addColorStop(1, '#E64A19');
            ctx.fillStyle = grad;
            ctx.fillRect(w.x, w.y, w.w, w.h);

            // Top highlight
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillRect(w.x, w.y, w.w, 3);
            ctx.fillRect(w.x, w.y, 3, w.h);

            // Bottom shadow
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(w.x, w.y + w.h - 3, w.w, 3);
            ctx.fillRect(w.x + w.w - 3, w.y, 3, w.h);
        }
    }
}

function drawRotatingObstacles() {
    if (!course || !course.rotatingObstacles) return;
    for (const ro of course.rotatingObstacles) {
        const arms = ro.arms || 4;
        const width = ro.width || 14;

        for (let i = 0; i < arms; i++) {
            const a = (ro.angle || 0) + (i * Math.PI * 2 / arms);
            const x2 = ro.cx + Math.cos(a) * ro.length;
            const y2 = ro.cy + Math.sin(a) * ro.length;

            // Shadow
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.lineWidth = width;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(ro.cx + 3, ro.cy + 3);
            ctx.lineTo(x2 + 3, y2 + 3);
            ctx.stroke();

            // Blade
            const grad = ctx.createLinearGradient(ro.cx, ro.cy, x2, y2);
            grad.addColorStop(0, '#FFFFFF');
            grad.addColorStop(1, '#DDDDDD');
            ctx.strokeStyle = grad;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(ro.cx, ro.cy);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Highlight
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(ro.cx, ro.cy);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // Center pivot
        ctx.fillStyle = '#FF5722';
        ctx.beginPath();
        ctx.arc(ro.cx, ro.cy, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawRamps() {
    if (!course || !course.ramps || course.ramps.length === 0) return;
    for (const r of course.ramps) {
        // Ramp background
        ctx.fillStyle = 'rgba(0, 200, 255, 0.25)';
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(r.x, r.y, r.w, r.h);

        // Arrow
        const cx = r.x + r.w / 2;
        const cy = r.y + r.h / 2;
        const fx = r.forceX || 0;
        const fy = r.forceY || 0;
        const fLen = Math.hypot(fx, fy);
        if (fLen === 0) continue;
        const ax = (fx / fLen) * 15;
        const ay = (fy / fLen) * 15;

        ctx.strokeStyle = 'rgba(0, 220, 255, 0.9)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - ax, cy - ay);
        ctx.lineTo(cx + ax, cy + ay);
        ctx.stroke();
        // Arrowhead
        const headLen = 6;
        const angle = Math.atan2(ay, ax);
        ctx.beginPath();
        ctx.moveTo(cx + ax, cy + ay);
        ctx.lineTo(cx + ax - headLen * Math.cos(angle - 0.5), cy + ay - headLen * Math.sin(angle - 0.5));
        ctx.moveTo(cx + ax, cy + ay);
        ctx.lineTo(cx + ax - headLen * Math.cos(angle + 0.5), cy + ay - headLen * Math.sin(angle + 0.5));
        ctx.stroke();
    }
}

function drawBouncers() {
    for (const b of course.bouncers) {
        const { x, y, r, color } = b;

        ctx.save();

        // Outer glow
        ctx.shadowColor = color;
        ctx.shadowBlur = 14;

        // Outer ring
        ctx.fillStyle = color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Inner mid ring
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.65, 0, Math.PI * 2);
        ctx.fill();

        // Center dot
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.28, 0, Math.PI * 2);
        ctx.fill();

        // Specular highlight
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

function drawHole() {
    const { x, y } = course.hole;
    const palette = course.theme?.palette || resolveMeadowTheme().palette;

    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(x + 1, y + 4, HOLE_RADIUS + 3, HOLE_RADIUS - 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = palette.cup;
    ctx.beginPath();
    ctx.arc(x, y, HOLE_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(249,235,200,0.35)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.strokeStyle = '#f0e2c5';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 34);
    ctx.stroke();

    ctx.fillStyle = palette.flag;
    ctx.beginPath();
    ctx.moveTo(x, y - 34);
    ctx.lineTo(x + 18, y - 28);
    ctx.lineTo(x, y - 18);
    ctx.closePath();
    ctx.fill();
}

function drawTee() {
    const { x, y } = course.tee;
    const palette = course.theme?.palette || resolveMeadowTheme().palette;
    const w = 34;
    const h = 44;
    const left = x - w / 2;
    const top = y - h / 2;

    ctx.fillStyle = 'rgba(71,47,26,0.22)';
    ctx.fillRect(left + 2, top + 4, w, h);

    const grad = ctx.createLinearGradient(left, top, left, top + h);
    grad.addColorStop(0, '#d8bf87');
    grad.addColorStop(1, palette.tee);
    ctx.fillStyle = grad;
    ctx.fillRect(left, top, w, h);

    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(left, top, w, 3);

    ctx.fillStyle = 'rgba(86,57,32,0.25)';
    for (let yLine = top + 8; yLine < top + h - 4; yLine += 8) {
        ctx.fillRect(left + 3, yLine, w - 6, 2);
    }
}

function drawBall() {
    if (!ball) return;

    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.angle);

    // Ball ambient drop shadow (centered slightly under)
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(0, 2, BALL_RADIUS + 1, 0, Math.PI * 2);
    ctx.fill();

    // Ball base color
    ctx.fillStyle = ballColor;
    ctx.beginPath();
    ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // 3D sphere shading overlay (inner shadow + highlight)
    const blurObj = ctx.createRadialGradient(-BALL_RADIUS * 0.3, -BALL_RADIUS * 0.3, BALL_RADIUS * 0.1, 0, 0, BALL_RADIUS);
    blurObj.addColorStop(0, 'rgba(255,255,255,0.6)');
    blurObj.addColorStop(0.5, 'rgba(255,255,255,0.1)');
    blurObj.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = blurObj;
    ctx.beginPath();
    ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Dimples
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    [[-3, -2], [3, -2], [0, 3], [-4, 2], [4, 2]].forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.arc(dx, dy, 1.2, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();
}

function drawAimLine() {
    if (!ball || ball.moving || holeComplete) return;

    const lineLen = 60;
    const nx = Math.cos(kbAimAngle);
    const ny = Math.sin(kbAimAngle);

    const endX = ball.x + nx * lineLen;
    const endY = ball.y + ny * lineLen;

    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();
}

function drawPowerMeter() {
    if (!kbPowerActive) return;

    const meterW = 20;
    const meterH = 150;
    const x = 610; // Slightly outside the main course area but inside the canvas
    const y = CANVAS_H / 2 - meterH / 2;

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(x, y, meterW, meterH);

    // Reversed Rainbow Ramp
    const powerHeight = (kbPowerValue / MAX_POWER) * meterH;
    const grad = ctx.createLinearGradient(x, y + meterH, x, y);
    grad.addColorStop(0, '#f0f'); // Magenta (bottom)
    grad.addColorStop(0.2, '#00f'); // Blue
    grad.addColorStop(0.4, '#0ff'); // Cyan
    grad.addColorStop(0.6, '#0f0'); // Green
    grad.addColorStop(0.8, '#ff0'); // Yellow
    grad.addColorStop(1, '#f00');   // Red (top)

    ctx.fillStyle = grad;
    ctx.fillRect(x, y + meterH - powerHeight, meterW, powerHeight);

    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, meterW, meterH);
}
