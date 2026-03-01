export default {  // "The Gauntlet" — long narrow hallway with inner channel
    floors: [{ x: 30, y: 160, w: 620, h: 200 }],
    tee: { x: 80, y: 260 },
    hole: { x: 600, y: 260 },
    outerWalls: [
        { x: 14, y: 144, w: 652, h: 16 },
        { x: 14, y: 360, w: 652, h: 16 },
        { x: 14, y: 144, w: 16, h: 232 },
        { x: 650, y: 144, w: 16, h: 232 }
    ],
    obstacleWalls: [
        { x: 130, y: 160, w: 16, h: 70 },
        { x: 130, y: 290, w: 16, h: 70 },
        { x: 520, y: 160, w: 16, h: 70 },
        { x: 520, y: 290, w: 16, h: 70 }
    ],
    angledWalls: [],
    movingWalls: [
        { x: 220, y: 200, w: 60, h: 14, axis: 'y', min: 170, max: 340, speed: 1.2, dir: 1 },
        { x: 350, y: 300, w: 60, h: 14, axis: 'y', min: 170, max: 340, speed: 1.4, dir: -1 },
        { x: 480, y: 220, w: 60, h: 14, axis: 'y', min: 170, max: 340, speed: 1.0, dir: 1 }
    ],
    bouncers: [],
    ramps: [],
    theme: {
        palette: {
            skyTop: '#5c71b5',
            skyBottom: '#efa97d',
            grassBase: '#80995f',
            rough: '#665931',
            path: '#b79e68',
            wallMain: '#8b6e53',
            wallTrim: '#d9cab4'
        },
        wallStyle: {
            material: 'stone',
            postSpacing: 38
        },
        decor: [
            { kind: 'tree', x: 94, y: 96, h: 84, r: 28, color: '#4e6d35' },
            { kind: 'tree', x: 592, y: 438, h: 82, r: 24, color: '#7d592c' },
            { kind: 'pond', x: 584, y: 88, w: 122, h: 66, rotation: -0.08 },
            { kind: 'flowers', x: 84, y: 420, density: 5 },
            { kind: 'flowers', x: 598, y: 142, density: 5 },
            { kind: 'bush', x: 236, y: 92, r: 14 },
            { kind: 'bush', x: 444, y: 432, r: 14 }
        ]
    }
};
