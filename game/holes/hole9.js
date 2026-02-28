export default {  // "The Long Shot" — endurance/distance hole
    floors: [{ x: 20, y: 100, w: 640, h: 320 }],
    tee: { x: 60, y: 260 },
    hole: { x: 620, y: 260 },
    outerWalls: [
        { x: 10, y: 80, w: 660, h: 20 }, // Thicker walls
        { x: 10, y: 420, w: 660, h: 20 },
        { x: 10, y: 80, w: 20, h: 360 },
        { x: 650, y: 80, w: 20, h: 360 }
    ],
    obstacleWalls: [
        { x: 150, y: 100, w: 10, h: 120 },
        { x: 150, y: 300, w: 10, h: 120 },
        { x: 500, y: 100, w: 10, h: 100 },
        { x: 500, y: 320, w: 10, h: 100 }
    ],
    angledWalls: [
        { x1: 520, y1: 150, x2: 580, y2: 220 },
        { x1: 520, y1: 370, x2: 580, y2: 300 }
    ],
    bouncers: [
        { x: 300, y: 180, r: 20, color: '#E91E63' },
        { x: 400, y: 340, r: 20, color: '#9C27B0' },
        { x: 350, y: 260, r: 22, color: '#00BCD4' }
    ],
    ramps: [
        { x: 100, y: 240, w: 40, h: 40, forceX: 5, forceY: 0 },
        { x: 530, y: 240, w: 50, h: 40, forceX: 4, forceY: 0 }
    ]
};
