import { makeCircleWalls } from './utils.js';

export default {
    floorCircles: [
        { x: 340, y: 260, r: 190 },
        { x: 340, y: 260, r: 96, dark: true }
    ],
    tee: { x: 340, y: 404 },
    hole: { x: 340, y: 116 },
    outerWalls: [],
    obstacleWalls: [
        { x: 278, y: 245, w: 124, h: 30 }
    ],
    angledWalls: [
        ...makeCircleWalls(340, 260, 206, 30),
        ...makeCircleWalls(340, 260, 110, 22)
    ],
    bouncers: [],
    ramps: [],
    lavaVents: [
        { x: 512, y: 260, r: 22, forceX: 0, forceY: -2.1, speed: 0.04 },
        { x: 168, y: 260, r: 22, forceX: 0, forceY: 2.1, speed: 0.05 }
    ]
};
