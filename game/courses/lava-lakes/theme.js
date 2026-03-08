import { resolveTheme } from '../shared/theme.js';

const DEFAULT_THEME = {
    palette: {
        skyTop: '#2d2d33',
        skyBottom: '#5b3028',
        grassBase: '#3A3A3A',
        grassShade: '#2F2F2F',
        rough: '#242424',
        path: '#2A2A2A',
        wallMain: '#1C1C1C',
        wallTrim: '#4A4A4A',
        wallShadow: '#0D0D0D',
        cup: '#050505',
        flag: '#FF6B35',
        tee: '#B22222',
        flowerA: '#ff9a4d',
        flowerB: '#ff5a2f',
        stone: '#535353',
        shrub: '#4b260f'
    },
    backdrop: {
        horizonY: 178,
        hillBands: [
            { y: 154, color: '#2c2c30', amplitude: 14 },
            { y: 182, color: '#3a2824', amplitude: 20 },
            { y: 214, color: '#251819', amplitude: 16 }
        ]
    },
    surface: {
        edgeWidth: 10,
        roughInset: 12,
        stripeAlpha: 0.01,
        cornerRadius: 18
    },
    wallStyle: {
        material: 'volcanic',
        postSpacing: 44,
        trimColor: '#4A4A4A'
    },
    decor: []
};

export function resolveLavaTheme(theme = {}) {
    return resolveTheme(DEFAULT_THEME, theme);
}
