// Quran Kareem Web Application
// Using Al-Quran Cloud API: https://alquran.cloud/api

// Global Variables
let currentSurah = null;
let currentAyahIndex = 0;
let ayahsData = [];
let audioPlayer = null;
let isPlaying = false;
let currentReciter = 'ar.alafasy';
let totalAyahs = 0;

// DOM Elements
const loading = document.getElementById('loading');
const mainContent = document.getElementById('main-content');
const surahSelect = document.getElementById('surah-select');
const reciterSelect = document.getElementById('reciter-select');
const surahInfo = document.getElementById('surah-info');
const surahName = document.getElementById('surah-name');
const surahDetails = document.getElementById('surah-details');
const audioPlayerContainer = document.getElementById('audio-player-container');
const playPauseBtn = document.getElementById('play-pause');
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
        // Load Surah text and audio data
        const [textResponse, audioResponse] = await Promise.all([
            fetch(`${API_BASE}/surah/${surahNumber}`),
            fetch(`${API_BASE}/surah/${surahNumber}/${currentReciter}`)
        ]);

        const textData = await textResponse.json();
        const audioData = await audioResponse.json();

        if (textData.code === 200 && audioData.code === 200) {
            currentSurah = textData.data;
            ayahsData = audioData.data.ayahs;
            totalAyahs = ayahsData.length;
            currentAyahIndex = 0;

            displaySurahInfo();
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

// Setup Audio Player for Continuous Playback
function setupAudioPlayer() {
    if (ayahsData.length > 0) {
        currentAyahIndex = 0;
        loadAyahAudio(0);
        updateCurrentAyahDisplay();
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
    }
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

// Update Current Ayah Display
function updateCurrentAyahDisplay() {
    const ayahNumber = currentAyahIndex + 1;
    currentAyahNumber.textContent = `الآية ${ayahNumber} من ${totalAyahs}`;
}

// Format Time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';

    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
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
            // Stop current playback
            audioPlayer.pause();
            updatePlayPauseButton(false);
            loadSurah(surahNumber);
        }
    });

    // Reciter Selection
    reciterSelect.addEventListener('change', (e) => {
        currentReciter = e.target.value;
        if (currentSurah) {
            // Stop current playback
            audioPlayer.pause();
            updatePlayPauseButton(false);
            loadSurah(currentSurah.number);
        }
    });

    // Audio Player Controls
    playPauseBtn.addEventListener('click', togglePlayPause);

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

    // Continuous Playback - Auto-play next ayah
    audioPlayer.addEventListener('ended', () => {
        if (currentAyahIndex < ayahsData.length - 1) {
            // Load and play next ayah automatically
            loadAyahAudio(currentAyahIndex + 1);
            audioPlayer.play();
        } else {
            // Surah completed
            updatePlayPauseButton(false);
            progressBar.value = 0;
            currentTimeSpan.textContent = '0:00';
            currentAyahNumber.textContent = 'اكتملت السورة';

            // Reset to first ayah
            setTimeout(() => {
                currentAyahIndex = 0;
                loadAyahAudio(0);
            }, 2000);
        }
    });

    audioPlayer.addEventListener('error', (e) => {
        console.error('Audio error:', e);

        // Try to continue with next ayah if available
        if (currentAyahIndex < ayahsData.length - 1) {
            console.log('Trying next ayah...');
            loadAyahAudio(currentAyahIndex + 1);
            if (isPlaying) {
                audioPlayer.play();
            }
        } else {
            alert('حدث خطأ في تحميل الصوت. يرجى المحاولة مرة أخرى.');
            updatePlayPauseButton(false);
        }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (ayahsData.length === 0) return;

        // Space or K to play/pause
        if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'k' || e.key === 'K') {
            e.preventDefault();
            togglePlayPause();
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
