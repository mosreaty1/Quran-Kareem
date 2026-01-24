// Islamic Videos Script
'use strict';

// Video data (curated Islamic educational content)
const videos = [
    {
        id: 1,
        title: 'سورة البقرة كاملة - مشاري العفاسي',
        description: 'تلاوة خاشعة لسورة البقرة كاملة بصوت الشيخ مشاري راشد العفاسي',
        category: 'quran',
        youtubeId: '5-UJPdAebF8',
        thumbnail: 'https://i.ytimg.com/vi/5-UJPdAebF8/mqdefault.jpg'
    },
    {
        id: 2,
        title: 'سورة الكهف كاملة - عبد الرحمن السديس',
        description: 'تلاوة مؤثرة لسورة الكهف من الحرم المكي',
        category: 'quran',
        youtubeId: 'dGu0iT-kjEE',
        thumbnail: 'https://i.ytimg.com/vi/dGu0iT-kjEE/mqdefault.jpg'
    },
    {
        id: 3,
        title: 'سورة الرحمن - ماهر المعيقلي',
        description: 'تلاوة جميلة لسورة الرحمن بصوت الشيخ ماهر المعيقلي',
        category: 'quran',
        youtubeId: 'qLu1VGIvUZs',
        thumbnail: 'https://i.ytimg.com/vi/qLu1VGIvUZs/mqdefault.jpg'
    },
    {
        id: 4,
        title: 'سورة يس كاملة - عبد الباسط',
        description: 'تلاوة مؤثرة لسورة يس بصوت الشيخ عبد الباسط عبد الصمد',
        category: 'quran',
        youtubeId: 'qm9_K3Cfdtw',
        thumbnail: 'https://i.ytimg.com/vi/qm9_K3Cfdtw/mqdefault.jpg'
    },
    {
        id: 5,
        title: 'سورة الملك كاملة - مشاري العفاسي',
        description: 'تلاوة مباركة لسورة الملك المنجية من عذاب القبر',
        category: 'quran',
        youtubeId: 'cHHSNHLbJ0Q',
        thumbnail: 'https://i.ytimg.com/vi/cHHSNHLbJ0Q/mqdefault.jpg'
    },
    {
        id: 6,
        title: 'آية الكرسي مكررة - للحفظ',
        description: 'آية الكرسي مكررة بصوت جميل للحفظ والاستماع',
        category: 'quran',
        youtubeId: 'DBuUTNDE4I4',
        thumbnail: 'https://i.ytimg.com/vi/DBuUTNDE4I4/mqdefault.jpg'
    },
    {
        id: 7,
        title: 'أذكار الصباح والمساء',
        description: 'أذكار الصباح والمساء مع الدعاء والتسبيح',
        category: 'dua',
        youtubeId: 'mBxSE73-7ZY',
        thumbnail: 'https://i.ytimg.com/vi/mBxSE73-7ZY/mqdefault.jpg'
    },
    {
        id: 8,
        title: 'رقية شرعية شاملة',
        description: 'الرقية الشرعية الشاملة من القرآن والسنة',
        category: 'dua',
        youtubeId: 'bW62wHpVGW4',
        thumbnail: 'https://i.ytimg.com/vi/bW62wHpVGW4/mqdefault.jpg'
    },
    {
        id: 9,
        title: 'دعاء ختم القرآن',
        description: 'دعاء ختم القرآن الكريم كاملاً',
        category: 'dua',
        youtubeId: 'HBf0lpZwztQ',
        thumbnail: 'https://i.ytimg.com/vi/HBf0lpZwztQ/mqdefault.jpg'
    },
    {
        id: 10,
        title: 'كيفية الصلاة الصحيحة',
        description: 'تعليم الصلاة من التكبير إلى التسليم بطريقة مبسطة',
        category: 'fiqh',
        youtubeId: 'T4auGhmeBlw',
        thumbnail: 'https://i.ytimg.com/vi/T4auGhmeBlw/mqdefault.jpg'
    },
    {
        id: 11,
        title: 'تعليم الوضوء الصحيح',
        description: 'الطريقة الصحيحة للوضوء خطوة بخطوة',
        category: 'fiqh',
        youtubeId: 'tT_nvWreehg',
        thumbnail: 'https://i.ytimg.com/vi/tT_nvWreehg/mqdefault.jpg'
    },
    {
        id: 12,
        title: 'أحكام الصلاة المبسطة',
        description: 'شرح مبسط لأحكام الصلاة',
        category: 'fiqh',
        youtubeId: 'KZ8Ix7cH5l0',
        thumbnail: 'https://i.ytimg.com/vi/KZ8Ix7cH5l0/mqdefault.jpg'
    },
    {
        id: 13,
        title: 'السيرة النبوية - المولد الشريف',
        description: 'قصة مولد النبي محمد صلى الله عليه وسلم',
        category: 'seerah',
        youtubeId: 'DvCvKM8vC_E',
        thumbnail: 'https://i.ytimg.com/vi/DvCvKM8vC_E/mqdefault.jpg'
    },
    {
        id: 14,
        title: 'الإسراء والمعراج',
        description: 'رحلة الإسراء والمعراج المباركة',
        category: 'seerah',
        youtubeId: '8g9gFXR-qVY',
        thumbnail: 'https://i.ytimg.com/vi/8g9gFXR-qVY/mqdefault.jpg'
    },
    {
        id: 15,
        title: 'الأربعون النووية',
        description: 'شرح الأحاديث الأربعين النووية',
        category: 'hadith',
        youtubeId: 'jBzZ1PqXe14',
        thumbnail: 'https://i.ytimg.com/vi/jBzZ1PqXe14/mqdefault.jpg'
    }
];

// DOM Elements
const videosGrid = document.getElementById('videos-grid');
const videoModal = document.getElementById('video-modal');
const closeModal = document.getElementById('close-modal');
const modalOverlay = document.querySelector('.modal-overlay');
const videoPlayer = document.getElementById('video-player');
const videoTitle = document.getElementById('video-title');
const videoDescription = document.getElementById('video-description');
const categoryBtns = document.querySelectorAll('.category-btn');
const shareBtns = document.querySelectorAll('.share-btn');

let currentVideo = null;
let currentCategory = 'all';
let allVideos = [];

// Get custom videos from localStorage
function getCustomVideos() {
    const storedVideos = localStorage.getItem('custom_videos');
    return storedVideos ? JSON.parse(storedVideos) : [];
}

// Merge custom videos with default YouTube videos
function getAllVideos() {
    const customVideos = getCustomVideos();

    // Convert custom videos to same format
    const formattedCustomVideos = customVideos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        category: video.category,
        youtubeId: video.type === 'youtube' ? video.youtubeId : null,
        videoUrl: video.type === 'url' ? video.videoUrl : null,
        thumbnail: video.thumbnail,
        isCustom: true,
        type: video.type
    }));

    // Combine custom videos (shown first) with default YouTube videos
    return [...formattedCustomVideos, ...videos];
}

// Security: Sanitize text content
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Render videos
function renderVideos(category = 'all') {
    videosGrid.innerHTML = '';

    // Get all videos (custom + YouTube)
    allVideos = getAllVideos();

    const filteredVideos = category === 'all'
        ? allVideos
        : allVideos.filter(video => video.category === category);

    if (filteredVideos.length === 0) {
        videosGrid.innerHTML = '<p class="no-videos">لا توجد فيديوهات في هذا القسم حالياً</p>';
        return;
    }

    filteredVideos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${sanitizeText(video.title)}" loading="lazy">
                <div class="play-overlay">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            </div>
            <div class="video-card-info">
                <h3 class="video-card-title">${sanitizeText(video.title)}</h3>
                <p class="video-card-description">${sanitizeText(video.description)}</p>
                <div class="video-card-actions">
                    <button class="watch-btn" data-video-id="${video.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        مشاهدة
                    </button>
                    <button class="share-quick-btn" data-video-id="${video.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                        </svg>
                        مشاركة
                    </button>
                </div>
            </div>
        `;
        videosGrid.appendChild(videoCard);
    });

    // Add event listeners to watch buttons
    document.querySelectorAll('.watch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const videoId = parseInt(btn.dataset.videoId);
            openVideoModal(videoId);
        });
    });

    // Add event listeners to share buttons
    document.querySelectorAll('.share-quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const videoId = parseInt(btn.dataset.videoId);
            openVideoModal(videoId);
        });
    });
}

// Open video modal
function openVideoModal(videoId) {
    currentVideo = allVideos.find(v => v.id === videoId);
    if (!currentVideo) return;

    // Set video info
    videoTitle.textContent = currentVideo.title;
    videoDescription.textContent = currentVideo.description;

    // Create video player based on type
    if (currentVideo.type === 'url' || currentVideo.videoUrl) {
        // Direct video URL - use HTML5 video player
        videoPlayer.innerHTML = `
            <video controls style="width: 100%; height: 100%; background: #000;" preload="metadata">
                <source src="${currentVideo.videoUrl}" type="video/mp4">
                <source src="${currentVideo.videoUrl}" type="video/webm">
                المتصفح لا يدعم تشغيل الفيديو
            </video>
        `;
    } else {
        // YouTube video - use iframe (privacy-enhanced mode) with fallback
        const youtubeUrl = `https://www.youtube.com/watch?v=${currentVideo.youtubeId}`;
        videoPlayer.innerHTML = `
            <iframe
                src="https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?rel=0&modestbranding=1"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                loading="lazy"
            ></iframe>
            <div style="text-align: center; padding: 15px; background: rgba(0,0,0,0.7); position: absolute; bottom: 0; left: 0; right: 0;">
                <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer"
                   style="color: #fff; text-decoration: none; display: inline-flex; align-items: center; gap: 10px; padding: 10px 20px; background: #FF0000; border-radius: 8px; font-weight: 600;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    إذا لم يعمل الفيديو، شاهده على YouTube
                </a>
            </div>
        `;
    }

    // Show modal
    videoModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close video modal
function closeVideoModal() {
    videoModal.style.display = 'none';
    videoPlayer.innerHTML = '';
    currentVideo = null;
    document.body.style.overflow = '';
}

// Category filter
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        renderVideos(currentCategory);
    });
});

// Share functionality
shareBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!currentVideo) return;

        const shareType = btn.dataset.share;
        // Use YouTube URL if available, otherwise use current page URL
        const videoUrl = currentVideo.youtubeId
            ? `https://www.youtube.com/watch?v=${currentVideo.youtubeId}`
            : window.location.href;
        const shareText = `${currentVideo.title} - ${currentVideo.description}`;

        switch (shareType) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + videoUrl)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(videoUrl)}`, '_blank');
                break;
            case 'telegram':
                window.open(`https://t.me/share/url?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(videoUrl).then(() => {
                    btn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        تم النسخ
                    `;
                    setTimeout(() => {
                        btn.innerHTML = `
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                            </svg>
                            نسخ الرابط
                        `;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
                break;
        }
    });
});

// Modal close events
closeModal.addEventListener('click', closeVideoModal);
modalOverlay.addEventListener('click', closeVideoModal);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.style.display === 'flex') {
        closeVideoModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderVideos();
});
