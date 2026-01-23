// Islamic Videos Script
'use strict';

// Video data (curated Islamic educational content)
const videos = [
    {
        id: 1,
        title: 'أذكار الصباح والمساء',
        description: 'تعلم الأذكار اليومية التي تحفظك بإذن الله',
        category: 'dua',
        youtubeId: 'hbPs67zaOCk',
        thumbnail: 'https://i.ytimg.com/vi/hbPs67zaOCk/mqdefault.jpg'
    },
    {
        id: 2,
        title: 'تلاوة خاشعة من سورة البقرة',
        description: 'تلاوة مؤثرة من سورة البقرة بصوت جميل',
        category: 'quran',
        youtubeId: 'THWPkZ5Yq38',
        thumbnail: 'https://i.ytimg.com/vi/THWPkZ5Yq38/mqdefault.jpg'
    },
    {
        id: 3,
        title: 'أحاديث نبوية شريفة',
        description: 'شرح لبعض الأحاديث النبوية المهمة',
        category: 'hadith',
        youtubeId: '8wphBPJWb0c',
        thumbnail: 'https://i.ytimg.com/vi/8wphBPJWb0c/mqdefault.jpg'
    },
    {
        id: 4,
        title: 'كيفية الوضوء الصحيح',
        description: 'تعليم الوضوء بالطريقة الصحيحة',
        category: 'fiqh',
        youtubeId: 'exQEjdPHdZY',
        thumbnail: 'https://i.ytimg.com/vi/exQEjdPHdZY/mqdefault.jpg'
    },
    {
        id: 5,
        title: 'السيرة النبوية - ولادة النبي ﷺ',
        description: 'قصة ولادة النبي محمد صلى الله عليه وسلم',
        category: 'seerah',
        youtubeId: 'WuwGfAq3O3g',
        thumbnail: 'https://i.ytimg.com/vi/WuwGfAq3O3g/mqdefault.jpg'
    },
    {
        id: 6,
        title: 'تلاوة سورة يس كاملة',
        description: 'تلاوة هادئة ومؤثرة لسورة يس',
        category: 'quran',
        youtubeId: 'S_TtkxTBq-U',
        thumbnail: 'https://i.ytimg.com/vi/S_TtkxTBq-U/mqdefault.jpg'
    },
    {
        id: 7,
        title: 'دعاء القنوت',
        description: 'تعليم دعاء القنوت في صلاة الوتر',
        category: 'dua',
        youtubeId: 'SdbfHEaXRi0',
        thumbnail: 'https://i.ytimg.com/vi/SdbfHEaXRi0/mqdefault.jpg'
    },
    {
        id: 8,
        title: 'أحكام الصلاة',
        description: 'شرح مبسط لأحكام الصلاة',
        category: 'fiqh',
        youtubeId: 'I206g5q0D5s',
        thumbnail: 'https://i.ytimg.com/vi/I206g5q0D5s/mqdefault.jpg'
    },
    {
        id: 9,
        title: 'غزوة بدر الكبرى',
        description: 'قصة غزوة بدر الكبرى وأحداثها',
        category: 'seerah',
        youtubeId: 'bx5UqfPbp9A',
        thumbnail: 'https://i.ytimg.com/vi/bx5UqfPbp9A/mqdefault.jpg'
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

// Security: Sanitize text content
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Render videos
function renderVideos(category = 'all') {
    videosGrid.innerHTML = '';

    const filteredVideos = category === 'all'
        ? videos
        : videos.filter(video => video.category === category);

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
    currentVideo = videos.find(v => v.id === videoId);
    if (!currentVideo) return;

    // Set video info
    videoTitle.textContent = currentVideo.title;
    videoDescription.textContent = currentVideo.description;

    // Create YouTube iframe (privacy-enhanced mode)
    videoPlayer.innerHTML = `
        <iframe
            src="https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?rel=0&modestbranding=1"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
        ></iframe>
    `;

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
        const videoUrl = `https://www.youtube.com/watch?v=${currentVideo.youtubeId}`;
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
