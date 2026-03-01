export default {
    floors: [
        { x: 72, y: 336, w: 382, h: 118 },
        { x: 412, y: 78, w: 118, h: 308 }
    ],
    tee: { x: 132, y: 394 },
    hole: { x: 470, y: 124 },
    outerWalls: [
        { x: 72, y: 320, w: 324, h: 16 }, // Top horizontal
        { x: 56, y: 320, w: 16, h: 150 }, // Left cap
        { x: 72, y: 454, w: 382, h: 16 }, // Bottom horizontal
        { x: 530, y: 62, w: 16, h: 274 }, // Right vertical
        { x: 396, y: 62, w: 150, h: 16 }, // Top vertical cap
        { x: 396, y: 78, w: 16, h: 242 }  // Left vertical inner
    ],
    obstacleWalls: [],
    angledWalls: [
        { x1: 454, y1: 454, x2: 530, y2: 378 }
    ],
    bouncers: [],
    ramps: [],
    theme: {
        palette: {
            skyTop: '#5d70ba',
            skyBottom: '#f1a985',
            grassBase: '#7f9960',
            grassShade: '#5e7340',
            rough: '#66592f',
            path: '#b59a60',
            wallMain: '#8a613a',
            wallTrim: '#e0c488',
            flag: '#c96355',
            shrub: '#4f6935'
        },
        backdrop: {
            horizonY: 190,
            hillBands: [
                { y: 156, color: '#8ea472', amplitude: 10 },
                { y: 188, color: '#728958', amplitude: 16 },
                { y: 228, color: '#627548', amplitude: 11 }
            ]
        },
        surface: {
            edgeWidth: 12,
            roughInset: 14,
            stripeAlpha: 0.07,
            cornerRadius: 22
        },
        wallStyle: {
            material: 'wood',
            postSpacing: 34,
            trimColor: '#e0c488'
        },
        decor: [
            { kind: 'tree', x: 118, y: 222, h: 82, r: 28, color: '#4a6a31' },
            { kind: 'tree', x: 586, y: 236, h: 88, r: 30, color: '#7f5d26' },
            { kind: 'pond', x: 562, y: 416, w: 132, h: 82, rotation: -0.12 },
            { kind: 'sign', x: 104, y: 410, w: 36, h: 18 },
            { kind: 'flowers', x: 82, y: 362, density: 5 },
            { kind: 'flowers', x: 210, y: 486, density: 6 },
            { kind: 'flowers', x: 580, y: 118, density: 5 },
            { kind: 'flowers', x: 610, y: 438, density: 4 },
            { kind: 'bush', x: 540, y: 370, r: 18 },
            { kind: 'bush', x: 604, y: 340, r: 15 },
            { kind: 'bush', x: 90, y: 286, r: 14 },
            { kind: 'stone', x: 500, y: 448, w: 16, h: 10, rotation: -0.15 },
            { kind: 'stone', x: 598, y: 470, w: 18, h: 12, rotation: 0.2 }
        ]
    }
};
