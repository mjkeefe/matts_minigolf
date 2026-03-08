export default {
    floors: [
        { x: 90, y: 80, w: 500, h: 360 }
    ],
    tee: { x: 130, y: 130 },
    hole: { x: 540, y: 390 },
    outerWalls: [
        { x: 74, y: 64, w: 532, h: 16 },
        { x: 74, y: 440, w: 532, h: 16 },
        { x: 74, y: 64, w: 16, h: 392 },
        { x: 590, y: 64, w: 16, h: 392 }
    ],
    obstacleWalls: [
        { x: 170, y: 150, w: 16, h: 160 },
        { x: 170, y: 294, w: 250, h: 16 },
        { x: 404, y: 220, w: 16, h: 160 },
        { x: 420, y: 220, w: 120, h: 16 }
    ],
    angledWalls: [
        { x1: 186, y1: 214, x2: 242, y2: 270 },
        { x1: 420, y1: 300, x2: 470, y2: 350 }
    ],
    bouncers: [],
    ramps: [],
    lavaVents: [
        { x: 236, y: 340, r: 22, forceX: 1.3, forceY: 0.2, speed: 0.045 },
        { x: 478, y: 262, r: 22, forceX: 1.1, forceY: 1.1, speed: 0.04 }
    ]
};
