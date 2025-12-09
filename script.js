// Quran Kareem Web Application
// Using Al-Quran Cloud API: https://alquran.cloud/api

// Global Variables
let currentSurah = null;
let currentAyahIndex = 0;
let ayahsData = [];
let audioPlayer = null;
let isPlaying = false;
let currentReciter = 'ar.alafasy';

// DOM Elements
const loading = document.getElementById('loading');
const mainContent = document.getElementById('main-content');
const surahSelect = document.getElementById('surah-select');
const reciterSelect = document.getElementById('reciter-select');
const surahInfo = document.getElementById('surah-info');
const surahName = document.getElementById('surah-name');
const surahDetails = document.getElementById('surah-details');
const ayahsContainer = document.getElementById('ayahs-container');
const audioPlayerContainer = document.getElementById('audio-player-container');
const playPauseBtn = document.getElementById('play-pause');
const prevAyahBtn = document.getElementById('prev-ayah');
const nextAyahBtn = document.getElementById('next-ayah');
const progressBar = document.getElementById('progress-bar');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const currentAyahNumber = document.getElementById('current-ayah-number');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');

// Initialize Audio Player
audioPlayer = document.getElementById('audio-player');

// API Base URLs
const API_BASE = 'https://api.alquran.cloud/v1';

// Initialize Application
async function init() {
    try {
        await loadSurahList();
        setupEventListeners();
        hideLoading();
    } catch (error) {
        console.error('Initialization error:', error);
        alert('حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.');
    }
}

// Load Surah List
async function loadSurahList() {
    try {
        const response = await fetch(`${API_BASE}/surah`);
        const data = await response.json();

        if (data.code === 200 && data.data) {
            const surahs = data.data;

            surahs.forEach(surah => {
                const option = document.createElement('option');
                option.value = surah.number;
                option.textContent = `${surah.number}. ${surah.name} - ${surah.englishName} (${surah.numberOfAyahs} آية)`;
                surahSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading surah list:', error);
        throw error;
    }
}

// Load Surah Data
async function loadSurah(surahNumber) {
    showLoading();

    try {
        // Load Surah text and audio
        const [textResponse, audioResponse] = await Promise.all([
            fetch(`${API_BASE}/surah/${surahNumber}`),
            fetch(`${API_BASE}/surah/${surahNumber}/${currentReciter}`)
        ]);

        const textData = await textResponse.json();
        const audioData = await audioResponse.json();

        if (textData.code === 200 && audioData.code === 200) {
            currentSurah = textData.data;
            ayahsData = audioData.data.ayahs;
            currentAyahIndex = 0;

            displaySurahInfo();
            displayAyahs();
            setupAudioPlayer();

            surahInfo.style.display = 'block';
            audioPlayerContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading surah:', error);
        alert('حدث خطأ في تحميل السورة. يرجى المحاولة مرة أخرى.');
    } finally {
        hideLoading();
    }
}

// Display Surah Information
function displaySurahInfo() {
    const surah = currentSurah;
    const revelationType = surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية';

    surahName.textContent = surah.name;
    surahDetails.textContent = `${surah.englishName} - ${surah.englishNameTranslation} | ${revelationType} | ${surah.numberOfAyahs} آية`;
}

// Display Ayahs
function displayAyahs() {
    ayahsContainer.innerHTML = '';

    ayahsData.forEach((ayah, index) => {
        const ayahDiv = document.createElement('div');
        ayahDiv.className = 'ayah';
        ayahDiv.dataset.index = index;

        // Special case for Al-Fatiha and At-Tawbah (no Bismillah)
        let ayahText = ayah.text;

        ayahDiv.innerHTML = `
            <span class="ayah-number">${ayah.numberInSurah}</span>
            <span class="ayah-text">${ayahText}</span>
        `;

        // Click to play specific ayah
        ayahDiv.addEventListener('click', () => {
            playAyah(index);
        });

        ayahsContainer.appendChild(ayahDiv);
    });
}

// Setup Audio Player
function setupAudioPlayer() {
    if (ayahsData.length > 0) {
        loadAyahAudio(0);
    }
}

// Load Ayah Audio
function loadAyahAudio(index) {
    if (index >= 0 && index < ayahsData.length) {
        currentAyahIndex = index;
        const ayah = ayahsData[index];

        audioPlayer.src = ayah.audio;
        audioPlayer.load();

        updateCurrentAyahDisplay();
        highlightCurrentAyah();
    }
}

// Play Ayah
function playAyah(index) {
    loadAyahAudio(index);
    audioPlayer.play();
    updatePlayPauseButton(true);
}

// Play/Pause Toggle
function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        updatePlayPauseButton(true);
    } else {
        audioPlayer.pause();
        updatePlayPauseButton(false);
    }
}

// Update Play/Pause Button
function updatePlayPauseButton(playing) {
    isPlaying = playing;
    if (playing) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

// Previous Ayah
function previousAyah() {
    if (currentAyahIndex > 0) {
        playAyah(currentAyahIndex - 1);
    }
}

// Next Ayah
function nextAyah() {
    if (currentAyahIndex < ayahsData.length - 1) {
        playAyah(currentAyahIndex + 1);
    }
}

// Update Current Ayah Display
function updateCurrentAyahDisplay() {
    const ayahNumber = ayahsData[currentAyahIndex].numberInSurah;
    currentAyahNumber.textContent = `الآية: ${ayahNumber}`;
}

// Highlight Current Ayah
function highlightCurrentAyah() {
    // Remove previous highlight
    document.querySelectorAll('.ayah').forEach(ayah => {
        ayah.classList.remove('playing');
    });

    // Add highlight to current ayah
    const currentAyahElement = document.querySelector(`.ayah[data-index="${currentAyahIndex}"]`);
    if (currentAyahElement) {
        currentAyahElement.classList.add('playing');

        // Smooth scroll to current ayah
        currentAyahElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Format Time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update Progress Bar
function updateProgress() {
    const { currentTime, duration } = audioPlayer;

    if (duration > 0) {
        const progress = (currentTime / duration) * 100;
        progressBar.value = progress;
        currentTimeSpan.textContent = formatTime(currentTime);
        durationSpan.textContent = formatTime(duration);
    }
}

// Seek Audio
function seekAudio(e) {
    const { duration } = audioPlayer;
    if (duration > 0) {
        const seekTime = (e.target.value / 100) * duration;
        audioPlayer.currentTime = seekTime;
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Surah Selection
    surahSelect.addEventListener('change', (e) => {
        const surahNumber = e.target.value;
        if (surahNumber) {
            loadSurah(surahNumber);
        }
    });

    // Reciter Selection
    reciterSelect.addEventListener('change', (e) => {
        currentReciter = e.target.value;
        if (currentSurah) {
            loadSurah(currentSurah.number);
        }
    });

    // Audio Player Controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevAyahBtn.addEventListener('click', previousAyah);
    nextAyahBtn.addEventListener('click', nextAyah);

    // Progress Bar
    progressBar.addEventListener('input', seekAudio);

    // Audio Player Events
    audioPlayer.addEventListener('timeupdate', updateProgress);

    audioPlayer.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audioPlayer.duration);
    });

    audioPlayer.addEventListener('play', () => {
        updatePlayPauseButton(true);
    });

    audioPlayer.addEventListener('pause', () => {
        updatePlayPauseButton(false);
    });

    audioPlayer.addEventListener('ended', () => {
        // Auto-play next ayah
        if (currentAyahIndex < ayahsData.length - 1) {
            nextAyah();
        } else {
            updatePlayPauseButton(false);
            progressBar.value = 0;
            currentTimeSpan.textContent = '0:00';
        }
    });

    audioPlayer.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        alert('حدث خطأ في تحميل الصوت. يرجى المحاولة مرة أخرى.');
        updatePlayPauseButton(false);
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (ayahsData.length === 0) return;

        switch(e.key) {
            case ' ':
            case 'Spacebar':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowRight':
                e.preventDefault();
                previousAyah();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                nextAyah();
                break;
        }
    });
}

// Show Loading
function showLoading() {
    loading.style.display = 'block';
    mainContent.style.display = 'none';
}

// Hide Loading
function hideLoading() {
    loading.style.display = 'none';
    mainContent.style.display = 'block';
}

// Start Application
document.addEventListener('DOMContentLoaded', init);
