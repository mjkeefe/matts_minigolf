export default {
    floors: [
        { x: 60, y: 60, w: 560, h: 400 }
    ],
    tee: { x: 340, y: 414 },
    hole: { x: 340, y: 108 },
    outerWalls: [
        { x: 44, y: 44, w: 592, h: 16 },
        { x: 44, y: 460, w: 592, h: 16 },
        { x: 44, y: 44, w: 16, h: 432 },
        { x: 620, y: 44, w: 16, h: 432 }
    ],
    obstacleWalls: [
        { x: 140, y: 340, w: 120, h: 16 },
        { x: 244, y: 260, w: 16, h: 96 },
        { x: 244, y: 260, w: 180, h: 16 },
        { x: 408, y: 180, w: 16, h: 96 },
        { x: 170, y: 206, w: 28, h: 28 },
        { x: 250, y: 178, w: 28, h: 28 },
        { x: 336, y: 220, w: 28, h: 28 },
        { x: 428, y: 194, w: 28, h: 28 }
    ],
    angledWalls: [
        { x1: 260, y1: 356, x2: 320, y2: 260 },
        { x1: 424, y1: 260, x2: 486, y2: 180 }
    ],
    rotatingObstacles: [
        { cx: 340, cy: 148, length: 88, arms: 4, speed: 0.018, width: 12 }
    ],
    bouncers: [],
    ramps: [
        { x: 284, y: 372, w: 52, h: 32, forceX: 1.9, forceY: -2.1 },
        { x: 438, y: 214, w: 52, h: 32, forceX: 1.2, forceY: -2.4 },
        { x: 296, y: 120, w: 88, h: 30, forceX: 0, forceY: -2.8 }
    ]
};
