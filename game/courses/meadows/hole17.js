export default { // "The Spiral" — Inward winding challenge
    floors: [{ x: 50, y: 50, w: 580, h: 420 }],
    tee: { x: 100, y: 430 },
    hole: { x: 340, y: 260 },
    outerWalls: [
        { x: 34, y: 34, w: 612, h: 16 },
        { x: 34, y: 470, w: 612, h: 16 },
        { x: 34, y: 34, w: 16, h: 452 },
        { x: 630, y: 34, w: 16, h: 452 }
    ],
    obstacleWalls: [],
    angledWalls: [
        // Spiral Path (approx Snail Shell)
        { x1: 50, y1: 50, x2: 630, y2: 50 },    // Top
        { x1: 630, y1: 50, x2: 630, y2: 470 },  // R-edge
        { x1: 630, y1: 470, x2: 50, y2: 470 },  // Bottom
        { x1: 50, y1: 470, x2: 50, y2: 120 },   // L-edge up (start spiral)
        { x1: 50, y1: 120, x2: 540, y2: 120 },  // 1st inner top
        { x1: 540, y1: 120, x2: 540, y2: 380 }, // 1st inner right
        { x1: 540, y1: 380, x2: 140, y2: 380 }, // 1st inner bottom
        { x1: 140, y1: 380, x2: 140, y2: 190 }, // 2nd inner left
        { x1: 140, y1: 190, x2: 450, y2: 190 }, // 2nd inner top
        { x1: 450, y1: 190, x2: 450, y2: 310 }, // 2nd inner right
        { x1: 450, y1: 310, x2: 240, y2: 310 }  // Towards hole center
    ],
    bouncers: [],
    ramps: [
        { x: 300, y: 66, w: 100, h: 40, forceX: 4, forceY: 0 },   // Guideway top
        { x: 556, y: 220, w: 60, h: 100, forceX: 0, forceY: 4 },  // Guideway right
        { x: 250, y: 416, w: 100, h: 40, forceX: -4, forceY: 0 }  // Guideway bottom
    ]
};
