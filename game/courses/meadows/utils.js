/**
 * Helper: generate angledWalls approximating a circle
 * @param {number} cx - center x
 * @param {number} cy - center y
 * @param {number} r - radius
 * @param {number} n - number of segments
 * @returns {Array} - array of wall objects
 */
export function makeCircleWalls(cx, cy, r, n) {
    const walls = [];
    for (let i = 0; i < n; i++) {
        const a1 = (i / n) * Math.PI * 2;
        const a2 = ((i + 1) / n) * Math.PI * 2;
        walls.push({
            x1: Math.round(cx + r * Math.cos(a1)),
            y1: Math.round(cy + r * Math.sin(a1)),
            x2: Math.round(cx + r * Math.cos(a2)),
            y2: Math.round(cy + r * Math.sin(a2))
        });
    }
    return walls;
}
