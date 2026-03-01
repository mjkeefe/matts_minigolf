export default {
    floors: [
        { x: 100, y: 80, w: 460, h: 360 }
    ],
    tee: { x: 330, y: 396 },
    hole: { x: 330, y: 122 },
    outerWalls: [
        { x: 84, y: 64, w: 492, h: 16 },
        { x: 84, y: 440, w: 492, h: 16 },
        { x: 84, y: 64, w: 16, h: 392 },
        { x: 560, y: 64, w: 16, h: 392 }
    ],
    obstacleWalls: [
        { x: 100, y: 240, w: 140, h: 16 },
        { x: 292, y: 240, w: 76, h: 16 },
        { x: 420, y: 240, w: 140, h: 16 },
        { x: 166, y: 198, w: 44, h: 16 },
        { x: 450, y: 198, w: 44, h: 16 }
    ],
    angledWalls: [],
    bouncers: [],
    ramps: [
        { x: 174, y: 258, w: 56, h: 34, forceX: 0.6, forceY: -2.4 },
        { x: 430, y: 258, w: 56, h: 34, forceX: -0.6, forceY: -2.4 }
    ]
};
