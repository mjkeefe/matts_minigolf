export default { // "The Grand U" — Large U-shaped course
    floors: [],
    floorPolygons: [
        {
            points: [
                { x: 100, y: 80 }, { x: 215, y: 80 },   // Top L cap
                { x: 215, y: 350 },                    // Inner L down
                { x: 465, y: 350 },                    // Inner R up
                { x: 465, y: 80 }, { x: 580, y: 80 },   // Top R cap
                { x: 580, y: 480 },                    // Outer R down
                { x: 100, y: 480 }                     // Outer L back up
            ]
        }
    ],
    tee: { x: 155, y: 130 },
    hole: { x: 525, y: 130 },
    outerWalls: [],
    obstacleWalls: [],
    angledWalls: [
        // Perimeter of the U
        { x1: 100, y1: 80, x2: 215, y2: 80 },   // Top Left cap
        { x1: 215, y1: 80, x2: 215, y2: 350 },  // Left Inner
        { x1: 215, y1: 350, x2: 465, y2: 350 }, // Bottom Inner
        { x1: 465, y1: 350, x2: 465, y2: 80 },  // Right Inner
        { x1: 465, y1: 80, x2: 580, y2: 80 },   // Top Right cap
        { x1: 580, y1: 80, x2: 580, y2: 480 },  // Right Outer
        { x1: 580, y1: 480, x2: 100, y2: 480 }, // Bottom Outer
        { x1: 100, y1: 480, x2: 100, y2: 80 }   // Left Outer
    ],
    bouncers: [
        { x: 340, y: 420, r: 20, color: '#FF5722' }
    ],
    ramps: [
        { x: 270, y: 410, w: 140, h: 26, forceX: 2.6, forceY: 0 }
    ],
    theme: {
        palette: {
            skyTop: '#5d72b5',
            skyBottom: '#efad82',
            grassBase: '#80985f',
            rough: '#675932',
            path: '#b89f68',
            wallMain: '#8b633d',
            wallTrim: '#e0c587'
        },
        wallStyle: {
            material: 'wood',
            postSpacing: 36
        },
        decor: [
            { kind: 'tree', x: 70, y: 286, h: 74, r: 22, color: '#4d6c33' },
            { kind: 'tree', x: 614, y: 326, h: 78, r: 24, color: '#7f5d2b' },
            { kind: 'pond', x: 340, y: 214, w: 172, h: 88 },
            { kind: 'flowers', x: 124, y: 496, density: 5 },
            { kind: 'flowers', x: 560, y: 496, density: 5 },
            { kind: 'bush', x: 338, y: 352, r: 14 },
            { kind: 'stone', x: 340, y: 332, w: 18, h: 12, rotation: 0.1 }
        ]
    }
};
