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
const RAMP_FORCE = 0.15;
const MAX_BALL_SPEED = 24; // prevent tunneling and "disappearing" ball

// Helper: generate angledWalls approximating a circle
function makeCircleWalls(cx, cy, r, n) {
    const walls = [];
    for (let i = 0; i < n; i++) {
        const a1 = (i / n) * Math.PI * 2;
        const a2 = ((i + 1) / n) * Math.PI * 2;
        walls.push({
            x1: Math.round(cx + r * Math.cos(a1)),
            y1: Math.round(cy + r * Math.sin(a1)),
            x2: Math.round(cx + r * Math.cos(a2)),
            y2: Math.round(cy + r * Math.sin(a2))
        });
    }
    return walls;
}

export const customHoles = {
    1: {
        floors: [
            { x: 50, y: 350, w: 400, h: 100 },
            { x: 450, y: 50, w: 100, h: 400 }
        ],
        tee: { x: 100, y: 400 },
        hole: { x: 500, y: 100 },
        outerWalls: [
            { x: 50, y: 334, w: 384, h: 16 }, // Top horizontal
            { x: 34, y: 334, w: 16, h: 132 }, // Left cap
            { x: 50, y: 450, w: 400, h: 16 }, // Bottom horizontal
            { x: 550, y: 34, w: 16, h: 316 }, // Right vertical
            { x: 434, y: 34, w: 132, h: 16 }, // Top vertical cap
            { x: 434, y: 50, w: 16, h: 284 }  // Left vertical inner
        ],
        obstacleWalls: [],
        angledWalls: [
            { x1: 450, y1: 450, x2: 550, y2: 350 }
        ],
        bouncers: [],
        ramps: []
    },
    2: {
        floors: [
            { x: 215, y: 30, w: 250, h: 460 }
        ],
        tee: { x: 340, y: 460 },
        hole: { x: 340, y: 80 },
        outerWalls: [
            { x: 199, y: 14, w: 282, h: 16 },   // Top
            { x: 199, y: 490, w: 282, h: 16 },   // Bottom
            { x: 199, y: 14, w: 16, h: 492 },    // Left
            { x: 465, y: 14, w: 16, h: 492 },    // Right
        ],
        obstacleWalls: [],
        angledWalls: [],
        movingWalls: [
            { x: 280, y: 333, w: 80, h: 16, axis: 'x', min: 215, max: 385, speed: 1.5, dir: 1 },
            { x: 280, y: 207, w: 80, h: 16, axis: 'x', min: 215, max: 385, speed: 1.5, dir: -1 }
        ],
        bouncers: [
            { x: 295, y: 80, r: 20, color: '#9C27B0' },
            { x: 385, y: 80, r: 20, color: '#9C27B0' }
        ],
        ramps: []
    },
    3: {  // "The Pinball" — wide rectangular, bouncers everywhere
        floors: [{ x: 30, y: 30, w: 620, h: 460 }],
        tee: { x: 80, y: 460 },
        hole: { x: 600, y: 70 },
        outerWalls: [
            { x: 14, y: 14, w: 652, h: 16 },
            { x: 14, y: 490, w: 652, h: 16 },
            { x: 14, y: 14, w: 16, h: 492 },
            { x: 650, y: 14, w: 16, h: 492 }
        ],
        obstacleWalls: [],
        angledWalls: [],
        bouncers: [
            { x: 200, y: 150, r: 22, color: '#FF5722' },
            { x: 400, y: 120, r: 22, color: '#FF9800' },
            { x: 300, y: 260, r: 22, color: '#E91E63' },
            { x: 500, y: 280, r: 22, color: '#9C27B0' },
            { x: 160, y: 350, r: 22, color: '#2196F3' },
            { x: 450, y: 400, r: 22, color: '#00BCD4' },
            { x: 120, y: 180, r: 18, color: '#FF5722' },
            { x: 550, y: 150, r: 18, color: '#FF9800' },
            { x: 350, y: 380, r: 18, color: '#E91E63' },
            { x: 250, y: 440, r: 18, color: '#2196F3' }
        ],
        ramps: []
    },
    4: {  // "The Serpent" — S-shaped zigzag path
        floors: [
            { x: 80, y: 400, w: 420, h: 80 },
            { x: 420, y: 240, w: 80, h: 240 },
            { x: 180, y: 240, w: 320, h: 80 },
            { x: 180, y: 80, w: 80, h: 240 },
            { x: 180, y: 80, w: 420, h: 80 }
        ],
        tee: { x: 130, y: 440 },
        hole: { x: 550, y: 120 },
        outerWalls: [
            { x: 64, y: 480, w: 436, h: 16 },
            { x: 64, y: 384, w: 16, h: 112 },
            { x: 64, y: 384, w: 356, h: 16 },
            { x: 500, y: 224, w: 16, h: 272 },
            { x: 260, y: 224, w: 256, h: 16 },
            { x: 260, y: 160, w: 16, h: 80 },
            { x: 260, y: 160, w: 356, h: 16 },
            { x: 600, y: 64, w: 16, h: 112 },
            { x: 164, y: 64, w: 452, h: 16 },
            { x: 164, y: 64, w: 16, h: 256 },
            { x: 164, y: 320, w: 256, h: 16 },
            { x: 404, y: 336, w: 16, h: 64 }
        ],
        obstacleWalls: [],
        angledWalls: [],
        bouncers: [],
        ramps: [
            { x: 410, y: 370, w: 50, h: 50, forceX: 0, forceY: -6 },
            { x: 300, y: 260, w: 50, h: 40, forceX: -5, forceY: 0 },
            { x: 200, y: 130, w: 50, h: 40, forceX: 5, forceY: 0 }
        ]
    },
    5: {  // "The Gauntlet" — long narrow hallway with inner channel
        floors: [{ x: 30, y: 160, w: 620, h: 200 }],
        tee: { x: 80, y: 260 },
        hole: { x: 600, y: 260 },
        outerWalls: [
            { x: 14, y: 144, w: 652, h: 16 },
            { x: 14, y: 360, w: 652, h: 16 },
            { x: 14, y: 144, w: 16, h: 232 },
            { x: 650, y: 144, w: 16, h: 232 }
        ],
        obstacleWalls: [
            { x: 130, y: 160, w: 16, h: 70 },
            { x: 130, y: 290, w: 16, h: 70 },
            { x: 520, y: 160, w: 16, h: 70 },
            { x: 520, y: 290, w: 16, h: 70 }
        ],
        angledWalls: [],
        movingWalls: [
            { x: 220, y: 200, w: 60, h: 14, axis: 'y', min: 170, max: 340, speed: 1.2, dir: 1 },
            { x: 350, y: 300, w: 60, h: 14, axis: 'y', min: 170, max: 340, speed: 1.4, dir: -1 },
            { x: 480, y: 220, w: 60, h: 14, axis: 'y', min: 170, max: 340, speed: 1.0, dir: 1 }
        ],
        bouncers: [],
        ramps: []
    },
    6: {  // "The Donut" — circular ring course
        floors: [],
        floorCircles: [
            { x: 340, y: 260, r: 225 },
            { x: 340, y: 260, r: 95, dark: true }
        ],
        tee: { x: 340, y: 470 },
        hole: { x: 340, y: 65 },
        outerWalls: [],
        obstacleWalls: [],
        angledWalls: [
            ...makeCircleWalls(340, 260, 240, 24),
            ...makeCircleWalls(340, 260, 80, 16)
        ],
        bouncers: [],
        ramps: []
    },
    7: {  // "The Windmill" — classic timing challenge
        floors: [{ x: 190, y: 30, w: 300, h: 460 }],
        tee: { x: 340, y: 460 },
        hole: { x: 340, y: 70 },
        outerWalls: [
            { x: 174, y: 14, w: 332, h: 16 },
            { x: 174, y: 490, w: 332, h: 16 },
            { x: 174, y: 14, w: 16, h: 492 },
            { x: 490, y: 14, w: 16, h: 492 }
        ],
        obstacleWalls: [], // Side walls removed
        rotatingObstacles: [
            { cx: 340, cy: 250, length: 140, arms: 4, speed: 0.02, width: 14 }
        ],
        bouncers: [],
        ramps: [
            { x: 310, y: 130, w: 60, h: 60, forceX: 0, forceY: -5 }
        ]
    },
    8: {  // "The Clock" — rotating bar in a circular course
        floors: [],
        floorCircles: [
            { x: 340, y: 260, r: 240 }
        ],
        tee: { x: 340, y: 460 },
        hole: { x: 340, y: 100 }, // Moved up
        outerWalls: [],
        obstacleWalls: [],
        angledWalls: [
            ...makeCircleWalls(340, 260, 245, 24)
        ],
        rotatingObstacles: [
            { cx: 340, cy: 260, length: 160, arms: 4, speed: 0.03, width: 12 } // Shorter hands (160)
        ],
        bouncers: [
            { x: 340, y: 380, r: 20, color: '#FF5722' },
            { x: 520, y: 360, r: 20, color: '#FF9800' },
            { x: 160, y: 360, r: 20, color: '#2196F3' }
        ],
        ramps: [
            { x: 315, y: 400, w: 50, h: 40, forceX: 0, forceY: -6 }
        ]
    },
    9: {  // "The Long Shot" — endurance/distance hole
        floors: [{ x: 20, y: 100, w: 640, h: 320 }],
        tee: { x: 60, y: 260 },
        hole: { x: 620, y: 260 },
        outerWalls: [
            { x: 10, y: 80, w: 660, h: 20 }, // Thicker walls
            { x: 10, y: 420, w: 660, h: 20 },
            { x: 10, y: 80, w: 20, h: 360 },
            { x: 650, y: 80, w: 20, h: 360 }
        ],
        obstacleWalls: [
            { x: 150, y: 100, w: 10, h: 120 },
            { x: 150, y: 300, w: 10, h: 120 },
            { x: 500, y: 100, w: 10, h: 100 },
            { x: 500, y: 320, w: 10, h: 100 }
        ],
        angledWalls: [
            { x1: 520, y1: 150, x2: 580, y2: 220 },
            { x1: 520, y1: 370, x2: 580, y2: 300 }
        ],
        bouncers: [
            { x: 300, y: 180, r: 20, color: '#E91E63' },
            { x: 400, y: 340, r: 20, color: '#9C27B0' },
            { x: 350, y: 260, r: 22, color: '#00BCD4' }
        ],
        ramps: [
            { x: 100, y: 240, w: 40, h: 40, forceX: 5, forceY: 0 },
            { x: 530, y: 240, w: 50, h: 40, forceX: 4, forceY: 0 }
        ]
    },
    10: { // "The Spinner" — octagonal chaos
        floors: [],
        floorCircles: [
            { x: 340, y: 260, r: 240 }
        ],
        tee: { x: 340, y: 450 },
        hole: { x: 340, y: 70 },
        outerWalls: [],
        obstacleWalls: [],
        angledWalls: [
            ...makeCircleWalls(340, 260, 250, 8),
            // Corner triangles (traps)
            { x1: 150, y1: 150, x2: 240, y2: 120 },
            { x1: 530, y1: 150, x2: 440, y2: 120 },
            { x1: 150, y1: 370, x2: 240, y2: 400 },
            { x1: 530, y1: 370, x2: 440, y2: 400 }
        ],
        rotatingObstacles: [
            { cx: 340, cy: 260, length: 140, arms: 4, speed: 0.04, width: 16 }
        ],
        bouncers: [],
        ramps: [
            { x: 315, y: 380, w: 50, h: 50, forceX: 0, forceY: -5 },
            { x: 315, y: 130, w: 50, h: 50, forceX: 0, forceY: -4 }
        ]
    },
    11: { // "The Grand U" — Large U-shaped course
        floors: [],
        floorPolygons: [
            {
                points: [
                    { x: 100, y: 80 }, { x: 200, y: 80 },   // Top L cap
                    { x: 200, y: 380 },                    // Inner L down
                    { x: 480, y: 380 },                    // Inner R up
                    { x: 480, y: 80 }, { x: 580, y: 80 },   // Top R cap
                    { x: 580, y: 480 },                    // Outer R down
                    { x: 100, y: 480 }                     // Outer L back up
                ]
            }
        ],
        tee: { x: 150, y: 120 },
        hole: { x: 530, y: 120 },
        outerWalls: [],
        obstacleWalls: [],
        angledWalls: [
            // Perimeter of the U
            { x1: 100, y1: 80, x2: 200, y2: 80 },   // Top Left cap
            { x1: 200, y1: 80, x2: 200, y2: 380 },  // Left Inner
            { x1: 200, y1: 380, x2: 480, y2: 380 }, // Bottom Inner
            { x1: 480, y1: 380, x2: 480, y2: 80 },  // Right Inner
            { x1: 480, y1: 80, x2: 580, y2: 80 },   // Top Right cap
            { x1: 580, y1: 80, x2: 580, y2: 480 },  // Right Outer
            { x1: 580, y1: 480, x2: 100, y2: 480 }, // Bottom Outer
            { x1: 100, y1: 480, x2: 100, y2: 80 }   // Left Outer
        ],
        bouncers: [
            { x: 340, y: 430, r: 25, color: '#FF5722' }
        ],
        ramps: []
    },
    12: { // "The Volcano" — Circular center challenge
        floors: [{ x: 100, y: 50, w: 480, h: 420 }],
        floorCircles: [{ x: 340, y: 260, r: 150, color: '#1B5E20' }],
        tee: { x: 340, y: 430 },
        hole: { x: 340, y: 260 },
        outerWalls: [
            { x: 84, y: 34, w: 512, h: 16 },
            { x: 84, y: 470, w: 512, h: 16 },
            { x: 84, y: 34, w: 16, h: 452 },
            { x: 580, y: 34, w: 16, h: 452 }
        ],
        obstacleWalls: [],
        angledWalls: [],
        bouncers: [
            { x: 270, y: 190, r: 20, color: '#FF5722' },
            { x: 410, y: 190, r: 20, color: '#FF5722' },
            { x: 270, y: 330, r: 20, color: '#FF5722' },
            { x: 410, y: 330, r: 20, color: '#FF5722' },
            { x: 340, y: 170, r: 20, color: '#E64A19' },
            { x: 340, y: 350, r: 20, color: '#E64A19' },
            { x: 250, y: 260, r: 20, color: '#E64A19' },
            { x: 430, y: 260, r: 20, color: '#E64A19' }
        ],
        ramps: []
    },
    13: { // "The Zig-Zag" — Simple Z corridor
        floors: [
            { x: 100, y: 50, w: 480, h: 100 },  // Top
            { x: 480, y: 150, w: 100, h: 220 }, // Vertical
            { x: 100, y: 370, w: 480, h: 100 }  // Bottom
        ],
        tee: { x: 150, y: 100 },
        hole: { x: 150, y: 420 },
        outerWalls: [
            // Top segment
            { x: 84, y: 34, w: 512, h: 16 },
            { x: 84, y: 34, w: 16, h: 132 },
            { x: 100, y: 150, w: 380, h: 16 },
            // Vertical segment
            { x: 580, y: 34, w: 16, h: 452 },
            { x: 464, y: 150, w: 16, h: 220 },
            // Bottom segment
            { x: 100, y: 354, w: 380, h: 16 },
            { x: 84, y: 354, w: 16, h: 132 },
            { x: 84, y: 470, w: 512, h: 16 }
        ],
        obstacleWalls: [],
        angledWalls: [],
        bouncers: [],
        ramps: []
    },
    14: { // "The Plinko" — Gravity/peg challenge
        floors: [{ x: 50, y: 50, w: 580, h: 420 }],
        tee: { x: 340, y: 100 },
        hole: { x: 340, y: 430 },
        outerWalls: [
            { x: 34, y: 34, w: 612, h: 16 },
            { x: 34, y: 470, w: 612, h: 16 },
            { x: 34, y: 34, w: 16, h: 452 },
            { x: 630, y: 34, w: 16, h: 452 }
        ],
        obstacleWalls: [],
        angledWalls: [],
        bouncers: (() => {
            const b = [];
            for (let row = 0; row < 5; row++) {
                const cols = row % 2 === 0 ? 8 : 7;
                const offset = row % 2 === 0 ? 80 : 120;
                for (let col = 0; col < cols; col++) {
                    b.push({
                        x: offset + col * 80,
                        y: 180 + row * 60,
                        r: 10,
                        color: (row + col) % 2 === 0 ? '#FFEB3B' : '#FF9800'
                    });
                }
            }
            return b;
        })(),
        ramps: []
    },
    15: { // "The Bridge" — Vertical connection with sweepers
        floors: [
            { x: 100, y: 50, w: 480, h: 120 },  // Top area
            { x: 290, y: 170, w: 100, h: 180 }, // Bridge
            { x: 100, y: 350, w: 480, h: 120 }  // Bottom area
        ],
        tee: { x: 340, y: 110 },
        hole: { x: 340, y: 410 },
        outerWalls: [
            // Top Area
            { x: 84, y: 34, w: 512, h: 16 },
            { x: 84, y: 34, w: 16, h: 152 },
            { x: 580, y: 34, w: 16, h: 152 },
            { x: 100, y: 170, w: 190, h: 16 },
            { x: 390, y: 170, w: 190, h: 16 },
            // Bridge
            { x: 274, y: 170, w: 16, h: 180 },
            { x: 390, y: 170, w: 16, h: 180 },
            // Bottom Area
            { x: 100, y: 334, w: 190, h: 16 },
            { x: 390, y: 334, w: 190, h: 16 },
            { x: 84, y: 334, w: 16, h: 152 },
            { x: 580, y: 334, w: 16, h: 152 },
            { x: 84, y: 470, w: 512, h: 16 }
        ],
        obstacleWalls: [],
        movingWalls: [
            { x: 100, y: 220, w: 150, h: 16, axis: 'x', min: 100, max: 430, speed: 12, dir: 1 },
            { x: 430, y: 280, w: 150, h: 16, axis: 'x', min: 100, max: 430, speed: 10, dir: -1 }
        ],
        angledWalls: [],
        bouncers: [],
        ramps: []
    },
    16: { // "The Split Decision" — Branching paths
        floors: [{ x: 50, y: 50, w: 580, h: 420 }],
        tee: { x: 340, y: 430 },
        hole: { x: 340, y: 90 },
        outerWalls: [
            { x: 34, y: 34, w: 612, h: 16 },
            { x: 34, y: 470, w: 612, h: 16 },
            { x: 34, y: 34, w: 16, h: 452 },
            { x: 630, y: 34, w: 16, h: 452 }
        ],
        obstacleWalls: [
            // Middle horizontal dividers
            { x: 50, y: 252, w: 100, h: 16 },
            { x: 230, y: 252, w: 220, h: 16 },
            { x: 530, y: 252, w: 100, h: 16 },
            // Blocking blocks in front of gap-ramps
            { x: 165, y: 380, w: 50, h: 16 },
            { x: 465, y: 380, w: 50, h: 16 }
        ],
        angledWalls: [],
        bouncers: [],
        ramps: [
            { x: 170, y: 280, w: 40, h: 40, forceX: 0, forceY: -5 }, // L path boost
            { x: 470, y: 280, w: 40, h: 40, forceX: 0, forceY: -5 }  // R path boost
        ]
    },
    17: { // "The Spiral" — Inward winding challenge
        floors: [{ x: 50, y: 50, w: 580, h: 420 }],
        tee: { x: 100, y: 430 },
        hole: { x: 340, y: 260 },
        outerWalls: [
            { x: 34, y: 34, w: 612, h: 16 },
            { x: 34, y: 470, w: 612, h: 16 },
            { x: 34, y: 34, w: 16, h: 452 },
            { x: 630, y: 34, w: 16, h: 452 }
        ],
        obstacleWalls: [],
        angledWalls: [
            // Spiral Path (approx Snail Shell)
            { x1: 50, y1: 50, x2: 630, y2: 50 },    // Top
            { x1: 630, y1: 50, x2: 630, y2: 470 },  // R-edge
            { x1: 630, y1: 470, x2: 50, y2: 470 },  // Bottom
            { x1: 50, y1: 470, x2: 50, y2: 120 },   // L-edge up (start spiral)
            { x1: 50, y1: 120, x2: 540, y2: 120 },  // 1st inner top
            { x1: 540, y1: 120, x2: 540, y2: 380 }, // 1st inner right
            { x1: 540, y1: 380, x2: 140, y2: 380 }, // 1st inner bottom
            { x1: 140, y1: 380, x2: 140, y2: 190 }, // 2nd inner left
            { x1: 140, y1: 190, x2: 450, y2: 190 }, // 2nd inner top
            { x1: 450, y1: 190, x2: 450, y2: 310 }, // 2nd inner right
            { x1: 450, y1: 310, x2: 240, y2: 310 }  // Towards hole center
        ],
        bouncers: [],
        ramps: [
            { x: 300, y: 66, w: 100, h: 40, forceX: 4, forceY: 0 },   // Guideway top
            { x: 556, y: 220, w: 60, h: 100, forceX: 0, forceY: 4 },  // Guideway right
            { x: 250, y: 416, w: 100, h: 40, forceX: -4, forceY: 0 }  // Guideway bottom
        ]
    },
    18: { // "The Grand Finale" — The Ultimate Test
        floors: [{ x: 50, y: 50, w: 580, h: 420 }],
        tee: { x: 340, y: 430 },
        hole: { x: 340, y: 80 },
        outerWalls: [
            { x: 34, y: 34, w: 612, h: 16 },
            { x: 34, y: 470, w: 612, h: 16 },
            { x: 34, y: 34, w: 16, h: 452 },
            { x: 630, y: 34, w: 16, h: 452 }
        ],
        obstacleWalls: [
            { x: 150, y: 240, w: 80, h: 16 }, // Side bumper
            { x: 450, y: 240, w: 80, h: 16 }, // Side bumper
            { x: 315, y: 280, w: 50, h: 16 }  // Mid bumper
        ],
        rotatingObstacles: [
            { cx: 340, cy: 370, length: 140, arms: 4, speed: 0.02, width: 12 }, // Lower Windmill
            { cx: 340, cy: 170, length: 160, arms: 2, speed: -0.04, width: 12 } // Fast Upper Swiper
        ],
        angledWalls: [],
        bouncers: [
            { x: 100, y: 100, r: 30, color: '#F44336' },
            { x: 580, y: 100, r: 30, color: '#F44336' }
        ],
        ramps: [
            { x: 100, y: 300, w: 40, h: 40, forceX: 0, forceY: -5 },
            { x: 540, y: 300, w: 40, h: 40, forceX: 0, forceY: -5 }
        ]
    }
};

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

    let buttonsHTML = '';
    for (let i = 1; i <= 18; i++) {
        buttonsHTML += `
            <button class="mg-hole-btn" data-hole="${i}">
                <span class="mg-hole-number">${i}</span>
                <span class="mg-hole-label">Hole</span>
            </button>
        `;
    }

    containerEl.innerHTML = `
        <div id="mg-game">
            <div id="mg-selection">
                <h1>⛳ Select Hole to Test</h1>
                <p class="mg-subtitle">Customize your ball & jump to a hole</p>
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
                <div class="mg-hole-buttons mg-hole-grid">
                    ${buttonsHTML}
                </div>
                <div id="mg-selection-msg" style="color: #ff5722; margin-top: 15px; font-weight: bold; min-height: 24px;"></div>
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

    document.querySelectorAll('.mg-hole-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const holeNumber = parseInt(e.currentTarget.dataset.hole, 10);
            loadCustomHole(holeNumber);
        });
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

    // Use dark background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // If custom floors exist, draw those in green
    if (course.floors && course.floors.length > 0) {
        ctx.fillStyle = '#2E7D32';
        for (const f of course.floors) {
            ctx.fillRect(f.x, f.y, f.w, f.h);
        }

        // Clip the subtle pattern
        ctx.save();
        ctx.beginPath();
        for (const f of course.floors) {
            ctx.rect(f.x, f.y, f.w, f.h);
        }
    }

    // Floor polygons (for complex slanted shapes)
    if (course.floorPolygons) {
        for (const fp of course.floorPolygons) {
            ctx.fillStyle = fp.color || '#2E7D32';
            ctx.beginPath();
            if (fp.points && fp.points.length > 0) {
                ctx.moveTo(fp.points[0].x, fp.points[0].y);
                for (let i = 1; i < fp.points.length; i++) {
                    ctx.lineTo(fp.points[i].x, fp.points[i].y);
                }
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    if (course.floors && course.floors.length > 0) {
        ctx.clip();

        for (let i = 0; i < CANVAS_W; i += 40) {
            ctx.fillStyle = (Math.floor(i / 40) % 2 === 0)
                ? 'rgba(255,255,255,0.025)'
                : 'rgba(0,0,0,0.025)';
            ctx.fillRect(i, 0, 20, CANVAS_H);
        }
        ctx.restore();
    } else if (!course.floorCircles || course.floorCircles.length === 0) {
        // Fallback backward-compatible full green screen (only if no circular floors)
        ctx.fillStyle = '#2E7D32';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        for (let i = 0; i < CANVAS_W; i += 40) {
            ctx.fillStyle = (Math.floor(i / 40) % 2 === 0)
                ? 'rgba(255,255,255,0.025)'
                : 'rgba(0,0,0,0.025)';
            ctx.fillRect(i, 0, 20, CANVAS_H);
        }
    }

    // Floor circles (for donut/circular courses)
    if (course.floorCircles) {
        for (const fc of course.floorCircles) {
            ctx.fillStyle = fc.dark ? '#1a1a2e' : '#2E7D32';
            ctx.beginPath();
            ctx.arc(fc.x, fc.y, fc.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawRamps();
    drawRotatingObstacles();
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

    if (course.angledWalls) {
        ctx.lineCap = 'round';
        for (const w of course.angledWalls) {
            ctx.lineWidth = w.thickness || WALL_THICKNESS;

            // Setup shadow
            ctx.shadowColor = 'rgba(0,0,0,0.35)'; // depth shadow
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;

            // Main white line
            ctx.strokeStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.moveTo(w.x1, w.y1);
            ctx.lineTo(w.x2, w.y2);
            ctx.stroke();

            // Clear shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // Highlight
            ctx.strokeStyle = 'rgba(255,255,255,0.6)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(w.x1 - 2, w.y1 - 2);
            ctx.lineTo(w.x2 - 2, w.y2 - 2);
            ctx.stroke();
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
