export default { // "The Spiral" — Inward winding challenge
    floors: [{ x: 50, y: 50, w: 580, h: 420 }],
    tee: { x: 96, y: 86 },
    hole: { x: 336, y: 258 },
    outerWalls: [],
    obstacleWalls: [],
    angledWalls: [
        // Spiral Path (approx Snail Shell)
        { x1: 50, y1: 50, x2: 630, y2: 50 },    // Top
        { x1: 630, y1: 50, x2: 630, y2: 470 },  // R-edge
        { x1: 630, y1: 470, x2: 50, y2: 470 },  // Bottom
        { x1: 50, y1: 470, x2: 50, y2: 120 },   // L-edge up (start spiral)
        { x1: 50, y1: 120, x2: 520, y2: 120 },  // 1st inner top
        { x1: 520, y1: 120, x2: 520, y2: 360 }, // 1st inner right
        { x1: 520, y1: 360, x2: 160, y2: 360 }, // 1st inner bottom
        { x1: 160, y1: 360, x2: 160, y2: 200 }, // 2nd inner left
        { x1: 160, y1: 200, x2: 430, y2: 200 }, // 2nd inner top
        { x1: 430, y1: 200, x2: 430, y2: 300 }, // 2nd inner right
        { x1: 430, y1: 300, x2: 260, y2: 300 }, // Towards hole center
        { x1: 520, y1: 120, x2: 548, y2: 148 },
        { x1: 160, y1: 360, x2: 132, y2: 332 }
    ],
    bouncers: [],
    ramps: [
        { x: 280, y: 66, w: 120, h: 40, forceX: 3.4, forceY: 0 },   // Guideway top
        { x: 536, y: 210, w: 60, h: 96, forceX: 0, forceY: 3.4 },   // Guideway right
        { x: 250, y: 396, w: 110, h: 40, forceX: -3.4, forceY: 0 }, // Guideway bottom
        { x: 208, y: 228, w: 72, h: 34, forceX: 2.2, forceY: 0 }    // Inner guide
    ],
    theme: {
        palette: {
            skyTop: '#5d72b6',
            skyBottom: '#efa97e',
            grassBase: '#80985f',
            rough: '#675932',
            path: '#b79e68',
            wallMain: '#8b633d',
            wallTrim: '#e0c688'
        },
        wallStyle: {
            material: 'wood',
            postSpacing: 34
        },
        decor: [
            { kind: 'tree', x: 88, y: 248, h: 66, r: 20, color: '#4b6a32' },
            { kind: 'tree', x: 640, y: 420, h: 74, r: 24, color: '#7a592c' },
            { kind: 'flowers', x: 76, y: 494, density: 4 },
            { kind: 'flowers', x: 606, y: 444, density: 4 },
            { kind: 'stone', x: 82, y: 318, w: 16, h: 10, rotation: 0.1 },
            { kind: 'stone', x: 606, y: 246, w: 16, h: 10, rotation: -0.15 }
        ]
    }
};
