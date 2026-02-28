export default {
    floors: [
        { x: 50, y: 350, w: 400, h: 100 },
        { x: 450, y: 50, w: 100, h: 400 }
    ],
    tee: { x: 100, y: 400 },
    hole: { x: 500, y: 100 },
    outerWalls: [
        { x: 50, y: 334, w: 384, h: 16 }, // Top horizontal
        { x: 34, y: 334, w: 16, h: 132 }, // Left cap
        { x: 50, y: 450, w: 400, h: 16 }, // Bottom horizontal
        { x: 550, y: 34, w: 16, h: 316 }, // Right vertical
        { x: 434, y: 34, w: 132, h: 16 }, // Top vertical cap
        { x: 434, y: 50, w: 16, h: 284 }  // Left vertical inner
    ],
    obstacleWalls: [],
    angledWalls: [
        { x1: 450, y1: 450, x2: 550, y2: 350 }
    ],
    bouncers: [],
    ramps: []
};
