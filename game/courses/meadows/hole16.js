export default { // "The Split Decision" — Branching paths
    floors: [{ x: 50, y: 50, w: 580, h: 420 }],
    tee: { x: 340, y: 430 },
    hole: { x: 340, y: 90 },
    outerWalls: [
        { x: 34, y: 34, w: 612, h: 16 },
        { x: 34, y: 470, w: 612, h: 16 },
        { x: 34, y: 34, w: 16, h: 452 },
        { x: 630, y: 34, w: 16, h: 452 }
    ],
    obstacleWalls: [
        // Middle horizontal dividers
        { x: 50, y: 252, w: 100, h: 16 },
        { x: 230, y: 252, w: 220, h: 16 },
        { x: 530, y: 252, w: 100, h: 16 },
        // Blocking blocks in front of gap-ramps
        { x: 165, y: 380, w: 50, h: 16 },
        { x: 465, y: 380, w: 50, h: 16 }
    ],
    angledWalls: [],
    bouncers: [],
    ramps: [
        { x: 170, y: 280, w: 40, h: 40, forceX: 0, forceY: -5 }, // L path boost
        { x: 470, y: 280, w: 40, h: 40, forceX: 0, forceY: -5 }  // R path boost
    ],
    theme: {
        palette: {
            skyTop: '#6075b8',
            skyBottom: '#efac82',
            grassBase: '#809860',
            rough: '#675a31',
            path: '#b69d67',
            wallMain: '#8c6e54',
            wallTrim: '#d9cab4'
        },
        wallStyle: {
            material: 'stone',
            postSpacing: 36
        },
        decor: [
            { kind: 'tree', x: 42, y: 118, h: 72, r: 22, color: '#4a6831' },
            { kind: 'tree', x: 638, y: 404, h: 76, r: 24, color: '#7c592d' },
            { kind: 'flowers', x: 150, y: 64, density: 4 },
            { kind: 'flowers', x: 530, y: 64, density: 4 },
            { kind: 'flowers', x: 84, y: 448, density: 4 },
            { kind: 'flowers', x: 596, y: 448, density: 4 },
            { kind: 'stone', x: 338, y: 448, w: 16, h: 10, rotation: 0.15 }
        ]
    }
};
