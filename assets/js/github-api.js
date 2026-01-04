// GitHub API Integration for Dynamic Data Fetching
const GITHUB_USERNAME = 'dmdhrumilmistry';
const GITHUB_API_BASE = 'https://api.github.com';

// Cache management
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const CACHE_KEYS = {
    USER_DATA: 'github_user_data',
    REPOS: 'github_repos',
    STATS: 'github_stats'
};

// Utility: Get data from cache
function getFromCache(key) {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        if (now - timestamp < CACHE_DURATION) {
            return data;
        }
        
        localStorage.removeItem(key);
        return null;
    } catch (error) {
        console.error('Cache read error:', error);
        return null;
    }
}

// Utility: Save data to cache
function saveToCache(key, data) {
    try {
        const cacheObject = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(cacheObject));
    } catch (error) {
        console.error('Cache write error:', error);
    }
}

// Fetch user data from GitHub API
async function fetchUserData() {
    const cached = getFromCache(CACHE_KEYS.USER_DATA);
    if (cached) return cached;
    
    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const data = await response.json();
        saveToCache(CACHE_KEYS.USER_DATA, data);
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

// Fetch repositories from GitHub API
async function fetchRepositories(sort = 'updated', limit = 30) {
    const cached = getFromCache(CACHE_KEYS.REPOS);
    if (cached) return cached;
    
    try {
        const response = await fetch(
            `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=${sort}&per_page=${limit}&type=owner`
        );
        if (!response.ok) throw new Error('Failed to fetch repositories');
        
        const data = await response.json();
        
        // Filter out forks and sort by stars
        const filteredRepos = data
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);
        
        saveToCache(CACHE_KEYS.REPOS, filteredRepos);
        return filteredRepos;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
}

// Get top repositories by stars
async function getTopRepositories(count = 9) {
    try {
        const repos = await fetchRepositories();
        return repos.slice(0, count);
    } catch (error) {
        console.error('Error getting top repositories:', error);
        throw error;
    }
}

// Calculate GitHub stats
async function calculateGitHubStats() {
    const cached = getFromCache(CACHE_KEYS.STATS);
    if (cached) return cached;
    
    try {
        const [userData, repos] = await Promise.all([
            fetchUserData(),
            fetchRepositories('updated', 100)
        ]);
        
        const stats = {
            totalRepos: userData.public_repos,
            totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
            totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
            followers: userData.followers,
            following: userData.following,
            totalWatchers: repos.reduce((sum, repo) => sum + repo.watchers_count, 0),
            languages: {}
        };
        
        // Count languages
        repos.forEach(repo => {
            if (repo.language) {
                stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
            }
        });
        
        saveToCache(CACHE_KEYS.STATS, stats);
        return stats;
    } catch (error) {
        console.error('Error calculating stats:', error);
        throw error;
    }
}

// Format large numbers (e.g., 1000 -> 1K)
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Format date to relative time
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

// Render loading state
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Loading GitHub data...</p>
            </div>
        `;
    }
}

// Render error state
function showError(elementId, message = 'Failed to load data') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="error-message">
                <p>⚠️ ${message}</p>
                <button class="btn-modern btn-outline-gradient" style="margin-top: 1rem;" onclick="location.reload()">
                    Retry
                </button>
            </div>
        `;
    }
}

// Render user stats
async function renderUserStats(elementId) {
    showLoading(elementId);
    
    try {
        const stats = await calculateGitHubStats();
        const userData = await fetchUserData();
        
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.innerHTML = `
            <div class="stats-grid fade-in">
                <div class="stat-card">
                    <div class="stat-number">${formatNumber(stats.totalRepos)}</div>
                    <div class="stat-label">Public Repositories</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${formatNumber(stats.totalStars)}</div>
                    <div class="stat-label">Total Stars</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${formatNumber(stats.totalForks)}</div>
                    <div class="stat-label">Total Forks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${formatNumber(stats.followers)}</div>
                    <div class="stat-label">Followers</div>
                </div>
            </div>
        `;
    } catch (error) {
        showError(elementId, 'Failed to load GitHub stats');
    }
}

// Render top repositories
async function renderTopRepositories(elementId, count = 9) {
    showLoading(elementId);
    
    try {
        const repos = await getTopRepositories(count);
        const element = document.getElementById(elementId);
        if (!element) return;
        
        if (repos.length === 0) {
            element.innerHTML = '<p class="text-center">No repositories found.</p>';
            return;
        }
        
        const reposHTML = repos.map(repo => `
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-card">
                <div class="repo-header">
                    <div class="repo-icon">📦</div>
                    <h3 class="repo-title">${repo.name}</h3>
                </div>
                <p class="repo-description">
                    ${repo.description || 'No description available'}
                </p>
                <div class="repo-stats">
                    <div class="repo-stat">
                        <span>⭐</span>
                        <span>${repo.stargazers_count}</span>
                    </div>
                    <div class="repo-stat">
                        <span>🔱</span>
                        <span>${repo.forks_count}</span>
                    </div>
                    <div class="repo-stat">
                        <span>👁️</span>
                        <span>${repo.watchers_count}</span>
                    </div>
                </div>
                ${repo.language ? `<span class="repo-language">${repo.language}</span>` : ''}
            </a>
        `).join('');
        
        element.innerHTML = `<div class="repos-grid fade-in">${reposHTML}</div>`;
    } catch (error) {
        showError(elementId, 'Failed to load repositories');
    }
}

// Render featured repository (single repo showcase)
async function renderFeaturedRepo(elementId, repoName) {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}`);
        if (!response.ok) throw new Error('Failed to fetch repository');
        
        const repo = await response.json();
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.innerHTML = `
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="glass-card">
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">${repo.name}</h3>
                <p style="opacity: 0.9; margin-bottom: 1.5rem;">
                    ${repo.description || 'No description available'}
                </p>
                <div class="repo-stats" style="justify-content: center;">
                    <div class="repo-stat">
                        <span>⭐</span>
                        <span>${repo.stargazers_count}</span>
                    </div>
                    <div class="repo-stat">
                        <span>🔱</span>
                        <span>${repo.forks_count}</span>
                    </div>
                    <div class="repo-stat">
                        <span>👁️</span>
                        <span>${repo.watchers_count}</span>
                    </div>
                </div>
                ${repo.language ? `<span class="repo-language" style="margin-top: 1rem;">${repo.language}</span>` : ''}
            </a>
        `;
    } catch (error) {
        console.error('Error rendering featured repo:', error);
    }
}

// Initialize navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.modern-navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize AOS (Animate On Scroll) if available
function initAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// Initialize all features
function initializeApp() {
    initNavbarScroll();
    initAnimations();
    updateCopyrightYear();
}

// Update copyright year dynamically
function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const footerTexts = document.querySelectorAll('.footer-text');
    footerTexts.forEach(footerText => {
        if (footerText.textContent.includes('©')) {
            // Replace only the year in the copyright text using regex
            footerText.textContent = footerText.textContent.replace(/©\s*\d{4}/, `© ${currentYear}`);
        }
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export functions for use in HTML
window.GitHubAPI = {
    fetchUserData,
    fetchRepositories,
    getTopRepositories,
    calculateGitHubStats,
    renderUserStats,
    renderTopRepositories,
    renderFeaturedRepo,
    formatNumber,
    formatDate
};
