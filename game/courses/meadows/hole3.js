export default {  // "The Pinball" — wide rectangular, bouncers everywhere
    floors: [{ x: 30, y: 30, w: 620, h: 460 }],
    tee: { x: 80, y: 460 },
    hole: { x: 600, y: 70 },
    outerWalls: [
        { x: 14, y: 14, w: 652, h: 16 },
        { x: 14, y: 490, w: 652, h: 16 },
        { x: 14, y: 14, w: 16, h: 492 },
        { x: 650, y: 14, w: 16, h: 492 }
    ],
    obstacleWalls: [],
    angledWalls: [],
    bouncers: [
        { x: 200, y: 150, r: 22, color: '#FF5722' },
        { x: 400, y: 120, r: 22, color: '#FF9800' },
        { x: 300, y: 260, r: 22, color: '#E91E63' },
        { x: 500, y: 280, r: 22, color: '#9C27B0' },
        { x: 160, y: 350, r: 22, color: '#2196F3' },
        { x: 450, y: 400, r: 22, color: '#00BCD4' },
        { x: 120, y: 180, r: 18, color: '#FF5722' },
        { x: 550, y: 150, r: 18, color: '#FF9800' },
        { x: 350, y: 380, r: 18, color: '#E91E63' },
        { x: 250, y: 440, r: 18, color: '#2196F3' }
    ],
    ramps: [],
    theme: {
        palette: {
            skyTop: '#5b6eb0',
            skyBottom: '#f0ac84',
            grassBase: '#809862',
            rough: '#695a32',
            path: '#b79d67',
            wallMain: '#8c6f53',
            wallTrim: '#daccb4'
        },
        wallStyle: {
            material: 'stone',
            postSpacing: 42
        },
        decor: [
            { kind: 'tree', x: 42, y: 116, h: 70, r: 22, color: '#4d6b33' },
            { kind: 'tree', x: 636, y: 396, h: 74, r: 24, color: '#735328' },
            { kind: 'flowers', x: 46, y: 468, density: 4 },
            { kind: 'flowers', x: 638, y: 62, density: 4 },
            { kind: 'stone', x: 44, y: 286, w: 16, h: 10, rotation: -0.2 },
            { kind: 'stone', x: 636, y: 196, w: 18, h: 12, rotation: 0.18 }
        ]
    }
};
