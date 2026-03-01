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
    ],
    theme: {
        palette: {
            skyTop: '#6074b8',
            skyBottom: '#efa97d',
            grassBase: '#809760',
            rough: '#66572f',
            path: '#b69c66',
            wallMain: '#8c6e53',
            wallTrim: '#d8cab2'
        },
        wallStyle: {
            material: 'stone',
            postSpacing: 34
        },
        decor: [
            { kind: 'tree', x: 98, y: 116, h: 76, r: 24, color: '#4b6a32' },
            { kind: 'tree', x: 592, y: 404, h: 82, r: 26, color: '#7d5a2c' },
            { kind: 'flowers', x: 166, y: 456, density: 5 },
            { kind: 'flowers', x: 516, y: 88, density: 5 },
            { kind: 'bush', x: 102, y: 350, r: 14 },
            { kind: 'bush', x: 578, y: 182, r: 14 }
        ]
    }
};
