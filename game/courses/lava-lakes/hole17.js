export default {
    floors: [
        { x: 80, y: 70, w: 520, h: 380 }
    ],
    tee: { x: 120, y: 110 },
    hole: { x: 520, y: 390 },
    outerWalls: [
        { x: 64, y: 54, w: 552, h: 16 },
        { x: 64, y: 450, w: 552, h: 16 },
        { x: 64, y: 54, w: 16, h: 412 },
        { x: 600, y: 54, w: 16, h: 412 }
    ],
    obstacleWalls: [],
    angledWalls: [
        { x1: 120, y1: 150, x2: 520, y2: 150 },
        { x1: 520, y1: 150, x2: 520, y2: 250 },
        { x1: 520, y1: 250, x2: 180, y2: 250 },
        { x1: 180, y1: 250, x2: 180, y2: 330 },
        { x1: 180, y1: 330, x2: 460, y2: 330 }
    ],
    bouncers: [
        { x: 300, y: 150, r: 16, color: '#d96b2f' },
        { x: 360, y: 250, r: 16, color: '#e17a36' }
    ],
    ramps: [],
    lavaVents: [
        { x: 420, y: 150, r: 22, forceX: 1.8, forceY: 0.2, speed: 0.05 },
        { x: 260, y: 250, r: 22, forceX: -1.6, forceY: 0.4, speed: 0.045 },
        { x: 320, y: 330, r: 22, forceX: 1.4, forceY: 0.6, speed: 0.04 }
    ]
};
