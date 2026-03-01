import { makeCircleWalls } from './utils.js';

export default {
    floorCircles: [
        { x: 340, y: 260, r: 190 }
    ],
    tee: { x: 196, y: 350 },
    hole: { x: 340, y: 260 },
    outerWalls: [],
    obstacleWalls: [
        { x: 210, y: 210, w: 50, h: 16 },
        { x: 420, y: 294, w: 50, h: 16 }
    ],
    angledWalls: makeCircleWalls(340, 260, 206, 28),
    rotatingObstacles: [
        { cx: 340, cy: 224, length: 58, arms: 3, speed: 0.012, width: 12 }
    ],
    bouncers: [],
    ramps: []
};
