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
    return {
        palette: { ...DEFAULT_THEME.palette, ...(theme.palette || {}) },
        backdrop: {
            ...DEFAULT_THEME.backdrop,
            ...(theme.backdrop || {}),
            hillBands: theme.backdrop?.hillBands || DEFAULT_THEME.backdrop.hillBands
        },
        surface: { ...DEFAULT_THEME.surface, ...(theme.surface || {}) },
        wallStyle: { ...DEFAULT_THEME.wallStyle, ...(theme.wallStyle || {}) },
        decor: theme.decor || DEFAULT_THEME.decor
    };
}

export function drawBackdrop(ctx, courseTheme, canvasW, canvasH) {
    const { palette, backdrop } = courseTheme;

    const sky = ctx.createLinearGradient(0, 0, 0, backdrop.horizonY);
    sky.addColorStop(0, palette.skyTop);
    sky.addColorStop(1, palette.skyBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvasW, backdrop.horizonY);

    const sunX = canvasW * 0.5;
    const sunY = Math.max(42, backdrop.horizonY - 42);
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 90);
    sunGlow.addColorStop(0, 'rgba(255, 240, 180, 0.95)');
    sunGlow.addColorStop(0.35, 'rgba(255, 215, 120, 0.65)');
    sunGlow.addColorStop(1, 'rgba(255, 215, 120, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 225, 180, 0.25)';
    ctx.fillRect(0, backdrop.horizonY - 8, canvasW, 14);

    ctx.fillStyle = palette.path;
    ctx.fillRect(0, backdrop.horizonY, canvasW, canvasH - backdrop.horizonY);

    for (const band of backdrop.hillBands) {
        ctx.fillStyle = band.color;
        ctx.beginPath();
        ctx.moveTo(0, canvasH);
        ctx.lineTo(0, band.y);
        for (let x = 0; x <= canvasW; x += 24) {
            const wave = Math.sin((x / canvasW) * Math.PI * 2.2) * band.amplitude;
            const drift = Math.cos((x / canvasW) * Math.PI * 4.4) * band.amplitude * 0.25;
            ctx.lineTo(x, band.y + wave + drift);
        }
        ctx.lineTo(canvasW, canvasH);
        ctx.closePath();
        ctx.fill();
    }

    const treeLineY = backdrop.hillBands[0]?.y || (backdrop.horizonY - 18);
    ctx.fillStyle = 'rgba(58, 76, 38, 0.7)';
    for (let x = 18; x < canvasW; x += 18) {
        const height = 8 + (x % 5);
        ctx.beginPath();
        ctx.moveTo(x, treeLineY + 10);
        ctx.lineTo(x + 6, treeLineY - height);
        ctx.lineTo(x + 12, treeLineY + 10);
        ctx.closePath();
        ctx.fill();
    }
}

function roundedRectPath(ctx, x, y, w, h, r) {
    const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
}

function addSurfaceShapes(ctx, course, cornerRadius) {
    if (course.floors) {
        for (const f of course.floors) {
            roundedRectPath(ctx, f.x, f.y, f.w, f.h, cornerRadius);
        }
    }

    if (course.floorPolygons) {
        for (const fp of course.floorPolygons) {
            if (!fp.points || fp.points.length === 0) continue;
            ctx.moveTo(fp.points[0].x, fp.points[0].y);
            for (let i = 1; i < fp.points.length; i++) {
                ctx.lineTo(fp.points[i].x, fp.points[i].y);
            }
            ctx.closePath();
        }
    }

    if (course.floorCircles) {
        for (const fc of course.floorCircles) {
            if (fc.dark) continue;
            ctx.moveTo(fc.x + fc.r, fc.y);
            ctx.arc(fc.x, fc.y, fc.r, 0, Math.PI * 2);
            ctx.closePath();
        }
    }
}

function clipSurface(ctx, course, courseTheme) {
    ctx.save();
    ctx.beginPath();
    addSurfaceShapes(ctx, course, courseTheme.surface.cornerRadius);
    ctx.clip();
}

export function drawSurfaceBase(ctx, surfaceSpec) {
    const { course, courseTheme, canvasW, canvasH } = surfaceSpec;
    const { palette, surface } = courseTheme;

    const anyDefinedSurface = (course.floors && course.floors.length > 0) ||
        (course.floorPolygons && course.floorPolygons.length > 0) ||
        (course.floorCircles && course.floorCircles.some(fc => !fc.dark));

    if (anyDefinedSurface) {
        ctx.fillStyle = palette.grassBase;
        ctx.beginPath();
        addSurfaceShapes(ctx, course, surface.cornerRadius);
        ctx.fill();

        clipSurface(ctx, course, courseTheme);
        const stripeW = 34;
        for (let x = -canvasH; x < canvasW + canvasH; x += stripeW) {
            ctx.fillStyle = `rgba(255,255,255,${surface.stripeAlpha})`;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + 18, 0);
            ctx.lineTo(x + canvasH + 18, canvasH);
            ctx.lineTo(x + canvasH, canvasH);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = 'rgba(0,0,0,0.03)';
            ctx.beginPath();
            ctx.moveTo(x + 18, 0);
            ctx.lineTo(x + stripeW, 0);
            ctx.lineTo(x + canvasH + stripeW, canvasH);
            ctx.lineTo(x + canvasH + 18, canvasH);
            ctx.closePath();
            ctx.fill();
        }

        for (let x = 0; x < canvasW; x += 42) {
            for (let y = 0; y < canvasH; y += 42) {
                const radius = 1 + ((x + y) % 3);
                ctx.fillStyle = 'rgba(255,255,255,0.02)';
                ctx.beginPath();
                ctx.arc(x + 8, y + 10, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    } else {
        ctx.fillStyle = palette.grassBase;
        ctx.fillRect(0, 0, canvasW, canvasH);
    }

    if (course.floorCircles) {
        ctx.fillStyle = palette.rough;
        for (const fc of course.floorCircles) {
            if (!fc.dark) continue;
            ctx.beginPath();
            ctx.arc(fc.x, fc.y, fc.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

export function drawSurfaceEdge(ctx, surfaceSpec) {
    const { course, courseTheme } = surfaceSpec;
    const { palette, surface } = courseTheme;

    ctx.lineWidth = surface.edgeWidth;
    ctx.strokeStyle = 'rgba(74, 93, 45, 0.55)';
    ctx.beginPath();
    addSurfaceShapes(ctx, course, surface.cornerRadius);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(233, 243, 198, 0.22)';
    ctx.beginPath();
    addSurfaceShapes(ctx, course, Math.max(4, surface.cornerRadius - 6));
    ctx.stroke();

    if (course.floorCircles) {
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'rgba(61, 50, 27, 0.45)';
        for (const fc of course.floorCircles) {
            if (!fc.dark) continue;
            ctx.beginPath();
            ctx.arc(fc.x, fc.y, fc.r, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    ctx.fillStyle = palette.rough;
}

function drawFlowers(ctx, item, palette) {
    const density = item.density || 5;
    for (let i = 0; i < density; i++) {
        const offsetX = (i - density / 2) * 7;
        const offsetY = (i % 2 === 0 ? 0 : 4);
        ctx.strokeStyle = '#62723d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(item.x + offsetX, item.y + 6);
        ctx.lineTo(item.x + offsetX, item.y - 6 - offsetY);
        ctx.stroke();

        const petal = i % 2 === 0 ? (item.color || palette.flowerA) : palette.flowerB;
        ctx.fillStyle = petal;
        ctx.beginPath();
        ctx.arc(item.x + offsetX, item.y - 8 - offsetY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e9d78c';
        ctx.beginPath();
        ctx.arc(item.x + offsetX, item.y - 8 - offsetY, 1.2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawBush(ctx, item, palette) {
    const r = item.r || 18;
    ctx.fillStyle = 'rgba(32, 44, 20, 0.22)';
    ctx.beginPath();
    ctx.ellipse(item.x, item.y + r * 0.75, r * 0.95, r * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = item.color || palette.shrub;
    ctx.beginPath();
    ctx.arc(item.x, item.y, r, 0, Math.PI * 2);
    ctx.arc(item.x - r * 0.7, item.y + 4, r * 0.65, 0, Math.PI * 2);
    ctx.arc(item.x + r * 0.7, item.y + 5, r * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.arc(item.x - r * 0.25, item.y - r * 0.3, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
}

function drawStone(ctx, item, palette) {
    const w = item.w || 18;
    const h = item.h || 12;
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.rotation || 0);
    ctx.fillStyle = 'rgba(32, 28, 20, 0.18)';
    ctx.beginPath();
    ctx.ellipse(1, h * 0.35, w * 0.45, h * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = item.color || palette.stone;
    ctx.beginPath();
    roundedRectPath(ctx, -w / 2, -h / 2, w, h, Math.min(6, h / 2));
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    roundedRectPath(ctx, -w / 2 + 2, -h / 2 + 2, w * 0.45, h * 0.35, 3);
    ctx.fill();
    ctx.restore();
}

function drawMound(ctx, item) {
    const w = item.w || 40;
    const h = item.h || 18;
    ctx.fillStyle = 'rgba(80, 98, 48, 0.22)';
    ctx.beginPath();
    ctx.ellipse(item.x, item.y, w / 2, h / 2, item.rotation || 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawSign(ctx, item, palette) {
    const w = item.w || 34;
    const h = item.h || 18;
    ctx.fillStyle = 'rgba(32, 24, 16, 0.18)';
    ctx.beginPath();
    ctx.ellipse(item.x + 2, item.y + h + 9, w * 0.45, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6f4f31';
    ctx.fillRect(item.x - 2, item.y, 4, h + 10);
    ctx.fillStyle = item.color || palette.wallMain;
    ctx.beginPath();
    roundedRectPath(ctx, item.x - w / 2, item.y - h / 2, w, h, 4);
    ctx.fill();
    ctx.fillStyle = palette.wallTrim;
    ctx.fillRect(item.x - w / 2 + 4, item.y - 2, w - 8, 2);
}

function applyWallMaterialFill(ctx, x, y, w, h, wallStyle, palette) {
    if (wallStyle.material === 'stone') {
        const stoneGrad = ctx.createLinearGradient(x, y, x, y + h);
        stoneGrad.addColorStop(0, '#afa48f');
        stoneGrad.addColorStop(1, '#7d725f');
        ctx.fillStyle = stoneGrad;
    } else {
        const woodGrad = ctx.createLinearGradient(x, y, x, y + h);
        woodGrad.addColorStop(0, palette.wallTrim);
        woodGrad.addColorStop(1, palette.wallMain);
        ctx.fillStyle = woodGrad;
    }
    ctx.fillRect(x, y, w, h);
}

function drawTree(ctx, item, palette) {
    const h = item.h || 72;
    const canopy = item.r || 26;
    ctx.fillStyle = 'rgba(32, 40, 18, 0.2)';
    ctx.beginPath();
    ctx.ellipse(item.x, item.y + 6, canopy * 0.95, canopy * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#6a472c';
    ctx.fillRect(item.x - 4, item.y - h * 0.35, 8, h * 0.35);

    ctx.fillStyle = item.color || palette.shrub;
    ctx.beginPath();
    ctx.arc(item.x, item.y - h * 0.5, canopy, 0, Math.PI * 2);
    ctx.arc(item.x - canopy * 0.65, item.y - h * 0.42, canopy * 0.7, 0, Math.PI * 2);
    ctx.arc(item.x + canopy * 0.7, item.y - h * 0.38, canopy * 0.62, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.arc(item.x - canopy * 0.25, item.y - h * 0.62, canopy * 0.4, 0, Math.PI * 2);
    ctx.fill();
}

function drawPond(ctx, item) {
    const w = item.w || 120;
    const h = item.h || 72;
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.rotation || 0);

    ctx.fillStyle = 'rgba(68, 56, 32, 0.3)';
    ctx.beginPath();
    ctx.ellipse(4, 6, w * 0.5, h * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    const water = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    water.addColorStop(0, '#8fc8d8');
    water.addColorStop(0.55, '#4e95a8');
    water.addColorStop(1, '#2d6b84');
    ctx.fillStyle = '#bba76b';
    ctx.beginPath();
    ctx.ellipse(0, 0, w * 0.56, h * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = water;
    ctx.beginPath();
    ctx.ellipse(0, 0, w * 0.48, h * 0.39, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-w * 0.1, -h * 0.08, Math.max(8, h * 0.15), 0.3, 2.7);
    ctx.stroke();
    ctx.restore();
}

export function drawWallSkin(ctx, wall, wallStyle, palette) {
    ctx.fillStyle = 'rgba(58, 38, 20, 0.28)';
    ctx.fillRect(wall.x + 3, wall.y + 4, wall.w, wall.h);

    applyWallMaterialFill(ctx, wall.x, wall.y, wall.w, wall.h, wallStyle, palette);

    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    if (wall.w >= wall.h) {
        ctx.fillRect(wall.x, wall.y, wall.w, 3);
    } else {
        ctx.fillRect(wall.x, wall.y, 3, wall.h);
    }

    ctx.fillStyle = 'rgba(56, 38, 23, 0.28)';
    if (wall.w >= wall.h) {
        ctx.fillRect(wall.x, wall.y + wall.h - 3, wall.w, 3);
        const spacing = Math.max(18, wallStyle.postSpacing || 44);
        for (let x = wall.x + spacing / 2; x < wall.x + wall.w; x += spacing) {
            ctx.fillStyle = palette.wallShadow;
            ctx.fillRect(x - 1, wall.y + 2, 2, wall.h - 4);
        }
    } else {
        ctx.fillRect(wall.x + wall.w - 3, wall.y, 3, wall.h);
        const spacing = Math.max(18, wallStyle.postSpacing || 44);
        for (let y = wall.y + spacing / 2; y < wall.y + wall.h; y += spacing) {
            ctx.fillStyle = palette.wallShadow;
            ctx.fillRect(wall.x + 2, y - 1, wall.w - 4, 2);
        }
    }
}

export function drawAngledWallSkin(ctx, wall, wallStyle, palette, thickness = 16) {
    const width = wall.thickness || thickness;
    ctx.lineCap = 'round';

    ctx.strokeStyle = 'rgba(58, 38, 20, 0.28)';
    ctx.lineWidth = width + 4;
    ctx.beginPath();
    ctx.moveTo(wall.x1 + 3, wall.y1 + 4);
    ctx.lineTo(wall.x2 + 3, wall.y2 + 4);
    ctx.stroke();

    const grad = ctx.createLinearGradient(wall.x1, wall.y1, wall.x2, wall.y2);
    if (wallStyle.material === 'stone') {
        grad.addColorStop(0, '#b0a490');
        grad.addColorStop(1, '#7d7360');
    } else {
        grad.addColorStop(0, palette.wallTrim);
        grad.addColorStop(1, palette.wallMain);
    }
    ctx.strokeStyle = grad;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(wall.x1, wall.y1);
    ctx.lineTo(wall.x2, wall.y2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wall.x1 - 1, wall.y1 - 1);
    ctx.lineTo(wall.x2 - 1, wall.y2 - 1);
    ctx.stroke();
}

export function drawDecorLayer(ctx, decorItems, courseTheme) {
    const { palette } = courseTheme;

    for (const item of decorItems) {
        ctx.save();
        if (item.kind === 'flowers') {
            drawFlowers(ctx, item, palette);
        } else if (item.kind === 'bush' || item.kind === 'reed') {
            drawBush(ctx, item, palette);
        } else if (item.kind === 'stone') {
            drawStone(ctx, item, palette);
        } else if (item.kind === 'mound') {
            drawMound(ctx, item);
        } else if (item.kind === 'sign') {
            drawSign(ctx, item, palette);
        } else if (item.kind === 'tree') {
            drawTree(ctx, item, palette);
        } else if (item.kind === 'pond') {
            drawPond(ctx, item);
        }
        ctx.restore();
    }
}
