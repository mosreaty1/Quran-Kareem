// Tasbih Counter Script
'use strict';

// DOM Elements
const counterEl = document.getElementById('counter');
const currentDhikrEl = document.getElementById('current-dhikr');
const dhikrTransliterationEl = document.querySelector('.dhikr-transliteration');
const countBtn = document.getElementById('count-btn');
const resetBtn = document.getElementById('reset-btn');
const targetBtn = document.getElementById('target-btn');
const targetDisplayEl = document.getElementById('target-display');
const progressFillEl = document.getElementById('progress-fill');
const progressPercentageEl = document.getElementById('progress-percentage');
const presetBtns = document.querySelectorAll('.preset-btn');

// State
let count = 0;
let target = 33;
let currentDhikr = {
    arabic: 'سُبْحَانَ اللهِ',
    transliteration: 'Subhan Allah'
};

// Load saved state from localStorage
function loadState() {
    const savedCount = localStorage.getItem('tasbihCount');
    const savedTarget = localStorage.getItem('tasbihTarget');
    const savedDhikr = localStorage.getItem('tasbihDhikr');

    if (savedCount) count = parseInt(savedCount);
    if (savedTarget) target = parseInt(savedTarget);
    if (savedDhikr) {
        try {
            currentDhikr = JSON.parse(savedDhikr);
        } catch (e) {
            console.error('Error parsing saved dhikr');
        }
    }

    updateDisplay();
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('tasbihCount', count.toString());
    localStorage.setItem('tasbihTarget', target.toString());
    localStorage.setItem('tasbihDhikr', JSON.stringify(currentDhikr));
}

// Update display
function updateDisplay() {
    counterEl.textContent = count;
    currentDhikrEl.textContent = currentDhikr.arabic;
    dhikrTransliterationEl.textContent = currentDhikr.transliteration;
    targetDisplayEl.textContent = target;

    // Update progress
    const percentage = Math.min((count / target) * 100, 100);
    progressFillEl.style.width = `${percentage}%`;
    progressPercentageEl.textContent = `${Math.round(percentage)}%`;

    // Check if target reached
    if (count >= target && count > 0) {
        celebrateCompletion();
    }
}

// Increment counter
function incrementCounter() {
    count++;
    updateDisplay();
    saveState();
    animateCount();
}

// Reset counter
function resetCounter() {
    if (confirm('هل تريد إعادة تعيين العداد؟')) {
        count = 0;
        updateDisplay();
        saveState();
    }
}

// Change target
function changeTarget() {
    const newTarget = prompt('أدخل الهدف الجديد:', target);
    if (newTarget !== null && !isNaN(newTarget) && newTarget > 0) {
        target = parseInt(newTarget);
        updateDisplay();
        saveState();
    }
}

// Change dhikr
function changeDhikr(arabic, transliteration) {
    currentDhikr = { arabic, transliteration };
    updateDisplay();
    saveState();

    // Update active preset button
    presetBtns.forEach(btn => {
        if (btn.dataset.dhikr === arabic) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Animate count button
function animateCount() {
    countBtn.classList.add('counting');
    setTimeout(() => {
        countBtn.classList.remove('counting');
    }, 200);
}

// Celebrate completion
function celebrateCompletion() {
    // Add celebration animation to counter
    const counterCircle = document.querySelector('.counter-circle');
    counterCircle.classList.add('celebrate');
    setTimeout(() => {
        counterCircle.classList.remove('celebrate');
    }, 1000);

    // Vibrate if supported
    if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
    }
}

// Event Listeners
countBtn.addEventListener('click', incrementCounter);
resetBtn.addEventListener('click', resetCounter);
targetBtn.addEventListener('click', changeTarget);

// Preset buttons
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const arabic = btn.dataset.dhikr;
        const transliteration = btn.dataset.trans;
        changeDhikr(arabic, transliteration);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        incrementCounter();
    } else if (e.code === 'KeyR' && e.ctrlKey) {
        e.preventDefault();
        resetCounter();
    }
});

// Touch/click anywhere on main display to count
const dhikrDisplay = document.querySelector('.dhikr-display');
const counterDisplay = document.querySelector('.counter-display');

dhikrDisplay.addEventListener('click', incrementCounter);
counterDisplay.addEventListener('click', incrementCounter);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadState();

    // Set active preset button based on loaded dhikr
    presetBtns.forEach(btn => {
        if (btn.dataset.dhikr === currentDhikr.arabic) {
            btn.classList.add('active');
        }
    });
});
