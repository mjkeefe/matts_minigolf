import { makeCircleWalls } from './utils.js';

export default {
    floorCircles: [
        { x: 340, y: 260, r: 190 }
    ],
    tee: { x: 220, y: 360 },
    hole: { x: 460, y: 160 },
    outerWalls: [],
    obstacleWalls: [
        { x: 300, y: 248, w: 80, h: 24 }
    ],
    angledWalls: makeCircleWalls(340, 260, 206, 30),
    rotatingObstacles: [
        { cx: 340, cy: 260, length: 78, arms: 3, speed: 0.013, width: 12 }
    ],
    bouncers: [],
    ramps: [],
    lavaVents: [
        { x: 340, y: 260, r: 24, forceX: 0, forceY: -1.8, speed: 0.05 }
    ]
};
