export default {
    floors: [
        { x: 100, y: 70, w: 480, h: 380 }
    ],
    tee: { x: 340, y: 110 },
    hole: { x: 340, y: 410 },
    outerWalls: [
        { x: 84, y: 54, w: 512, h: 16 },
        { x: 84, y: 450, w: 512, h: 16 },
        { x: 84, y: 54, w: 16, h: 412 },
        { x: 580, y: 54, w: 16, h: 412 }
    ],
    obstacleWalls: [
        { x: 120, y: 160, w: 150, h: 16 },
        { x: 410, y: 240, w: 150, h: 16 },
        { x: 120, y: 320, w: 150, h: 16 }
    ],
    angledWalls: [],
    bouncers: [],
    ramps: [],
    lavaVents: [
        { x: 194, y: 186, r: 22, forceX: 1.3, forceY: 1.7, speed: 0.045 },
        { x: 486, y: 266, r: 22, forceX: -1.2, forceY: 1.8, speed: 0.05 },
        { x: 194, y: 346, r: 22, forceX: 1.1, forceY: 1.7, speed: 0.04 }
    ]
};
