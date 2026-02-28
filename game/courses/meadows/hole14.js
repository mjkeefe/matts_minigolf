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
                b.push({
                    x: offset + col * 80,
                    y: 180 + row * 60,
                    r: 10,
                    color: (row + col) % 2 === 0 ? '#FFEB3B' : '#FF9800'
                });
            }
        }
        return b;
    })(),
    ramps: []
};
