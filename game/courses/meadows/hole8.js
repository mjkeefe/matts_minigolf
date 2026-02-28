import { makeCircleWalls } from './utils.js';

export default {  // "The Clock" — rotating bar in a circular course
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
};
