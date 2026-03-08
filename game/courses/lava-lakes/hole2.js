export default {
    floors: [
        { x: 90, y: 90, w: 500, h: 340 }
    ],
    tee: { x: 130, y: 370 },
    hole: { x: 540, y: 130 },
    outerWalls: [
        { x: 74, y: 74, w: 532, h: 16 },
        { x: 74, y: 430, w: 532, h: 16 },
        { x: 74, y: 74, w: 16, h: 372 },
        { x: 590, y: 74, w: 16, h: 372 }
    ],
    obstacleWalls: [
        { x: 214, y: 290, w: 16, h: 140 },
        { x: 214, y: 290, w: 230, h: 16 },
        { x: 428, y: 170, w: 16, h: 136 },
        { x: 300, y: 170, w: 144, h: 16 }
    ],
    angledWalls: [
        { x1: 230, y1: 354, x2: 278, y2: 306 },
        { x1: 444, y1: 240, x2: 496, y2: 188 }
    ],
    bouncers: [],
    ramps: [],
    lavaVents: [
        { x: 262, y: 356, r: 22, forceX: 1.5, forceY: -0.7, speed: 0.05 },
        { x: 466, y: 214, r: 22, forceX: 1.2, forceY: -1.4, speed: 0.04 }
    ]
};
