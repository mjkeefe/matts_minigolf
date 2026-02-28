export default {
    floors: [
        { x: 215, y: 30, w: 250, h: 460 }
    ],
    tee: { x: 340, y: 460 },
    hole: { x: 340, y: 80 },
    outerWalls: [
        { x: 199, y: 14, w: 282, h: 16 },   // Top
        { x: 199, y: 490, w: 282, h: 16 },   // Bottom
        { x: 199, y: 14, w: 16, h: 492 },    // Left
        { x: 465, y: 14, w: 16, h: 492 },    // Right
    ],
    obstacleWalls: [],
    angledWalls: [],
    movingWalls: [
        { x: 280, y: 333, w: 80, h: 16, axis: 'x', min: 215, max: 385, speed: 1.5, dir: 1 },
        { x: 280, y: 207, w: 80, h: 16, axis: 'x', min: 215, max: 385, speed: 1.5, dir: -1 }
    ],
    bouncers: [
        { x: 295, y: 80, r: 20, color: '#9C27B0' },
        { x: 385, y: 80, r: 20, color: '#9C27B0' }
    ],
    ramps: []
};
