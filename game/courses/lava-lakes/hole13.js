export default {
    floors: [
        { x: 80, y: 90, w: 520, h: 340 }
    ],
    tee: { x: 120, y: 170 },
    hole: { x: 560, y: 350 },
    outerWalls: [
        { x: 64, y: 74, w: 552, h: 16 },
        { x: 64, y: 430, w: 552, h: 16 },
        { x: 64, y: 74, w: 16, h: 372 },
        { x: 600, y: 74, w: 16, h: 372 }
    ],
    obstacleWalls: [
        { x: 220, y: 90, w: 16, h: 120 },
        { x: 220, y: 300, w: 16, h: 130 },
        { x: 420, y: 170, w: 16, h: 130 },
        { x: 236, y: 204, w: 124, h: 16 },
        { x: 280, y: 300, w: 140, h: 16 }
    ],
    angledWalls: [
        { x1: 236, y1: 168, x2: 220, y2: 204 },
        { x1: 420, y1: 300, x2: 468, y2: 350 }
    ],
    bouncers: [],
    ramps: [],
    lavaVents: [
        { x: 266, y: 244, r: 22, forceX: 1.6, forceY: -0.4, speed: 0.05 },
        { x: 356, y: 332, r: 22, forceX: 1.6, forceY: 0.4, speed: 0.045 },
        { x: 486, y: 244, r: 22, forceX: 1.3, forceY: 1.0, speed: 0.04 }
    ]
};
