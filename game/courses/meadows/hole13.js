export default { // "The Zig-Zag" — Simple Z corridor
    floors: [
        { x: 100, y: 50, w: 480, h: 100 },  // Top
        { x: 480, y: 150, w: 100, h: 220 }, // Vertical
        { x: 100, y: 370, w: 480, h: 100 }  // Bottom
    ],
    tee: { x: 150, y: 100 },
    hole: { x: 150, y: 420 },
    outerWalls: [
        // Top segment
        { x: 84, y: 34, w: 512, h: 16 },
        { x: 84, y: 34, w: 16, h: 132 },
        { x: 100, y: 150, w: 380, h: 16 },
        // Vertical segment
        { x: 580, y: 34, w: 16, h: 452 },
        { x: 464, y: 150, w: 16, h: 220 },
        // Bottom segment
        { x: 100, y: 354, w: 380, h: 16 },
        { x: 84, y: 354, w: 16, h: 132 },
        { x: 84, y: 470, w: 512, h: 16 }
    ],
    obstacleWalls: [],
    angledWalls: [],
    bouncers: [],
    ramps: [],
    theme: {
        palette: {
            skyTop: '#6076ba',
            skyBottom: '#f0af84',
            grassBase: '#809961',
            rough: '#675932',
            path: '#b79e68',
            wallMain: '#8b633d',
            wallTrim: '#e0c688'
        },
        wallStyle: {
            material: 'wood',
            postSpacing: 34
        },
        decor: [
            { kind: 'tree', x: 76, y: 218, h: 82, r: 26, color: '#4c6b33' },
            { kind: 'tree', x: 612, y: 286, h: 86, r: 28, color: '#7d5c2b' },
            { kind: 'pond', x: 626, y: 102, w: 84, h: 52, rotation: 0.08 },
            { kind: 'flowers', x: 154, y: 486, density: 5 },
            { kind: 'flowers', x: 614, y: 426, density: 5 },
            { kind: 'bush', x: 370, y: 254, r: 14 },
            { kind: 'stone', x: 76, y: 108, w: 16, h: 10, rotation: -0.15 }
        ]
    }
};
