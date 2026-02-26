import { playSound } from '../utils/audio.js';
import { showGameOver } from '../utils/leaderboard.js';

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

// Aiming
let aiming = false;
let aimStart = null;  // { x, y } — mousedown position
let aimCurrent = null; // { x, y } — current mouse position

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
    aiming = false;
    aimStart = null;
    aimCurrent = null;
    gameActive = false;
    holeComplete = false;
    stopLoop();
    clearTimeout(animTimeout);
    removeCanvasListeners();
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

    // Fade-in effect on new hole
    if (fadingIn) {
        canvasAlpha = Math.min(canvasAlpha + 0.08, 1.0);
        if (canvasAlpha >= 1.0) fadingIn = false;
    }

    if (!gameActive || holeComplete) {
        render();
        return;
    }

    update(dt);
    render();
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
                <h1 class="mg-main-title">MINI GOLF</h1>
                <p class="mg-tagline">Putt your way to victory!</p>
                <button class="mg-play-btn" id="mg-start-btn">PLAY NOW</button>
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
                <h1>⛳ Mini Golf</h1>
                <p class="mg-subtitle">Customize your ball & choose course length</p>
                <div class="mg-color-picker">
                    <button class="mg-color-btn" data-color="#FFFFFF" style="background:#FFFFFF;"></button>
                    <button class="mg-color-btn" data-color="#FF4136" style="background:#FF4136;"></button>
                    <button class="mg-color-btn" data-color="#FF851B" style="background:#FF851B;"></button>
                    <button class="mg-color-btn" data-color="#FFDC00" style="background:#FFDC00;"></button>
                    <button class="mg-color-btn" data-color="#2ECC40" style="background:#2ECC40;"></button>
                    <button class="mg-color-btn" data-color="#0074D9" style="background:#0074D9;"></button>
                    <button class="mg-color-btn" data-color="#B10DC9" style="background:#B10DC9;"></button>
                    <button class="mg-color-btn" data-color="#111111" style="background:#111111; border: 2px solid #555;"></button>
                </div>
                <div class="mg-hole-buttons">
                    <button class="mg-hole-btn btn-3" id="mg-btn-3">
                        <span class="mg-hole-number">3</span>
                        <span class="mg-hole-label">Holes</span>
                    </button>
                    <button class="mg-hole-btn btn-9" id="mg-btn-9">
                        <span class="mg-hole-number">9</span>
                        <span class="mg-hole-label">Holes</span>
                    </button>
                    <button class="mg-hole-btn btn-18" id="mg-btn-18">
                        <span class="mg-hole-number">18</span>
                        <span class="mg-hole-label">Holes</span>
                    </button>
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

    document.getElementById('mg-btn-3').addEventListener('click', () => startGame(3));
    document.getElementById('mg-btn-9').addEventListener('click', () => startGame(9));
    document.getElementById('mg-btn-18').addEventListener('click', () => startGame(18));
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
    loadCourse(generateCourse());
    startLoop();
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

    canvas = document.getElementById('mg-canvas');
    ctx = canvas.getContext('2d');
    attachCanvasListeners();
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
//  Course Loading
// =====================================================
function loadCourse(c) {
    course = c;
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

    // Wall collision
    handleWallCollisions();

    // Bouncer collision
    handleBouncerCollisions();

    // Hole detection
    handleHoleDetection();
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

    b.x += nx * (overlap + 0.5);
    b.y += ny * (overlap + 0.5);

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
function attachCanvasListeners() {
    if (!canvas) return;
    // mousedown on canvas only (must click on/near the ball)
    canvas.addEventListener('mousedown', onMouseDown);
    // mousemove + mouseup on WINDOW so dragging outside the canvas works
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
}

function removeCanvasListeners() {
    if (!canvas) return;
    canvas.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
}

function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function onMouseDown(e) {
    if (!gameActive || holeComplete || !ball || ball.moving) return;

    const pos = getCanvasPos(e);
    const dx = pos.x - ball.x;
    const dy = pos.y - ball.y;

    // Must click near the ball to start aiming
    if (Math.hypot(dx, dy) <= BALL_RADIUS * 3) {
        aiming = true;
        aimStart = pos;
        aimCurrent = pos;
    }
}

function onMouseMove(e) {
    if (!aiming) return;
    aimCurrent = getCanvasPos(e);
}

function onMouseUp(e) {
    if (!aiming || !ball) return;

    const pos = getCanvasPos(e);
    shoot(pos);
    aiming = false;
    aimStart = null;
    aimCurrent = null;
}

function onMouseLeave() {
    // No longer cancels aim — mouse tracked at window level now
}


function shoot(releasePos) {
    if (!ball || !aimStart) return;

    // Drag vector: from release back to start (pull-back mechanic)
    const dragX = aimStart.x - releasePos.x;
    const dragY = aimStart.y - releasePos.y;
    const dragLen = Math.hypot(dragX, dragY);

    if (dragLen < 5) return; // too small, ignore

    // Power scaled to drag distance
    const power = Math.min(dragLen, MAX_POWER);
    const speed = power * SPEED_SCALE; // pixels/frame at 60fps equivalent

    ball.vx = (dragX / dragLen) * speed;
    ball.vy = (dragY / dragLen) * speed;
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
    loadCourse(generateCourse());
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
//  (Will be replaced with full procedural generation in Stage 8)
// =====================================================
function generateCourse() {
    const W = CANVAS_W;
    const H = CANVAS_H;
    const T = WALL_THICKNESS;
    const inner = { x: T, y: T, w: W - T * 2, h: H - T * 2 };

    // Outer walls: top, bottom, left, right
    const outerWalls = [
        { x: 0, y: 0, w: W, h: T }, // top
        { x: 0, y: H - T, w: W, h: T }, // bottom
        { x: 0, y: 0, w: T, h: H }, // left
        { x: W - T, y: 0, w: T, h: H }, // right
    ];

    // Pick a random layout style for variety
    const layout = Math.floor(Math.random() * 4);
    let tee, hole;

    switch (layout) {
        case 0: // Diagonal: bottom-left → top-right
            tee = { x: T + 50 + Math.random() * 80, y: H - T - 50 - Math.random() * 80 };
            hole = { x: W - T - 50 - Math.random() * 80, y: T + 50 + Math.random() * 80 };
            break;
        case 1: // Anti-diagonal: top-left → bottom-right
            tee = { x: T + 50 + Math.random() * 80, y: T + 50 + Math.random() * 80 };
            hole = { x: W - T - 50 - Math.random() * 80, y: H - T - 50 - Math.random() * 80 };
            break;
        case 2: // Horizontal dogleg: left-center → right-center
            tee = { x: T + 50 + Math.random() * 60, y: H / 2 + (Math.random() - 0.5) * 140 };
            hole = { x: W - T - 50 - Math.random() * 60, y: H / 2 + (Math.random() - 0.5) * 140 };
            break;
        case 3: // Vertical dogleg: top-center → bottom-center
            tee = { x: W / 2 + (Math.random() - 0.5) * 180, y: T + 50 + Math.random() * 60 };
            hole = { x: W / 2 + (Math.random() - 0.5) * 180, y: H - T - 50 - Math.random() * 60 };
            break;
        default:
            tee = { x: T + 80, y: H - T - 80 };
            hole = { x: W - T - 80, y: T + 80 };
    }

    // Clamp to playable area
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const pad = BALL_RADIUS + 10;
    tee.x = clamp(tee.x, T + pad, W - T - pad);
    tee.y = clamp(tee.y, T + pad, H - T - pad);
    hole.x = clamp(hole.x, T + pad, W - T - pad);
    hole.y = clamp(hole.y, T + pad, H - T - pad);

    // 1-2 obstacle walls
    const obstacleWalls = generateObstacleWalls(tee, hole, W, H, T);

    // 1-3 circle bouncers
    const bouncers = generateBouncers(tee, hole, W, H, T, obstacleWalls);

    return { tee, hole, outerWalls, obstacleWalls, bouncers };
}

function generateObstacleWalls(tee, hole, W, H, T) {
    const count = 2 + Math.floor(Math.random() * 3); // 2 to 4 obstacles for extra difficulty
    const walls = [];
    const margin = T + 40;
    const attempts = 50;

    for (let i = 0; i < count; i++) {
        for (let a = 0; a < attempts; a++) {
            const isHorz = Math.random() > 0.5;
            const ww = isHorz ? 80 + Math.random() * 120 : 16 + Math.random() * 20;
            const wh = isHorz ? 16 + Math.random() * 20 : 80 + Math.random() * 120;
            const wx = margin + Math.random() * (W - margin * 2 - ww);
            const wy = margin + Math.random() * (H - margin * 2 - wh);

            const wall = { x: wx, y: wy, w: ww, h: wh };

            // Don't block tee or hole directly
            if (circleOverlapsRect(tee, 40, wall)) continue;
            if (circleOverlapsRect(hole, 40, wall)) continue;

            // Don't overlap with previously placed obstacle walls
            let overlapsWall = false;
            for (const w of walls) {
                if (
                    wall.x < w.x + w.w + 15 &&
                    wall.x + wall.w + 15 > w.x &&
                    wall.y < w.y + w.h + 15 &&
                    wall.y + wall.h + 15 > w.y
                ) {
                    overlapsWall = true;
                    break;
                }
            }
            if (overlapsWall) continue;

            walls.push(wall);
            break;
        }
    }
    return walls;
}

function generateBouncers(tee, hole, W, H, T, obstacleWalls) {
    const count = 1 + Math.floor(Math.random() * 3); // 1, 2, or 3 bouncers
    const bouncers = [];
    const margin = T + BOUNCER_RADIUS + 30;
    const colorPool = [...BOUNCER_COLORS];

    for (let i = 0; i < count; i++) {
        for (let a = 0; a < 40; a++) {
            const bx = margin + Math.random() * (W - margin * 2);
            const by = margin + Math.random() * (H - margin * 2);
            const r = BOUNCER_RADIUS;
            const color = colorPool[Math.floor(Math.random() * colorPool.length)];

            // Keep clear of tee and hole
            if (Math.hypot(bx - tee.x, by - tee.y) < r + 50) continue;
            if (Math.hypot(bx - hole.x, by - hole.y) < r + 50) continue;

            // Keep clear of existing bouncers
            const tooClose = bouncers.some(b => Math.hypot(bx - b.x, by - b.y) < r * 3);
            if (tooClose) continue;

            // Keep clear of obstacle walls
            let hitsWall = false;
            if (obstacleWalls) {
                for (const w of obstacleWalls) {
                    if (circleOverlapsRect({ x: bx, y: by }, r + 15, w)) {
                        hitsWall = true;
                        break;
                    }
                }
            }
            if (hitsWall) continue;

            bouncers.push({ x: bx, y: by, r, color });
            break;
        }
    }
    return bouncers;
}

function circleOverlapsRect(circle, radius, rect) {
    const nearX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
    const nearY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
    const dx = circle.x - nearX;
    const dy = circle.y - nearY;
    return (dx * dx + dy * dy) < (radius * radius);
}

// =====================================================
//  Rendering
// =====================================================
function render() {
    if (!ctx) return;

    ctx.save();
    ctx.globalAlpha = canvasAlpha;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    if (!course) { ctx.restore(); return; }

    // Green background
    ctx.fillStyle = '#2E7D32';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Subtle mowing-stripe texture (alternating lighter strips)
    for (let i = 0; i < CANVAS_W; i += 40) {
        ctx.fillStyle = (Math.floor(i / 40) % 2 === 0)
            ? 'rgba(255,255,255,0.025)'
            : 'rgba(0,0,0,0.025)';
        ctx.fillRect(i, 0, 20, CANVAS_H);
    }

    drawBouncers();
    drawHole();
    drawTee();
    drawWalls();
    drawBall();
    drawAimLine();

    ctx.restore();
}

function drawWalls() {
    const allWalls = [...course.outerWalls, ...course.obstacleWalls];

    for (const w of allWalls) {
        // Shadow/depth on bottom-right edges
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(w.x + 3, w.y + 3, w.w, w.h);

        // Main white wall body
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(w.x, w.y, w.w, w.h);

        // Top-left highlight for 3D inset look
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillRect(w.x, w.y, w.w, 3);
        ctx.fillRect(w.x, w.y, 3, w.h);

        // Bottom-right shadow on wall face
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(w.x, w.y + w.h - 3, w.w, 3);
        ctx.fillRect(w.x + w.w - 3, w.y, 3, w.h);
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

    // Hole cup (black circle)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x, y, HOLE_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Hole rim
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Flag pole
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 32);
    ctx.stroke();

    // Flag
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.moveTo(x, y - 32);
    ctx.lineTo(x + 16, y - 26);
    ctx.lineTo(x, y - 20);
    ctx.closePath();
    ctx.fill();
}

function drawTee() {
    const { x, y } = course.tee;

    // Tee marker (yellow circle)
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FFA000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // "T" label
    ctx.fillStyle = '#000';
    ctx.font = 'bold 8px Segoe UI';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('T', x, y);
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
    if (!aiming || !ball || !aimStart || !aimCurrent) return;

    const dragX = aimStart.x - aimCurrent.x;
    const dragY = aimStart.y - aimCurrent.y;
    const dragLen = Math.hypot(dragX, dragY);

    if (dragLen < 5) return;

    const clampedLen = Math.min(dragLen, MAX_POWER);
    const nx = dragX / dragLen;
    const ny = dragY / dragLen;

    // Draw dashed line in shot direction
    const endX = ball.x + nx * clampedLen;
    const endY = ball.y + ny * clampedLen;

    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Power dot at end
    ctx.setLineDash([]);
    const powerFrac = clampedLen / MAX_POWER;
    ctx.fillStyle = `hsl(${120 - powerFrac * 120}, 100%, 60%)`;
    ctx.beginPath();
    ctx.arc(endX, endY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}
