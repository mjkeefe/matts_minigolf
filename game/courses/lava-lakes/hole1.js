export default {
    floors: [
        { x: 110, y: 70, w: 460, h: 380 }
    ],
    tee: { x: 340, y: 404 },
    hole: { x: 340, y: 112 },
    outerWalls: [
        { x: 94, y: 54, w: 492, h: 16 },
        { x: 94, y: 450, w: 492, h: 16 },
        { x: 94, y: 54, w: 16, h: 412 },
        { x: 570, y: 54, w: 16, h: 412 }
    ],
    obstacleWalls: [
        { x: 312, y: 222, w: 56, h: 80 }
    ],
    angledWalls: [],
    bouncers: [],
    ramps: [
        { x: 280, y: 150, w: 120, h: 32, forceX: 0, forceY: -3.2 }
    ],
    theme: {
        wallStyle: { material: 'volcanic' },
        decor: [
            { kind: 'lavaPool', x: 150, y: 118, w: 72, h: 34, rotation: -0.12 },
            { kind: 'lavaPool', x: 530, y: 392, w: 88, h: 40, rotation: 0.15 },
            { kind: 'emberVent', x: 142, y: 170, intensity: 4 },
            { kind: 'emberVent', x: 540, y: 330, intensity: 5 },
            { kind: 'crackStone', x: 86, y: 250, w: 18, h: 12, rotation: 0.2 },
            { kind: 'crackStone', x: 602, y: 226, w: 20, h: 12, rotation: -0.18 }
        ]
    }
};
