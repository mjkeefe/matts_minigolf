# Mini Golf

A fun, browser-based standalone mini golf game with randomly generated courses, physics, and leaderboards.

## Features
- **3 Game Modes**: Play 3, 9, or 18 holes.
- **Procedurally Generated Courses**: Every game is different with random hole placements, obstacles, and bouncers.
- **Physics Engine**: Realistic bouncing, friction, and pinball-style bouncers.
- **Local Leaderboards**: Compete for the lowest score in each standard game mode.
- **Customization**: Choose your ball color before teeing off.

## How to Play
1. Open `index.html` in your web browser.
2. Click **PLAY NOW**.
3. Choose a ball color and select a game length (3, 9, or 18 holes).
4. Click and drag away from the ball to aim and set your power (like a slingshot).
5. Release to putt. Try to get the ball in the hole in as few strokes as possible!
6. Each hole has a maximum limit of 10 strokes.

## Technologies Used
- HTML5 Canvas
- Vanilla JavaScript (ES6 Modules)
- CSS3
- Web Audio API

## Architecture
Extracted from a larger multi-game platform into a self-contained web app. All rendering is performed manually on an HTML5 `<canvas>` element using requestAnimationFrame for the game loop. No external libraries or engines are used.
