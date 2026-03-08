export default {
    floors: [
        { x: 90, y: 80, w: 500, h: 360 }
    ],
    tee: { x: 130, y: 400 },
    hole: { x: 550, y: 120 },
    outerWalls: [
        { x: 74, y: 64, w: 532, h: 16 },
        { x: 74, y: 440, w: 532, h: 16 },
        { x: 74, y: 64, w: 16, h: 392 },
        { x: 590, y: 64, w: 16, h: 392 }
    ],
    obstacleWalls: [
        { x: 190, y: 340, w: 16, h: 84 },
        { x: 190, y: 340, w: 170, h: 16 },
        { x: 344, y: 250, w: 16, h: 106 },
        { x: 344, y: 250, w: 140, h: 16 },
        { x: 468, y: 150, w: 16, h: 116 }
    ],
    angledWalls: [],
    bouncers: [],
    ramps: [],
    lavaVents: [
        { x: 238, y: 382, r: 22, forceX: 1.7, forceY: -0.2, speed: 0.04 },
        { x: 392, y: 290, r: 22, forceX: 1.4, forceY: -1.3, speed: 0.05 }
    ]
};
