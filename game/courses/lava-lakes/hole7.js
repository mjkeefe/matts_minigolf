export default {
    floors: [
        { x: 90, y: 90, w: 500, h: 340 }
    ],
    tee: { x: 130, y: 390 },
    hole: { x: 550, y: 130 },
    outerWalls: [
        { x: 74, y: 74, w: 532, h: 16 },
        { x: 74, y: 430, w: 532, h: 16 },
        { x: 74, y: 74, w: 16, h: 372 },
        { x: 590, y: 74, w: 16, h: 372 }
    ],
    obstacleWalls: [],
    angledWalls: [],
    bouncers: [
        { x: 232, y: 322, r: 17, color: '#e67b39' },
        { x: 304, y: 248, r: 17, color: '#d7652d' },
        { x: 380, y: 298, r: 17, color: '#e67b39' },
        { x: 452, y: 212, r: 17, color: '#d7652d' }
    ],
    ramps: [],
    lavaVents: [
        { x: 334, y: 170, r: 22, forceX: 0.2, forceY: -2.0, speed: 0.05 }
    ]
};
