import { makeCircleWalls } from './utils.js';

export default {  // "The Donut" — circular ring course
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
};
