# dmdhrumilmistry.github.io

Modern static personal portfolio website with dynamic GitHub integration, showcasing projects, skills, and professional information.

## ✨ Features

- **Modern UI Design**: Beautiful gradient backgrounds, glassmorphism effects, and smooth animations
- **Dynamic GitHub Integration**: Automatically fetches and displays:
  - Top repositories by stars
  - GitHub statistics (repos, stars, forks, followers)
  - Repository details (description, language, stats)
- **Fully Static**: No backend required, runs entirely on GitHub Pages
- **Responsive Design**: Optimized for all devices (desktop, tablet, mobile)
- **Performance Optimized**: 
  - Client-side caching (1-hour cache duration)
  - Lazy loading of external resources
  - Minimal dependencies

## 🚀 Pages

1. **Home** (`index.html`): Hero section with introduction, GitHub stats, and featured projects
2. **Projects** (`projects.html`): Dynamically loaded repository cards with filtering
3. **About** (`aboutme.html`): Professional information, skills, certifications, and contact details

## 🔧 Technologies Used

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with modern features (CSS Grid, Flexbox, CSS Variables)
- **Animations**: AOS (Animate On Scroll) library
- **Icons**: Font Awesome 6
- **Fonts**: Inter (Google Fonts)
- **APIs**: GitHub REST API v3

## 📦 Dynamic Features

### GitHub API Integration

The website uses the GitHub API to fetch real-time data:

```javascript
// Fetch user data
const userData = await fetch('https://api.github.com/users/dmdhrumilmistry');

// Fetch repositories
const repos = await fetch('https://api.github.com/users/dmdhrumilmistry/repos?sort=updated&per_page=30');
```

### Caching Strategy

- All GitHub API responses are cached in `localStorage` for 1 hour
- Reduces API calls and improves load times
- Automatic cache invalidation after expiry

## 🎨 Design Highlights

- **Color Scheme**: Purple and blue gradients with dark theme
- **Effects**:
  - Glassmorphism cards with backdrop blur
  - Floating animations on hero avatar
  - Smooth hover transitions
  - Gradient text effects
- **Typography**: Inter font family for clean, modern look

## 🌐 Hosting

This website is hosted on GitHub Pages and accessible at:
- Custom domain: [dmdhrumilmistry.rest](https://dmdhrumilmistry.rest)
- GitHub domain: [dmdhrumilmistry.github.io](https://dmdhrumilmistry.github.io)

## 📝 Local Development

1. Clone the repository:
```bash
git clone https://github.com/dmdhrumilmistry/dmdhrumilmistry.github.io.git
cd dmdhrumilmistry.github.io
```

2. Start a local server:
```bash
# Using Python
python3 -m http.server 8000

# Or using Node.js
npx http-server
```

3. Open your browser and navigate to `http://localhost:8000`

## 🔄 Updating Content

The website automatically updates content from GitHub, but you can customize:

1. **Personal Information**: Edit the HTML files directly
2. **Skills**: Modify the skills section in `index.html` and `aboutme.html`
3. **Styling**: Update `assets/css/modern-style.css`
4. **API Configuration**: Change username in `assets/js/github-api.js`:
```javascript
const GITHUB_USERNAME = 'dmdhrumilmistry';
```

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

[MIT License](https://github.com/dmdhrumilmistry/dmdhrumilmistry.github.io/blob/main/LICENSE)

## 👤 Author

**Dhrumil Mistry**
- GitHub: [@dmdhrumilmistry](https://github.com/dmdhrumilmistry)
- LinkedIn: [Dhrumil Mistry](https://www.linkedin.com/in/dhrumil-m-312966192/)
- Website: [dmdhrumilmistry.rest](https://dmdhrumilmistry.rest)

---

⭐ Star this repository if you find it helpful!
