export default { // "The Grand Finale" — The Ultimate Test
    floors: [{ x: 50, y: 50, w: 580, h: 420 }],
    tee: { x: 340, y: 430 },
    hole: { x: 340, y: 80 },
    outerWalls: [
        { x: 34, y: 34, w: 612, h: 16 },
        { x: 34, y: 470, w: 612, h: 16 },
        { x: 34, y: 34, w: 16, h: 452 },
        { x: 630, y: 34, w: 16, h: 452 }
    ],
    obstacleWalls: [
        { x: 150, y: 240, w: 80, h: 16 }, // Side bumper
        { x: 450, y: 240, w: 80, h: 16 }, // Side bumper
        { x: 315, y: 280, w: 50, h: 16 }  // Mid bumper
    ],
    rotatingObstacles: [
        { cx: 340, cy: 370, length: 140, arms: 4, speed: 0.02, width: 12 }, // Lower Windmill
        { cx: 340, cy: 170, length: 160, arms: 2, speed: -0.04, width: 12 } // Fast Upper Swiper
    ],
    angledWalls: [],
    bouncers: [
        { x: 100, y: 100, r: 30, color: '#F44336' },
        { x: 580, y: 100, r: 30, color: '#F44336' }
    ],
    ramps: [
        { x: 100, y: 300, w: 40, h: 40, forceX: 0, forceY: -5 },
        { x: 540, y: 300, w: 40, h: 40, forceX: 0, forceY: -5 }
    ]
};
