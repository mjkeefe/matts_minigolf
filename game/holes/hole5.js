export default {  // "The Gauntlet" — long narrow hallway with inner channel
    floors: [{ x: 30, y: 160, w: 620, h: 200 }],
    tee: { x: 80, y: 260 },
    hole: { x: 600, y: 260 },
    outerWalls: [
        { x: 14, y: 144, w: 652, h: 16 },
        { x: 14, y: 360, w: 652, h: 16 },
        { x: 14, y: 144, w: 16, h: 232 },
        { x: 650, y: 144, w: 16, h: 232 }
    ],
    obstacleWalls: [
        { x: 130, y: 160, w: 16, h: 70 },
        { x: 130, y: 290, w: 16, h: 70 },
        { x: 520, y: 160, w: 16, h: 70 },
        { x: 520, y: 290, w: 16, h: 70 }
    ],
    angledWalls: [],
    movingWalls: [
        { x: 220, y: 200, w: 60, h: 14, axis: 'y', min: 170, max: 340, speed: 1.2, dir: 1 },
        { x: 350, y: 300, w: 60, h: 14, axis: 'y', min: 170, max: 340, speed: 1.4, dir: -1 },
        { x: 480, y: 220, w: 60, h: 14, axis: 'y', min: 170, max: 340, speed: 1.0, dir: 1 }
    ],
    bouncers: [],
    ramps: []
};
