export default {
    floors: [
        { x: 110, y: 80, w: 460, h: 360 }
    ],
    tee: { x: 150, y: 390 },
    hole: { x: 530, y: 120 },
    outerWalls: [
        { x: 94, y: 64, w: 492, h: 16 },
        { x: 94, y: 440, w: 492, h: 16 },
        { x: 94, y: 64, w: 16, h: 392 },
        { x: 570, y: 64, w: 16, h: 392 }
    ],
    obstacleWalls: [
        { x: 220, y: 292, w: 130, h: 16 },
        { x: 360, y: 212, w: 130, h: 16 },
        { x: 452, y: 120, w: 16, h: 72 }
    ],
    angledWalls: [
        { x1: 188, y1: 344, x2: 220, y2: 292 },
        { x1: 490, y1: 212, x2: 530, y2: 152 }
    ],
    bouncers: [],
    ramps: [],
    lavaVents: [
        { x: 288, y: 356, r: 22, forceX: 1.2, forceY: -1.1, speed: 0.04 },
        { x: 414, y: 168, r: 22, forceX: 0.8, forceY: -1.6, speed: 0.045 }
    ]
};
