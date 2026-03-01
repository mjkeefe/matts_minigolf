export default { // "The Grand Finale" — The Ultimate Test
    floors: [{ x: 50, y: 50, w: 580, h: 420 }],
    tee: { x: 340, y: 430 },
    hole: { x: 340, y: 80 },
    outerWalls: [
        { x: 34, y: 34, w: 612, h: 16 },
        { x: 34, y: 470, w: 612, h: 16 },
        { x: 34, y: 34, w: 16, h: 452 },
        { x: 630, y: 34, w: 16, h: 452 }
    ],
    obstacleWalls: [
        { x: 132, y: 240, w: 70, h: 16 }, // Side bumper
        { x: 478, y: 240, w: 70, h: 16 }, // Side bumper
        { x: 322, y: 280, w: 36, h: 16 }  // Mid bumper
    ],
    rotatingObstacles: [
        { cx: 340, cy: 370, length: 112, arms: 4, speed: 0.015, width: 12 }, // Lower Windmill
        { cx: 340, cy: 170, length: 128, arms: 2, speed: -0.026, width: 12 } // Fast Upper Swiper
    ],
    angledWalls: [
        { x1: 212, y1: 256, x2: 238, y2: 282 },
        { x1: 468, y1: 256, x2: 442, y2: 282 }
    ],
    bouncers: [
        { x: 100, y: 100, r: 24, color: '#F44336' },
        { x: 580, y: 100, r: 24, color: '#F44336' }
    ],
    ramps: [
        { x: 100, y: 300, w: 40, h: 40, forceX: 0, forceY: -4 },
        { x: 540, y: 300, w: 40, h: 40, forceX: 0, forceY: -4 }
    ],
    theme: {
        palette: {
            skyTop: '#5f74b8',
            skyBottom: '#f0ab80',
            grassBase: '#809860',
            rough: '#675a31',
            path: '#b79e68',
            wallMain: '#8b633d',
            wallTrim: '#e0c688'
        },
        wallStyle: {
            material: 'wood',
            postSpacing: 34
        },
        decor: [
            { kind: 'tree', x: 78, y: 248, h: 66, r: 20, color: '#4b6a32' },
            { kind: 'tree', x: 640, y: 404, h: 76, r: 24, color: '#7b5a2c' },
            { kind: 'flowers', x: 78, y: 454, density: 4 },
            { kind: 'flowers', x: 606, y: 448, density: 4 },
            { kind: 'flowers', x: 340, y: 496, density: 5 },
            { kind: 'stone', x: 42, y: 250, w: 16, h: 10, rotation: 0.12 },
            { kind: 'stone', x: 638, y: 250, w: 16, h: 10, rotation: -0.12 }
        ]
    }
};
