export default {
    floors: [
        { x: 80, y: 80, w: 520, h: 360 }
    ],
    tee: { x: 120, y: 400 },
    hole: { x: 560, y: 120 },
    outerWalls: [
        { x: 64, y: 64, w: 552, h: 16 },
        { x: 64, y: 440, w: 552, h: 16 },
        { x: 64, y: 64, w: 16, h: 392 },
        { x: 600, y: 64, w: 16, h: 392 }
    ],
    obstacleWalls: [
        { x: 182, y: 314, w: 16, h: 126 },
        { x: 182, y: 314, w: 148, h: 16 },
        { x: 330, y: 228, w: 16, h: 102 },
        { x: 330, y: 228, w: 156, h: 16 },
        { x: 486, y: 138, w: 16, h: 106 }
    ],
    angledWalls: [
        { x1: 198, y1: 372, x2: 252, y2: 330 },
        { x1: 346, y1: 278, x2: 392, y2: 244 }
    ],
    bouncers: [],
    ramps: [],
    lavaVents: [
        { x: 250, y: 374, r: 22, forceX: 1.7, forceY: -0.4, speed: 0.045 },
        { x: 404, y: 278, r: 22, forceX: 1.5, forceY: -1.4, speed: 0.04 },
        { x: 538, y: 174, r: 22, forceX: 1.2, forceY: -1.2, speed: 0.05 }
    ]
};
