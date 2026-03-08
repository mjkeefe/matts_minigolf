export default {
    floors: [
        { x: 60, y: 60, w: 560, h: 400 }
    ],
    tee: { x: 100, y: 420 },
    hole: { x: 580, y: 100 },
    outerWalls: [
        { x: 44, y: 44, w: 592, h: 16 },
        { x: 44, y: 460, w: 592, h: 16 },
        { x: 44, y: 44, w: 16, h: 432 },
        { x: 620, y: 44, w: 16, h: 432 }
    ],
    obstacleWalls: [
        { x: 150, y: 340, w: 140, h: 16 },
        { x: 274, y: 260, w: 16, h: 96 },
        { x: 274, y: 260, w: 180, h: 16 },
        { x: 438, y: 176, w: 16, h: 100 },
        { x: 174, y: 210, w: 30, h: 30 },
        { x: 258, y: 184, w: 30, h: 30 },
        { x: 348, y: 226, w: 30, h: 30 },
        { x: 446, y: 198, w: 30, h: 30 }
    ],
    angledWalls: [
        { x1: 290, y1: 356, x2: 348, y2: 260 },
        { x1: 454, y1: 260, x2: 512, y2: 176 }
    ],
    rotatingObstacles: [
        { cx: 340, cy: 150, length: 86, arms: 4, speed: 0.018, width: 12 }
    ],
    bouncers: [
        { x: 540, y: 360, r: 20, color: '#d85f28' }
    ],
    ramps: [
        { x: 520, y: 300, w: 44, h: 44, forceX: 0.6, forceY: -2.0 }
    ],
    lavaVents: [
        { x: 332, y: 388, r: 22, forceX: 1.6, forceY: -1.7, speed: 0.05 },
        { x: 486, y: 228, r: 22, forceX: 1.0, forceY: -1.8, speed: 0.045 },
        { x: 340, y: 132, r: 24, forceX: 0, forceY: -2.2, speed: 0.04 }
    ]
};
