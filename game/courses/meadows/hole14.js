export default { // "The Plinko" — Gravity/peg challenge
    floors: [{ x: 50, y: 50, w: 580, h: 420 }],
    tee: { x: 340, y: 100 },
    hole: { x: 340, y: 430 },
    outerWalls: [
        { x: 34, y: 34, w: 612, h: 16 },
        { x: 34, y: 470, w: 612, h: 16 },
        { x: 34, y: 34, w: 16, h: 452 },
        { x: 630, y: 34, w: 16, h: 452 }
    ],
    obstacleWalls: [],
    angledWalls: [],
    bouncers: (() => {
        const b = [];
        for (let row = 0; row < 5; row++) {
            const cols = row % 2 === 0 ? 8 : 7;
            const offset = row % 2 === 0 ? 80 : 120;
            for (let col = 0; col < cols; col++) {
                const x = offset + col * 80;
                if (x >= 630) continue;
                b.push({
                    x,
                    y: 180 + row * 60,
                    r: 10,
                    color: (row + col) % 2 === 0 ? '#FFEB3B' : '#FF9800'
                });
            }
        }
        return b;
    })(),
    ramps: [],
    theme: {
        palette: {
            skyTop: '#6175b8',
            skyBottom: '#efa97f',
            grassBase: '#809860',
            rough: '#675932',
            path: '#b69c66',
            wallMain: '#8c6e54',
            wallTrim: '#d8cab3'
        },
        wallStyle: {
            material: 'stone',
            postSpacing: 38
        },
        decor: [
            { kind: 'tree', x: 82, y: 250, h: 68, r: 20, color: '#4a6832' },
            { kind: 'tree', x: 598, y: 430, h: 72, r: 22, color: '#7b592d' },
            { kind: 'flowers', x: 46, y: 460, density: 4 },
            { kind: 'flowers', x: 598, y: 456, density: 4 },
            { kind: 'stone', x: 82, y: 320, w: 16, h: 10, rotation: 0.2 },
            { kind: 'stone', x: 598, y: 250, w: 16, h: 10, rotation: -0.15 }
        ]
    }
};
