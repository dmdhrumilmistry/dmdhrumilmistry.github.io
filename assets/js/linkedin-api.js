// LinkedIn Data Integration for Dynamic Portfolio Updates
// Note: LinkedIn doesn't provide public API access. This uses a local JSON file
// that can be manually updated or populated via a backend service.

const LINKEDIN_DATA_URL = 'assets/data/linkedin-data.json';

// Cache management
const LINKEDIN_CACHE_DURATION = 3600000; // 1 hour in milliseconds
const LINKEDIN_CACHE_KEY = 'linkedin_profile_data';

// Utility: Get LinkedIn data from cache
function getLinkedInFromCache() {
    try {
        const cached = localStorage.getItem(LINKEDIN_CACHE_KEY);
        if (!cached) return null;
        
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        if (now - timestamp < LINKEDIN_CACHE_DURATION) {
            return data;
        }
        
        localStorage.removeItem(LINKEDIN_CACHE_KEY);
        return null;
    } catch (error) {
        console.error('LinkedIn cache read error:', error);
        return null;
    }
}

// Utility: Save LinkedIn data to cache
function saveLinkedInToCache(data) {
    try {
        const cacheObject = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(LINKEDIN_CACHE_KEY, JSON.stringify(cacheObject));
    } catch (error) {
        console.error('LinkedIn cache write error:', error);
    }
}

// Fetch LinkedIn data
async function fetchLinkedInData() {
    const cached = getLinkedInFromCache();
    if (cached) return cached;
    
    try {
        const response = await fetch(LINKEDIN_DATA_URL);
        if (!response.ok) throw new Error('Failed to fetch LinkedIn data');
        
        const data = await response.json();
        saveLinkedInToCache(data);
        return data;
    } catch (error) {
        console.error('Error fetching LinkedIn data:', error);
        throw error;
    }
}

// Format date for display
function formatDateRange(startDate, endDate, current) {
    const formatMonthYear = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    };
    
    const start = formatMonthYear(startDate);
    const end = current ? 'Present' : formatMonthYear(endDate);
    
    return `${start} - ${end}`;
}

// Calculate duration
function calculateDuration(startDate, endDate, current) {
    const start = new Date(startDate);
    const end = current ? new Date() : new Date(endDate);
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
        return `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
    } else if (remainingMonths === 0) {
        return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else {
        return `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
    }
}

// Render loading state for LinkedIn sections
function showLinkedInLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Loading LinkedIn data...</p>
            </div>
        `;
    }
}

// Render error state for LinkedIn sections
function showLinkedInError(elementId, message = 'Failed to load LinkedIn data') {
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

// Render employment experience
async function renderEmployment(elementId) {
    showLinkedInLoading(elementId);
    
    try {
        const data = await fetchLinkedInData();
        const element = document.getElementById(elementId);
        if (!element) return;
        
        if (!data.employment || data.employment.length === 0) {
            element.innerHTML = '<p class="text-center">No employment data available.</p>';
            return;
        }
        
        const employmentHTML = data.employment.map(job => `
            <div class="glass-card linkedin-card" data-aos="fade-up">
                <div class="linkedin-card-header">
                    <div class="linkedin-logo">
                        ${job.logo ? `<img src="${job.logo}" alt="${job.company} logo" onerror="this.style.display='none'">` : '<i class="fas fa-building"></i>'}
                    </div>
                    <div class="linkedin-card-info">
                        <h3 class="linkedin-title">${job.position}</h3>
                        <div class="linkedin-company">${job.company}</div>
                        <div class="linkedin-meta">
                            <span>${formatDateRange(job.startDate, job.endDate, job.current)}</span>
                            <span class="linkedin-separator">•</span>
                            <span>${calculateDuration(job.startDate, job.endDate, job.current)}</span>
                        </div>
                        ${job.location ? `<div class="linkedin-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</div>` : ''}
                    </div>
                </div>
                ${job.description ? `<p class="linkedin-description">${job.description}</p>` : ''}
            </div>
        `).join('');
        
        element.innerHTML = `<div class="linkedin-list fade-in">${employmentHTML}</div>`;
    } catch (error) {
        showLinkedInError(elementId, 'Failed to load employment data');
    }
}

// Render education
async function renderEducation(elementId) {
    showLinkedInLoading(elementId);
    
    try {
        const data = await fetchLinkedInData();
        const element = document.getElementById(elementId);
        if (!element) return;
        
        if (!data.education || data.education.length === 0) {
            element.innerHTML = '<p class="text-center">No education data available.</p>';
            return;
        }
        
        const educationHTML = data.education.map(edu => `
            <div class="glass-card linkedin-card" data-aos="fade-up">
                <div class="linkedin-card-header">
                    <div class="linkedin-logo">
                        ${edu.logo ? `<img src="${edu.logo}" alt="${edu.institution} logo" onerror="this.style.display='none'">` : '<i class="fas fa-graduation-cap"></i>'}
                    </div>
                    <div class="linkedin-card-info">
                        <h3 class="linkedin-title">${edu.institution}</h3>
                        <div class="linkedin-company">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                        <div class="linkedin-meta">
                            <span>${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}</span>
                        </div>
                    </div>
                </div>
                ${edu.description ? `<p class="linkedin-description">${edu.description}</p>` : ''}
            </div>
        `).join('');
        
        element.innerHTML = `<div class="linkedin-list fade-in">${educationHTML}</div>`;
    } catch (error) {
        showLinkedInError(elementId, 'Failed to load education data');
    }
}

// Export functions for use in HTML
window.LinkedInAPI = {
    fetchLinkedInData,
    renderEmployment,
    renderEducation,
    formatDateRange,
    calculateDuration
};
