import { makeCircleWalls } from './utils.js';

export default { // "The Spinner" — octagonal chaos
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
};
