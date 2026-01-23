// Hijri Calendar Script
'use strict';

// Hijri month names in Arabic
const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

// Gregorian month names in Arabic
const gregorianMonthsAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

// Gregorian to Hijri conversion (simplified algorithm)
function gregorianToHijri(gDate) {
    // Julian Day calculation
    const gYear = gDate.getFullYear();
    const gMonth = gDate.getMonth() + 1;
    const gDay = gDate.getDate();

    let a = Math.floor((14 - gMonth) / 12);
    let y = gYear + 4800 - a;
    let m = gMonth + (12 * a) - 3;

    let julianDay = gDay + Math.floor((153 * m + 2) / 5) +
        (365 * y) + Math.floor(y / 4) -
        Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Convert Julian Day to Hijri
    a = julianDay - 1948440 + 10632;
    let b = Math.floor((a - 1) / 10631);
    a = a - 10631 * b + 354;
    let j = Math.floor((10985 - a) / 5316) *
        Math.floor((50 * a) / 17719) +
        Math.floor(a / 5670) *
        Math.floor((43 * a) / 15238);
    a = a - Math.floor((30 - j) / 15) *
        Math.floor((17719 * j) / 50) -
        Math.floor(j / 16) *
        Math.floor((15238 * j) / 43) + 29;

    m = Math.floor((24 * a) / 709);
    const hDay = a - Math.floor((709 * m) / 24);
    const hMonth = m;
    const hYear = 30 * b + j - 30;

    return {
        day: hDay,
        month: hMonth,
        year: hYear,
        monthName: hijriMonths[hMonth - 1]
    };
}

// Update calendar display
function updateCalendar() {
    const now = new Date();
    const hijriDate = gregorianToHijri(now);

    // Update Hijri date
    document.getElementById('hijri-day').textContent = hijriDate.day;
    document.getElementById('hijri-month').textContent = hijriDate.monthName;
    document.getElementById('hijri-year').textContent = `${hijriDate.year} هـ`;

    // Update Gregorian date
    const gDay = now.getDate();
    const gMonth = gregorianMonthsAr[now.getMonth()];
    const gYear = now.getFullYear();
    document.getElementById('gregorian-date').textContent = `${gDay} ${gMonth} ${gYear} م`;

    // Highlight current month in months grid
    highlightCurrentMonth(hijriDate.month);
}

// Highlight current Islamic month
function highlightCurrentMonth(currentMonth) {
    const monthCards = document.querySelectorAll('.month-card');
    monthCards.forEach((card, index) => {
        if (index + 1 === currentMonth) {
            card.classList.add('current-month');
        }
    });
}

// Security: Sanitize text content
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCalendar();

    // Update calendar every hour
    setInterval(updateCalendar, 3600000);
});
