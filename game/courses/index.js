import { customHoles as meadowsHoles } from './meadows/index.js';
import { resolveMeadowTheme } from './meadows/theme.js';
import { customHoles as lavaLakesHoles } from './lava-lakes/index.js';
import { resolveLavaTheme } from './lava-lakes/theme.js';

export const courses = {
    meadows: {
        id: 'meadows',
        name: 'Minigolf Meadows',
        difficulty: 'Easy',
        parLabel: '18 Holes - Par 54',
        status: 'playable',
        previewImage: "url('game/meadows.png')",
        holes: meadowsHoles,
        resolveTheme: resolveMeadowTheme,
        leaderboardPrefix: 'mini-golf-meadows'
    },
    'lava-lakes': {
        id: 'lava-lakes',
        name: 'Lava Lakes',
        difficulty: 'Medium',
        parLabel: '18 Holes - Lava Adventure',
        status: 'playable',
        previewImage: "url('game/lava_lakes.png')",
        holes: lavaLakesHoles,
        resolveTheme: resolveLavaTheme,
        leaderboardPrefix: 'mini-golf-lava-lakes'
    }
};
