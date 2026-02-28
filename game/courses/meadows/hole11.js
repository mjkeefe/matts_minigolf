export default { // "The Grand U" — Large U-shaped course
    floors: [],
    floorPolygons: [
        {
            points: [
                { x: 100, y: 80 }, { x: 200, y: 80 },   // Top L cap
                { x: 200, y: 380 },                    // Inner L down
                { x: 480, y: 380 },                    // Inner R up
                { x: 480, y: 80 }, { x: 580, y: 80 },   // Top R cap
                { x: 580, y: 480 },                    // Outer R down
                { x: 100, y: 480 }                     // Outer L back up
            ]
        }
    ],
    tee: { x: 150, y: 120 },
    hole: { x: 530, y: 120 },
    outerWalls: [],
    obstacleWalls: [],
    angledWalls: [
        // Perimeter of the U
        { x1: 100, y1: 80, x2: 200, y2: 80 },   // Top Left cap
        { x1: 200, y1: 80, x2: 200, y2: 380 },  // Left Inner
        { x1: 200, y1: 380, x2: 480, y2: 380 }, // Bottom Inner
        { x1: 480, y1: 380, x2: 480, y2: 80 },  // Right Inner
        { x1: 480, y1: 80, x2: 580, y2: 80 },   // Top Right cap
        { x1: 580, y1: 80, x2: 580, y2: 480 },  // Right Outer
        { x1: 580, y1: 480, x2: 100, y2: 480 }, // Bottom Outer
        { x1: 100, y1: 480, x2: 100, y2: 80 }   // Left Outer
    ],
    bouncers: [
        { x: 340, y: 430, r: 25, color: '#FF5722' }
    ],
    ramps: []
};
