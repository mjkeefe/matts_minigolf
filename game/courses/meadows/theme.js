import {
    resolveTheme,
    drawBackdrop,
    drawSurfaceBase,
    drawSurfaceEdge,
    drawDecorLayer,
    drawWallSkin,
    drawAngledWallSkin
} from '../shared/theme.js';

const DEFAULT_THEME = {
    palette: {
        skyTop: '#7a87c8',
        skyBottom: '#d8bfd3',
        grassBase: '#7d9268',
        grassShade: '#64774a',
        rough: '#5d5a31',
        path: '#baa56b',
        wallMain: '#8e6a43',
        wallTrim: '#d7be8a',
        wallShadow: '#5a3f25',
        cup: '#3b2f20',
        flag: '#bf5b4a',
        tee: '#b59263',
        flowerA: '#f2d6e8',
        flowerB: '#d59ab6',
        stone: '#9a8f84',
        shrub: '#556339'
    },
    backdrop: {
        horizonY: 178,
        hillBands: [
            { y: 154, color: '#8e9a76', amplitude: 12 },
            { y: 182, color: '#73855f', amplitude: 18 },
            { y: 214, color: '#617148', amplitude: 14 }
        ]
    },
    surface: {
        edgeWidth: 10,
        roughInset: 12,
        stripeAlpha: 0.08,
        cornerRadius: 18
    },
    wallStyle: {
        material: 'wood',
        postSpacing: 44,
        trimColor: '#d7be8a'
    },
    decor: []
};

export function resolveMeadowTheme(theme = {}) {
    return resolveTheme(DEFAULT_THEME, theme);
}

export {
    drawBackdrop,
    drawSurfaceBase,
    drawSurfaceEdge,
    drawDecorLayer,
    drawWallSkin,
    drawAngledWallSkin
};
