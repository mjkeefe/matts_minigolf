export default {
    floors: [
        { x: 90, y: 70, w: 500, h: 380 }
    ],
    tee: { x: 130, y: 110 },
    hole: { x: 550, y: 410 },
    outerWalls: [
        { x: 74, y: 54, w: 532, h: 16 },
        { x: 74, y: 450, w: 532, h: 16 },
        { x: 74, y: 54, w: 16, h: 412 },
        { x: 590, y: 54, w: 16, h: 412 }
    ],
    obstacleWalls: [
        { x: 180, y: 130, w: 16, h: 130 },
        { x: 180, y: 244, w: 180, h: 16 },
        { x: 360, y: 244, w: 16, h: 130 },
        { x: 360, y: 358, w: 170, h: 16 }
    ],
    angledWalls: [
        { x1: 196, y1: 184, x2: 254, y2: 244 },
        { x1: 376, y1: 298, x2: 430, y2: 358 }
    ],
    bouncers: [],
    ramps: [],
    lavaVents: [
        { x: 260, y: 206, r: 22, forceX: 1.4, forceY: 0.5, speed: 0.045 },
        { x: 442, y: 322, r: 22, forceX: 1.0, forceY: 1.1, speed: 0.04 }
    ]
};
