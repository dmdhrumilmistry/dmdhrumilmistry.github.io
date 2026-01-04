# LinkedIn Data Integration Guide

This guide explains how to update your employment and education information that displays dynamically on your portfolio website.

## Overview

The portfolio now includes dynamic Employment and Education sections that are populated from a JSON data file. This approach provides flexibility while respecting LinkedIn's Terms of Service.

## Important Note

LinkedIn does not provide a public API for fetching user profile data without authentication. Web scraping LinkedIn violates their Terms of Service. This implementation uses a local JSON file that you can manually update with your LinkedIn information.

## How It Works

1. **Data Storage**: Employment and education data is stored in `assets/data/linkedin-data.json`
2. **Dynamic Loading**: The JavaScript module `assets/js/linkedin-api.js` fetches and renders the data
3. **Caching**: Data is cached in localStorage for 1 hour to improve performance
4. **Responsive Design**: The sections are fully responsive and match the portfolio's modern design

## Updating Your Information

### Manual Update (Recommended)

Edit the file `assets/data/linkedin-data.json` with your actual employment and education details:

```json
{
  "profile": {
    "name": "Your Name",
    "headline": "Your Professional Headline",
    "profileUrl": "https://www.linkedin.com/in/your-profile/"
  },
  "employment": [
    {
      "company": "Company Name",
      "position": "Your Position",
      "location": "City, Country or Remote",
      "startDate": "2023-01",
      "endDate": null,
      "current": true,
      "description": "Brief description of your role and responsibilities.",
      "logo": "https://path-to-company-logo.png"
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "2019",
      "endDate": "2023",
      "current": false,
      "description": "Brief description of your studies and achievements.",
      "logo": "https://path-to-university-logo.png"
    }
  ],
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Data Fields Explanation

#### Employment Fields:
- `company` (required): Company name
- `position` (required): Your job title
- `location` (optional): Work location (e.g., "Remote", "San Francisco, CA")
- `startDate` (required): Start date in YYYY-MM format
- `endDate` (optional): End date in YYYY-MM format (null if current)
- `current` (required): Boolean indicating if this is your current job
- `description` (optional): Brief description of your role
- `logo` (optional): URL to company logo image (80x80px recommended)

#### Education Fields:
- `institution` (required): School/University name
- `degree` (required): Degree name (e.g., "Bachelor of Science")
- `field` (optional): Field of study (e.g., "Computer Science")
- `startDate` (required): Start year (YYYY format)
- `endDate` (required): End year or "Present" for current
- `current` (required): Boolean indicating if currently enrolled
- `description` (optional): Brief description of studies
- `logo` (optional): URL to institution logo (80x80px recommended)

## Adding Multiple Entries

You can add multiple employment experiences and education entries. Just add more objects to the arrays:

```json
{
  "employment": [
    {
      "company": "Current Company",
      "position": "Senior Developer",
      "current": true,
      ...
    },
    {
      "company": "Previous Company",
      "position": "Junior Developer",
      "current": false,
      ...
    }
  ]
}
```

## Logo Images

For best results with logos:
- Use square images (80x80px recommended)
- Use transparent PNG or high-quality JPG
- Host images reliably (company websites, LinkedIn CDN, or your own assets)
- If logo fails to load, a fallback icon will display automatically

## Testing Changes

1. Edit `assets/data/linkedin-data.json` with your information
2. Clear your browser cache or localStorage (F12 → Application → Local Storage → Clear)
3. Refresh the About page to see your changes

## Cache Management

The data is cached for 1 hour to improve performance. To clear the cache:

**Browser Console:**
```javascript
localStorage.removeItem('linkedin_profile_data');
```

Or simply wait 1 hour for automatic cache expiration.

## Future Enhancements

If LinkedIn ever provides a public API or you set up a backend service, you can:
1. Update the `LINKEDIN_DATA_URL` in `assets/js/linkedin-api.js`
2. Point it to your API endpoint
3. The rest of the code will work automatically

## Styling

The LinkedIn sections use these CSS classes (in `assets/css/modern-style.css`):
- `.linkedin-card` - Main card container
- `.linkedin-card-header` - Header with logo and title
- `.linkedin-logo` - Logo container
- `.linkedin-title` - Job title or degree
- `.linkedin-company` - Company or institution name
- `.linkedin-description` - Description text

## Troubleshooting

**Data not showing:**
- Check browser console for errors
- Verify JSON syntax is valid
- Clear localStorage cache
- Check file path is correct

**Images not loading:**
- Verify image URLs are accessible
- Check CORS settings if using external images
- Use placeholder images for testing

**Layout issues:**
- Check that JSON structure matches the expected format
- Verify all required fields are present
- Test on different screen sizes

## Support

For issues or questions:
1. Check browser console for error messages
2. Validate your JSON at jsonlint.com
3. Review this documentation
4. Check the example data structure provided

---

**Note:** Remember to update the `lastUpdated` field whenever you modify your data to track when information was last refreshed.
