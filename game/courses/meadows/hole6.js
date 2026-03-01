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
    ramps: [],
    theme: {
        palette: {
            skyTop: '#6074b6',
            skyBottom: '#f1ac82',
            grassBase: '#7f985f',
            rough: '#66582f',
            path: '#b79d67',
            wallMain: '#8c6e54',
            wallTrim: '#d9cab0'
        },
        wallStyle: {
            material: 'stone',
            postSpacing: 36
        },
        decor: [
            { kind: 'pond', x: 340, y: 260, w: 116, h: 116 },
            { kind: 'tree', x: 94, y: 120, h: 78, r: 26, color: '#4d6a33' },
            { kind: 'tree', x: 588, y: 408, h: 84, r: 28, color: '#7d592b' },
            { kind: 'flowers', x: 148, y: 444, density: 5 },
            { kind: 'flowers', x: 540, y: 94, density: 5 },
            { kind: 'stone', x: 82, y: 350, w: 18, h: 12, rotation: 0.2 },
            { kind: 'stone', x: 602, y: 178, w: 16, h: 10, rotation: -0.2 }
        ]
    }
};
