import { makeCircleWalls } from './utils.js';

export default {
    floorCircles: [
        { x: 340, y: 260, r: 190 },
        { x: 340, y: 260, r: 82, dark: true }
    ],
    tee: { x: 340, y: 404 },
    hole: { x: 340, y: 116 },
    outerWalls: [],
    obstacleWalls: [],
    angledWalls: [
        ...makeCircleWalls(340, 260, 206, 28),
        ...makeCircleWalls(340, 260, 90, 20)
    ],
    bouncers: [],
    ramps: [
        { x: 484, y: 240, w: 46, h: 40, forceX: 0, forceY: -2.9 },
        { x: 150, y: 240, w: 46, h: 40, forceX: 0, forceY: 2.9 }
    ]
};
