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
        { x: 180, y: 322, w: 170, h: 16 },
        { x: 330, y: 242, w: 170, h: 16 },
        { x: 480, y: 162, w: 80, h: 16 }
    ],
    angledWalls: [],
    bouncers: [],
    ramps: [
        { x: 354, y: 252, w: 40, h: 40, forceX: 1.0, forceY: -1.5 },
        { x: 504, y: 168, w: 40, h: 40, forceX: 0.8, forceY: -1.2 }
    ],
    lavaVents: [
        { x: 268, y: 364, r: 22, forceX: 1.2, forceY: -0.6, speed: 0.04 },
        { x: 420, y: 286, r: 22, forceX: 1.1, forceY: -1.4, speed: 0.045 }
    ]
};
