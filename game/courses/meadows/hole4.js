export default {  // "The Serpent" — S-shaped zigzag path
    floors: [
        { x: 80, y: 400, w: 420, h: 80 },
        { x: 420, y: 240, w: 80, h: 240 },
        { x: 180, y: 240, w: 320, h: 80 },
        { x: 180, y: 80, w: 80, h: 240 },
        { x: 180, y: 80, w: 420, h: 80 }
    ],
    tee: { x: 130, y: 440 },
    hole: { x: 550, y: 120 },
    outerWalls: [
        { x: 64, y: 480, w: 436, h: 16 },
        { x: 64, y: 384, w: 16, h: 112 },
        { x: 64, y: 384, w: 356, h: 16 },
        { x: 500, y: 224, w: 16, h: 272 },
        { x: 260, y: 224, w: 256, h: 16 },
        { x: 260, y: 160, w: 16, h: 80 },
        { x: 260, y: 160, w: 356, h: 16 },
        { x: 600, y: 64, w: 16, h: 112 },
        { x: 164, y: 64, w: 452, h: 16 },
        { x: 164, y: 64, w: 16, h: 256 },
        { x: 164, y: 320, w: 256, h: 16 },
        { x: 404, y: 336, w: 16, h: 64 }
    ],
    obstacleWalls: [],
    angledWalls: [],
    bouncers: [],
    ramps: [
        { x: 410, y: 370, w: 50, h: 50, forceX: 0, forceY: -6 },
        { x: 300, y: 260, w: 50, h: 40, forceX: -5, forceY: 0 },
        { x: 200, y: 130, w: 50, h: 40, forceX: 5, forceY: 0 }
    ]
};
