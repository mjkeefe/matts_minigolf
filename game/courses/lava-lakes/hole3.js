export default {
    floors: [
        { x: 100, y: 80, w: 480, h: 360 }
    ],
    tee: { x: 140, y: 400 },
    hole: { x: 540, y: 120 },
    outerWalls: [
        { x: 84, y: 64, w: 512, h: 16 },
        { x: 84, y: 440, w: 512, h: 16 },
        { x: 84, y: 64, w: 16, h: 392 },
        { x: 580, y: 64, w: 16, h: 392 }
    ],
    obstacleWalls: [
        { x: 180, y: 312, w: 120, h: 16 },
        { x: 320, y: 236, w: 120, h: 16 },
        { x: 460, y: 164, w: 90, h: 16 }
    ],
    angledWalls: [
        { x1: 300, y1: 312, x2: 352, y2: 260 },
        { x1: 440, y1: 236, x2: 492, y2: 184 }
    ],
    bouncers: [],
    ramps: [
        { x: 352, y: 248, w: 44, h: 44, forceX: 0.8, forceY: -1.6 }
    ],
    lavaVents: [
        { x: 250, y: 360, r: 21, forceX: 1.2, forceY: -1.0, speed: 0.05 },
        { x: 398, y: 278, r: 21, forceX: 1.2, forceY: -1.2, speed: 0.045 }
    ]
};
