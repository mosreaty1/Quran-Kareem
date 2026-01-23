# القرآن الكريم - Quran Kareem Website

A professional, modern Quran website where users can listen to complete Surahs as single, uninterrupted audio files from multiple renowned reciters.

## ✨ Features

- 🎧 **Complete Surah Audio** - Each Surah plays as ONE complete audio file with NO breaks
- 📖 **All 114 Surahs** - Full Quran with 9 renowned Qurra (reciters)
- 🎵 **Professional Audio Player** - Elegant player with play/pause and progress controls
- 📊 **Real-time Progress** - Track playback progress with percentage indicator
- 🎨 **Modern Professional Design** - Clean, minimalist UI with sophisticated styling
- 📱 **Fully Responsive** - Perfect experience on desktop, tablet, and mobile devices
- ⌨️ **Keyboard Shortcuts** - Space bar to play/pause
- 🌙 **Premium Aesthetics** - Smooth animations and professional color scheme
- 🔊 **High-Quality Audio** - Crystal clear audio from QuranicAudio.com
- ⚡ **Fast & Lightweight** - No dependencies, pure HTML/CSS/JavaScript

## 🎤 Available Reciters

1. **مشاري العفاسي** - Mishary Rashid Alafasy
2. **عبد الباسط عبد الصمد** - Abdul Basit Abdus Samad (Murattal)
3. **عبد الله بصفر** - Abdullah Basfar
4. **عبد الرحمن السديس** - Abdurrahman As-Sudais
5. **أبو بكر الشاطري** - Abu Bakr Al-Shatri
6. **محمود خليل الحصري** - Mahmoud Khalil Al-Hussary
7. **محمد صديق المنشاوي** - Mohamed Siddiq Al-Minshawi
8. **محمد أيوب** - Muhammad Ayyoub
9. **علي حجاج السويسي** - Ali Hajjaj Alsouasi

## 🚀 Live Demo

Simply open `index.html` in any modern web browser to use the website.

## 📦 Installation & Deployment

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/Quran-Kareem.git
   cd Quran-Kareem
   ```

2. **Open in browser:**
   - Simply open `index.html` in your web browser
   - No build process or dependencies required!

### Deploy to GitHub Pages

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit: Complete Quran website"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to "Pages" section
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be live at: `https://yourusername.github.io/Quran-Kareem/`

### Deploy to Netlify

1. **Push to GitHub** (as above)

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://www.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your repository
   - Click "Deploy site"
   - Your site will be live with a custom URL!

### Deploy to Vercel

1. **Push to GitHub** (as above)

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"
   - Your site will be live instantly!

## 🛠️ Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Styling, animations, and responsive design
- **JavaScript (Vanilla)** - Interactive functionality
- **Al-Quran Cloud API** - Quran text and audio data
- **Google Fonts** - Amiri and Cairo Arabic fonts

## 📡 API Information

This project uses multiple free APIs:

**Al-Quran Cloud API** for Surah metadata:
- **API Base URL:** `https://api.alquran.cloud/v1`
- **No API Key Required** - Completely free to use
- **Endpoints Used:**
  - `/surah` - Get list of all Surahs
  - `/surah/{number}` - Get Surah metadata

**QuranicAudio.com** for complete Surah audio files:
- **Audio Base URL:** `https://download.quranicaudio.com/quran`
- **High-Quality Audio** - Complete Surah MP3 files (128-192 kbps)
- **No API Key Required** - Direct MP3 downloads

## ⌨️ Keyboard Shortcuts

- **Space** - Play/Pause audio
- **K** - Play/Pause audio (alternative)

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## 📂 Project Structure

```
Quran-Kareem/
│
├── server.js              # Backend server (Node.js + Express)
├── package.json           # npm dependencies
├── .gitignore            # Git ignore file
├── quran_videos.db       # SQLite database (auto-created)
├── uploads/              # Uploaded video files directory
├── index.html            # Main Quran player page
├── admin.html            # Admin dashboard
├── islamic-videos.html   # Islamic videos library
├── prayer-times.html     # Prayer times page
├── asma-ul-husna.html    # 99 Names of Allah
├── tasbih.html          # Digital Tasbih counter
├── hijri-calendar.html   # Hijri calendar page
├── styles.css           # Main CSS file
├── admin.js             # Admin dashboard logic
├── islamic-videos.js    # Videos page logic
├── visitor-counter.js   # Visitor tracking
└── README.md            # Documentation
```

## 🎥 Backend & Video Management

This project includes a **Node.js backend** with **SQLite database** for managing Islamic videos and visitor tracking.

### Backend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Server will run on:** `http://localhost:3000`

### Admin Dashboard

Access the admin panel at: `http://localhost:3000/admin.html`

**Default Password:** `Quran@Admin2025`

### Adding Videos

The admin dashboard supports three types of videos:

#### 1. YouTube Videos
- Select "YouTube Video"
- Enter the video ID (the part after `watch?v=`)
- Example: For `https://www.youtube.com/watch?v=ABC123`, enter `ABC123`

#### 2. External Video URLs
- Select "External Video URL"
- Paste direct video URL (MP4, WebM, etc.)
- Example: `https://example.com/video.mp4`

#### 3. Upload Video Files
- Select "Upload Video File"
- Choose video file from your computer
- Supported formats: MP4, WebM, MOV, AVI, MKV
- Maximum file size: 500MB

### API Endpoints

#### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get single video
- `POST /api/videos` - Add new video (multipart/form-data)
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

#### Admin
- `POST /api/admin/login` - Admin authentication

### Database Schema

**videos table:**
```sql
- id (INTEGER PRIMARY KEY)
- title (TEXT) - Video title
- description (TEXT) - Video description
- category (TEXT) - quran/hadith/fiqh/seerah/dua
- type (TEXT) - youtube/url/upload
- youtube_id (TEXT) - YouTube video ID
- video_url (TEXT) - Direct video URL
- video_file (TEXT) - Uploaded file path
- thumbnail (TEXT) - Thumbnail URL
- created_at (DATETIME) - Creation timestamp
```

### Technologies

**Backend:**
- Express.js - Web framework
- better-sqlite3 - SQLite database
- Multer - File upload handling
- CORS - Cross-origin resource sharing

**Frontend:**
- Fetch API - HTTP requests
- FormData - File uploads
- localStorage/sessionStorage - Client-side storage

### Security

- Password authentication for admin panel
- File type validation (videos and images only)
- File size limits (500MB max)
- XSS prevention through text sanitization
- CORS enabled for local development

### Changing Admin Password

Edit `server.js`:
```javascript
const ADMIN_PASSWORD = 'YourNewPassword';
```

Or use environment variables (create `.env` file):
```
ADMIN_PASSWORD=YourNewPassword
```

Then update `server.js`:
```javascript
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Quran@Admin2025';
```

## 🎯 Features in Detail

### Complete Surah Audio Files
- Each Surah is played as ONE single audio file
- No breaks, cuts, or transitions between ayahs
- Completely uninterrupted listening experience
- High-quality audio (128-192 kbps MP3)
- Real-time progress tracking with percentage indicator

### Professional Audio Player
- Large, elegant play/pause button
- Smooth progress bar with seek functionality
- Time display showing current time and total duration
- Visual indicator of current ayah being recited
- Completion notification when Surah finishes

### Surah Browser
- Dropdown to select from all 114 Surahs
- Shows Surah name in Arabic and English
- Displays number of ayahs and revelation type (Meccan/Medinan)
- Instant loading and playback

### Reciter Selection
- Choose from 9 famous Quran reciters
- Seamless switching between reciters
- High-quality audio for each reciter
- Maintains playback position when switching

### Modern Professional Design
- Clean, minimalist interface
- Professional color scheme (green tones)
- Smooth animations and transitions
- Focus on listening experience
- Distraction-free design

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Al-Quran Cloud** for providing the free API
- **Google Fonts** for the beautiful Arabic fonts
- All the Qurra (reciters) for their beautiful recitations

## 👨‍💻 Developer

**Developed by Mohamed Alsariti**

### 📧 Contact & Social Links

- 🌐 **Website:** [Sariti.tech](https://sariti.tech)
- 📘 **Facebook:** [Mohamed Alsariti](https://www.facebook.com/mohamed.el.seraty.2025)
- 💬 **WhatsApp:** [+201558282586](https://wa.me/201558282586)
- 🐛 **Issues:** Open an issue on GitHub for bug reports and feature requests

---

**Made with ❤️ for the Muslim Ummah**

بارك الله فيكم - May Allah bless you
