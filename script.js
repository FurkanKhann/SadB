/* ============================================
   FOR SADQUA — A Letter Written in Starlight
   Cinematic interactive experience
   ============================================ */

// ==========================================
// EMAILJS CONFIGURATION
// ==========================================
const EMAILJS_CONFIG = {
    publicKey:   'wEg3X15o09shGZpFo',
    serviceId:   'service_o7pm624',
    templateId:  'template_8wrq6o2',
};

const EMAIL_FROM = 'khanfurkan575@gmail.com';
const EMAIL_TO   = 'sadquanawab24@gmail.com';

// ==========================================
// STATE
// ==========================================
const CHAPTERS = ['ch-stars', 'ch-name', 'ch-letter', 'ch-rose', 'ch-date'];
let current = 0;
let audioCtx = null;
let isPlaying = false;
let musicTimeout = null;

// ==========================================
// BOOT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
    initCosmos();
    startEpigraph();
    wireButtons();
    setMinDate();
});

// ==========================================
// CHAPTER TRANSITIONS
// ==========================================
function goTo(index) {
    if (index < 0 || index >= CHAPTERS.length || index === current) return;
    document.getElementById(CHAPTERS[current]).classList.remove('visible');
    document.getElementById(CHAPTERS[index]).classList.add('visible');
    current = index;
    updateProgress();
    onEnterChapter(index);
}

function updateProgress() {
    const pct = ((current + 1) / CHAPTERS.length) * 100;
    document.getElementById('progressBar').style.width = pct + '%';
}

function onEnterChapter(i) {
    switch (i) {
        case 1: animateNameScene(); break;
        case 2: animateLetterScene(); break;
        case 3: animateRoseScene(); break;
        case 4: animateDateScene(); break;
    }
}

function wireButtons() {
    document.getElementById('enterBtn').addEventListener('click', () => goTo(1));
    document.getElementById('toLetterBtn').addEventListener('click', () => goTo(2));
    document.getElementById('toRoseBtn').addEventListener('click', () => goTo(3));

    // Audio
    document.getElementById('audioToggle').addEventListener('click', toggleAudio);

    // Rose scene — the ask
    document.getElementById('askYes').addEventListener('click', () => goTo(4));
    
    let thinkCount = 0;
    const thinkBtn = document.getElementById('askThink');
    const nudge = document.getElementById('askNudge');
    const nudges = [
        "No pressure at all, take your time.",
        "Whenever you feel like it.",
        "Just let me know what works for you.",
    ];
    thinkBtn.addEventListener('click', () => {
        thinkCount++;
        if (thinkCount <= nudges.length) {
            nudge.textContent = nudges[thinkCount - 1];
            nudge.classList.remove('hidden');
            nudge.classList.add('visible');
        } else {
            nudge.textContent = "Take all the time you need.";
        }
    });

    // Booking form
    document.getElementById('bookingForm').addEventListener('submit', handleBooking);
}

// ==========================================
// CHAPTER 1: COSMOS + EPIGRAPH
// ==========================================
function initCosmos() {
    const canvas = document.getElementById('cosmos');
    const ctx = canvas.getContext('2d');
    const stars = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.r = Math.random() * 1.8 + 0.3;
            this.phase = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 0.008 + 0.003;
        }
        update() {
            this.phase += this.speed;
        }
        draw() {
            const alpha = 0.15 + Math.sin(this.phase) * 0.35;
            ctx.globalAlpha = Math.max(0, alpha);
            ctx.fillStyle = '#e8dcc8';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
            if (this.r > 1.2) {
                ctx.globalAlpha = alpha * 0.15;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r * 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    for (let i = 0; i < 180; i++) stars.push(new Star());

    (function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => { s.update(); s.draw(); });
        ctx.globalAlpha = 1;
        requestAnimationFrame(loop);
    })();
}

function startEpigraph() {
    const el = document.getElementById('epigraph');
    const lines = [
        "Wishing you a year filled",
        "with joy, laughter, and",
        "unforgettable moments."
    ];

    let lineIdx = 0;
    let charIdx = 0;
    el.classList.add('revealed');
    el.innerHTML = '';

    function typeChar() {
        if (lineIdx >= lines.length) {
            // Done — show button
            setTimeout(() => {
                document.querySelector('.stars-cta').classList.add('show');
            }, 600);
            return;
        }
        if (charIdx === 0 && lineIdx > 0) {
            el.innerHTML += '<br>';
        }
        el.innerHTML = el.innerHTML + lines[lineIdx][charIdx];
        charIdx++;
        if (charIdx >= lines[lineIdx].length) {
            lineIdx++;
            charIdx = 0;
            setTimeout(typeChar, 500);
        } else {
            setTimeout(typeChar, 55);
        }
    }

    setTimeout(typeChar, 1200);
}

// ==========================================
// CHAPTER 2: NAME CONSTELLATION
// ==========================================
let nameAnimated = false;

function animateNameScene() {
    if (nameAnimated) return;
    nameAnimated = true;

    initConstellationCanvas();

    const above = document.getElementById('nameAbove');
    const name = document.getElementById('nameMain');
    const underline = document.querySelector('.name-underline');
    const date = document.querySelector('.name-date');
    const nextBtn = document.getElementById('toLetterBtn');

    // Typewrite "Happy Birthday"
    const text = "Happy Birthday";
    let i = 0;
    above.textContent = '';

    setTimeout(() => {
        above.classList.add('show');
        const interval = setInterval(() => {
            above.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                // Reveal name
                setTimeout(() => {
                    name.classList.add('show');
                    underline.classList.add('show');
                    date.classList.add('show');
                    setTimeout(() => nextBtn.classList.add('show'), 1500);
                }, 400);
            }
        }, 70);
    }, 600);
}

function initConstellationCanvas() {
    const canvas = document.getElementById('constellation-canvas');
    const ctx = canvas.getContext('2d');
    const particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Mote {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.r = Math.random() * 1.5 + 0.2;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.phase = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 0.01 + 0.004;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.phase += this.speed;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            const a = 0.1 + Math.sin(this.phase) * 0.2;
            ctx.globalAlpha = a;
            ctx.fillStyle = '#c9a96e';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Mote());

    (function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        ctx.globalAlpha = 1;
        requestAnimationFrame(loop);
    })();
}

// ==========================================
// CHAPTER 3: THE LETTER
// ==========================================
let letterAnimated = false;

function animateLetterScene() {
    if (letterAnimated) return;
    letterAnimated = true;

    const card = document.querySelector('.letter-card');
    const textContainer = document.getElementById('letterText');
    const closing = document.getElementById('letterClosing');
    const nextBtn = document.getElementById('toRoseBtn');

    const lines = [
        "Wishing you a very Happy Birthday today!",
        "It's always great having you as a friend.",
        "I hope this coming year brings you lots of happiness, success, and good health.",
        "Take time to celebrate and enjoy your special day to the fullest.",
        "Here's to many more great memories and fun times ahead.",
        "Happy Birthday, Sadqua!"
    ];

    // Show card
    setTimeout(() => card.classList.add('show'), 300);

    // Reveal lines one by one
    lines.forEach((line, i) => {
        const span = document.createElement('span');
        span.className = 'line';
        span.textContent = line;
        textContainer.appendChild(span);
    });

    const lineEls = textContainer.querySelectorAll('.line');
    lineEls.forEach((el, i) => {
        setTimeout(() => el.classList.add('show'), 1200 + i * 1400);
    });

    // Show closing and next
    const totalTime = 1200 + lines.length * 1400 + 800;
    setTimeout(() => {
        closing.textContent = "— Best wishes";
        closing.classList.add('show');
    }, totalTime);
    setTimeout(() => nextBtn.classList.add('show'), totalTime + 1000);
}

// ==========================================
// CHAPTER 4: THE ROSE + THE ASK
// ==========================================
let roseAnimated = false;

function animateRoseScene() {
    if (roseAnimated) return;
    roseAnimated = true;

    initPetalsCanvas();

    const rose = document.getElementById('roseContainer');
    const ask = document.getElementById('theAsk');

    // Bloom rose
    setTimeout(() => rose.classList.add('bloom'), 400);

    // Show the ask after bloom
    setTimeout(() => ask.classList.add('show'), 2800);
}

function initPetalsCanvas() {
    const canvas = document.getElementById('petals-canvas');
    const ctx = canvas.getContext('2d');
    const petals = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class FallingPetal {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; // scatter initially
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 0.6 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.rot = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 0.5;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.005;
            this.opacity = Math.random() * 0.15 + 0.05;
            this.color = Math.random() > 0.5 ? '#b76e79' : '#d4949d';
        }
        update() {
            this.y += this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.3;
            this.rot += this.rotSpeed;
            if (this.y > canvas.height + 20) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rot * Math.PI) / 180);
            ctx.fillStyle = this.color;
            // Petal shape
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < 20; i++) petals.push(new FallingPetal());

    (function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    })();
}

// ==========================================
// CHAPTER 5: DATE BOOKING
// ==========================================
function animateDateScene() {
    initGoldParticles();
    const card = document.getElementById('dateCard');
    setTimeout(() => card.classList.add('show'), 300);
}

function setMinDate() {
    const input = document.getElementById('dateInput');
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    input.min = `${yyyy}-${mm}-${dd}`;
}

async function handleBooking(e) {
    e.preventDefault();

    const btn = document.getElementById('confirmBtn');
    const btnText = btn.querySelector('.confirm-text');
    const loader = btn.querySelector('.confirm-loader');

    const dateVal = document.getElementById('dateInput').value;
    const timeVal = document.getElementById('timeInput').value;
    const place   = document.getElementById('placeInput').value.trim();
    const note    = document.getElementById('noteInput').value.trim();

    if (!dateVal || !timeVal) return;

    const dt = new Date(dateVal + 'T' + timeVal);
    const fmtDate = dt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const fmtTime = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Loading state
    btn.disabled = true;
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');

    // Send emails
    try { await sendEmails(fmtDate, fmtTime, place, note); }
    catch (err) { console.log('Email status:', err); }

    // Show confirmation after short delay
    setTimeout(() => showConfirmation(fmtDate, fmtTime, place), 1200);
}

async function sendEmails(date, time, place, note) {
    if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
        console.log('EmailJS not configured — date details:', { date, time, place, note });
        return;
    }

    const params = {
        date, time,
        place: place || 'To be decided together',
        note: note || '—',
        from_name: 'Date Confirmation',
    };

    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId,
        { ...params, to_email: EMAIL_FROM });
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId,
        { ...params, to_email: EMAIL_TO });
}

function showConfirmation(date, time, place) {
    document.getElementById('dateCard').classList.add('hidden');
    const card = document.getElementById('confirmedCard');
    card.classList.remove('hidden');

    document.getElementById('confirmedDetails').innerHTML = `
        <p><span class="detail-label">When</span><span class="detail-value">${date}</span></p>
        <p><span class="detail-label">Time</span><span class="detail-value">${time}</span></p>
        ${place ? `<p><span class="detail-label">Where</span><span class="detail-value">${place}</span></p>` : ''}
    `;

    // Animate in
    requestAnimationFrame(() => card.classList.add('show'));

    // Gold particle burst
    burstGoldParticles();
}

// ==========================================
// GOLD PARTICLE CANVAS (CHAPTER 5)
// ==========================================
let goldParticles = [];
let goldCanvas, goldCtx;

function initGoldParticles() {
    goldCanvas = document.getElementById('gold-particles');
    goldCtx = goldCanvas.getContext('2d');

    function resize() {
        goldCanvas.width = window.innerWidth;
        goldCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class GoldMote {
        constructor() {
            this.x = Math.random() * goldCanvas.width;
            this.y = Math.random() * goldCanvas.height;
            this.r = Math.random() * 1.5 + 0.3;
            this.vy = -(Math.random() * 0.3 + 0.1);
            this.vx = (Math.random() - 0.5) * 0.2;
            this.phase = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 0.01 + 0.005;
            this.opacity = Math.random() * 0.15 + 0.05;
        }
        update() {
            this.y += this.vy;
            this.x += this.vx;
            this.phase += this.speed;
            this.opacity = 0.05 + Math.sin(this.phase) * 0.08;
            if (this.y < -10) {
                this.y = goldCanvas.height + 10;
                this.x = Math.random() * goldCanvas.width;
            }
        }
        draw() {
            goldCtx.globalAlpha = this.opacity;
            goldCtx.fillStyle = '#c9a96e';
            goldCtx.beginPath();
            goldCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            goldCtx.fill();
        }
    }

    for (let i = 0; i < 40; i++) goldParticles.push(new GoldMote());

    (function loop() {
        goldCtx.clearRect(0, 0, goldCanvas.width, goldCanvas.height);
        goldParticles.forEach(p => { p.update(); p.draw(); });
        goldCtx.globalAlpha = 1;
        requestAnimationFrame(loop);
    })();
}

function burstGoldParticles() {
    if (!goldCtx) return;
    const cx = goldCanvas.width / 2;
    const cy = goldCanvas.height / 2;

    for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        goldParticles.push({
            x: cx, y: cy,
            r: Math.random() * 2 + 1,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            phase: 0,
            speed: 0.02,
            opacity: 0.5,
            life: 1,
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vx *= 0.98;
                this.vy *= 0.98;
                this.life -= 0.008;
                this.opacity = this.life * 0.5;
            },
            draw() {
                goldCtx.globalAlpha = Math.max(0, this.opacity);
                goldCtx.fillStyle = '#c9a96e';
                goldCtx.beginPath();
                goldCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                goldCtx.fill();
            }
        });
    }
}

// ==========================================
// AMBIENT AUDIO (Soft piano-like tones)
// ==========================================
function toggleAudio() {
    const btn = document.getElementById('audioToggle');
    if (!isPlaying) {
        startAudio();
        btn.classList.add('playing');
        isPlaying = true;
    } else {
        stopAudio();
        btn.classList.remove('playing');
        isPlaying = false;
    }
}

function startAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Soft ambient chord progression
    const chords = [
        [261.63, 329.63, 392.00],  // C major
        [220.00, 277.18, 329.63],  // A minor
        [349.23, 440.00, 523.25],  // F major
        [293.66, 369.99, 440.00],  // D minor
        [261.63, 329.63, 392.00],  // C major
        [246.94, 311.13, 369.99],  // B diminished → resolves
    ];

    let chordIdx = 0;
    let t = audioCtx.currentTime + 0.1;

    function playChord(freqs, start, dur) {
        const master = audioCtx.createGain();
        master.gain.value = 0;
        master.gain.linearRampToValueAtTime(0.06, start + 0.8);
        master.gain.linearRampToValueAtTime(0.04, start + dur - 1);
        master.gain.linearRampToValueAtTime(0, start + dur);
        master.connect(audioCtx.destination);

        freqs.forEach(freq => {
            const osc = audioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;

            const g = audioCtx.createGain();
            g.gain.value = 0.4;
            osc.connect(g);
            g.connect(master);

            osc.start(start);
            osc.stop(start + dur);

            // Soft octave above
            const osc2 = audioCtx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = freq * 2;
            const g2 = audioCtx.createGain();
            g2.gain.value = 0.08;
            osc2.connect(g2);
            g2.connect(master);
            osc2.start(start);
            osc2.stop(start + dur);
        });
    }

    function scheduleLoop() {
        while (chordIdx < chords.length) {
            playChord(chords[chordIdx], t, 4.5);
            t += 4;
            chordIdx++;
        }
        chordIdx = 0;
        musicTimeout = setTimeout(scheduleLoop, (t - audioCtx.currentTime) * 1000 - 200);
    }

    scheduleLoop();
}

function stopAudio() {
    clearTimeout(musicTimeout);
    if (audioCtx) { audioCtx.close(); audioCtx = null; }
}
