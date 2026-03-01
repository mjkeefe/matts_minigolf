export default { // "The Volcano" — Circular center challenge
    floors: [{ x: 100, y: 50, w: 480, h: 420 }],
    floorCircles: [{ x: 340, y: 260, r: 150, color: '#1B5E20' }],
    tee: { x: 340, y: 430 },
    hole: { x: 340, y: 260 },
    outerWalls: [
        { x: 84, y: 34, w: 512, h: 16 },
        { x: 84, y: 470, w: 512, h: 16 },
        { x: 84, y: 34, w: 16, h: 452 },
        { x: 580, y: 34, w: 16, h: 452 }
    ],
    obstacleWalls: [],
    angledWalls: [],
    bouncers: [
        { x: 270, y: 190, r: 20, color: '#FF5722' },
        { x: 410, y: 190, r: 20, color: '#FF5722' },
        { x: 270, y: 330, r: 20, color: '#FF5722' },
        { x: 410, y: 330, r: 20, color: '#FF5722' },
        { x: 340, y: 170, r: 20, color: '#E64A19' },
        { x: 340, y: 350, r: 20, color: '#E64A19' },
        { x: 250, y: 260, r: 20, color: '#E64A19' },
        { x: 430, y: 260, r: 20, color: '#E64A19' }
    ],
    ramps: [],
    theme: {
        palette: {
            skyTop: '#5f73b6',
            skyBottom: '#efac82',
            grassBase: '#809760',
            rough: '#675931',
            path: '#b69d66',
            wallMain: '#8c6e53',
            wallTrim: '#d8cab2'
        },
        wallStyle: {
            material: 'stone',
            postSpacing: 36
        },
        decor: [
            { kind: 'pond', x: 340, y: 260, w: 188, h: 188 },
            { kind: 'tree', x: 82, y: 124, h: 78, r: 24, color: '#4a6931' },
            { kind: 'tree', x: 598, y: 402, h: 84, r: 26, color: '#7c5a2b' },
            { kind: 'flowers', x: 142, y: 446, density: 5 },
            { kind: 'flowers', x: 536, y: 92, density: 5 },
            { kind: 'stone', x: 92, y: 346, w: 16, h: 10, rotation: 0.2 }
        ]
    }
};
