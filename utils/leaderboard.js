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
        <div class="mg-final-screen">
            <div class="mg-final-panel">
                <p class="mg-final-kicker">Round Complete</p>
                <h1 class="mg-final-title">Final Score</h1>
                <div class="mg-final-score">
                    <span class="mg-final-score-label">Strokes</span>
                    <span class="mg-final-score-value">${score}</span>
                </div>

                <div id="name-input-section" class="mg-final-form">
                    <label for="player-name">Save your round</label>
                    <input type="text" id="player-name" maxlength="10" autofocus class="mg-final-input">
                    <button id="submit-score-btn" class="mg-next-btn" type="button">Submit Score</button>
                </div>

                <div id="leaderboard-section" class="mg-final-leaderboard hidden"></div>

                <div id="action-buttons" class="mg-final-actions hidden">
                    <button id="main-menu-btn" class="mg-next-btn" type="button">Back to Main Menu</button>
                </div>
            </div>
        </div>
    `;

    const inputSection = container.querySelector('#name-input-section');
    const input = container.querySelector('#player-name');
    const submitBtn = container.querySelector('#submit-score-btn');
    const leaderboardSection = container.querySelector('#leaderboard-section');
    const actionButtons = container.querySelector('#action-buttons');
    const mainMenuBtn = container.querySelector('#main-menu-btn');
    let scoreSubmitted = false;

    // Focus input
    setTimeout(() => {
        if (input) input.focus();
    }, 100);

    const handleSubmit = () => {
        if (scoreSubmitted) return;
        scoreSubmitted = true;

        const name = input.value.trim() || 'Anonymous';
        saveScore(gameName, name, score);

        if (submitBtn) submitBtn.disabled = true;
        if (input) input.disabled = true;

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

    if (mainMenuBtn) {
        mainMenuBtn.onclick = () => {
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
        <h2 class="mg-final-board-title">Top Scores</h2>
        <table class="mg-final-board-table">
            <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
            </tr>
    `;

    if (scores.length === 0) {
        html += `<tr><td colspan="3" class="mg-final-empty">No scores yet!</td></tr>`;
    } else {
        scores.forEach((entry, index) => {
            const rowClass = index === 0 ? 'mg-final-top-row' : '';
            const rank = index + 1;

            html += `
                <tr class="${rowClass}">
                    <td>#${rank}</td>
                    <td>${entry.name}</td>
                    <td>${entry.score}</td>
                </tr>
            `;
        });
    }

    html += `</table>`;
    container.innerHTML = html;
}
