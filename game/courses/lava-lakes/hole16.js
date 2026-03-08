export default {
    floors: [
        { x: 100, y: 80, w: 480, h: 360 }
    ],
    tee: { x: 140, y: 120 },
    hole: { x: 540, y: 400 },
    outerWalls: [
        { x: 84, y: 64, w: 512, h: 16 },
        { x: 84, y: 440, w: 512, h: 16 },
        { x: 84, y: 64, w: 16, h: 392 },
        { x: 580, y: 64, w: 16, h: 392 }
    ],
    obstacleWalls: [
        { x: 120, y: 220, w: 150, h: 16 },
        { x: 300, y: 220, w: 80, h: 16 },
        { x: 410, y: 220, w: 150, h: 16 },
        { x: 170, y: 176, w: 50, h: 16 },
        { x: 460, y: 176, w: 50, h: 16 }
    ],
    angledWalls: [
        { x1: 270, y1: 220, x2: 300, y2: 254 },
        { x1: 380, y1: 220, x2: 410, y2: 254 }
    ],
    bouncers: [],
    ramps: [
        { x: 314, y: 232, w: 52, h: 40, forceX: 0, forceY: 2.0 }
    ],
    lavaVents: [
        { x: 200, y: 254, r: 22, forceX: 0.6, forceY: 1.8, speed: 0.04 },
        { x: 480, y: 254, r: 22, forceX: -0.6, forceY: 1.8, speed: 0.05 }
    ]
};
