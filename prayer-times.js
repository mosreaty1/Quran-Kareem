// Prayer Times Script
'use strict';

// DOM Elements
const loading = document.getElementById('loading');
const mainContent = document.getElementById('main-content');
const currentDateEl = document.getElementById('current-date');
const hijriDateEl = document.getElementById('hijri-date');
const locationNameEl = document.getElementById('location-name');
const nextPrayerNameEl = document.getElementById('next-prayer-name');
const timeRemainingEl = document.getElementById('time-remaining');

// Prayer time elements
const prayerTimeElements = {
    fajr: document.getElementById('fajr-time'),
    sunrise: document.getElementById('sunrise-time'),
    dhuhr: document.getElementById('dhuhr-time'),
    asr: document.getElementById('asr-time'),
    maghrib: document.getElementById('maghrib-time'),
    isha: document.getElementById('isha-time')
};

// Prayer names in Arabic
const prayerNamesArabic = {
    fajr: 'الفجر',
    sunrise: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء'
};

let prayerTimes = {};
let nextPrayerTimer = null;

// Security: Sanitize text content
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get user location
async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                // If geolocation fails, use default location (Mecca)
                console.warn('Geolocation error:', error);
                resolve({
                    latitude: 21.4225,
                    longitude: 39.8262,
                    isDefault: true
                });
            }
        );
    });
}

// Fetch prayer times from Aladhan API
async function fetchPrayerTimes(latitude, longitude) {
    try {
        const response = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch prayer times');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        throw error;
    }
}

// Format time to 12-hour format
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'م' : 'ص';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
}

// Display prayer times
function displayPrayerTimes(data) {
    const timings = data.timings;
    const date = data.date;

    // Store prayer times for countdown
    prayerTimes = {
        fajr: timings.Fajr,
        sunrise: timings.Sunrise,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha
    };

    // Display times
    Object.keys(prayerTimeElements).forEach(prayer => {
        if (prayerTimes[prayer]) {
            prayerTimeElements[prayer].textContent = formatTime(prayerTimes[prayer]);
        }
    });

    // Display dates
    const gregorian = date.gregorian;
    const hijri = date.hijri;

    currentDateEl.textContent = `${gregorian.weekday.ar}، ${gregorian.day} ${gregorian.month.ar} ${gregorian.year}`;
    hijriDateEl.textContent = `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;

    // Display location (if available)
    if (data.meta && data.meta.timezone) {
        locationNameEl.textContent = sanitizeText(data.meta.timezone);
    }

    // Start next prayer countdown
    updateNextPrayer();
    if (nextPrayerTimer) clearInterval(nextPrayerTimer);
    nextPrayerTimer = setInterval(updateNextPrayer, 1000);
}

// Update next prayer countdown
function updateNextPrayer() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let nextPrayer = null;
    let nextPrayerTime = null;

    // Find next prayer
    const prayerOrder = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    for (const prayer of prayerOrder) {
        if (prayerTimes[prayer] > currentTime) {
            nextPrayer = prayer;
            nextPrayerTime = prayerTimes[prayer];
            break;
        }
    }

    // If no prayer found today, next is Fajr tomorrow
    if (!nextPrayer) {
        nextPrayer = 'fajr';
        nextPrayerTime = prayerTimes.fajr;
    }

    // Calculate time remaining
    const [hours, minutes] = nextPrayerTime.split(':');
    const prayerDate = new Date();
    prayerDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // If prayer is tomorrow
    if (prayerDate <= now) {
        prayerDate.setDate(prayerDate.getDate() + 1);
    }

    const diff = prayerDate - now;
    const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsRemaining = Math.floor((diff % (1000 * 60)) / 1000);

    nextPrayerNameEl.textContent = prayerNamesArabic[nextPrayer];

    if (hoursRemaining > 0) {
        timeRemainingEl.textContent = `${hoursRemaining} ساعة و ${minutesRemaining} دقيقة`;
    } else if (minutesRemaining > 0) {
        timeRemainingEl.textContent = `${minutesRemaining} دقيقة و ${secondsRemaining} ثانية`;
    } else {
        timeRemainingEl.textContent = `${secondsRemaining} ثانية`;
    }
}

// Initialize prayer times
async function initPrayerTimes() {
    try {
        loading.style.display = 'flex';
        mainContent.style.display = 'none';

        // Get user location
        const location = await getUserLocation();

        // Fetch prayer times
        const data = await fetchPrayerTimes(location.latitude, location.longitude);

        // Display prayer times
        displayPrayerTimes(data);

        // Show main content
        loading.style.display = 'none';
        mainContent.style.display = 'block';

    } catch (error) {
        console.error('Error initializing prayer times:', error);
        loading.querySelector('p').textContent = 'فشل تحميل مواقيت الصلاة';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initPrayerTimes);
