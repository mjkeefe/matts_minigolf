// Audio utility - Web Audio API

let audioCtx = null;

// Initialize Audio Context on user gesture to comply with browser policies
function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

// Add global listener to init audio on first click
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('keydown', initAudio, { once: true });

export function playSound(soundId) {
    const ctx = initAudio();
    if (!ctx) return;

    const t = ctx.currentTime;

    switch (soundId) {
        case 'collect':
            // Happy ascending two-note
            playTone(ctx, 440, 'sine', t, 0.1);       // A4
            playTone(ctx, 880, 'sine', t + 0.1, 0.2); // A5
            break;

        case 'hit':
            // Negative buzzer
            playTone(ctx, 150, 'sawtooth', t, 0.2, true); // Descending pitch
            break;

        case 'shoot':
            // Zap
            playTone(ctx, 800, 'square', t, 0.1, true, 200); // Fast drop
            break;

        case 'explode':
            // Noise burst
            playNoise(ctx, t, 0.3);
            break;

        case 'levelUp':
            // Major triad arpeggio
            playTone(ctx, 523.25, 'triangle', t, 0.1);       // C5
            playTone(ctx, 659.25, 'triangle', t + 0.1, 0.1); // E5
            playTone(ctx, 783.99, 'triangle', t + 0.2, 0.4); // G5
            break;

        case 'gameOver':
            // Sad descending triad
            playTone(ctx, 392.00, 'sine', t, 0.4);       // G4
            playTone(ctx, 311.13, 'sine', t + 0.4, 0.4); // Eb4
            playTone(ctx, 261.63, 'sine', t + 0.8, 1.0); // C4
            break;

        // --- NEW SPORTS SOUNDS ---
        case 'bounce':
            // Short percussive bounce
            playTone(ctx, 200, 'square', t, 0.05, true, 50);
            break;

        case 'boing':
            // Cartoon boing
            playTone(ctx, 150, 'sine', t, 0.3, true, 400); // Slide up to 400
            break;

        case 'goal':
            // Celebratory two-note chime (C5 -> G5)
            playTone(ctx, 523.25, 'sine', t, 0.15);      // C5
            playTone(ctx, 783.99, 'sine', t + 0.15, 0.4); // G5
            break;

        case 'swoosh':
            // Airy whoosh (noise through bandpass/lowpass ideally, but simple envelope works)
            // Using playNoise with a softer attack/decay if possible, but playNoise is fixed envelope.
            // Let's create a custom swoosh here using the raw context for better control
            {
                const noiseDuration = 0.3;
                const bufferSize = ctx.sampleRate * noiseDuration;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

                const noise = ctx.createBufferSource();
                noise.buffer = buffer;
                const gain = ctx.createGain();

                // Swell in and out
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
                gain.gain.linearRampToValueAtTime(0, t + 0.3);

                // Simple Lowpass filter for "air" sound
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, t);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                noise.start(t);
            }
            break;

        case 'roll':
            // Low rumble
            playTone(ctx, 60, 'sawtooth', t, 0.1); // Short low rumble
            break;

        case 'sink':
            // Low plunk (pitch drop)
            playTone(ctx, 300, 'sine', t, 0.15, true, 50);
            break;

        default:
            console.warn(`Unknown sound ID: ${soundId}`);
    }
}

// Helper: Play a simple tone
function playTone(ctx, freq, type, startTime, duration, slide = false, slideEndFreq = 50) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (slide) {
        osc.frequency.exponentialRampToValueAtTime(slideEndFreq, startTime + duration);
    }

    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
}

// Helper: Play white noise (Explosion)
function playNoise(ctx, startTime, duration) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    noise.connect(gain);
    gain.connect(ctx.destination);

    noise.start(startTime);
}
