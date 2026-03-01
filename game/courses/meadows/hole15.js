export default { // "The Bridge" — Vertical connection with sweepers
    floors: [
        { x: 100, y: 50, w: 480, h: 120 },  // Top area
        { x: 276, y: 170, w: 128, h: 180 }, // Bridge
        { x: 100, y: 350, w: 480, h: 120 }  // Bottom area
    ],
    tee: { x: 340, y: 110 },
    hole: { x: 340, y: 410 },
    outerWalls: [
        // Top Area
        { x: 84, y: 34, w: 512, h: 16 },
        { x: 84, y: 34, w: 16, h: 152 },
        { x: 580, y: 34, w: 16, h: 152 },
        { x: 100, y: 170, w: 176, h: 16 },
        { x: 404, y: 170, w: 176, h: 16 },
        // Bridge
        { x: 260, y: 170, w: 16, h: 180 },
        { x: 404, y: 170, w: 16, h: 180 },
        // Bottom Area
        { x: 100, y: 334, w: 176, h: 16 },
        { x: 404, y: 334, w: 176, h: 16 },
        { x: 84, y: 334, w: 16, h: 152 },
        { x: 580, y: 334, w: 16, h: 152 },
        { x: 84, y: 470, w: 512, h: 16 }
    ],
    obstacleWalls: [],
    movingWalls: [
        { x: 100, y: 220, w: 110, h: 16, axis: 'x', min: 100, max: 470, speed: 7, dir: 1 },
        { x: 470, y: 280, w: 110, h: 16, axis: 'x', min: 100, max: 470, speed: 6, dir: -1 }
    ],
    angledWalls: [
        { x1: 248, y1: 170, x2: 276, y2: 198 },
        { x1: 432, y1: 170, x2: 404, y2: 198 },
        { x1: 248, y1: 322, x2: 276, y2: 350 },
        { x1: 432, y1: 322, x2: 404, y2: 350 }
    ],
    bouncers: [],
    ramps: [],
    theme: {
        palette: {
            skyTop: '#6074b8',
            skyBottom: '#efaf84',
            grassBase: '#80995f',
            rough: '#675932',
            path: '#b79d67',
            wallMain: '#8b633d',
            wallTrim: '#e0c587'
        },
        wallStyle: {
            material: 'wood',
            postSpacing: 34
        },
        decor: [
            { kind: 'tree', x: 84, y: 250, h: 84, r: 26, color: '#4d6c33' },
            { kind: 'tree', x: 596, y: 252, h: 86, r: 28, color: '#7f5d2b' },
            { kind: 'pond', x: 192, y: 258, w: 128, h: 74 },
            { kind: 'pond', x: 488, y: 258, w: 128, h: 74 },
            { kind: 'flowers', x: 152, y: 486, density: 5 },
            { kind: 'flowers', x: 526, y: 486, density: 5 }
        ]
    }
};
