// Quran Kareem Web Application
// Using Complete Surah Audio Files from QuranicAudio.com

// Global Variables
let currentSurah = null;
let audioPlayer = null;
let isPlaying = false;
let currentReciter = 'mishary_rashid_alafasy';
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
const AUDIO_BASE = 'https://download.quranicaudio.com/quran';

// Reciter mappings to audio folder names
const RECITER_MAPPINGS = {
    'mishary_rashid_alafasy': 'mishary_rashid_alafasy',
    'abdul_basit_murattal': 'abdulbaset_mujawwad',
    'abdullah_basfar': 'abdullah_basfar_192kbps',
    'abdurrahman_sudais': 'abdurrahmaan_as-sudays_192kbps',
    'abu_bakr_shatri': 'abu_bakr_ash-shaatree_128kbps',
    'mahmoud_khalil_al_hussary': 'mahmoud_khalil_al-hussary_128kbps',
    'mohamed_siddiq_alminshawi': 'muhammad_siddeeq_al-minshaawee_128kbps',
    'muhammad_ayyoub': 'muhammad_ayyoob_128kbps',
    'ali_hajjaj_alsouasi': 'ali_hajjaj_alsouasi_128kbps'
};

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
        // Load Surah metadata
        const response = await fetch(`${API_BASE}/surah/${surahNumber}`);
        const data = await response.json();

        if (data.code === 200 && data.data) {
            currentSurah = data.data;
            totalAyahs = currentSurah.numberOfAyahs;

            displaySurahInfo();
            loadFullSurahAudio(surahNumber);

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

// Load Complete Surah Audio File
function loadFullSurahAudio(surahNumber) {
    // Format surah number with leading zeros (001, 002, etc.)
    const formattedSurahNumber = String(surahNumber).padStart(3, '0');

    // Construct full surah audio URL
    const reciterFolder = RECITER_MAPPINGS[currentReciter];
    const audioUrl = `${AUDIO_BASE}/${reciterFolder}/${formattedSurahNumber}.mp3`;

    console.log('Loading full surah audio:', audioUrl);

    // Load the complete surah audio
    audioPlayer.src = audioUrl;
    audioPlayer.load();

    // Update status
    currentAyahNumber.textContent = 'جاهز للتشغيل - السورة كاملة';
}

// Display Surah Information
function displaySurahInfo() {
    const surah = currentSurah;
    const revelationType = surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية';

    surahName.textContent = surah.name;
    surahDetails.textContent = `${surah.englishName} - ${surah.englishNameTranslation} | ${revelationType} | ${surah.numberOfAyahs} آية`;
}

// Play/Pause Toggle
function togglePlayPause() {
    if (audioPlayer.paused) {
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                updatePlayPauseButton(true);
            }).catch(error => {
                console.error('Playback error:', error);
                alert('حدث خطأ في تشغيل الصوت. يرجى المحاولة مرة أخرى.');
            });
        }
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
        currentAyahNumber.textContent = 'جاري التشغيل - السورة كاملة';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        if (audioPlayer.ended) {
            currentAyahNumber.textContent = 'اكتملت السورة';
        } else {
            currentAyahNumber.textContent = 'متوقف مؤقتاً';
        }
    }
}

// Format Time
function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';

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

        // Update status during playback
        if (!audioPlayer.paused) {
            const percentComplete = Math.floor(progress);
            currentAyahNumber.textContent = `جاري التشغيل - ${percentComplete}%`;
        }
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
        console.log('Audio loaded. Duration:', formatTime(audioPlayer.duration));
    });

    audioPlayer.addEventListener('play', () => {
        updatePlayPauseButton(true);
    });

    audioPlayer.addEventListener('pause', () => {
        updatePlayPauseButton(false);
    });

    audioPlayer.addEventListener('ended', () => {
        updatePlayPauseButton(false);
        progressBar.value = 100;
        currentAyahNumber.textContent = 'اكتملت السورة بحمد الله';

        // Reset after 3 seconds
        setTimeout(() => {
            progressBar.value = 0;
            currentTimeSpan.textContent = '0:00';
            currentAyahNumber.textContent = 'جاهز للتشغيل - السورة كاملة';
        }, 3000);
    });

    audioPlayer.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        console.error('Error code:', audioPlayer.error?.code);
        console.error('Error message:', audioPlayer.error?.message);
        console.error('Source:', audioPlayer.src);

        updatePlayPauseButton(false);
        currentAyahNumber.textContent = 'حدث خطأ في التحميل';
        alert('حدث خطأ في تحميل الصوت. يرجى اختيار قارئ آخر أو المحاولة مرة أخرى.');
    });

    audioPlayer.addEventListener('waiting', () => {
        currentAyahNumber.textContent = 'جاري التحميل...';
    });

    audioPlayer.addEventListener('canplay', () => {
        if (isPlaying) {
            currentAyahNumber.textContent = 'جاري التشغيل - السورة كاملة';
        }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (!currentSurah) return;

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
