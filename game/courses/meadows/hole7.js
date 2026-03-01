export default {  // "The Windmill" — classic timing challenge
    floors: [{ x: 190, y: 30, w: 300, h: 460 }],
    tee: { x: 340, y: 460 },
    hole: { x: 340, y: 70 },
    outerWalls: [
        { x: 174, y: 14, w: 332, h: 16 },
        { x: 174, y: 490, w: 332, h: 16 },
        { x: 174, y: 14, w: 16, h: 492 },
        { x: 490, y: 14, w: 16, h: 492 }
    ],
    obstacleWalls: [], // Side walls removed
    rotatingObstacles: [
        { cx: 340, cy: 250, length: 140, arms: 4, speed: 0.02, width: 14 }
    ],
    bouncers: [],
    ramps: [
        { x: 310, y: 130, w: 60, h: 60, forceX: 0, forceY: -5 }
    ],
    theme: {
        palette: {
            skyTop: '#6278bb',
            skyBottom: '#efb286',
            grassBase: '#809960',
            rough: '#665830',
            path: '#b69c65',
            wallMain: '#8a623c',
            wallTrim: '#e1c686'
        },
        wallStyle: {
            material: 'wood',
            postSpacing: 34
        },
        decor: [
            { kind: 'tree', x: 116, y: 170, h: 86, r: 28, color: '#4f6d35' },
            { kind: 'tree', x: 562, y: 210, h: 88, r: 30, color: '#825c2a' },
            { kind: 'pond', x: 552, y: 416, w: 118, h: 72, rotation: -0.1 },
            { kind: 'sign', x: 118, y: 408, w: 34, h: 18 },
            { kind: 'flowers', x: 124, y: 452, density: 5 },
            { kind: 'flowers', x: 556, y: 110, density: 5 }
        ]
    }
};
