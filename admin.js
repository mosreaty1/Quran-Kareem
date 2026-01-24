// Admin Dashboard Script - Client-Side Version for GitHub Pages
'use strict';

const ADMIN_PASSWORD = 'Quran@Admin2025';

// Login function
function login() {
    const password = document.getElementById('admin-password').value;
    const errorEl = document.getElementById('login-error');

    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_logged_in', 'true');
        errorEl.style.display = 'none';
        showDashboard();
    } else {
        errorEl.style.display = 'block';
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('admin_logged_in');
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('admin-container').style.display = 'none';
    document.getElementById('admin-password').value = '';
}

// Show dashboard
function showDashboard() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('admin-container').style.display = 'block';
    loadVideos();
}

// Toggle video input based on type
function toggleVideoInput() {
    const videoType = document.getElementById('video-type').value;
    const youtubeInput = document.getElementById('youtube-input');
    const urlInput = document.getElementById('url-input');

    if (videoType === 'youtube') {
        youtubeInput.style.display = 'block';
        urlInput.style.display = 'none';
    } else if (videoType === 'url') {
        youtubeInput.style.display = 'none';
        urlInput.style.display = 'block';
    }
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';

    alertContainer.innerHTML = `
        <div class="alert ${alertClass}">
            ${message}
        </div>
    `;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Get videos from localStorage
function getCustomVideos() {
    const videos = localStorage.getItem('custom_videos');
    return videos ? JSON.parse(videos) : [];
}

// Save videos to localStorage
function saveCustomVideos(videos) {
    localStorage.setItem('custom_videos', JSON.stringify(videos));
}

// Sanitize text to prevent XSS
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add new video
function addVideo() {
    const title = document.getElementById('video-title').value.trim();
    const description = document.getElementById('video-description').value.trim();
    const category = document.getElementById('video-category').value;
    const videoType = document.getElementById('video-type').value;
    const youtubeId = document.getElementById('youtube-id').value.trim();
    const videoUrl = document.getElementById('video-url').value.trim();
    const thumbnailUrl = document.getElementById('thumbnail-url').value.trim();

    // Validation
    if (!title) {
        showAlert('الرجاء إدخال عنوان الفيديو', 'error');
        return;
    }

    if (!description) {
        showAlert('الرجاء إدخال وصف الفيديو', 'error');
        return;
    }

    if (videoType === 'youtube' && !youtubeId) {
        showAlert('الرجاء إدخال معرف فيديو YouTube', 'error');
        return;
    }

    if (videoType === 'url' && !videoUrl) {
        showAlert('الرجاء إدخال رابط الفيديو', 'error');
        return;
    }

    // Get existing videos
    const customVideos = getCustomVideos();

    // Generate thumbnail
    let thumbnail = thumbnailUrl;
    if (!thumbnail) {
        if (videoType === 'youtube' && youtubeId) {
            thumbnail = `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`;
        } else {
            // Default thumbnail for external URLs
            thumbnail = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"%3E%3Crect fill="%231e6f4e" width="320" height="180"/%3E%3Ctext fill="white" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E%F0%9F%93%B9 فيديو%3C/text%3E%3C/svg%3E';
        }
    }

    // Create new video object
    const newVideo = {
        id: Date.now(),
        title: sanitizeText(title),
        description: sanitizeText(description),
        category: category,
        type: videoType,
        youtubeId: videoType === 'youtube' ? youtubeId : null,
        videoUrl: videoType === 'url' ? videoUrl : null,
        thumbnail: thumbnail,
        createdAt: new Date().toISOString()
    };

    // Add to array
    customVideos.push(newVideo);

    // Save to localStorage
    saveCustomVideos(customVideos);

    // Clear form
    document.getElementById('video-title').value = '';
    document.getElementById('video-description').value = '';
    document.getElementById('youtube-id').value = '';
    document.getElementById('video-url').value = '';
    document.getElementById('thumbnail-url').value = '';

    // Show success message
    showAlert('تم إضافة الفيديو بنجاح! ✅');

    // Reload videos list
    loadVideos();
}

// Delete video
function deleteVideo(videoId) {
    if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
        return;
    }

    let customVideos = getCustomVideos();
    customVideos = customVideos.filter(video => video.id !== videoId);
    saveCustomVideos(customVideos);

    showAlert('تم حذف الفيديو بنجاح! ✅');
    loadVideos();
}

// Load and display videos
function loadVideos() {
    const customVideos = getCustomVideos();
    const videosListEl = document.getElementById('videos-list');
    const videosCountEl = document.getElementById('videos-count');

    videosCountEl.textContent = customVideos.length;

    if (customVideos.length === 0) {
        videosListEl.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 40px;">لا توجد فيديوهات مضافة بعد</p>';
        return;
    }

    // Sort by creation date (newest first)
    customVideos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    videosListEl.innerHTML = customVideos.map(video => `
        <div class="video-item">
            <img src="${video.thumbnail}" alt="${video.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'120\\' height=\\'68\\' viewBox=\\'0 0 120 68\\'%3E%3Crect fill=\\'%23f0f0f0\\' width=\\'120\\' height=\\'68\\'/%3E%3Ctext fill=\\'%23999\\' font-size=\\'12\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'%3ENo Image%3C/text%3E%3C/svg%3E'">
            <div class="video-info">
                <div class="video-title">${video.title}</div>
                <div class="video-meta">
                    <span style="display: inline-block; padding: 3px 10px; background: var(--primary-color); color: white; border-radius: 6px; font-size: 0.8rem; margin-left: 10px;">
                        ${getCategoryName(video.category)}
                    </span>
                    <span style="color: var(--text-muted);">
                        ${getVideoTypeLabel(video.type)}
                    </span>
                    <span style="margin-right: 15px; color: var(--text-muted);">
                        ${formatDate(video.createdAt)}
                    </span>
                </div>
            </div>
            <button class="btn btn-danger delete-video-btn" data-video-id="${video.id}">حذف</button>
        </div>
    `).join('');

    // Add delete event listeners
    videosListEl.querySelectorAll('.delete-video-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const videoId = parseInt(this.getAttribute('data-video-id'));
            deleteVideo(videoId);
        });
    });
}

// Get category name in Arabic
function getCategoryName(category) {
    const categories = {
        quran: 'القرآن الكريم',
        hadith: 'الحديث الشريف',
        fiqh: 'الفقه',
        seerah: 'السيرة النبوية',
        dua: 'الأدعية'
    };
    return categories[category] || category;
}

// Get video type label
function getVideoTypeLabel(type) {
    const types = {
        youtube: 'YouTube',
        url: 'رابط خارجي'
    };
    return types[type] || type;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ar-EG', options);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    if (isLoggedIn === 'true') {
        showDashboard();
    }

    // Login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Add video button
    const addVideoBtn = document.getElementById('add-video-btn');
    if (addVideoBtn) {
        addVideoBtn.addEventListener('click', addVideo);
    }

    // Video type select
    const videoTypeSelect = document.getElementById('video-type');
    if (videoTypeSelect) {
        videoTypeSelect.addEventListener('change', toggleVideoInput);
    }

    // Allow Enter key to login
    const passwordInput = document.getElementById('admin-password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
});
