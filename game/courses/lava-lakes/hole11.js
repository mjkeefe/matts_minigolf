export default {
    floors: [
        { x: 80, y: 90, w: 520, h: 340 }
    ],
    tee: { x: 130, y: 390 },
    hole: { x: 550, y: 130 },
    outerWalls: [
        { x: 64, y: 74, w: 552, h: 16 },
        { x: 64, y: 430, w: 552, h: 16 },
        { x: 64, y: 74, w: 16, h: 372 },
        { x: 600, y: 74, w: 16, h: 372 }
    ],
    obstacleWalls: [
        { x: 230, y: 210, w: 40, h: 18 },
        { x: 410, y: 210, w: 40, h: 18 }
    ],
    angledWalls: [
        { x1: 270, y1: 210, x2: 320, y2: 150 },
        { x1: 410, y1: 210, x2: 360, y2: 150 },
        { x1: 270, y1: 210, x2: 320, y2: 320 },
        { x1: 410, y1: 210, x2: 360, y2: 320 }
    ],
    rotatingObstacles: [
        { cx: 340, cy: 238, length: 86, arms: 4, speed: 0.015, width: 12 }
    ],
    bouncers: [],
    ramps: [],
    lavaVents: [
        { x: 340, y: 146, r: 22, forceX: 0, forceY: -2.0, speed: 0.05 }
    ]
};
