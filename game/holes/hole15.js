export default { // "The Bridge" — Vertical connection with sweepers
    floors: [
        { x: 100, y: 50, w: 480, h: 120 },  // Top area
        { x: 290, y: 170, w: 100, h: 180 }, // Bridge
        { x: 100, y: 350, w: 480, h: 120 }  // Bottom area
    ],
    tee: { x: 340, y: 110 },
    hole: { x: 340, y: 410 },
    outerWalls: [
        // Top Area
        { x: 84, y: 34, w: 512, h: 16 },
        { x: 84, y: 34, w: 16, h: 152 },
        { x: 580, y: 34, w: 16, h: 152 },
        { x: 100, y: 170, w: 190, h: 16 },
        { x: 390, y: 170, w: 190, h: 16 },
        // Bridge
        { x: 274, y: 170, w: 16, h: 180 },
        { x: 390, y: 170, w: 16, h: 180 },
        // Bottom Area
        { x: 100, y: 334, w: 190, h: 16 },
        { x: 390, y: 334, w: 190, h: 16 },
        { x: 84, y: 334, w: 16, h: 152 },
        { x: 580, y: 334, w: 16, h: 152 },
        { x: 84, y: 470, w: 512, h: 16 }
    ],
    obstacleWalls: [],
    movingWalls: [
        { x: 100, y: 220, w: 150, h: 16, axis: 'x', min: 100, max: 430, speed: 12, dir: 1 },
        { x: 430, y: 280, w: 150, h: 16, axis: 'x', min: 100, max: 430, speed: 10, dir: -1 }
    ],
    angledWalls: [],
    bouncers: [],
    ramps: []
};
