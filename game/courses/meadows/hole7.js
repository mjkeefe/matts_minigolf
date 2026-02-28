export default {  // "The Windmill" — classic timing challenge
    floors: [{ x: 190, y: 30, w: 300, h: 460 }],
    tee: { x: 340, y: 460 },
    hole: { x: 340, y: 70 },
    outerWalls: [
        { x: 174, y: 14, w: 332, h: 16 },
        { x: 174, y: 490, w: 332, h: 16 },
        { x: 174, y: 14, w: 16, h: 492 },
        { x: 490, y: 14, w: 16, h: 492 }
    ],
    obstacleWalls: [], // Side walls removed
    rotatingObstacles: [
        { cx: 340, cy: 250, length: 140, arms: 4, speed: 0.02, width: 14 }
    ],
    bouncers: [],
    ramps: [
        { x: 310, y: 130, w: 60, h: 60, forceX: 0, forceY: -5 }
    ]
};
