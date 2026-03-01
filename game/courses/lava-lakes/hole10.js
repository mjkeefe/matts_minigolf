export default {
    floors: [
        { x: 100, y: 70, w: 460, h: 380 }
    ],
    tee: { x: 320, y: 112 },
    hole: { x: 320, y: 404 },
    outerWalls: [
        { x: 84, y: 54, w: 492, h: 16 },
        { x: 84, y: 450, w: 492, h: 16 },
        { x: 84, y: 54, w: 16, h: 412 },
        { x: 560, y: 54, w: 16, h: 412 }
    ],
    obstacleWalls: [
        { x: 150, y: 190, w: 110, h: 16 },
        { x: 420, y: 250, w: 100, h: 16 },
        { x: 150, y: 310, w: 110, h: 16 }
    ],
    angledWalls: [],
    bouncers: [],
    ramps: [
        { x: 160, y: 134, w: 74, h: 34, forceX: 1.8, forceY: 2.2 },
        { x: 408, y: 214, w: 74, h: 34, forceX: -1.8, forceY: 2.2 },
        { x: 188, y: 334, w: 74, h: 34, forceX: 1.6, forceY: 2.4 }
    ]
};
