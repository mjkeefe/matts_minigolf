export default { // "The Split Decision" — Branching paths
    floors: [{ x: 50, y: 50, w: 580, h: 420 }],
    tee: { x: 340, y: 430 },
    hole: { x: 340, y: 90 },
    outerWalls: [
        { x: 34, y: 34, w: 612, h: 16 },
        { x: 34, y: 470, w: 612, h: 16 },
        { x: 34, y: 34, w: 16, h: 452 },
        { x: 630, y: 34, w: 16, h: 452 }
    ],
    obstacleWalls: [
        // Middle horizontal dividers
        { x: 50, y: 252, w: 100, h: 16 },
        { x: 230, y: 252, w: 220, h: 16 },
        { x: 530, y: 252, w: 100, h: 16 },
        // Blocking blocks in front of gap-ramps
        { x: 165, y: 380, w: 50, h: 16 },
        { x: 465, y: 380, w: 50, h: 16 }
    ],
    angledWalls: [],
    bouncers: [],
    ramps: [
        { x: 170, y: 280, w: 40, h: 40, forceX: 0, forceY: -5 }, // L path boost
        { x: 470, y: 280, w: 40, h: 40, forceX: 0, forceY: -5 }  // R path boost
    ]
};
