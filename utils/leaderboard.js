// Leaderboard utility

const MAX_ENTRIES = 10;

/**
 * Saves a new score to the leaderboard.
 * Maintains only top 10 scores, sorted descending.
 */
export function saveScore(gameName, playerName, score) {
    const key = `${gameName}_leaderboard`;
    let leaderboard = getLeaderboard(gameName);

    // Add new entry
    leaderboard.push({
        name: playerName,
        score: score,
        date: new Date().toISOString()
    });

    // Sort
    if (gameName.includes('mini-golf')) {
        leaderboard.sort((a, b) => a.score - b.score); // Golf: lower is better
    } else {
        leaderboard.sort((a, b) => b.score - a.score); // Default: higher is better
    }

    // Trim to top 10
    if (leaderboard.length > MAX_ENTRIES) {
        leaderboard = leaderboard.slice(0, MAX_ENTRIES);
    }

    // Save
    localStorage.setItem(key, JSON.stringify(leaderboard));

    return leaderboard;
}

/**
 * Retrieves the leaderboard for a specific game.
 */
export function getLeaderboard(gameName) {
    const key = `${gameName}_leaderboard`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Renders the Game Over screen: Score -> Input -> Leaderboard
 */
// Leaderboard utility - showGameOver
export function showGameOver(gameName, score, container, onPlayAgain) {
    if (!container) return;

    container.innerHTML = `
        <div class="game-over-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: white; background: rgba(0,0,0,0.9); z-index: 200; position: absolute; top: 0; left: 0; width: 100%;">
            <h1 style="color: #ff0055; font-size: 4em; margin-bottom: 20px; text-shadow: 0 0 10px #ff0055;">GAME OVER</h1>
            
            <div class="score-display" style="font-size: 2em; margin-bottom: 30px;">
                SCORE: <span style="color: #ffcc00;">${score}</span>
            </div>

            <div id="name-input-section" style="text-align: center;">
                <p style="font-size: 1.2em; margin-bottom: 10px;">Enter your name:</p>
                <input type="text" id="player-name" maxlength="10" autofocus 
                    style="font-size: 1.5em; padding: 10px; border-radius: 5px; border: none; text-align: center; width: 250px; color: black;">
                <br><br>
                <button id="submit-score-btn" 
                    style="font-size: 1.2em; padding: 10px 30px; background: #00ff66; border: none; border-radius: 50px; cursor: pointer; color: black; font-weight: bold; transition: transform 0.2s;">
                    SUBMIT SCORE
                </button>
            </div>

            <div id="leaderboard-section" class="hidden" style="width: 100%; max-width: 500px;"></div>
            
            <div id="action-buttons" class="hidden" style="margin-top: 30px;">
                <button id="play-again-btn" 
                    style="font-size: 1.5em; padding: 15px 40px; background: #00ccff; border: none; border-radius: 50px; cursor: pointer; color: black; font-weight: bold; margin: 0 10px; box-shadow: 0 0 15px #00ccff;">
                    PLAY AGAIN
                </button>
            </div>
        </div>
    `;

    const inputSection = container.querySelector('#name-input-section');
    const input = container.querySelector('#player-name');
    const submitBtn = container.querySelector('#submit-score-btn');
    const leaderboardSection = container.querySelector('#leaderboard-section');
    const actionButtons = container.querySelector('#action-buttons');
    const playAgainBtn = container.querySelector('#play-again-btn');

    // Focus input
    setTimeout(() => {
        if (input) input.focus();
    }, 100);

    const handleSubmit = () => {
        const name = input.value.trim() || 'Anonymous';
        saveScore(gameName, name, score);

        // UI Transition
        inputSection.classList.add('hidden');
        leaderboardSection.classList.remove('hidden');
        actionButtons.classList.remove('hidden');

        // Render Leaderboard
        renderLeaderboard(gameName, leaderboardSection);
    };

    if (submitBtn) submitBtn.onclick = handleSubmit;
    if (input) {
        input.onkeypress = (e) => {
            if (e.key === 'Enter') handleSubmit();
        };
    }

    if (playAgainBtn) {
        playAgainBtn.onclick = () => {
            if (typeof onPlayAgain === 'function') {
                onPlayAgain();
            }
        };
    }
}

/**
 * Renders the visual leaderboard table
 */
export function renderLeaderboard(gameName, container) {
    const scores = getLeaderboard(gameName);

    let html = `
        <h2 style="color: var(--accent-blue); margin-bottom: 20px;">TOP SCORES</h2>
        <table style="width: 100%; max-width: 500px; margin: 0 auto; border-collapse: collapse;">
            <tr style="border-bottom: 2px solid #555; color: #aaa;">
                <th style="padding: 5px; font-size: 0.9em; text-align: center;">RANK</th>
                <th style="padding: 5px; font-size: 0.9em; text-align: center;">NAME</th>
                <th style="padding: 5px; font-size: 0.9em; text-align: center;">SCORE</th>
            </tr>
    `;

    if (scores.length === 0) {
        html += `<tr><td colspan="3" style="padding: 15px; text-align: center;">No scores yet!</td></tr>`;
    } else {
        scores.forEach((entry, index) => {
            const isFirst = index === 0;
            const rowStyle = isFirst ? 'color: var(--accent-yellow); font-weight: bold; font-size: 1.1em;' : 'font-size: 0.9em;';
            const rank = index + 1;

            html += `
                <tr style="${rowStyle} border-bottom: 1px solid #333;">
                    <td style="padding: 4px 10px; text-align: center;">#${rank}</td>
                    <td style="padding: 4px 10px; text-align: center;">${entry.name}</td>
                    <td style="padding: 4px 10px; text-align: center;">${entry.score}</td>
                </tr>
            `;
        });
    }

    html += `</table>`;
    container.innerHTML = html;
}
