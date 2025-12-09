// Quran Kareem Web Application
// Using Complete Surah Audio Files from EveryAyah.com

// Security: Input Validation and Sanitization Functions
function sanitizeInteger(value, min = 1, max = 114) {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < min || num > max) {
        return null;
    }
    return num;
}

function sanitizeText(text) {
    if (typeof text !== 'string') return '';
    // Remove any HTML tags and special characters that could be used for XSS
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function isValidReciter(reciter) {
    return RECITER_MAPPINGS.hasOwnProperty(reciter);
}

// Global Variables
let currentSurah = null;
let audioPlayer = null;
let isPlaying = false;
let currentReciter = 'Husary_128kbps';
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

// Reciter mappings to audio URLs (using multiple reliable sources)
const RECITER_MAPPINGS = {
    'Husary_128kbps': {
        base: 'https://everyayah.com/data/Husary_128kbps',
        name: 'محمود خليل الحصري'
    },
    'Alafasy_128kbps': {
        base: 'https://everyayah.com/data/Alafasy_128kbps',
        name: 'مشاري العفاسي'
    },
    'Abdul_Basit_Mujawwad_128kbps': {
        base: 'https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps',
        name: 'عبد الباسط عبد الصمد'
    },
    'Abdurrahmaan_As-Sudais_192kbps': {
        base: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps',
        name: 'عبد الرحمن السديس'
    },
    'Abu_Bakr_Ash-Shaatree_128kbps': {
        base: 'https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps',
        name: 'أبو بكر الشاطري'
    },
    'Ahmed_ibn_Ali_al-Ajamy_128kbps': {
        base: 'https://everyayah.com/data/Ahmed_ibn_Ali_al-Ajamy_128kbps-01',
        name: 'أحمد العجمي'
    },
    'Ghamadi_40kbps': {
        base: 'https://everyayah.com/data/Ghamadi_40kbps',
        name: 'سعد الغامدي'
    },
    'Muhammad_Ayyoub_128kbps': {
        base: 'https://everyayah.com/data/Muhammad_Ayyoub_128kbps',
        name: 'محمد أيوب'
    },
    'Minshawy_Murattal_128kbps': {
        base: 'https://everyayah.com/data/Minshawy_Murattal_128kbps',
        name: 'محمد صديق المنشاوي'
    }
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
    // Security: Validate surah number
    const validSurahNumber = sanitizeInteger(surahNumber, 1, 114);
    if (!validSurahNumber) {
        console.error('Invalid surah number:', surahNumber);
        alert('رقم السورة غير صحيح');
        return;
    }

    showLoading();

    try {
        // Load Surah metadata
        const response = await fetch(`${API_BASE}/surah/${validSurahNumber}`);
        const data = await response.json();

        if (data.code === 200 && data.data) {
            currentSurah = data.data;
            totalAyahs = currentSurah.numberOfAyahs;

            displaySurahInfo();
            await loadFullSurahAudio(surahNumber);

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

// Load Complete Surah Audio by combining all ayahs
async function loadFullSurahAudio(surahNumber) {
    // Security: Validate surah number
    const validSurahNumber = sanitizeInteger(surahNumber, 1, 114);
    if (!validSurahNumber) {
        console.error('Invalid surah number:', surahNumber);
        return;
    }

    try {
        // Get ayah data to know how many ayahs
        const response = await fetch(`${API_BASE}/surah/${validSurahNumber}`);
        const data = await response.json();

        if (data.code === 200 && data.data) {
            const surahData = data.data;
            const numberOfAyahs = surahData.numberOfAyahs;

            // Create audio context for concatenating audio
            const reciterInfo = RECITER_MAPPINGS[currentReciter];
            const ayahFiles = [];

            // Generate URLs for all ayahs in the surah
            for (let i = 1; i <= numberOfAyahs; i++) {
                const formattedSurah = String(surahNumber).padStart(3, '0');
                const formattedAyah = String(i).padStart(3, '0');
                const ayahUrl = `${reciterInfo.base}/${formattedSurah}${formattedAyah}.mp3`;
                ayahFiles.push(ayahUrl);
            }

            // For now, play first ayah and setup auto-play for next
            window.currentAyahFiles = ayahFiles;
            window.currentAyahFileIndex = 0;

            loadAndPlayAyah(0);
        }
    } catch (error) {
        console.error('Error loading full surah audio:', error);
        currentAyahNumber.textContent = 'حدث خطأ في التحميل';
    }
}

// Load and play specific ayah
function loadAndPlayAyah(index) {
    // Security: Validate index
    const validIndex = sanitizeInteger(index, 0, 286);
    if (validIndex === null || !window.currentAyahFiles || validIndex >= window.currentAyahFiles.length) {
        console.error('Invalid ayah index:', index);
        return;
    }

    window.currentAyahFileIndex = validIndex;
    const ayahUrl = window.currentAyahFiles[validIndex];

    // Security: Validate URL format
    if (!ayahUrl || typeof ayahUrl !== 'string' || !ayahUrl.startsWith('https://')) {
        console.error('Invalid audio URL:', ayahUrl);
        return;
    }

    console.log('Loading ayah:', validIndex + 1, 'of', window.currentAyahFiles.length);
    console.log('URL:', ayahUrl);

    audioPlayer.src = ayahUrl;
    audioPlayer.load();

    const progress = ((validIndex + 1) / window.currentAyahFiles.length * 100).toFixed(1);
    currentAyahNumber.textContent = `الآية ${validIndex + 1} من ${window.currentAyahFiles.length}`;
}

// Display Surah Information
function displaySurahInfo() {
    const surah = currentSurah;

    // Security: Validate API response data
    if (!surah || !surah.name || !surah.englishName) {
        console.error('Invalid surah data');
        return;
    }

    const revelationType = surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية';
    const numberOfAyahs = sanitizeInteger(surah.numberOfAyahs, 1, 286) || 0;

    // Use textContent instead of innerHTML to prevent XSS
    surahName.textContent = sanitizeText(surah.name);
    surahDetails.textContent = `${sanitizeText(surah.englishName)} - ${sanitizeText(surah.englishNameTranslation)} | ${revelationType} | ${numberOfAyahs} آية`;
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
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
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
        const newReciter = e.target.value;
        // Security: Validate reciter
        if (!isValidReciter(newReciter)) {
            console.error('Invalid reciter:', newReciter);
            alert('القارئ غير صحيح');
            return;
        }
        currentReciter = newReciter;
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

    // Auto-play next ayah when current ends
    audioPlayer.addEventListener('ended', () => {
        if (window.currentAyahFiles && window.currentAyahFileIndex < window.currentAyahFiles.length - 1) {
            // Play next ayah
            const nextIndex = window.currentAyahFileIndex + 1;
            loadAndPlayAyah(nextIndex);
            // Auto-play
            setTimeout(() => {
                audioPlayer.play().catch(error => {
                    console.error('Auto-play error:', error);
                });
            }, 100);
        } else {
            // Surah completed
            updatePlayPauseButton(false);
            progressBar.value = 100;
            currentAyahNumber.textContent = 'اكتملت السورة بحمد الله';

            // Reset after 3 seconds
            setTimeout(() => {
                if (window.currentAyahFiles) {
                    window.currentAyahFileIndex = 0;
                    loadAndPlayAyah(0);
                }
            }, 3000);
        }
    });

    audioPlayer.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        console.error('Error code:', audioPlayer.error?.code);
        console.error('Error message:', audioPlayer.error?.message);
        console.error('Source:', audioPlayer.src);

        // Try next ayah if available
        if (window.currentAyahFiles && window.currentAyahFileIndex < window.currentAyahFiles.length - 1) {
            console.log('Trying next ayah...');
            const nextIndex = window.currentAyahFileIndex + 1;
            loadAndPlayAyah(nextIndex);
            if (isPlaying) {
                setTimeout(() => {
                    audioPlayer.play().catch(err => console.error('Play error:', err));
                }, 100);
            }
        } else {
            updatePlayPauseButton(false);
            currentAyahNumber.textContent = 'حدث خطأ في التحميل';
        }
    });

    audioPlayer.addEventListener('waiting', () => {
        currentAyahNumber.textContent = 'جاري التحميل...';
    });

    audioPlayer.addEventListener('canplay', () => {
        if (window.currentAyahFiles) {
            const progress = ((window.currentAyahFileIndex + 1) / window.currentAyahFiles.length * 100).toFixed(0);
            currentAyahNumber.textContent = `الآية ${window.currentAyahFileIndex + 1} من ${window.currentAyahFiles.length} (${progress}%)`;
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
