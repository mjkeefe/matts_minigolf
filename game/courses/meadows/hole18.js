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
        { x: 150, y: 240, w: 80, h: 16 }, // Side bumper
        { x: 450, y: 240, w: 80, h: 16 }, // Side bumper
        { x: 315, y: 280, w: 50, h: 16 }  // Mid bumper
    ],
    rotatingObstacles: [
        { cx: 340, cy: 370, length: 140, arms: 4, speed: 0.02, width: 12 }, // Lower Windmill
        { cx: 340, cy: 170, length: 160, arms: 2, speed: -0.04, width: 12 } // Fast Upper Swiper
    ],
    angledWalls: [],
    bouncers: [
        { x: 100, y: 100, r: 30, color: '#F44336' },
        { x: 580, y: 100, r: 30, color: '#F44336' }
    ],
    ramps: [
        { x: 100, y: 300, w: 40, h: 40, forceX: 0, forceY: -5 },
        { x: 540, y: 300, w: 40, h: 40, forceX: 0, forceY: -5 }
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
            { kind: 'tree', x: 40, y: 118, h: 72, r: 22, color: '#4b6a32' },
            { kind: 'tree', x: 640, y: 404, h: 76, r: 24, color: '#7b5a2c' },
            { kind: 'flowers', x: 78, y: 454, density: 4 },
            { kind: 'flowers', x: 636, y: 66, density: 4 },
            { kind: 'flowers', x: 340, y: 496, density: 5 },
            { kind: 'stone', x: 42, y: 250, w: 16, h: 10, rotation: 0.12 },
            { kind: 'stone', x: 638, y: 250, w: 16, h: 10, rotation: -0.12 }
        ]
    }
};
