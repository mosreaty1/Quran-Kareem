const express = require('express');
const multer = require('multer');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize SQLite database
const db = new Database('quran_videos.db');

// Create videos table
db.exec(`
    CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        type TEXT NOT NULL,
        youtube_id TEXT,
        video_url TEXT,
        video_file TEXT,
        thumbnail TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB max file size
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /mp4|webm|ogg|avi|mov|mkv|jpg|jpeg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only video and image files are allowed!'));
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadsDir));

// ============ API ENDPOINTS ============

// Get all videos
app.get('/api/videos', (req, res) => {
    try {
        const videos = db.prepare('SELECT * FROM videos ORDER BY created_at DESC').all();
        res.json({ success: true, videos });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single video
app.get('/api/videos/:id', (req, res) => {
    try {
        const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(req.params.id);
        if (video) {
            res.json({ success: true, video });
        } else {
            res.status(404).json({ success: false, error: 'Video not found' });
        }
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add new video
app.post('/api/videos', upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 }
]), (req, res) => {
    try {
        const { title, description, category, type, youtubeId, videoUrl } = req.body;

        // Validation
        if (!title || !description || !category || !type) {
            return res.status(400).json({
                success: false,
                error: 'Title, description, category, and type are required'
            });
        }

        let videoFileUrl = null;
        let thumbnailUrl = null;

        // Handle uploaded video file
        if (req.files && req.files.videoFile) {
            videoFileUrl = '/uploads/' + req.files.videoFile[0].filename;
        }

        // Handle uploaded thumbnail
        if (req.files && req.files.thumbnailFile) {
            thumbnailUrl = '/uploads/' + req.files.thumbnailFile[0].filename;
        }

        // Set thumbnail based on type if not uploaded
        if (!thumbnailUrl) {
            if (type === 'youtube' && youtubeId) {
                thumbnailUrl = `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`;
            } else {
                thumbnailUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"%3E%3Crect fill="%23f0f0f0" width="320" height="180"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EVideo%3C/text%3E%3C/svg%3E';
            }
        }

        // Determine final video URL
        let finalVideoUrl = videoFileUrl || videoUrl || null;

        // Insert into database
        const stmt = db.prepare(`
            INSERT INTO videos (title, description, category, type, youtube_id, video_url, video_file, thumbnail)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            title,
            description,
            category,
            type,
            type === 'youtube' ? youtubeId : null,
            finalVideoUrl,
            videoFileUrl,
            thumbnailUrl
        );

        const newVideo = db.prepare('SELECT * FROM videos WHERE id = ?').get(result.lastInsertRowid);

        res.json({
            success: true,
            message: 'Video added successfully',
            video: newVideo
        });

    } catch (error) {
        console.error('Error adding video:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update video
app.put('/api/videos/:id', upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 }
]), (req, res) => {
    try {
        const { title, description, category, type, youtubeId, videoUrl } = req.body;
        const videoId = req.params.id;

        // Check if video exists
        const existingVideo = db.prepare('SELECT * FROM videos WHERE id = ?').get(videoId);
        if (!existingVideo) {
            return res.status(404).json({ success: false, error: 'Video not found' });
        }

        let videoFileUrl = existingVideo.video_file;
        let thumbnailUrl = existingVideo.thumbnail;

        // Handle new uploaded video file
        if (req.files && req.files.videoFile) {
            // Delete old video file if exists
            if (existingVideo.video_file) {
                const oldFilePath = path.join(__dirname, existingVideo.video_file);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            videoFileUrl = '/uploads/' + req.files.videoFile[0].filename;
        }

        // Handle new uploaded thumbnail
        if (req.files && req.files.thumbnailFile) {
            thumbnailUrl = '/uploads/' + req.files.thumbnailFile[0].filename;
        }

        const finalVideoUrl = videoFileUrl || videoUrl || null;

        // Update database
        const stmt = db.prepare(`
            UPDATE videos
            SET title = ?, description = ?, category = ?, type = ?,
                youtube_id = ?, video_url = ?, video_file = ?, thumbnail = ?
            WHERE id = ?
        `);

        stmt.run(
            title || existingVideo.title,
            description || existingVideo.description,
            category || existingVideo.category,
            type || existingVideo.type,
            type === 'youtube' ? youtubeId : null,
            finalVideoUrl,
            videoFileUrl,
            thumbnailUrl,
            videoId
        );

        const updatedVideo = db.prepare('SELECT * FROM videos WHERE id = ?').get(videoId);

        res.json({
            success: true,
            message: 'Video updated successfully',
            video: updatedVideo
        });

    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete video
app.delete('/api/videos/:id', (req, res) => {
    try {
        const videoId = req.params.id;
        const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(videoId);

        if (!video) {
            return res.status(404).json({ success: false, error: 'Video not found' });
        }

        // Delete video file if exists
        if (video.video_file) {
            const filePath = path.join(__dirname, video.video_file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete from database
        db.prepare('DELETE FROM videos WHERE id = ?').run(videoId);

        res.json({
            success: true,
            message: 'Video deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin authentication endpoint (simple password check)
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    const ADMIN_PASSWORD = 'Quran@Admin2025'; // In production, use environment variable

    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, error: 'Invalid password' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Uploads directory: ${uploadsDir}`);
    console.log(`💾 Database: quran_videos.db`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close();
    console.log('\n👋 Server closed');
    process.exit(0);
});
