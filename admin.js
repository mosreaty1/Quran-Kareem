// Admin Dashboard Script - Backend Version
'use strict';

const API_URL = 'http://localhost:3000/api';

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
});

// Login function
async function login() {
    const password = document.getElementById('admin-password').value;
    const errorEl = document.getElementById('login-error');

    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (data.success) {
            sessionStorage.setItem('admin_logged_in', 'true');
            errorEl.style.display = 'none';
            showDashboard();
        } else {
            errorEl.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('خطأ في الاتصال بالخادم', 'error');
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
    const fileInput = document.getElementById('file-input');

    if (videoType === 'youtube') {
        youtubeInput.style.display = 'block';
        urlInput.style.display = 'none';
        fileInput.style.display = 'none';
    } else if (videoType === 'url') {
        youtubeInput.style.display = 'none';
        urlInput.style.display = 'block';
        fileInput.style.display = 'none';
    } else if (videoType === 'upload') {
        youtubeInput.style.display = 'none';
        urlInput.style.display = 'none';
        fileInput.style.display = 'block';
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

// Add new video
async function addVideo() {
    const title = document.getElementById('video-title').value.trim();
    const description = document.getElementById('video-description').value.trim();
    const category = document.getElementById('video-category').value;
    const videoType = document.getElementById('video-type').value;
    const youtubeId = document.getElementById('youtube-id').value.trim();
    const videoUrl = document.getElementById('video-url').value.trim();
    const videoFile = document.getElementById('video-file').files[0];
    const thumbnailFile = document.getElementById('thumbnail-file').files[0];

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

    if (videoType === 'upload' && !videoFile) {
        showAlert('الرجاء اختيار ملف فيديو', 'error');
        return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('type', videoType);

    if (videoType === 'youtube') {
        formData.append('youtubeId', youtubeId);
    } else if (videoType === 'url') {
        formData.append('videoUrl', videoUrl);
    } else if (videoType === 'upload' && videoFile) {
        formData.append('videoFile', videoFile);
    }

    if (thumbnailFile) {
        formData.append('thumbnailFile', thumbnailFile);
    }

    try {
        // Show loading
        showAlert('جاري رفع الفيديو...', 'success');

        const response = await fetch(`${API_URL}/videos`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Clear form
            document.getElementById('video-title').value = '';
            document.getElementById('video-description').value = '';
            document.getElementById('youtube-id').value = '';
            document.getElementById('video-url').value = '';
            document.getElementById('video-file').value = '';
            document.getElementById('thumbnail-file').value = '';

            // Show success message
            showAlert('تم إضافة الفيديو بنجاح!');

            // Reload videos list
            loadVideos();
        } else {
            showAlert(data.error || 'حدث خطأ أثناء إضافة الفيديو', 'error');
        }
    } catch (error) {
        console.error('Error adding video:', error);
        showAlert('خطأ في الاتصال بالخادم', 'error');
    }
}

// Delete video
async function deleteVideo(videoId) {
    if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/videos/${videoId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showAlert('تم حذف الفيديو بنجاح!');
            loadVideos();
        } else {
            showAlert(data.error || 'حدث خطأ أثناء حذف الفيديو', 'error');
        }
    } catch (error) {
        console.error('Error deleting video:', error);
        showAlert('خطأ في الاتصال بالخادم', 'error');
    }
}

// Load and display videos
async function loadVideos() {
    try {
        const response = await fetch(`${API_URL}/videos`);
        const data = await response.json();

        const videosListEl = document.getElementById('videos-list');
        const videosCountEl = document.getElementById('videos-count');

        if (!data.success) {
            showAlert('خطأ في تحميل الفيديوهات', 'error');
            return;
        }

        const videos = data.videos;
        videosCountEl.textContent = videos.length;

        if (videos.length === 0) {
            videosListEl.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 40px;">لا توجد فيديوهات مضافة بعد</p>';
            return;
        }

        videosListEl.innerHTML = videos.map(video => `
            <div class="video-item">
                <img src="${video.thumbnail}" alt="${video.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'120\\' height=\\'68\\' viewBox=\\'0 0 120 68\\'%3E%3Crect fill=\\'%23f0f0f0\\' width=\\'120\\' height=\\'68\\'/%3E%3Ctext fill=\\'%23999\\' font-size=\\'12\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'%3ENo Image%3C/text%3E%3C/svg%3E'">
                <div class="video-info">
                    <div class="video-title">${escapeHtml(video.title)}</div>
                    <div class="video-meta">
                        <span style="display: inline-block; padding: 3px 10px; background: var(--primary-color); color: white; border-radius: 6px; font-size: 0.8rem; margin-left: 10px;">
                            ${getCategoryName(video.category)}
                        </span>
                        <span style="color: var(--text-muted);">
                            ${getVideoTypeLabel(video.type)}
                        </span>
                        <span style="margin-right: 15px; color: var(--text-muted);">
                            ${formatDate(video.created_at)}
                        </span>
                    </div>
                </div>
                <button onclick="deleteVideo(${video.id})" class="btn btn-danger">حذف</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading videos:', error);
        showAlert('خطأ في الاتصال بالخادم', 'error');
    }
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
        url: 'رابط خارجي',
        upload: 'ملف مرفوع'
    };
    return types[type] || type;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ar-EG', options);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Allow Enter key to login
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.getElementById('login-container').style.display !== 'none') {
        login();
    }
});
