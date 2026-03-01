export default {
    floors: [
        { x: 215, y: 30, w: 250, h: 460 }
    ],
    tee: { x: 340, y: 460 },
    hole: { x: 340, y: 80 },
    outerWalls: [
        { x: 199, y: 14, w: 282, h: 16 },   // Top
        { x: 199, y: 490, w: 282, h: 16 },   // Bottom
        { x: 199, y: 14, w: 16, h: 492 },    // Left
        { x: 465, y: 14, w: 16, h: 492 },    // Right
    ],
    obstacleWalls: [],
    angledWalls: [],
    movingWalls: [
        { x: 280, y: 333, w: 80, h: 16, axis: 'x', min: 215, max: 385, speed: 1.5, dir: 1 },
        { x: 280, y: 207, w: 80, h: 16, axis: 'x', min: 215, max: 385, speed: 1.5, dir: -1 }
    ],
    bouncers: [
        { x: 295, y: 80, r: 20, color: '#9C27B0' },
        { x: 385, y: 80, r: 20, color: '#9C27B0' }
    ],
    ramps: [],
    theme: {
        palette: {
            skyTop: '#6177bc',
            skyBottom: '#efb08a',
            grassBase: '#7f9860',
            rough: '#66572f',
            path: '#b49b63',
            wallMain: '#8b633d',
            wallTrim: '#e1c587'
        },
        wallStyle: {
            material: 'wood',
            postSpacing: 34
        },
        decor: [
            { kind: 'tree', x: 118, y: 170, h: 86, r: 30, color: '#4d6b33' },
            { kind: 'tree', x: 564, y: 208, h: 88, r: 28, color: '#7a5c2d' },
            { kind: 'pond', x: 562, y: 408, w: 120, h: 74, rotation: -0.08 },
            { kind: 'flowers', x: 132, y: 400, density: 5 },
            { kind: 'flowers', x: 552, y: 106, density: 5 },
            { kind: 'bush', x: 106, y: 320, r: 16 },
            { kind: 'stone', x: 108, y: 442, w: 16, h: 10, rotation: 0.2 }
        ]
    }
};
