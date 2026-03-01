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
    ],
    theme: {
        palette: {
            skyTop: '#5b6eb1',
            skyBottom: '#f0ab81',
            grassBase: '#809761',
            rough: '#65562f',
            path: '#b59a64',
            wallMain: '#8c6e54',
            wallTrim: '#d9cab2'
        },
        wallStyle: {
            material: 'stone',
            postSpacing: 34
        },
        decor: [
            { kind: 'tree', x: 92, y: 124, h: 78, r: 24, color: '#4a6832' },
            { kind: 'tree', x: 596, y: 402, h: 84, r: 28, color: '#7c5a2d' },
            { kind: 'flowers', x: 160, y: 470, density: 5 },
            { kind: 'flowers', x: 518, y: 92, density: 5 },
            { kind: 'bush', x: 104, y: 356, r: 15 },
            { kind: 'bush', x: 580, y: 196, r: 16 },
            { kind: 'stone', x: 590, y: 310, w: 16, h: 10, rotation: 0.15 }
        ]
    }
};
