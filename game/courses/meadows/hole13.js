export default { // "The Zig-Zag" — Simple Z corridor
    floors: [
        { x: 100, y: 50, w: 480, h: 100 },  // Top
        { x: 480, y: 150, w: 100, h: 220 }, // Vertical
        { x: 100, y: 370, w: 480, h: 100 }  // Bottom
    ],
    tee: { x: 150, y: 100 },
    hole: { x: 150, y: 420 },
    outerWalls: [
        // Top segment
        { x: 84, y: 34, w: 512, h: 16 },
        { x: 84, y: 34, w: 16, h: 132 },
        { x: 100, y: 150, w: 380, h: 16 },
        // Vertical segment
        { x: 580, y: 34, w: 16, h: 452 },
        { x: 464, y: 150, w: 16, h: 220 },
        // Bottom segment
        { x: 100, y: 354, w: 380, h: 16 },
        { x: 84, y: 354, w: 16, h: 132 },
        { x: 84, y: 470, w: 512, h: 16 }
    ],
    obstacleWalls: [],
    angledWalls: [],
    bouncers: [],
    ramps: []
};
